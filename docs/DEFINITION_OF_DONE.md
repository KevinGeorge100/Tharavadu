# KIN Definition of Done (DoD)

This document establishes the mandatory quality and completeness criteria that every backlog item, task branch, and pull request must satisfy before work is considered **Done** and promoted to the `main` branch.

Code that merely compiles or runs locally without error does **not** satisfy the Definition of Done.

---

## 1. Universal Definition of Done Checklist

Every task must satisfy all applicable items below before being presented for human approval:

- [ ] **1. Acceptance Criteria Satisfied:** All functional and non-functional requirements specified in the canonical backlog item (`docs/BACKLOG.md`) are completely fulfilled.
- [ ] **2. Relevant Automated Tests Added / Updated:**
  - Backend domain logic changes include deterministic unit tests in `pytest`.
  - Backend endpoint changes include integration tests covering success, validation, and authorization error branches.
  - Frontend components and views include unit or Playwright browser validation where applicable.
- [ ] **3. Full Regression Suite Passes:**
  - Backend: `pytest` passes with 100% success rate across all collected tests.
  - Frontend: `npm run typecheck` (`tsc --noEmit`) passes with 0 errors.
  - Frontend: `npm test` (`playwright test`) passes for all active test specs.
- [ ] **4. Linting & Formatting Clean:**
  - Backend: `ruff check backend` passes with 0 errors and 0 warnings.
  - Frontend: `npm run lint` passes with 0 errors.
- [ ] **5. Build Verification:**
  - Backend: `python -c "import app.main"` executes cleanly without side effects or unhandled imports.
  - Frontend: `npm run build` (`next build`) produces a valid production build bundle without warnings treated as errors.
- [ ] **6. Manual & Visual Validation Completed:**
  - For UI changes, visual layout and interactive behavior are validated on **desktop**, **tablet**, and **mobile** screen dimensions.
  - Edge cases, error states, and empty states are manually verified.
- [ ] **7. Security & Privacy Review:**
  - No secrets, tokens, API keys, or credentials are introduced in source code or documentation.
  - Multi-tenant family isolation is strictly maintained; no endpoints expose cross-tenant data.
  - Mutating endpoints require session authentication and enforce CSRF origin headers (`x-kin-client: web`).
  - No personally identifiable information (PII) or family member data is logged.
- [ ] **8. Scope Control Enforced:**
  - No opportunistic refactoring or "while-I-was-here" modifications outside the declared task scope.
  - Any newly discovered bugs or architectural improvements are logged as backlog candidates, not silently implemented.
- [ ] **9. Git Diff Reviewed:**
  - Every modified line in `git diff` has been explicitly reviewed and justified against the task requirements.
  - No unwanted artifacts, scratch files, or test outputs are included.
- [ ] **10. Documentation Synchronized:**
  - Architecture documentation (`docs/ARCHITECTURE.md`) updated if data flow, trust boundaries, or component responsibilities changed.
  - Project status (`docs/PROJECT_STATUS.md`) and backlog (`docs/BACKLOG.md`) updated to reflect current state.
  - Relevant ADR created in `docs/adr/` if a major architectural decision was made.
- [ ] **11. Known Limitations Documented:** Any known constraints, performance bounds, or follow-up items are explicitly captured in the task summary.
- [ ] **12. Human Approval Obtained:** The human project lead has reviewed the completion report and explicitly authorized promotion to `main`.

---

## 2. Frontend-Specific Visual DoD

When implementing or modifying user-facing UI components:

1. **Rendering Integrity:**
   - No horizontal scrollbars or overflow on standard viewports (375px mobile, 768px tablet, 1280px+ desktop).
   - Component typography, contrast ratios, and color palettes adhere to modern design standards.
2. **State Coverage:**
   - Loading states (spinners, skeletons) implemented for asynchronous operations.
   - Error states clearly inform the user and provide actionable recovery steps.
   - Empty states guide the user on how to add data or proceed.
3. **Interactive & Accessibility Standards:**
   - Interactive elements have descriptive accessible labels (`aria-label`) and keyboard focus outlines.
   - Form inputs handle validation errors gracefully with visible messages.

---

## 3. Backend-Specific DoD

When implementing or modifying backend API endpoints or domain logic:

1. **Input Validation:**
   - All request bodies use strict Pydantic schemas with `extra="forbid"`, bounded string lengths, and sanitized values.
2. **Error Semantics:**
   - Domain logic raises `Conflict` (mapped to HTTP 409) for invariant violations.
   - Validation errors map to HTTP 422 with descriptive messages.
   - Unauthorized access maps to HTTP 401; forbidden/cross-tenant access maps to HTTP 404/403.
3. **Database Hygiene:**
   - Database sessions/connections are explicitly managed and closed via context managers.
   - Graph mutations verify revision numbers to prevent lost updates.

---

## 4. Promotion & Integration Workflow

A task branch may only be merged into `main` when all items in this Definition of Done have been certified and approved by the human supervisor.
