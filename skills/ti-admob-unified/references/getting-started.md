> Source snapshot: official ti.admob.unified 1.0.0 documentation at commit `5b4cbf9` (copied 2026-10-11). Relative links rebased for this skill.

# Getting started

## 1. Install the modules

Install the `1.0.0` ZIP of `ti.admob.unified` for every platform you build. All artifacts of a given module must have the same module ID and version:

```xml
<modules>
  <module version="1.0.0">ti.admob.unified</module>
</modules>
```

An application that serves AdMob demand needs only the core: about 14 MB on iOS and 325 KB on Android, with no third-party network SDKs in the build.

If the application mediates, install the selected per-network complements at the same version. For AppLovin:

```xml
<modules>
  <module version="1.0.0">ti.admob.unified</module>
  <module version="1.0.0">ti.admob.unified.mediation.applovin</module>
</modules>
```

Each complement carries one adapter and its dependencies, with no JavaScript API. Add a module line for each intended network; leave unneeded networks out. See [AdMob mediation](mediation.md).

The current baselines are Titanium `13.2.0.GA`, iOS `15.0+`, and Android API `24+`.

For an existing AdMob integration, see [Migrating to ti.admob.unified](migration.md).

## 2. Configure the AdMob application IDs

An AdMob **application ID** contains a tilde:

```text
ca-app-pub-0000000000000000~0000000000
```

An **ad unit ID** contains a slash:

```text
ca-app-pub-0000000000000000/0000000000
```

They are not interchangeable. The application ID belongs in `tiapp.xml`; ad unit IDs are supplied to ad factories such as `createAdaptiveBanner()`.

### iOS

Add the iOS application ID to the app plist section:

```xml
<ios>
  <plist>
    <dict>
      <key>GADApplicationIdentifier</key>
      <string>ca-app-pub-0000000000000000~0000000000</string>
    </dict>
  </plist>
</ios>
```

App Tracking Transparency is optional and separate from UMP. Most banner applications do not need it: serving ads does not require tracking users across other companies' apps and websites. Add the usage description only when the application uses tracking, and describe that use accurately. Apple reviews the prompt against the app's behavior.

```xml
<ios>
  <plist>
    <dict>
      <key>NSUserTrackingUsageDescription</key>
      <string>This identifier helps us measure advertising performance.</string>
    </dict>
  </plist>
</ios>
```

Omit that key entirely if the application never calls `requestTrackingAuthorization()`. UMP still runs and still shows the consent form where the region requires one; the two mechanisms are unrelated.

Keep any required `SKAdNetworkItems` in the consuming app. Follow Google's [iOS setup guide](https://developers.google.com/admob/ios/quick-start) for the current list and App Store requirements.

### Android

Merge the Android application ID into the application element:

```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
  <manifest>
    <application>
      <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-0000000000000000~0000000000"/>
    </application>
  </manifest>
</android>
```

Omitting this metadata causes the native Google Mobile Ads SDK to fail with a missing application ID. See Google's [Android setup guide](https://developers.google.com/admob/android/quick-start).

Do not pass `applicationId` to `initialize()`; the module does not consume that property.

## 3. Configure mediation if needed

Skip this step unless the application already has, or is about to have, an AdMob mediation group with real ad sources in it. Installing adapters does not raise fill on its own: a network participates only once its publisher account is approved, it is added as an ad source, and its credentials are mapped to the ad unit.

Install the corresponding complements from step 1 when the application will mediate. AppLovin, Meta, InMobi, Unity and Liftoff are available on both platforms; ironSource mediation is deferred. Add the intended networks to the AdMob mediation groups and complete their account, placement, privacy and store-disclosure setup.

No platform-specific JavaScript or manual adapter initialization is required. After `module_initialized`, use `getMediationStatus()` to inspect the adapter states reported by Google; check package contents separately. See [AdMob mediation](mediation.md).

### Automatic adapter discovery

After the privacy gate, use `Admob.initialize({})` with either the core alone or selected complements. Google discovers the adapters included by `tiapp.xml`; no mediation flag or manual provider initialization is required.

Install only networks with the intended accounts and AdMob mappings configured. An installed adapter with incomplete configuration may delay startup until it responds or times out. For exceptional sessions that deliberately skip installed adapters, see the [initialization reference](api-reference.md#automatic-adapter-discovery).

## 4. Configure Privacy & messaging

Create the required messages in the **Privacy & messaging** section of the AdMob console. UMP resolves the message configuration from the application ID in the consuming app.

The application must request a fresh consent-information update on every launch. See [Privacy and initialization](privacy.md) before loading any ad.

## 5. Use official test units

The `TEST_*` constants resolve to Google's platform-specific demo ad unit IDs:

```js
const Admob = require('ti.admob.unified')

const adaptiveId = Admob.TEST_ADAPTIVE_BANNER
const interstitialId = Admob.TEST_INTERSTITIAL
const rewardedId = Admob.TEST_REWARDED
```

The module exports the full set of test constants for compatibility. Two formats have no implemented factory:

| Constant                     | Factory that accepts it                           |
| ---------------------------- | ------------------------------------------------- |
| `TEST_BANNER`                | `createBanner()`                                  |
| `TEST_ADAPTIVE_BANNER`       | `createAdaptiveBanner()`                          |
| `TEST_INTERSTITIAL`          | `createInterstitial()`                            |
| `TEST_INTERSTITIAL_VIDEO`    | `createInterstitial()` (same API, video creative) |
| `TEST_REWARDED`              | `createRewarded()`                                |
| `TEST_REWARDED_INTERSTITIAL` | None. Reserved; the format is not implemented     |
| `TEST_NATIVE`                | None. Reserved; the format is not implemented     |
| `TEST_APP_OPEN`              | `createAppOpen()`                                 |

See [Reserved and unavailable APIs](api-reference.md#reserved-and-unavailable-apis).

Do not copy an Android demo ID into an iOS branch or the reverse. Let the module constant select the correct ID.

Google recommends demo units or explicitly registered test devices during development. See the official [Android test-ad guide](https://developers.google.com/admob/android/test-ads) and [iOS test-ad guide](https://developers.google.com/admob/ios/test-ads).

## 6. Request consent, then initialize

Register all listeners first:

```js
const Admob = require('ti.admob.unified')

let initialized = false

function initializeOnce() {
  if (initialized || !Admob.canRequestAds()) {
    return
  }

  initialized = true
  Admob.initialize({
    ageRestrictedTreatment: Admob.AGE_RESTRICTED_TREATMENT_UNSPECIFIED,
    maxAdContentRating: Admob.MAX_AD_CONTENT_RATING_GENERAL
  })
}

Admob.addEventListener('module_initialized', event => {
  if (event.success) {
    Ti.API.info('Google Mobile Ads initialized')
  } else {
    Ti.API.warn(`Google Mobile Ads initialization failed: ${event.error}`)
  }
})

Admob.addEventListener('consent_complete', event => {
  if (event.canRequestAds) {
    initializeOnce()
  }
})

Admob.requestConsent({
  tagForUnderAgeOfConsent: false
})
```

### Optional: if the application requests ATT

Skip this section unless step 2 added `NSUserTrackingUsageDescription`. ATT is not a prerequisite for serving ads, and requesting it without a real tracking case invites an App Store rejection.

An application that does request it waits for the Apple prompt to settle before initializing, so that the SDK reads a final tracking status:

```js
Admob.addEventListener('consent_complete', event => {
  if (!event.canRequestAds) {
    return
  }

  const onTrackingComplete = trackingEvent => {
    Admob.removeEventListener(
      'tracking_authorization_completed',
      onTrackingComplete
    )
    Ti.API.info(`ATT status: ${trackingEvent.status}`)
    initializeOnce()
  }

  Admob.addEventListener(
    'tracking_authorization_completed',
    onTrackingComplete
  )
  Admob.requestTrackingAuthorization()
})
```

Google Mobile Ads reads `trackingAuthorizationStatus` on its own on iOS. That read is not a permission request and does not open Apple's prompt: only `requestTrackingAuthorization()` does.

`initialize()` and `requestConsent()` are idempotent native operations. Application-level guards are still useful because cached terminal events may be emitted again when a caller invokes an already-completed operation.

## 7. Create an ad only after the gate opens

A banner needs a host view that is already in the hierarchy, so the native view can measure its real width.

Reserve the host height before the ad arrives. Growing it from zero when `loaded` fires moves surrounding content after the screen appears. Give the host its expected height and a background colour that matches the screen, so the empty slot looks like a bottom margin:

```js
const bannerHost = Ti.UI.createView({
  left: 0,
  right: 0,
  bottom: 0,
  height: '50dp'
})

if (Admob.canRequestAds()) {
  const banner = Admob.createAdaptiveBanner({
    adUnitId: Admob.TEST_ADAPTIVE_BANNER,
    adaptiveType: Admob.ADAPTIVE_ANCHORED,
    width: Ti.UI.FILL
  })

  banner.addEventListener(Admob.AD_LOADED, event => {
    bannerHost.height = `${event.height}dp`
  })

  bannerHost.add(banner)
  banner.load()
}
```

A fixed `BANNER` is `50dp` and `FULLBANNER` is `60dp`, so a fixed-size placement can reserve its exact height. An adaptive banner reports its final height after loading. Reserve a suitable minimum, then adjust it in the loaded event to avoid growing the host from zero.

[Banner ads](banners.md) covers the full placement contract: reserving layout space without overlapping bottom-aligned UI, the named-listener lifecycle, and `pause()` / `resume()` / `destroy()`.

The module does not enforce the privacy gate inside ad proxies. The consuming application owns the order.

## Common setup mistakes

- Passing an ad unit ID where an application ID is required.
- Passing `applicationId` or `debugGeography` to `initialize()`.
- Loading ads before `consent_complete` and `canRequestAds === true`.
- Using `canShowPersonalizedAds()` or `isGDPR()` as a gate.
- Hardcoding an adaptive banner height.
- Keeping banner listeners after destroying or removing a placement.
- Using a production ad unit while clicking ads during development.
- Requesting ATT, or shipping `NSUserTrackingUsageDescription`, in an app with no tracking case. UMP does not require either one.
- Installing mediation complements without configured ad sources adds SDK size and may delay startup while unused networks time out.
- Publishing an app that is supposed to mediate without the selected complements installed, which must be checked through package inventories and Ad Inspector; an empty diagnostic map alone is not an installation check.

## Example appearance

For the classic playground, copy `example/app.js` and `example/semantic.colors.json` into `Resources/`, and `example/lib/ads.js` into `Resources/lib/`. The named colors provide light and dark variants for the content and window title. Keep the default DayNight Android theme so system icons follow the selected appearance. The sample keeps the title and status bars visible. Changing appearance does not require rebuilding the ad proxies or resetting the scroll position.
