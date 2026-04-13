# App Kit Spec

Technical specification for Genesis apps in the bundle format.

## Overview

A Genesis app is a React SPA that runs inside Taskade's Parade engine. The app definition is a `FileSystemTree` — a nested JSON structure representing a virtual filesystem of source files that the Parade engine compiles and serves.

## Schema

```json
{
  "src": {
    "directory": {
      "App.tsx": {
        "file": { "contents": "import React from 'react';\n..." }
      },
      "index.tsx": {
        "file": { "contents": "..." }
      }
    }
  }
}
```

Each file is `{ "file": { "contents": "..." } }`. Directories are `{ "directory": { ... } }`.

## Constraints

| Constraint | Value |
|-----------|-------|
| App ID | Must be `"default"` (one app per space) |
| Template | `@taskade/parade-base-template-v2` |
| Max files per mount | 200 |
| Max inline file size | 2 MB |

## Built-in Libraries

The base template provides:

- **`@/lib/genesis-auth.tsx`** — Authentication component (wrap your app root)
- **`@/lib/agent-chat/v2`** — SSE streaming for agent conversations
- **React Router** — client-side routing
- **Tailwind CSS** — styling

## Development Pattern

1. Write your React components as files in the FileSystemTree
2. Use `GenesisAuth` to gate authenticated routes
3. Use the agent chat SDK to connect UI to workspace agents
4. Routes map to views (dashboard, council, journal, library in Cortex)

## Editing the App

The app source lives in `apps/cortex.json`. To modify:

1. Extract the FileSystemTree from the JSON
2. Edit the React source files
3. Re-encode back into the JSON structure
4. Run `npm run validate` to check integrity

For large changes, consider using Taskade's in-app Genesis editor which provides a live preview.
