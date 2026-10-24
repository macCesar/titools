> Source snapshot: official ti.admob.unified 1.0.0 documentation at release source commit `034843299b2984253988e0ffccb9f6a1c91682c9` (copied 2026-10-24). Relative links rebased for this skill.

# Shipping an application

Use this guide after the [first test integration](getting-started.md) works. Version `1.0.0` supplies the native bridge and an optional JavaScript integration library. Your application controls ad placement, production configuration, consent entry points and store disclosures.

## Install and configure the release

Install the core ZIP for every target platform and only the mediation complements you use. Extract archives at the application root so the manifests sit under `modules/<platform>/<module-id>/1.0.0/`. Declare matching versions in `tiapp.xml` and rebuild the app after changing modules. Do not add another AdMob module, a second copy of Google Mobile Ads, or duplicate provider frameworks alongside this distribution.

Use a maintained Titanium SDK at or above `13.4.1.GA`, iOS `15.0+` and Android API `24+`. The minimums describe the declared support floor; consult [release readiness](roadmap.md#release-readiness) for the device coverage. On Android, Maven dependencies resolve during the app build. On iOS, the ZIP already includes the native frameworks; consumers do not run this repository's CocoaPods installers.

Set each platform's own AdMob application ID in `tiapp.xml`, then select an ad-unit ID for that platform **and format**. App IDs contain `~`; unit IDs contain `/`. Keep Google's `TEST_*` constants in development builds and supply your own units through the app's build configuration for distribution. GMA test-device registration and UMP debug-device registration are separate. Remove forced UMP geography, consent-reset controls and demo property overrides from production flows. See [testing guidance for Android](https://developers.google.com/admob/android/test-ads) and [iOS](https://developers.google.com/admob/ios/test-ads).

A release ZIP's size is not the installed application size: Android dependencies resolve separately and iOS frameworks contain device/simulator slices. Measure the final store archive for the chosen networks.

## Verify the application in AdMob

Link the correct store listing to each platform's AdMob app. Follow the verification and app-readiness status shown in the AdMob console; a working Google demo ad does not prove that a production app is approved to serve ads.

Publish the account's own `app-ads.txt` entries on the developer website associated with the store listing. This file belongs on that website, not in Titanium's `Resources/`. Follow Google's [app verification instructions](https://support.google.com/admob/answer/14538460?hl=en-GB) and use the console's verification check. Review the selected providers' seller entries when configuring mediation.

## Finish privacy and store settings

Request a fresh UMP update on every launch, wait for `consent_complete`, check `canRequestAds()`, then initialize and load. A UMP error can still leave requests allowed by prior consent; use the returned gate rather than inferring consent from the error. Keep the application usable when ads are unavailable.

Expose an accessible privacy-options action when `isPrivacyOptionsRequired()` is true. After dismissal, reevaluate the gate and replace requests affected by changed choices. The [integration library](library.md) manages that boundary. Do not use `resetConsent()` as a production revocation action. Google's [UMP guide](https://developers.google.com/admob/ios/privacy) describes the update, request gate and privacy entry point.

ATT applies to the app's actual tracking use on iOS. If you request it, provide an accurate `NSUserTrackingUsageDescription`, resolve the prompt before SDK initialization, and handle denial without treating it as a UMP denial. Review [Apple's tracking requirements](https://developer.apple.com/app-store/user-privacy-and-data-use/). Configure the UMP under-age input and GMA age treatment for the app's audience; they are separate settings. A maximum content rating alone does not establish an age policy.

Review Google's [App Store data disclosure guide](https://developers.google.com/admob/ios/privacy/data-disclosure) and [Google Play data disclosure guide](https://developers.google.com/admob/android/privacy/play-data-disclosure), plus the guidance for each included provider. Complete the app's privacy policy, store privacy answers and advertising declarations based on the SDKs and features it actually uses. Bundled privacy manifests do not fill in those answers for you. Maintain the `SKAdNetworkItems` required by Google and the installed networks, using their current setup guides.

## Choose presentation points

Reserve real banner space within safe areas and away from navigation controls. For anchored adaptive banners, measure the laid-out host width, reserve the native size and apply the loaded height. The [banner guide](banners.md) covers pause/resume, orientation and cleanup. Let Google's ad-unit policy own automatic refresh.

Preload fullscreen ads and show at a deliberate opportunity. Offer rewarded ads explicitly. For [rewarded interstitials](rewarded-interstitial.md), explain the configured reward and provide a skip option before presentation. Grant rewards only from `rewarded`; `closed` and `impression` do not prove a reward. Allow one fullscreen presentation at a time, including UMP, ATT and Inspector. Keep app-open ads within a foreground loading experience; skip the opportunity when the user has reached content. An expired app-open ad needs another `load()` even with `autoReload: true`.

The library checks fullscreen dimensions at `show()` and reloads an incompatible ad without presenting it automatically. Raw API consumers must manage that boundary themselves. See [fullscreen guidance](fullscreen.md) and the [library contract](library.md#fullscreen-ads).

## Validate selected mediation sources

Configure each provider account, credentials, format and AdMob source mapping. Install the corresponding complement and initialize the core normally. `getMediationStatus()` reports Google's initialization diagnostics, not successful delivery or a complete package inventory.

Use provider test mode and Ad Inspector single-source testing on a registered test device. Check each platform separately: a Google demo ad or an adapter marked `ready` does not prove that the provider served an ad. Follow the [mediation guide](mediation.md) and the exact versions in [Dependencies](dependencies.md).

## Troubleshoot integration failures

| Symptom | Check and next action |
| --- | --- |
| App terminates before JavaScript startup | Verify `GADApplicationIdentifier` / Android `APPLICATION_ID` in the consumer configuration and inspect native logs. |
| `canRequestAds()` is false | Inspect `consent_complete`, the app ID and AdMob message setup. Continue without ads; retry a failed consent update later without resetting production consent. |
| Banner is empty, clipped or offscreen | Inspect host/proxy dimensions, safe areas, available width and the final `postlayout`. On iOS reserve anchored height before loading. |
| `failed_to_load` | Record event name, format, code and message. Use test units, check connectivity/configuration, then retry at a later opportunity with backoff. Avoid immediate retry loops. |
| `failed_to_show` | Check readiness, foreground host, expiry, dimensions and another active presentation. Raw `show()` returns no success value; listen for events. |
| Rewarded/interstitial has controls but no visible creative | Capture the visible failure and SDK logs. An impression does not prove visible rendering. See the known iOS issues in [release readiness](roadmap.md#release-readiness). |
| Google ads work but a provider does not | Check provider mappings, test mode and Ad Inspector single-source results; core test units do not validate mediation. |
| iOS extraction reports `EACCES` or a reinstall uses stale files | Replace the affected module extraction with a freshly unpacked release ZIP, then clean/rebuild. Check installed manifest/files; maintainers must package writable frameworks. |
| Ads disappear after an Android theme change | Preserve placements on Titanium's `_closeFromActivityForcedToDestroy` close event; see [cleanup](library.md#cleanup). |

When reporting a problem, include module/Titanium versions, OS/device, format, test versus production unit, complete error payload and a minimal reproduction. Remove credentials, personal test-device identifiers and user data from shared logs. Native load errors, show errors and UMP errors use different code domains; consult the [API reference](api-reference.md#common-google-mobile-ads-error-codes).

## Test the final app build

Exercise the app on physical iOS and Android devices with test traffic: first launch and saved consent, privacy reopening, applicable ATT outcomes, banner layout/rotation/backgrounding, fullscreen show/close/failure and actual reward delivery. Verify repeated navigation releases listeners and preserves the banner slot. Test an unavailable-ad path so navigation never depends on receiving an ad.

Version `1.0.0` implements standard, anchored/inline adaptive and collapsible banners, interstitial, rewarded, rewarded interstitial and app open. The Native factory is unavailable. Server-side reward verification configuration, paid-event callbacks and public response-info access are also outside this release's API. Review [the API reference](api-reference.md) before depending on additional SDK features.
