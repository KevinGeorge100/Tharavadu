# Tharavadu roadmap

The local-first MVP stack through THAR-012 is implemented. See [Project Status](PROJECT_STATUS.md) for verified checks and current limits. Roadmap entries are intentions, not shipped features.

## Completed

- KIN-001–004: backend baseline, domain tests, setup, and Living Heirloom canvas.
- THAR-005–008: HTTP integration tests, live frontend/backend connection, human-reviewed proposals, and deterministic kinship trails.
- THAR-009–010: family memories and safe corrections in local mode.
- THAR-011: isolated desktop/mobile browser journeys and GitHub Actions workflow.
- THAR-012: accurate release documentation, contributor templates, local Compose path, multi-viewport polish, and security/robustness review.

## Next priorities

1. Validate container startup and persistence on a host with Docker Engine; add an automated Compose smoke check if stable.
2. Add live PostgreSQL/Neo4j integration tests and decide atomic person-removal behavior in Neo4j mode. Keep local mode as the default.
3. Add operational hardening for public deployments: schema migrations, backup/restore guidance, shared rate limiting, and session cleanup.

Later work may include GEDCOM import/export, multilingual extraction, media attachments, and more browser engines. These are not part of the current MVP.
