---
name: shippable
description: Answer "is this code shippable?" against the project's own ship bar, which sets a different bar per flow. The verdict is binary, Ship or Not yet: blockers need a concrete failure, there is no middle verdict, and the reply says when to stop polishing. Use mid-session for "is this shippable", "can I ship this", "is this good enough", "am I over-polishing"; as the final gate of open-pr; or with survey mode to build or refresh a repo's ship-bar profile.
---

# Shippable

Getting from 0 to 70% of a solution is fast. Getting from 70 to 95% takes most of the time, and most of that time goes to structure, patterns, deduplication, and types, which rarely cause the defects that reach production. This skill sets the bar by what the change can break, not by how polished it could be.

The bar is per project and per flow. A screen that feeds a budget or a report someone decides with is not held to the same bar as an admin CRUD. Each repository gets its own **ship-bar profile**, built from that repo's history because that is what knows what breaks prod. The profile is personal: it lives in the repo's `.ayanostack/` folder, which a global gitignore keeps out of every commit. Never commit it or anything else AyanoStack writes: each developer has their own skills, and committed agent files change how other people's agents behave.

## Not a code review

A code review asks whether the code is good and returns comments. This skill asks one narrower question, whether this change meets this flow's bar for production, and returns one word.

- **One question, not many.** Structure, naming, and style are out of scope unless they cause a concrete failure. Use [interrogate](../interrogate/SKILL.md) or the project's review for those.
- **The bar is fixed before reading the diff.** It comes from the repo's profile and the flow's tier, not from the reviewer's taste, so the same change gets the same answer from anyone.
- **Evidence beyond the diff.** Real data, other copies of the rule, other long-lived branches, and what consumes the output.
- **For the author, while polishing.** Run it mid-session at 70%, not only when the PR is open, to know whether the remaining days are needed. Standalone, it is one independent judge, not the full pipeline.
- **The gate of [open-pr](../open-pr/SKILL.md).** Its pre-PR pass ends here: the findings of interrogate and blast-radius arrive as candidate blockers, this skill sorts them against the bar without redoing them, and `open-pr` publishes only on Ship.

## Modes

- **`check`** (default): judge the current diff, branch, or PR against the profile and return a verdict.
- **`survey`**: build or refresh the repo's profile from its code and fix history. Follow [survey](references/survey.md) and the [profile template](references/profile-template.md).

## Load the profile

1. Read the project's `AGENTS.md` for a `Ship bar:` line. Without one, look for `.ayanostack/ship-bar.md` in the repo that owns the diff. Check that git ignores it (`git check-ignore -q .ayanostack/ship-bar.md`); if it does not, say so before anything else and do not stage it.
2. In a workspace with several repos, use the profile of the repo that owns the diff. A change across repos is judged by each repo's profile.
3. With no profile, say so in one line, use the default tiers below, and offer `survey` at the end. Do not block a verdict on a missing profile.
4. If the profile is older than about six months or names modules that no longer exist, say so and still use it.

## Check

### 0. Who judges

The verdict only counts from an agent that did not write the change. If this session wrote or edited it, hand the check to one fresh read-only subagent with the base, head, intent, and profile path, and none of your own conclusions; then verify its blockers yourself before reporting. If no subagent is available, say the verdict is self-judged.

For a T1 flow or a one-way door, inside `open-pr` or when the user asks, use the [interrogate](../interrogate/SKILL.md) council with its Slop lens as the source of candidate blockers. Slop counts toward the verdict only when it produces a concrete failure on this flow; otherwise it goes to [simplify-diff](../simplify-diff/SKILL.md), [no-comments](../no-comments/SKILL.md), or the after-merge list.

### 1. Read the change and the flows it reaches

Read the diff against its base and the ticket or request. List the flows whose **output** can change, not just the files touched. Follow the data one or two hops: a CRUD that writes a field a pricing or report flow reads inherits that flow's tier for that field. A shared component, formatter, or helper inherits the highest tier of its consumers.

### 2. Pick the tier and the door

The tier is the highest tier of any flow whose output changes, using the profile's map of flows to tiers. Then decide the door:

- **One-way door:** persisted shapes and migrations, public or cross-service contracts, data sent outside (emails, client reports, files a client downloads), money or commitments, deletes. These need a rollback or a prepare-then-activate split before they ship.
- **Two-way door:** everything you can revert with a redeploy and no data repair. Lean toward shipping.

Then check whether the change claims to preserve behavior: a move to shared code, a data-store or backend migration, a rewrite, a deduplication, or a large merge. These cause more regressions than new formulas because nobody checks the output. Their bar adds: identical output before and after on one real dataset, every caller and copy of the moved logic found, registrations and wiring checked in every module that imports it, and the same logic on other long-lived branches compared.

### 3. Run the tier's bar

Apply the profile's must-haves for that tier, and the always-blockers below. For each must-have, record one of: **met** (with the evidence), **not met**, or **not applicable** (with the reason). Get evidence as far as cheaply possible, using the levels in [blast-radius](../blast-radius/SKILL.md): pointing at a line is weaker than running real code, which is weaker than reproducing it in the running app.

Look for the defect classes the profile says actually reach production in that flow. Those matter more than any generic checklist.

Tests that only assert mock calls, or fixtures that pin the current output, do not count as evidence that a number is right. Neither does a code review: reading the code again rarely finds a missing value or a period edge. A comparison against a reference does: the previous output, a hand calculation, a direct query, or the legacy system.

### 4. Sort every finding

- **Blocker.** A concrete failure: an input or sequence that produces a wrong number, lost data, a crash on the main path, a security hole, or a one-way door without rollback. Name the input and the wrong output. A must-have of the tier that is not met is also a blocker.
- **Unverified.** You suspect a failure but could not show it, or a must-have has no evidence yet. On T1 and T2 this counts as a blocker, written as the exact check that settles it (the query, fixture, or parity run). Run that check yourself when it is cheap, so it becomes a blocker or disappears. On T3 and T4, drop it.
- **Everything else** is not part of the verdict. A real but non-breaking improvement goes to the after-merge list; a preference is a `Nit:` or nothing.

### 5. Verdict

Two verdicts only. There is no middle one.

- **Ship.** No blockers. Every must-have of the tier is met or not applicable.
- **Not yet.** One or more blockers. List only those, each with the cheapest action that clears it and a rough effort. Once they clear, the verdict is Ship without another review round.

Do not write "ship with follow-ups", "ship if", "mostly ready", "good enough but", a score, or a confidence percentage. A middle verdict is the 7 out of 10 of code review: it feels safe to give, commits to nothing, and leaves the author polishing to earn the missing points. If you hesitate between the two, the hesitation is an unverified item: name the check, run it if you can, and decide.

After **Ship**, do not add "but you could also…". The after-merge list is optional and is never work for this change.

Then a **stop polishing** line: name the work the author is likely tempted to keep doing that the bar does not require, so they can stop.

If a previous `check` on the same change found no blocker and the author kept polishing, say plainly that it was already shippable.

### 6. Expiry and rounds

- **A verdict belongs to one version of the code.** Record the head commit and `git diff <base>...HEAD | git patch-id --stable`. Any change after that, including fixes made during the check, voids the verdict; a rebase with the same patch id does not.
- **At most three rounds per change.** From the second round on, report only blockers that remain or that the fixes introduced; do not raise new non-blocking points. If blockers remain after the third round, stop looping and hand the user the choice: cut scope, accept the risk explicitly, or take a decision the code cannot make.

## Default tiers (no profile)

| Tier | What | Must-haves |
| --- | --- | --- |
| **T1 decision** | Numbers people decide with or send outside: money, energy, prices, budgets, evaluations, rankings, reports, anything a client receives. One-way doors. | One real case checked against an independent source (previous output, spreadsheet, direct query) and kept as a fixture test. Missing input is not silently 0, 1, blank, or a default (`|| 0`, `?? 0`, `COALESCE(x, 0)`, a `catch` that returns 0); it fails or shows as a warning the user sees. Units, rounding, and periods are explicit, with one case each for a month split across periods, a year rollover, local midnight vs UTC, and days 29 to 31. Aggregation scope is right (per entity vs total), and so is the record: latest version, last one sent, soft-deleted rows excluded, validity checked at both ends, with one test against a decoy record. Batch loads, bulk sends, and scheduled jobs end with every item processed, sent, or listed as failed. Twin copies of the same rule, in this branch and on other long-lived branches, changed together. You can tell if it breaks (a log, alert, or check someone looks at). |
| **T2 feeder** | Inputs, contracts, permissions, and shared code that T1 flows or many screens depend on. | The contract is checked against its real consumer (shape, ids, pagination, nulls). Input is validated where it enters. Consumers of a changed shared component still pass. Role or status visibility checked as a table. Screens render with optional data missing. Saves do not drop fields they did not edit. Config or infra changes deployed once to a non-production stage. |
| **T3 maintenance** | Isolated CRUD, admin, internal screens, reference data. | Happy path works live: list, filter, paginate, create, edit, delete. The endpoint has its auth guard and input validation (sign, range, real calendar dates). Backend errors reach the user. Project conventions for UI and structure followed. Then stop. |
| **T4 throwaway** | Scripts, prototypes, spikes, one-off migrations already run. | It ran once and did what it should. Vibe-coding territory. |

## Always blockers

Whatever the tier: data loss or corruption, secrets or personal data in the diff, a crash on the main path, a security or permission hole, and a one-way door without a rollback plan.

## Not blockers by default

Raise these only with a concrete failure scenario. Otherwise they are nits or after-merge items.

- `type` vs `interface`, whether to add generics, or how clever a type is in application code. Strict types belong at boundaries (API responses, request bodies, persisted data). Inside, plain types and inference are fine. [typescript-best-practices](../typescript-best-practices/SKILL.md) covers boundary validation.
- Duplication across flows that change for different reasons. Two similar report generators that must evolve separately are cheaper than a shared abstraction that couples them. Duplication becomes a blocker only when the copies encode **the same business rule that must change together** and the diff changed one copy but not the others.
- Naming, file layout, or pattern purity, unless the project's conventions require them.
- Refactoring neighbouring legacy code the change does not need. Propose it as a separate change.
- Coverage percentages, or pre-existing type or lint errors at or below their baseline.

## Reply

The first line is the verdict, **Ship** or **Not yet**, the tier, and the round. Then:

1. **Flows reached:** what output can change, and the door.
2. **Bar:** each must-have as met, not met, or not applicable, with its evidence.
3. **Blockers** (only for Not yet): input, wrong output, location, cheapest fix and effort. Unverified items appear here as the check to run.
4. **Stop polishing:** what not to keep doing.
5. **After merge** (optional): at most three ticket lines, each with why it matters. Not work for this change. Omit when empty.

Name the profile and its date (or the defaults), who judged and with which models, and the head commit and patch id the verdict belongs to. When the review surfaced a defect class the profile does not list, suggest one line to add to it.

[Sources](references/sources.md) lists the practitioners and research behind these defaults.
