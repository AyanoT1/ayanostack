---
name: swarm
description: Run a requested batch of parallel workers on independent slices or repeat a named task across models. Use when the user explicitly asks for a swarm or a parallel race.
disable-model-invocation: true
---

<!-- Adapted from pstack by Lauren Tan. See the bundled MIT license. -->

# Swarm

Agree on the finish condition, each slice, and the evidence workers should return. For a race, give each candidate the same task, decide how to compare the outputs, and keep the inputs and evaluation fixed. Use the `swarm workers` line in the project's `AGENTS.md`, or the user's model and effort settings. Keep the panel small unless coverage needs more.

Keep each writing worker in the host's isolated checkout or a separate output folder. Pass the exact source revision and input scope. Give read-only workers clear boundaries. Collect final results through the host's completion flow. Check that each result used the assigned inputs and that its evidence supports its verdict.

Return one report of coverage, tradeoffs, and gaps. Mark missing results explicitly. Preserve artifacts required for review and offer any cleanup audit through [gc](../gc/SKILL.md).
