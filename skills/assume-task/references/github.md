# Assume task on GitHub

Use the host's issue tools (`read_issue`, `link_issue`, `comment_on_issue`, `set_issue_state`) when available in T3 Code, or `gh issue` in a CLI session. Link the issue to the current thread when starting work.

Check existing related issues and PRs for prior occurrences:

```sh
gh issue view "$number" --comments
gh issue list --search "$keyword" --state all --limit 20
gh pr list --search "$keyword" --state all --limit 20
```

Apply tracker writes (comments, labels, state changes) **only** when authorized by the project's `AGENTS.md` or explicit user instruction. Never post raw secrets, tokens, or private data in issue comments.
