# Ralph — Per-Iteration Prompt

You are an autonomous coding agent working on a benchmark implementation.

## First: read your full instructions

The active implementation and its directory were injected above this prompt by Ralph. Your complete implementation instructions, conventions, retry/abort protocol, and parallelisation map are in:

```
implementations/<NN-slug>/CLAUDE.md
```

Read that file **first**, before doing anything else. It is the single source of truth for this implementation.

Also read the root `CLAUDE.md` for monorepo conventions (package structure, Docker, Tailwind, quality checks, etc.).

## Then: do one unit of work

After reading both CLAUDE.md files, follow the resume protocol in `implementations/<slug>/CLAUDE.md`:

1. Read `implementations/<NN-slug>/prd.json` to find the current state of all slices
2. Read `implementations/<NN-slug>/progress.txt` for learnings from previous iterations
3. Identify the next eligible slice (or eligible parallel wave)
4. Implement it (with retry/abort protocol from the implementation CLAUDE.md)
5. Commit, update `implementations/<NN-slug>/prd.json`, append to `implementations/<NN-slug>/progress.txt`
6. If all slices are `passes: true` or `"aborted"`, output `<promise>COMPLETE</promise>`

## Working directory

All commands run from the repository root (the directory containing the root `CLAUDE.md`).

## Stop condition

Output exactly `<promise>COMPLETE</promise>` (on its own line) when all slices in `implementations/<NN-slug>/prd.json` are either `passes: true` or `"aborted"`. This signals Ralph to stop looping.

