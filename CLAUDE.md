# CLAUDE.md — TiTools

Project-specific instructions for Claude Code sessions working on this repo. These rules travel with the repo via git, unlike machine-local `~/.claude/projects/` memory which is lost when the repo is cloned elsewhere.

## Project state

- `docs/project/requirements.md` — what the system must do
- `docs/project/context.md` — architecture and conventions
- `docs/project/decisions.md` — what was decided and why
- `docs/project/status.md` — where the work stands right now

Read `status.md` when resuming work. Do not import it at startup: it changes constantly, and loading it invalidates the cached prefix behind it.

## What TiTools is

- An npm CLI (`@maccesar/titools`) + Claude Code plugin marketplace that ships 10 Titanium SDK skills, 1 agent (ti-pro), a SessionStart hook, and 3 slash commands.
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
8. The tag does the publishing: `.github/workflows/publish.yml` fires on `v*`, re-checks the tag against **both** version files, runs `npm ci && npm test`, and publishes with trusted publishing (OIDC — no `NPM_TOKEN`, no OTP). Watch it with `gh run list --workflow publish.yml`; a red run means nothing shipped.

### Why both bumps matter

Claude Code caches marketplace-installed plugins in `~/.claude/plugins/cache/`. It compares the `version` field in `plugin.json` to decide whether to invalidate the cache. **If the code changes but `plugin.json` version does not, marketplace users keep the stale cached code** even after you push to GitHub.

Anthropic's exact wording: *"If you change your plugin's code but don't bump the version in `plugin.json`, your plugin's existing users won't see your changes due to caching."*

### Precedent (do not repeat)

v2.6.0 shipped with `plugin.json` frozen at `3.0.0` (pre-existing value from the feature branch). npm would publish 2.6.0 but the marketplace would announce 3.0.0. Had to sync manually and amend the release. Always sync before the release commit.

Step 8 used to be a manual `npm publish --access public`, and it was skipped outright once: v4.1.0 was tagged and pushed on 2026-07-31 and never published, so CLI users sat on 4.0.0 for two days while marketplace users had the release. That is what the workflow (added 2026-08-14) exists to prevent — but the tag still does not *guarantee* the publish: the v4.6.0 run failed on `npm test` and shipped nothing. Confirm with `npm view @maccesar/titools version` afterwards rather than assuming.

### How a release propagates to each install channel

`npm publish` is **not** the whole story. A release reaches users through two independent channels and `npm publish` feeds only one of them.

The mechanics below were established empirically in the sibling repo (aiskills v1.15.0, 2026-07-13) by inspecting the plugin cache. They are Claude Code behaviors, not project-specific, so they apply here — but they have not been re-verified against `maccesar-titools`. Treat them as reliable and worth confirming the first time you use them.

- **npm channel** (`~/.agents/skills/`) — read by Gemini CLI and Codex CLI directly, and by Claude Code through the symlink mirrors. End users get it via `npm update -g @maccesar/titools` followed by **one** of `titools update` / `titools install` (not both — `update` already re-syncs skills). TiTools also ships a SessionStart hook that runs `titools auto-update --silent` at most once a day, so users with Claude Code drift onto a new release on their own; users on Gemini or Codex only do not.
- **Marketplace channel** (`~/.claude/plugins/cache/maccesar-titools/`) — used by plugin installs. **`npm publish` does nothing here.**

Marketplace facts (not in Anthropic's docs):

- **Third-party marketplaces do not auto-update by default** — only Anthropic's own do. A release does not show up on its own. Either enable auto-update once via `/plugin` → Marketplaces → `maccesar-titools`, or refresh every release by hand.
- The refresh is **`/plugin marketplace update maccesar-titools`** (it does the `git pull`), then **`/reload-plugins`** to apply it in the live session. There is **no** `/plugin update <plugin>` command.
- `marketplace.json` declares `source` as `{github, repo}` with no pinned version, so the update tracks **default-branch HEAD, not the latest tag**, and ignores the numeric version of a stale cache. This is why pushing `main` matters as much as tagging — and why the `plugin.json` bump still matters for *end users*, whose cache does compare versions.
- **Duplicate cleanup applies here as of 4.3.0, not before.** While a skill or command exists only on npm, `titools install` creates the `~/.claude/` copy so Claude Code sees it; once the marketplace cache catches up and the user re-runs install, the CLI detects the plugin now provides it and removes that copy. TiTools had no such detection until 4.3.0, so anyone running both channels on an earlier version had every skill listed twice.

**Full post-release sequence on the maintainer's machine:** `/release` (which ends with the tag push, and the tag publishes to npm on its own) → `/plugin marketplace update maccesar-titools` → `titools install` → `/reload-plugins`.

The maintainer's own CLI is `npm link`-ed to this repo. On the first `titools install`, every canonical `~/.agents/skills/<name>` becomes a symlink to this checkout's `skills/<name>` directory, so later edits — including new `references/` files — are visible immediately without `npm update` or another install. Published npm packages still install independent copies. `isDevMode()` in `lib/commands/auto-update.js` detects the repo's `.git` and skips `npm update -g` so the link is never clobbered.

## Code conventions

### Both channels installed at once

A user can have the npm CLI *and* the marketplace plugin. When the plugin is enabled it already serves the skills and slash commands, so the CLI must not install its own copy — that duplicates every entry in the autocomplete.

`lib/claude-plugin.js` requires the plugin to be **enabled AND cached**. A cache directory alone proves nothing: uninstalling a plugin removes it from `enabledPlugins` in `settings.json` but leaves the cache behind. Reading that leftover as an installed plugin is what left aiskills users with zero skills and an install command that correctly did nothing. Detection fails toward `false` everywhere, because a wrong `false` costs a duplicate entry and a wrong `true` costs the user every skill they have.

### Slash commands live in `commands/`, never `.claude/commands/`

`.claude/` is gitignored. A command parked there ships to nobody — the plugin serves `commands/` from the repo, and the npm tarball only carries what `package.json` → `files` lists. The three commands sat in `.claude/commands/` until 4.2.0 while the README advertised them.

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

`@maccesar/aiskills` lives at `~/Developer/openSource/aiskills`. The two repos are the **same tool shipped twice with different payloads**: same CLI (`install`, `update`, `auto-update`, `status`, `doctor`, `list`, `remove`), same `~/.agents/skills/` layout, same symlink mirrors, same marketplace-plugin detection, same release mechanics. What differs is the content — the skills each ships (here: 10 Titanium skills; aiskills: 8 general-purpose) and the slash commands that drive them (here: `ti-check`, `ti-new-screen`, `ti-audit`; aiskills: `release`).

**A change to shared machinery belongs in both repos, in the same session.** Port the *behavior*, not the bytes — names and paths are supposed to differ.

`docs/project/context.md` § "Sibling project" carries the full contract: the table of what legitimately diverges (the `ti-pro` agent, the Knowledge Index / `sync`, and the `tiapp.xml` SessionStart hook are TiTools-only by design), plus a measured per-file comparison. Read it before assuming two files should match.

### Long-term direction

User intends to eventually merge TiTools + aiskills into a single CLI with skill categories (e.g. `titools install --only ti`, `--only ui`). Maintaining two near-duplicate codebases is a known tax. When that consolidation happens, the marketplace would either become one plugin with all skills or multiple plugins under one marketplace manifest.

## Testing

Tests live under `test/` using Node's built-in test runner (`node:test`):

```bash
npm test                        # all suites
node --test test/list.test.js   # single file
```

Add tests whenever a new command or skill-scripted behavior ships. Skills that include executable scripts should have tests covering: frontmatter validity, CLI help output, argument validation, shell syntax of any bash scripts.

## Files worth knowing

- `lib/utils.js:buildKnowledgeIndex` — scans `skills/*/references/` dynamically, so new skills with a `references/` folder appear in the Knowledge Index automatically. No list to maintain.
- `lib/config.js:SKILLS` — hardcoded list of which skills to install. Keep in sync when adding/removing a skill.
- `lib/config.js:LEGACY_SKILLS` — skills to actively remove during updates/uninstall. Use this when deprecating a skill so existing users get it cleaned up on their next `titools update`.
- `EXAMPLE-PROMPTS.md` — doubles as documentation AND as a smoke test for skill triggering. New skills must add at least 2 example prompts.
