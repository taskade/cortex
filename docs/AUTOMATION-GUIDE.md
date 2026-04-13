# Automation Guide

How to build automation flows for a Genesis workspace.

## Schema

Each automation is a `FlowTemplateV2` with `version: "2"`:

```json
{
  "version": "2",
  "flowTitle": "Flow Name",
  "trigger": {
    "valid": true,
    "type": "TRIGGER_TYPE",
    "settings": { ... }
  },
  "actions": [
    {
      "valid": true,
      "type": "action_type",
      "settings": { ... }
    }
  ]
}
```

## Trigger Types

| Type | When it fires | Settings |
|------|--------------|----------|
| `CRON` | On a schedule | `cron` (cron expression), `timezone` |
| `WEBHOOK` | When called via HTTP | `input` (JSON schema defining expected payload) |
| `NEW_MESSAGE` | When a message arrives | (context-dependent) |

## Action Types

Actions execute sequentially. Common types:

| Type | What it does |
|------|-------------|
| `taskade_ai_prompt` | Send a prompt to an AI agent |
| `taskade_create_project` | Create a new project |
| `taskade_update_project` | Modify an existing project |
| `taskade_send_message` | Send a message to a channel |

Actions can reference trigger data and previous action outputs using template syntax: `{{trigger.field}}`, `{{actions.0.output}}`.

## Flow Patterns in Cortex

### Cron-driven (scheduled)
- **Daily Standup**: `CRON` at 9am → AI summarizes tasks → posts to channel
- **Weekly Review**: `CRON` Friday 6pm → AI scores the week → plans next
- **Monday Planning**: `CRON` Monday 8am → AI reviews goals → seeds priorities

### Webhook-driven (event-triggered)
- **Decision Council**: webhook receives a question → 3 agents debate → synthesize
- **Inbox Triage**: webhook receives a message → classify → route to agent
- **Incident Response**: webhook fires → assemble team → create war room

## Constraints

- Maximum 500 actions per flow run
- Flows execute via Temporal workflows (durable, retryable)
- Action settings are validated at import time

## Tips

- Start simple: one trigger, one action. Add complexity only when needed.
- Use webhooks for integrations; use cron for recurring internal processes.
- Template variables (`{{trigger.*}}`) make flows reusable.
- Start with `automations/_template.json` and build from there.
