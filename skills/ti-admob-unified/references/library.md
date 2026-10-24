> Source snapshot: official ti.admob.unified 1.0.0 documentation at release source commit `034843299b2984253988e0ffccb9f6a1c91682c9` (copied 2026-10-24). Relative links rebased for this skill.

# Copy-ready JavaScript library

The integration library is [`example/lib/ads.js`](../assets/example/lib/ads.js). Copy it unchanged to the appropriate location:

- Alloy: `app/lib/ads.js`
- Classic Titanium: `Resources/lib/ads.js`

Import it from an Alloy controller with `require('ads')`, or from Classic Titanium with `require('lib/ads')`:

```js
const Admob = require('ti.admob.unified')
const ads = require('lib/ads') // Classic; Alloy: require('ads')
```

Alloy copies `app/lib/ads.js` to the generated Resources root. Keep that import distinction when adapting the Classic examples.

The library handles UMP sequencing, the `canRequestAds()` check, initialization, named-listener cleanup, banner slots, deferred loads, privacy-option reauthorization and terminal cleanup. You can also use the native module directly, as [`example/app.js`](../assets/example/app.js) does while sharing the library’s fullscreen size guard.

## What it covers

| Format          | Library factory          | Lifecycle returned                                                       |
| --------------- | ------------------------ | ------------------------------------------------------------------------ |
| Standard banner | `createBanner()`         | `pause()`, `resume()`, `retry()`, `rebuild()`, `isLoaded()`, `destroy()` |
| Adaptive banner | `createAdaptiveBanner()` | `pause()`, `resume()`, `retry()`, `rebuild()`, `isLoaded()`, `destroy()` |
| Interstitial    | `createInterstitial()`   | `load()`, `show()`, `retry()`, `isLoaded()`, `destroy()`                 |
| Rewarded        | `createRewarded()`       | `load()`, `show()`, `retry()`, `isLoaded()`, `destroy()`                 |
| Rewarded interstitial | `createRewardedInterstitial()` | `load()`, `show()`, `retry()`, `isLoaded()`, `destroy()` |
| App open        | `createAppOpen()`        | `load()`, `show()`, `retry()`, `isLoaded()`, `destroy()`                 |

Native ads have no factory in version `1.0.0`. For rewarded interstitials, show an introduction with a skip option before calling the manager's `show()`; see [Rewarded interstitial ads](rewarded-interstitial.md).

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
}).catch(error => {
  Ti.API.warn(`Ads startup failed: ${error.message || error}`)
})
```

Set `requestTrackingAuthorization: true` only when the application has a real ATT use case and a valid `NSUserTrackingUsageDescription`. This option controls only the library's explicit ATT request. An IDFA message configured in AdMob may let UMP present ATT during the consent step even when this option is false. When UMP handles ATT, leave the option false and retain the required description/translations. The startup result's `tracking` value describes the explicit request only; query `Admob.getTrackingAuthorizationStatus()` for current system state. ATT is not another ad-request gate. Call `start()` from the active foreground after other prompts have closed. If an iOS interruption occurs during UMP, the library waits for `Ti.App.resumed` before requesting ATT, then removes its temporary lifecycle listeners. It does not coordinate unrelated prompts opened by application code.

Use `Admob.getTrackingAuthorizationStatus()` to inspect ATT without prompting, including after a return from Settings. The same method works in Classic and Alloy. Android reports `applicable: false`; its `authorized: true` convention does not grant general tracking permission.

`start()` caches its promise for the JavaScript session, including an unavailable result. Repeating it does not retry a failed consent update or initialization. If the app needs a recoverable startup retry UI, use the [raw event-based flow](privacy.md#requestconsentconfig), which supports consent retries; do not call `resetConsent()` in production. Native invocation exceptions are converted into failure results by the library; inspect `result.initialized` and the result events. Catch errors in application promise callbacks as well.

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

The library creates no refresh timer. Banner managers start their first request automatically when the gate and layout are ready; there is no public banner-manager `load()` method. Later banner refreshes belong to Google Mobile Ads and the refresh policy configured for that ad unit in AdMob. A banner that is not actually on screen is ineligible for Android auto-refresh. On iOS the module disables and restores native autoload while paused.

Use `retry()` after a recoverable failure. Use `rebuild()` when the placement configuration changes, such as its width or orientation. Tab focus, window focus, appearance changes and ordinary background/foreground transitions do not require a rebuild.

### Banner manager options

Alongside the native banner properties, the library accepts:

| Option | Default | Purpose |
| --- | --- | --- |
| `host` | Required | Permanent Titanium container for the banner. |
| `content` | Omitted | Adjacent composite-layout view whose bottom inset follows the slot. |
| `reservedHeight` | Required | Positive initial reservation in dp. |
| `paused` | `false` | Defer the first request until `resume()`. |
| `collapseOnFailure` | `true` | Set to `false` to preserve the slot on a load failure. |
| `onLoaded`, `onFailedToLoad`, `onDestroyed` | Omitted | Placement lifecycle callbacks receiving the event. |
| `onClicked`, `onImpression`, `onOpened`, `onClosed` | Omitted | Forwarded native event callbacks. |

Keep the options object stable. Managers do not expose the raw proxy's mutable properties; use a new manager when changing configuration. `rebuild()` recreates the proxy from the manager's existing options, and `retry()` does the same for a failed placement. `destroy()` removes the placement and collapses its slot.

## Fullscreen ads

Create the placement once. Load before the intended break and show it when the application reaches that break:

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

Pass the owning `window` to each fullscreen factory (otherwise the library reads `Ti.UI.currentWindow`). The library records that window's dimensions when requesting the ad. Rotation alone makes no requests. At `show()`, a changed size discards and reloads only that ad and returns `false`; wait for `onLoaded` and a later user action to show it. Banners are not rebuilt by this check.

The raw-API playground shares this logic through `createFullscreenSizeGuard(getSize)`: call `recordLoad()` before requesting, then `show(present, reload)` when the user requests presentation. The callback can return the window itself (preferred) or a measured `{ width, height }` size. For a window, the guard compares valid outer `rect` bounds and falls back to `size` before layout. Transient Android client-area changes after dismissing an ad therefore keep a ready preload, while rotation and window resizing still invalidate it. This helper does not initialize the SDK or run consent. The playground adds a pending user request around this check so its Show button can wait for a replacement and present it without another tap. The manager API itself keeps the immediate Boolean return contract above; it does not queue a later presentation after returning `false`.

`show()` returns `false` when no valid ad is ready. Do not delay navigation or user work waiting for a fullscreen request.

### Fullscreen manager options and return values

Pass the native creation properties plus `window` and optionally `autoLoad: true` to request the first ad automatically after startup. Otherwise call `load()`. `autoReload: true` requests another ad after close only. Managers forward `onLoaded`, `onFailedToLoad`, `onOpened`, `onShowed`, `onClosed`, `onClicked`, `onImpression`, `onFailedToShow`, `onDestroyed` and, for rewarded, `onRewarded`.

`load()` and `retry()` report whether the manager accepted the call, not whether an ad arrived. `show()` reports whether presentation was attempted; native presentation may still fail and emit `onFailedToShow`. `isLoaded()` checks native readiness. These Boolean manager results differ from the raw proxy's `void` `load()` / `show()` methods.

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

Concurrent calls to `showPrivacyOptions()` share one native presentation and one promise. `openAdInspector()` does the same for Inspector. Terminal events and synchronous native exceptions clear the operation's listeners. A later call starts a new operation. `destroyAll()` releases placements only. It does not cancel an SDK form or its pending promise.

A banner failure or destruction cleans up the old proxy before invoking application callbacks, so calling `retry()` from those callbacks preserves the replacement. On iOS, adaptive placements reserve the native anchored height when width is known and wait for positive layout before loading. Destroying a placement removes any pending layout listener.
