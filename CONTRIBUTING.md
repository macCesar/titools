# Contributing to TiTools

TiTools distributes thirteen Titanium SDK skills, a research agent and slash
commands through an npm CLI and a Claude Code marketplace plugin. Product
content lives in `skills/`, `agents/` and `commands/`; CLI source lives in
`bin/` and `lib/`. Both channels use this source tree.

## Development

Use Node.js 18 or newer. Install dependencies with `npm ci`.

Run the tests that cover a change first:

```sh
node --test test/manifest.test.js
npm run lint
```

Tests use Node's built-in runner. Asset-helper checks additionally require the
Python dependencies in `skills/ti-game-assets/scripts/requirements.txt`.
Scripts under `scripts/` maintain reference navigation, fences and snapshots;
they are repository tooling and are not installed as CLI commands.

## Skill and command changes

- A skill's directory and frontmatter `name` must match, using kebab-case.
- Descriptions explain when to load the skill, stay within 1,024 characters and
  begin with "Use when". Skill names have a 64-character limit.
- Register new public skills in `lib/config.js`, the `ti-pro` agent and the
  `ti-audit` applicability list. Update the README and add at least two requests
  to [the public examples](docs/examples.md).
- Keep entry points concise and put detail in linked references. Preserve
  operational prerequisites, defaults, platform differences and cleanup.
- Verify factual guidance against official documentation and implementation;
  identify source revisions and distinguish source/host checks from device
  acceptance. Preserve declared source-mirror transformations and raw assets.
- Slash commands belong under `commands/`, where both channels can serve them.
- CLI modules use ESM imports with explicit `.js` extensions. Use asynchronous
  child processes inside spinners so the UI remains responsive.

## Shared CLI engine

TiTools and [AISkills](https://github.com/macCesar/aiskills) share the installer,
updater, cache, prompts, marketplace detection, cleanup and release machinery.
For shared changes, port behavior and relevant regression tests in both directions
before closing the work. Verify each repository independently with focused checks
and record corresponding implementation/test paths, results and justified product
exceptions. Existing equivalent behavior must be inspected and verified too.
An incomplete port or failed verification blocks completion and the affected
release. Catalogs, Titanium project detection, ti-pro and Knowledge Index remain
product-specific; version numbers and publication authorization stay separate.
Keep private audit/session evidence outside public commits.

## Public repository boundaries

Commit product source, public guides, tests, reusable maintenance scripts and
GitHub/marketplace configuration. Keep personal scratch notes, assistant/editor
workspace files, session state and unpublished audit conversations local.

The ignored `.agents/`, `.claude/`, `docs/project/` and root assistant instruction
files are private workspace material. `.claude-plugin/` and `.github/workflows/`
are public product infrastructure. A leading dot does not make a tracked path
private. The npm `files` allowlist is intentionally narrower than the repository.

The supported installation methods are npm and the Claude Code marketplace,
as described in the README. The obsolete standalone shell installer is retired.

## Release checklist

The `.github/workflows/publish.yml` workflow publishes with npm trusted
publishing (OIDC). Do not publish manually from a maintainer machine.

1. Run `npm test` and the required lint checks for a release.
2. Add the release entry to `CHANGELOG.md`.
3. Bump `package.json`, its lockfile and `.claude-plugin/plugin.json` together.
4. Commit the release and tag that commit `vX.Y.Z`.
5. Push `main` and the version tag. The tag triggers `publish.yml`.
6. Verify the workflow and the npm registry version; a tag alone does not prove publication.
7. Verify the plugin manifest on the default branch, which is also used by marketplace updates.

Do not include private workspace files merely to obtain a clean working tree.
Review the staged paths and actual npm payload before publishing.
