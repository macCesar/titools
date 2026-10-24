# Game monetization and module integration

Use [fullscreen.md](fullscreen.md), [privacy.md](privacy.md) and
[library.md](library.md) for calls. This reference adds game-specific product
and lifecycle criteria, not a second module API. Reviewed against
`ti.admob.unified@034843299b2984253988e0ffccb9f6a1c91682c9` (1.0.0).
Read [production.md](production.md) before shipping an application. When
available, `ti-game-assets/references/responsible-ads.md` adds asset/game
coordination; this skill remains usable independently of it.

## Current formats and their boundaries

| Placement | Integration boundary |
| --- | --- |
| Interstitial | Preload; show at a natural break without offering a reward. Avoid app entry, exit, active gameplay and repeated/consecutive interruptions. |
| Rewarded | Offer a clear voluntary exchange; present after acceptance; grant only from `rewarded` / `onRewarded`. |
| Rewarded interstitial | Implemented by `createRewardedInterstitial()` and its library manager. At a natural transition, explain the configured reward and show a clear, unobstructed Skip option before presentation, with enough time to understand and decline. The proxy/manager does not build this introduction. See [rewarded-interstitial.md](rewarded-interstitial.md). |
| App open | Implemented, but belongs only to an application's own foreground loading experience. Skip when content is already usable; do not show unconditionally from every resume. An expired ad needs a new load. |
| Banner/adaptive banner | Reserve a safe, measured slot away from controls; preserve that slot across ordinary screen pauses. See [banners.md](banners.md). |
| Native | No factory in 1.0.0. Format/test-ID constants alone do not implement it. |

Adding another implemented format still requires an intentional product decision.
Do not add forced rewarded continues or replace every retry with an ad. For a
rewarded-interstitial introduction, use the reward configured for that unit;
there is no pre-presentation reward getter. A visible Watch/Skip AlertDialog
works on both platforms; an iPad OptionDialog's hidden cancel item is not an
equivalent visible Skip action. Cancel a pending introduction when its screen
closes, the foreground or eligibility is lost, or another fullscreen is chosen.

Only the SDK's `rewarded` event grants value; `closed`, `impression`, clicks
and a successful Show attempt do not. The rewarded-interstitial native proxies
deduplicate reward callbacks per presentation and preserve the presented unit's
SDK reward while another request may load. Keep reward handling alive for the
SDK result: mediated reward and dismissal callback ordering can differ.
`destroy()` is terminal and suppresses late callbacks; it is not a dismissal API.
Client-side rewards do not provide server-side verification in this release.

## Privacy and integration ownership

Run the consent-first flow on every app launch: register listeners, request
UMP, wait for `consent_complete`, evaluate `canRequestAds()`, initialize, then
load. A failed UMP update may retain permission from a previous choice; an
error alone is neither approval nor denial. Continue the game without ads
when unavailable. Raw fullscreen proxies do not enforce this gate.

ATT is separate. If the app uses it, resolve the foreground prompt after UMP
and before initialization; keep the required description/translations even if
an AdMob UMP IDFA message presents ATT. Query
`getTrackingAuthorizationStatus()` to inspect state without prompting, including
after Settings. Android's `applicable: false` / `authorized: true` convention
is not general tracking permission. ATT denial does not override UMP's request
gate. If explicitly requesting ATT, wait for `tracking_authorization_completed`
even when permission was resolved in an earlier session. See [privacy.md](privacy.md).

The copy-ready library owns sequencing, deferred loads, dimensions and placement
cleanup. It does **not** choose game breaks, impose frequency limits, pause
native gameplay/audio/input, or serialize unrelated application modal flows.
Its `start()` promise is cached even after an unavailable result; repeating it
is not a startup retry. Use the documented raw consent/init recovery flow if
recoverable startup is part of the application. Never reset production consent
to force another attempt.

Provide an interactive privacy action when required. Serialize it with ads,
ATT and Inspector; suspend new ad opportunities until its result is evaluated.
The library reauthorizes/replaces requests after dismissal. Raw consumers must
replace requests affected by changed choices themselves. Do not destroy an
onscreen fullscreen ad to dismiss it or treat `destroyAll()` as cancelling
UMP/Inspector: it releases placements only. See [library.md](library.md).

## Community-Discovered Patterns

These are preserved author guidance and integration lessons from Lander/Guardian,
not additional module API or a verified optimal monetization policy. Their
frequency/director separation remains useful alongside the official library;
their application configuration and numeric thresholds are not defaults for
other games.

Choose deliberate natural breaks, such as settled end-of-run results, rather
than interrupting flight/combat or attaching an ad to every retry. Preserve
pause/tutorial/practice and voluntary-exit choices. Load early, but let the
application choose Show. A time threshold makes a later break eligible; it
never authorizes a timer-driven interruption. Google's
[interstitial placement guidance](https://support.google.com/admob/answer/6201362?hl=en)
disallows unexpected and excessive placements; re-check it before a live change.

Before presentation, capture the intended scene state, suspend native motion
and relevant timers, silence app-owned audio as appropriate, and release held
input. A stopped JS tick does not stop native gravity. Restore only the scene,
clock scale and audio that should still be active after dismissal or confirmed
failure, provided the owner is alive and the app is foregrounded. Do not blindly
resume a previously paused game, undo a newer navigation choice, or restore held
throttle/fire inputs. Returning from an ad is a lifecycle event, not a new ad
opportunity.

One application director owns presentation and rejects simultaneous attempts,
including UMP, ATT, Inspector and other fullscreen formats. Keep a once-only
continuation and an ownership/generation token so callbacks from an abandoned
screen cannot advance its successor. A missing-opening watchdog may recover an
attempt that never opens; after a confirmed `opened`, clear that watchdog and
wait for actual dismissal or presentation failure. An opening/impression does
not prove the creative was visibly rendered. Associate completion with the
active attempt: a rejected duplicate Show is not proof that an already open
ad has ended.

Distinguish the APIs at the boundary: raw `load()` / `show()` return no success
value. Library-manager `show()` returns `false` when not ready or when the
size guard requests a replacement; continue without blocking. A `true` result
means presentation was attempted and may still fail through `onFailedToShow`.
Supply the owning window. The manager does not queue a future Show after
returning `false`; a late load or background/resume must not launch a missed
interstitial. An explicit user-requested pending flow, such as the published
rewarded-interstitial demo, needs its own cancellation and introduction state.

Keep grace period, active-play accumulation, cooldown after dismissal,
hourly/daily caps and permitted boundaries distinct. Count actual openings
once and close separately; do not count both `opened` and
`showed_fullscreen_content` as two exposures. Preserve persistence and
conservative handling of clock rollback. Caps are ceilings, not exposure
targets, and application eligibility is separate from AdMob's ad-unit cap.
Use backoff after load/show failures; `autoReload` requests a replacement after
`closed` only and never presents it automatically.

A banner host must stay away from touch controls and reserve the native loaded
height inside safe areas. Choose `collapseOnFailure: false` on a library banner
when retrying should preserve its slot. Use screen-level `pause()` / `resume()`
only when navigation hides it while the same host lifecycle remains active;
background/activity lifecycle is already native. Pausing preserves the creative,
visibility and geometry; no JS refresh timer or destroy/recreate loop is needed.
On Android, ignore `_closeFromActivityForcedToDestroy` for placement teardown:
that close can be activity recreation rather than a destroyed screen. Remove
named listeners and destroy placements on actual owner disposal. Preserve reward
listeners until their result; destruction must not resume an abandoned game.

## Acceptance in the consuming game

Use test units and test devices. Exercise unavailable module, no fill,
load/show failures, repeated taps, late/duplicate callbacks, reward once,
Skip, real dismissal, background/resume, privacy changes, rotation between
load/introduction/Show, owner destruction and phone/tablet layouts on both
platforms. Check native clock, input and audio restoration on each path.

A source check, wrapper test, SDK opening or impression does not prove visible
creative rendering, provider delivery or acceptable game frequency. Record
physical visual acceptance separately. Where telemetry is authorized, measure
confirmed exposure per active-play minute, abandonment at boundaries and
retention/retries. Unit tests do not prove players enjoy the frequency.
Production units, app verification, app-ads.txt, provider setup and store/privacy
disclosures belong to [production.md](production.md), not game frequency logic.
