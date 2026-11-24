# AITA on Bitbucket + Jira

Use `twg` for Jira and Bitbucket. Discover exact flags from the installed CLI (`twg jira --help`, `twg bb prs query --help`) and use the project keys, boards, and JQL filters declared in the project's `AGENTS.md`.

Your open work, any status, across every declared project:

```
assignee = currentUser() AND statusCategory != Done
```

Narrow to tickets that block something with `AND issueLinkType = blocks`, but do not rely on that alone: run the mention search below too.

For each of your tickets (`ABC-123` is a placeholder), the tickets it blocks:

```
issue in linkedIssues(ABC-123, "blocks") AND statusCategory != Done
```

Link names differ per site. Read one of your tickets with its links first and use the outward description that site uses for blocking (`blocks`, `is a prerequisite of`, or similar).

Other places to look:

- **Hierarchy.** For each ticket with a parent or epic, read the parent's assignee and status.
- **Mentions without a link.** `text ~ "ABC-123" AND assignee != currentUser() AND statusCategory != Done`, then read the hits to confirm a real dependency.
- **Questions to you.** Read recent comments on the blocked tickets for mentions of you with no reply.
- **Reviews.** Open Bitbucket PRs where you are a reviewer and have not approved or requested changes.

For each blocked ticket, fetch assignee, status, priority, due date, sprint and its end date, and updated timestamp. Keep company project keys, link names, and custom field IDs inside the project's own `AGENTS.md`, never in this repo.
