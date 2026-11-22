---
name: assume-task
description: Take ownership of a ticket or task—distrust the report, reproduce it live with real runtime evidence (JSON, logs, or screenshots), isolate code and history, classify it, update the tracker per AGENTS.md, and deliver up to the project's autonomy ceiling. Use whenever asked to handle, take, fix, or look into a ticket or issue, or when spawned from triage.
---

<!-- Inspired by pstack's bug-fix and investigation playbooks by Lauren Tan (MIT). See the bundled LICENSE. https://github.com/cursor/plugins/blob/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack/skills/poteto-mode/playbooks/bug-fix.md -->

# Assume task

Read the project's `AGENTS.md` to determine the profile (`github` or `bitbucket-jira`), local runtime startup instructions, tracker write permissions, and the **delivery ceiling** for this repo or board (`handoff-only`, `prepare-only`, `draft-pr`, `open-pr`, or `merge-main`). Load only the matching [GitHub](references/github.md) or [Bitbucket + Jira](references/bitbucket-jira.md) reference and read [classification](references/classification.md). If required rules are missing and would risk an unauthorized write or push, confirm before writing externally.

State the active mode up front:

- **`auto`** *(default)*: run the full investigation, classify the task, and if it is a confirmed `easy-fix` or bounded `bug` within the project's autonomous scope, implement and deliver up to the project's delivery ceiling. For `feature-request`, `requirement-change`, `research`, `architecture-*`, or `not-reproducible`, stop at an evidence-backed handoff without editing production code.
- **`investigate`**: human-in-the-loop mode for complex or ambiguous tickets. Run the full live investigation, classify, propose options, and pause before changing production code.
- **`drive`**: explicitly authorized to implement beyond `easy-fix` (such as a confirmed `bug` or `feature-missing`) up to the project's delivery ceiling.

## 1. Evidence-first investigation

Do not trust the ticket description at face value and do not stop at reading source code. Work through these eight checks:

1. **State the claim:** list what the ticket reports, expected vs actual behavior, scope, and requester context.
2. **Reproduce live:** boot the app or service and trigger the exact flow. Capture real runtime evidence—JSON/HTTP payloads, logs, database state, or a screenshot of the bug using the host's browser/device tools. If reproduction fails, record exact steps, environment, and why.
3. **Verify if it is truly a bug:** separate real defect from expected behavior, bad data/config, stale cache, or missing specification.
4. **Isolate the relevant code:** trace from the entry point to the first wrong result and state owner (applying [right-fix](../open-pr/references/right-fix.md)).
5. **Check history:** inspect git history, past commits/PRs, and related tickets (use [why](../why/SKILL.md) when rationale is unclear) to see if this happened before.
6. **Check existing solutions:** look for an existing helper, abstraction, or sibling fix in the repo before adding new code.
7. **Check requirement shift:** flag if the requested behavior contradicts current contracts or represents a requirement change needing sign-off.
8. **Check architectural impact:** determine whether the clean fix stays local or requires an architectural decision/design.

## 2. Classify and update the tracker

Assign one primary label from [classification](references/classification.md).

If the project's `AGENTS.md` authorizes tracker writes (status transition, evidence comment, or classification label), apply only the permitted updates via the active profile reference. Strip credentials, tokens, and sensitive payloads before posting any comment. If tracker writes are not authorized in `AGENTS.md`, keep the tracker read-only and include a ready-to-paste summary in your handoff.

## 3. Execute up to the project's delivery ceiling

When the mode and classification authorize implementation:

- **`handoff-only`:** do not edit production code; deliver the investigation and recommended next step.
- **`prepare-only`:** implement the minimal root fix on a dedicated branch/worktree, run [open-pr](../open-pr/SKILL.md) in prepare-only mode (full `pre-pr` checks—`right-fix`, `simplify-diff`, `no-comments`, `interrogate`, `blast-radius`—plus project build/lint/tests), commit locally, draft the PR title/body, and **stop right before push** for human review.
- **`draft-pr` / `open-pr`:** complete [open-pr](../open-pr/SKILL.md) (draft when configured), audit artifacts with [gc](../gc/SKILL.md), and hand off to [babysit-pr](../babysit-pr/SKILL.md).
- **`merge-main`:** only when explicitly allowed by `AGENTS.md` for low-stakes personal repos with every required check passing.

## 4. Package the handoff

Scale the report to the size of the work—keep it crisp, scannable, and backed by artifacts:

- **Routine fix or investigation:** concise bullet handoff (claim, live evidence/screenshot/JSON, classification, root cause, history/existing helpers, and commit/branch/PR state), or a compact in-app visual in T3 Code when side-by-side evidence helps.
- **Large or multi-component delivery:** generate a local HTML [press-release](../press-release/SKILL.md) with real screenshots or recordings, plus a short summary and clickable link in the thread.
