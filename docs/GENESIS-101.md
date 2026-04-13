# Genesis 101

Genesis is Taskade's system for turning a prompt into a complete, running workspace. Unlike traditional code generators that produce static files, Genesis assembles **live systems** from four interconnected layers — what we call **Workspace DNA**.

## The 4 DNA Layers

### 1. Memory (Projects)

Projects are structured data — outlines, documents, knowledge bases. They store everything your workspace knows. Each project is a tree of nodes with rich text content.

In Cortex, memory includes company context, decision logs, playbooks, and reference libraries. Agents read from these projects to ground their responses in your actual data.

### 2. Intelligence (Agents)

Agents are AI personas with specific roles, rules, and tools. Each agent has a system prompt that defines how it thinks, a set of commands for common tasks, and optional access to web search and project knowledge.

Cortex ships 5 agents: Strategist, Editor, Researcher, Critic, and Builder. Each is designed to do one thing well.

### 3. Reflexes (Automations)

Automations are trigger-action flows. A trigger fires (cron schedule, webhook, new message) and a sequence of actions executes — call an agent, update a project, send a notification, hit an API.

Cortex includes 6 flows covering daily standups, decision debates, weekly reviews, triage, incident response, and planning.

### 4. Interface (Apps)

Apps are React SPAs built on the Parade engine. They render data from projects and agents into custom UIs with routing, authentication, and real-time updates — all generated from a single JSON definition.

Cortex includes one app with dashboard, council, journal, and library views.

## How They Connect

```
Projects (Memory)
    ↕ agents read/write projects
Agents (Intelligence)
    ↕ automations invoke agents
Automations (Reflexes)
    ↕ app displays results
Apps (Interface)
```

The power is in the wiring. A standalone project is a document. A project that an agent reads, that an automation triggers, that an app displays — that's a Genesis workspace.

## The Bundle Format

All four layers are serialized as JSON files in a standard directory structure:

```
agents/*.json       AgentTemplate (version "1")
projects/*.json     Taskast root node tree
automations/*.json  FlowTemplateV2 (version "2")
apps/*.json         FileSystemTree (React SPA source)
manifest.json       Bundle metadata
```

The `assemble` script combines these into a single `workspace.json` (SpaceBundleData format) that Taskade can import in one step.
