# Ralph — Per-Iteration Prompt

You are an autonomous coding agent working on the **Web Framework Benchmark 2026** project.

## First: read your full instructions

Your complete project instructions, conventions, retry/abort protocol, and parallelisation map are in:

```
CLAUDE.md
```

Read that file **first**, before doing anything else. It is the single source of truth for this project.

## Then: do one unit of work

After reading `CLAUDE.md`, follow the resume protocol it describes:

1. Read `prd.json` to find the current state of all slices
2. Read `progress.txt` for learnings from previous iterations
3. Identify the next eligible slice (or eligible parallel wave)
4. Implement it (with retry/abort protocol from `CLAUDE.md`)
5. Commit, update `prd.json`, append to `progress.txt`
6. If all slices are `passes: true` or `"aborted"`, output `<promise>COMPLETE</promise>`

## Working directory

All commands run from the repository root (the directory containing `CLAUDE.md` and `prd.json`).

## Stop condition

Output exactly `<promise>COMPLETE</promise>` (on its own line) when all slices in `prd.json` are either `passes: true` or `"aborted"`. This signals Ralph to stop looping.
