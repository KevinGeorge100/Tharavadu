# ADR-0003: Pure-Python Deterministic Kinship Reasoning

- **Status:** ACCEPTED
- **Date:** 2026-09-21
- **Deciders:** Human Project Lead & Engineering Team

## Context & Problem Statement
Kinship terminology (e.g. "first cousin once removed", "maternal granduncle") follows mathematically rigorous genealogical graph traversal rules. Delegating kinship reasoning, path finding, or relationship classification to an LLM produces non-deterministic, hallucinated, or culturally conflicting outputs with no verifiable evidence chain.

## Decision Drivers
- Need for 100% deterministic, verifiable relationship calculations.
- Verifiable evidence path required for user trust.
- Zero latency and zero API cost for relationship queries.

## Considered Options
1. LLM-based reasoning (send graph to LLM prompt and ask for relationship).
2. Pure-Python BFS graph traversal with canonical kinship step classification.

## Decision Outcome
Chosen option: **Option 2: Pure-Python BFS graph traversal**.

- Graph traversal in `backend/app/domain.py` explores paths using directional step labels:
  - `U`: Up (parent)
  - `D`: Down (child)
  - `S`: Sibling
  - `W`: Spouse
- Canonical steps are classified mathematically (degrees of cousins, removed generations, great-grandparents, in-laws) and generate human-readable evidence strings.
- Natural language questions in `backend/app/queries.py` parse queries using regex and delegate to deterministic reasoning.
- **No LLM is called during relationship queries or graph traversal.**

### Positive Consequences
- Instant, deterministic, reproducible responses.
- Generates exact step-by-step evidence explanations.
- Zero ongoing inference costs or API dependencies for querying family relationships.
