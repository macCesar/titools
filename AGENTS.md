# AGENTS.md

Guidance for AI agents — **Claude Code, Gemini CLI, Codex / OpenAI Codex CLI, GitHub Copilot CLI, and any other LLM-driven coding assistant** — working **inside** this repository.

If you are an agent invoked by a user in a Titanium project to *use* a skill, read the relevant `skills/<name>/SKILL.md` directly and follow it — not this file.

## What this repo is

TiTools ships two things from a single source:

1. **An npm CLI** (`@maccesar/titools`) that installs and updates Titanium SDK skills + a SessionStart hook into `~/.agents/skills/` (universal) plus per-agent symlinks for Claude Code, Gemini CLI, and Codex CLI.
2. **A Claude Code plugin marketplace** (`titools@maccesar-titools`) that exposes the same content as a plugin via `/plugin marketplace add macCesar/titools`.

Skills conform to the [agentskills.io specification](https://agentskills.io/specification) so any compatible agent can load them. The CLI itself is ESM Node.js with Commander.js and `ora` spinners.

Sibling project: **`@maccesar/aiskills`** at `~/Developer/openSource/aiskills` shares the same `lib/` infrastructure but ships general-purpose skills (humaniza, refactoring-ui, stitch-showcase, vscode-extension-dev). When you change `lib/`, consider porting the change there too — see [CLAUDE.md](CLAUDE.md) § "Parallel project: aiskills".

## Layout

```
.
├── README.md             # human-facing index
├── AGENTS.md             # this file (agent-agnostic guidance)
├── CLAUDE.md             # Claude Code-specific notes (release checklist, code conventions)
├── CHANGELOG.md
├── EXAMPLE-PROMPTS.md    # smoke test for skill triggering
├── package.json          # npm publish manifest
├── .claude-plugin/
│   └── plugin.json       # Claude Code plugin manifest (version must match package.json)
├── bin/
│   └── titools.js        # CLI entry point
├── lib/                  # CLI source (ESM)
│   ├── commands/         # one file per CLI subcommand
│   ├── config.js         # SKILLS list, paths, platforms
│   ├── cleanup.js        # legacy artifact removal on update/uninstall
│   ├── utils.js          # buildKnowledgeIndex, helpers
│   └── platform.js
├── hooks/
│   └── session-start.sh  # SessionStart hook bundled with the plugin
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md      # required: skill entry point
│       ├── references/   # optional: deep references
│       └── assets/       # optional: scripts, templates
└── test/                 # node:test suites
```

One skill per folder under `skills/`. The folder name **must** equal the `name:` field in the skill's YAML frontmatter (kebab-case, letters/digits/hyphens only).

## Skill format

Every `SKILL.md` starts with YAML frontmatter:

```markdown
---
name: <kebab-case-name>
description: Use when <triggering conditions, symptoms, file markers>. ~500 chars or less.
---

# <Skill title>

## Overview
What it is. Core principle in 1-2 sentences.

## When to use
Bullet triggers + when NOT to use.

## Workflow / Steps
...
```

Rules:

- **Frontmatter total ≤ 1024 chars.** See [agentskills.io/specification](https://agentskills.io/specification).
- `description` describes **when to use** the skill — concrete triggers, error messages, file markers — *not* a summary of the workflow. Future agents read the description to decide whether to load the full skill; a workflow summary may cause them to follow the summary instead of the skill.
- Start the description with `Use when…` (third person).
- If the description contains `:` characters, wrap it in single or double quotes so YAML strict parsers don't interpret mid-line colons as nested mappings.
- Set `metadata.internal: true` on skills meant for maintainers only — that hides them from public skill-installer menus.

### Required workflow pattern (recommended for non-trivial skills)

For skills with multiple reference files, add an explicit "Required workflow" section near the top of `SKILL.md` so the agent must:

1. **Open the relevant reference files** before responding — provide a task → reference table.
2. **Cite sources** in every claim using `[source: references/<file>.md]` format.
3. **Flag unverified claims** with `FROM_MEMORY (unverified):` prefix when the agent answers without consulting a reference.

This output contract makes non-compliance visible in the agent's response and is the strongest mitigation against agents answering from training data instead of from the skill. See `skills/purgetss/SKILL.md` § "Required workflow" for a concrete example.

## Design principles for skills

- **Concrete file paths and commands.** Reference real Titanium files (`tiapp.xml`, `ios/manifest`, `android/build.gradle`, `app/views/`, `purgetss/config.cjs`) and real CLI invocations (`ti build`, `ti sdk install`, `alloy generate`).
- **Vendor-neutral.** Skills target Titanium broadly — avoid hard-coding one third-party SDK in examples or triggers.
- **Verify before claiming success.** A green build / passing test is the proof, not the agent's assertion.
- **Define explicit hand-back conditions.** State when the agent should stop and ask the human (e.g. *"after 2-3 failed debug attempts"*, *"when a vendor rename requires `module.xcconfig` edits you can't verify"*).
- **No backwards-compat noise.** Move version history out of `SKILL.md` into `references/version-history.md` or `CHANGELOG.md` so the entry point stays focused on current behavior.

## CLI code conventions

### ESM modules

All `lib/` files are ESM. No CommonJS. Imports use `import { foo } from './bar.js'` with the `.js` extension explicit.

### Spinners + child processes

When wrapping a shell command with `ora`, **always use the async form** of `execFile`:

```js
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
const run = promisify(execFile);
await run('npm', ['update', '-g', '@maccesar/titools']);
```

Never `execFileSync` — it blocks the Node.js event loop, freezing the spinner animation (caused the v2.4.2 hotfix).

### Claude Code hook format

Hooks in `settings.json` must use the nested form:

```json
{
  "hooks": [
    { "type": "command", "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh" }
  ]
}
```

NOT the flat `{ "command": "...", "timeout": 30000 }` form. Flat triggers a settings validation error on session start (caused the v2.4.0 → v2.4.1 hotfix).

### Files worth knowing

- `lib/utils.js:buildKnowledgeIndex` — dynamically scans `skills/*/references/` so new reference folders appear in the Knowledge Index without code changes.
- `lib/config.js:SKILLS` — hardcoded list of which skills to install. Update when adding/removing a skill.
- `lib/config.js:LEGACY_SKILLS` — skills to actively remove during `update`/`uninstall`. Use when deprecating a skill so existing users get a clean migration.
- `EXAMPLE-PROMPTS.md` — doubles as documentation AND smoke test for skill triggering. New skills must add at least 2 example prompts.

## Tests

Tests live under `test/` using Node's built-in test runner (`node:test`):

```bash
npm test                        # all suites
node --test test/list.test.js   # single file
```

Add tests whenever a new command or skill-scripted behavior ships. Skills with executable scripts should have tests covering: frontmatter validity, CLI help output, argument validation, shell syntax of any bash scripts.

## Release checklist (mandatory)

Every release that ships code or skill changes must bump **BOTH** version files and keep them in sync. Anthropic's marketplace caches plugins by `version` in `plugin.json`; if code changes without the bump, marketplace users keep stale code.

1. Code + tests green (`npm test`).
2. Update `CHANGELOG.md` with the new version entry.
3. Bump `package.json` → `"version"`.
4. Bump `.claude-plugin/plugin.json` → `"version"` to the **same number**.
5. Single commit including both bumps.
6. Tag `vX.Y.Z` pointing at that commit.
7. Push `main` + push the tag.
8. `npm publish --access public`.

### Precedent (do not repeat)

v2.6.0 shipped with `plugin.json` frozen at `3.0.0` (a stale value from a prior feature branch). npm published 2.6.0 but the marketplace announced 3.0.0. Had to sync manually and amend the release. **Always sync before the release commit.**

### npm 2FA and publishing

With 2FA enabled, each `npm publish` invocation needs a fresh OTP — even if a prior publish in the same session succeeded. Pass it via `--otp=XXXXXX` or respond to the prompt.

## Common operations

### Add a new skill

1. Pick a kebab-case `<skill-name>` (verb-led for workflow skills: `ti-module-update`; noun-led for reference skills: `ti-api`).
2. Create `skills/<skill-name>/SKILL.md` with frontmatter ≤ 1024 chars.
3. Add the skill to `lib/config.js:SKILLS`.
4. Add a row in the README skills table.
5. Add ≥ 2 example prompts in `EXAMPLE-PROMPTS.md`.
6. If the skill has scripts, add tests under `test/`.
7. Bump version per the Release checklist.

### Deprecate a skill

1. Move the skill name from `SKILLS` to `LEGACY_SKILLS` in `lib/config.js`. This makes `titools update` remove it from existing user installs.
2. Delete the `skills/<name>/` folder.
3. Bump version + CHANGELOG entry explaining the deprecation.

### Edit a skill's frontmatter

1. Keep total chars ≤ 1024.
2. If the `description` semantics change meaningfully, update the README row.
3. Don't add fields the spec doesn't define (`name`, `description`, optional `metadata.*`, `argument-hint`, `allowed-tools` for Claude Code skills).

### Don't

- ❌ Skip the `plugin.json` version bump when shipping code changes. Marketplace users will get stale cache.
- ❌ Use `execFileSync` inside an `ora` wrapper. Freezes the spinner.
- ❌ Use the flat hook format in `settings.json`. Validation fails.
- ❌ Add a feature to TiTools without considering whether the equivalent belongs in aiskills.
- ❌ Commit without explicit user authorization. See `CLAUDE.md` § "Git Safety Protocol".

## Resources

- Skill spec (cross-agent): <https://agentskills.io/specification>
- Claude Code skills: <https://docs.claude.com/en/docs/claude-code/skills>
- Codex CLI: <https://github.com/openai/codex>
- Gemini CLI: <https://github.com/google-gemini/gemini-cli>
- GitHub Copilot CLI: <https://docs.github.com/en/copilot/github-copilot-in-the-cli>
- Titanium SDK: <https://titaniumsdk.com> · source: <https://github.com/tidev/titanium-sdk>
- Sibling repo (`tidev/skills`): <https://github.com/tidev/skills>
