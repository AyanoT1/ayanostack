# Prepare the diff

Use the base and scope supplied by `open-pr`. Work through these passes on the same diff so each one answers a distinct question.

1. [Right fix](right-fix.md) checks that the change solves the actual problem. Repair an in-scope root cause or report what prevents that repair.
2. [Simplify diff](../../simplify-diff/SKILL.md) trims unnecessary code and reuses existing implementations. [No comments](../../no-comments/SKILL.md) reviews comments and the workarounds they expose.
3. [Interrogate](../../interrogate/SKILL.md) tests whether the final diff meets the intent. [Blast radius](../../blast-radius/SKILL.md) tests effects outside the changed lines. Share findings so one repro can support both passes. Apply verified in-scope fixes and recheck the affected behavior.

Give `open-pr` a short account of the root cause, meaningful changes from review, verified risks, and anything unresolved. Use the project's normal completion criteria for blockers. `open-pr` owns running the required final checks and publishing.
