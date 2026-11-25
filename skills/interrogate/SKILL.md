---
name: interrogate
description: Try to disprove that a diff or design meets its intent, as one reviewer or as a blind council of judges from different model families, including a slop lens for plausible but ungrounded code. Verify findings with a focused run and report them without editing the change. Use for adversarial review, PR review, "is this slop", a council of judges, or a requested multi-model review, mid-session or from open-pr.
disable-model-invocation: true
---

<!-- Adapted from pstack by Lauren Tan. See the bundled MIT license. -->

# Interrogate

Use the requested files or diff. For a PR, read its destination and head, and include working changes only if they are in scope. Mid-session, use the current working changes against their base. Restate the intended behavior from the request, work item, and change record. Ask about ambiguity that would change a verdict.

Choose the lenses the diff needs:

- **Skeptic** asks for a concrete input or sequence that breaks the promise.
- **Architect** traces ownership and affected contracts.
- **Minimalist** looks for risk introduced by unnecessary behavior or duplication. It reports evidence and leaves edits to the caller.
- **Slop** checks whether the code is grounded in the codebase and the problem: silent fallbacks, symbols that do not exist, reimplemented helpers, tests that cannot fail. Follow [the slop lens](references/slop.md).

Use fewer lenses for a narrow change.

## Council

A direct `/interrogate` invocation requests independent review where the host permits it. In a PR handoff, or from [shippable](../shippable/SKILL.md) on a high-stakes flow, use the council when the caller or project has authorized it. Follow [the reviewer setup](references/reviewers.md), or cover the relevant lenses directly if an independent pass is unavailable.

- **Blind.** Each judge gets the same intent, base and head, and its lenses. It does not learn who or which model wrote the change, what the other judges found, or what you suspect.
- **Mixed families.** Include at least one judge from a model family other than the one that wrote the change when the host offers one. Judges favor code that reads like their own.
- **Evidence, not votes.** A finding stands on its repro, not on how many judges raised it. One judge with a failing run outweighs two that see no problem. Two judges agreeing without a run is still unverified.
- **Someone else reruns it.** Rerun each proposed repro yourself, or through a judge that did not raise it, against the stated head. Keep repro and working files outside the target checkout.

## Report

Keep a finding when the evidence shows a real violation of intent. Deduplicate by root cause. A review that could not execute a check should name the coverage gap. Report intent, the judges and their model families, verified findings with locations and commands, and open verification gaps. Leave fixes to the caller; `shippable` decides which findings block.
