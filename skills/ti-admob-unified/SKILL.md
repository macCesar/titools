---
name: ti-admob-unified
description: "Use when a Titanium app declares ti.admob.unified or its mediation complements, imports require('ti.admob.unified'), or asks to integrate/configure AdMob banners, interstitials, rewarded, rewarded interstitial or app-open ads, UMP/ATT, privacy options, lifecycle, ad frequency or AppLovin, Meta, InMobi, Unity and Liftoff mediation with this module. Applies to Alloy and Classic on Android/iOS."
---

# ti.admob.unified — ads, privacy and providers

Use the public **ti.admob.unified 1.0.0** module through its official
[repository](https://github.com/macCesar/ti.admob.unified),
[Android release](https://github.com/macCesar/ti.admob.unified/releases/tag/android-1.0.0)
and [iOS release](https://github.com/macCesar/ti.admob.unified/releases/tag/ios-1.0.0).
Reviewed released source: `034843299b2984253988e0ffccb9f6a1c91682c9` (2026-10-24).
The core supports banners, interstitial, rewarded, rewarded interstitial and
app-open formats; install only the mediation complements the app uses.
Requires **Titanium 13.4.1.GA**, iOS 15+, Android API 24+ (compile SDK 36).
Apple packages target iOS, not Mac Catalyst. See [source notes](references/source-notes.md)
and the [snapshot](references/source-snapshot.json) for provenance and validation
boundaries. Public module availability does not establish production ad eligibility.

## Required workflow

Read the relevant references before proposing calls or configuration. Do not infer this API from old `ti.admob`, `ti.android.admob` or raw Google SDK examples.

| Task | Read first |
| --- | --- |
| Install artifacts, app IDs, platform settings, first test request | [references/getting-started.md](references/getting-started.md) |
| Ownership, navigation, layout, refresh, Alloy/Classic integration | [references/integration.md](references/integration.md), [references/library.md](references/library.md) |
| Exact factories/methods/options/events/constants/payloads | [references/api-reference.md](references/api-reference.md) |
| Consent-first startup, ATT, privacy options, request eligibility | [references/privacy.md](references/privacy.md) |
| Fixed/adaptive banners, real reserved layout and pause/cleanup | [references/banners.md](references/banners.md) |
| Interstitial/rewarded/app-open load/show, rewards and cleanup | [references/fullscreen.md](references/fullscreen.md) |
| Rewarded interstitial introduction, visible Skip, rewards and cancellation | [references/rewarded-interstitial.md](references/rewarded-interstitial.md), [references/fullscreen.md](references/fullscreen.md) |
| Production IDs, app-ads.txt, store/AdMob readiness and final-build checks | [references/production.md](references/production.md) |
| Select/install providers, publisher accounts, mappings, diagnostics | [references/mediation.md](references/mediation.md), [references/dependencies.md](references/dependencies.md), [references/mediation-parity.md](references/mediation-parity.md) |
| Replace legacy modules or internal builds | [references/migration.md](references/migration.md) |
| Unsupported formats, extending providers, license/distribution | [references/roadmap.md](references/roadmap.md), [references/contributing.md](references/contributing.md), [references/third-party-notices.md](references/third-party-notices.md) |
| Official docs index and release history | [references/index.md](references/index.md), [references/module-changelog.md](references/module-changelog.md) |
| Game experience and frequency decisions | [references/game-monetization.md](references/game-monetization.md), plus fullscreen/privacy |

Cite factual guidance with `[source: references/<file>.md]`. If the relevant source is unavailable, mark the claim `FROM_MEMORY (unverified):` and do not invent a method or provider setting.

## Integration invariants

- Inspect `tiapp.xml`, installed artifacts, project type and existing ad owner before adding another boundary. Use `ti-guides`/`ti-howtos`, Alloy or UI skills as applicable.
- Prefer the official copy-ready `assets/example/lib/ads.js`: copy unchanged to Alloy `app/lib/ads.js` or Classic `Resources/lib/ads.js`. Its documentation imports `require('lib/ads')`; preserve its path and provenance. `assets/example/library-usage.js` and `assets/example/app.js` are official integration evidence, not navigation templates to paste wholesale.
- Follow UMP → optional foreground ATT → `canRequestAds()` → initialization/loading. A UMP error can retain prior eligibility; check the gate. `getTrackingAuthorizationStatus()` reads ATT without prompting or initializing. Android reports `applicable:false`; its `authorized:true` convention does not grant general tracking permission. The library defers ATT to `resumed` when needed. Preserve privacy options and named-listener cleanup.
- Application IDs and ad-unit IDs are different. Use documented test IDs during development; do not switch to production IDs as an incidental fix.
- Preserve banners during Android's `_closeFromActivityForcedToDestroy` event; ordinary close still destroys the owner. Each banner manager has independent coverage/background state. Native activity/app lifecycle and SDK banner refresh belong to the module/Google. The app owns tab/window coverage and reserved layout. Do not add refresh timers or duplicate background handlers for banners.
- Separate preloading from deliberate presentation. Loading alone never authorizes showing. An explicit pending Show intent must expire with its presentation context. Coordinate game clock/audio/inputs, no-fill, show failure, close and destroyed screens. Raw `load()`/`show()` are void; manager Boolean returns describe its attempt, not delivery. A stale-size rejection reloads but does not queue manager presentation. `autoReload` is a live close policy that loads another ad, never presents it.
- Rewarded interstitial requires an accurate reward introduction and a visible Skip option. Present only while that introduction remains valid; credit only `rewarded`, not close/impression/click. Cancel pending introductions on background, lost eligibility, navigation or another fullscreen. Reward handling may need to survive screen changes for an already-presented ad.
- Install only selected mediation complements on each target platform. All application calls use `ti.admob.unified`. Configure provider accounts and AdMob mappings; neither a packaged adapter nor `ready` diagnostics nor a Google test ad proves provider delivery. Do not invent placeholder keys, manual provider initializers or an `enableMediation` option.
- Consult the roadmap before suggesting native ads, deferred ironSource or a network outside the distributed set. Supporting several formats does not justify enabling all of them in a game.

## Acceptance

Report separately: source/contract review, configuration/build/linking, Google test-ad behavior, each selected provider's own test delivery, and physical-device lifecycle/layout/visual acceptance. Use Ad Inspector as documented and re-check current Google/provider setup guidance before live configuration. A reported impression or passing stand-in test does not certify visible creative content or consent propagation. Do not click production ads to test delivery. No account creation, credentials, live ad activation or publishing is implied by ordinary integration work.

For games, use `ti-game` for native pause/cleanup and `ti-game-assets` for audiovisual assets. Respect the existing game's presentation policy; defaults and quotas are product choices to measure, not optimal values certified by this module.
