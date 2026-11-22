---
name: triage
description: Build a concise daily ticket snapshot across all boards and queues declared in the project's AGENTS.md, prioritize by urgency, due date, and quick-win potential, flag agent-ready candidates, and spawn confirmed assume-task threads. Use at the start of the day or when deciding what to work on next.
---

# Triage

Read the project's `AGENTS.md` for its declared platform profile (`github` or `bitbucket-jira`), ticket sources (maintenance/bug boards, continuous improvement queues, active project boards), due-date/SLA rules, and tracker permissions. Load only the matching [GitHub](references/github.md) or [Bitbucket + Jira](references/bitbucket-jira.md) reference; ask before guessing if those settings are missing.

## 1. Gather one unified snapshot

Query every declared source so nothing slips between boards:

- **Assigned to you.** All open tickets assigned to the current user across every declared board.
- **Secondary watch.** When declared in `AGENTS.md`, unassigned urgent, critical, or soon-to-expire tickets on those same boards, kept separate from assigned work.

Inspect real status, priority, due date or SLA, age/staleness, linked PRs, and blocking notes. Do not fabricate priorities or guess missing fields.

## 2. Rank into action buckets

Sort tickets by expiration/SLA risk, severity, and quick-win potential into four scannable buckets:

- **Critical / Today.** Blockers, production failures, or breached and imminent deadlines.
- **Urgent / Soon.** High-priority items that need movement next.
- **Move forward.** Active tasks and bounded fixes worth advancing today.
- **On radar.** Waiting, low-urgency, or upcoming items not to forget.

Tag every ticket with one execution hint:

- **Needs you.** Product decision, ambiguous scope, or high-stakes judgment.
- **Agent-ready.** Small bug report, bounded fix, or self-contained investigation an agent can run in a separate thread while you work elsewhere.

Keep each entry terse—key, short title, board/source, deadline or priority cue, and tag. No prose walls.

## 3. Present cleanly

- **In T3 Code.** Render a simple, uncluttered in-app visual checklist (`html_preview` then `html_render`) grouped by bucket, followed by 1 to 3 concrete candidates for [assume-task](../assume-task/SKILL.md).
- **In CLI or plain text.** Output a compact Markdown checklist (or one compact Markdown table per bucket when fields align better) using the same buckets and tags.

## 4. Spawn `assume-task` only after confirmation

Propose specific candidates and suggested modes (**`auto`** for small bug reports or bounded work; **`investigate`** for complex tickets that benefit from a dedicated human-in-the-loop thread). Wait for confirmation before launching anything.

Once confirmed, launch one thread per selected ticket (in T3 Code via `t3_thread_launch`, using a dedicated worktree when code changes are expected and linking the issue when supported), passing the ticket key/URL, declared settings from `AGENTS.md`, and chosen `assume-task` mode. Keep `triage` read-only on the tracker unless the user explicitly asks for tracker updates.
