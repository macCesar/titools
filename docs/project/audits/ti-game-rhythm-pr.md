# Proposed Rhythm comment correction

Target: m1ga/ti.game, upstream commit3bea2f4. Prepared for review; no PR,
commit, branch push or maintainer message has been sent.

## Title

Correct quarter-note timing comments in the Rhythm example

## Proposed body

The Rhythm example labels a400ms interval as an eighth note at150BPM.
At the stated tempo,60000/150=400ms is a quarter note; an eighth is200ms.
The existing1.6s spawn-to-pad travel spans four quarter notes.

This change corrects the three comments in example/rhythm.js. It preserves
SPAWN_MS, FALL_SPEED, audio assets and runtime behavior. It does not claim
an audio synchronization defect or change the native engine.

Validation: the source with line comments removed is byte-identical before
and after this patch, and node --check accepts the corrected JavaScript.
No device/audio synchronization measurement is implied.

## Patch

See [ti-game-rhythm-comments.patch](ti-game-rhythm-comments.patch).

## Separate native findings

The small-thrust damping cutoff and Rope.update at zero dt are independent
engine behaviors. Report them separately with Android/iOS reproductions,
intended semantics and regression tests; do not bundle a rest-policy or
pause-policy change into this comment correction. Evidence and scope are
in [the skill audit](ti-game-2026-10-12.md).
