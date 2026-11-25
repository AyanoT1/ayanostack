#!/usr/bin/env bash
# Exit 0 only when every path is safe for AyanoStack to write: outside any git
# work tree, or inside one but ignored and untracked. Anything a teammate
# already shares (tracked) or a commit could pick up (untracked, not ignored)
# is refused.
set -uo pipefail

[[ $# -gt 0 ]] || { echo "usage: personal-path.sh <path>..." >&2; exit 2; }

status=0
for path in "$@"; do
  dir="$(dirname "$path")"
  while [[ ! -d "$dir" ]]; do dir="$(dirname "$dir")"; done
  if ! top="$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null)"; then
    echo "ok       ${path} (outside any git repository)"
    continue
  fi
  rel="$(cd "$dir" && pwd -P)/$(basename "$path")"
  rel="${rel#"$(cd "$top" && pwd -P)"/}"
  if git -C "$top" ls-files --error-unmatch -- "$rel" >/dev/null 2>&1; then
    echo "refuse   ${path} (tracked by ${top})"
    status=1
  elif git -C "$top" check-ignore -q --no-index -- "$rel"; then
    echo "ok       ${path} (ignored in ${top})"
  else
    echo "refuse   ${path} (untracked but not ignored in ${top}; a commit could pick it up)"
    status=1
  fi
done
exit "$status"
