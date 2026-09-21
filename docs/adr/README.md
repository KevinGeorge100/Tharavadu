# Architecture Decision Records (ADRs)

This directory contains the Architecture Decision Records for KIN. ADRs document significant architectural decisions, their business and technical context, alternatives considered, and their consequences.

---

## When is an ADR Required?

An ADR is **mandatory** for any change involving:
1. **Persistence & Database Replacement:** Switching or altering the primary database engines (e.g., PostgreSQL, SQLite, Neo4j, or alternative graph stores).
2. **Authentication & Session Strategy:** Altering the session cookie model, JWTs, OAuth2 providers, or identity federation.
3. **Framework & Runtime Changes:** Migrating frontend or backend web frameworks, major version upgrades, or runtime engine modifications.
4. **AI/LLM Provider & Orchestration:** Changing the primary AI provider, prompt formatting schema, structured extraction protocol, or model tiering.
5. **Security Model & Boundaries:** Adjusting CSRF protections, CORS origins, encryption standards, or tenant isolation policies.
6. **API Contracts & Compatibility:** Breaking changes to the `/api/` REST surface or data interchange format.
7. **Deployment Topology & Infrastructure:** Transitioning between standalone containers, Docker Compose, Kubernetes, or cloud managed services.

Do **NOT** write an ADR for trivial implementation details, bug fixes, UI styling tweaks, or minor refactors that do not cross architectural boundaries.

---

## ADR Process

1. **Format:** Each ADR is stored as a Markdown document named `ADR-XXXX-short-title.md` (e.g., `ADR-0001-hybrid-graph-relational-storage.md`).
2. **Lifecycle States:**
   - `PROPOSED`: Under team review and evaluation.
   - `ACCEPTED`: Approved by the human lead and active for implementation.
   - `REJECTED`: Considered but not adopted.
   - `SUPERSEDED`: Replaced by a newer ADR (must link to the superseding ADR).
3. **Template:** Use the standard structure below:

```markdown
# ADR-XXXX: [Title]

- **Status:** [PROPOSED | ACCEPTED | REJECTED | SUPERSEDED]
- **Date:** YYYY-MM-DD
- **Author:** [Author Name / Agent]
- **Deciders:** [Human Project Lead]

## Context & Problem Statement
What technical problem or architectural requirement motivates this decision? What constraints exist?

## Decision Drivers
- Driver 1
- Driver 2

## Considered Options
1. Option 1
2. Option 2

## Decision Outcome
Chosen option: "[Option]" because [justification].

### Positive Consequences
- ...

### Negative Consequences / Tradeoffs
- ...

## Pros and Cons of the Options
### [Option 1]
- Good: ...
- Bad: ...

### [Option 2]
- Good: ...
- Bad: ...
```

---

## ADR Index

| ADR ID | Title | Status | Date |
| :--- | :--- | :--- | :--- |
| **ADR-0001** | Dual-Engine Graph & Relational Persistence Pattern | ACCEPTED | 2026-09-21 |
| **ADR-0002** | Proposal-First AI Extraction with Human Confirmation | ACCEPTED | 2026-09-21 |
| **ADR-0003** | Pure-Python Deterministic Kinship Reasoning (No LLM in Reasoning Path) | ACCEPTED | 2026-09-21 |
