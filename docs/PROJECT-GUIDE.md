# Project Guide

How to structure memory projects in a Genesis workspace.

## Schema

Each project is a node tree in Taskade's internal format (taskast):

```json
{
  "root": {
    "id": "root",
    "children": [
      {
        "id": "node-1",
        "text": { "ops": [{ "insert": "Title\n" }] },
        "children": [...]
      }
    ]
  },
  "preferences": {
    "avatar": { "type": "emoji", "value": "📄" }
  }
}
```

## Node Structure

- The `root` has exactly one top-level child (the project title node)
- Each node has `id`, `text`, and `children`
- `text.ops` uses Delta format (Quill-compatible) — each op has an `insert` string
- **Every `insert` must end with `\n`** — this is a hard requirement of the taskast schema
- Children are nested nodes forming an outline tree

## Design Principles

**Projects are memory, not documents.** An agent reads project content to ground its responses. Structure content so it's useful to both humans browsing and agents querying.

**Use hierarchy intentionally:**
- Level 1: category or section
- Level 2: specific items
- Level 3: details (use sparingly)

**Be concrete.** "Our values" is less useful than a project that lists each value with a one-line definition and an example of what it looks like in practice.

## Project Types in Cortex

| Type | Example | Purpose |
|------|---------|---------|
| Context | `company-context.json` | Stable reference data agents always need |
| Log | `decision-log.json` | Append-only record of decisions and reasoning |
| Playbook | `playbook-hiring.json` | Step-by-step process for a recurring activity |
| Library | `library-frameworks.json` | Collection of reusable mental models or references |
| Welcome | `welcome.json` | Onboarding guide for new users of the workspace |

## Tips

- Keep project names descriptive — agents use them to decide relevance
- Prefer many focused projects over one mega-document
- Start with `examples/project-template.json` — copy it into `projects/` and build from there
- Use the avatar emoji to make projects visually scannable
