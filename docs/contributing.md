# Contributing

## Scope

This repository tracks the Cortex Genesis workspace bundle. Contributions should focus on:

- Improving agent prompts and commands
- Adding or refining project content
- Tuning automation flows
- Improving documentation and guides
- Fixing validation or tooling bugs

## Workflow

1. Fork the repo
2. Create a branch for your changes
3. Edit artifact JSON files or docs
4. Run local checks:

```bash
npm run validate
npm run summary
```

5. Commit with a clear message describing the change
6. Open a pull request

## Guardrails

- Do not manually rewrite IDs unless intentionally replacing a resource
- Avoid formatting-only churn in large JSON files
- Keep scripts dependency-free unless a dependency is justified
- Files starting with `_` are templates — the assembler skips them
- Every text `insert` in project nodes must end with `\n`

## CI

Pull requests run `.github/workflows/ci.yml`, which executes:

```bash
npm run ci
```

If CI fails, run `npm run validate` locally and fix reported structural issues.

## Feedback

If you forked Cortex and have feedback, use the [Fork Feedback issue template](https://github.com/taskade/cortex/issues/new?template=fork-feedback.md).
