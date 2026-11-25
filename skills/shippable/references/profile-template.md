# Ship-bar profile template

Copy into the repository (by default `docs/ship-bar.md`) and point to it from the repo's `AGENTS.md` with a line like `Ship bar: docs/ship-bar.md`. Fill it with [survey](survey.md).

```markdown
# Ship bar: <repo>

Surveyed <YYYY-MM-DD> from <N> fix commits since <date>. Used by the `shippable` skill.

## Flows and tiers

| Flow | Entry points | Tier | Why |
| --- | --- | --- | --- |
| <flow> | <paths> | T1 decision | <who decides or receives its output> |
| <CRUD that writes data a T1 flow reads> | <paths> | T2 feeder | <which T1 flow reads it> |
| <isolated CRUD> | <paths> | T3 maintenance | |

Shared code inherits the highest tier of its consumers: <list hot shared modules>.

## Must-haves

### T1 decision
- <checkable rule that would have caught the top T1 defect class>

### T2 feeder
- <rule>

### T3 maintenance
- <rule>. Then stop.

## Known traps

- <silent default, fragile date rule, or twin copies that must change together>, `<path>`.

## Not blockers here

- <structure, type style, or duplication the history shows is safe in this repo>

## Evidence

| Defect class | Count | Example commits |
| --- | --- | --- |
| <class> | <n> | <hashes> |

Fixes per flow: <flow n, flow n>. Regressions from refactors: <n>. Bugs from copies that drifted: <n>.

## Incident ledger

| Date | Ticket | Flow | Defect class | Should have been caught by | Caught now by |
| --- | --- | --- | --- | --- | --- |
| <YYYY-MM-DD> | <key> | <flow> | <class> | <must-have, test, or stage> | <test or check, or "nothing yet"> |
```
