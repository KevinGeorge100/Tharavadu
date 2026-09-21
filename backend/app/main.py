import hashlib
import hmac
import logging
import secrets
import time
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy import select, text
from sqlalchemy.exc import IntegrityError

from .ai import OfflineProvider, OpenAIProvider, ProviderError
from .config import Settings, settings
from .database import Database, LocalGraphRepository, Neo4jGraphRepository, families, memories, proposals, sessions, uid, users
from .domain import Conflict, relationship, resolve, validate
from .queries import answer
from .schemas import Confirm, Credentials, FamilyCreate, Graph, MemoryCreate, Person, PersonEdit, TextInput
from .seed import demo_graph

logger = logging.getLogger("kin")


def password_hash(password, salt=None):
    salt = salt or secrets.token_hex(16)
    digest = hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt), n=16384, r=8, p=1).hex()
    return salt + ":" + digest


def token_hash(token):
    return hashlib.sha256(token.encode()).hexdigest()


def create_app(config: Settings = settings, provider=None):
    db = Database(config.database_url)
    graph_repo = Neo4jGraphRepository(config) if config.graph_backend == "neo4j" else LocalGraphRepository(db)
    if config.graph_backend not in ("local", "neo4j") or config.ai_provider not in ("offline", "openai"):
        raise ValueError("Unsupported configured provider")

    @asynccontextmanager
    async def lifespan(app):
        db.initialize()
        graph_repo.initialize()
        yield
        graph_repo.close()
        db.engine.dispose()

    app = FastAPI(title="KIN API", version="0.1.0", lifespan=lifespan)
    app.state.db, app.state.graph = db, graph_repo
    attempts = {}

    @app.middleware("http")
    async def safeguards(request: Request, call_next):
        started = time.monotonic()
        if request.method not in ("GET", "HEAD", "OPTIONS"):
            if request.headers.get("x-kin-client") != "web" or request.headers.get("origin", config.app_origin) != config.app_origin:
                return JSONResponse({"detail": "Invalid request origin"}, status_code=403)
            if int(request.headers.get("content-length", 0)) > 100_000:
                return JSONResponse({"detail": "Request too large"}, status_code=413)
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Cache-Control"] = "no-store"
        # Route template rather than URL/query avoids logging names or family IDs.
        route = getattr(request.scope.get("route"), "path", "unknown")
        logger.info("request route=%s status=%s duration_ms=%d", route, response.status_code, (time.monotonic()-started)*1000)
        return response

    @app.exception_handler(Conflict)
    async def conflict_handler(request, exc):
        return JSONResponse({"detail": str(exc)}, status_code=409)

    @app.exception_handler(ProviderError)
    async def provider_handler(request, exc):
        return JSONResponse({"detail": str(exc)}, status_code=422 if config.ai_provider == "offline" else 503)

    @app.exception_handler(RequestValidationError)
    async def invalid_handler(request, exc):
        return JSONResponse({"detail": "Invalid input. Check field lengths, dates and required values."}, status_code=422)

    @app.exception_handler(Exception)
    async def failure_handler(request, exc):
        logger.error("request_failure type=%s", type(exc).__name__)
        return JSONResponse({"detail": "A service is unavailable. Your changes may not have saved; refresh before retrying."}, status_code=503)

    def current_user(request: Request):
        cookie = request.cookies.get("kin_session", "")
        row = db.one(select(sessions).where(sessions.c.id == token_hash(cookie), sessions.c.expires > time.time()))
        if not row:
            raise HTTPException(401, "Sign in to continue")
        return row["user_id"]

    def family_access(family_id: str, user_id=Depends(current_user)):
        family = db.one(select(families).where(families.c.id == family_id, families.c.owner == user_id))
        if not family:
            raise HTTPException(404, "Family not found")
        return family

    def session(response, user_id):
        token = secrets.token_urlsafe(32)
        db.execute(sessions.insert().values(id=token_hash(token), user_id=user_id, expires=time.time()+config.session_days*86400))
        response.set_cookie("kin_session", token, httponly=True, secure=config.cookie_secure, samesite="lax", max_age=config.session_days*86400, path="/")

    def rate_limit(request):
        ip = request.client.host if request.client else "unknown"
        now = time.time()
        # Single-process MVP limiter. Deploy an edge limiter before multi-worker hosting.
        for old in [k for k, values in attempts.items() if not values or values[-1] < now - 300]:
            attempts.pop(old, None)
        recent = [t for t in attempts.get(ip, []) if t > now - 300]
        if len(recent) >= 20:
            raise HTTPException(429, "Too many attempts. Try again in five minutes.")
        attempts[ip] = recent + [now]

    @app.get("/api/health")
    def health():
        db.one(select(text("1")))
        if config.graph_backend == "neo4j":
            graph_repo.driver.verify_connectivity()
        return {"status": "ok", "graph": config.graph_backend, "ai": config.ai_provider}

    @app.post("/api/auth/register")
    def register(body: Credentials, request: Request, response: Response):
        rate_limit(request)
        user_id = uid()
        try:
            db.execute(users.insert().values(id=user_id, email=body.email.casefold(), password=password_hash(body.password)))
        except IntegrityError:
            raise HTTPException(409, "Account cannot be created with that email") from None
        session(response, user_id)
        return {"id": user_id, "email": body.email.casefold()}

    @app.post("/api/auth/login")
    def login(body: Credentials, request: Request, response: Response):
        rate_limit(request)
        user = db.one(select(users).where(users.c.email == body.email.casefold()))
        candidate = password_hash(body.password, user["password"].split(":")[0] if user else "0"*32)
        if not user or not hmac.compare_digest(candidate, user["password"]):
            raise HTTPException(401, "Email or password is incorrect")
        session(response, user["id"])
        return {"id": user["id"], "email": user["email"]}

    @app.post("/api/auth/logout")
    def logout(request: Request, response: Response):
        db.execute(sessions.delete().where(sessions.c.id == token_hash(request.cookies.get("kin_session", ""))))
        response.delete_cookie("kin_session", path="/")
        return {"ok": True}

    @app.get("/api/me")
    def me(user_id=Depends(current_user)):
        return db.one(select(users.c.id, users.c.email).where(users.c.id == user_id))

    @app.get("/api/families")
    def list_families(user_id=Depends(current_user)):
        return db.all(select(families).where(families.c.owner == user_id))

    @app.post("/api/families", status_code=201)
    def create_family(body: FamilyCreate, user_id=Depends(current_user)):
        family = {"id": uid(), "name": body.name, "owner": user_id, "self_id": uid()}
        if body.demo and body.person_name in {"George", "Anna", "Joseph", "Leena", "Thomas", "Sara", "Raj", "Maya"}:
            raise HTTPException(422, "Choose a different self name for the fictional demo")
        graph = demo_graph(family["self_id"], body.person_name) if body.demo else Graph(people=[Person(id=family["self_id"], name=body.person_name)])
        db.execute(families.insert().values(**family))
        try:
            graph_repo.save(family["id"], validate(graph), -1)
        except Exception:
            db.execute(families.delete().where(families.c.id == family["id"]))
            raise
        return family

    @app.get("/api/families/{family_id}/graph")
    def get_graph(family=Depends(family_access)):
        return graph_repo.read(family["id"])

    @app.post("/api/families/{family_id}/proposals")
    def extract(body: TextInput, family=Depends(family_access)):
        graph = graph_repo.read(family["id"])
        extractor = provider or (OpenAIProvider(config) if config.ai_provider == "openai" else OfflineProvider())
        extraction = extractor.extract(body.text, graph, family["self_id"])
        _, candidates = resolve(extraction, graph, family["self_id"])
        proposal = {"id": uid(), "family_id": family["id"], "revision": graph.revision, "extraction": extraction.model_dump(), "status": "pending", "created": time.time()}
        db.execute(proposals.insert().values(**proposal))
        return {**proposal, "candidates": candidates}

    @app.post("/api/families/{family_id}/proposals/{proposal_id}/confirm")
    def confirm(proposal_id: str, body: Confirm, family=Depends(family_access)):
        proposal = db.one(select(proposals).where(proposals.c.id == proposal_id, proposals.c.family_id == family["id"]))
        if not proposal:
            raise HTTPException(404, "Proposal not found")
        graph = graph_repo.read(family["id"])
        if proposal_id in graph.applied:
            return graph
        if proposal["status"] != "pending" or proposal["created"] < time.time()-86400:
            raise Conflict("Proposal is closed or expired. Create a new proposal.")
        if proposal["revision"] != graph.revision:
            raise Conflict("The graph changed. Reinterpret your statement before saving.")
        updated, candidates = resolve(body.extraction, graph, family["self_id"], body.resolutions)
        if candidates:
            raise Conflict("Choose an identity for every ambiguous person before confirming")
        updated.applied.append(proposal_id)
        result = graph_repo.save(family["id"], updated, graph.revision)
        db.execute(proposals.update().where(proposals.c.id == proposal_id).values(status="confirmed"))
        return result

    @app.delete("/api/families/{family_id}/proposals/{proposal_id}")
    def reject(proposal_id: str, family=Depends(family_access)):
        db.execute(proposals.update().where(proposals.c.id == proposal_id, proposals.c.family_id == family["id"], proposals.c.status == "pending").values(status="rejected"))
        return {"ok": True}

    @app.put("/api/families/{family_id}/people/{person_id}")
    def edit_person(person_id: str, body: PersonEdit, revision: int, family=Depends(family_access)):
        graph = graph_repo.read(family["id"])
        if not any(p.id == person_id for p in graph.people):
            raise HTTPException(404, "Person not found")
        graph.people = [Person(id=person_id, **body.model_dump()) if p.id == person_id else p for p in graph.people]
        return graph_repo.save(family["id"], validate(graph), revision)

    @app.delete("/api/families/{family_id}/edges")
    def remove_edge(source: str, target: str, kind: str, revision: int, family=Depends(family_access)):
        graph = graph_repo.read(family["id"])
        graph.edges = [e for e in graph.edges if not (e.source == source and e.target == target and e.type == kind)]
        return graph_repo.save(family["id"], graph, revision)

    @app.get("/api/families/{family_id}/relationship")
    def get_relationship(source: str, target: str, family=Depends(family_access)):
        return relationship(graph_repo.read(family["id"]), source, target)

    @app.post("/api/families/{family_id}/query")
    def query(body: TextInput, family=Depends(family_access)):
        return answer(body.text, graph_repo.read(family["id"]), family["self_id"])

    @app.get("/api/families/{family_id}/memories")
    def list_memories(q: str = "", family=Depends(family_access)):
        rows = db.all(select(memories).where(memories.c.family_id == family["id"]).order_by(memories.c.created.desc()))
        return [r for r in rows if q.casefold() in r["text"].casefold()]

    @app.post("/api/families/{family_id}/memories", status_code=201)
    def add_memory(body: MemoryCreate, family=Depends(family_access)):
        ids = {p.id for p in graph_repo.read(family["id"]).people}
        if not set(body.people) <= ids:
            raise Conflict("Memory references a person outside this family")
        memory = {"id": uid(), "family_id": family["id"], "author": family["owner"], "text": body.text, "people": body.people, "created": time.time()}
        db.execute(memories.insert().values(**memory))
        return memory

    @app.delete("/api/families/{family_id}/memories/{memory_id}")
    def delete_memory(memory_id: str, family=Depends(family_access)):
        db.execute(memories.delete().where(memories.c.id == memory_id, memories.c.family_id == family["id"]))
        return {"ok": True}

    @app.delete("/api/families/{family_id}")
    def delete_family(family=Depends(family_access)):
        graph_repo.delete(family["id"])
        with db.engine.begin() as conn:
            conn.execute(memories.delete().where(memories.c.family_id == family["id"]))
            conn.execute(proposals.delete().where(proposals.c.family_id == family["id"]))
            conn.execute(families.delete().where(families.c.id == family["id"]))
        return {"ok": True}

    return app


app = create_app()
