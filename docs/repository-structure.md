# Repository Structure

## Top-Level Layout

```
cortex/
├── manifest.json          Bundle metadata (name, version, source)
├── cortex.tsk             Assembled bundle for one-click import (generated)
├── package.json           Scripts and project config
├── tsconfig.json          TypeScript configuration
├── LICENSE                MIT license
├── .gitignore             Excludes dist/, node_modules/, .env
│
├── agents/                One JSON file per agent (AgentTemplate v1)
├── projects/              One JSON file per project (taskast node tree)
├── automations/           One JSON file per automation flow (FlowTemplateV2)
├── apps/                  One JSON file per app (FileSystemTree)
│
├── docs/                  Guides and specifications
├── scripts/               Validation, summary, and assembly tooling
└── .github/               CI workflows and issue templates
```

## Artifact Conventions

- Files are JSON, UTF-8 encoded
- Human-readable filenames (e.g., `strategist.json`, not ULIDs)
- Files starting with `_` are templates — skipped by the assembler
- Keep directories flat (no nesting under artifact directories)

## Validation

```bash
npm run validate
```

Checks: required directories exist, JSON is parseable, required top-level keys exist per artifact type.

## Assembly

```bash
npm run assemble
```

Combines all artifacts into `dist/workspace.json` (SpaceBundleData format) and copies it to `cortex.tsk` at the repo root.

## Summary

```bash
npm run summary
```

Prints artifact counts and names for quick review.
