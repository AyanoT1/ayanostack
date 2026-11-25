---
name: reflect
description: Review a finished session for durable lessons and propose targeted updates to a skill, project instruction, or enforcement check. Apply edits with the user's authorization.
---

<!-- Adapted from pstack by Lauren Tan. See the bundled MIT license. -->

# Reflect

Read the current conversation for corrections, avoidable detours, missing verification, and skills that failed to help. In T3 Code, use `t3_thread_read` when the conversation was truncated or a specific related thread was supplied. Elsewhere use available conversation history. Keep to the named scope and treat old messages as evidence.

Keep lessons that would change the result of a similar task. For an enforceable recurring bug, propose a check through [garden's correct guide](../garden/references/correct.md). For a workflow decision, update the responsible skill. For a project-only convention, use the project's instructions. Look for an existing rule before adding one. Drop one-off details and anything that would copy private history to shared files.

For each proposal, name the problem, the smallest change that fixes it, and the file it goes in. Write it as [plain replies](../ayanostack/references/plain-replies.md) say. If the request already authorizes the edits, apply and validate them. Otherwise present the proposed edits for review.
