# Game monetization and module integration

Use the official `fullscreen.md`, `privacy.md` and `library.md` contract for calls. This reference adds product/lifecycle criteria, not a second module API. The detailed asset-to-game coordination guide is `ti-game-assets/references/responsible-ads.md` when that skill is available; this skill works independently of it.

## Community-Discovered Patterns

These are author guidance and integration lessons from Lander/Guardian, not additional module API or a verified optimal monetization policy. Preserve this section during official-doc refreshes and re-evaluate its lifecycle claims against current builds.

Choose deliberate natural breaks, such as settled end-of-run results, rather than interrupting flight/combat or attaching an ad to every retry. Preserve pause/tutorial/practice and voluntary-exit choices. Load early, but only the application decides to show; reaching a time threshold makes a later boundary eligible, never a timer-based interruption. Current [Google guidance](https://support.google.com/admob/answer/6201362?hl=en) disallows unexpected and excessive interstitial placements; re-check it before a live change.

The ad boundary must suspend/release native motion and sound as appropriate. A stopped JS tick does not stop native gravity. Resume only the intended scene after an actual dismissal or confirmed show failure. One director owns presentation, protects against simultaneous attempts, and discards continuations after the screen/session closes. Timeouts may handle missing opening; they must not resume gameplay behind a confirmed open ad. A background/resume or late load callback does not start a missed ad.

Keep grace period, active-play accumulation, cooldown after dismissal, hourly/daily caps and permitted boundaries distinct. Count actual openings once and track close separately. Preserve persistence and conservative handling of clock rollback. Lander and Guardian implement this separation, but their numeric thresholds are initial settings without evidence of an optimum; do not transplant them into every game. Caps are ceilings, not exposure targets. Application eligibility is separate from the network's AdMob frequency cap.

Use test IDs and the official consent-first flow. Banners need layout away from controls; rewarded ads need an explicit voluntary offer, a real reward and one grant from the documented rewarded event. Interstitials are not rewarded ads. Do not add forced rewarded continues, App Open or a new format without product scope. The module's implemented formats and roadmap determine what is possible.

Test unavailable module, no fill, load/show failures, repeated taps, late/duplicate callbacks, real close, background/resume, destruction and phone/tablet layout on both platforms. An SDK opening/impression does not prove the creative was visible: physical visual acceptance is separate. Measure confirmed exposure per active-play minute, abandonment at ad boundaries and retention/retries where telemetry is authorized; unit tests do not prove players enjoy the frequency.
