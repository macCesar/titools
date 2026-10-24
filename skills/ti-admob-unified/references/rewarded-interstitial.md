> Source snapshot: official ti.admob.unified 1.0.0 documentation at release source commit `034843299b2984253988e0ffccb9f6a1c91682c9` (copied 2026-10-24). Relative links rebased for this skill.

# Rewarded interstitial ads

Rewarded interstitials offer a reward at a natural transition, such as the end of a level. Before showing one, your app must explain the reward and give the user a way to skip the ad. The native proxy does not create that introduction for you. See Google's requirements for [Android](https://developers.google.com/admob/android/rewarded-interstitial) and [iOS](https://developers.google.com/admob/ios/rewarded-interstitial).

Use `createRewarded()` for a placement the user explicitly chooses to open in exchange for a reward. Use `createRewardedInterstitial()` for a transition placement with its required introduction. An ordinary interstitial must not offer a reward.

## Load ahead of the transition

After UMP permits requests and initialization completes:

```js
const Admob = require('ti.admob.unified')
const ad = Admob.createRewardedInterstitial({
  adUnitId: Admob.TEST_REWARDED_INTERSTITIAL,
  autoReload: false,
  requestAgent: 'my Titanium app'
})

function onReward(event) {
  Ti.API.info(`Earned ${event.rewardAmount} ${event.rewardType}`)
  // Credit the reward here, using the values reported by the SDK.
}

function onLoaded() {
  Ti.API.info('Rewarded interstitial is ready for a later transition')
}

ad.addEventListener(Admob.AD_REWARDED, onReward)
ad.addEventListener(Admob.AD_LOADED, onLoaded)
ad.load()
```

Preloading does not present the ad. An explicit Show request may wait for loading and present when ready, provided the app cancels it when the presentation context ends.

## Explain the reward and allow skipping

The [playground](../assets/example/app.js) explains the demo reward and AdMob’s requirements in its card and links to the [official rule](https://support.google.com/admob/answer/9884467?hl=en). Show opens a dialog with Watch test ad and Skip. Skip cancels the pending presentation; Watch permits it. If a size change requires a replacement, the example waits and presents it without another Show tap. Leaving the foreground, losing eligibility, closing the window or selecting another fullscreen invalidates an outstanding introduction.

The production example below uses an AlertDialog with visible Watch and Skip buttons on both platforms. An iPad OptionDialog popover hides its cancel item, so it does not provide the same visible Skip button.

Use the reward configured for your ad unit in the introduction. The module reports the actual reward in `rewarded`; it does not expose a pre-presentation reward getter.

```js
function offerTransitionAd(rewardDescription, continueApp) {
  if (!Admob.canRequestAds() || !ad.isLoaded()) {
    continueApp()
    return
  }

  const intro = Ti.UI.createAlertDialog({
    title: 'Rewarded interstitial',
    message: `Complete the ad to earn ${rewardDescription}. You can skip it.`,
    buttonNames: ['Watch ad', 'Skip'],
    cancel: 1
  })

  function onChoice(event) {
    intro.removeEventListener('click', onChoice)
    if (event.index === 0 && Admob.canRequestAds() && ad.isLoaded()) {
      ad.show()
    } else {
      continueApp()
    }
  }

  intro.addEventListener('click', onChoice)
  intro.show()
}
```

Connect `closed` and `failed_to_show` to the app's continuation too, so a presentation error cannot strand navigation. Use a continuation that runs once. Coordinate the introduction with your window's lifetime and other modal flows. Raw API consumers must also recheck fullscreen dimensions if the app rotates while the introduction is open; the [integration library](library.md#fullscreen-ads) handles that check at `show()`.

## Shared lifecycle and rewards

The proxy exposes `load()`, `show()`, `isLoaded()` and terminal `destroy()` on both platforms. It accepts the same mutable properties as Rewarded: `adUnitId`, `autoReload`, `keywords`, `requestAgent` and `extras`. See [fullscreen configuration](fullscreen.md#creation-properties).

Events use `adType: 'rewarded_interstitial'` and the shared [fullscreen payloads](fullscreen.md#events). Only `rewarded` grants a reward; closing, clicking or recording an impression does not. A repeated native reward callback emits at most one reward per presentation. The event preserves the presented ad's unit ID and SDK reward even if the next ad starts loading before that callback arrives.

The native ad is single-use. Load again after dismissal, or use `autoReload: true` to reload after `closed`. That option never presents the next ad. Handle load/show failures at a later opportunity rather than creating an immediate retry loop.

## Use the integration library

`ads.createRewardedInterstitial(options)` returns the same manager as `ads.createRewarded(options)`, including `load()`, `show()`, `retry()`, `isLoaded()` and `destroy()`. Pass the same callbacks, including `onRewarded`. Call the manager's `show()` only after your introduction permits presentation.

The [raw demo](../assets/example/app.js) includes a skip option and uses Google test traffic. The [library example](../assets/example/library-usage.js) shows the equivalent manager integration.

## Cleanup and validation

Remove named listeners before disposal:

```js
ad.removeEventListener(Admob.AD_REWARDED, onReward)
ad.removeEventListener(Admob.AD_LOADED, onLoaded)
ad.destroy()
```

Destroy is idempotent and terminal. Late native callbacks cannot revive the proxy or grant another reward.

Native builds, wrapper tests and an iPadOS 18.6 simulator pass cover this implementation. The simulator pass verified visible Watch/Skip buttons, presentation, a single SDK reward, dismissal, reload and the Show-time orientation guard. Physical tests on an iPad (9th generation, iPadOS 27.0.1) and an OPPO CPH2639 (Android 16) confirmed visible test content, presentation, one SDK reward per completed ad, dismissal and reload. Android also verified that one Show tap after rotation replaces the stale ad and presents its replacement. The current playground introduces the reward in a dialog with visible Watch test ad and Skip buttons. See [release readiness](roadmap.md#release-readiness) for remaining coverage. Provider delivery requires its own mappings and single-source tests.
