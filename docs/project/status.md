# Status — 2026-08-28

**Phase:** live and maintained
**Session by:** Codex
**Deployed:** `@maccesar/titools@4.16.3` is published; tag `v4.16.3`, GitHub Release, marketplace version on `main`, and the OIDC publish workflow were verified.
**Branch:** `main`; this documentation handoff is to be committed locally and left unpushed for the next update.
**Sibling:** `../AISkills` — the same shared-CORE invariant is recorded there in the same session.

## Where things stand

The `ti-game` audit and the live `npm link` installer behavior are already released. The shared CLI parity corrections are released as 4.16.3. This session changed no executable code: it converted sibling synchronization from guidance into a permanent, testable engineering requirement.

## In flight

- Nothing. The documentation commit is intentionally being held for the next TiTools update rather than triggering another patch release.

## Requirements

- R10 now requires every shared-CORE change to be ported to AISkills in the same working session, with both repos verified independently. Intentional differences must already be listed in `context.md` or recorded as a decision.

## Next step

Include this local documentation commit in the next TiTools update. Before changing shared CLI machinery, inspect the equivalent AISkills implementation and finish the session with both repos synchronized.

## Verified vs. assumed

- Verified: v4.16.3 release and npm publication succeeded; the current full suite passed 327/327 with lint clean; `titools doctor` reported no issues; all 9 canonical and Claude skill links resolved to this checkout; the documentation diff passes `git diff --check`.
- Assumed: none for this documentation-only handoff.

## Known pending

- Push and release this documentation commit as part of the next TiTools update; do not create a standalone version, tag, or release for it.
