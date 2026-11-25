---
name: shippable
description: Answer "is this code shippable?" against the project's own ship bar, which is stricter for flows that can do more harm. The answer is Ship or Not yet, with nothing in between. A blocker needs a real failure, and the reply says when to stop polishing. Use mid-session for "is this shippable", "can I ship this", "is this good enough", "am I over-polishing"; as the final gate of open-pr; or in survey mode to build or refresh a repo's ship-bar profile.
---

# Shippable

The first 70% of a change is fast. The last 25% takes most of the time, and most of that time goes to structure, patterns, removing duplicates, and types. Those rarely cause the bugs that reach production. This skill asks what the change can break, not how polished it could be.

The bar changes with the flow. A screen that feeds a budget or a client report needs more proof than an admin form. Each repo has its own **ship-bar profile**, built from its fix history, because that history shows what actually breaks. The profile is personal. It lives in the repo's `.ayanostack/` folder, which the global gitignore keeps out of commits. Never commit it or anything else AyanoStack writes: each developer has their own skills, and a committed agent file changes how other people's agents behave.

## What this is not

A code review asks "is this code good?" and returns many comments. This skill asks one question, "can this change go to production for this flow?", and returns one answer.

- **One question.** Naming, structure, and style are out of scope unless they cause a real failure. Use [interrogate](../interrogate/SKILL.md) or the team's review for those.
- **The bar comes first.** Take it from the profile before you read the diff, so anyone gets the same answer for the same change.
- **Look past the diff.** Check real data, other copies of the same rule, other long-lived branches, and whatever reads the output.
- **Use it early.** Run it at 70% to learn whether the remaining polish is needed. On its own it is one judge, not the full pre-PR process.
- **The last step of [open-pr](../open-pr/SKILL.md).** Findings from interrogate and blast-radius arrive as possible blockers. Sort them against the bar without redoing them. `open-pr` opens the PR only on Ship.

## Modes

- **`check`** (default): judge the current diff, branch, or PR and give a verdict.
- **`survey`**: build or refresh the repo's profile from its code and fix history. Follow [survey](references/survey.md) and the [profile template](references/profile-template.md).

## Load the profile

1. Look for a `Ship bar:` line in the project's `AGENTS.md`. If there is none, look for `.ayanostack/ship-bar.md` in the repo that owns the diff. Run `git check-ignore -q .ayanostack/ship-bar.md`. If git does not ignore the file, say so first and do not stage it.
2. In a workspace with several repos, use the profile of the repo that owns the diff. Judge a change that spans repos with each repo's profile.
3. With no profile, say so in one line, use the default tiers below, and offer `survey` at the end. Still give a verdict.
4. If the profile is older than about six months, or names modules that are gone, say so and use it anyway.

## Check

### 0. Who judges

The author of a change does not judge it. If this session wrote or edited the change, give the check to one fresh read-only subagent. Pass it the base, head, intent, and profile path, and none of your own opinions. Then confirm its blockers yourself before you report. If you cannot start a subagent, say the verdict is self-judged.

For a T1 flow or a change that is hard to undo, inside `open-pr` or when the user asks, use the [interrogate](../interrogate/SKILL.md) council with its Slop lens to find possible blockers. Slop counts only when it causes a real failure in this flow. Otherwise send it to [simplify-diff](../simplify-diff/SKILL.md), [no-comments](../no-comments/SKILL.md), or the after-merge list.

### 1. Find what the change can affect

Read the diff against its base, and the ticket or request. List the flows whose **output** can change, not only the files touched. Follow the data one or two steps: if an admin form writes a field that a pricing report reads, that field gets the report's tier. A shared component, formatter, or helper gets the highest tier of the code that uses it.

### 2. Pick the tier, and ask whether you can undo it

The tier is the highest tier of any flow whose output changes. Use the profile's map of flows to tiers.

Then ask whether a redeploy undoes the change:

- **Hard to undo:** database shapes and migrations, APIs that other teams or services call, anything sent outside (emails, client reports, downloads), money or commitments, deletes. A redeploy does not take these back. Before they ship, they need a rollback plan, or a split into two releases: first add the new thing, then switch to it.
- **Easy to undo:** a redeploy fixes it and no data needs repair. Lean toward Ship.

Then ask whether the change claims to keep behavior the same: moving code to a shared place, changing the database or backend, a rewrite, removing duplicates, or a large merge. These break more often than new formulas, because nobody checks the output. They need four more checks:

- The output is the same before and after, on one real dataset.
- Every caller and every copy of the moved logic is found.
- Wiring and registration are checked in every module that imports it.
- The same logic on other long-lived branches is compared.

### 3. Check the tier's must-haves

Apply the profile's must-haves for the tier, plus the always-blockers below. Mark each must-have **met** (with the evidence), **not met**, or **not applicable** (with the reason).

Get the strongest evidence that is cheap to get. From weakest to strongest, as [blast-radius](../blast-radius/SKILL.md) ranks them: point at a line, run the real code, reproduce it in the running app.

Look first for the kinds of bugs the profile says reach production in this flow. They matter more than any generic checklist.

Some things look like evidence but do not prove a number is right: tests that only check mock calls, snapshots of the current output, and reading the code again. Real evidence compares against something independent: the previous output, a hand calculation, a direct query, or the old system.

### 4. Sort every finding

- **Blocker:** a real failure. Name the input and the wrong result: a wrong number, lost data, a crash on the main path, a security hole, or a hard-to-undo change with no rollback. A must-have that is not met is also a blocker.
- **Unproven:** you suspect a failure but cannot show it, or a must-have has no evidence yet. On T1 and T2 it counts as a blocker. Write it as the exact check that settles it (a query, a test case, a before-and-after run). If that check is cheap, run it now, so it becomes a blocker or goes away. On T3 and T4, drop it.
- **Everything else** is outside the verdict. A real improvement that breaks nothing goes on the after-merge list. A preference is a `Nit:` or nothing.

### 5. Verdict

There are only two answers:

- **Ship:** no blockers, and every must-have is met or not applicable.
- **Not yet:** one or more blockers. List only those, each with the cheapest fix and a rough effort. Once they are fixed, the answer is Ship, with no new review round.

Answer with one of those two words. Leave out "ship with follow-ups", "ship if", "mostly ready", "good enough but", scores, and confidence levels. A middle answer is the 7 out of 10 of code review: it feels safe, commits to nothing, and keeps the author polishing. If you cannot decide, you have an unproven item: name the check, run it if you can, and decide.

After **Ship**, stop there; add no "but you could also…". The after-merge list is optional and is not work for this change.

End with a **stop polishing** line. Name the work the author will want to keep doing that the bar does not need, so they can stop.

If an earlier `check` of this change found no blockers and the author kept polishing, say plainly that it was already ready to ship.

### 6. When a verdict expires, and how many rounds

- **A verdict is for one exact version of the code.** Record the head commit and `git diff <base>...HEAD | git patch-id --stable`. Any later change, including fixes made during the check, cancels the verdict. A rebase with the same patch id does not.
- **Three rounds at most.** From round two on, report only blockers that are still open or that the fixes added. Raise no new small points. If blockers remain after round three, stop and let the user choose: cut scope, accept the risk out loud, or make a decision the code cannot make.

## Default tiers (no profile)

### T1 critical

Numbers people act on or send outside: money, energy, prices, budgets, evaluations, rankings, reports, anything a client gets. Changes that are hard to undo.

- One real case is checked against an independent source (previous output, a spreadsheet, a direct query) and kept as a test.
- Missing input does not quietly become 0, 1, blank, or a default (`|| 0`, `?? 0`, `COALESCE(x, 0)`, a `catch` that returns 0). It fails, or the user sees a warning.
- Units, rounding, and date ranges are explicit. There is one test each for a month that spans two periods, a new year, local midnight vs UTC, and days 29 to 31.
- It adds up the right things (per item vs total) and picks the right record: the latest version, the last one sent, deleted rows left out, start and end dates both checked. One test includes a look-alike record that must be ignored.
- Batch loads, bulk sends, and scheduled jobs end with every item done, sent, or listed as failed.
- Copies of the same rule, in this branch and on other long-lived branches, change together.
- Someone finds out when it breaks: a log, alert, or check that a person looks at.

### T2 supporting

Inputs, APIs, permissions, and shared code that T1 flows or many screens depend on.

- The API shape is checked against the real code that reads it: fields, ids, paging, nulls.
- Input is validated where it comes in.
- Code that uses a changed shared component still works.
- Who sees what is checked for each role and status, as a table.
- Screens still render when optional data is missing.
- Saving does not erase fields the user did not edit.
- Config or infrastructure changes are deployed once to a non-production environment.

### T3 routine

Standalone CRUD, admin and internal screens, reference data.

- The main path works in the running app: list, filter, page, create, edit, delete.
- The endpoint checks auth and validates input (sign, range, real dates).
- Backend errors reach the user.
- The project's UI and structure conventions are followed.

Then stop.

### T4 throwaway

Scripts, prototypes, spikes, one-off migrations that already ran.

- It ran once and did what it should. Anything else goes.

## Always blockers

At any tier: lost or corrupted data, secrets or personal data in the diff, a crash on the main path, a security or permission hole, and a hard-to-undo change with no rollback plan.

## Not blockers by default

These count only with a real failure case. Otherwise they are nits or after-merge items.

- Type style: `type` vs `interface`, generics, or clever types in app code. Strict types belong where data enters or leaves (API responses, request bodies, saved data). Inside the app, plain types and inference are fine. [typescript-best-practices](../typescript-best-practices/SKILL.md) covers checks at those edges.
- Duplication between flows that change for different reasons. Two similar report generators that grow apart are cheaper than one shared abstraction that ties them together. Duplication is a blocker only when the copies hold **the same business rule that must change together**, and the diff changed one copy but not the others.
- Naming, file layout, or pattern purity, unless the project's conventions require them.
- Cleanup of nearby old code that the change does not need. Suggest it as a separate change.
- Coverage numbers, or old type or lint errors that did not grow.

## Reply

Write it as [plain replies](../ayanostack/references/plain-replies.md) say. The first line is the verdict (**Ship** or **Not yet**), the tier with its plain name, and the round. Then:

1. **What it affects:** which output can change, and whether it is easy or hard to undo.
2. **Bar:** each must-have as met, not met, or not applicable, with its evidence.
3. **Blockers** (Not yet only): the input, the wrong result, where it is, the cheapest fix, and the effort. Unproven items appear here as the check to run.
4. **Stop polishing:** what to stop doing.
5. **After merge** (optional): up to three ticket lines, each with why it matters. Not work for this change. Leave it out when empty.

Then name the profile and its date (or the defaults), who judged and with which models, and the head commit and patch id the verdict is for. If the check found a kind of bug the profile does not list, suggest one line to add to it.

[Sources](references/sources.md) lists the people and research behind these defaults.
