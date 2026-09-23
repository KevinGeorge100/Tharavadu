# Task Execution & Scope Control Contract

This document defines the contract required for initiating, executing, and completing any implementation task in Tharavadu.

---

## 1. Task Execution Contract Template

Before modifying source files for any backlog item, the agent must declare and adhere to this explicit contract:

```markdown
### Task Execution Contract: [KIN-XXX]

- **TASK ID:** KIN-XXX
- **GOAL:** [1-2 sentences stating the clear objective]
- **CONTEXT:** [Why this task is being undertaken now]
- **CURRENT BEHAVIOR:** [What happens right now in code]
- **REQUIRED BEHAVIOR:** [What must happen after this task completes]
- **FILES IN SCOPE:** [Explicit list of file paths permitted to be edited/created]
- **NON-GOALS:** [Explicitly out-of-scope items to prevent scope creep]
- **DEPENDENCIES:** [Prior tasks or external resources required]
- **CONSTRAINTS:** [Technical, performance, security, or design limitations]
- **ACCEPTANCE CRITERIA:** [Checklist of verifiable requirements]
- **AUTOMATED TESTS:** [Exact commands and test suites to execute]
- **MANUAL / VISUAL VALIDATION:** [Steps to verify UI rendering or runtime behavior]
- **DEFINITION OF DONE:** [Confirmation against docs/DEFINITION_OF_DONE.md]
```

---

## 2. Scope Control & Discipline

AI development in Tharavadu operates under strict scope boundaries.

### The "Discovered Issue" Protocol

While executing a task on a branch `task/KIN-XXX-...`:

If you discover an unrelated bug, missing configuration, code smell, dead code, or architectural flaw:

1. **DO NOT silently fix it.**
2. **Evaluate Impact:**
   - **Case A: The issue DOES NOT block the current task.**
     - Leave the code untouched.
     - Document the discovery as a new candidate backlog item (`KIN-YYY`) in your completion report.
     - Continue executing the current task.
   - **Case B: The issue BLOCKS the current task.**
     - **STOP.**
     - Report the blocker immediately to the human lead with evidence and remediation options.
     - Await human decision before proceeding.
3. **No Opportunistic Rewrites:**
   - Never rewrite an existing function just because you prefer different naming or styling.
   - Never update unpinned dependencies or add third-party libraries not approved for the task.
   - Never modify database schemas or API contracts without an approved ADR.

---

## 3. Ambiguity & Requirement Clarification

If any aspect of the task specification is unclear, underspecified, or contradicts existing architecture:

1. **STOP immediately.**
2. State the ambiguity clearly:
   - What the code currently does.
   - The two or more possible interpretations.
   - The architectural or product tradeoff of each.
3. Await human instruction.
4. **Never make speculative product assumptions.**
