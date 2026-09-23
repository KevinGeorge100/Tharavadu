# Git Hygiene & Branching Strategy

This document establishes the Git standards, branching model, and commit policies for Tharavadu.

---

## 1. Branching Topology

Tharavadu adheres to a strict, simplified trunk-based branching strategy:

```
main (Canonical Production & Staging Trunk)
  ▲
  │ (Fast-Forward Merge Only)
  │
task/KIN-XXX-short-description (Short-lived task branch)
```

### Prohibited Branching Patterns

- **DO NOT** create `develop`, `development`, `stage`, or `staging` branches.
- **DO NOT** create long-lived sprint branches.
- **DO NOT** create release branches unless officially tagged for an external production distribution.

---

## 2. Core Git Rules

1. **`main` is Canonical:** The `main` branch must remain deployable, clean, and tested at all times.
2. **Never Develop Directly on `main`:** Every code change, documentation addition, or configuration update must originate on a dedicated task branch.
3. **One Backlog Item Per Task Branch:**
   - Every branch maps 1-to-1 to an approved backlog item in `docs/BACKLOG.md`.
   - Branch naming format: `task/KIN-XXX-short-description` (lowercase, hyphen-separated, e.g., `task/KIN-001-backend-lint-config`).
4. **Short-Lived Branches:** Task branches should exist for the duration of single task execution (hours, not days). Stale branches must be deleted.
5. **Prefer Fast-Forward Promotion:**
   - Merge approved task branches into `main` using fast-forward only (`git merge --ff-only task/KIN-XXX-...`).
   - If `main` has moved ahead, rebase the task branch onto latest `main` (`git rebase main`), re-run tests, and re-verify before merging.
6. **No Force Pushes:** Never run `git push --force` or `--force-with-lease` on `main`.
7. **No History Rewriting on Shared Branches:** Rebase operations are strictly restricted to unmerged local task branches.
8. **Clean Working Tree:** Do not leave untracked scratch files, build artifacts, or temporary database files (`tharavadu.db`, `kin.db`, `.pytest_cache`, `.next`, `node_modules`) in Git tracking. Ensure `.gitignore` is maintained.

---

## 3. Commit Message Conventions

Commit messages must follow the Conventional Commits specification and cite the canonical backlog item:

```
<type>(<scope>): <concise description> [KIN-XXX]

[Optional detailed body explaining context and rationale]
```

### Supported Types
- `feat`: New feature or user-facing capability.
- `fix`: Bug fix or defect resolution.
- `test`: Adding or correcting automated tests.
- `lint`: Code style, linting rule adjustments, or formatting.
- `refactor`: Internal restructuring without behavior change.
- `docs`: Documentation, ADRs, or governance updates.
- `chore`: Tooling, dependency management, or build configuration.

### Examples
- `fix(lint): resolve ruff violations and configure bugbear [KIN-001]`
- `test(domain): add unit test suite for kinship traversal and cycles [KIN-002]`
- `feat(frontend): scaffold next.js app router and layout [KIN-004]`
