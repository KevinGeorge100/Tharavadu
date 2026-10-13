# Project status — October 13, 2026

Tharavadu has an integrated, local-first MVP through THAR-012. The live Next.js workspace connects to FastAPI for accounts, families, proposals, graph exploration, kinship trails, memories, and corrections. The demo remains available without an account.

| Area | Verified state | Boundary |
| --- | --- | --- |
| Backend | 109 passing Python tests, including local HTTP integration flows | Live PostgreSQL and Neo4j integration not run |
| Frontend | Typecheck, ESLint, and production build pass | No Firefox or WebKit run |
| Browser | 15 Playwright cases pass at 1280×800, 1920×1080, and 390×844, using a disposable SQLite backend and offline provider | Chromium/Chrome only; cross-browser coverage remains future work |
| Narrative | Offline proposal, human review, homonym resolution, confirmation, discard, stale revision handling | Offline grammar is limited; live OpenAI smoke not run without a key |
| Kinship | Deterministic Python classifications and evidence trail shown in the UI | No model-generated relationship truth |
| Memories | Create, list, delete, persistence, family isolation | Text memories; no file attachments |
| Corrections | Edit person, remove edge, remove person in local mode | Neo4j person deletion returns 501 until cross-store atomicity is solved |
| CI | Workflow added for backend, frontend, and E2E on PR/push to main; the THAR-011 main run succeeded | THAR-012 hosted run result should be checked separately |
| Containers | Local SQLite Compose configuration passes static validation | Docker Engine runtime verification pending |

The app is suitable for local evaluation and contribution. Production deployment still needs migration tooling, external database integration tests, shared rate limiting for multiple workers, operational backup/restore guidance, and broader browser testing. See [ADR-0004](adr/ADR-0004-person-removal-memory-retention.md) for memory behavior on person removal.
