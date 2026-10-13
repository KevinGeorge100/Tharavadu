# Contributing

Thanks for helping make family history easier to preserve. Start with an issue or a small, focused pull request. For behavior changes, describe the user journey and the data semantics before editing storage or graph rules.

1. Use the [README](README.md) to run the local SQLite and offline-provider setup. No paid service is needed.
2. Create a topic branch from `main`; keep commits focused and avoid real family data in fixtures, logs, or screenshots.
3. Keep language interpretation in the AI providers, graph truth and kinship reasoning in Python, and human confirmation between them. Preserve family ownership checks, revision conflicts, and origin/session controls.
4. Run `python -m ruff check backend`, `python -m pytest backend/tests -q`, then in `frontend/` run `npm run typecheck`, `npm run lint`, `npm run build`, and `npm test` for user-facing changes.
5. Open a pull request using the template. Explain what changed, how it was verified, and any limitations. Update docs when behavior or setup changes.

The browser suite launches its own disposable backend and frontend, so do not start development servers on its test ports. Keep the default offline path working. See [Architecture](docs/ARCHITECTURE.md), [Project Status](docs/PROJECT_STATUS.md), and the [Code of Conduct](CODE_OF_CONDUCT.md).
