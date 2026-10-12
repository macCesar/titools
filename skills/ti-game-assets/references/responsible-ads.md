# Responsible monetization in the game flow

Advertising is a game lifecycle/experience concern, not an image or sound asset format. Route here when the user requests monetization or the task touches existing ad transitions; do not initialize ads because assets are being generated. Use `ti-game` for native pause/cleanup and Titanium integration skills plus the installed ad-module documentation for exact APIs. If the project uses `ti.admob.unified`, inspect its version/source/examples; do not invent method names or edit a vendored upstream helper casually.

## Protect play and navigation

Choose deliberate natural breaks (for example, settled end-of-run results) rather than interrupting flight, combat, tutorial or a rapid retry. Do not queue an ad from a timer simply because a quota was reached. A load callback or foreground resume must not spring an old ad on a new screen. Failed/no-fill/skipped attempts should allow the user's intended action, without loops of loading screens or counting an exposure that never happened.

Use one owner and prevent simultaneous presentations. At the selected boundary, ensure the native game is actually paused or the session is released as appropriate; stopping a JS decision timer does not stop native gravity or audio. Do not universally destroy a session that legitimately needs to resume. Restore the correct scene, clock, inputs and sound only after dismissal or a confirmed failure to present.

Separate grace period, accumulated active play, cooldown since dismissal, per-hour/day quotas and eligible presentation points. Pause/background/menu time should not accidentally earn ad eligibility. Persist what the game's policy requires and handle restarts/date changes/clock rollback conservatively. Count a confirmed opening exactly once; count close separately. Do not copy Lander/Guardian's numeric thresholds as an industry optimum: those are an initial product configuration awaiting retention/fatigue evidence. Frequency caps are ceilings, not targets.

## Failure and callbacks

Guard continuations against screen destruction and duplicate/late callbacks. Bound the wait for an ad that never opens; a timeout must not unlock gameplay behind an ad confirmed open. Back/Menu/Retry should not each trigger another presentation. Preserve preload/backoff behavior without presenting from load callbacks. Exercise no module, no fill, load/show failure, repeated taps, late opening, actual dismissal, background/resume and destruction in both platforms.

## Format choice and measurement

Choose formats for the requested game: banners need safe placement away from controls and important visual/audio cues; rewarded ads need a clear voluntary offer, a predictable reward and completion handling without duplicate rewards. Do not silently replace an interstitial policy with paid continues, App Open, forced rewards or banners. Inventory the chosen policy and measure confirmed exposures, ads per active-play minute, abandonment around breaks, retries/retention and reward usage when applicable. Collect only authorized telemetry and keep experiments separate from normal persistent counters. No tested optimum follows from passing unit tests.

Use test IDs while developing. Preserve the existing consent/privacy flow and ability to revisit choices; consult current UMP guidance and the installed module's exposed eligibility before requesting ads. Consent is not a universal Boolean substitute for actual request eligibility. This guide does not enable live monetization, change IDs or make legal conclusions.

## Current policy sources

Check these official sources again before proposing or changing a live placement; policies can change. Consulted 2026-10-11:

- [AdMob: disallowed interstitial implementations](https://support.google.com/admob/answer/6201362?hl=en) — natural breaks, unexpected launches, navigation and excessive repeated placements.
- [AdMob: recommended interstitial implementations](https://support.google.com/admob/answer/6201350?hl=en) — natural boundaries and preload considerations.
- [Google UMP Android setup](https://developers.google.com/admob/android/privacy) — current consent updates, privacy options and request eligibility; consult corresponding iOS guidance and module documentation for platform parity.

Project evidence: Lander `app/lib/game/AdDirector.js` and Guardian `app/lib/systems/ad-director.js` separate presentation from play. Their October decisions document final-result attempts, active-play counters, confirmed openings, cooldown after close and callback ownership. Treat their old proposals and newer implemented decisions distinctly.
