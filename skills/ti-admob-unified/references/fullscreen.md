> Source snapshot: official ti.admob.unified 1.0.0 documentation at commit `5b4cbf9` (copied 2026-10-11). Relative links rebased for this skill.

# Fullscreen ads

Interstitial, rewarded and app open proxies share one public lifecycle and event contract on iOS and Android.

## When to show a fullscreen ad

A fullscreen ad interrupts the current screen, so choose its presentation point before requesting it.

Load early, show later: `load()` is a network request and can take seconds. Start it before the intended break, for example when a level opens, an article starts or a form appears. Call `show()` when the application reaches that break. Presenting inside the `loaded` listener lets network timing determine when the user is interrupted.

Show fullscreen ads at a natural break, such as between levels or after a task or flow ends. Avoid interrupting work in progress.

Google's guidance includes these restrictions:

- Do not show an interstitial as the app opens. That moment belongs to the App Open format, documented below.
- Do not show one on the way out, when the user is already leaving.
- Do not interrupt an action in progress, or place the ad where a button or a control the user was about to touch used to be.
- Use `createRewarded()` to reward users for watching ads. Interstitials must not offer rewards.
- Avoid consecutive interstitials and excessive frequency. Configure frequency capping on the ad unit in the AdMob console; JavaScript does not control it.

The full lists are in Google's [Android interstitial guide](https://developers.google.com/admob/android/interstitial) and [iOS interstitial guide](https://developers.google.com/admob/ios/interstitial).

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

The executable [example app](../assets/example/app.js) loads automatically after initialization. Each format has one button that reports its state and enables Show when ready.

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

Closing a rewarded ad is not proof that the reward was earned.

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
function onApplicationResumed() {
  if (appOpen && appOpen.isLoaded()) {
    appOpen.show()
  }
}
```

### The four hour window

Google documents that an app open ad expires four hours after it was requested. An ad rendered later is no longer valid and may not earn revenue, so the proxy enforces the window itself, with no timer and no extra event:

- The load time is recorded when the ad arrives.
- `isLoaded()` returns `false` once four hours have passed.
- `show()` on an expired ad clears the native reference and emits `failed_to_show` with code `1` and the message `App open ad expired after four hours`.
- `load()` discards an expired ad before requesting a new one, so a reload after expiry is not swallowed by the duplicate-load guard.

`autoReload` reloads only after `closed`. The application decides when to replace an expired ad. Expiry checks subtract the stored time when called; they do not poll in the background.

## Creation properties

All three factories accept:

| Property       | Type     | Default | Notes                                                              |
| -------------- | -------- | ------- | ------------------------------------------------------------------ |
| `adUnitId`     | String   | `""`    | Required before `load()`.                                          |
| `autoReload`   | Boolean  | `false` | Loads a fresh ad after a successful close, and after nothing else. |
| `keywords`     | String[] | None    | Request keywords, applied as targeting on both platforms.          |
| `requestAgent` | String   | None    | Identifies what issued the request, on both platforms.             |
| `extras`       | Object   | None    | Forwarded through Google ad-network extras on both platforms.      |

Do not use `extras` to bypass UMP or synthesize personalization state.

Both platforms preserve primitive values in `extras`. Use the types required by the receiving adapter; for example, pass `{ npa: '1' }` when it expects a string.

Pass initial configuration to the factory. Later assignments to the five configuration properties affect the next request on both platforms. An already loaded ad keeps the configuration of its original request.

## Shared methods

| Method       | Description                                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| `load()`     | Starts one request. Calls while loading, loaded, or showing are ignored. App open discards an expired ad first. |
| `show()`     | Presents the loaded ad or emits `failed_to_show`.                                                               |
| `isLoaded()` | Returns `true` only while an unused ad is ready. For app open, an ad older than four hours is not ready.        |
| `destroy()`  | Terminal, idempotent cleanup; emits `destroyed` once.                                                           |

Google fullscreen ads are single-use. After a presentation or a show failure the proxy holds no ad: its native reference is cleared and `isLoaded()` turns `false`. Call `load()` again before the next `show()`.

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

| Event                       | Interstitial | Rewarded | App open | Common payload                                     |
| --------------------------- | -----------: | -------: | -------: | -------------------------------------------------- |
| `loaded`                    |          Yes |      Yes |      Yes | `adUnitId`, `adType`                               |
| `failed_to_load`            |          Yes |      Yes |      Yes | `adUnitId`, `adType`, `error`, `message`, `code`   |
| `opened`                    |          Yes |      Yes |      Yes | `adUnitId`, `adType`                               |
| `showed_fullscreen_content` |          Yes |      Yes |      Yes | `adUnitId`, `adType`                               |
| `closed`                    |          Yes |      Yes |      Yes | `adUnitId`, `adType`                               |
| `clicked`                   |          Yes |      Yes |      Yes | `adUnitId`, `adType`                               |
| `impression`                |          Yes |      Yes |      Yes | `adUnitId`, `adType`                               |
| `failed_to_show`            |          Yes |      Yes |      Yes | `adUnitId`, `adType`, `error`, `message`, `code`   |
| `destroyed`                 |          Yes |      Yes |      Yes | `adUnitId`, `adType`                               |
| `rewarded`                  |           No |      Yes |       No | `adUnitId`, `adType`, `rewardType`, `rewardAmount` |

`message` duplicates `error` for compatibility. New code may use `error`; both keys are portable.

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

- Rewarded interstitial
- Native

`TEST_REWARDED_INTERSTITIAL` and `TEST_NATIVE` name units no factory accepts.
