# ADR-0004: Preserve memories when removing a person

Status: Accepted for THAR-010 (user decision, 2026-10-09).

Removing a person removes only that person and incident graph edges. Relatives are never recursively removed. The family anchor is protected because narratives use its identity.

All memories remain in the family journal. Only the removed person's ID is detached from each memory's `people` list. Shared memories keep their other associations; memories with no remaining associations are family memories.

Local graph mode updates the graph revision and memory associations in one SQL transaction. Memory creation checks and locks the same graph revision before insertion, preventing insertion against a concurrently removed person. Stale requests make no changes.

The optional Neo4j mode has no cross-store transaction with SQL memory metadata. Person removal therefore returns an explicit unsupported-operation response in that mode without changing data. A future implementation needs a recoverable cross-store protocol before enabling it.

The UI describes these effects before deletion and does not promise undo.
