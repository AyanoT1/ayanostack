---
name: overnight
description: Run long-horizon unattended work (e.g., 6-7 hours while sleeping) with an explicit contract, disk-backed state, deep verification using the full time budget, and a morning HTML press-release report with real visual evidence. Use for overnight runs, backlog grinds, feature prototypes, bug hunts, or extended gardening.
---

<!-- Inspired by pstack's overnight guide by Lauren Tan (MIT), Anthropic's long-running harness patterns, and Karpathy's ratchet loop. See the bundled LICENSE. -->

# Overnight

Run unattended work without rushing to declare victory or burning tokens in blind loops. Rely on the host's native long-running execution mode (such as `/goal`, `/loop`, or a scheduled runner) rather than shell `sleep` polling.

## 1. Lock the contract before starting

From the first message, establish the thread topic, the target outcome, and the time budget (for example, 6 to 7 hours or a wall-clock stop time). Classify the work into one primary track and read [tracks](references/tracks.md):

- `todo-list` — a bounded backlog or checklist.
- `implement-feature` — a defined feature with checkable acceptance criteria.
- `research-feature` — feasibility exploration comparing competing approaches rather than a fixed "done" spec.
- `fixes` — concrete bugs with reproducible failures and root-cause verification.
- `gardening` — extended repo upkeep (performance, architecture, repeated code, docs, and `correct` constraints).

Confirm these four guardrails before working unattended (ask concisely only if a missing choice would materially derail the run):

1. **Immutable oracle:** the tests, repro commands, benchmarks, or rubric that prove progress. Never weaken a test, skip a check, or edit a benchmark to make a run pass.
2. **Isolation:** work on a dedicated branch or worktree. Never commit directly to the default branch, never merge, never force-push, and never run destructive operations against production or user data.
3. **Permissions:** state whether the run ends with local commits only, a pushed branch, or a draft PR.
4. **Escape hatch:** if a blocker needs a human decision, missing credentials, or fails the same hypothesis three times, log it clearly and move to the next independent item—or stop cleanly instead of spinning.

## 2. Use the full time budget deeply

Do not treat the first passing check as the finish line when hours remain in the budget. Models naturally try to wrap up early; resist that bias and spend the available time raising confidence and clarity before calling it done.

- **Go deep before spawning a swarm:** prefer sequential depth first—test alternative approaches, probe edge cases, harden error paths, clean diffs, document decisions, and capture visual evidence. Invoke [swarm](../swarm/SKILL.md) only when independent slices genuinely benefit from parallelism or the user explicitly asked for it.
- **Verification stack:** pass changes through [blast-radius](../blast-radius/SKILL.md), [interrogate](../interrogate/SKILL.md), [no-comments](../no-comments/SKILL.md), [simplify-diff](../simplify-diff/SKILL.md), and [benchmark-checklist](../benchmark-checklist/SKILL.md) when performance is involved.
- **Independent review within available models:** when running `interrogate` independently, use the `interrogate reviewers` panel from the project's `AGENTS.md` or the models the user names, rather than assuming a large multi-provider council.
- **Evidence capture:** for visible UI or workflow changes, capture real screenshots or a short recording using the host's browser/device tools. Never fabricate screenshots, videos, or benchmark numbers.

## 3. Keep state on disk and ratchet via Git

Conversations compact and drift across hours; disk state and Git history do not.

- Maintain a concise run log in a scratch or ignored path (never committed to the repo) containing: the contract, track, checklist or approach matrix, hypotheses tried and discarded with exact commands/outcomes, current best commit, and blockers.
- Commit each verified milestone atomically. For exploratory or optimization attempts, use a ratchet: commit verified improvements, revert regressions, and record why the discarded path failed so later passes never retry it.

## 4. Morning handoff

Reserve the final window of the budget (or start once every criterion and deep check is truly satisfied) to stabilize and package the handoff:

1. Re-run the full verification suite on the final head and audit temporary files with [gc](../gc/SKILL.md) (hold the active branch/worktree).
2. Generate a local HTML [press-release](../press-release/SKILL.md) as the morning report of what was built, improved, or discovered. Embed real screenshots or a short video when relevant, or verified before/after metrics and comparison tables for non-visual work.
3. Close in the thread with a brief [ketchup](../ketchup/SKILL.md)-style summary: a clickable link to the HTML report, the branch and commit range, what works and how you checked it, what you tried and dropped, what is still missing, and any decision waiting on the user. Write the summary and the report as [plain replies](../ayanostack/references/plain-replies.md) say.
