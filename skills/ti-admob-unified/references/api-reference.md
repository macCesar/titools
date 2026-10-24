> Source snapshot: official ti.admob.unified 1.0.0 documentation at release source commit `034843299b2984253988e0ffccb9f6a1c91682c9` (copied 2026-10-24). Relative links rebased for this skill.

# API reference

This page documents the JavaScript surface exported by `ti.admob.unified` `1.0.0`.

```js
const Admob = require('ti.admob.unified')
```

<!-- TOC-START -->
## Contents

- [Module methods](#module-methods)
- [Deprecated module methods](#deprecated-module-methods)
- [Banner proxy](#banner-proxy)
- [Fullscreen proxy](#fullscreen-proxy)
- [Fullscreen configuration changes](#fullscreen-configuration-changes)
- [Module events](#module-events)
- [Constants](#constants)
- [Mediation diagnostics](#mediation-diagnostics)
- [Reserved and unavailable APIs](#reserved-and-unavailable-apis)
- [Consent compatibility payloads](#consent-compatibility-payloads)

<!-- TOC-END -->

## Module methods

| Method                                     | Platforms    | Status                     |
| ------------------------------------------ | ------------ | -------------------------- |
| `initialize(config)`                       | iOS, Android | Supported                  |
| `requestConsent(config)`                   | iOS, Android | Supported                  |
| `canRequestAds()`                          | iOS, Android | Supported                  |
| `isPrivacyOptionsRequired()`               | iOS, Android | Supported                  |
| `presentPrivacyOptions(config)`            | iOS, Android | Supported                  |
| `resetConsent()`                           | iOS, Android | Testing only               |
| `getTrackingAuthorizationStatus()`        | iOS, Android | Read-only ATT snapshot     |
| `requestTrackingAuthorization()`           | iOS, Android | Portable                   |
| `openAdInspector()`                        | iOS, Android | Development diagnostic     |
| `createBanner(config)`                     | iOS, Android | Supported                  |
| `getAnchoredAdaptiveBannerSize(widthInDp)` | iOS, Android | Collapsed placement size   |
| `createAdaptiveBanner(config)`             | iOS, Android | Supported                  |
| `createInterstitial(config)`               | iOS, Android | Supported                  |
| `createRewarded(config)`                   | iOS, Android | Supported                  |
| `createRewardedInterstitial(config)`       | iOS, Android | Supported                  |
| `createAppOpen(config)`                    | iOS, Android | Supported                  |
| `setTestDevice(deviceId)`                  | iOS, Android | Compatibility utility      |
| `isTestDevice()`                           | iOS, Android | Supported                  |
| `setAppVolume(volume)`                     | iOS, Android | Available                  |
| `getMediationStatus()`                     | iOS, Android | Supported diagnostic       |
| `canShowAds()`                             | iOS, Android | Deprecated alias           |
| `canShowPersonalizedAds()`                 | iOS, Android | Deprecated; always `false` |
| `isGDPR()`                                 | iOS, Android | Deprecated diagnostic      |

See [Mediation diagnostics](#mediation-diagnostics) for adapter status and the [migration guide](migration.md#generic-mediation-diagnostics) for removed pre-release helpers.

### `initialize(config)`

Sets global request options and initializes Google Mobile Ads.

```js
Admob.initialize({
  testDeviceIds: ['GMA_TEST_DEVICE_ID'],
  ageRestrictedTreatment: Admob.AGE_RESTRICTED_TREATMENT_UNSPECIFIED,
  maxAdContentRating: Admob.MAX_AD_CONTENT_RATING_PARENTAL_GUIDANCE
})
```

On Android, native request configuration and SDK initialization run on a worker thread; completion is delivered on the UI thread. The call returns before adapter initialization finishes. Wait for `module_initialized` before loading ads.

Accepted properties:

| Property                       | Type     | Description                                                                    |
| ------------------------------ | -------- | ------------------------------------------------------------------------------ |
| `testDeviceIds`                | String[] | Google Mobile Ads test-device identifiers.                                     |
| `ageRestrictedTreatment`       | String   | `child`, `teen`, or `unspecified` constant value.                              |
| `maxAdContentRating`           | String   | `G`, `PG`, `T`, or `MA` constant value.                                        |
| `tagForChildDirectedTreatment` | Boolean  | Deprecated compatibility input.                                                |
| `tagForUnderAgeOfConsent`      | Boolean  | Deprecated initialization input, separate from the UMP property.               |
| `disableMediation`             | Boolean  | Optional session exception; defaults to `false`. Skips adapter initialization. |

It emits `module_initialized`. Calls are idempotent and the first accepted configuration wins. Always pass an object, even when empty.

#### Automatic adapter discovery

Google Mobile Ads discovers adapters installed through the selected `ti.admob.unified.mediation.<network>` entries in `tiapp.xml`. The same initialization works with the core alone or with configured complements:

```js
Admob.initialize({})
```

With only the core, there are no third-party adapters to initialize. With complements, configure the provider accounts and AdMob source mappings; no `enableMediation` flag or manual provider initialization is needed. Detection does not prove valid credentials, successful initialization or ad delivery.

An installed adapter with incomplete configuration can delay the initialization callback until it responds or times out. A previously measured Android launch took `30,755 ms`, including a Liftoff Monetize initialization timeout. Automatic discovery does not fix missing or conflicting provider configuration. See [configuration failures](mediation.md#missing-configuration-and-startup-errors).

Use the exception only when adapters are installed but the application deliberately does not use mediation during this session:

```js
Admob.initialize({ disableMediation: true })
```

This calls Google's global initialization switch on [Android](https://developers.google.com/admob/android/reference/com/google/android/gms/ads/MobileAds) and [iOS](https://developers.google.com/admob/ios/api/reference/Classes/GADMobileAds), before SDK startup. It skips adapter initialization globally; it does not remove dependencies, validate credentials, select individual networks or provide an ad-source allowlist. Do not set it in an app that intends to serve mediated ads. The first accepted initialization configuration wins; repeating `initialize()` cannot toggle mediation later in the session.

`applicationId` and `debugGeography` are not accepted here.

### `requestConsent(config)`

Updates UMP consent information and presents a required form.

```js
Admob.requestConsent({
  geography: Admob.DEBUG_GEOGRAPHY_EEA,
  testDeviceIds: ['HASHED_UMP_TEST_DEVICE_ID'],
  tagForUnderAgeOfConsent: false
})
```

Accepted properties:

| Property                  | Type     | Description                                                 |
| ------------------------- | -------- | ----------------------------------------------------------- |
| `geography`               | Number   | One `DEBUG_GEOGRAPHY_*` constant. Debug only.               |
| `testDeviceIds`           | String[] | UMP hashed device IDs. Applied when `geography` is present. |
| `tagForUnderAgeOfConsent` | Boolean  | UMP under-age flag.                                         |

It returns `void` and emits the terminal `consent_complete` event. Concurrent calls share one operation. A successful result is cached for the module session; later calls replay `consent_complete`. A failed update or form permits a new request without resetting persisted consent. Omitted debug settings use UMP defaults; the under-age flag defaults to `false`.

### `canRequestAds()`

Returns a Boolean from native UMP consent information. UMP persists consent, so this may return `true` before the current launch requests an update. It reports whether requests are allowed now; it does not indicate whether the session has completed its update.

### `isPrivacyOptionsRequired()`

Returns whether UMP requires a publisher-rendered privacy-options entry point. Call it after the consent update completes.

### `presentPrivacyOptions(config)`

Presents the UMP privacy-options form and emits `privacy_options_dismissed`.

```js
Admob.presentPrivacyOptions({})
```

The current native implementations do not consume configuration properties. Pass an empty object for a consistent call site.

### `resetConsent()`

Returns `void` and resets UMP test state and the module's cached consent operation. If an update or form is in flight, reset waits for its callback before resetting the SDK. A request made during that wait runs afterwards with the latest supplied configuration. Without a replacement request, the interrupted operation ends with `success: false`, code `-1` and an explanatory error. Resetting does not cancel the SDK's network request.

Use only during controlled consent testing. For a production privacy entry point, call `presentPrivacyOptions()`.

### `getTrackingAuthorizationStatus()`

Returns `{ status: Number, authorized: Boolean, applicable: Boolean }` synchronously. On iOS it reads the current system ATT status on every call: `0` not determined, `1` restricted, `2` denied, `3` authorized. Only status `3` sets `authorized: true`; `applicable` is always `true` on supported iOS versions.

This query never presents a prompt, emits an event, or initializes an SDK. Re-query after returning from Settings to read a changed permission.

On Android it returns `{ status: 3, authorized: true, applicable: false }`. This portable ATT convention does not grant general tracking permission or replace platform privacy requirements or UMP eligibility.

```js
const tracking = Admob.getTrackingAuthorizationStatus()
Ti.API.info(`ATT applies: ${tracking.applicable}; status: ${tracking.status}`)
```

### `requestTrackingAuthorization()`

Completes the portable tracking-authorization step and emits `tracking_authorization_completed`. On iOS it requests or retrieves App Tracking Transparency authorization. On Android it completes immediately with `applicable: false`, so consumers do not need a platform condition.

### `openAdInspector()`

Presents Google Mobile Ads Ad Inspector and emits `ad_inspector_closed` when the inspector closes or fails to open.

```js
Admob.addEventListener('ad_inspector_closed', event => {
  if (!event.success) {
    Ti.API.warn(`Ad Inspector failed: ${event.error} (${event.code})`)
  }
})

Admob.openAdInspector()
```

Call this only from a visible development screen after Google Mobile Ads has initialized. Google requires the device to be registered as a test device. The method does not enable test mode, change consent, or substitute production ad units.

### `createBanner(config)`

Returns a standard banner view proxy.

```js
const banner = Admob.createBanner({
  adUnitId: Admob.TEST_BANNER,
  adSize: Admob.BANNER,
  width: Ti.UI.FILL
})
```

Use `customAdSize: { width, height }` in dp for a non-standard slot on both platforms. It takes precedence over `adSize` and can request a fixed full-width strip. Adaptive banners calculate their own height.

See [Standard banner properties](banners.md#creation-properties-1).

### `getAnchoredAdaptiveBannerSize(widthInDp)`

Returns `{ width, height, heightUnit: 'dp' }` using Google's large anchored adaptive sizing API, without requesting an ad. Pass the positive available width of the laid-out placement in dp (points on iOS). Android requires a current Activity. Use the returned height to size the host before loading; it does not include the collapsible overlay. Inline banners are not covered by this method.

### `createAdaptiveBanner(config)`

Returns an adaptive banner view proxy.

```js
const banner = Admob.createAdaptiveBanner({
  adUnitId: Admob.TEST_ADAPTIVE_BANNER,
  adaptiveType: Admob.ADAPTIVE_ANCHORED,
  width: Ti.UI.FILL
})
```

Anchored and inline are both portable, and `keywords`, `contentUrl`, `requestAgent`, `extras` and the raw `collapsible: "top" | "bottom"` option reach the request on both platforms. `maxHeight` applies to inline only. See [Adaptive banner properties](banners.md#creation-properties).

### `createInterstitial(config)`

Returns an interstitial proxy with `load()`, `show()`, `isLoaded()`, and terminal `destroy()`.

### `createRewarded(config)`

Returns a rewarded proxy with `load()`, `show()`, `isLoaded()`, and terminal `destroy()`. Grant rewards only from the `rewarded` event.

### `createRewardedInterstitial(config)`

Returns a rewarded interstitial proxy with the same methods and configuration as Rewarded, using `adType: 'rewarded_interstitial'`. Explain the reward and offer a skip option before showing it. See [Rewarded interstitial ads](rewarded-interstitial.md).

### `createAppOpen(config)`

Returns an app open proxy with `load()`, `show()`, `isLoaded()`, and terminal `destroy()`. An app open ad expires four hours after loading completes: past that point `isLoaded()` reports `false` and `show()` emits `failed_to_show` with code `1`. See [The four hour window](fullscreen.md#the-four-hour-window).

See [Fullscreen ads](fullscreen.md) for the four factories.

### `setTestDevice(deviceId)`

Replaces the global Google Mobile Ads test-device list with one identifier.

```js
Admob.setTestDevice('GMA_TEST_DEVICE_ID')
```

Prefer `initialize({ testDeviceIds: [...] })` for new integrations because it supports a list and keeps initialization configuration in one place.

### `isTestDevice()`

Compatibility diagnostic returning a Boolean. Android asks `AdRequest.isTestDevice(context)` whether this device is a test device. iOS reports whether any test identifiers are configured; it does not establish that this device matches them. Do not use this method as a portable proof that a request is a test request. Use Google test ad-unit IDs or explicitly register the device.

### `setAppVolume(volume)`

Accepts a percentage string on both platforms, with an optional trailing `%`. For example, `"50%"` and `"50"` set native application volume to `0.5`. The valid range is `0` through `100`, inclusive. Empty, nonnumeric, nonfinite and out-of-range values are ignored with a warning; they do not change volume. Returns `void`. Google Mobile Ads applies this application-level setting to ad audio. A value set before initialization is retained and applied when the SDK starts.

## Deprecated module methods

### `canShowAds()`

Alias of `canRequestAds()`. Replace it in new code.

### `canShowPersonalizedAds()`

Always returns `false`. UMP does not expose a publisher-facing personalization Boolean. Do not use it as a gate or convert it into an `npa` extra.

### `isGDPR()`

Reads legacy IAB diagnostic storage. It is not authoritative, can be stale, and must not control ad requests or UI.

## Banner proxy

The standard and adaptive proxies expose the same methods:

| Method                            | Return  | Behavior                                                                                            |
| --------------------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| `load()`                          | `void`  | Starts one request or defers one while paused.                                                      |
| `pause()`                         | `void`  | Idempotently records the application's pause without changing visibility, opacity, host, or layout. |
| `resume()`                        | `void`  | Clears the application's pause and runs one deferred load only once every pause cause is clear.     |
| `isLoaded()`                      | Boolean | Reports the current native load state.                                                              |
| `destroy()`                       | `void`  | Terminal, idempotent native cleanup.                                                                |
| `destroyAdViewAndCancelRequest()` | `void`  | Compatibility alias of `destroy()`.                                                                 |
| `destoyAdViewAndCancelRequest()`  | `void`  | Deprecated misspelled alias.                                                                        |

The host lifecycle also pauses banners: the Android activity pauses, or the iOS application enters the background. That pause is independent of these calls. Neither cause resumes the other's pause. See [Who pauses a banner](banners.md#who-pauses-a-banner).

An Android activity recreation caused by a configuration change is non-terminal. The module preserves the proxy, releases the stale native view without emitting `destroyed`, and reloads after Titanium creates the replacement view.

On Android pause/resume delegates only to the native `AdView` processing methods. On iOS it disables and restores `autoloadEnabled`. Neither platform changes the banner's visual properties. Automatic refresh remains owned by Google Mobile Ads and the refresh policy configured for the ad unit.

### Banner creation properties

Both factories return a `TiViewProxy`, so the creation dictionary also accepts the usual Titanium layout properties. The AdMob-specific ones are:

| Property       | Type     | `createBanner()` | `createAdaptiveBanner()` | Notes                                                           |
| -------------- | -------- | ---------------- | ------------------------ | --------------------------------------------------------------- |
| `adUnitId`     | String   | Yes              | Yes                      | Required.                                                       |
| `adSize`       | String   | Yes              | —                        | One banner-size constant. Defaults to `BANNER`.                 |
| `customAdSize` | Object   | Yes              | —                        | `{ width, height }` in dp. Wins over `adSize`.                  |
| `adaptiveType` | String   | —                | Yes                      | `ADAPTIVE_ANCHORED` or `ADAPTIVE_INLINE`. Defaults to anchored. |
| `maxHeight`    | Number   | —                | Yes                      | Inline only, in dp. Defaults to `50` on both platforms.         |
| `collapsible`  | String   | —                | Yes                      | Google's raw placement string, `"top"` or `"bottom"`.           |
| `keywords`     | String[] | Yes              | Yes                      | Request keywords.                                               |
| `contentUrl`   | String   | Yes              | Yes                      | URL describing the surrounding content.                         |
| `requestAgent` | String   | Yes              | Yes                      | Identifies what issued the request.                             |
| `extras`       | Object   | Yes              | Yes                      | Google ad-network extras.                                       |

Changes to `adUnitId`, `adSize` or `customAdSize` apply on the next `load()`. The current creative stays in place until then. The module recreates the native view when required without destroying the proxy. Standard size defaults to `BANNER`; adaptive type defaults to anchored and inline `maxHeight` defaults to `50` dp. Optional targeting is omitted when unset. See [Banner ads](banners.md#creation-properties).

Portable dimensions are positive integer dp values within the signed 32-bit range and the format's SDK limits. Zero, NaN and infinity are invalid. Fractional/extreme dimensions are outside the portable contract: Android converts to integers while iOS uses CGFloat. A positive size can still be rejected by Google if it does not fit the placement.

Banner events:

| Constant            | Event string     | Notes                                  |
| ------------------- | ---------------- | -------------------------------------- |
| `AD_LOADED`         | `loaded`         | Adaptive payload includes real height. |
| `AD_FAILED_TO_LOAD` | `failed_to_load` | Adds `error` and `code`.               |
| `AD_CLICKED`        | `clicked`        | Native click callback.                 |
| `AD_IMPRESSION`     | `impression`     | Native impression callback.            |
| `AD_OPENED`         | `opened`         | Ad overlay opened.                     |
| `AD_CLOSED`         | `closed`         | Ad overlay closed.                     |
| `AD_DESTROYED`      | `destroyed`      | Emitted once per proxy.                |

Both banner types include Boolean `isCollapsible` in `loaded`, reporting the SDK's classification of the received ad. It does not report whether the ad is currently expanded or visibly rendered.

Common payload:

```js
{
  adUnitId: String,
  adType: 'banner',
  isAdaptive: Boolean
}
```

Adaptive payloads add `adaptiveType`. Adaptive `loaded` adds:

```js
{
  width: Number,
  height: Number,
  widthUnit: 'dp',
  heightUnit: 'dp',
  widthPx: Number,
  heightPx: Number,
  density: Number
}
```

All seven keys are present on both platforms. `density` converts points to pixels: Android uses `DisplayMetrics.density`, which can return fractional values such as `2.625`; iOS uses `UIScreen.scale`, which returns `1`, `2` or `3`. Account for these possible values instead of assuming one fixed density.

## Fullscreen proxy

Interstitial, rewarded, rewarded interstitial and app open proxies expose:

| Method       | Return  | Description                                                                              |
| ------------ | ------- | ---------------------------------------------------------------------------------------- |
| `load()`     | `void`  | Loads one native fullscreen ad.                                                          |
| `show()`     | `void`  | Presents it or emits `failed_to_show`.                                                   |
| `isLoaded()` | Boolean | Reports whether a native ad is ready. An app open ad older than four hours is not ready. |
| `destroy()`  | `void`  | Terminal, idempotent cleanup; emits `destroyed` once.                                    |

Loads are serialized: calls while loading, loaded, or showing are ignored. Common fullscreen payloads always include `adUnitId` and `adType`. Failures include `error`, `message`, and `code`. Reward payloads add `rewardType` and `rewardAmount`.

### Fullscreen creation properties

All four factories accept:

| Property       | Type     | Default | Notes                                                  |
| -------------- | -------- | ------- | ------------------------------------------------------ |
| `adUnitId`     | String   | `""`    | Required before `load()`.                              |
| `autoReload`   | Boolean  | `false` | Reloads after `closed`, and after nothing else.        |
| `keywords`     | String[] | None    | Request keywords.                                      |
| `requestAgent` | String   | None    | Identifies what issued the request, on both platforms. |
| `extras`       | Object   | None    | Google ad-network extras.                              |

`autoReload` leaves retries after `failed_to_load` and `failed_to_show` to the application. Use backoff for those failures.

See [Fullscreen events](fullscreen.md#events).

## Fullscreen configuration changes

The five configuration properties `adUnitId` (String), `autoReload` (Boolean), `keywords` (String[]), `requestAgent` (String) and `extras` (Object) are readable and writable on both platforms. Changes to the four request options affect the next load and do not replace an already loaded ad. `autoReload` defaults to `false` and is read live when the shown ad closes; changing it while an ad is loaded or presented changes whether that close starts a reload. It never automatically presents the replacement or retries a failure. Targeting is omitted when unset. Extras retain String, Boolean and numeric primitive values. Internal load/presentation state and native SDK delegate methods are not application APIs.

## Module events

### `module_initialized`

```js
{
  success: true,
  status: String
}
```

Failure adds `error` and `code`.

### `consent_complete`

```js
{
  success: Boolean,
  canRequestAds: Boolean,
  privacyOptionsRequired: Boolean,
  error: String, // failure only
  code: Number   // failure only
}
```

The payload also retains deprecated compatibility keys for applications coming from an older AdMob module. Do not consume them in new code.

### `consent_ready`

Deprecated success-only compatibility event. Use `consent_complete`.

### `consent_error`

Deprecated failure-only compatibility event. Use `consent_complete`.

### `privacy_options_dismissed`

```js
{
  success: Boolean,
  canRequestAds: Boolean,
  privacyOptionsRequired: Boolean,
  error: String, // failure only
  code: Number   // failure only
}
```

### `tracking_authorization_completed`

```js
{
  status: Number,
  authorized: Boolean,
  applicable: Boolean
}
```

On iOS, status values are `0` not determined, `1` restricted, `2` denied, and `3` authorized. Android reports `3`, `authorized: true`, and `applicable: false` because ATT is not an Android API.

### `ad_inspector_closed`

```js
{
  success: Boolean,
  error: String, // failure only
  code: Number   // failure only
}
```

`success: true` means Ad Inspector was displayed and then closed. A failure usually indicates that the SDK is not initialized, the device is not registered for testing, or there is no visible activity/controller.

## Constants

### Ad types

| Constant                        | Value                     | Factory status |
| ------------------------------- | ------------------------- | -------------- |
| `AD_TYPE_BANNER`                | `"banner"`                | Implemented    |
| `AD_TYPE_INTERSTITIAL`          | `"interstitial"`          | Implemented    |
| `AD_TYPE_REWARDED`              | `"rewarded"`              | Implemented    |
| `AD_TYPE_REWARDED_INTERSTITIAL` | `"rewarded_interstitial"` | Implemented |
| `AD_TYPE_APP_OPEN`              | `"app_open"`              | Implemented    |
| `AD_TYPE_NATIVE`                | `"native"`                | No factory     |

An exported type constant does not imply that its format has a working proxy.

### Banner sizes and modes

| Constant            | Value                 | Portability  |
| ------------------- | --------------------- | ------------ |
| `BANNER`            | `"banner"`            | iOS, Android |
| `LARGE_BANNER`      | `"large_banner"`      | iOS, Android |
| `MEDIUM_RECTANGLE`  | `"medium_rectangle"`  | iOS, Android |
| `FULLBANNER`        | `"fullbanner"`        | iOS, Android |
| `LEADERBOARD`       | `"leaderboard"`       | iOS, Android |
| `ADAPTIVE_ANCHORED` | `"adaptive_anchored"` | iOS, Android |
| `ADAPTIVE_INLINE`   | `"adaptive_inline"`   | iOS, Android |

The module exports no `COLLAPSIBLE_TOP` or `COLLAPSIBLE_BOTTOM` constant. Pass Google's accepted strings, `"top"` or `"bottom"`, directly to `collapsible` on either platform.

### Ad events

| Constant                       | Value                         |
| ------------------------------ | ----------------------------- |
| `AD_LOADED`                    | `"loaded"`                    |
| `AD_FAILED_TO_LOAD`            | `"failed_to_load"`            |
| `AD_OPENED`                    | `"opened"`                    |
| `AD_CLOSED`                    | `"closed"`                    |
| `AD_CLICKED`                   | `"clicked"`                   |
| `AD_IMPRESSION`                | `"impression"`                |
| `AD_REWARDED`                  | `"rewarded"`                  |
| `AD_FAILED_TO_SHOW`            | `"failed_to_show"`            |
| `AD_SHOWED_FULLSCREEN_CONTENT` | `"showed_fullscreen_content"` |
| `AD_DESTROYED`                 | `"destroyed"`                 |

All four fullscreen proxy types (interstitial, rewarded, rewarded interstitial and app open) emit `AD_SHOWED_FULLSCREEN_CONTENT` and `AD_OPENED` on iOS and Android.

### Consent status

- `CONSENT_STATUS_UNKNOWN`
- `CONSENT_STATUS_REQUIRED`
- `CONSENT_STATUS_NOT_REQUIRED`
- `CONSENT_STATUS_OBTAINED`

These constants mirror the native UMP enum. The module does not currently export a method that returns the raw consent-status enum; use `canRequestAds()` and `isPrivacyOptionsRequired()` for application behavior.

### Debug geography

- `DEBUG_GEOGRAPHY_DISABLED`
- `DEBUG_GEOGRAPHY_EEA`
- `DEBUG_GEOGRAPHY_REGULATED_US_STATE`
- `DEBUG_GEOGRAPHY_OTHER`

Use the constants only in `requestConsent()` on registered UMP test devices. Do not persist or compare their numeric native values.

### Maximum ad content rating

| Constant                                  | Value  |
| ----------------------------------------- | ------ |
| `MAX_AD_CONTENT_RATING_GENERAL`           | `"G"`  |
| `MAX_AD_CONTENT_RATING_PARENTAL_GUIDANCE` | `"PG"` |
| `MAX_AD_CONTENT_RATING_TEEN`              | `"T"`  |
| `MAX_AD_CONTENT_RATING_MATURE_AUDIENCE`   | `"MA"` |

### Age-restricted treatment

| Constant                               | Value           |
| -------------------------------------- | --------------- |
| `AGE_RESTRICTED_TREATMENT_CHILD`       | `"child"`       |
| `AGE_RESTRICTED_TREATMENT_TEEN`        | `"teen"`        |
| `AGE_RESTRICTED_TREATMENT_UNSPECIFIED` | `"unspecified"` |

Pass these to `initialize({ ageRestrictedTreatment })`.

### Common Google Mobile Ads error codes

| Constant                       | Value |
| ------------------------------ | ----: |
| `ERROR_CODE_SERVER_ERROR`      |   `0` |
| `ERROR_CODE_INVALID_REQUEST`   |   `1` |
| `ERROR_CODE_NETWORK_ERROR`     |   `2` |
| `ERROR_CODE_NO_FILL`           |   `3` |
| `ERROR_CODE_APP_ID_MISSING`    |   `8` |
| `ERROR_CODE_MEDIATION_NO_FILL` |   `9` |
| `ERROR_CODE_INVALID_AD_SIZE`   |  `10` |

For `failed_to_load`, iOS GMA errors are normalized to these shared values. Native invalid request/argument or reused ad maps to `1`; no fill to `3`; network/timeout to `2`; mediation configuration/adapter failure to `0`; invalid mediation size to `10`; missing application ID to `8`; other internal/server failures to `0`. Android retains its GMA load codes, including additional SDK codes outside this list.

`failed_to_show`, UMP and Ad Inspector errors retain their native code domains. Local precondition errors can use `-1` (missing activity/controller) or `1` (invalid state/input). Always identify the event before interpreting its code. A public “No ad to show” message alone cannot distinguish lack of inventory from a nested SDK timeout.

### Official Google demo ad units

The constant names are portable; their string values are platform-specific:

| Constant                     | iOS                                      | Android                                  | Module format                | Factory                  |
| ---------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------- | ------------------------ |
| `TEST_BANNER`                | `ca-app-pub-3940256099942544/2934735716` | `ca-app-pub-3940256099942544/6300978111` | Standard banner              | `createBanner()`         |
| `TEST_ADAPTIVE_BANNER`       | `ca-app-pub-3940256099942544/2435281174` | `ca-app-pub-3940256099942544/9214589741` | Adaptive banner              | `createAdaptiveBanner()` |
| `TEST_INTERSTITIAL`          | `ca-app-pub-3940256099942544/4411468910` | `ca-app-pub-3940256099942544/1033173712` | Interstitial                 | `createInterstitial()`   |
| `TEST_INTERSTITIAL_VIDEO`    | `ca-app-pub-3940256099942544/5135589807` | `ca-app-pub-3940256099942544/8691691433` | Interstitial, video creative | `createInterstitial()`   |
| `TEST_REWARDED`              | `ca-app-pub-3940256099942544/1712485313` | `ca-app-pub-3940256099942544/5224354917` | Rewarded                     | `createRewarded()`       |
| `TEST_REWARDED_INTERSTITIAL` | `ca-app-pub-3940256099942544/6978759866` | `ca-app-pub-3940256099942544/5354046379` | Rewarded interstitial        | `createRewardedInterstitial()` |
| `TEST_NATIVE`                | `ca-app-pub-3940256099942544/3986624511` | `ca-app-pub-3940256099942544/2247696110` | Native                       | None. Reserved           |
| `TEST_APP_OPEN`              | `ca-app-pub-3940256099942544/5575463023` | `ca-app-pub-3940256099942544/9257395921` | App open                     | `createAppOpen()`        |

Use the constant in shared code so it selects the platform value.

`TEST_NATIVE` remains reserved; no current factory accepts it. See [Reserved and unavailable APIs](#reserved-and-unavailable-apis).

## Mediation diagnostics

`getMediationStatus()` takes no arguments and returns the same structure and JavaScript types on iOS and Android:

```js
{
  initializationState: 'completed',
  adapters: [
    { adapterClass: 'native.AdapterClass', state: 'ready', description: 'SDK status', latencyMs: 125 }
  ]
}
```

`initializationState` is a String: `not_started`, `initializing`, `completed` or `failed`. Before this module's first `initialize()` call the result is `not_started` with an empty Array. A failed initialization attempt reports `failed` and may be retried. `completed` means the core initialization callback finished, even if some adapters remain `not_ready`.

`adapters` contains every entry Google reports, including Google itself, sorted by `adapterClass`. Each entry contains String `adapterClass`, String `state` (`ready` or `not_ready`), String `description` from Google, and Number `latencyMs`. iOS seconds are converted to milliseconds. Native class names can differ between platforms; do not compare them as portable provider identifiers.

The method reads Google's current public initialization status without starting SDKs or ad requests. During initialization the map can be empty or partial. An absent entry does not prove that a complement is missing. This is not an installed-module inventory, account check, credential check or guarantee of provider delivery. `ready` does not guarantee an ad.

Query after `module_initialized`:

```js
Admob.addEventListener('module_initialized', event => {
  Ti.API.info(JSON.stringify(Admob.getMediationStatus()))
})
```

Use UMP, `canRequestAds()` and each selected provider's current privacy requirements. `disableMediation` remains a global startup option. See [AdMob mediation](mediation.md) and the [pre-release migration](migration.md#generic-mediation-diagnostics).

## Reserved and unavailable APIs

- There is no `createNative`.
- There is no server-side verification configuration (`userId` / `customData`), paid-event / impression-level revenue callback, or public response-info API. Arbitrary `extras` do not add these features. Use `rewarded` for client-side rewards and Ad Inspector for request diagnostics.


## Consent compatibility payloads

`consent_complete`, `consent_ready` and `consent_error` include Boolean `success`, `canRequestAds` and `privacyOptionsRequired`. They also retain `canShowAds` (alias of `canRequestAds`), `canShowPersonalizedAds` (always `false`), `isGDPR` (legacy storage diagnostic) and `isPrivacyOptionsRequired` (alias of `privacyOptionsRequired`). Failures add String `error` and Number `code`. A cached successful request replays only `consent_complete`.

Closing privacy options refreshes the cached consent result from UMP. The dismissal event itself contains `success`, `canRequestAds`, `privacyOptionsRequired` and, on failure, `error` and `code`.

### Concurrent privacy operations

Concurrent `presentPrivacyOptions({})` calls share the outstanding native form and its dismissal event. Calling it while `requestConsent()` is running emits `privacy_options_dismissed` with `success: false`, `code: -1` and an explanatory `error`. A consent request made while privacy options are open waits for dismissal. A reset during either operation waits for its native callback, then clears UMP state before a queued request starts. The SDK operation itself cannot be cancelled. Register listeners before starting either operation.
