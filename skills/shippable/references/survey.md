# Survey: build or refresh a ship-bar profile

The profile answers one question for the repo: which flows need which bar, based on what actually broke. Build it from evidence in the repository, not from general advice. Write it to the path the project's `AGENTS.md` names, or `.ayanostack/ship-bar.md` in the repo, using the [profile template](profile-template.md). Survey is read-only until you write that file and its ledger.

The profile is personal and never committed. Before writing, confirm the folder is ignored (`git check-ignore -q .ayanostack/ship-bar.md`). If it is not, add `.ayanostack/` to the user's global gitignore (`git config --global core.excludesFile`), not to the repo's `.gitignore`, and say so. Do not create a branch, commit, or push for it.

## 1. Read what the repo already says

Read the repo's `AGENTS.md` or `CLAUDE.md`, its architecture and convention docs, module READMEs, and past audits or design notes. Note any stated rules for structure, UI, validation, or tests, and which modules they actually cover.

## 2. Map the flows

List the business flows, not the folders. For each, record its entry points, the modules and shared code it runs through, what it outputs, and who consumes that output (a person deciding, a client, another service). Ask the user which flows they consider critical if the code does not make it clear.

Assign each flow a tier (`T1 decision`, `T2 feeder`, `T3 maintenance`, `T4 throwaway`, as defined in [the skill](../SKILL.md#default-tiers-no-profile)). Mark shared code and the CRUDs that write data a T1 flow reads as `T2`.

## 3. Read the current bar per flow

For the critical flows and three or four plain CRUDs, record briefly:

- Tests that exist and what they actually assert: orchestration and messages, or the numbers.
- How boundaries are typed and validated (DTO validation, schemas, casts, `any`).
- Where missing input silently becomes 0, blank, an empty list, or a default date.
- Money, unit, rounding, and date or month handling.
- Duplication between flows, and whether each case is deliberate decoupling or accidental drift. Check whether fixes landed in every copy.
- Whether static checks (types, lint, tests) can actually fail the pipeline.

## 4. Mine the fix history

This is the evidence that sets the bar. Use roughly the last 12 to 24 months:

```sh
git log --since=<date> --no-merges --pretty='%h %ad %s' --date=short | grep -iE 'fix|hotfix|bug|revert'
```

Deduplicate cherry-picks by subject. Count fixes per flow or module. Then read the diffs of 25 to 40 representative fixes across the critical flows and the CRUDs and classify each by root cause, for example: wrong number or aggregate, wrong date range or timezone, missing data silently defaulted, API or contract shape, stale state, crash, validation, permission or visibility, data loss on save, performance or platform limits, layout only. Tag the ones caused by a refactor or deduplication, and the ones caused by copies that drifted. Keep commit hashes as examples.

Build an **incident ledger** from the fixes that reached production (tickets, hotfixes, reverts): one row per incident with the date, the flow, the defect class, the earliest check that should have caught it (a must-have, a test, a review, a deploy to a non-production stage), and what catches it now, if anything. Use the tracker's maintenance or bug board when there is one: it records what users actually hit, including incidents with no fix commit that names them. Every incident should land in a flow whose tier's must-haves would have caught it. When one does not, the tier map or the must-haves are wrong; fix the profile, not the ledger.

Agree with the user which repos are in scope. Leave incidents from systems outside that scope (an upstream bot, a legacy service) out of the ledger. When the ledger is longer than a screen, keep it in its own file next to the profile (for example `.ayanostack/ship-bar-ledger.md`) and keep only its summary in the profile.

Record what did **not** cause production fixes too. If structural or visual work never shows up as a fix, the bar should not require more of it.

## 5. Write the profile

For each tier, list the must-haves that would have caught the top defect classes for that tier. Keep each must-have checkable: someone should be able to say met or not met with evidence. Name the repo's known traps (a silent default, a fragile date rule, twin copies that must change together) with file paths, so `check` looks there first.

Keep the profile short enough to read before every check, roughly one or two screens. Put the dated evidence (counts, hashes) in a compact section at the end so a later survey can compare.

## 6. Refresh

On refresh, add the new incidents to the ledger and compare the new fix history with the profile's evidence section. Add defect classes that appeared, remove traps that were fixed at the root, and move flows between tiers when their consumers changed. Update the date.

The profile can name internal modules. It must not contain credentials, client names, personal data, or production identifiers.
