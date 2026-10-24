> Source snapshot: official ti.admob.unified 1.0.0 documentation at release source commit `034843299b2984253988e0ffccb9f6a1c91682c9` (copied 2026-10-24). Relative links rebased for this skill.

# ti.admob.unified roadmap

## Current baseline

Version `1.0.0` includes the core and five optional mediation complements:

- Titanium `13.4.1.GA`
- iOS `15.0+`
- Google Mobile Ads iOS `13.11.0`
- User Messaging Platform iOS `3.1.0`
- Android API `24+`, required by the pinned Google Mobile Ads SDK
- Google Mobile Ads Android `25.5.0`
- User Messaging Platform Android `4.0.0`
- five optional per-network modules on iOS and Android; ironSource mediation deferred
- idempotent initialization and consent
- terminal `consent_complete` events
- one standard/adaptive banner lifecycle on both platforms
- one interstitial/rewarded/rewarded interstitial/app open lifecycle and event contract on both platforms
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

- Interstitial, rewarded, rewarded interstitial, and app open proxies expose the same `load()`, `show()`, `isLoaded()`, and terminal `destroy()` lifecycle.
- Duplicate loads are serialized and native fullscreen references are single-use.
- Common events include `adUnitId` and `adType`; failures add `error`, `message`, and `code`.
- Both platforms emit `opened`, `showed_fullscreen_content`, and `destroyed`.
- Native callbacks/delegates are detached during explicit destruction and Titanium proxy release.
- App open checks Google's four-hour validity window on demand, without a timer.

### Distribution

- The `ti.admob.unified` artifacts contain Google Mobile Ads and UMP, with no third-party ad-network SDK in the core POM. Android resolves its SDK dependencies during the consumer build, so module ZIP size is not the installed app size.
- Five dependency modules under `mediation/<network>/` distribute eleven iOS frameworks and five Android adapter coordinates. Unity includes Coherence; neither AdQuality nor ironSource advertising is included.
- Dependency versions and iOS checksums are reproducible.
- Static contract tests cover privacy, lifecycle, payload, cleanup, artifacts, and documentation.

## Release readiness

Rewarded Interstitial was added after the earlier five-format checks. Its native builds and wrapper tests pass. Physical iPadOS 27.0.1 and Android 16 tests confirmed visible Google test content, presentation, SDK rewards, dismissal and reload. The playground explains the reward in its card and offers Watch test ad or Skip in a dialog after Show. Selected-provider delivery still needs configured accounts and mappings.

The maintainer reported a store-published app using the module on October 23, 2026. The checks below record what has been verified. Open issues remain listed until a retest confirms a fix.

The September checks covered both native bridges, wrapper Boolean types, all five implemented formats, library cleanup/reentrant retries, consent reset ordering, volume validation and delayed reward callbacks. Core-only and selected-complement consumers were compiled on both platforms. Physical-iPad tests confirmed fullscreen presentation, dismissal and Rewarded delivery; a previous rotation-specific size failure recovered after reloading. The current library instead checks dimensions at Show and reloads only the incompatible ad. That revised policy has build/test coverage. An October 24 physical Android test also verified a single Show tap replacing a stale ad after rotation and presenting the replacement when loaded.

The October 23 dependency refresh passed physical Android 16 load checks for standard and adaptive banners, interstitial, rewarded and app open ads. An isolated consumer build completed consent and initialization, loaded test interstitial/rewarded ads and resumed from the background. SDK startup now runs outside the Android UI thread. These checks do not establish third-party provider delivery.

Earlier simulator runs had fullscreen request timeouts. A later October 23 iPadOS 18.6 simulator pass rendered fixed/adaptive banners and all four fullscreen formats, verified one reward per completed Rewarded and Rewarded Interstitial presentation, and exercised the rotation guard and background recovery. It also covered ATT denial, a permission change in Settings, UMP rejection and privacy reopening. The demo now keeps its Skip button visible on iPad. These simulator results do not close the physical-iPad issues below; the updated binaries still need physical-iOS acceptance.

Known issues and remaining coverage:

- A physical iPad intermittently renders Google's Interstitial demo creative with a zero-width image-bearing SVG inside a correctly sized WebView. Independent UIKit, React Native and Flutter integrations also reproduce it with GMA 13.11.0. A bounded native workaround restores the collapsed column-flex Google SVG on iPad, based on the detected markup rather than the unit ID. Integrated demo presentations confirmed a visible image. The workaround uses internal creative markup and is not an official SDK fix. It also checks publisher-owned Interstitial units for that exact failure; production creative rendering remains unverified.
- Intermittent iOS Rewarded timeouts, including a reproduction without Titanium, remain unresolved; a public error alone does not establish the cause.
- An earlier physical-iPad adaptive startup sizing failure did not recur in repeated launches; its cause was not isolated.
- Complete the consent acceptance/rejection, privacy reopening, ATT, banner orientation and lifecycle matrix on available physical devices. Complete physical-iPad coverage of the final example's Show-time dimension policy; the Android replacement-and-show path has passed.
- Provider delivery and consent propagation require configured publisher accounts, mappings and Ad Inspector single-source tests. Google test ads and adapter initialization do not establish them. Core-only apps need no provider accounts.
- The declared minimum OS versions have not been validated across a complete physical-device matrix. Keep simulator/emulator results separate from hardware results.

The pinned dependency matrix is recorded in [Dependencies](dependencies.md), including the dated transitive security review. Follow [Shipping an application](production.md) for the publisher's production checks. A module build, app-store approval or a version scan does not establish every runtime scenario.

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

These differences come from the native SDKs and remain documented limitations:

| Difference                                         | Why it stays                                                                                                                                                                       |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `module_initialized` describes core completion | Native initialization callbacks provide status rather than a unified error contract. Android can emit `success: false` before startup when no Activity exists. Adapter failures belong in `getMediationStatus()`; synchronous native exceptions may also propagate. |
| `applicable` in `tracking_authorization_completed` | App Tracking Transparency does not exist on Android.                                                                                                                               |
| The values of the `TEST_*` constants               | They are Google's own demo unit IDs, deliberately different per platform.                                                                                                          |
| `isTestDevice()`                                   | iOS answers "are any test devices registered?", Android "is this device one?". The iOS SDK does not offer the second.                                                              |
| The text of error messages                         | Load errors use shared constants; presentation/UMP/Inspector codes retain their native domains. The text describes the platform failure ("no view controller" against "no activity").                                                      |

## Deferred formats

Native remains reserved without a factory. Its constants are already exported. Implementation requires a complete native proxy, shared events and payloads, cleanup semantics, tests, examples, and physical validation.

Each new format must meet the existing contract: a complete native proxy on both platforms, shared events and payloads, terminal cleanup, contract tests, an example, and physical validation.

## Mediation maintenance

The five complements live in `mediation/<network>/` and target the same first release, `1.0.0`, as the core.

- Keep the five shared adapter/network SDK pairs current on both platforms.
- Keep every adapter out of the core module. A contract test fails if `ios/module.xcconfig`, `android/build.gradle`, the core `pbxproj`, or the core checksum inventory names a network again.
- Preserve one JavaScript ad contract and portable diagnostics.
- Track privacy manifests, resource bundles, SKAdNetwork guidance, and store disclosure changes with every dependency update.
- Require the consumer build matrix described in the mediation guide before release. Record physical-device coverage separately from simulator integration. Validate each provider with configured accounts, mappings and Ad Inspector before claiming its ad delivery; Google test ads establish integration only.
- Evaluate additional networks only when they can be supported on both platforms without fragmenting the public API.

## Longer-term platform work

- Evaluate Android Google Mobile Ads Next-Gen only after its migration cost and Titanium compatibility are understood.
- Revisit the minimum Titanium, iOS, and Android baselines as upstream SDK requirements change.
