---
name: aita
description: Am I The A##hole? In the Reddit sense, for work. Find teammates whose tickets or PRs wait on your unfinished work, across every board in the project's AGENTS.md, and rank by how urgent their work is, not yours. Use for /aita, "am I blocking anyone", before parking or deprioritizing a ticket, or from triage.
---

# AITA: Am I The A##hole? (am I blocking someone)

Your own ticket can look low-priority or far from its deadline while a teammate's urgent ticket waits on it. This skill judges your open work by the urgency of what it blocks, not by your own queue.

Read the project's `AGENTS.md` for its declared platform profile (`github` or `bitbucket-jira`), ticket sources, and tracker write permissions. Load only the matching [GitHub](references/github.md) or [Bitbucket + Jira](references/bitbucket-jira.md) reference; ask before guessing if those settings are missing. Stay read-only on the tracker until the user confirms a write.

## 1. List everything you own that is not done

Pull every open ticket assigned to you on every declared board, in any status: to do, in progress, on hold, in review, and parked. A parked or backlog ticket is the most likely to block someone unnoticed, so do not filter by priority, sprint, or due date. Add your open PRs and the PRs where your review is requested and still missing.

## 2. Find who waits on each one

For each item, collect the work that depends on it:

- **Explicit links.** Tickets your ticket blocks through the tracker's dependency link (`blocks` in Jira, `blocking` in GitHub issue dependencies). Check the link direction on one real ticket before trusting a query: `blocks` and `is blocked by` point opposite ways.
- **Hierarchy.** Parent tickets or epics owned by someone else that cannot close while your child ticket is open.
- **Review requests.** Teammates' PRs that wait on your review.
- **Mentions without a link.** Open tickets owned by others that name your ticket key or number in their description or recent comments with words like "depends on", "waiting for", "after", or "needs". Treat these as candidates and confirm by reading the text, not from the match alone.
- **Questions to you.** Recent comments on a teammate's ticket that mention you and have no reply from you.

Drop anything assigned to you; this skill is about other people.

## 3. Judge each dependency by the blocked side

For every blocked item, read its real state: owner, status, priority, due date or SLA, sprint and its end date, last update, and whether its owner says they are waiting. Then give your item one verdict:

- **YTA (you're the a##hole).** Someone is waiting now: their ticket is in progress, marked blocked, due soon, in the active sprint, or has an unanswered question to you.
- **NAH (no a##holes here, yet).** A real dependency, but their ticket has not started and is not due soon. Note when it will start to hurt.
- **Stale.** The link no longer holds: their ticket is done or cancelled, yours is actually finished, or the text no longer depends on it. Suggest cleaning the link.

If nothing you own blocks anyone, say **NTA** (not the a##hole) in one line and stop.

Rank YTA items by the blocked ticket's urgency: breached or imminent deadline first, then priority, then how long they have waited. Do not fabricate a due date, priority, or waiting signal you could not read; say "unknown".

## 4. Present

Keep each entry short: your item, the blocked item and its owner, its deadline or priority, the evidence (link, comment, or review request), the verdict, and one suggested move. Write it as [plain replies](../ayanostack/references/plain-replies.md) say. A draft comment for a teammate follows the same rules.

- **In T3 Code.** Render a small dependency view (`html_preview` then `html_render`): your items on the left, the work they block on the right, colored by verdict.
- **In CLI or plain text.** One compact Markdown table per verdict, YTA first.

Suggested moves, pick the smallest that unblocks:

- **Finish or hand over.** Pick it up now, or spawn [assume-task](../assume-task/SKILL.md) on it.
- **Unblock early.** Ship the slice they need (a contract, a field, a merged partial PR) before the rest.
- **Review.** Do the pending review.
- **Say when.** Draft a short comment for the teammate with a realistic date or a reason.
- **Clean up.** Remove or fix a stale link.

## 5. Act only after confirmation

Wait for the user to choose. Post comments, change links, or move tickets only when the user confirms or the project's `AGENTS.md` authorizes that write. Launch `assume-task` threads the same way [triage](../triage/SKILL.md) does: one thread per confirmed ticket, with its key or URL and the chosen mode.
