# Overnight tracks

Pick one primary track at kickoff. When a run mixes two (for example, fixing a bug discovered while implementing a feature), keep the primary track's finish rule in charge.

## `todo-list`

- **Goal:** burn down a bounded list of discrete items in priority order.
- **Loop:** pick one item → verify baseline → implement smallest clean change → run checks → commit atomically → update disk log.
- **Done / spare time:** if all items finish early, run [blast-radius](../../blast-radius/SKILL.md), [no-comments](../../no-comments/SKILL.md), and [interrogate](../../interrogate/SKILL.md) across the combined branch, capture evidence for user-visible items, and audit docs touched by the work.

## `implement-feature`

- **Goal:** deliver a defined feature that satisfies explicit acceptance criteria.
- **Loop:** trace callers and design before coding → build vertical slice → add tests proving the behavior and failure paths → iterate until the oracle is green.
- **Done / spare time:** test hostile inputs and edge cases, check whether a simpler shape works better, capture screenshots or a short video of the working flow, update relevant docs, and run an independent `interrogate` pass.

## `research-feature`

- **Goal:** determine feasibility and compare viable approaches when "done" is a decision, not a single finished PR.
- **Loop:** state the core question and evaluation criteria → prototype 2 to 3 genuinely distinct approaches in isolated branches or scratch prototypes → measure or test each against the same realistic scenario → record pros, cons, failure modes, and hard blockers.
- **Done / spare time:** stress-test the leading candidate against the sharpest counterexample, prune dead prototypes if unrequested (keeping the recommended spike or clean diff), and make the morning [press-release](../../press-release/SKILL.md) an evidence-backed comparison with a clear recommendation.

## `fixes`

- **Goal:** eliminate concrete bugs at their root cause.
- **Loop:** reproduce the failure with a focused command or failing test first → trace to the first wrong result (see [right-fix](../../open-pr/references/right-fix.md)) → apply the minimal root fix → verify the repro now passes and regressions stay green.
- **Done / spare time:** search for sibling occurrences of the same bug class across the repo, add a preventive check via [garden's correct guide](../../garden/references/correct.md) if the mistake can recur, and verify blast radius.

## `gardening`

- **Goal:** raise repo health across performance, architecture, repeated code, docs, or recurring agent mistakes.
- **Loop:** run [garden](../../garden/SKILL.md) in audit mode to rank high-leverage candidates → execute small, atomic prunes one commit at a time → for performance work, ratchet every attempt against [benchmark-checklist](../../benchmark-checklist/SKILL.md) (keep verified wins, revert noise or regressions) → for larger structural changes, generate an [improve-architecture](../../improve-architecture/SKILL.md) report unless refactoring was explicitly authorized.
- **Done / spare time:** run doc-gardening on `README` and `AGENTS.md`, verify no behavior regressed, and compile before/after evidence for the morning report.
