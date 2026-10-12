> Source snapshot: official ti.admob.unified 1.0.0 documentation at commit `5b4cbf9` (copied 2026-10-11). Relative links rebased for this skill.

# Migrating to ti.admob.unified

This guide covers adopting the first release, `1.0.0`, from a platform-specific AdMob module or an internal development build. There are no previously published versions of this module.

## Selecting mediation dependencies

Install only the core for Google ads. If the application mediates, install a complement for each selected network. For example:

```xml
<modules>
  <module version="1.0.0">ti.admob.unified</module>
  <module version="1.0.0">ti.admob.unified.mediation.applovin</module>
</modules>
```

The aggregate development package is not part of this release. Replace its declaration with the desired per-network modules. `getMediationStatus()` now reports Google initialization states through `{ initializationState, adapters }`; it does not validate mappings or delivery. ironSource mediation is deferred. See [AdMob mediation](mediation.md).

## If you used an internal pre-release build

Internal ZIPs exposed API differences that never reached a published release. Update code that depends on them as follows.

### Generic mediation diagnostics

Replace reads of the old six-Boolean map (for example `status.appLovin`) with iteration over `Admob.getMediationStatus().adapters` after `module_initialized`. Use `initializationState` for the core process and each entry's `state` for Google's adapter report. There is no portable provider-key mapping: native class names differ between iOS and Android. Before startup the array is empty; during startup it may be partial. A `ready` entry does not prove account configuration or ad delivery.

Remove calls to `isAppLovinAvailable`, `isMetaAvailable`, `isInMobiAvailable`, `isVungleAvailable`, `isUnityAvailable`, `isIronSourceAvailable` and `enableOptionalMediationNetworks`. Also remove `setAppLovinGDPRConsent`, `setInMobiGDPRConsent` and `setVungleGDPRConsent`; those pre-release setters only logged warnings. Continue using UMP and each provider's documented consent requirements. `disableMediation` and the `module_initialized` payload are unchanged.

### There is no `COLLAPSIBLE_TOP` or `COLLAPSIBLE_BOTTOM`

Neither constant is exported. Reading it returns `undefined`; passing `Admob.COLLAPSIBLE_TOP` therefore sends `undefined` to the native layer.

They used to hold `"collapsible_top"` and `"collapsible_bottom"`. Google's SDK accepts only `"top"` and `"bottom"`, and the module forwarded the value unchanged, so every request built from those constants was invalid.

The `collapsible` property itself is unchanged and now works on both platforms. It takes Google's native string:

```js
const banner = Admob.createAdaptiveBanner({
  adUnitId: Admob.TEST_ADAPTIVE_BANNER,
  collapsible: 'bottom'
})
```

### `smart_banner` no longer produces a full-width banner on iOS

Google removed the size on Android and deprecated it on iOS. Internal builds selected a fixed 320×50 banner on Android and a full-width strip on iOS. The value now falls back to `BANNER` on both platforms, like any other unrecognised size.

Android behaviour is unaffected. On iOS, a placement that relied on `adSize: 'smart_banner'` for a full-width strip now renders a 320×50 banner.

The replacement is `customAdSize`, which both platforms accept:

```js
function screenWidthInDp() {
  const caps = Ti.Platform.displayCaps

  if (Ti.Platform.osname === 'android') {
    return Math.round(caps.platformWidth / caps.logicalDensityFactor)
  }

  return Math.round(caps.platformWidth)
}

const banner = Admob.createBanner({
  adUnitId: Admob.TEST_BANNER,
  customAdSize: { width: screenWidthInDp(), height: 50 },
  width: Ti.UI.FILL
})
```

`createAdaptiveBanner()` is the other option when Google should choose the height. See [Standard banner properties](banners.md#creation-properties-1).

### Legacy privacy methods no longer gate ads

`canShowPersonalizedAds()` always returns `false` and `canShowAds()` is an alias of `canRequestAds()`. Code that branched on either one has to move to the single gate described below.

## Module declaration

Replace platform-specific or older AdMob modules with one declaration:

```xml
<modules>
  <module version="1.0.0">ti.admob.unified</module>
</modules>
```

Add the selected network complements only if the application mediates; for example, `<module version="1.0.0">ti.admob.unified.mediation.applovin</module>` for AppLovin.

Update JavaScript imports:

```js
const Admob = require('ti.admob.unified')
```

Install both local artifacts when the app targets iOS and Android.

## Move the application ID to `tiapp.xml`

Remove `applicationId` from JavaScript initialization. Configure `GADApplicationIdentifier` on iOS and `com.google.android.gms.ads.APPLICATION_ID` on Android as described in [Getting started](getting-started.md).

## Replace privacy gates

Before:

```js
if (Admob.canShowPersonalizedAds() || !Admob.isGDPR()) {
  loadAds()
}
```

After:

```js
if (Admob.canRequestAds()) {
  loadAds()
}
```

Do not consume:

- `canShowPersonalizedAds()`
- `isGDPR()`
- `canShowAds()`
- `consent_ready`
- `consent_error`
- legacy payload aliases such as `isPrivacyOptionsRequired`

Use `consent_complete`, `canRequestAds`, and `privacyOptionsRequired`.

## Replace callback-style consent code

The supported contract is event-based:

```js
Admob.addEventListener('consent_complete', onConsentComplete)
Admob.requestConsent({})
```

Callback properties passed inside the config object are not invoked.

## Request UMP before initialization

The recommended order is:

```text
UMP -> canRequestAds -> initialize -> load ads
```

Use that same sequence on both platforms. Do not initialize before UMP has updated the current session.

App Tracking Transparency is optional and sits outside this sequence. If your application has its own tracking case, resolve it before `initialize()`; it is not an ad-request gate, and `canRequestAds()` remains the only one. The call is portable: iOS resolves ATT, and Android emits `tracking_authorization_completed` immediately with `applicable: false`.

## Adopt adaptive banner sizing

Replace fixed full-width or smart-banner assumptions:

```js
const banner = Admob.createAdaptiveBanner({
  adUnitId: Admob.TEST_ADAPTIVE_BANNER,
  adaptiveType: Admob.ADAPTIVE_ANCHORED,
  width: Ti.UI.FILL
})
```

On `loaded`, use `event.height` with `event.heightUnit`. Update both the banner host and the adjacent content inset. Collapse both on error and destruction.

Do not keep a fixed `50`, `90`, or device-specific height.

`ADAPTIVE_INLINE` and `maxHeight` work on iOS too. An application that branched on `Ti.Platform.osname` to keep inline banners off iOS can drop the branch.

## Adopt the banner lifecycle

Both standard and adaptive banners support:

```js
banner.load()
banner.pause()
banner.resume()
banner.isLoaded()
banner.destroy()
```

`destroy()` is terminal and idempotent. Remove JavaScript event listeners and the proxy from its parent when the owning placement closes.

The module pauses banners when the Android activity pauses or the iOS application enters the background. Remove any application code that duplicates those handlers. Keep calls for navigation changes the module cannot observe, such as hiding a tab or covering a window. See [Who pauses a banner](banners.md#who-pauses-a-banner).

Do not carry forward code that changes `visible`, opacity, height, or the banner host during pause/resume. TiAdMobUnified preserves the same visual slot and creative; navigation owns only the application pause cause.

Replace both historical aliases when practical:

```js
banner.destroyAdViewAndCancelRequest()
banner.destoyAdViewAndCancelRequest()
```

with:

```js
banner.destroy()
```

## Remove manual refresh timers

Delete `setTimeout`/`setInterval` banner renewal loops. Configure refresh in AdMob and let the native SDK own it.

The application issues the initial `load()`. Google Mobile Ads manages later refresh requests; TiAdMobUnified manages lifecycle.

## Adopt the fullscreen lifecycle

Interstitial, rewarded, and app open proxies share the same methods and event payloads on iOS and Android:

```js
fullscreen.load()
fullscreen.show()
fullscreen.isLoaded()
fullscreen.destroy()
```

Calls to `load()` while a request, loaded ad, or presentation is active are ignored. Each native fullscreen ad is single-use. `destroy()` is terminal and idempotent, and emits `destroyed` once.

Common events include `adUnitId` and `adType`; failures add `error`, `message`, and `code`. Both platforms emit `opened` and `showed_fullscreen_content`. Rewarded value must be granted only from the `rewarded` event.

### App open

`createAppOpen()` returns a proxy on both platforms. Of the modules it replaces, `ti.admob` documents the iOS type without a factory, and `ti.android.admob` supplies an Android-only proxy. Applications previously had to implement the missing iOS support themselves.

It follows the fullscreen contract above, with one addition: an app open ad expires four hours after the request. Past that point `isLoaded()` reports `false` and `show()` emits `failed_to_show` with code `1`. See [The four hour window](fullscreen.md#the-four-hour-window).

## Mediation

Five optional complements carry AppLovin, Meta, InMobi, Unity and Liftoff dependencies on both platforms. Google Mobile Ads discovers their adapters; applications keep calling the core factories. ironSource mediation is deferred.

Availability probes remain in `ti.admob.unified` for portable diagnostics, and report `false` for every network when no complements are installed. Legacy provider consent setters are deprecated no-ops because UMP and each provider's current requirements must drive privacy configuration. Installing an adapter does not create an account or enable a mediation source: configure mappings and credentials in AdMob, then validate with Ad Inspector.

An application that serves AdMob demand only leaves the complements out and uses `Admob.initialize({})`, with no disabling flag. Including selected complements opts into automatic adapter discovery; no `enableMediation` flag is needed. An exceptional session that skips installed adapters is covered in the [initialization reference](api-reference.md#automatic-adapter-discovery).

## Development checklist

- Use the module's `TEST_*` constants.
- Keep production IDs disabled until physical validation is complete.
- Test consent accepted, rejected, not required, and previous-session states.
- Test ATT authorized, denied, and previously resolved on iOS.
- Test banner load, error collapse, rotation, background/resume, and repeated window close.
- Test interstitial, rewarded, and app open duplicate loads, show failures, close, reward delivery, and repeated destruction.
- Confirm no duplicate banners or retained listeners.
- Inspect requests with Ad Inspector.
- Inspect `getMediationStatus()` after `module_initialized`, and verify installed complements separately through package inventories and Ad Inspector.
- Run `npm test` and `./scripts/verify-artifacts.sh`.


## Corrections from internal audit builds

Boolean results and payload fields use JavaScript Booleans on both platforms; replace comparisons to numeric `0` or `1`. iOS load errors now use the shared error constants; presentation, UMP and Inspector codes remain domain-specific. Use the event name and the reference's error table when migrating code that compared raw NSError values.

Application volume now works on iOS using the same percentage string accepted on Android. Fullscreen configuration properties are mutable for subsequent loads on both platforms. Native helper/delegate methods and internal state from earlier iOS builds are no longer exposed as application APIs. Availability diagnostics require the adapter class, so a network SDK installed without its adapter reports `false`.
