# Status — 2026-08-23

**Phase:** live and maintained. **v4.12.0 shipped on both channels**, working tree clean, 0 commits unpushed, nothing in flight.

## Release state — both channels on 4.12.0

| Channel | Version | Verified today |
|---|---|---|
| npm | 4.12.0 | `curl registry.npmjs.org/@maccesar%2Ftitools` → `dist-tags.latest = 4.12.0` |
| Claude Code marketplace | 4.12.0 | `plugin.json` on `origin/main` reads 4.12.0, `git ls-remote --tags origin v4.12.0` resolves, GitHub release created |

`publish.yml` ran green on the `v4.12.0` tag (`gh run list --workflow=publish.yml`), which is what put the package on npm — nothing was published by hand. **Do not verify with `npm view`**: it served a stale version from its local cache for minutes after a successful publish during the 4.6.1 release. Query the registry over HTTP.

The suite is **155 tests**, run under an empty `HOME` before the push, not just against this machine's real one:

```bash
FAKEHOME=$(mktemp -d) && HOME="$FAKEHOME" npm test; rm -rf "$FAKEHOME"
```

That control exists because v4.6.0 was tagged, failed `npm test` on the runner and never reached npm — two tests asserted against a `HOME` that already had skills installed.

## Shipped in 4.12.0 — `unload()`, the LiveView lifecycle, and the demo index

Upstream merged César's PR #13 (stale renderers surviving a LiveView reload) and Michael extended it the same day in `lifecycle clean-ups`: the retiring runtime's `SoundPool`, `MediaPlayer`s and audio proxies go down with the render loops, and Android's `GameViewProxy.releaseViews()` drops the view reference so the `GLSurfaceView` and its Activity can be collected. He also added `unload()` on sheets and fonts, and `example/hitbox.js`.

Documented from the diff `fa26a0a..df66122`, not from the release notes. The facts that matter to an app author: `unload()` is **permanent**, so a sprite still pointing at an unloaded sheet stops drawing silently — it is level streaming, not a cache; releasing the proxy unloads too; and nothing in app code changes for LiveView, but a scene still stuttering after ten reloads dates the build.

The skill also gained the navigation César asked for: `recipes.md` opens with an index of all 26 demos (what each is the reference implementation of, which recipe covers it), and `SKILL.md` closes with what each upstream file is authoritative for. `ios/README.md` yielded two app-facing facts worth keeping — a tap is a press released within 300 ms, inside the touch slop, verified in `TouchController` on both platforms.

## Shipped in 4.11.0 — per-axis hitboxes and word wrap

`hitboxScaleX`/`hitboxScaleY` (PR #11) and `maxWidth` word wrap (PR #12). Verified against the module source: the per-axis scales multiply `hitboxScale` rather than replace it, circle hitboxes skip them, and **neither reaches the touch area**, because `hitTest` runs against the full drawn frame. `maxWidth` is font-space px *before* `scale`.

A completeness pass over the whole module found nothing else missing — every `@Kroll` property and method, every creation option and all sixteen event names appear in `api.md`.

## `ti.game`'s version number is not a feature set — this keeps biting

Six features have now landed on top of the `0.4.0` manifest without moving it: the per-axis hitboxes, word wrap, both `unload()`s and the LiveView lifecycle. `project-setup.md` used to claim `0.4.0` "carries everything this skill documents"; it is now a table of what each build is missing, and it tells the reader to feature-detect by reading a property **before** writing it — `KrollProxy.setProperty` stores unknown names, so write-then-read always answers yes (checked in the SDK source).

The clone at `~/Developer/git-clones/ti.game` tracks `upstream/main` at `df66122`.

## Release cadence of the skill — six catch-ups in a week

4.7.0 shipped the skill; 4.8.0 through 4.12.0 each caught it up with upstream. That is the maintenance shape of `ti-game`: the module gains features faster than it versions them, so the roadmap table goes stale first and `EXAMPLE-PROMPTS.md`'s eval checklist right behind it — it has twice named an API that had already shipped (`createText`, then word wrap).

## Sibling parity — aiskills 1.21.0

| Repo | npm | Tests | Publish workflow | `release-docs` test |
|---|---|---|---|---|
| titools | 4.12.0 | 155 | yes | yes |
| aiskills | 1.21.0 | 111 | yes | **no** |

Both verified today: aiskills' `package.json` and `plugin.json` both read 1.21.0, the registry agrees, its tree is clean with nothing unpushed, and its suite passes 111/111.

Neither 4.11.0 nor 4.12.0 touched shared machinery — both are skill content only, so there was nothing to port.

## Open, not blocked

- **`test/release-docs.test.js` has not been ported to aiskills**, which has the same tag-triggered `publish.yml` and the same docs that can drift away from it. The test derives the publishing flow from the workflow file rather than asserting today's answer, so the port is mostly mechanical.
- **`scripts/generate-toc.mjs` and `fix-fences.mjs` live only here** — `~/Developer/openSource/aiskills/scripts/` still does not exist. Porting is not a `cp`: `fix-fences.mjs` carries Titanium-specific reasoning.
- **`manifest.test.js` is broader here** than aiskills' copy (agents, the nested hook format, the `files` allowlist in both directions). Worth sending back.
- **`docs/PENDING-IMPROVEMENTS.md` items 1 and 3 stand** (document mechanism #3 in the README; "Use when…" descriptions on the four opinionated skills). Item 2 is obsolete — it plans a migration that was reversed.
- **`docs/actualizar-skill.md` describes a pending correction to `ti-howtos`.** Not checked against the current skill from this session; it may already be fixed.

## Blocked by others

- **PurgeTSS help strings** — in the *PurgeTSS repo*, not this one: `bin/purgetss:321,327,328` print `default: 19` and `default: 20` where `src/core/branding/pieces.js` applies `18`, `26` and `26`. Recorded on 2026-08-14 and **not re-checked from this session**. Nothing in TiTools can fix it; the skill documents the correct numbers and flags the discrepancy.

## Local install

This machine runs TiTools via `npm link` — verified today: `/usr/local/bin/titools` symlinks into `lib/node_modules/@maccesar/titools/bin/titools.js` and `titools --version` prints 4.12.0. `npm publish` refreshes *other people's* installs, never this one; `isDevMode()` detects the repo's `.git` and skips `npm update -g` so the link survives.

## Deployment

Distribution *is* the release. Nothing here deploys by file sync: a change reaches users through the tag (npm, via `publish.yml`) or through a pushed `plugin.json` bump (marketplace). Because those are two separate acts the channels can drift, so check both whenever you need to know what users actually have. The maintainer's own post-release sequence is `/plugin marketplace update maccesar-titools` → `titools install` → `/reload-plugins`.
