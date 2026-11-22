---
name: interrogate
description: Try to disprove that a diff or design meets its intent. Verify findings with a focused run and report them without editing the change. Use for adversarial review, PR review, or a requested multi-model review.
---

<!-- Adapted from pstack by Lauren Tan. See the bundled MIT license. -->

# Interrogate

Use the requested files or diff. For a PR, read its destination and head, and include working changes only if they are in scope. Restate the intended behavior from the request, work item, and change record. Ask about ambiguity that would change a verdict.

Choose the lenses the diff needs. **Skeptic** asks for a concrete input or sequence that breaks the promise. **Architect** traces ownership and affected contracts. **Minimalist** looks for risk introduced by unnecessary behavior or duplication. Use fewer lenses for a narrow change. The Minimalist reports evidence and leaves edits to the caller.

A direct `/interrogate` invocation requests independent review where the host permits it. In a PR handoff, use an independent pass when the caller or project has authorized it. Follow [the reviewer setup](references/reviewers.md), or cover the relevant lenses directly if an independent pass is unavailable. Give each reviewer the same intent and base/head, plus their lens. Keep any repro or working file outside the target checkout.

Rerun each proposed repro against the stated head, or verify it with a focused prototype for a design. Keep a finding when the evidence shows a real violation of intent. Deduplicate by root cause. A review that could not execute a check should name the coverage gap. Report intent, verified findings with locations and commands, and open verification gaps. Leave fixes to the caller.
