# Slop lens

Slop is code that looks finished and plausible but was not grounded in the codebase or the problem. Check each sign against the repository, not against taste. A sign becomes a finding only with evidence: a `file:line`, a grep that shows the duplicate or the missing symbol, or a run that shows the wrong result.

| Sign | How to check it |
| --- | --- |
| Silent fallback: `\|\| 0`, `?? 0`, `\|\| 1`, `COALESCE(x, 0)`, a `catch` that returns 0, null, or an empty list | Feed the missing input and show what the user sees. A plausible 0 in a number someone decides with is a wrong result. |
| A symbol, field, endpoint, column, or option that does not exist | Grep the code, the DTOs or schema, and the library source at its pinned version. |
| Reimplements something the repo already has (a formatter, date helper, lookup, client) | Grep for the existing implementation and compare behavior on one input. |
| Tests that cannot fail: they only assert mocks were called, restate the implementation, or pin the current output as expected | Break the logic on purpose and see whether the test still passes, as in [tautological tests](../../garden/references/tautological-tests.md). |
| Guards for states the system cannot reach, which also hide the real error path | Trace whether the state can occur. If it cannot, show what the guard swallows when something else goes wrong. |
| An abstraction, generic, or option with a single caller and no second use in sight | Count callers. Report as a Minimalist finding, not a defect. |
| Half-finished paths: TODO stubs, branches that return a placeholder, a handler that logs and continues | Call the path and show the placeholder reaching the output. |
| Changes outside the task: reformatting, renames, unrelated refactors | List them against the intent. They are scope findings for the caller. |
| Comments that narrate the code, or confident comments that the code contradicts | Hand them to [no-comments](../../no-comments/SKILL.md), unless the comment hides a real defect. |

Do not count style, length, or the amount of comments as quality in either direction. Long, well-commented code is not more correct, and judges tend to rate it as more rigorous than it is.
