# Fork and Customize

Step-by-step guide to making Cortex your own.

## Step 1: Fork the Repo

Click **Fork** on [github.com/taskade/cortex](https://github.com/taskade/cortex). This gives you your own copy with all the starter content.

## Step 2: Clone Locally

```bash
git clone https://github.com/YOUR_USERNAME/cortex.git
cd cortex
npm install
```

## Step 3: Customize Agents

Each file in `agents/` is a standalone agent definition. To modify one:

1. Open `agents/strategist.json` (or whichever agent you want to change)
2. Edit the `description` field — this is the system prompt
3. Update `commands` to match your use case
4. Change `name`, `avatar`, and `introduction`

To add a new agent:
1. Copy `examples/agent-template.json` to `agents/my-agent.json`
2. Fill in all fields
3. Run `npm run validate` to check

To remove an agent:
1. Delete the file
2. That's it

## Step 4: Customize Projects

Projects in `projects/` are structured knowledge. To modify:

1. Open any project JSON file
2. Edit the node tree content (see [PROJECT-GUIDE.md](PROJECT-GUIDE.md) for the schema)
3. Keep the root structure intact — one top-level child with nested content

To add a new project:
1. Copy `examples/project-template.json` into `projects/`
2. Replace the title and content nodes
3. Set a descriptive avatar emoji

## Step 5: Customize Automations

Flows in `automations/` define automated processes. To modify:

1. Open any automation JSON file
2. Edit trigger settings (schedule, webhook schema) or action prompts
3. See [AUTOMATION-GUIDE.md](AUTOMATION-GUIDE.md) for available trigger and action types

## Step 6: Customize the App

The app in `apps/cortex.json` contains a full React SPA. For small tweaks, edit the file contents directly. For major changes, use Taskade's Genesis editor.

## Step 7: Validate

```bash
npm run validate
```

This checks that all JSON files are valid and have the required fields.

## Step 8: Build the Bundle

```bash
npm run assemble
```

This produces `cortex.tsk` at the repo root — a single file containing your entire workspace.

## Step 9: Import into Taskade

1. Go to your Taskade workspace
2. Use the Import feature
3. Select your `cortex.tsk` file
4. All agents, projects, automations, and the app will appear

## Step 10: Iterate

After importing, you can continue editing in Taskade's UI. When you want to export changes back:

1. Use Taskade's Export to GitHub feature
2. Push to your fork
3. Your repo stays in sync with your live workspace

## Tips

- Start by changing one thing, importing, and verifying it works
- Template files live in `examples/` — they are not scanned by the importer
- Validation runs in CI on every push — broken JSON will be caught automatically
- See [GENESIS-101.md](GENESIS-101.md) to understand how the four layers connect
