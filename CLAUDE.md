# CLAUDE.md — TiTools

Project-specific instructions for Claude Code sessions working on this repo. These rules travel with the repo via git, unlike machine-local `~/.claude/projects/` memory which is lost when the repo is cloned elsewhere.

## What TiTools is

- An npm CLI (`@maccesar/titools`) + Claude Code plugin marketplace that ships 9 Titanium SDK skills, 1 agent (ti-pro), a SessionStart hook, and slash commands.
- Distribution channels:
  - **npm**: `npm install -g @maccesar/titools` then `titools install` (works with Claude Code, Gemini CLI, Codex CLI).
  - **Claude Code plugin marketplace**: `/plugin marketplace add macCesar/titools` then `/plugin install titools@maccesar-titools` (Claude Code only).
- Architecture: ESM modules under `lib/`, commands in `lib/commands/`, CLI entry in `bin/titools.js`, skills live in `skills/<name>/SKILL.md` with optional `references/`, `assets/`, `scripts/`.

## Release checklist (mandatory)

Every release that ships code or skill changes must bump **BOTH** version files and keep them in sync:

1. Code + tests green.
2. Update `CHANGELOG.md` with the new version entry.
3. Bump `package.json` → `"version"`.
4. Bump `.claude-plugin/plugin.json` → `"version"` to the **same number**.
5. Single commit including both bumps.
6. Tag `vX.Y.Z` pointing at that commit.
7. Push `main` + push the tag.
8. `npm publish --access public`.

### Why both bumps matter

Claude Code caches marketplace-installed plugins in `~/.claude/plugins/cache/`. It compares the `version` field in `plugin.json` to decide whether to invalidate the cache. **If the code changes but `plugin.json` version does not, marketplace users keep the stale cached code** even after you push to GitHub.

Anthropic's exact wording: *"If you change your plugin's code but don't bump the version in `plugin.json`, your plugin's existing users won't see your changes due to caching."*

### Precedent (do not repeat)

v2.6.0 shipped with `plugin.json` frozen at `3.0.0` (pre-existing value from the feature branch). npm would publish 2.6.0 but the marketplace would announce 3.0.0. Had to sync manually and amend the release. Always sync before the release commit.

## Code conventions

### Claude Code hooks format in `settings.json`

Hooks must use the nested format:

```json
{
  "hooks": [
    { "type": "command", "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh" }
  ]
}
```

NOT the flat `{ "command": "...", "timeout": 30000 }` format. The flat form causes a settings validation error on session start (caused the v2.4.0 → v2.4.1 hotfix).

### `ora` spinner + child processes

When wrapping a shell command with `ora`, always use the async form:

```js
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
const run = promisify(execFile);
await run('npm', ['update', '-g', ...]);
```

Never `execFileSync` — it blocks the Node.js event loop, freezing the spinner animation (static dot instead of spinning). Caused the v2.4.2 hotfix.

## Parallel project: `aiskills`

`@maccesar/aiskills` lives at `~/Developer/openSource/aiskills` and shares **identical** `lib/` infrastructure (Commander.js, ora, chalk, ESM, same install paths, same symlink pattern). Only the `skills/` contents differ — aiskills ships general-purpose skills (humaniza, refactoring-ui, stitch-showcase, vscode-extension-dev), TiTools ships Titanium-specific skills.

**When implementing features in TiTools, consider porting the equivalent to aiskills in the same session** — adapted to remove Titanium-specific pieces (agents, Knowledge Index, `tiapp.xml` detection).

### Long-term direction

User intends to eventually merge TiTools + aiskills into a single CLI with skill categories (e.g. `titools install --only ti`, `--only ui`). Maintaining two near-duplicate codebases is a known tax. When that consolidation happens, the marketplace would either become one plugin with all skills or multiple plugins under one marketplace manifest.

## Testing

Tests live under `test/` using Node's built-in test runner (`node:test`):

```bash
npm test                              # all suites (60+ tests at v2.6.0)
node --test test/ti-branding.test.js  # single file
```

Add tests whenever a new command or skill-scripted behavior ships. Skills that include executable scripts (e.g. `ti-branding/scripts/`) should have tests covering: frontmatter validity, CLI help output, argument validation, shell syntax of any bash scripts.

## Files worth knowing

- `lib/utils.js:buildKnowledgeIndex` — scans `skills/*/references/` dynamically, so new skills with a `references/` folder appear in the Knowledge Index automatically. No list to maintain.
- `lib/config.js:SKILLS` — hardcoded list of which skills to install. Keep in sync when adding/removing a skill.
- `EXAMPLE-PROMPTS.md` — doubles as documentation AND as a smoke test for skill triggering. New skills must add at least 2 example prompts.
- `skills/ti-branding/scripts/ti-branding` — bash entrypoint (not JS). Demonstrates the "skill with executable scripts" pattern.
