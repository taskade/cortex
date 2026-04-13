# Agent Guide

How to write a good agent for a Genesis workspace.

## Schema

Every agent is an `AgentTemplate` with `version: "1"`:

```json
{
  "version": "1",
  "name": "Agent Name",
  "description": "System prompt — the agent's personality, rules, and format.",
  "persona": "slug-name",
  "tone": "direct",
  "language": "en-US",
  "llm": { "type": "anthropic", "name": "anthropic/claude-sonnet-4.6" },
  "introduction": "First message the agent sends.",
  "avatar": { "type": "emoji", "data": { "value": "🤖" } },
  "commands": [...],
  "conversationStarters": [...]
}
```

## Writing the Description (System Prompt)

The `description` field is the system prompt. This is where agent quality is determined.

**Be specific.** "You are a helpful assistant" produces a generic agent. "You are a ruthless editor. Your job is to cut 30% of whatever the user pastes." produces a useful one.

**Structure it:**
1. **Role** — one sentence defining what the agent does
2. **Rules** — explicit constraints (what to always do, what to never do)
3. **Format** — how to structure the output (bullets, tables, numbered steps)
4. **Voice** — tone, style, what words to avoid

**Avoid:**
- Vague instructions ("be helpful", "be creative")
- Multiple conflicting roles in one agent
- Descriptions longer than ~500 words (diminishing returns)

## Commands

Commands are pre-built prompts users can trigger. Each command has:

```json
{
  "id": "command_slug",
  "name": "Human-Readable Name",
  "prompt": "What the agent should do when this command runs.",
  "mode": "default"
}
```

**Modes:**
- `"default"` — standard single-turn response
- `"plan-and-execute-v2"` — multi-step reasoning for complex tasks

**Optional flags:**
- `"searchToolEnabled": true` — gives the agent web search access

## Conversation Starters

Pre-filled prompts shown to the user as suggestions:

```json
{
  "id": "starter-1",
  "text": "Try asking me this."
}
```

Keep them concrete. "Help me with something" is useless. "Cut this email for me." is actionable.

## Knowledge Wiring

Agents can be connected to projects as knowledge sources via the `variables` and `addToKnowledgeProjectVariables` fields. When imported into Taskade, the platform resolves these references so the agent can read project content.

## Tips

- One agent, one job. Don't make a Swiss Army knife.
- Test your prompt by reading it aloud. If it's vague when spoken, it's vague to the model.
- Commands should cover the agent's 2-4 most common use cases.
- Start with `agents/_template.json` and modify from there.
