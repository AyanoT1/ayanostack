# Triage on GitHub

Use the host's issue tools (`list_issues`, `read_issue`) when available in T3 Code, or `gh issue list` / `gh search issues` in a CLI session. Follow the repositories, labels, milestones, and project boards declared in `AGENTS.md`.

Example CLI queries:

```sh
gh issue list --assignee @me --state open --limit 50 --json number,title,labels,milestone,updatedAt,url
gh issue list --label urgent --state open --limit 30 --json number,title,assignees,labels,updatedAt,url
```

Check linked open PRs (via `gh pr list --state open`) so tickets already in review or blocked on CI are flagged accurately instead of double-picked. Keep queries read-only during triage.
