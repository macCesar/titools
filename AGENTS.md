# AGENTS.md

Guidance for AI agents — **Claude Code, Gemini CLI, Codex / OpenAI Codex CLI, GitHub Copilot CLI, and any other LLM-driven coding assistant** — working **inside** this repository.

If you are an agent invoked by a user in a Titanium project to *use* a skill, read the relevant `skills/<name>/SKILL.md` directly and follow it — not this file.

## Project state

- `docs/project/requirements.md` — what the system must do
- `docs/project/context.md` — architecture and conventions
- `docs/project/decisions.md` — what was decided and why
- `docs/project/status.md` — where the work stands right now

Read `status.md` when resuming work. Do not import it at startup: it changes constantly, and loading it invalidates the cached prefix behind it.

## What this repo is

TiTools ships two things from a single source:

1. **An npm CLI** (`@maccesar/titools`) that installs and updates Titanium SDK skills + a SessionStart hook into `~/.agents/skills/` (universal) plus mirror symlinks for Claude Code. Gemini CLI and Codex CLI read the universal path directly.
2. **A Claude Code plugin marketplace** (`titools@maccesar-titools`) that exposes the same content as a plugin via `/plugin marketplace add macCesar/titools`.

Skills conform to the [agentskills.io specification](https://agentskills.io/specification) so any compatible agent can load them. The CLI itself is ESM Node.js with Commander.js and `ora` spinners.

Sibling project: **`@maccesar/aiskills`** at `~/Developer/openSource/aiskills` — the same tool shipped twice with different payloads. Same CLI, same install paths, same plugin detection, same release mechanics; what differs is the skills each ships (9 Titanium ones here, 8 general-purpose there) and their slash commands. The `ti-pro` agent, the Knowledge Index (`titools sync`) and the `tiapp.xml` SessionStart hook are TiTools-only.

**When you change shared machinery, port it there in the same session.** The full contract, including the table of what legitimately diverges and a measured per-file comparison, is in [docs/project/context.md](docs/project/context.md) § "Sibling project".

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
├── commands/             # slash commands — SHIPPED, must stay out of .claude/
│   ├── ti-check.md
│   ├── ti-new-screen.md
│   └── ti-audit.md
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

- **`description` ≤ 1024 chars, `name` ≤ 64.** Those are the two caps the [specification](https://agentskills.io/specification) sets; the frontmatter block as a whole has no limit, so an optional field costs nothing against the description's budget.
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

### Two channels, one rule: never install what the plugin already serves

TiTools ships through the npm CLI *and* the Claude Code marketplace plugin, and a user may have both. When the plugin is enabled, Claude Code already lists our skills and slash commands from its own cache; a second copy installed by the CLI appears twice in the autocomplete.

`lib/claude-plugin.js` answers the question, and the distinction it draws is the whole point: **an enabled plugin implies a cache, but a cache implies nothing.** Uninstalling a plugin removes it from `enabledPlugins` in `settings.json` and leaves the cache directory behind. Reading that leftover as proof of installation makes the CLI skip work it should do — which in the sibling project left Claude Code with no skills at all and no way to repair it by re-running install.

- `pluginProvidesSkill()` / `pluginProvidesCommand()` require **enabled AND cached**.
- Both fail toward `false` on missing or malformed settings. A wrong `false` costs a duplicate entry; a wrong `true` costs the user every skill they have.
- `createSkillSymlinks` and `installCommands` skip the entry and remove any stale copy; both return a `skipped` array that the CLI reports instead of a warning.
- `doctor` subtracts plugin-served entries from the expected total, so a healthy marketplace install stops reading as a wall of errors.

Covered by `test/claude-plugin.test.js`.

### Slash commands ship from `commands/`, not `.claude/`

`commands/*.md` is versioned and listed in `package.json` → `files`. It must stay that way: `.claude/` is gitignored, so commands parked there reach nobody — not marketplace users (the plugin serves `commands/` from the repo) and not npm users (the tarball would not carry them). Until 4.2.0 the three commands lived there and the README documented them anyway.

Adding one means: the file in `commands/`, the name in `lib/config.js:COMMANDS`, a row in the README table, and a passing `test/manifest.test.js`.

### `test/manifest.test.js` guards the registration wiring

Every assertion there corresponds to a failure one of the two repos has shipped — the class of bug where nothing is broken, something is merely never reached:

- a skill, command or agent present on disk but absent from `lib/config.js`, so the CLI never installs it (and the reverse — listed but missing);
- `package.json` → `files` omitting a directory that has to ship, which publishes a tarball the installer cannot use, or including `scripts/` and `.claude/`, which should never ship;
- `package.json` and `plugin.json` versions drifting apart;
- frontmatter whose `name` disagrees with its directory or filename, breaks the spec's naming rules, or whose `description` exceeds the 1024-char spec limit;
- `references/*.md` pointers in a SKILL.md that resolve to nothing;
- the flat hook format in `hooks.json` that caused the v2.4.0 → v2.4.1 hotfix.

When adding a skill or command, this suite is what tells you the registration was actually done. Ported from aiskills, where it was written after the same class of bug; extended here for agents, the hook and the wider `files` allowlist.

### Maintainer scripts

`scripts/` holds tools for the repo itself. They are versioned but deliberately absent from `package.json` → `files`, so they never reach users.

- `scripts/generate-toc.mjs` — inserts a linked index into references over 300 lines. Idempotent; output is delimited by `<!-- TOC-START -->` / `<!-- TOC-END -->`. Run it after adding or substantially growing a reference. It **refuses** to index a file with malformed fences, because an unclosed fence hides headings and the resulting index would be truncated without looking wrong.
- `scripts/fix-fences.mjs` — repairs code fences that open and never close, a recurring artifact of converting upstream docs. Run it before `generate-toc.mjs` if the latter reports skipped files.

Both default to a dry run. Read the output before passing `--write`.

### What is versioned under `.claude/`

`.claude/` is ignored except `.claude/skills/`, which carries the maintainer-only `titools-skill-auditor`. The pattern is `.claude/*` plus `!.claude/skills/` — a bare `!.claude/skills/` under a `.claude/` rule does nothing, since git will not descend into an excluded directory. Keeping the skill at that path means Claude Code still discovers it automatically while working in this repo.

`settings.local.json` and any local drafts stay ignored, and nothing under `.claude/` ships to npm.

### Files worth knowing

- `lib/utils.js:buildKnowledgeIndex` — dynamically scans `skills/*/references/` so new reference folders appear in the Knowledge Index without code changes.
- `lib/claude-plugin.js` — marketplace-plugin detection; see the rule above before touching it.
- `lib/config.js:SKILLS` — hardcoded list of which skills to install. Update when adding/removing a skill.
- `lib/config.js:COMMANDS` — same, for slash commands.
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
8. Nothing — the tag publishes. `.github/workflows/publish.yml` fires on `v*`, re-checks the tag against **both** version files, runs `npm ci && npm test`, and publishes with trusted publishing (OIDC). Check the run: `gh run list --workflow publish.yml`.

### Precedent (do not repeat)

v2.6.0 shipped with `plugin.json` frozen at `3.0.0` (a stale value from a prior feature branch). npm published 2.6.0 but the marketplace announced 3.0.0. Had to sync manually and amend the release. **Always sync before the release commit.**

### Publishing runs in CI, not on the maintainer's machine

Since 2026-08-14 the release publishes from GitHub Actions with trusted publishing (OIDC): no `NPM_TOKEN`, no stored secret, no 2FA OTP, and provenance for free. Do not run `npm publish` by hand — the registry accepts the OIDC identity only from that workflow file, and a manual publish would need an interactive `npm login` besides.

A green tag is not a green publish: the workflow gates on `npm test`, and the v4.6.0 run failed there and shipped nothing (the tag had to be deleted and re-cut as 4.6.1). Verify with `npm view @maccesar/titools version`.

### Publishing is not the same as shipping

The npm publish feeds one of the two channels. The marketplace cache at `~/.claude/plugins/cache/maccesar-titools/` is untouched by it, and third-party marketplaces do **not** auto-update — a release does not reach plugin users on its own. The refresh is `/plugin marketplace update maccesar-titools` followed by `/reload-plugins`; there is no `/plugin update <plugin>` command.

Because `marketplace.json` pins no version, that update tracks **default-branch HEAD rather than the tag** — pushing `main` matters as much as pushing the tag.

Verifying a release means checking what each channel actually serves: `npm view @maccesar/titools version` for one, the `version` in `plugin.json` on `main` for the other. v4.1.0 was tagged and pushed but never published, and the gap went unnoticed for two days. Full detail in [CLAUDE.md](CLAUDE.md) § "How a release propagates to each install channel".

## Common operations

### Add a new skill

1. Pick a kebab-case `<skill-name>` (verb-led for workflow skills: `ti-module-update`; noun-led for reference skills: `ti-api`).
2. Create `skills/<skill-name>/SKILL.md` with a `description` ≤ 1024 chars.
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

1. Keep the `description` ≤ 1024 chars and the `name` ≤ 64. The block itself has no cap.
2. If the `description` semantics change meaningfully, update the README row.
3. Don't add fields the spec doesn't define. The [agentskills.io specification](https://agentskills.io/specification) defines exactly six: `name` and `description` (required), plus optional `license`, `compatibility` (max 500 chars, only when the skill has real environment requirements), `metadata` (string→string map) and `allowed-tools` (experimental). `argument-hint` is **not** one of them — it is Claude Code slash-command frontmatter and belongs in `commands/*.md`, not in a `SKILL.md`.

### Don't

- ❌ Skip the `plugin.json` version bump when shipping code changes. Marketplace users will get stale cache.
- ❌ Put a slash command in `.claude/commands/`. That path is gitignored — it ships to nobody.
- ❌ Treat the presence of `~/.claude/plugins/cache/maccesar-titools` as proof the plugin is installed. Check `enabledPlugins` too.
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
