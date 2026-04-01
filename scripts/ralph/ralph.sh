#!/bin/bash
# Ralph Wiggum - Long-running AI agent loop
# Usage: ./scripts/ralph/ralph.sh --impl <NN-slug> [--tool amp|claude|opencode] [max_iterations]
# Implementation dirs are numbered: implementations/01-web-framework-benchmark-2026/

set -e

# Parse arguments
TOOL="opencode"  # Default to opencode for this project
MAX_ITERATIONS=50
IMPL_SLUG=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --impl)
      IMPL_SLUG="$2"
      shift 2
      ;;
    --impl=*)
      IMPL_SLUG="${1#*=}"
      shift
      ;;
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --tool=*)
      TOOL="${1#*=}"
      shift
      ;;
    *)
      # Assume it's max_iterations if it's a number
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_ITERATIONS="$1"
      fi
      shift
      ;;
  esac
done

# Require --impl
if [[ -z "$IMPL_SLUG" ]]; then
  echo "Error: --impl <NN-slug> is required."
  echo "Usage: ./scripts/ralph/ralph.sh --impl <NN-slug> [--tool amp|claude|opencode] [max_iterations]"
  echo "Example: ./scripts/ralph/ralph.sh --impl 01-web-framework-benchmark-2026"
  exit 1
fi

# Validate tool choice
if [[ "$TOOL" != "amp" && "$TOOL" != "claude" && "$TOOL" != "opencode" ]]; then
  echo "Error: Invalid tool '$TOOL'. Must be 'amp', 'claude', or 'opencode'."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
IMPL_DIR="$REPO_ROOT/implementations/$IMPL_SLUG"

# Validate implementation directory
if [ ! -d "$IMPL_DIR" ]; then
  echo "Error: Implementation '$IMPL_SLUG' not found at $IMPL_DIR"
  echo "Available implementations:"
  ls "$REPO_ROOT/implementations/" 2>/dev/null || echo "  (none found)"
  exit 1
fi

PRD_FILE="$IMPL_DIR/prd.json"
PROGRESS_FILE="$IMPL_DIR/progress.txt"
ARCHIVE_DIR="$REPO_ROOT/archive"
LAST_BRANCH_FILE="$SCRIPT_DIR/.last-branch-$IMPL_SLUG"

# Archive previous run if branch changed
if [ -f "$PRD_FILE" ] && [ -f "$LAST_BRANCH_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  LAST_BRANCH=$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")

  if [ -n "$CURRENT_BRANCH" ] && [ -n "$LAST_BRANCH" ] && [ "$CURRENT_BRANCH" != "$LAST_BRANCH" ]; then
    DATE=$(date +%Y-%m-%d)
    FOLDER_NAME=$(echo "$LAST_BRANCH" | sed 's|^ralph/||')
    ARCHIVE_FOLDER="$ARCHIVE_DIR/$DATE-$FOLDER_NAME"

    echo "Archiving previous run: $LAST_BRANCH"
    mkdir -p "$ARCHIVE_FOLDER"
    [ -f "$PRD_FILE" ] && cp "$PRD_FILE" "$ARCHIVE_FOLDER/"
    [ -f "$PROGRESS_FILE" ] && cp "$PROGRESS_FILE" "$ARCHIVE_FOLDER/"
    echo "   Archived to: $ARCHIVE_FOLDER"

    # Reset progress file for new run
    echo "# Ralph Progress Log" > "$PROGRESS_FILE"
    echo "Started: $(date)" >> "$PROGRESS_FILE"
    echo "---" >> "$PROGRESS_FILE"
  fi
fi

# Track current branch
if [ -f "$PRD_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  if [ -n "$CURRENT_BRANCH" ]; then
    echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"
    # Commit the tracking file if it is new or changed so it is preserved on other machines
    if ! git -C "$REPO_ROOT" diff --quiet "$LAST_BRANCH_FILE" 2>/dev/null || \
       ! git -C "$REPO_ROOT" ls-files --error-unmatch "$LAST_BRANCH_FILE" &>/dev/null; then
      git -C "$REPO_ROOT" add "$LAST_BRANCH_FILE"
      git -C "$REPO_ROOT" commit -m "chore: track last-branch for $IMPL_SLUG" --quiet || true
    fi
  fi
fi

# Initialize progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Ralph Progress Log" > "$PROGRESS_FILE"
  echo "Started: $(date)" >> "$PROGRESS_FILE"
  echo "---" >> "$PROGRESS_FILE"
fi

# Build the full prompt: prepend impl header to the per-iteration CLAUDE.md
IMPL_HEADER="## Active implementation
Slug: $IMPL_SLUG
Directory: implementations/$IMPL_SLUG/

Read implementations/$IMPL_SLUG/CLAUDE.md for your full instructions.

---

"
FULL_PROMPT="$IMPL_HEADER$(cat "$SCRIPT_DIR/CLAUDE.md")"

echo "Starting Ralph — Impl: $IMPL_SLUG — Tool: $TOOL — Max iterations: $MAX_ITERATIONS"
echo "Repo root: $REPO_ROOT"
echo "Impl dir:  $IMPL_DIR"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "==============================================================="
  echo "  Ralph Iteration $i of $MAX_ITERATIONS ($TOOL) [$IMPL_SLUG]"
  echo "==============================================================="

  if [[ "$TOOL" == "amp" ]]; then
    OUTPUT=$(printf '%s' "$FULL_PROMPT" | amp --dangerously-allow-all 2>&1 | tee /dev/stderr) || true
  elif [[ "$TOOL" == "claude" ]]; then
    OUTPUT=$(printf '%s' "$FULL_PROMPT" | claude --dangerously-skip-permissions --print 2>&1 | tee /dev/stderr) || true
  else
    # OpenCode: run non-interactively with the full prompt as the argument
    OUTPUT=$(opencode run "$FULL_PROMPT" 2>&1 | tee /dev/stderr) || true
  fi

  # Check for completion signal
  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo ""
    echo "Ralph completed all tasks!"
    echo "Completed at iteration $i of $MAX_ITERATIONS"
    exit 0
  fi

  echo "Iteration $i complete. Continuing..."
  sleep 2
done

echo ""
echo "Ralph reached max iterations ($MAX_ITERATIONS) without completing all tasks."
echo "Check $PROGRESS_FILE for status."
exit 1
