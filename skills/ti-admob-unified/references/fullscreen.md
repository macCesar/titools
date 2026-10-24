> Source snapshot: official ti.admob.unified 1.0.0 documentation at release source commit `034843299b2984253988e0ffccb9f6a1c91682c9` (copied 2026-10-24). Relative links rebased for this skill.

# Fullscreen ads

Interstitial, rewarded, rewarded interstitial and app open proxies share one public lifecycle and event contract on iOS and Android.

## When to show a fullscreen ad

A fullscreen ad interrupts the current screen, so choose its presentation point before requesting it.

Load early, show later: `load()` is a network request and can take seconds. Start it before the intended break, for example when a level opens, an article starts or a form appears. Call `show()` when the application reaches that break. Do not present unconditionally from the `loaded` listener: that lets network timing determine when the user is interrupted. A screen may instead keep an explicit Show request pending during loading, provided it cancels that request when the user leaves or the app loses the foreground.

Show fullscreen ads at a natural break, such as between levels or after a task or flow ends. Avoid interrupting work in progress.

Google's guidance includes these restrictions:

- Do not show an interstitial as the app opens. That moment belongs to the App Open format, documented below.
- Do not show one on the way out, when the user is already leaving.
- Do not interrupt an action in progress, or place the ad where a button or a control the user was about to touch used to be.
- Use `createRewarded()` or the dedicated `createRewardedInterstitial()` format for rewards. Ordinary interstitials must not offer rewards.
- Avoid consecutive interstitials and excessive frequency. Configure the ad unit's frequency cap in the AdMob console; it is not a JavaScript setting.

See the full restrictions in Google's [Android interstitial guide](https://developers.google.com/admob/android/interstitial) and [iOS interstitial guide](https://developers.google.com/admob/ios/interstitial).

## Privacy gate

Fullscreen proxies do not call UMP and do not enforce ad eligibility:

```js
if (!Admob.canRequestAds()) {
  return
}
```

Create and load fullscreen ads only after `module_initialized` succeeds.

## Interstitial

Load the ad ahead of its presentation point:

```js
const interstitial = Admob.createInterstitial({
  adUnitId: Admob.TEST_INTERSTITIAL,
  autoReload: false
})

interstitial.addEventListener(Admob.AD_LOADED, () => {
  Ti.API.info('Interstitial is ready for the next break')
})

interstitial.addEventListener(Admob.AD_FAILED_TO_LOAD, event => {
  Ti.API.warn(`Interstitial failed: ${event.error} (${event.code})`)
})

interstitial.load()
```

Then present it when the application reaches the break it chose:

```js
function onLevelCompleted() {
  if (interstitial && interstitial.isLoaded()) {
    interstitial.show()
  }

  goToNextLevel()
}
```

If the ad is not ready, let the application continue and try at the next break.

The executable [example app](../assets/example/app.js) loads automatically after initialization. Each format has one button that reports its state and enables Show when ready. One Show or Retry tap is enough: if an ad needs loading or replacement after a size change, the example waits and presents when it arrives. The rewarded interstitial card explains the reward and AdMob’s introduction requirements, links to the official policy and opens a Watch test ad/Skip introduction after Show. Watch permits presentation; Skip cancels it. Watch also remains valid through a required size replacement, so loading does not require another Show tap. Closing an ad preloads another without presenting it. Leaving the foreground, closing the window, changing privacy eligibility or requesting a different fullscreen cancels the pending presentation.

## Rewarded

Reward the user only from the `rewarded` event:

```js
const rewarded = Admob.createRewarded({
  adUnitId: Admob.TEST_REWARDED,
  autoReload: false
})

rewarded.addEventListener(Admob.AD_REWARDED, event => {
  grantReward(event.rewardAmount, event.rewardType)
})

rewarded.addEventListener(Admob.AD_FAILED_TO_SHOW, event => {
  Ti.API.warn(`Rewarded ad could not show: ${event.error}`)
})

rewarded.load()
```

Present it only after the user accepts a clear reward offer, using `isLoaded()` before `show()`. Closing a rewarded ad is not proof that the reward was earned. Keep the reward handler alive until the SDK delivers the result; mediated callback ordering may differ. Version `1.0.0` exposes client-side rewards only; it has no server-side verification configuration.

The application must coordinate fullscreen proxies so only one presentation is active at a time. Keep it separate from UMP, ATT and Ad Inspector.

## Rewarded interstitial

`createRewardedInterstitial()` shares Rewarded's configuration, methods and reward event. Before presentation, explain the reward and offer a way to skip. The proxy does not show that introduction itself. See [Rewarded interstitial ads](rewarded-interstitial.md) for the complete flow.

## App open

Use an app open ad when the application enters the foreground, either at a cold start or when returning from the background. Load it beforehand and present it during the application's own loading state, before the user starts using the next screen:

```js
const appOpen = Admob.createAppOpen({
  adUnitId: Admob.TEST_APP_OPEN,
  autoReload: false
})

appOpen.addEventListener(Admob.AD_LOADED, () => {
  Ti.API.info('App open ad is ready for the next foreground')
})

appOpen.load()
```

```js
function onForegroundLoadingScreen() {
  if (appOpen.isLoaded()) {
    appOpen.show()
  } else {
    appOpen.load()
  }
}
```

Call this only while your loading screen is visible and no consent form, other fullscreen ad or external flow is active. Do not wire an unconditional show to every activity resume: closing an ad or returning from its click can also resume the host. If loading finishes before the ad is ready, continue into the app and save the ad for a later opportunity. Remove any application lifecycle listener when its owner is disposed.

### The four hour window

Google documents a four-hour validity window and its sample checks the time since the ad loaded. Both module proxies record successful load completion and check that age, with no timer and no extra event. See Google's [Android](https://developers.google.com/admob/android/app-open#consider_ad_expiration) and [iOS](https://developers.google.com/admob/ios/app-open) guides:

- The load time is recorded when the ad arrives.
- `isLoaded()` returns `false` once four hours have passed.
- `show()` on an expired ad clears the native reference and emits `failed_to_show` with code `1` and the message `App open ad expired after four hours`.
- `load()` discards an expired ad before requesting a new one, so a reload after expiry is not swallowed by the duplicate-load guard.

`autoReload` reloads only after `closed`. The application decides when to replace an expired ad. Expiry checks subtract the stored time when called; they do not poll in the background.

## Creation properties

All four factories accept:

| Property       | Type     | Default | Notes                                                              |
| -------------- | -------- | ------- | ------------------------------------------------------------------ |
| `adUnitId`     | String   | `""`    | Required before `load()`.                                          |
| `autoReload`   | Boolean  | `false` | Loads a fresh ad after a successful close, and after nothing else. |
| `keywords`     | String[] | None    | Request keywords, applied as targeting on both platforms.          |
| `requestAgent` | String   | None    | Identifies what issued the request, on both platforms.             |
| `extras`       | Object   | None    | Forwarded through Google ad-network extras on both platforms.      |

Do not use `extras` to bypass UMP or synthesize personalization state.

Both platforms preserve primitive values in `extras`. Use the types required by the receiving adapter; for example, pass `{ npa: '1' }` when it expects a string.

Pass initial configuration to the factory. Later assignments to `adUnitId`, `keywords`, `requestAgent` and `extras` affect the next request on both platforms; an already loaded ad keeps its original request configuration. `autoReload` is a live close policy: both native ports read its current value when the shown ad closes, so changing it while an ad is loaded or presented changes whether that close starts another load. It does not present another ad or retry a load/show failure.

## Shared methods

| Method       | Description                                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| `load()`     | Starts one request. Calls while loading, loaded, or showing are ignored. App open discards an expired ad first. |
| `show()`     | Presents the loaded ad or emits `failed_to_show`.                                                               |
| `isLoaded()` | Returns `true` only while an unused ad is ready. For app open, an ad older than four hours is not ready.        |
| `destroy()`  | Terminal, idempotent cleanup; emits `destroyed` once.                                                           |

Google fullscreen ads are single-use. Once presentation starts, `isLoaded()` is `false`. Native dismissal or presentation-failure callbacks discard the consumed reference. A local precondition failure, such as a missing host before presentation, can retain the unused ad; recheck readiness after correcting the condition. Call `load()` again before the next `show()`.

Late native callbacks are ignored after `destroy()`. A dismissed or failed-to-show ad reference is cleared before the terminal event is emitted.

On both platforms, `load()` after `destroy()` logs a warning without emitting an event. Banners emit `failed_to_load` in this case, so a handler must account for the proxy type.

On Android, `load()` and `show()` need a current activity, and without one they emit `failed_to_load` or `failed_to_show` with the message `No current activity available` and code `-1`. It happens when the application calls in with no activity in the foreground. Code `-1` is the module's own, outside Google's error-code range.

## Keeping the next ad ready

For repeated presentations in one session, load the next ad after the previous one closes so it can be ready at the next break:

```js
interstitial.addEventListener(Admob.AD_CLOSED, () => {
  interstitial.load()
})
```

`autoReload: true` reloads after `closed` only. The application handles retries after `failed_to_load` and `failed_to_show`. Use backoff: a `NO_FILL` response will often still be `NO_FILL` a second later.

Reuse the proxy across loads. Create a new one only after `destroy()`.

## Events

### Common events

| Event                       | Interstitial | Rewarded | App open | Rewarded interstitial | Common payload                                     |
| --------------------------- | -----------: | -------: | -------: | -------: | -------------------------------------------------- |
| `loaded`                    |          Yes |      Yes |      Yes | Yes | `adUnitId`, `adType`                               |
| `failed_to_load`            |          Yes |      Yes |      Yes | Yes | `adUnitId`, `adType`, `error`, `message`, `code`   |
| `opened`                    |          Yes |      Yes |      Yes | Yes | `adUnitId`, `adType`                               |
| `showed_fullscreen_content` |          Yes |      Yes |      Yes | Yes | `adUnitId`, `adType`                               |
| `closed`                    |          Yes |      Yes |      Yes | Yes | `adUnitId`, `adType`                               |
| `clicked`                   |          Yes |      Yes |      Yes | Yes | `adUnitId`, `adType`                               |
| `impression`                |          Yes |      Yes |      Yes | Yes | `adUnitId`, `adType`                               |
| `failed_to_show`            |          Yes |      Yes |      Yes | Yes | `adUnitId`, `adType`, `error`, `message`, `code`   |
| `destroyed`                 |          Yes |      Yes |      Yes | Yes | `adUnitId`, `adType`                               |
| `rewarded`                  |           No |      Yes |       No | Yes | `adUnitId`, `adType`, `rewardType`, `rewardAmount` |

`message` duplicates `error` for compatibility. New code may use `error`; both keys are portable.

## iPad collapsed-SVG workaround

With the pinned GMA iOS 13.11.0 SDK, an Interstitial image creative can contain an SVG whose automatic width collapses in WebKit on iPad. The wrapper checks the presented Google WebView during a bounded first-second window. It repairs only `svg.advertiser-provided-image` with zero width, positive height, a valid SVG viewBox, a Google `simgad` background image and a column-flex parent. The parent receives the viewBox aspect ratio; visible images, intentionally hidden content and other layouts remain unchanged. Pending attempts stop on dismissal, presentation failure or destruction.

The check applies to Interstitials on iPad with both demo and publisher-owned unit IDs. It uses internal creative markup and is not an official Google SDK setting. Other templates, nested content or later layout failures may remain outside its scope. Rewarded and Rewarded Interstitial are not modified. Device tests established the original repair with Google's demo creative; extending eligibility to publisher IDs does not certify every production creative. Validate your units with [test devices enabled](https://developers.google.com/admob/ios/test-ads).

## Cleanup

Use named callbacks and remove them before disposing the proxy:

```js
function disposeInterstitial() {
  interstitial.removeEventListener(Admob.AD_LOADED, onLoaded)
  interstitial.removeEventListener(Admob.AD_FAILED_TO_LOAD, onFailed)
  interstitial.removeEventListener(Admob.AD_CLOSED, onClosed)
  interstitial.destroy()
}
```

Create a new proxy after disposal; a destroyed proxy cannot load again.

## Not implemented

The module exports format-name and test-ID constants for future compatibility, but it does not expose working factories for:

- Native

`TEST_NATIVE` names a unit no factory accepts.
