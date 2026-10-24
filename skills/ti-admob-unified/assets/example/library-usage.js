'use strict'

/**
 * Usage of example/lib/ads.js after copying it to the consuming app's lib/.
 * This file is intentionally separate from app.js, which demonstrates the raw
 * module API. Pick one integration style; do not initialize both.
 */

const Admob = require('ti.admob.unified')
const ads = require('lib/ads') // Classic; Alloy app/lib/ads.js: require('ads')

const win = Ti.UI.createWindow({ layout: 'composite', backgroundColor: '#ffffff' })
const content = Ti.UI.createScrollView({ top: 0, left: 0, right: 0, bottom: 0 })
const bannerHost = Ti.UI.createView({ left: 0, right: 0, bottom: 0, height: 50 })

win.add(content)
win.add(bannerHost)

const banner = ads.createBanner({
  host: bannerHost,
  content,
  reservedHeight: 50,
  adUnitId: Admob.TEST_BANNER,
  adSize: Admob.BANNER
})

// Use this instead of createBanner() when the placement should adapt to width.
function createAdaptiveBanner() {
  banner.destroy()
  return ads.createAdaptiveBanner({
    host: bannerHost,
    content,
    reservedHeight: 50,
    adUnitId: Admob.TEST_ADAPTIVE_BANNER,
    adaptiveType: Admob.ADAPTIVE_ANCHORED
  })
}

const interstitial = ads.createInterstitial({
  window: win,
  adUnitId: Admob.TEST_INTERSTITIAL,
  onLoaded: () => Ti.API.info('[ads] Interstitial ready')
})

const rewarded = ads.createRewarded({
  window: win,
  adUnitId: Admob.TEST_REWARDED,
  onRewarded: event => grantReward(event.rewardAmount, event.rewardType)
})

const rewardedInterstitial = ads.createRewardedInterstitial({
  window: win,
  adUnitId: Admob.TEST_REWARDED_INTERSTITIAL,
  onRewarded: event => grantReward(event.rewardAmount, event.rewardType)
})

const appOpen = ads.createAppOpen({
  window: win,
  adUnitId: Admob.TEST_APP_OPEN,
  onLoaded: () => Ti.API.info('[ads] App-open ready for the next foreground')
})

function grantReward(amount, type) {
  Ti.API.info(`[ads] Grant ${amount} ${type}`)
}

function onNaturalBreak() {
  interstitial.show()
}

function onRewardAccepted() {
  rewarded.show()
}

// In production, rewardDescription must describe the reward configured for
// this placement. Only onRewarded above credits the actual SDK-earned reward.
function onRewardedTransition(rewardDescription) {
  if (!rewardedInterstitial.isLoaded()) return
  const intro = Ti.UI.createAlertDialog({
    title: 'Rewarded interstitial',
    message: `Complete the ad to earn ${rewardDescription}. You can skip it.`,
    buttonNames: ['Watch ad', 'Skip'], cancel: 1
  })
  function onChoice(event) {
    intro.removeEventListener('click', onChoice)
    if (event.index === 0) rewardedInterstitial.show()
  }
  intro.addEventListener('click', onChoice)
  intro.show()
}

function onApplicationResumed() {
  appOpen.show()
}

function openChildWindow() {
  const child = Ti.UI.createWindow({ backgroundColor: '#ffffff' })
  banner.pause()
  child.addEventListener('close', () => banner.resume())
  child.open()
}

win.addEventListener('close', event => {
  if (!event._closeFromActivityForcedToDestroy) ads.destroyAll()
})
win.open()

// Start in the active foreground. Enable requestTrackingAuthorization only for
// a real tracking use case with a localized NSUserTrackingUsageDescription.
// Keep it false when an AdMob UMP IDFA message already handles ATT.
Ti.API.info('Current ATT state: ' + JSON.stringify(Admob.getTrackingAuthorizationStatus()))
ads.start({
  consent: { tagForUnderAgeOfConsent: false },
  requestTrackingAuthorization: false,
  initialization: {}
}).then(result => {
  if (!result.initialized) {
    return
  }

  interstitial.load()
  rewarded.load()
  rewardedInterstitial.load()
  appOpen.load()
}).catch(error => {
  Ti.API.warn(`[ads] Startup failed: ${error.message || error}`)
})

// References kept here to make the intended call sites explicit in this
// compact example. Real apps connect them to their own navigation/lifecycle.
void createAdaptiveBanner
void onNaturalBreak
void onRewardAccepted
void onRewardedTransition
void onApplicationResumed
void openChildWindow
