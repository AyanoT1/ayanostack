# Triage on Bitbucket + Jira

Use `twg` for Jira queries and Bitbucket PR cross-checks. Discover exact flags from the installed CLI (`twg jira --help`) and use the board IDs, project keys, JQL filters, and SLA rules declared in the project's `AGENTS.md`.

Query every declared source (for example, maintenance/bug-report board, continuous improvement queue, and active project boards):

- Primary query: open issues assigned to the current user (`assignee = currentUser()` or the project's equivalent filter), fetching key, summary, status, priority, due date, labels, board/project, and updated timestamp.
- Secondary query (when declared): unassigned critical/urgent or soon-to-expire issues in those same projects/boards.
- Cross-check open Bitbucket PRs via `twg bb prs query --help` so tickets with an existing open PR show their real PR state instead of looking untouched.

Keep `triage` read-only on Jira unless the user explicitly authorizes updates. Keep company board IDs, custom fields, and JQL snippets inside each project's own `AGENTS.md`.
