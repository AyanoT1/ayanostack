# Assume task on Bitbucket + Jira

Use `twg` for Jira and Bitbucket operations. Discover exact subcommands and flags from the installed CLI (`twg jira --help`, `twg bb --help`).

Read the full ticket (description, acceptance criteria, comments, attachments, linked issues, and history) and search related tickets and past Bitbucket PRs for prior occurrences before diagnosing.

Apply Jira writes—status transitions (such as moving to In Progress), sanitized evidence comments, and classification labels—**only** for the actions authorized in the project's `AGENTS.md` or explicitly approved by the user. Never post credentials, tokens, or sensitive user/company payloads to Jira comments. Keep project keys, transition names, and custom field mappings in each project's own `AGENTS.md`.
