> Source snapshot: official ti.admob.unified 1.0.0 documentation at commit `5b4cbf9` (copied 2026-10-11). Relative links rebased for this skill.

# Banner ads

Standard and adaptive banners share one public lifecycle and event contract on iOS and Android.

Both factories return a Titanium `TiViewProxy`, so their creation dictionaries also accept normal Titanium view/layout properties such as `width`, `height`, `top`, `bottom`, `left`, and `right`. The tables below list the AdMob-specific properties.

<!-- TOC-START -->
## Contents

- [Choose a banner type](#choose-a-banner-type)
- [Adaptive banner](#adaptive-banner)
- [Reserve real layout space](#reserve-real-layout-space)
- [Runtime properties](#runtime-properties)
- [Shared methods](#shared-methods)
- [Events and payloads](#events-and-payloads)
- [Standard banner](#standard-banner)
- [Refresh behavior](#refresh-behavior)

<!-- TOC-END -->

## Choose a banner type

Use `createAdaptiveBanner()` for a banner anchored outside scrolling content. Its height is calculated from the available width, orientation, and device.

Use `createBanner()` when the placement explicitly requires a fixed Google ad size such as `BANNER`, `MEDIUM_RECTANGLE`, or `LEADERBOARD`.

| Capability                     | iOS | Android |
| ------------------------------ | --- | ------- |
| Standard fixed-size banner     | Yes | Yes     |
| Large anchored adaptive banner | Yes | Yes     |
| Inline adaptive banner         | Yes | Yes     |
| Collapsible anchored banner    | Yes | Yes     |
| Dynamic loaded height          | Yes | Yes     |

## Adaptive banner

```js
const banner = Admob.createAdaptiveBanner({
  adUnitId: Admob.TEST_ADAPTIVE_BANNER,
  adaptiveType: Admob.ADAPTIVE_ANCHORED,
  width: Ti.UI.FILL
})

bannerHost.add(banner)
banner.load()
```

The proxy must be in the Titanium view hierarchy before `load()` so its native view can measure the real container width.

### Creation properties

| Property       | Type     |         iOS |     Android | Notes                                                        |
| -------------- | -------- | ----------: | ----------: | ------------------------------------------------------------ |
| `adUnitId`     | String   |         Yes |         Yes | Required.                                                    |
| `adaptiveType` | String   |         Yes |         Yes | Defaults to `ADAPTIVE_ANCHORED`.                             |
| `maxHeight`    | Number   | Inline only | Inline only | Maximum inline height in dp; both platforms default to `50`. |
| `collapsible`  | String   |         Yes |         Yes | Native placement string: `"top"` or `"bottom"`.              |
| `keywords`     | String[] |         Yes |         Yes | Prefer contextual configuration in AdMob.                    |
| `contentUrl`   | String   |         Yes |         Yes | URL describing surrounding content.                          |
| `requestAgent` | String   |         Yes |         Yes | Identifies what issued the request.                          |
| `extras`       | Object   |         Yes |         Yes | Google adapter request extras.                               |

On iOS, anchored adaptive banners use the large size because Google deprecated the plain anchored functions. Large banners are 50 to 150 points tall and never exceed 20% of the screen; the deprecated size capped at 90 points and 15%. For a shorter fixed strip, use `createBanner()` with `customAdSize`.

Events echo back the constant you passed, so `event.adaptiveType` can be compared against `ADAPTIVE_ANCHORED` or `ADAPTIVE_INLINE` on either platform.

`ADAPTIVE_INLINE` and `maxHeight` work on both platforms. Inline banners scroll with the content and use the height limit you supply. Anchored banners sit at a screen edge and use the height Google calculates; `maxHeight` has no effect on them.

`collapsible` takes Google's native placement string, `"top"` and `"bottom"`, on both platforms. The module exports no `COLLAPSIBLE_TOP` or `COLLAPSIBLE_BOTTOM` constant.

Both platforms send the option under the same ad-network extra key, using a Bundle on Android and `GADExtras` on iOS. No separate collapsible ad-unit setting is required. A request may return a standard banner, and mediated ads are non-collapsible. Fixed and adaptive banners include `isCollapsible` in `AD_LOADED`, copied from the SDK for the received ad. This reports the ad classification, not its expanded state or visible rendering. Calling `load()` requests another ad; it does not expand an existing creative.

Google's current requirements are described in the collapsible banner guide, published per platform: [Android](https://developers.google.com/admob/android/banner/collapsible), [iOS](https://developers.google.com/admob/ios/banner/collapsible).

## Reserve real layout space

The loaded height uses density-independent units on both platforms:

```js
banner.addEventListener(Admob.AD_LOADED, event => {
  bannerHost.height = `${event.height}dp`
})
```

Do not hardcode the final height. Adaptive banners can change height across devices, densities, widths, and orientations. On iOS, calculate the placement height with `Admob.getAnchoredAdaptiveBannerSize(widthInDp)` before loading and wait for a nonzero `postlayout` event on the banner. Replace the reservation with `event.height` after loading. Requesting an ad in a zero-height host can suppress its initial collapsible expansion even when `isCollapsible` is true. This reservation applies to large anchored banners, not inline banners.

A safe composite layout reserves the same bottom inset for content:

```js
const root = Ti.UI.createView({
  layout: 'composite'
})

const content = Ti.UI.createView({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
})

const bannerHost = Ti.UI.createView({
  left: 0,
  right: 0,
  bottom: 0,
  height: 0
})

root.add(content)
root.add(bannerHost)

function setBannerHeight(value) {
  const height = Math.max(0, Number(value) || 0)
  const dimension = `${height}dp`

  bannerHost.height = dimension
  content.bottom = dimension
}
```

This keeps the banner inside the visible layout and prevents it from overlapping lists, navigation, snackbars, or other bottom-aligned UI. Place `root` inside the app's safe-area-aware content region.

Do not use a vertical layout where a preceding `Ti.UI.FILL` child consumes the entire height and pushes the banner host below the window.

### Full lifecycle example

Use named listeners so they can be removed:

```js
let banner = null
const isIOS = Ti.Platform.osname !== 'android'

function onInitialLayout() {
  if (!banner || banner.rect.width <= 0 || banner.rect.height <= 0) return
  banner.removeEventListener('postlayout', onInitialLayout)
  banner.load()
}

function createBanner() {
  if (banner || !Admob.canRequestAds()) {
    return
  }

  banner = Admob.createAdaptiveBanner({
    adUnitId: Admob.TEST_ADAPTIVE_BANNER,
    adaptiveType: Admob.ADAPTIVE_ANCHORED,
    ...(isIOS ? { height: Ti.UI.FILL } : {}),
    width: Ti.UI.FILL
  })

  banner.addEventListener(Admob.AD_LOADED, onLoaded)
  banner.addEventListener(Admob.AD_FAILED_TO_LOAD, onFailed)
  banner.addEventListener(Admob.AD_DESTROYED, onDestroyed)

  if (isIOS) {
    setBannerHeight(Admob.getAnchoredAdaptiveBannerSize(bannerHost.rect.width).height)
    banner.addEventListener('postlayout', onInitialLayout)
    bannerHost.add(banner)
  } else {
    bannerHost.add(banner)
    banner.load()
  }
}

function onLoaded(event) {
  setBannerHeight(event.height)
}

function onFailed(event) {
  Ti.API.warn(`Banner failed: ${event.error} (${event.code})`)
  setBannerHeight(0)
}

function onDestroyed() {
  setBannerHeight(0)
}

function pauseBanner() {
  banner?.pause()
}

function resumeBanner() {
  banner?.resume()
}

function destroyBanner() {
  if (!banner) {
    setBannerHeight(0)
    return
  }

  banner.removeEventListener('postlayout', onInitialLayout)
  banner.removeEventListener(Admob.AD_LOADED, onLoaded)
  banner.removeEventListener(Admob.AD_FAILED_TO_LOAD, onFailed)
  banner.removeEventListener(Admob.AD_DESTROYED, onDestroyed)
  banner.destroy()

  if (banner.parent) {
    banner.parent.remove(banner)
  }

  banner = null
  setBannerHeight(0)
}
```

Call `pauseBanner()` when the screen that owns the placement stops being shown, `resumeBanner()` when it comes back, and `destroyBanner()` when the placement or window closes.

### Who pauses a banner

Two independent causes can hold a banner paused, and the module tracks them separately:

| Cause       | Trigger                                                  | Platform        |
| ----------- | -------------------------------------------------------- | --------------- |
| Application | your `pause()` / `resume()` calls                        | Both            |
| Lifecycle   | activity `onPause`/`onResume`, app background/foreground | Both, automatic |

Each pause cause must clear independently. A banner paused because its tab is hidden stays paused when the app returns from the background. A lifecycle pause lasts until the app is visible again, even if you call `resume()` in the meantime. Any deferred load waits for both causes to clear.

Android follows the hosting activity, and iOS observes application background/foreground. A secondary Android window backed by another activity needs no manual pause/resume wiring. Use the public methods when navigation hides a placement while its host lifecycle remains active, such as a custom overlay within the same activity. iOS uses background/foreground transitions because opening Control Center or receiving a call banner can resign active while the ad remains visible.

When Android recreates an activity for a configuration change, such as light/dark appearance, the module releases the stale native `AdView` and keeps the JavaScript proxy alive. It requests a replacement banner after Titanium creates the new view, without emitting `destroyed`. The creative cannot move between activities because an Android `View` belongs to the activity that created it.

## Runtime properties

Both platforms expose banner creation properties for reading and writing at runtime. Changes take effect at different points:

`keywords`, `contentUrl`, `requestAgent`, `extras` and `collapsible` apply on the next `load()`. They leave the current creative unchanged:

```js
banner.extras = { collapsible: 'bottom' }
banner.requestAgent = 'my-app/2.1'
banner.load()  // now they travel
```

Changing `adSize` or `customAdSize` applies on the next `load()` on both platforms. The existing creative remains until that request; the module recreates the native view when needed.

Changing `adUnitId` also applies on the next load. The module recreates the native view instead of assigning a second ID to an existing Android AdView, which Google forbids.

### What Android writes back

Android overwrites the proxy's own `height` when the ad size is known, and the two banner types write different types into it:

| Banner   | What Android assigns | Example  |
| -------- | -------------------- | -------- |
| Standard | A number, in dp      | `50`     |
| Adaptive | A string, in dp      | `"64dp"` |

iOS assigns neither value. When reading `banner.height`, handle both a number and a `"…dp"` string. Alternatively, read `event.height` from the `loaded` payload, where it is numeric on both platforms.

Android also treats `top`, `left` and `right` as native padding on the `AdView`, on top of the Titanium layout meaning. iOS applies only the Titanium layout.

## Shared methods

### `load()`

Starts an ad request.

- A second call is ignored while a request is active.
- A call while paused defers at most one request until `resume()`.
- A call after `destroy()` cannot recreate the proxy and emits `failed_to_load`.

### `pause()`

Idempotently records an application-owned pause. It does not change `visible`, `opacity`, height, or its host, and it does not replace the native proxy or loaded creative.

Google's SDKs use different native pause mechanisms:

| Behavior                       | iOS                             | Android                   |
| ------------------------------ | ------------------------------- | ------------------------- |
| Changes visual state or layout | No                              | No                        |
| Suspends ad-view processing    | No equivalent API               | Yes, via `AdView.pause()` |
| Stops native autoload directly | Yes, via `autoloadEnabled = NO` | No direct refresh switch  |

On Android, `AdView.pause()` pauses extra processing; Google does not expose it as a refresh-control API. Automatic refresh separately requires the banner to be visible. Call `pause()` when another opaque window covers the placement or its tab is deselected, keeping the proxy's visual properties unchanged. A controller state change alone is not a reason to pause a banner the user can still see.

On iOS, the module stores the banner's existing `autoloadEnabled` value and sets it to `NO`. This prevents native autoload while leaving the same view and creative intact.

A `load()` requested while either pause cause is active waits until both clear. The module can defer the request without changing visibility.

Do not destroy/recreate to simulate a pause. That discards the creative, creates a new request on return, and makes ordinary navigation visibly slower.

### `resume()`

Idempotently resumes the banner and runs one deferred load, if present, but only once every pause cause has cleared. See [Who pauses a banner](#who-pauses-a-banner).

It reverses only the native pause: Android resumes ad-view processing and iOS restores the `autoloadEnabled` value the banner had before pausing. There is no visibility or layout transition to undo. Because application lifecycle is tracked separately, `resume()` cannot accidentally clear a background pause.

### `isLoaded()`

Returns `true` only while the current proxy owns a successfully loaded ad.

### `destroy()`

Terminal and safe to repeat. It releases the native ad, detaches native delegates/listeners and lifecycle registrations, and emits `destroyed` once.

Never reuse a destroyed banner. Create a new proxy for a new placement or a new width/orientation request.

### Compatibility aliases

`destroyAdViewAndCancelRequest()` delegates to `destroy()`.

`destoyAdViewAndCancelRequest()` is the deprecated, misspelled alias retained for older consumers. New code must call `destroy()`.

## Events and payloads

Both banner types emit:

- `AD_LOADED` / `loaded`
- `AD_FAILED_TO_LOAD` / `failed_to_load`
- `AD_CLICKED` / `clicked`
- `AD_IMPRESSION` / `impression`
- `AD_OPENED` / `opened`
- `AD_CLOSED` / `closed`
- `AD_DESTROYED` / `destroyed`

Every payload includes `adUnitId`, `adType: 'banner'`, and `isAdaptive`, which reports which factory created the proxy: `true` from `createAdaptiveBanner()`, `false` from `createBanner()`.

```js
{
  adUnitId: 'ca-app-pub-…/…',
  adType: 'banner',
  isAdaptive: false
}
```

Adaptive payloads also include `adaptiveType`.

For both banner types, `AD_LOADED` also includes `isCollapsible: boolean`, reporting the native SDK's classification of the received ad. It is not an expanded/collapsed state flag.

A failure adds:

```js
{
  error: 'Native error message',
  code: 3
}
```

An adaptive `loaded` event guarantees:

```js
{
  height: 90,
  heightUnit: 'dp'
}
```

Android additionally reports diagnostic size fields:

```js
{
  width: 392,
  widthUnit: 'dp',
  widthPx: 1080,
  heightPx: 253,
  density: 2.75
}
```

All seven size fields are present on both platforms. Android density can be fractional; iOS reports the screen scale.

## Standard banner

```js
const banner = Admob.createBanner({
  adUnitId: Admob.TEST_BANNER,
  adSize: Admob.BANNER,
  width: Ti.UI.FILL
})

bannerHost.add(banner)
banner.load()
```

### Creation properties

| Property       | Type     |  iOS | Android | Notes                                                                            |
| -------------- | -------- | ---: | ------: | -------------------------------------------------------------------------------- |
| `adUnitId`     | String   |  Yes |     Yes | Required.                                                                        |
| `adSize`       | String   |  Yes |     Yes | Defaults to `BANNER`.                                                            |
| `customAdSize` | Object   |  Yes |     Yes | `{ width, height }` in dp. Wins over `adSize`. Ignored unless both are positive. |
| `keywords`     | String[] |  Yes |     Yes | Request keywords.                                                                |
| `contentUrl`   | String   |  Yes |     Yes | Surrounding content URL.                                                         |
| `requestAgent` | String   |  Yes |     Yes | Identifies what issued the request.                                              |
| `extras`       | Object   |  Yes |     Yes | Google adapter extras.                                                           |

`customAdSize` builds `new AdSize(width, height)` on Android and `GADAdSizeFromCGSize` on iOS, so one object produces the same request on both.

Both dimensions use density-independent units. `Ti.Platform.displayCaps.platformWidth` returns pixels on Android and points on iOS. Divide by `logicalDensityFactor` only on Android; on a 3x iPhone that division would request a banner one third of the screen width.

```js
function screenWidthInDp() {
  const caps = Ti.Platform.displayCaps

  if (Ti.Platform.osname === 'android') {
    return Math.round(caps.platformWidth / caps.logicalDensityFactor)
  }

  return Math.round(caps.platformWidth)
}
```

The application must convert Titanium dimensions to the expected units; the module passes both numbers through unchanged. It applies the size when creating the native view. As with `adSize`, later assignments apply on the next load.

Choose a custom size your ad units can serve. A larger slot does not add available inventory.

Portable fixed sizes, with the device each one was designed for and the height its host view must reserve:

| Constant           | Size    | Intended device |
| ------------------ | ------- | --------------- |
| `BANNER`           | 320×50  | Phone           |
| `LARGE_BANNER`     | 320×100 | Phone           |
| `MEDIUM_RECTANGLE` | 300×250 | Tablet          |
| `FULLBANNER`       | 468×60  | Tablet          |
| `LEADERBOARD`      | 728×90  | Tablet          |

These device categories come from Google's `GADAdSize.h`. A phone is 360–430 dp wide, so a 468 dp `FULLBANNER` cannot fit at full size regardless of the host height. Use `BANNER` for the fixed phone size, or `customAdSize` with the screen width or an adaptive banner for a full-width strip.

Give the host the requested height. A `FULLBANNER` in a 50 dp box will be clipped.

Unknown values, including `smart_banner`, fall back to `BANNER`. Google removed smart banners on Android and deprecated them on iOS. The shared fallback avoids selecting a fixed 320×50 banner on one platform and a full-width strip on the other. For full width, use `customAdSize` or `createAdaptiveBanner()` to let Google choose the height.

Changing `adSize` on an existing iOS native banner is not supported. Destroy and recreate the proxy.

## Refresh behavior

Do not add a JavaScript renewal timer. Google Mobile Ads respects the banner refresh rate configured for the ad unit in AdMob. The application requests the initial load and lets the SDK/ad-unit configuration own later refreshes.

TiAdMobUnified manages the native banner proxy and its lifecycle without a periodic reload or recreation loop. Google documents that Android automatic refresh requires a visible banner. Set or disable the refresh interval in AdMob, and use screen-level `pause()`/`resume()` when navigation hides or reveals the placement.

### Sizing before loading

`getAnchoredAdaptiveBannerSize(widthInDp)` returns `{ width, height, heightUnit: "dp" }` on both platforms using the same Google large anchored sizing API as the banner. Call it with a positive available placement width after the window has laid out (Android requires a current Activity). It does not request an ad. The returned height is the collapsed placement; Google presents the expanded creative as an overlay without requiring that extra height in the host. Recalculate when creating a placement at a different width or orientation.
