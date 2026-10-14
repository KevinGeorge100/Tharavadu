# Project status — October 14, 2026

Tharavadu has an integrated, local-first release-candidate MVP on the THAR-014 task branch. The live Next.js workspace connects to FastAPI for accounts, families, proposals, graph exploration, kinship trails, memories, and corrections. The demo remains available without an account.

| Area | Verified state | Boundary |
| --- | --- | --- |
| Backend | 109 passing Python tests, including local HTTP integration flows | Live PostgreSQL and Neo4j integration not run |
| Frontend | Typecheck, ESLint, and production build pass | No Firefox or WebKit run |
| Browser | 30 Playwright cases pass: full product journeys at 1280×800, 1920×1080, and 390×844, plus responsive, composer, and keyboard checks at those sizes and 768×1024 and 1440×900; 15 final-state screenshots reviewed | Chromium/Chrome only; cross-browser coverage remains future work |
| Narrative | Offline proposal, human review, homonym resolution, confirmation, discard, stale revision handling | Offline grammar is limited; live OpenAI smoke not run without a key |
| Kinship | Deterministic Python classifications and evidence trail shown in the UI | No model-generated relationship truth |
| Memories | Create, list, delete, persistence, family isolation | Text memories; no file attachments |
| Corrections | Edit person, remove edge, remove person in local mode | Neo4j person deletion returns 501 until cross-store atomicity is solved |
| CI | Backend, frontend, and E2E workflows passed on `main` through THAR-013 (`f9324fb`) | THAR-014 branch has not been validated by hosted CI yet |
| Containers | Clean Compose build and live browser journey pass; SQLite graph and memory survive restart and container recreation on the named volume; `down -v` clears the account and allows fresh registration | Local Compose evaluation only, not a production deployment test |

The app is suitable for local evaluation and contribution. Production deployment still needs migration tooling, external database integration tests, shared rate limiting for multiple workers, operational backup/restore guidance, and broader browser testing. See [ADR-0004](adr/ADR-0004-person-removal-memory-retention.md) for memory behavior on person removal.
