# Status — 2026-10-14

**Phase:** synthesis documentation audit and seven-reference synchronization completed for internal use. Package,
plugin and lockfile versions remain at 5.2.0; no release, tag or push.
**Session by:** Codex.

## Completed

- `fa8a470` — `feat(ti-synthengine): document binaural positioning in 1.0.0 beta`.
  API and engine mirrors preserve the uncommitted module documentation based
  on `ef62edd`, with full upstream document SHA-256 values. Skill guidance,
  README and two smoke prompts cover coordinate limits, inherited pan
  conflicts, fixed positions, app-owned switches/percentages and stereo bypass.
- This session-documentation commit records source provenance in `context.md`
  and the rationale in `decisions.md`. Requirements did not change. No shared
  CLI changes or sibling port were needed.
- The installed `~/.agents/skills/ti-synthengine` resolves to this checkout,
  so the saved changes are available through the existing installation.

## Verification and limits

- Fresh closure run: 408/408 TiTools tests, no failures or skips; Pillow/PyYAML
  supplied within the `uv run` process lifetime. Log:
  `/tmp/titools-spatial-close-tests.log`. Whitespace checks pass.
- Earlier in this session, Java `SynthSpatialContractRegression` passed and
  the iOS contract matched all 78 corpus cases. Both updated mirrors matched
  upstream after snapshot/TOC removal, with matching hashes; generated TOCs
  were idempotent. No device listening or perceived localization is certified.
- The initial suite invocation failed only because its temporary Python
  executable expired; rerunning within the uv process lifetime passed.
- Native module implementation was read and tested without editing it.
  Pre-existing untracked `.agents/skills/purgetss-videos/` and `por-hacer.md`
  remain outside the commits. No external blocker prevents this closure.

## Next step

Recheck the module documentation hashes and replace working-tree provenance
with the actual source commit when the native spatial update is committed.
Headphone/device audition remains separate acceptance work. Releases remain
deferred; this task authorizes semantic commits and session documentation.

---

# Status — 2026-10-13

**Phase:** ti.game skill audit completed and committed for internal use; earlier 5.2.0 development implementation remains installed. César explicitly deferred releases: no push, tag or publication in this session. `ti.admob.unified` has not been publicly released according to the prior session record; no registry check was made today. Package/plugin/lockfile versions remain at 5.2.0.

## This session

- 2026-10-13 — Codex closed the pending audit with semantic commits, as
  requested. `627db16` contains the physics reference, corrected recipes,
  lifecycle/input caveats, example prompts and Unreleased changelog entry.
  The session-documentation commit contains context, decisions, this status
  and the audit report/source evidence/Rhythm proposal under
  `docs/project/audits/`. Requirements did not change.
- Fresh closure verification: 408/408 tests, zero failures or skips, using
  `TITOOLS_ASSETS_PYTHON=/tmp/titools-game-assets-venv/bin/python npm test`;
  `npm run lint` and staged whitespace checks pass. Test log:
  `/tmp/titools-session-close-tests.log`. Native/device, audio and retrieval
  results below are evidence from the October 12 audit, not rerun today.
- The installed skill continues to resolve to this checkout; saved reference
  changes are available through that existing installation. No shared CLI
  changes or sibling port are involved. The pre-existing untracked
  `.agents/skills/purgetss-videos/` and `por-hacer.md` remain outside the commits.

## Previous session — 2026-10-12

- 2026-10-12: added César's positively rated autopilot coasting brake profile
  to ti-game/references/physics.md: damping1.2/s without thrust,0 with thrust.
  Optional feel reference for future games, especially arcade racing; not a
  default or a request to change Asteroids. Installed skill resolves to this
  checkout, so the reference is available through its existing physics route.

- 2026-10-12: audited `ti-game` entrypoint and all nine existing references;
  added reusable `references/physics.md` and routed it from the skill/recipes.
  Upstream HEAD rechecked at3bea2f4; local native changes remain separate.
  Corrected diagonal movement, lander impact evidence, wind/fuel guidance,
  Rhythm subdivisions, counts and stale TileLayer attribution; documented
  damping/rope pause and iOS view/gamepad ownership limits.
  Baseline retrieval gaps and two failing recipe cases were reproduced;
  corrected scenarios now pass. Full TiTools suite408/408 and lint pass.
  Audit/report and comment-only Rhythm PR draft/patch are in docs/project/audits/.
  Installed ti-game skill points to this source checkout. At audit completion
  on October 12, no commit, push, tag, release, upstream PR or native-module
  edit had been made; the TiTools changes were committed on October 13 above.

- Session closed across Asteroids and TiTools:1d04e11 commits the skill and
  changelog refinements. Context, requirements, decisions and status updated
  in a separate documentation commit. Manifest suite80/80 repeated at closure;
  log /tmp/titools-session-final-manifest.log. No push, tag, version bump or release.
  Pre-existing untracked .agents/skills/purgetss-videos/ and por-hacer.md remain
  outside this session's commits.

- HD finish follow-up: individual masters require sharp delineation, clean
  gradients and textures, straight panel boundaries and smooth regular curves.
  Mechanical reconstruction uses the original for topology, avoiding its rejected
  shading or geometry; requested symmetry includes balanced lighting. Proportional
  integer rounding applies to every target cell size, with32px only an example.
  Manifest suite80/80 and quick_validate pass. Skill changes committed in1d04e11; no release.

- Sprite-sheet integration follow-up: a dedicated section now covers ti.game grid/TexturePacker atlases, proportional reduction rounded with floor(value + 0.5), the28.3→28×32 and17.7→32×18 examples, integer centering, sequence alignment, filters and physical-position separation. Manifest suite80/80 and quick_validate pass. Documentation committed in1d04e11; no release.

- Follow-up from Asteroids: pixel-art guidance now explicitly maps HD blocks to final logical resolution and visible phase extent; uniform square RGBA clusters, progressive smoke alpha and nearest-neighbor inspection at game size. Manifest suite80/80 and skill quick validation pass.

- Follow-up from Asteroids: clarified maximum useful canvas use directly in the canonical `skills/ti-game-assets/SKILL.md`, art-direction guide and prompt examples. Individual HD masters use tight framing and actual generator dimensions, without default occupancy percentages or fixed resolution ceilings. Shared state/animation canvases remain aligned. The installed skill is a symlink to this checkout; no reinstall is needed. This documentation adjustment is committed in1d04e11 and does not create a release.

- Semantic implementation commits: `e623e5b` (`ti-game-assets`) and `5d70bcb` (`ti-admob-unified`, official-source maintenance and integration). The changelog remains under `[Unreleased]`; 5.2.0 is the synchronized development manifest version, not a published release.

- Added `skills/ti-game-assets/`: concise entrypoint, Codex metadata, ten specialized guides, visual/audio manifest example, Pillow alpha helper and manifest validator.
- Sound creation/refinement is an essential domain alongside images, per César's clarification. Includes synthesis fundamentals, meaningful variants, stereo placement, mixing/overlap budgets and audition criteria. `ti-game` and `ti-synthengine` retain equal authority in their domains; the native sound identifier is `ti.synthengine`.
- Raster creation/editing uses integrated `image_gen`. Existing SVG/procedural pipelines preserve editable sources and generate PNG derivatives; procedural sound generators may produce WAV. No paid image generation, new Asteroids sound library, asset/balance changes or frame loops were performed.
- Registered in installer catalog, `ti-pro`, conditional audit, README/examples and reciprocal module-skill links. Canonical `~/.agents/skills/ti-game-assets` resolves to this checkout. Existing platform detection/plugin suppression linked Claude because its enabled cache does not provide the new skill.
- New Python tests cover threshold residue, soft effects, detached pieces, empty/faint images, preserved RGBA/RGB, crop offsets/common canvas, incomplete contracts, sound-only contracts, sequences, aliases, dimensions, transparency declarations and parallax. Publish CI installs only the TiTools-specific helper dependency in a venv; shared CLI behavior was not changed and no sibling port is owed.
- Independent read-only review evaluated pixel art, HD art, soft explosion, parallax with audio and synthesis requests without paid generation. It found a missing Boolean/opaque transparency check; regression failed before the fix and passes after. Empty contracts are also rejected; sound-only contracts remain valid. Codex metadata now names both art and sound.

## Follow-up: Lander, Guardian and official AdMob skill

- Read-only project review found missing repeat topology/phase checks, editable SVG/procedural source workflows, deterministic source-to-output hashes, offline PCM WAV analysis/loop validation and responsible advertising. Added four references and optional SVG/build-hash/WAV manifest checks; their regression tests failed before implementation and pass now. No assets, balance or native modules in those games were changed.
- Created/installed `ti-admob-unified` directly after César authorized proceeding without another plan. All new skill instructions, references, examples and metadata are English. It mirrors all 11 official guides at clean module commit `5b4cbf9347a51c4f959dc262ac1500f82f28b4a0`, includes dependency/roadmap/contributing/history/license references, and ships three byte-identical official example files.
- Registered installer, agent, conditional audit, README/examples and game-asset routing. The native module identifier is `ti.admob.unified`; its first public 1.0.0 release is under preparation. Package/plugin/lock remain synchronized at the still-unpublished TiTools 5.2.0 implementation.
- Added source mapping and cache entry to the maintainer auditor. `scripts/verify-module-snapshot.mjs` detects changed/missing/new docs, modified mirrors, dirty sources and commit changes without writing/fetching. Curated game experience guidance is protected separately under `Community-Discovered Patterns`; official docs/library do not silently absorb it.
- Snapshot/source-fidelity, cross-file-link/anchor, official-example syntax and drift-detection tests pass. A broken official API anchor was corrected only in the mirror and recorded as a reversible transformation; reconstructed original hashes still match. TiAdmobUnified source checkout stays clean. Linking, Google test ads, provider account/mapping/test delivery and visible device behavior remain distinct acceptance categories, not claims from a documentation check.
- Verified available FFmpeg/ffprobe/rsvg tools; read-only FFprobe and `astats` ran on Lander's current thruster WAV. Its generator uses Python PCM synthesis, Guardian's backup uses direct Node RIFF synthesis; no evidence was used to attribute their original generation to FFmpeg or certify automatic musical note recognition.

## Validation and limits

- `TITOOLS_ASSETS_PYTHON=/tmp/titools-game-assets-venv/bin/python npm test`: 407 Node checks, including the Python helper suite (16 behavioral tests after SVG/hash/WAV additions).
- `npm run lint`, skill-creator `quick_validate.py`, `git diff --check` and npm dry-run content inspection checked this session. An actual 5.2.0 tarball in `/tmp` contains 16 game-asset files and 24 AdMob-skill files; installing it into a disposable consumer verified copied references and both callable helpers. The preview was inspected on checkerboard, light and dark backgrounds; legitimate detached components remain.
- Manifest checks prove source/inventory/geometry contracts, not artistic quality, recipe symbol resolution, exact synthesis options, native synchronization or device sound quality. The skill delegates those to project exporters and current native-module contracts. No new sound recipes were auditioned because this task creates a skill, not a game library.
- Pre-existing untracked `.agents/skills/purgetss-videos/` and `por-hacer.md` were preserved.

## Next step

Use the installed skills internally. Do not create releases, tags, publish or push from this task; César requested semantic commits only and explicitly deferred releases, especially while `ti.admob.unified` remains unpublished. Existing unrelated pending work is recorded in the historical status below.

---

## Historical status — prior session

# Status — 2026-10-04

**Phase:** v5.1.1 shipped; live and maintained. Three commits on `main` since, none released.
**Session by:** Claude Code · Sonnet 5.5 (`claude-sonnet-5-5`).
**Deployed:** `@maccesar/titools@5.1.1` on npm (`npm view` answers `5.1.1` today). Tag `v5.1.1` → `1a4dbb4`. Nothing after it is published.
**Branch:** `main`, 2 commits ahead of `origin/main` (`a057159` and this note, not pushed). Untracked `por-hacer.md` is the maintainer's note about the PurgeTSS videos; it predates this session and stays out of git.
**Sibling:** `git diff v5.1.1..HEAD -- lib/ bin/ hooks/` is empty, so no port to `../aiskills` is owed. `../aiskills` is aligned with its `origin/main` and clean.

## Where things stand

Unreleased on `main`, under `[Unreleased]` in `CHANGELOG.md`:

- **`83c43b7`:** `titools-skill-auditor` reaches Codex through a relative symlink in `.agents/skills/`.
- **`5c08d04`:** `purgetss-videos`, a maintainer-only skill under `.claude/skills/`, not shipped to npm.
- **`cff9438`:** `ti-synthengine` follows the TiSynthEngine 1.0.0 public release at `e8f1d0d` (2026-09-29), re-pinned from `6685b81` (2026-08-29). The seven references copied from upstream `documentation/` were regenerated from that commit and match it byte for byte apart from the snapshot line, the generated TOCs (`guide`, `examples`, `sound-design`) and the two closing paragraphs that point at `recipes.md`. `SKILL.md` gained `WAVE.WAVETABLE`, the shaping-field ranges, the chord shaping fields and `audioSession: 'ambient'`. `recipes.md` is TiTools-only and needed no change.

**`a057159` (2026-10-04, not pushed):** `ti-synthengine` follows TiSynthEngine `ef62edd`, the commit that adds `decay`/`sustain`, the resonant filter, FM, `detune`/`detunes` and the `patternend` event. `SKILL.md` has the new invariants and decision-guide rows, the seven references match `ef62edd:documentation/` apart from the snapshot line, the generated TOCs and the two closers that point at `recipes.md`, and `recipes.md` has eight new recipes plus the layered chord rewritten around `detunes`. `npm test` gave 364/364 before the commit. Every call in the skill's code blocks was replayed through the real `SynthContract.java`, and the recipes were executed against a mock `synth` (30/30 calls accepted). The new recipes are contract-valid only: nobody has listened to them. **Owed:** run `/humanizer` over the README and CHANGELOG text if it is edited again before a release; re-check the skill if the module's contract changes before it ships.

`ti-game` was checked the same day and is current: the skill pins upstream `3bea2f4` (2026-09-02), and `git ls-remote` shows both `m1ga/ti.game` and the `macCesar` fork at `3bea2f4`; latest upstream tag `0.5.0`.

The two TiSynthEngine doc defects noted on 2026-09-29 (`missing_required` listed twice, `invalid_sample_count` missing from the reasons table) are fixed in the working tree on both sides, together with a third found on 2026-10-04: upstream gave the `noteValue` list as `1n` to `32n`, but the contract accepts `1n`, `2n`, `4n`, `8n`, `16n`, `2n.`, `4n.`, `8n.`, `8t`, `16t` and rejects `32n`.

## Blocked on someone else

- **Font Awesome Pro/Beta family names need the maintainer's Pro fonts.** The reset `.tss` for Pro/Beta name `FontAwesome6Pro-*` while the copied files are `FontAwesome7Pro-*`. The skill does not state either, so nothing here depends on it yet.
- **`swap()`'s `rect` fallback was checked in the PurgeTSS source only**, not on a device.
- **An adoption page for `purgetss-docs`**, based on `adopting-purgetss.md`, waits on the maintainer's call.
- **The first contribution to the official Titanium docs still waits on `hansemannn/titanium-firebase-cloud-messaging` PR #170.** Not re-checked today.

## Requirements

- R3 (version files agree) holds at `5.1.1`; no bump since.
- R7–R9: 364/364 tests pass locally at `cff9438`. They cover the skill's registration and the `tiapp.xml` hook, not the content of its references.
- R10 is not implicated: no shared CLI machinery changed.

## Next step

1. **Push `cff9438`**, then decide when the three unreleased commits go out (`/release`). The `ti-synthengine` change reaches npm users only with a release.
2. **Re-align `ti-synthengine` if TiSynthEngine fixes its two doc defects** before or after going public; re-pin to the new commit.
3. **Re-audit `purgetss` against `.purgetss-docs` 1.1.14**, now that the docs were corrected at the source. The alignment above followed the handoff's list and the 7.18.0 changelog; it was not a page-by-page pass over the docs.
4. **The contribution to the new Titanium site, once PR #170 merges.** The plan in the previous status still stands: `content/docs/build/notifications.md` against `skills/ti-expert/references/push-notifications.md`, after reading the site's `docs/writing-guides.md` and adding an `upstream` remote.
5. **When Titanium 14.0.0 ships**, run `apidoc-coverage.mjs` against the new tag.
6. **`EXAMPLE-PROMPTS.md` has no prompt routed at the push-notification reference or at `adopting-purgetss.md`.** Not re-checked today beyond noting the new guide.
7. **The SessionStart hook still does not reach npm-only installs.** A design question, written up in `context.md` § Traps.

## Verified vs. assumed

- **Verified 2026-09-29:** 364/364 tests at `cff9438`; the seven regenerated `ti-synthengine` references `diff` clean against `e8f1d0d:documentation/` once the snapshot line and TOC are stripped; upstream and fork `main` of ti.game at `3bea2f4` by `git ls-remote`.
- **Verified at v5.1.1 (2026-09-26):** publish run `36292092017` concluded `success`; the registry serves `latest 5.1.1` and the 5.1.1 tarball returns 200; tag `v5.1.1` → `1a4dbb4`; all three version files read `5.1.1`.
- **Verified at v5.1.1:** 362/362 tests before the release commit and in CI.
- **Verified at v5.1.1:** the three generated indexes name 3015 class tokens, 0 absent from `utilities.tss`. The checker was run first on known-good (`bg-white`, `row-h-*`) and known-bad (`row-height-*`, `border-t-*`, `hires-true`) inputs. The parser's unique-class count matched an independent `grep` at 7.17.1 (23,343); at 7.18.0 it reports 23,332.
- **Verified at v5.1.0:** 553 relative links and anchors under `skills/purgetss` resolve (checker controlled with a known-bad anchor and a missing file). No PUA glyphs, no `var`, no reference over 800 lines, and every code fence closes.
- **Verified by running the cached CLI in throwaway projects:** `(Npx)` halts the purge; semantic color nesting works at any depth since 7.10.0; `extend.View` needs the `default` wrapper; the 4096 px output cap (width 1024 passes, 1025 aborts).
- **Verified against apidoc `13_4_1_GA`:** `padding` exists only on `TextField` and `TextArea` (both platforms), `Ti.UI.Android.CardView`, `ScrollableView` (Android), `TabGroup` bottom navigation (Android) and `Ti.UI.iOS.ButtonConfiguration`. PurgeTSS's "padding - Android Only" label is wrong for the two text inputs; the skill says so.
- **Corrected during the session:** the agents first propagated that "Android Only" label into two references; fixed after checking the apidoc.
- **Corrected during the session:** `Alloy.createStyle` was treated as unverifiable. Both it (`Alloy/template/lib/alloy.js:231`) and `$.createStyle` exist in Alloy 3.0.1.
- **Assumed, not verified:** the TiKit API in `tikit-components.md`, which no cache covers. The Boxicons and LineIcons codepoints in `icon-fonts.md` come from those projects' CSS, not the PurgeTSS package.
- **Assumed, not verified:** no client has loaded the updated `ti-synthengine` skill and answered a prompt with it.

## Known pending

- The maintainer's CLI is `npm link`-ed here, so the new skills are live; `titools update` adds the symlink for nothing new this time, since no skill was added.
- `.purgetss-docs` and `.purgetss-source` are full clones duplicating `~/Developer/openSource/purgetss-docs` and `~/Developer/openSource/purgeTSS`, at the same HEADs. Converting them to symlinks frees about 408 MB. Not done: the maintainer's call.
- `CLAUDE.md` now imports `@.claude/memory/index.md`, but `.gitignore` excludes `.claude/memory/`, so the import resolves only on this machine.

## Game-asset export selections — 2026-10-13

The ti-game-assets entry point and integration/manifest references now require
an explicit resource selection and actual consumer for every derived output.
A complete source inventory does not justify copying all frames/aliases to
menus or HD previews. Regeneration must remove obsolete generated densities
and verify their absence in the compiled package. Examples are generic;
Titanium Asteroids filenames, sizes and selections remain in that project.

Validated the skill and passed 408/408 TiTools tests using Pillow/PyYAML via uv
with PYTHONDONTWRITEBYTECODE=1. The initial plain npm test run lacked Pillow
and detected bytecode generated during asset preparation; that cache was
removed before the passing run. No CLI machinery or release manifests changed.

## Official synthesis documentation completed — 2026-10-14

César identified that the previous source lacked app-integration instructions. TiSynthEngine now commits the completed guide and documentation regressions in f1b3919/918c9a6. All seven official mirrors and the skill entry point are synchronized to918c9a6 with document SHA-256 provenance. Guide routing now covers per-effect adaptation, amplitude versus direction, screen-coordinate conversion and bypass. The copies match upstream exactly after stripping provenance/TOCs. The installed universal skill symlink resolves to this checkout.

The module's audit checks method-option tables against both native contracts, every reported default, coordinate-helper behavior and165calls accepted by native iOS; its78case parity corpus passes. No skill reference is treated as independent proof of its source. TiTools versions remain5.2.0 and module beta1.0.0; no publishing, tag, push or device installation. Pre-existing untracked `.agents/skills/purgetss-videos/` and `por-hacer.md` are unrelated and preserved.

Verification: skill-creator quick validation passed;408/408TiTools tests passed using Pillow/PyYAML via uv. Content committed in `407bb70`; session-note updates are committed separately. Versions and unrelated untracked files remain unchanged.
