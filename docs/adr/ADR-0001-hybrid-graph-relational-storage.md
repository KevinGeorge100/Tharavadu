# ADR-0001: Dual-Engine Graph & Relational Persistence Pattern

- **Status:** ACCEPTED
- **Date:** 2026-09-21
- **Deciders:** Human Project Lead & Engineering Team

## Context & Problem Statement
KIN requires storing both standard relational entity metadata (user accounts, authentication sessions, family ownership, staging proposals, and memory logs) and complex, cyclic-sensitive genealogical graphs (people, parentage, marriages, siblings). A single database engine either lacks native property graph traversal semantics or adds operational friction for simple relational and session queries.

## Decision Drivers
- Need for low-friction local development without requiring external server daemons.
- Need for native property graph traversal and atomic graph transactions in production.
- Clear separation between relational session data and genealogical graph state.

## Considered Options
1. Single Relational Database (PostgreSQL with recursive CTEs or SQLite).
2. Pure Graph Database (Neo4j for both metadata, auth, and graph).
3. Hybrid Dual-Engine Architecture (SQL for metadata + pluggable Graph repository supporting SQLite snapshot in local dev and Neo4j in production).

## Decision Outcome
Chosen option: **Option 3: Hybrid Dual-Engine Architecture**.

- In development (`GRAPH_BACKEND=local`), relational metadata and serialized graph snapshots reside in SQLite (`kin.db`).
- In production (`GRAPH_BACKEND=neo4j`), PostgreSQL stores relational metadata while Neo4j stores the property graph.
- Mutations use optimistic revisions (`revision: int`). Empty family creation is compensatable; failed graph creation deletes SQL metadata. No distributed 2PC transaction is assumed.

### Positive Consequences
- Developers can clone and run KIN immediately using built-in SQLite without installing Docker or Neo4j.
- Production gains native Cypher property graph querying with explicit family root locking.

### Negative Consequences / Tradeoffs
- Codebase must maintain two implementations of `GraphRepository` (`LocalGraphRepository` and `Neo4jGraphRepository`).
- Full-graph replacement in Neo4j during MVP writes the whole family subgraph on each revision.
