---
name: install
description: Set up AyanoStack across Claude Code, Codex, Antigravity, and T3 Code—symlink skills so `$skill` discovery and relative links work, verify AGENTS.md visibility across all providers, or bootstrap a repository's AGENTS.md from the project template. Use for /install or first-time setup.
---

<!-- Model role lines inspired by pstack's setup-pstack by Lauren Tan (MIT). See the bundled LICENSE. https://github.com/cursor/plugins/blob/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack/skills/setup-pstack/SKILL.md -->

# Install

Determine whether the user wants **host installation** (linking AyanoStack skills onto this machine for their AI providers), **project bootstrap** (configuring a repository's `AGENTS.md`), or **both**. Default to project bootstrap inside another repository where AyanoStack is already installed, and to host installation when run from the AyanoStack repo itself.

## Host installation (Claude Code, Codex, Antigravity & T3 Code)

Install all skills as siblings under each provider's global skills root so both T3 Code `$skill` invocation and relative links between skills (`triage`, `assume-task`, `open-pr`, `garden`, `overnight`, `babysit-pr`) resolve cleanly.

- **Claude Code.** `$HOME/.claude/skills`
- **Codex.** `$HOME/.codex/skills`
- **Antigravity.** `$HOME/.gemini/config/skills` (in T3 Code, verify that `$HOME/.t3/userdata/providers/antigravity/*/config/skills` points to `$HOME/.gemini/config/skills`)

1. **Inspect first.** Run [scripts/install.sh](scripts/install.sh) with `--all --check` (or `--providers ... --check`) to see what is missing or shadowed by stale copies. Never replace an existing non-symlink directory without comparing it first or confirming `--force`.
2. **Link skills.** Run `scripts/install.sh --all` (or `--providers claude,codex,antigravity`) using symlinks by default so `git pull` updates every provider at once. Use `--copy` only when requested.
3. **Verify environment tools.** Check availability of `gh` (for `github`), `twg` (for `bitbucket-jira`), and `node`/`npm` (for `press-release`). Report missing tools without installing system packages unasked.

## Project bootstrap & `AGENTS.md` visibility

Configure the target repository once so every AyanoStack skill and every provider reads the same rules.

1. **Inspect the repo.** Read `git remote -v` (GitHub vs Bitbucket), default branch, existing `AGENTS.md` or `CLAUDE.md` (including parent directories), and project manifests (`package.json`, `Makefile`, `pyproject.toml`) to infer build, lint, test, and dev-server commands.
2. **Ensure all three providers read `AGENTS.md`.**
   - **Codex & Antigravity.** Read `AGENTS.md` natively.
   - **Claude Code.** Checks `CLAUDE.md` first and ignores `AGENTS.md` if any `CLAUDE.md` exists in the repo or an ancestor directory (and older setups require `CLAUDE.md`). Check for shadowing `CLAUDE.md` files; add `@AGENTS.md` to the repo's `CLAUDE.md` when a `CLAUDE.md` already exists, when a parent `CLAUDE.md` could shadow it, or when the user wants guaranteed cross-provider loading.
3. **Confirm only missing choices.** Ask concisely for values that cannot be inferred:
   - **Ticket sources.** Boards, project keys, or filters for [triage](../triage/SKILL.md) plus any unassigned urgent/expiring watch.
   - **Delivery ceiling.** Default and per-board limit (`handoff-only`, `prepare-only`, `draft-pr`, `open-pr`, or `merge-main`).
   - **Tracker writes.** Whether [assume-task](../assume-task/SKILL.md) may transition status, post sanitized evidence comments, or apply classification labels.
   - **Model roles.** The `interrogate reviewers` and `swarm workers` lines for [interrogate](../interrogate/SKILL.md) and [swarm](../swarm/SKILL.md). Offer only models you have confirmed are available on this host. `inherit` uses the current chat model.
4. **Write cleanly.** Merge the AyanoStack section into the project's `AGENTS.md` following [the project template](references/agents-template.md). Preserve unrelated instructions and never write real tokens, credentials, or local machine paths.

**Reply:** provider link status (including T3 Code `$` readiness), `AGENTS.md` / `CLAUDE.md` verification, detected CLIs, and any remaining placeholders to fill in.
