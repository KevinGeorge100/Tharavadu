# KIN 🌳

**AI-Assisted Personal Family Discovery & Kinship Reasoning**

> "Tell me your family stories, and together we'll discover your roots."

---

## What is KIN?

**KIN** is a playful, personal, story-driven family discovery workspace. Instead of filling out rigid, intimidating genealogy forms with dozens of empty date pickers, you simply share your family narratives in everyday natural language:

> *"My father Joseph has an older brother named Thomas. Thomas has two children named Raj and Maya."*

From there, KIN:
1. **Listens & Proposes:** An AI/NLP extraction engine reads your words and creates a typed, human-reviewable change proposal.
2. **Empowers Human Oversight:** If names are ambiguous (like having two relatives named *"George"*), KIN never guesses. It asks you to clarify with a single click.
3. **Maintains Graph Truth:** Once confirmed, facts are committed to a cycle-free family graph.
4. **Reasons Deterministically:** Formal graph algorithms compute exact relationships—such as *"first cousin, 1 time removed"*, *"great-aunt"*, or complex in-law paths—with transparent, step-by-step explanations.

---

## Why KIN Exists

Genealogy software is often clunky, corporate, or overly academic. KIN treats family history as a living, conversational discovery experience:
- **Playful & Visual:** Built for visual exploration, narrative memory journaling, and relational questions (*"How are Raj and Joseph related?"*).
- **Zero Hallucinations on Kinship:** Large language models are fantastic at interpreting human language, but notoriously unreliable at mathematical graph traversal and multi-generational logic. KIN strictly separates language understanding from graph reasoning.

```
                   THE KIN ARCHITECTURAL BOUNDARY
  ┌─────────────────────────────────────────────────────────────┐
  │                 AI / Extraction Boundary                    │
  │  • Interpret informal English narratives                    │
  │  • Extract candidate entities and relationships             │
  │  • Surface homonym ambiguities & uncertainty warnings       │
  │  • STRICTLY PROPOSAL-ONLY: Zero direct database writes      │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼ (Human Confirmation)
  ┌─────────────────────────────────────────────────────────────┐
  │              Deterministic Python Engine                    │
  │  • Ancestry cycle detection (DFS)                           │
  │  • Sibling-as-ancestor invariant validation                 │
  │  • BFS graph traversal for exact kinship paths              │
  │  • Mathematical cousin degree and removed classification    │
  │  • Immutable, optimistic revision concurrency               │
  └─────────────────────────────────────────────────────────────┘
```

---

## Current Project Status

| Layer | Status | Details |
| :--- | :--- | :--- |
| **Domain Logic** | **100% Tested** | 88 automated pytest unit tests covering cycle checks, homonym disambiguation, cousin math, queries, and schemas. |
| **Backend Service** | **Functional Prototype** | FastAPI app with session auth, SQLite/Neo4j graph repositories, memory journal, and REST API. |
| **Frontend UI** | **Skeleton (In Progress)** | Next.js 16 + React 19 build workspace. The visual App Router UI is scheduled for scaffolding in **KIN-004**. |

---

## Tech Stack

- **Backend:** Python 3.14+, FastAPI, SQLAlchemy v2, Pydantic v2, Uvicorn.
- **Data & Graph:** SQLite (default local mode) / PostgreSQL + Neo4j (optional production mode).
- **AI Extraction:** Dual-provider architecture:
  - *Offline Mode:* Deterministic regex parser (zero cloud dependencies, instant, free).
  - *OpenAI Mode:* Structured outputs via `gpt-4.1-mini` (`client.responses.parse`).
- **Frontend Workspace:** Next.js 16 (App Router), TypeScript, `@xyflow/react` (React Flow), Lucide Icons.
- **Testing & Quality:** Pytest, Ruff, Playwright, ESLint.

---

## Repository Structure

```
KIN/
├── backend/
│   ├── app/
│   │   ├── ai.py          # Dual extraction providers (offline regex + OpenAI structured outputs)
│   │   ├── config.py      # Pydantic Settings and environment configuration
│   │   ├── database.py    # SQLAlchemy tables & Local / Neo4j graph repositories
│   │   ├── domain.py      # Graph validation, cycle detection, identity resolution & kinship math
│   │   ├── main.py        # FastAPI endpoints, session auth, rate limiting, and middleware
│   │   ├── queries.py     # Natural language kinship query parser & evidence generator
│   │   ├── schemas.py     # Strict Pydantic v2 data models
│   │   └── seed.py        # 8-person demo family graph generator
│   ├── tests/             # Pytest test suite (88 domain, kinship, query, and schema tests)
│   └── requirements.txt   # Pinned Python dependencies
├── frontend/
│   ├── package.json       # Next.js, React Flow, and Lucide dependencies
│   ├── next.config.ts     # Standalone output, security headers, and API proxy rewrites
│   ├── tsconfig.json      # TypeScript configuration
│   └── eslint.config.mjs  # ESLint flat config
├── docs/                  # Architecture specs, ADRs, backlog, and roadmap
├── .env.example           # Documented configuration template
└── pyproject.toml         # Ruff and project tool configuration
```

---

## Prerequisites

Before running KIN, make sure you have:
- **Python 3.14+** (Python 3.12+ also supported)
- **Node.js 20+** (v24 LTS recommended) and **npm 10+**
- **Git**

---

## Local Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/KIN.git
cd KIN
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the repository root:
```bash
# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```
*The default `.env` is pre-configured for zero-external-dependency local development (SQLite + Offline NLP).*

### 3. Backend Setup
Set up a Python virtual environment and install backend dependencies:

#### Windows (PowerShell)
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

#### Linux / macOS
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### 4. Frontend Setup
Install frontend Node modules using the lockfile:
```bash
cd frontend
npm ci
cd ..
```

---

## Running Locally

### Start the Backend Service
With your virtual environment active, run:

```powershell
# From repository root (Windows PowerShell)
.\.venv\Scripts\uvicorn.exe backend.app.main:app --reload --port 8000

# Or generic / Linux / macOS:
uvicorn backend.app.main:app --reload --port 8000
```
- Interactive API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### Start the Frontend Dev Server
```bash
cd frontend
npm run dev
```
- Web Application: [http://localhost:3000](http://localhost:3000)

*(Note: Until KIN-004 is completed, the frontend directory contains configuration and dependencies. The App Router shell is scheduled for implementation in KIN-004.)*

---

## Configuration Modes

### Mode A: Zero-External-Service Local Development (Recommended Default)
No third-party accounts, cloud keys, or Docker containers required:
```env
DATABASE_URL=sqlite:///./kin.db
GRAPH_BACKEND=local
AI_PROVIDER=offline
APP_ORIGIN=http://localhost:3000
```
- **Storage:** Stored locally in a lightweight `kin.db` SQLite database.
- **AI Extraction:** Uses the built-in deterministic English grammar parser in `backend/app/ai.py`.

### Mode B: Cloud AI Extraction (OpenAI)
To enable unstructured natural conversation extraction using OpenAI:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4.1-mini
```

### Mode C: Graph Database Persistence (Neo4j)
To persist family relationships directly into a Neo4j instance:
```env
GRAPH_BACKEND=neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=secret
```

---

## Running Quality Checks & Tests

### Backend Unit Tests (Pytest)
Run the 88 deterministic domain and kinship regression tests:
```powershell
# Windows PowerShell
.\.venv\Scripts\pytest.exe

# Linux / macOS
pytest
```

### Code Formatting & Linting (Ruff)
```powershell
# Windows PowerShell
.\.venv\Scripts\ruff.exe check backend

# Linux / macOS
ruff check backend
```

### Frontend Typechecking & Linting
```bash
cd frontend
npm run typecheck
npm run lint
```

---

## Security & Privacy Guidelines

Family data is deeply personal. All contributors must follow these rules:
- **Never commit `.env` or local secrets:** `.env` and `.env.local` are strictly ignored by `.gitignore`.
- **Never commit database files:** SQLite files (`*.db`, `*.db-journal`) are strictly git-ignored.
- **Session Tokens:** Auth tokens are hashed with SHA-256 before storage; passwords use Scrypt with unique salt.
- **Origin & Client Validation:** Mutating endpoints require `x-kin-client: web` and a matching `Origin` header to mitigate CSRF attacks.

---

## Architectural Decisions & Governance

Key architectural choices are formally documented in [`docs/adr/`](file:///c:/Projects/KIN/docs/adr):
- **[ADR-0001: Hybrid Graph & Relational Storage](file:///c:/Projects/KIN/docs/adr/ADR-0001-hybrid-graph-relational-storage.md)** — Relational database for metadata; swappable JSON snapshot or Neo4j backend.
- **[ADR-0002: Proposal-First AI Extraction](file:///c:/Projects/KIN/docs/adr/ADR-0002-proposal-first-ai-extraction.md)** — AI models can only stage proposals; humans approve all graph mutations.
- **[ADR-0003: Pure Python Kinship Reasoning](file:///c:/Projects/KIN/docs/adr/ADR-0003-pure-python-deterministic-kinship-reasoning.md)** — Zero LLMs in the relationship deduction or cycle detection path.

---

## Work in Progress & Roadmap

- **Completed:** M0 Stabilization (KIN-001 Lint Baseline, KIN-002 Domain Unit Tests, KIN-003 Environment & Setup).
- **Next Up:** **KIN-004** — Next.js App Router visual foundation and modern dark-mode design system.
- **Following:** **KIN-005** — FastAPI integration test suite with `httpx.ASGITransport`.
