import json
from uuid import uuid4

from sqlalchemy import JSON, Column, Float, Integer, MetaData, String, Table, Text, create_engine, select, update

from .domain import Conflict, validate
from .schemas import Edge, Graph, Person

metadata = MetaData()
users = Table("users", metadata, Column("id", String, primary_key=True), Column("email", String, unique=True), Column("password", String))
sessions = Table("sessions", metadata, Column("id", String, primary_key=True), Column("user_id", String, index=True), Column("expires", Float))
families = Table("families", metadata, Column("id", String, primary_key=True), Column("name", String), Column("owner", String, index=True), Column("self_id", String))
proposals = Table("proposals", metadata, Column("id", String, primary_key=True), Column("family_id", String, index=True), Column("revision", Integer), Column("extraction", JSON), Column("status", String), Column("created", Float))
memories = Table("memories", metadata, Column("id", String, primary_key=True), Column("family_id", String, index=True), Column("author", String), Column("text", Text), Column("people", JSON), Column("created", Float))
snapshots = Table("local_graphs", metadata, Column("family_id", String, primary_key=True), Column("revision", Integer), Column("data", JSON))


def uid():
    return str(uuid4())


class Database:
    def __init__(self, url):
        self.engine = create_engine(url, connect_args={"check_same_thread": False} if url.startswith("sqlite") else {}, pool_pre_ping=True)

    def initialize(self):
        metadata.create_all(self.engine)

    def one(self, statement):
        with self.engine.connect() as conn:
            row = conn.execute(statement).mappings().first()
            return dict(row) if row else None

    def all(self, statement):
        with self.engine.connect() as conn:
            return [dict(row) for row in conn.execute(statement).mappings()]

    def execute(self, statement):
        with self.engine.begin() as conn:
            return conn.execute(statement)


class LocalGraphRepository:
    def __init__(self, db):
        self.db = db

    def initialize(self):
        pass

    def read(self, family_id):
        row = self.db.one(select(snapshots).where(snapshots.c.family_id == family_id))
        return Graph.model_validate(row["data"]) if row else Graph()

    def save(self, family_id, graph, expected):
        graph.revision = expected + 1
        data = graph.model_dump(mode="json")
        with self.db.engine.begin() as conn:
            if expected == -1:
                conn.execute(snapshots.insert().values(family_id=family_id, revision=0, data=data))
            else:
                result = conn.execute(update(snapshots).where(snapshots.c.family_id == family_id, snapshots.c.revision == expected).values(revision=graph.revision, data=data))
                if result.rowcount != 1:
                    raise Conflict("The graph changed. Refresh and review a new proposal.")
        return graph

    def delete(self, family_id):
        self.db.execute(snapshots.delete().where(snapshots.c.family_id == family_id))

    def add_memory(self, memory, expected):
        with self.db.engine.begin() as conn:
            locked = conn.execute(update(snapshots).where(
                snapshots.c.family_id == memory["family_id"], snapshots.c.revision == expected
            ).values(revision=expected))
            if locked.rowcount != 1:
                raise Conflict("The family changed. Refresh before keeping this memory.")
            conn.execute(memories.insert().values(**memory))

    def remove_person(self, family_id, person_id, expected):
        graph = self.read(family_id)
        if not any(person.id == person_id for person in graph.people):
            raise Conflict("Person not found in this family")
        graph.people = [person for person in graph.people if person.id != person_id]
        graph.edges = [edge for edge in graph.edges if person_id not in (edge.source, edge.target)]
        validate(graph)
        graph.revision = expected + 1
        with self.db.engine.begin() as conn:
            result = conn.execute(update(snapshots).where(
                snapshots.c.family_id == family_id, snapshots.c.revision == expected
            ).values(revision=graph.revision, data=graph.model_dump(mode="json")))
            if result.rowcount != 1:
                raise Conflict("The graph changed. Refresh before removing this person.")
            rows = conn.execute(select(memories).where(memories.c.family_id == family_id)).mappings()
            for memory in rows:
                if person_id in memory["people"]:
                    conn.execute(update(memories).where(memories.c.id == memory["id"]).values(
                        people=[person for person in memory["people"] if person != person_id]
                    ))
        return graph

    def close(self):
        pass


class Neo4jGraphRepository:
    def __init__(self, settings):
        from neo4j import GraphDatabase
        self.driver = GraphDatabase.driver(settings.neo4j_uri, auth=(settings.neo4j_user, settings.neo4j_password))

    def initialize(self):
        self.driver.verify_connectivity()
        with self.driver.session() as session:
            session.run("CREATE CONSTRAINT kin_family IF NOT EXISTS FOR (f:Family) REQUIRE f.id IS UNIQUE").consume()
            session.run("CREATE CONSTRAINT kin_person IF NOT EXISTS FOR (p:Person) REQUIRE (p.family_id, p.id) IS UNIQUE").consume()

    def read(self, family_id):
        def read_tx(tx):
            root = tx.run("MATCH (f:Family {id:$id}) RETURN f.revision AS revision, f.applied AS applied", id=family_id).single()
            if not root:
                return Graph()
            people = [Person.model_validate(json.loads(r["data"])) for r in tx.run("MATCH (p:Person {family_id:$id}) RETURN p.data AS data", id=family_id)]
            edges = [Edge(source=r["source"], target=r["target"], type=r["type"]) for r in tx.run("MATCH (a:Person {family_id:$id})-[r:KIN]->(b:Person {family_id:$id}) RETURN a.id AS source,b.id AS target,r.kind AS type", id=family_id)]
            return Graph(people=people, edges=edges, revision=root["revision"], applied=root["applied"] or [])
        with self.driver.session() as session:
            return session.execute_read(read_tx)

    def save(self, family_id, graph, expected):
        def write_tx(tx):
            root = tx.run("MERGE (f:Family {id:$id}) ON CREATE SET f.revision=-1 SET f.lock=coalesce(f.lock,0)+1 RETURN f.revision AS revision", id=family_id).single()
            if root["revision"] != expected:
                raise Conflict("The graph changed. Refresh and review a new proposal.")
            tx.run("MATCH (p:Person {family_id:$id}) DETACH DELETE p", id=family_id).consume()
            tx.run("UNWIND $people AS person CREATE (:Person {family_id:$id,id:person.id,data:person.data})", id=family_id, people=[{"id": p.id, "data": p.model_dump_json()} for p in graph.people]).consume()
            tx.run("UNWIND $edges AS edge MATCH (a:Person {family_id:$id,id:edge.source}),(b:Person {family_id:$id,id:edge.target}) CREATE (a)-[:KIN {kind:edge.type}]->(b)", id=family_id, edges=[e.model_dump() for e in graph.edges]).consume()
            tx.run("MATCH (f:Family {id:$id}) SET f.revision=$revision,f.applied=$applied", id=family_id, revision=expected+1, applied=graph.applied).consume()
        with self.driver.session() as session:
            session.execute_write(write_tx)
        graph.revision = expected + 1
        return graph

    def delete(self, family_id):
        with self.driver.session() as session:
            session.execute_write(lambda tx: tx.run("MATCH (n) WHERE (n:Person AND n.family_id=$id) OR (n:Family AND n.id=$id) DETACH DELETE n", id=family_id).consume())

    def close(self):
        self.driver.close()
