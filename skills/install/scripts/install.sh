#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: skills/install/scripts/install.sh [options]

Install all AyanoStack skills (directories containing SKILL.md) into one or more
provider skill roots so relative links between skills and T3 Code `$skill`
discovery work cleanly.

Options:
  --all                 Install into Claude Code, Codex, and Antigravity roots.
  --providers <list>    Comma-separated list from: claude,codex,antigravity
  --target <dir>        Custom destination skills directory (repeatable).
  --copy                Copy skill directories instead of creating symlinks.
  --force               Replace existing entries at the destination.
  --dry-run             Show planned actions without modifying the filesystem.
  --check               Verify existing links across configured targets only.
  --prune               Remove stale links that point into this repo's skills/
                        but whose skill no longer exists.
  -h, --help            Show this help message.
EOF
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
SKILLS_SRC="${REPO_ROOT}/skills"

declare -a TARGETS=()
MODE="symlink"
FORCE=0
DRY_RUN=0
CHECK_ONLY=0
PRUNE=0

provider_dir() {
  case "$1" in
    claude) echo "${HOME}/.claude/skills" ;;
    codex) echo "${HOME}/.codex/skills" ;;
    antigravity) echo "${HOME}/.gemini/config/skills" ;;
    *)
      echo "Unknown provider: $1 (expected claude, codex, or antigravity)" >&2
      exit 1
      ;;
  esac
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --all)
      TARGETS+=("$(provider_dir claude)" "$(provider_dir codex)" "$(provider_dir antigravity)")
      shift
      ;;
    --providers)
      [[ $# -ge 2 ]] || { echo "Missing value for --providers" >&2; exit 1; }
      IFS=',' read -r -a provs <<< "$2"
      for p in "${provs[@]}"; do
        TARGETS+=("$(provider_dir "$p")")
      done
      shift 2
      ;;
    --target)
      [[ $# -ge 2 ]] || { echo "Missing value for --target" >&2; exit 1; }
      TARGETS+=("$2")
      shift 2
      ;;
    --copy)
      MODE="copy"
      shift
      ;;
    --force)
      FORCE=1
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --check)
      CHECK_ONLY=1
      shift
      ;;
    --prune)
      PRUNE=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ "${#TARGETS[@]}" -eq 0 ]]; then
  echo "Error: pass --all, --providers <list>, or --target <dir>." >&2
  usage >&2
  exit 1
fi

for target in "${TARGETS[@]}"; do
  echo "==> ${target}"
  installed=0
  skipped=0
  ok=0
  missing=0

  if [[ "$CHECK_ONLY" -eq 0 && "$DRY_RUN" -eq 0 ]]; then
    mkdir -p "$target"
  fi

  for skill_md in "${SKILLS_SRC}"/*/SKILL.md; do
    skill_dir="$(dirname "$skill_md")"
    skill_name="$(basename "$skill_dir")"
    dest="${target}/${skill_name}"

    if [[ "$CHECK_ONLY" -eq 1 ]]; then
      if [[ -L "$dest" && "$(readlink -f "$dest")" == "$(readlink -f "$skill_dir")" ]]; then
        ok=$((ok + 1))
      elif [[ -e "$dest" || -L "$dest" ]]; then
        echo "  diff    ${skill_name} (${dest} does not symlink to ${skill_dir})"
        missing=$((missing + 1))
      else
        echo "  missing ${skill_name}"
        missing=$((missing + 1))
      fi
      continue
    fi

    if [[ -L "$dest" && "$MODE" == "symlink" && "$(readlink -f "$dest")" == "$(readlink -f "$skill_dir")" ]]; then
      skipped=$((skipped + 1))
      continue
    fi

    if [[ -e "$dest" || -L "$dest" ]]; then
      if [[ "$FORCE" -eq 0 ]]; then
        echo "  skip    ${skill_name} (exists at ${dest}; pass --force to replace)"
        skipped=$((skipped + 1))
        continue
      fi
      if [[ "$DRY_RUN" -eq 1 ]]; then
        echo "  replace ${dest}"
      else
        rm -rf "$dest"
      fi
    fi

    if [[ "$MODE" == "symlink" ]]; then
      if [[ "$DRY_RUN" -eq 1 ]]; then
        echo "  link    ${dest} -> ${skill_dir}"
      else
        ln -s "$skill_dir" "$dest"
      fi
    else
      if [[ "$DRY_RUN" -eq 1 ]]; then
        echo "  copy    ${skill_dir} -> ${dest}"
      else
        cp -R "$skill_dir" "$dest"
      fi
    fi
    installed=$((installed + 1))
  done

  stale=0
  if [[ -d "$target" ]]; then
    for link in "$target"/*; do
      [[ -L "$link" ]] || continue
      dest_raw="$(readlink "$link")"
      case "$dest_raw" in
        "${SKILLS_SRC}"/*) ;;
        *) continue ;;
      esac
      [[ -f "${dest_raw}/SKILL.md" ]] && continue
      stale=$((stale + 1))
      if [[ "$PRUNE" -eq 1 && "$CHECK_ONLY" -eq 0 ]]; then
        if [[ "$DRY_RUN" -eq 1 ]]; then
          echo "  prune   ${link} -> ${dest_raw}"
        else
          rm "$link"
          echo "  pruned  ${link}"
        fi
      else
        echo "  stale   $(basename "$link") (${dest_raw} no longer exists; pass --prune to remove)"
      fi
    done
  fi

  if [[ "$CHECK_ONLY" -eq 1 ]]; then
    echo "  status: ${ok} linked, ${missing} missing/diverged, ${stale} stale"
  else
    echo "  done (${MODE}): ${installed} installed, ${skipped} already present/skipped"
  fi
done
