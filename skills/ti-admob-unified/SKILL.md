---
name: ti-admob-unified
description: "Use when a Titanium app declares ti.admob.unified or its mediation complements, imports require('ti.admob.unified'), or asks to integrate/configure AdMob banners, interstitials, rewarded or app-open ads, UMP/ATT, privacy options, lifecycle, ad frequency or AppLovin, Meta, InMobi, Unity and Liftoff mediation with this module. Applies to Alloy and Classic on Android/iOS."
---

# ti.admob.unified — ads, privacy and providers

Integrate César's unified Titanium module using its official documentation and maintained application library. The local **1.0.0** contract is preparing for its first public release; do not claim a public release or usable production demand from these snapshots. Sources are pinned to **`5b4cbf9347a51c4f959dc262ac1500f82f28b4a0`**, copied 2026-10-11. See `references/source-snapshot.json` for paths/hashes and [references/source-notes.md](references/source-notes.md) for provenance and update checks. Check the installed build and current sources when behavior differs.

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
| Select/install providers, publisher accounts, mappings, diagnostics | [references/mediation.md](references/mediation.md), [references/dependencies.md](references/dependencies.md) |
| Replace legacy modules or internal builds | [references/migration.md](references/migration.md) |
| Unsupported formats, extending providers, license/distribution | [references/roadmap.md](references/roadmap.md), [references/contributing.md](references/contributing.md), [references/third-party-notices.md](references/third-party-notices.md) |
| Game experience and frequency decisions | [references/game-monetization.md](references/game-monetization.md), plus fullscreen/privacy |

Cite factual guidance with `[source: references/<file>.md]`. If the relevant source is unavailable, mark the claim `FROM_MEMORY (unverified):` and do not invent a method or provider setting.

## Integration invariants

- Inspect `tiapp.xml`, installed artifacts, project type and existing ad owner before adding another boundary. Use `ti-guides`/`ti-howtos`, Alloy or UI skills as applicable.
- Prefer the official copy-ready `assets/example/lib/ads.js`: copy unchanged to Alloy `app/lib/ads.js` or Classic `Resources/lib/ads.js`. Its documentation imports `require('lib/ads')`; preserve its path and provenance. `assets/example/library-usage.js` and `assets/example/app.js` are official integration evidence, not navigation templates to paste wholesale.
- Follow the documented UMP → request eligibility → initialization sequence. `canRequestAds()` is the gate, not ATT status or a guessed personalization flag. Resolve requested ATT separately; do not request it without an actual use case. Preserve privacy options and named-listener cleanup.
- Application IDs and ad-unit IDs are different. Use documented test IDs during development; do not switch to production IDs as an incidental fix.
- Native activity/app lifecycle and SDK banner refresh belong to the module/Google. The app owns tab/window coverage and reserved layout. Do not add refresh timers or duplicate background handlers for banners.
- Separate loading from deliberate fullscreen presentation. Do not show from a load callback. Coordinate game clock/audio/inputs and ad ownership; handle no-fill, failed presentation, actual close and destroyed screens without repeated ads or late navigation.
- Install only selected mediation complements on each target platform. All application calls use `ti.admob.unified`. Configure provider accounts and AdMob mappings; neither a packaged adapter nor `ready` diagnostics nor a Google test ad proves provider delivery. Do not invent placeholder keys, manual provider initializers or an `enableMediation` option.
- Consult the roadmap before suggesting native ads, rewarded interstitial or a network outside the distributed set. Supporting several formats does not justify enabling all of them in a game.

## Acceptance

Report separately: source/contract review, configuration/build/linking, Google test-ad behavior, each selected provider's own test delivery, and physical-device lifecycle/layout/visual acceptance. Use Ad Inspector as documented and re-check current Google/provider setup guidance before live configuration. A reported impression or passing stand-in test does not certify visible creative content or consent propagation. Do not click production ads to test delivery. No account creation, credentials, live ad activation or publishing is implied by ordinary integration work.

For games, use `ti-game` for native pause/cleanup and `ti-game-assets` for audiovisual assets. Respect the existing game's presentation policy; defaults and quotas are product choices to measure, not optimal values certified by this module.
