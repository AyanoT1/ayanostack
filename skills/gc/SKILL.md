---
name: gc
description: Audit stale worktrees, merged branches, and known task artifacts. Remove only the specific items the user confirms. Use for a requested cleanup or an audit during PR handoff.
---

<!-- Adapted from pstack's worktree cleanup playbook by Lauren Tan. See the bundled MIT license. -->

# GC

Audit the repositories and task artifacts in scope. Use Git's registered worktree list and the host's active worktree and thread status when available. Check the actual PR destination and record what proves a branch's work landed. Squash merges need PR evidence. Compare unique commits, tracked and untracked changes, and local-only artifacts before proposing removals.

Hold primary checkouts, worktrees tied to open or active threads, open PR branches, branches with unpushed work, and any path whose ownership or contents are uncertain. Treat versioned copies of application files as code that belongs in a reviewed cleanup. Include scratch files only when their origin and continued use are known.

Show the exact paths or refs, why each is safe to remove, and the space recovered when relevant. An audit handoff ends here. For confirmed cleanup, recheck the item immediately before acting and use the host and Git's supported removal operations. Stop on any new edits, active thread, or refusal. Report removals and holds separately.
