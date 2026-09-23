# Tharavadu Engineering Backlog

This backlog maintains the authoritative, prioritized registry of planned work for Tharavadu. Every implementation task undertaken by human or AI contributors must trace directly to a backlog item in this document.

---

## Status Definitions

- **BACKLOG:** Work identified, scoped, and prioritized, awaiting dependency resolution or scheduling.
- **READY:** Meets the Definition of Ready (requirements unambiguous, dependencies satisfied, acceptance criteria defined). Can be picked up immediately.
- **IN PROGRESS:** Actively being executed on a dedicated task branch.
- **BLOCKED:** Cannot proceed due to an external dependency or pending human decision.
- **REVIEW:** Implementation complete, validation passed, awaiting human review and approval.
- **DONE:** Satisfies the Definition of Done, human approved, merged into `main`.

---

## Priority Definitions

- **P0 — Critical / Blocker:** Must be solved before normal development can proceed. Blocks baseline correctness or pipeline.
- **P1 — Important MVP:** Core functional requirement for minimum viable product release.
- **P2 — Normal Quality / Hardening:** Important non-blocking feature, robustness improvement, or technical debt resolution.
- **P3 — Later / Scale:** Enhancements, secondary features, and future scale optimizations.

---

## Active Backlog Items

### KIN-001: Backend Lint & Code Quality Configuration
- **Priority:** P0
- **Status:** DONE
- **Goal:** Configure Ruff and resolve all 28 existing lint violations across backend Python files.
- **Reason:** Existing `ruff check backend` fails with 28 violations due to standard FastAPI `Depends` in route signatures and regex aliases (`re.I`). Clean linting is required for CI and quality baselines.
- **Dependencies:** None.
- **Acceptance Criteria:**
  1. Add Ruff configuration to `pyproject.toml` or `ruff.toml` with `[lint.flake8-bugbear] extend-immutable-calls = ["fastapi.Depends"]`.
  2. Replace `re.I` with `re.IGNORECASE` in `backend/app/queries.py`.
  3. `ruff check backend` runs and exits 0 with zero errors and zero warnings.

---

### KIN-002: Backend Domain & Kinship Unit Test Suite
- **Priority:** P0
- **Status:** DONE
- **Goal:** Author a comprehensive, deterministic unit test suite for `backend/app/domain.py`, `backend/app/schemas.py`, and `backend/app/queries.py`.
- **Reason:** The core value of Tharavadu is deterministic, trustworthy kinship reasoning and cycle-free graph integrity. Currently, 0 automated tests exist in the repository.
- **Dependencies:** KIN-001.
- **Acceptance Criteria:**
  1. Create `backend/tests/` with test modules:
     - `test_domain.py`: Test cycle detection (circular ancestry DFS), sibling-ancestor conflicts, and graph validation.
     - `test_kinship.py`: Test relationship classifications (cousin degrees, removed levels, great-grandparents, in-laws).
     - `test_resolution.py`: Test entity resolution, homonym disambiguation, and choice mapping.
     - `test_queries.py`: Test natural language question answering and relationship paths.
     - `test_schemas.py`: Test Pydantic model validation (extra field rejection, date ordering).
  2. `pytest` executes a minimum of 25 test cases and passes with 100% success rate.

---

### KIN-003: Environment & Local Development Configuration
- **Priority:** P0
- **Status:** DONE
- **Goal:** Create `.env.example` and top-level `README.md` documenting environment configuration and setup instructions.
- **Reason:** Currently no environment templates exist, and running the project requires understanding implicit defaults in `backend/app/config.py`.
- **Dependencies:** None.
- **Acceptance Criteria:**
  1. Create `.env.example` documenting all settings (`DATABASE_URL`, `GRAPH_BACKEND`, `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`, `AI_PROVIDER`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `APP_ORIGIN`, `COOKIE_SECURE`).
  2. Create a clean root `README.md` with instructions for launching the backend, configuring local vs Neo4j modes, and starting the frontend.

---

### KIN-004: Frontend Foundation & Family Exploration Canvas
- **Priority:** P1
- **Status:** REVIEW
- **Goal:** Redesign Tharavadu frontend as a warm, spatial family exploration canvas ("Warm Scrapbook + Family Constellation + Spatial Playground") with light-first ivory/parchment palette, conversational AI composer, and interactive constellation explorer.
- **Reason:** Previous SaaS landing page UI failed UX review. The family universe is the home screen; users experience Tharavadu directly without marketing cards or conventional headers/footers.
- **Dependencies:** None.
- **Acceptance Criteria:**
  1. Light-first warm palette (parchment/ivory `#fbf8f2`, deep ink typography `#1e1c19`, soft pastel family branch tones).
  2. Spatial first-run canvas ("Start with you" central node with satellite actions: Add a parent, Add a sibling, Add a partner, Tell Tharavadu a story).
  3. Interactive 3-generation demo family constellation (Arthur, Eleanor, Julian, Clara, Nora, Leo, Maya) with SVG connectors and kinship path tracing.
  4. Floating conversational AI composer at the bottom with prompt chips and clearly labeled local simulation feedback pill.
  5. Warm scrapbook person card with fictional memories, direct jump relative navigation, and relationship path highlighting.
  6. Responsive mobile layout with bottom-sheet card, minimal top chrome, and zero horizontal overflow.
  7. `npm run typecheck`, `npm run lint`, and `npm run build` pass cleanly.

---

### KIN-005: FastAPI End-to-End API Integration Test Suite
- **Priority:** P1
- **Status:** READY
- **Goal:** Author integration tests using `pytest` and `httpx.ASGITransport` covering all FastAPI endpoints.
- **Reason:** Ensure authentication, authorization boundaries, rate limiting, and proposal lifecycles operate correctly without relying on manual API testing.
- **Dependencies:** KIN-001, KIN-002.
- **Acceptance Criteria:**
  1. Test authentication: register, login (valid and invalid passwords), session cookie verification, logout.
  2. Test family multi-tenancy: verify that user A cannot view, mutate, or query user B's family.
  3. Test proposal lifecycle: submit statement to `/proposals`, verify pending status and homonym candidate extraction, confirm proposal, verify graph revision increment.
  4. Test memory CRUD: create memory linked to family members, search memories, delete memory.
  5. Test request origin middleware: verify that mutating requests without `x-tharavadu-client: web` or matching `Origin` return HTTP 403.
  6. All integration tests pass via `pytest`.

---

### KIN-006: Interactive Family Graph Canvas Component
- **Priority:** P1
- **Status:** BACKLOG
- **Goal:** Implement an interactive genealogical tree canvas using `@xyflow/react` and `@dagrejs/dagre`.
- **Reason:** Users require a visual, interactive representation of their family relationships with automatic hierarchical layout.
- **Dependencies:** KIN-004, KIN-005.
- **Acceptance Criteria:**
  1. Component fetches `/api/families/{id}/graph` and computes hierarchical layout via `@dagrejs/dagre`.
  2. Custom person nodes display name, gender avatar/badge, birth/death years, and selection state.
  3. Connectors visually distinguish `PARENT_OF`, `SPOUSE_OF`, and `SIBLING_OF` relationships.
  4. Smooth pan, zoom, fit-view controls, and minimap.
  5. Responsive across desktop, tablet, and mobile screens.

---

### KIN-007: Proposal Review & Identity Disambiguation UI
- **Priority:** P1
- **Status:** BACKLOG
- **Goal:** Implement the narrative input and proposal review drawer in the frontend workspace.
- **Reason:** Fulfills the core design principle that AI produces proposals, never autonomous graph mutations. Users must inspect additions and resolve homonyms.
- **Dependencies:** KIN-004, KIN-006.
- **Acceptance Criteria:**
  1. Text input area allowing users to type or paste family stories.
  2. Proposal review card displaying extracted entities and relationships with diff highlights.
  3. Interactive disambiguation modal when homonyms are flagged, letting users select an existing person or designate "new person".
  4. Confirmation button sending `/confirm` payload and updating the live canvas.

---

### KIN-008: Kinship Query & Relationship Path Explorer UI
- **Priority:** P1
- **Status:** BACKLOG
- **Goal:** Implement the kinship query bar and dual-person relationship explorer.
- **Reason:** Allows users to query relationships ("Who is Raj to me?", "Show my cousins") and visually inspect the evidence path.
- **Dependencies:** KIN-006, KIN-007.
- **Acceptance Criteria:**
  1. Search input for natural language questions.
  2. Relationship inspector allowing user to select Person A and Person B.
  3. Display of canonical kinship label (e.g. "second cousin, 1 time removed") and textual explanation.
  4. Highlights the path connecting Person A and Person B directly on the `@xyflow` canvas.

---

### KIN-009: Family Story & Memory Journal UI
- **Priority:** P2
- **Status:** BACKLOG
- **Goal:** Implement the memory creation, viewing, and search panel in the workspace.
- **Reason:** Enable users to preserve rich narratives, stories, and anecdotes tied to specific family members.
- **Dependencies:** KIN-006.
- **Acceptance Criteria:**
  1. Memory list showing author, timestamp, text snippet, and tagged relatives.
  2. Creation modal allowing text entry and multi-select person tagging.
  3. Substring search bar filtering memories in real time.

---

### KIN-010: Persistent Rate Limiting & Session Hygiene
- **Priority:** P2
- **Status:** BACKLOG
- **Goal:** Replace the in-memory rate limiting dictionary with persistent storage and implement scheduled expired session cleanup.
- **Reason:** Mitigates identified security risk SEC-01 and SEC-02 for multi-worker production deployments.
- **Dependencies:** KIN-005.
- **Acceptance Criteria:**
  1. Implement token bucket or database-backed rate limiting.
  2. Implement an automated background task or SQL trigger to delete expired session tokens.

---

### KIN-011: Playwright End-to-End Browser Test Suite
- **Priority:** P1
- **Status:** BACKLOG
- **Goal:** Author full browser automation tests validating user journeys from registration through graph exploration.
- **Reason:** Ensure full visual and interactive QA across desktop, tablet, and mobile browsers.
- **Dependencies:** KIN-006, KIN-007, KIN-008.
- **Acceptance Criteria:**
  1. End-to-end tests covering registration, family creation, narrative entry, proposal confirmation, and canvas rendering.
  2. Tests run in headless Chromium, Firefox, and WebKit.
  3. Responsive viewport tests at 375px, 768px, and 1280px widths.
