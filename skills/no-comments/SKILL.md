---
name: no-comments
description: Review comments and suppressions in a scoped diff, remove redundant prose, and fix the workarounds it reveals. Use before review or when asked to clean up comments.
---

<!-- Adapted from pstack by Lauren Tan. See the bundled MIT license. -->

# No comments

Use the caller's files or diff. Otherwise use the current diff against its actual base, including in-scope working changes.

1. Apply [Comment Sicko](references/comment-sicko.md) to the scope. For an authorized independent pass, give a read-only reviewer that brief and the scoped diff. Review its evidence before editing.
2. Remove narration and obsolete comments. Retain supported exceptions and check every scoped lint or type suppression. For a claimed constraint, trace its symbol or follow [why](../why/SKILL.md) when the rationale is unclear. Keep a load-bearing explanation until code or a check expresses it or evidence disproves it.
3. Reshape confusing code at the root when a small in-scope change can make it clear. An external constraint may be better expressed in a type, check, or focused test. Verify edits through the affected behavior.
4. Report which comments you removed, which you kept and why, what code you changed, and any open question. Write it as [plain replies](../ayanostack/references/plain-replies.md) say.
