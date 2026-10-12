> Source snapshot: official ti.admob.unified 1.0.0 documentation at commit `5b4cbf9` (copied 2026-10-11). Relative links rebased for this skill.

# ti.admob.unified roadmap

## Current baseline

Version `1.0.0` establishes one portable AdMob distribution with five optional mediation complements:

- Titanium `13.2.0.GA`
- iOS `15.0+`
- Google Mobile Ads iOS `13.10.0`
- User Messaging Platform iOS `3.1.0`
- Android API `24+`, the floor the Titanium module template sets
- Google Mobile Ads Android `25.5.0`
- User Messaging Platform Android `4.0.0`
- five optional per-network modules on iOS and Android; ironSource mediation deferred
- idempotent initialization and consent
- terminal `consent_complete` events
- one standard/adaptive banner lifecycle on both platforms
- one interstitial/rewarded/app open lifecycle and event contract on both platforms
- portable tracking-authorization completion on both platforms
- no manual TCF personalization inference

## Implemented for 1.0.0

### Privacy contract

- `canRequestAds()` is the only supported ad-request gate.
- UMP updates and form presentation use the current native flow.
- `initialize()` and `requestConsent()` serialize concurrent calls.
- Every accepted consent operation reaches `consent_complete`.
- Privacy-options dismissal always emits a terminal event.
- `requestTrackingAuthorization()` is portable after UMP: iOS resolves ATT and Android completes immediately with `applicable: false`.
- Legacy privacy aliases remain documented but are not used by new examples.

### Banner contract

- Standard and adaptive banners expose `load()`, `pause()`, `resume()`, `destroy()`, `isLoaded()`, and both historical destruction aliases.
- Common event names and payload keys are aligned.
- Adaptive `loaded` reports the real height in density-independent units.
- `destroy()` is terminal, repeatable, and emits `destroyed` once.
- Native delegates, listeners, controllers, views, and activity lifecycle registrations are released.
- Each proxy accepts one active load and at most one deferred load while paused.
- Application and host-lifecycle pauses are independent causes; neither resumes the other's pause.
- Inline adaptive banners, `maxHeight`, `customAdSize`, `contentUrl`, and `requestAgent` work on both platforms.
- `smart_banner` resolves to `BANNER` on both platforms, with no special case on either.

### Fullscreen contract

- Interstitial, rewarded, and app open proxies expose the same `load()`, `show()`, `isLoaded()`, and terminal `destroy()` lifecycle.
- Duplicate loads are serialized and native fullscreen references are single-use.
- Common events include `adUnitId` and `adType`; failures add `error`, `message`, and `code`.
- Both platforms emit `opened`, `showed_fullscreen_content`, and `destroyed`.
- Native callbacks/delegates are detached during explicit destruction and Titanium proxy release.
- App open checks Google's four-hour validity window on demand, without a timer.

### Distribution

- The `ti.admob.unified` artifacts contain Google Mobile Ads and UMP alone: ~14 MB on iOS, ~325 KB on Android, and no network SDK in the consuming application's POM.
- Five dependency modules under `mediation/<network>/` distribute eleven iOS frameworks and five Android adapter coordinates. Unity includes Coherence; neither AdQuality nor ironSource advertising is included.
- Dependency versions and iOS checksums are reproducible.
- Static contract tests cover privacy, lifecycle, payload, cleanup, artifacts, and documentation.

## Release readiness

The September 2026 audit distinguishes module behavior, consumer integration and provider delivery. A successful build or Google test banner proves neither third-party delivery nor all privacy scenarios.

The correction pass now has executable coverage for library cleanup and reentrant retries, consent reset ordering, percentage volume validation and delayed reward callbacks. Both native bridges returned the expected Boolean types and loaded all five implemented formats. Repeated banner taps preserved the scroll position in the Android emulator. Three physical-iPad launches loaded the adaptive banner at 810 × 150 and all three fullscreen formats; the earlier startup sizing failure did not recur, but its cause has not been isolated.

Remaining acceptance work:

- record fullscreen dismissal and actual reward delivery separately from load and presentation;
- cover consent acceptance/rejection, privacy reopening, ATT states and orientation/lifecycle changes on the available devices;
- retain the intermittent iOS Rewarded timeout and its UIKit reproduction until a reproducible SDK/runtime resolution is established;
- verify provider-side consent propagation and review the updated transitive dependency results in [Dependencies](dependencies.md#transitive-security-review);
- validate intended mediation providers with configured accounts, mappings and Ad Inspector. Core-only applications need no provider accounts.

The declared minimum OS versions and complete physical-device interaction matrix remain unverified. Simulator and emulator evidence is recorded separately. No additional device purchase is required to continue independent checks.

## Next contract work

These improvements can be developed without changing the established banner and privacy APIs:

- keep the shared percentage-based `setAppVolume()` behavior covered on both platforms;
- remove deprecated privacy and destruction aliases in a future major release.

## Declared parity debt

Both platforms must expose an identical JavaScript surface. An audit against the native sources on 5 August 2026 found the divergences below. That pass recorded them as closed based largely on static tests. The September audit reopened cases involving bridge types and accidental exports. The table below is historical context; release acceptance requires runtime verification of the current binaries.

| Divergence closed                                                                                                                                                               | How                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `requestAgent` was dropped by the three iOS fullscreen proxies. Their manual configuration from the creation dictionary bypasses `_initWithProperties:` and never read the key. | `configureWithDict:` reads it in all three, mirroring Android.                                                                          |
| `extras` was a live property on iOS and creation-only on Android: assigning it after creating a banner did nothing, and reading it back returned `undefined`.                   | Both Android banner proxies gained the property. It takes effect on the next `load()`, the same as `requestAgent`.                      |
| The adaptive `loaded` payload carried seven size keys on Android and two on iOS.                                                                                                | iOS reports the same seven. `density` comes from `UIScreen.scale`, which yields only 1, 2 or 3 where Android reports fractional values. |
| Fullscreen proxies exposed their internal state as readable properties on iOS and none on Android, including the native handle (`GADInterstitialAd`).                           | Plain ivars with `accessInstanceVariablesDirectly` disabled, so Kroll's key lookup finds nothing.                                       |
| `collapsible` was Android-only.                                                                                                                                                 | Implemented on iOS through `GADExtras`, the same key and values Android puts in its Bundle.                                             |
| iOS filtered banner events by whether a listener was registered; Android emitted them unconditionally.                                                                          | The guard is gone. Banner proxies descend from `TiViewProxy`, so the events reach a listener on the container.                          |
| `DEBUG_GEOGRAPHY_OTHER` returned the deprecated `UMPDebugGeographyNotEEA` (2) on iOS while Android sent 4, and `DEBUG_GEOGRAPHY_REGULATED_US_STATE` was the literal `@(3)`.     | Both return the SDK enum, which matches Android's values.                                                                               |
| iOS substituted `"coins"` and `1` when the SDK granted a reward with no values, so an application could credit a reward Android never granted.                                  | The payload carries what the SDK reported, or `null`.                                                                                   |
| iOS `resume()` never restored `autoloadEnabled` after `pause()` turned it off, so one trip to the background left the banner opted out for the rest of the session.             | `pause()` remembers the value and `resume()` restores it, once every pause cause is clear.                                              |
| Adaptive events fired by the Android proxy itself omitted `adaptiveType`, which the view included.                                                                              | Every adaptive event carries it.                                                                                                        |

## Differences that stay

The following differences are classified as SDK limitations and are documented where relevant. They are not scheduled for correction:

| Difference                                         | Why it stays                                                                                                                                                                       |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `module_initialized` has no error branch           | Neither SDK reports one. `GADInitializationStatus` carries no error, and Android's callback has no failure path either; its only `success: false` is a missing-Activity pre-check. |
| `applicable` in `tracking_authorization_completed` | App Tracking Transparency does not exist on Android.                                                                                                                               |
| The values of the `TEST_*` constants               | They are Google's own demo unit IDs, deliberately different per platform.                                                                                                          |
| `isTestDevice()`                                   | iOS answers "are any test devices registered?", Android "is this device one?". The iOS SDK does not offer the second.                                                              |
| The text of error messages                         | Load errors use shared constants; presentation/UMP/Inspector codes retain their native domains. The text describes the platform failure ("no view controller" against "no activity").                                                      |

## Deferred formats

- Rewarded interstitial
- Native

Their constants are already exported, but they do not have working cross-platform factories. Implementing one requires a complete native proxy, shared events and payloads, cleanup semantics, tests, examples, and physical validation.

These formats remain to be implemented to match the modules this one replaces. As of 4 August 2026: `ti.android.admob` `11.1.0` ships proxies for app open, rewarded interstitial and native, and `ti.admob` `8.1.0` on iOS documents an `AD_TYPE_APP_OPEN`. App open ships here on both platforms, which leaves rewarded interstitial and native.

Decided on 4 August 2026:

- Rewarded interstitial is planned next. App open came first because it was the only format present in both replaced modules.
- Native remains deferred because none of the applications in progress has a content list that needs ads styled as list items. The decision reflects current use cases, rather than implementation difficulty. A future app with a content feed would justify reconsidering it.

Each new format must meet the existing contract: a complete native proxy on both platforms, shared events and payloads, terminal cleanup, contract tests, an example, and physical validation.

## Mediation maintenance

The five complements live in `mediation/<network>/` and target the same first release, `1.0.0`, as the core.

- Keep the five shared adapter/network SDK pairs current on both platforms.
- Keep every adapter out of the core module. A contract test fails if `ios/module.xcconfig`, `android/build.gradle`, the core `pbxproj`, or the core checksum inventory names a network again.
- Preserve one JavaScript ad contract and portable diagnostics.
- Track privacy manifests, resource bundles, SKAdNetwork guidance, and store disclosure changes with every dependency update.
- Require consumer builds, physical-device tests, and Ad Inspector evidence before release: record hardware evidence separately from simulator integration and Google test ads.
- Evaluate additional networks only when they can be supported on both platforms without fragmenting the public API.

## Longer-term platform work

- Evaluate Android Google Mobile Ads Next-Gen only after its migration cost and Titanium compatibility are understood.
- Revisit the minimum Titanium, iOS, and Android baselines as upstream SDK requirements change.
