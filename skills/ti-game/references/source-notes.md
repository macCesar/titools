# Source provenance and audit limits

Reviewed on 2026-10-23. This skill is a curated reference, not a bundled module
binary or an assertion that a fork build has been published.

## Reviewed sources

- Upstream: `m1ga/ti.game@88e181cb85526d8146d0be6e09b2b90c2551baad`.
  This was the upstream baseline at the October 23 audit. Current upstream
  `main` was rechecked on October 29; see the integration record below.
- Fork documentation snapshot: `macCesar/ti.game@2bf5f828a3bb8028eed20d6ba27b97dd3aa9a753`
  (`docs/update-current-features`). Its source tree contains the audited
  upstream engine, not merely the older `3bea2f4` baseline.
- Fork delta from the audited upstream baseline: README/tutorial/TODO/Apple build documentation,
  Xcode SDK selection, Camera example key binding, demo generation and
  example-input regression checks, plus maintainer instructions.
- The documentation snapshot is the exact head of
  [upstream PR #39](https://github.com/m1ga/ti.game/pull/39), branch
  `docs/update-current-features`. PR metadata and the remote branch both matched
  `2bf5f82` during the October 23 audit. Its Camera Z/X binding correction and diagnostic
  launcher discovery/SDK/indirect-input fixes were included in this audit.
- Only `AGENTS.md` was dirty when the audit started; that instruction-file
  edit is not a native/API modification. Audited module documentation and
  native files were committed. No module files were edited by this audit.
- Both manifests: `1.0.0`, minimum Titanium `13.4.0`. Builds documented at
  Titanium `13.4.1.GA`; Apple minimum iOS 15. Release/nightly artifact versions
  do not identify a source commit or prove these fork clarifications shipped.

Sources are the root README, `tutorial.md`, `ios/README.md`, TODO, the complete
35-demo launcher/catalog and helpers, plus both platforms' proxies, simulation,
input and renderer implementation where contracts require them. Maintainer
plans, personal project state and issue drafts are excluded from public API
requirements; they are not additional supported APIs.

## Upstream integration verified October 29

[PR #39](https://github.com/m1ga/ti.game/pull/39) was merged on
2026-10-29 at 08:31:11 UTC. Current `m1ga/ti.game` main is merge commit
`db11980af74b4ff5349df47ec25910486b39d2f4`. Its complete Git tree is identical
to the audited documentation head `2bf5f828a3bb8028eed20d6ba27b97dd3aa9a753`:
both resolve to `980fa0433019f31319d0e7cee5a51bdddd5576d3`.

The current upstream comparison contains only the merge commit and no file
differences. The audited Metal/Catalyst, configurable input and documentation
clarifications are therefore integrated upstream. Keep the original audit pins
and document fingerprints below; merging changes provenance, not their contents.
This check does not establish which release/nightly ZIP includes the merge or
extend any physical-device acceptance.

## Source fingerprints

SHA-256 of the reviewed committed documents/configuration:

| Source path | SHA-256 |
| --- | --- |
| `README.md` | `a1970c35c56880d7722d9397b968502b8357c9c3b0b83ee2dd2be4e18df02dd6` |
| `tutorial.md` | `a57e609935a92b6efb0513a9ddc271d4a9d1f7ead5188612d1014533ec801d7d` |
| `ios/README.md` | `89ab286034acdfed05627316cfd93b4b019cc44a99e7c5a46c8d2b38f564fd4b` |
| `TODO.md` | `a9c3b3ce25883bdc4472a908f2bcd955dcd415ec37f8d8c6b9129a7a505f4cd3` |
| `android/manifest` | `4c20ea79fb9ccb87581b37a2b8450a635f84e5f2ff53bf5c6d574faa0260340d` |
| `ios/manifest` | `472f4f0d572416b0df739ca8fcdc03febd4e20a3ecedcb99c6e494925c3ea6c0` |

## Current corrections and unresolved source conflicts

- Apple is Metal/CAMetalLayer; Android retains OpenGL ES. No public Apple
  backend selector or app-provided `default.metallib` is required.
- Configurable digital actions, keyboard/mouse focus, GameController fanout
  and cancellation are current contracts; see [input.md](input.md).
- Assigning Sprite `frame` stops its animation and queued chain. Android's
  optional animation completion `frame` is not portable to Apple. Set animation
  definitions at creation for portable code. See [api.md](api.md).
- Damping now lets effective unopposed acceleration build speed from rest; zero-delta rope updates
  freeze initialized geometry. Historical contrary guidance from `3bea2f4`
  must not be applied to this source pin. See [physics.md](physics.md).
- README Draw text retains an obsolete ASCII-only sentence. Its Font section
  and both native maps include precomposed accented Latin glyphs; the skill
  follows the implementation and lists the actual repertoire.
- Telemetry reports CPU drawable acquisition/presentation submission, not GPU
  duration or proof of display. Missing drawables/slot pressure preserve elapsed
  simulation up to the documented recovery cap; pause/suspension resets clocks.
- App orientation/launch policy belongs to Titanium, not the module. The older
  `ti-ui` orientation guide is not a fully audited multi-activity setup; that
  dependency remains explicitly limited in [project-setup.md](project-setup.md).

## Verification boundaries

The audit reconciles current reference guidance with source and focused host
regressions. Native resolver tests exercise Java/Objective-C binding validation,
aggregation and state transitions. Physics fixtures execute extracted production
methods with controlled collaborators. JavaScript demo/layout tests use mocked
Titanium/game objects. These do not establish GPU behavior or physical keyboard,
mouse, controller, navigation or audio acceptance.

Apple's own README records renderer acceptance on Apple Silicon Catalyst and a
physical iPad (18 tests on 2026-10-22). This audit does not rerun or extend that
evidence. Physical iPhone, Intel execution, complete interactive demo acceptance
and controlled performance comparisons remain pending in the module source.
