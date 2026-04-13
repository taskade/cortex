# Cortex

**The default starter brain for Taskade Genesis.**

Fork this repo. Import into Taskade. Get a fully wired AI workspace in 60 seconds — 5 agents, 10 projects, 6 automations, 1 app — all connected and running.

> Cortex is not a sample app. It is a working brain. You don't learn it. You use it. Then you make it yours.

---

## What's Inside

### Intelligence — 5 Agents

| Agent | Role | Emoji |
|-------|------|-------|
| **Strategist** | Think in tradeoffs, answer in options | ♟ |
| **Editor** | Cut 30%, keep the nerve | ✂ |
| **Researcher** | Find primary sources, cite everything | 🔍 |
| **Critic** | Argue against whatever you just said | ⚖ |
| **Builder** | Spec it, scope it, ship it | 🛠 |

### Memory — 10 Projects

- **Company Context** — who you are, what you sell, how you talk
- **Decision Log** — every major call, reasoning, outcome
- **5 Playbooks** — Hiring, Launch, Pricing, Fundraise, Support
- **2 Libraries** — Mental Models & Frameworks, References
- **Welcome** — onboarding guide to Cortex itself

### Reflexes — 6 Automations

- **Daily Standup** — morning cron that pulls tasks and summarizes blockers
- **Decision Council** — webhook triggers 3 agents to debate and synthesize
- **Weekly Review** — Friday evening scores the week and plans the next
- **Inbox Triage** — classifies incoming messages and routes to the right agent
- **Incident Response** — assembles a team and creates a war room
- **Monday Planning** — reviews goals and seeds the week's priorities

### Interface — 1 Genesis App

A multi-route React SPA with dashboard, council, journal, and library views — all wired to the agents and projects above.

---

## Quick Start

### Option A: Fork and Import (recommended)

1. **Fork** this repo
2. Go to your Taskade workspace
3. **Import** → select `cortex.tsk` (or point at your fork's URL)
4. All 5 agents, 10 projects, 6 automations, and the app appear — wired and running

### Option B: Clone and Customize

```bash
git clone https://github.com/taskade/cortex.git
cd cortex
npm install
```

Edit any JSON file under `agents/`, `projects/`, `automations/`, or `apps/`.

```bash
npm run validate    # Check structural integrity
npm run summary     # Print artifact counts and IDs
npm run assemble    # Build cortex.tsk bundle
```

Then import the generated `cortex.tsk` into Taskade.

---

## Repo Layout

```
cortex/
├── manifest.json               Bundle metadata
├── cortex.tsk                  One-click import bundle (generated)
│
├── agents/                     Intelligence layer
│   ├── strategist.json
│   ├── editor.json
│   ├── researcher.json
│   ├── critic.json
│   └── builder.json
│
├── projects/                   Memory layer
│   ├── company-context.json
│   ├── decision-log.json
│   ├── playbook-*.json         (5 playbooks)
│   ├── library-*.json          (2 libraries)
│   └── welcome.json
│
├── automations/                Reflexes layer
│   ├── daily-standup.json
│   ├── decision-council.json
│   ├── weekly-review.json
│   ├── inbox-triage.json
│   ├── incident-response.json
│   └── monday-planning.json
│
├── apps/
│   └── cortex.json             Genesis app (React SPA)
│
├── examples/                   Blank templates for creating new artifacts
│   ├── agent-template.json
│   ├── project-template.json
│   └── automation-template.json
│
├── docs/                       Guides
│   ├── GENESIS-101.md
│   ├── AGENT-GUIDE.md
│   ├── PROJECT-GUIDE.md
│   ├── AUTOMATION-GUIDE.md
│   ├── APP-KIT-SPEC.md
│   └── FORK-AND-CUSTOMIZE.md
│
└── scripts/                    Tooling
    ├── validate.mjs
    ├── summary.mjs
    └── assemble.mjs
```

---

## Customization

Every JSON file is a standalone artifact. Swap any of them:

- **Replace an agent** — copy `examples/agent-template.json` into `agents/`, write your persona prompt, delete the old one
- **Add a project** — copy `examples/project-template.json` into `projects/`, structure your content, save
- **Modify a flow** — edit trigger/action pairs in `automations/*.json`
- **Redesign the app** — edit the FileSystemTree in `apps/cortex.json`

See [docs/FORK-AND-CUSTOMIZE.md](docs/FORK-AND-CUSTOMIZE.md) for a step-by-step guide.

---

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run validate` | Structural integrity checks on all JSON artifacts |
| `npm run summary` | Print artifact counts and IDs |
| `npm run assemble` | Build `dist/workspace.json` + `cortex.tsk` |
| `npm run ci` | Run summary + validate (used in GitHub Actions) |

---

## Documentation

- [GENESIS-101](docs/GENESIS-101.md) — What is Genesis? The 4 DNA layers
- [AGENT-GUIDE](docs/AGENT-GUIDE.md) — How to write a good agent prompt
- [PROJECT-GUIDE](docs/PROJECT-GUIDE.md) — How to structure memory projects
- [AUTOMATION-GUIDE](docs/AUTOMATION-GUIDE.md) — Triggers, actions, piece library
- [APP-KIT-SPEC](docs/APP-KIT-SPEC.md) — FileSystemTree, Parade engine, SSE
- [FORK-AND-CUSTOMIZE](docs/FORK-AND-CUSTOMIZE.md) — Step-by-step customization

---

## License

[MIT](LICENSE)

---

Built by [Taskade](https://taskade.com). Fork it. Make it yours. Ship it.
