> Source snapshot: official ti.admob.unified 1.0.0 documentation at commit `5b4cbf9` (copied 2026-10-11). Relative links rebased for this skill.

# Copy-ready JavaScript library

The integration library is [`example/lib/ads.js`](../assets/example/lib/ads.js). Copy it unchanged to the appropriate location:

- Alloy: `app/lib/ads.js`
- Classic Titanium: `Resources/lib/ads.js`

Then import it with:

```js
const Admob = require('ti.admob.unified')
const ads = require('lib/ads')
```

The library handles UMP sequencing, the `canRequestAds()` check, initialization, named-listener cleanup, banner slots, deferred loads, privacy-option reauthorization and terminal cleanup. You can also use the native module directly, as [`example/app.js`](../assets/example/app.js) does while sharing the library’s fullscreen size guard.

## What it covers

| Format          | Library factory          | Lifecycle returned                                                       |
| --------------- | ------------------------ | ------------------------------------------------------------------------ |
| Standard banner | `createBanner()`         | `pause()`, `resume()`, `retry()`, `rebuild()`, `isLoaded()`, `destroy()` |
| Adaptive banner | `createAdaptiveBanner()` | `pause()`, `resume()`, `retry()`, `rebuild()`, `isLoaded()`, `destroy()` |
| Interstitial    | `createInterstitial()`   | `load()`, `show()`, `retry()`, `isLoaded()`, `destroy()`                 |
| Rewarded        | `createRewarded()`       | `load()`, `show()`, `retry()`, `isLoaded()`, `destroy()`                 |
| App open        | `createAppOpen()`        | `load()`, `show()`, `retry()`, `isLoaded()`, `destroy()`                 |

Rewarded interstitial and native ads are not included because version `1.0.0` does not implement those factories.

## Start once

Create placements before or after `start()`. Loads requested before initialization wait until privacy checks and SDK initialization complete.

```js
ads.start({
  consent: {
    tagForUnderAgeOfConsent: false
  },
  initialization: {
    testDeviceIds: ['YOUR_TEST_DEVICE_ID']
  }
}).then(result => {
  if (!result.initialized) {
    Ti.API.warn('Ads are unavailable for this session')
  }
})
```

Set `requestTrackingAuthorization: true` only when the application has a real ATT use case and a valid `NSUserTrackingUsageDescription`. ATT is not another ad-request gate.

## Banners

A banner needs a permanent host and a positive reservation in dp. The library changes the host height and the adjacent content inset together; it never overlays the content.

```js
const banner = ads.createAdaptiveBanner({
  host: bannerHost,
  content,
  reservedHeight: 50,
  adUnitId: Admob.TEST_ADAPTIVE_BANNER,
  adaptiveType: Admob.ADAPTIVE_ANCHORED,
  onLoaded: event => Ti.API.info(`Banner: ${event.height}${event.heightUnit}`),
  onFailedToLoad: event => Ti.API.warn(event.error)
})
```

Use `createBanner()` with `adSize` or `customAdSize` for a fixed banner. Use `createAdaptiveBanner()` when Google should choose the height for the available width.

Call `pause()` when that placement stops being shown because the application selected another tab or opened another window over it. Call `resume()` when the same screen is shown again. These methods preserve the same native proxy, creative, visibility, opacity, host, and reserved height:

```js
banner.pause()
openChildWindow()

child.addEventListener('close', () => {
  banner.resume()
})
```

Do not mirror `Ti.App` background and foreground events. The native module already owns activity/application lifecycle as an independent pause cause.

The library creates no refresh timer. The first request comes from `load()`; later banner refreshes belong to Google Mobile Ads and the refresh policy configured for that ad unit in AdMob. A banner that is not actually on screen is ineligible for Android auto-refresh. On iOS the module disables and restores native autoload while paused.

Use `retry()` after a recoverable failure. Use `rebuild()` when the placement configuration changes, such as its width or orientation. Tab focus, window focus, appearance changes and ordinary background/foreground transitions do not require a rebuild.

## Fullscreen ads

Create once, load early, and show only at a moment chosen by the application:

```js
const interstitial = ads.createInterstitial({
  window: win,
  adUnitId: Admob.TEST_INTERSTITIAL,
  autoReload: true,
  onLoaded: () => Ti.API.info('Ready for the next natural break')
})

interstitial.load()

function onNaturalBreak() {
  interstitial.show() // false means no ready ad; continue without blocking
}
```

Rewarded ads grant value only from `onRewarded`:

```js
const rewarded = ads.createRewarded({
  window: win,
  adUnitId: Admob.TEST_REWARDED,
  onRewarded: event => grantReward(event.rewardAmount, event.rewardType)
})
```

App-open ads are prepared the same way and shown only during the application's own foreground loading experience:

```js
const appOpen = ads.createAppOpen({
  window: win,
  adUnitId: Admob.TEST_APP_OPEN
})

appOpen.load()

function onApplicationResumed() {
  appOpen.show()
}
```

Pass the owning `window` to each fullscreen factory (otherwise the library reads `Ti.UI.currentWindow`). The library remembers its dimensions when requesting the ad. Rotation alone makes no requests. At `show()`, a changed size discards and reloads only that ad and returns `false`; wait for `onLoaded` and a later user action to show it. Banners are not rebuilt by this check.

The raw-API playground shares this logic through `createFullscreenSizeGuard(getSize)`: call `recordLoad()` before requesting, then `show(present, reload)` when the user requests presentation. This helper does not initialize the SDK or run consent.

`show()` returns `false` when no valid ad is ready. Do not delay navigation or user work waiting for a fullscreen request.

## Privacy and diagnostics

Expose the privacy entry point only when required:

```js
privacyButton.visible = ads.isPrivacyOptionsRequired()

function openPrivacyOptions() {
  ads.showPrivacyOptions().then(event => {
    if (event.success === false) {
      Ti.API.warn(event.error)
    }
  })
}
```

After the form closes, the library reevaluates authorization and rebuilds active ad requests to account for any consent changes.

Ad Inspector also has a promise wrapper:

```js
ads.openAdInspector().then(event => {
  if (!event.success) {
    Ti.API.warn(event.error)
  }
})
```

## Cleanup

Destroy a placement when its owning window closes. For application shutdown or a test harness, dispose every registered placement at once.

On Android, Titanium also fires `close` while it recreates the window's activity, for example when the user switches between light and dark mode. The window survives, and the event carries `_closeFromActivityForcedToDestroy`. Skip that event, or the ads and their listeners are gone when the window comes back:

```js
win.addEventListener('close', event => {
  if (!event._closeFromActivityForcedToDestroy) banner.destroy()
})

// Or, when this ads service owns every placement:
ads.destroyAll()
```

Every destroy operation is idempotent. A destroyed manager cannot be reused; create another manager for a new placement.

See [`example/library-usage.js`](../assets/example/library-usage.js) for a complete runnable integration.


## Concurrent operations and cleanup

Concurrent calls to `showPrivacyOptions()` share one native presentation and one promise. `openAdInspector()` does the same for Inspector. Terminal events and synchronous native exceptions remove their listeners; a later call starts a new operation. `destroyAll()` releases placements only. It does not cancel an SDK form or its pending promise.

A banner failure or destruction cleans up the old proxy before invoking application callbacks, so calling `retry()` from those callbacks preserves the replacement. On iOS, adaptive placements reserve the native anchored height when width is known and wait for positive layout before loading. Destroying a placement removes any pending layout listener.
