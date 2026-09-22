# KIN — Project Status & Reality Assessment

**Status as of:** September 2026  
**Engineering Baseline Assessment:** Initial Audit & Governance Bootstrap  
**Classification:** FUNCTIONAL PROTOTYPE (Backend Only) / SKELETON (Frontend)

---

## 1. Executive Summary

KIN is an AI-assisted personal genealogy and kinship reasoning system designed to capture family narratives, extract genealogical relations into structured proposals, resolve identity ambiguities with human oversight, and maintain an immutable, cycle-free family graph with deterministic reasoning.

The repository currently exhibits a significant asymmetry:
- **Backend (`backend/app/`):** Contains a tightly scoped, functioning prototype implementation of deterministic kinship reasoning (`domain.py`, `queries.py`), schema validation (`schemas.py`), dual AI extraction providers (`ai.py` supporting offline regex and OpenAI structured outputs), dual graph backends (`database.py` supporting SQLite snapshot and Neo4j atomic graph replacement), and session-based FastAPI endpoints (`main.py`).
- **Frontend (`frontend/`):** Contains only package and build tooling manifests (`package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `node_modules`). **No application source files (pages, components, layouts, styles) exist.** Running `next build` fails immediately.
- **Testing & Quality Assurance:** Deterministic domain unit test suite established (88 tests in `backend/tests/`, 100% passing). API integration tests and Playwright E2E tests are not yet configured.
- **Git State:** Newly initialized Git repository with active development branches off `main`.

---

## 2. Product Maturity Assessment

| Dimension | Assessment | Evidence |
| :--- | :--- | :--- |
| **Overall Maturity** | **FUNCTIONAL PROTOTYPE (Backend) / SKELETON (Frontend)** | Backend logic imports and handles API lifecycles; frontend UI is completely unwritten; backend domain test coverage is 100%. |
| **Domain Logic** | **FUNCTIONAL PROTOTYPE** | Kinship classification, ancestry cycle detection, and identity resolution algorithms are fully codified in Python and covered by 88 unit tests. |
| **AI Integration** | **PARTIALLY IMPLEMENTED / PROPOSAL-ONLY** | Dual extraction paths exist (offline regex and OpenAI structured outputs). Both produce `Extraction` proposals; direct write access to the graph is prohibited by design. |
| **Persistence** | **FUNCTIONAL PROTOTYPE (Local) / UNVERIFIED (Neo4j/Postgres)** | SQLite schema initialization and local snapshot storage work; Neo4j repository code exists but lacks integration test coverage. |
| **Frontend UI** | **NOT IMPLEMENTED / SKELETON** | No `app/` or `pages/` directory exists. Dependencies (`@xyflow/react`, `lucide-react`, `next`, `react`) are installed in `node_modules` but unrendered. |
| **Automated Testing** | **FUNCTIONAL PROTOTYPE (Backend Domain)** | 88 pytest unit tests pass covering validation, cycle detection, kinship classification, queries, and schemas. E2E tests unconfigured. |

---

## 3. Feature Reality Matrix

The following matrix distinguishes between code existence, automated testing, integration validation, and production validation:

| Capability | Status | Implementation File(s) | Verification Level | Notes & Blockers |
| :--- | :--- | :--- | :--- | :--- |
| **User Authentication & Session Management** | IMPLEMENTED (Unverified) | `backend/app/main.py`<br>`backend/app/database.py` | Code Exists | Scrypt password hashing with salt; HttpOnly session cookies; stored in SQL table. Lacks automated tests. |
| **Family Workspace Scoping & Authorization** | IMPLEMENTED (Unverified) | `backend/app/main.py` | Code Exists | Multi-tenant isolation verified by `family_access` dependency checking `owner == user_id`. |
| **Kinship Traversal & Classification** | IMPLEMENTED (Unit Tested) | `backend/app/domain.py` | Automated Unit Tests | Pure Python deterministic BFS with degree/removed cousin calculations, in-laws, and ancestors. Verified by 88 tests. |
| **Ancestry Cycle & Sibling Invariant Checks** | IMPLEMENTED (Unit Tested) | `backend/app/domain.py` | Automated Unit Tests | Detects self-ancestry cycles and sibling-as-ancestor contradictions via DFS/BFS validation. |
| **Offline NLP Extraction** | IMPLEMENTED (Unverified) | `backend/app/ai.py` | Code Exists | Regex-based parser for basic English statements. Fails closed with `ProviderError` for unsupported syntax. |
| **OpenAI Structured Extraction** | IMPLEMENTED (Unverified) | `backend/app/ai.py` | Code Exists | Uses `client.responses.parse` with strict Extraction schema. Requires `OPENAI_API_KEY`. Unverified against live API. |
| **Identity Resolution & Disambiguation** | IMPLEMENTED (Unit Tested) | `backend/app/domain.py`<br>`backend/app/main.py` | Automated Unit Tests | Flags homonyms as candidate choices; requires human resolution before confirming proposal. Tested against silent merges. |
| **Proposal Review & Application Lifecycle** | IMPLEMENTED (Unverified) | `backend/app/main.py` | Code Exists | Proposals staged in SQL; applied atomically to graph with revision tracking and idempotency checks. |
| **Kinship Natural Language Query Engine** | IMPLEMENTED (Unit Tested) | `backend/app/queries.py` | Automated Unit Tests | Handles structured questions ("Who is X to Y", "Show my cousins", descendants). Tested in test_queries.py. |
| **Family Memory Journal** | IMPLEMENTED (Unverified) | `backend/app/main.py`<br>`backend/app/database.py` | Code Exists | CRUD operations for family stories linked to graph person IDs. Case-insensitive substring query. |
| **Demo Family Seed Generation** | IMPLEMENTED (Unverified) | `backend/app/seed.py` | Code Exists | Generates 8-person fictional family (George, Anna, Joseph, Leena, etc.). |
| **Local Graph Snapshot Storage** | IMPLEMENTED (Unverified) | `backend/app/database.py` | Code Exists | Stores serialized JSON graph snapshot in `local_graphs` SQL table with optimistic revision check. |
| **Neo4j Graph Repository** | IMPLEMENTED (Unverified) | `backend/app/database.py` | Code Exists | Full atomic graph replacement using Neo4j write transaction and family root locking. Untested against live Neo4j. |
| **Frontend Web Workspace & UI** | NOT IMPLEMENTED | `frontend/` | Missing | No React components, layout, or pages exist. `next build` fails. |
| **Frontend Interactive Graph Visualization** | PLANNED | `frontend/package.json` | Dependencies Only | `@xyflow/react` and `@dagrejs/dagre` installed; UI code not started. |
| **Automated End-to-End Tests** | NOT CONFIGURED | `frontend/` | Missing | Playwright installed in `package.json`; no test suites written. |

---

## 4. Engineering Baseline Summary

### Validation Commands & Results

| Tool / Check | Command Executed | Result | Exit Code | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Backend Import** | `python -c "import app.main"` | **PASS** | 0 | All Python modules compile and initialize FastAPI app without runtime errors. |
| **Backend Unit Tests** | `pytest` | **PASS** | 0 | 88 items collected, 88 passed across domain, kinship, query, and schema test modules. |
| **Backend Lint** | `ruff check backend` | **PASS** | 0 | All checks passed with zero errors/warnings (configured via pyproject.toml). |
| **Backend Typecheck** | `mypy` / `pyright` | **NOT CONFIGURED** | N/A | No typechecker configuration or dependency installed. |
| **Frontend Typecheck** | `npm run typecheck` (`tsc --noEmit`) | **PASS** | 0 | No `.ts`/`.tsx` application files present to fail. |
| **Frontend Lint** | `npm run lint` (`eslint .`) | **PASS (Warning)** | 0 | Warns: "Pages directory cannot be found at pages or src/pages". |
| **Frontend Build** | `npm run build` (`next build`) | **FAIL** | 1 | "Couldn't find any 'pages' or 'app' directory. Please create one under the project root". |
| **Frontend E2E Tests** | `npm test` (`playwright test`) | **FAIL (No tests)** | 1 | "Error: No tests found". |

---

## 5. Security & Risk Register

| Risk ID | Severity | Area | Description | Remediation |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | **MEDIUM** | Rate Limiting | `rate_limit()` in `backend/app/main.py` uses an in-memory dictionary keyed by client IP (`attempts = {}`). In multi-worker or restarted environments, limits are bypassed. IP spoofing possible behind proxies if `request.client.host` is trusted without validated headers. | Introduce Redis/database-backed rate limiting or edge proxy enforcement before production multi-worker deployment. |
| **SEC-02** | **MEDIUM** | Session Expiration & Invalidation | Expired sessions are not automatically pruned from the `sessions` SQL table on a schedule. Session IDs are SHA-256 hashed, which is good practice. | Implement a periodic cleanup job or DB trigger for expired sessions. |
| **SEC-03** | **LOW** | Client Request Header Spoofing | CSRF safeguard relies on `x-kin-client: web` and `Origin` header matching `config.app_origin`. If behind misconfigured reverse proxies, `Origin` header checks require strict normalization. | Validate proxy configuration and enforce SameSite cookies on all deployment targets. |
| **SEC-04** | **LOW** | Secret Configuration Defaults | Default configuration in `config.py` sets empty strings for `neo4j_password` and `openai_api_key`. While secure by default (fails closed), production setups must fail fast on startup if required credentials are empty. | Add startup configuration validation in `lifespan` when provider is set to `openai` or `neo4j`. |

---

## 6. Technical Debt Register

1. **Test Infrastructure [RESOLVED for Domain in KIN-002]:** Established 88 unit tests in `backend/tests/` covering domain logic, kinship classifications, queries, and schemas. API integration tests remain for KIN-005.
2. **Missing Frontend Source:** Frontend package has installed heavy dependencies (`@xyflow/react`, `lucide-react`, `next`, `react`) but has no scaffolding, pages, components, or test harnesses. Scheduled for KIN-004.
3. **Lint Configuration Gap [RESOLVED in KIN-001]:** Configured `extend-immutable-calls = ["fastapi.Depends", "fastapi.params.Depends"]` in `pyproject.toml` and migrated regex aliases to `re.IGNORECASE`.
4. **Graph Replacement Strategy in Neo4j:** `Neo4jGraphRepository.save()` executes a full `MATCH (p:Person) DETACH DELETE p` and reconstructs all nodes and edges per commit. While capped at 500 nodes for MVP, this approach creates large write transactions and churn in Neo4j transaction logs.
5. **No Migration Tooling:** Schema is declared via SQLAlchemy Table objects and created with `metadata.create_all()`. No Alembic migration scripts exist for evolving database schemas.
6. **Developer Setup & Environment [RESOLVED in KIN-003]:** Created `.env.example` template and comprehensive root `README.md` documenting zero-dependency local SQLite mode and optional external service integrations.

---

## 7. Infrastructure & Deployment State

- **Current Environment:** Windows local workstation (`powershell`). Python virtual environment active at `.venv/` (Python 3.14.7). Node.js v24.20.0 and npm 11.19.0.
- **Databases:** SQLite configured as default `database_url = "sqlite:///./kin.db"`. No PostgreSQL or Neo4j containers currently running.
- **Docker / Compose:** No `docker-compose.yml` or `Dockerfile` present in repository despite references in `docs/ARCHITECTURE.md`.
- **CI/CD:** No GitHub Actions or automated workflow files exist (`.github/` directory missing).
