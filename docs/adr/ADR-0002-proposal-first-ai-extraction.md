# ADR-0002: Proposal-First AI Extraction with Human Confirmation

- **Status:** ACCEPTED
- **Date:** 2026-09-21
- **Deciders:** Human Project Lead & Engineering Team

## Context & Problem Statement
Natural language family narratives are inherently ambiguous, incomplete, and prone to homonyms (e.g., multiple relatives named "Joseph"). Allowing an LLM or NLP parser to directly mutate the family graph introduces risks of hallucinated ancestors, silent data corruption, or unintentional merging of distinct relatives.

## Decision Drivers
- High integrity and trust required for personal genealogy.
- AI must never have write access to canonical family state.
- Ambiguous homonyms must be surfaced for human resolution.

## Considered Options
1. Direct autonomous AI mutation (AI receives prompt and executes DB mutations).
2. Human-in-the-loop Proposal pattern (AI emits typed extraction proposal; staged in SQL; human reviews and confirms with explicit disambiguation).

## Decision Outcome
Chosen option: **Option 2: Human-in-the-loop Proposal pattern**.

- AI providers (`OfflineProvider` and `OpenAIProvider`) implement `AIProvider` Protocol with no persistence dependencies.
- Extracted entities and relationships are staged in the `proposals` SQL table with status `pending`.
- If homonyms exist, the API returns `candidates` requiring explicit `resolutions` mapping.
- Confirmation (`/confirm`) validates the proposal against current graph revision, resolves identities, checks domain invariants, increments revision, and marks proposal `confirmed`.

### Positive Consequences
- Prevents data corruption and unauthorized mutations.
- Homonyms are safely resolved with explicit human choice ("choose existing" vs "create new").
- Provides a persistent audit log of proposals.
