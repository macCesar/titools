/**
 * ti.admob.unified example
 *
 * This app uses only Google's official demo ad unit IDs. It demonstrates:
 * - UMP -> ATT (iOS) -> canRequestAds -> initialization
 * - every ad format the module exposes, one button each
 * - a banner host that reserves its own space
 * - explicit listener and proxy cleanup
 *
 * Fullscreen ads preload after privacy and initialization, then reload on close.
 * Showing an ad always requires an explicit tap. The adaptive banner starts automatically.
 * The native layout adapts to the available window width, including split view.
 *
 * It intentionally contains no production ad unit IDs, mediation, or manual
 * banner refresh timers.
 */

const Admob = require('ti.admob.unified')
const { createFullscreenSizeGuard } = require('lib/ads')

// Demo-only settings. No personal test-device identifiers ship in this file.
const consentTestingEnabled = Ti.App.deployType !== 'production'
const consentModes = {
  normal: { label: 'Normal', geography: null },
  eea: { label: 'EEA', geography: Admob.DEBUG_GEOGRAPHY_EEA },
  us: { label: 'Regulated US state', geography: Admob.DEBUG_GEOGRAPHY_REGULATED_US_STATE },
  other: { label: 'Other', geography: Admob.DEBUG_GEOGRAPHY_OTHER }
}
let consentMode = consentTestingEnabled ? Ti.App.Properties.getString('demo.consentMode', 'normal') : 'normal'
if (!consentModes[consentMode]) consentMode = 'normal'
let consentBusy = false
let adsStoppedForConsent = false
let consentDeviceInput
let consentDemoFeedback
const consentTestButtons = []
let openUSOptionsAfterRequest = false
let preserveConsentBannerSlot = false

let initializationStarted = false
let initializationComplete = false
let trackingRequestStarted = false
let appActive = true
let trackingPending = false
let windowClosed = false
let banner = null
let activeBannerButton = null
let interstitial = null
let rewarded = null
let rewardedInterstitial = null
let appOpen = null

// Native semantic color names keep existing views in sync with the system theme.
// Copy semantic.colors.json beside app.js in a classic app's Resources directory.
const colors = {
  canvas: 'playgroundCanvas', surface: 'playgroundSurface', ink: 'playgroundInk', muted: 'playgroundMuted',
  accent: 'playgroundAccent', pressed: 'playgroundPressed', tint: 'playgroundTint', line: 'playgroundLine',
  quiet: 'playgroundQuiet', error: 'playgroundError'
}
const isAndroid = Ti.Platform.osname === 'android'
const win = Ti.UI.createWindow({
  backgroundColor: colors.canvas,
  title: 'AdMob Playground',
  barColor: colors.canvas,
  titleAttributes: { color: colors.ink },
  layout: 'vertical',
  extendSafeArea: false
})

// Native vertical layout reserves the HUD's measured height above the viewport.
const viewport = Ti.UI.createView({
  width: Ti.UI.FILL, height: Ti.UI.FILL, layout: 'composite'
})

const content = Ti.UI.createScrollView({
  top: 0, left: 0, right: 0, bottom: 0,
  layout: 'vertical', contentHeight: Ti.UI.SIZE,
  scrollType: 'vertical', showVerticalScrollIndicator: true
})
const page = Ti.UI.createView({
  width: Ti.UI.FILL, height: Ti.UI.SIZE, layout: 'vertical', bottom: '32dp'
})
content.add(page)

const bannerHost = Ti.UI.createView({
  left: 0, right: 0, bottom: 0, height: 0, backgroundColor: colors.surface
})

const masthead = Ti.UI.createView({
  top: '24dp', left: '24dp', right: '24dp', height: Ti.UI.SIZE, layout: 'vertical'
})
masthead.add(Ti.UI.createLabel({
  text: 'TITANIUM / ADMOB', left: 0, height: Ti.UI.SIZE,
  color: colors.accent, font: { fontSize: '12dp', fontWeight: 'bold' }
}))
masthead.add(Ti.UI.createLabel({
  text: 'Ad playground.', top: '8dp', left: 0, right: 0, height: Ti.UI.SIZE,
  color: colors.ink, font: { fontSize: '36dp', fontWeight: 'bold' }
}))
masthead.add(Ti.UI.createLabel({
  text: 'Explore the formats. See the experience.',
  top: '8dp', left: 0, right: 0, height: Ti.UI.SIZE,
  color: colors.muted, font: { fontSize: '16dp' }
}))
page.add(masthead)

const session = Ti.UI.createView({
  top: '12dp', bottom: '12dp', left: '24dp', right: '24dp', height: Ti.UI.SIZE,
  layout: 'vertical', backgroundColor: colors.tint, borderRadius: '12dp'
})
const sessionLabel = Ti.UI.createLabel({
  text: 'SETUP / PRIVACY', top: '16dp', left: '16dp', right: '16dp',
  height: Ti.UI.SIZE, color: colors.accent,
  font: { fontSize: '12dp', fontWeight: 'bold' }
})
const statusLabel = Ti.UI.createLabel({
  text: 'Requesting privacy information…',
  top: '8dp', left: '16dp', right: '16dp', bottom: '16dp',
  height: Ti.UI.SIZE, verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP, color: colors.ink,
  font: { fontSize: '16dp', fontWeight: 'semibold' }
})
session.add(sessionLabel)
session.add(statusLabel)

const activity = Ti.UI.createLabel({
  text: 'Session events will appear here.', left: '16dp', right: '16dp',
  top: '16dp', bottom: '16dp', height: Ti.UI.SIZE,
  color: colors.muted, font: { fontSize: '12dp', fontFamily: isAndroid ? 'monospace' : 'Menlo' }
})
const events = []
function setStatus(message) {
  statusLabel.text = message
  const now = new Date()
  const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map(value => String(value).padStart(2, '0')).join(':')
  events.push(`${time}  ${message}`)
  if (events.length > 8) events.shift()
  activity.text = events.join('\n\n')
  Ti.API.info(`[ti.admob.unified example] ${message}`)
}

function setBannerHeight(value) {
  const height = Math.max(0, Number(value) || 0)
  const dimension = `${height}dp`
  if (bannerHost.height !== dimension) bannerHost.height = dimension
  if (content.bottom !== dimension) content.bottom = dimension
}

let currentSection
const formatCards = []
const fullscreenButtons = []
function cancelPendingFullscreenShows() {
  fullscreenButtons.forEach(button => button.cancelPendingShow())
}
function createSection(title, description, grid) {
  page.add(Ti.UI.createLabel({
    text: title, top: '32dp', left: '24dp', right: '24dp', height: Ti.UI.SIZE,
    color: colors.ink, font: { fontSize: '24dp', fontWeight: 'bold' }
  }))
  page.add(Ti.UI.createLabel({
    text: description, top: '6dp', left: '24dp', right: '24dp', height: Ti.UI.SIZE,
    color: colors.muted, font: { fontSize: '14dp' }
  }))
  currentSection = Ti.UI.createView({
    left: '16dp', right: '16dp', height: Ti.UI.SIZE,
    layout: grid ? 'horizontal' : 'vertical', horizontalWrap: true
  })
  page.add(currentSection)
}

// Fullscreen controls only present ready ads; loading starts automatically.
// Banner controls select the placement in the single shared slot.
function createAdButton(title, handlers) {
  const isFormat = Boolean(handlers.description)
  const fullscreen = Boolean(handlers.onShow)
  const idleTitle = fullscreen ? `Show ${title.toLowerCase()}` : isFormat ? `Use ${title.toLowerCase()}` : title
  const card = isFormat ? Ti.UI.createView({
    left: '8dp', right: '8dp', top: '16dp', width: '280dp',
    height: Ti.UI.SIZE, layout: 'vertical', backgroundColor: colors.surface,
    borderRadius: '12dp', borderColor: colors.line, borderWidth: 1
  }) : null
  if (card) {
    card.add(Ti.UI.createLabel({
      text: title, top: '20dp', left: '20dp', right: '20dp', height: Ti.UI.SIZE,
      color: colors.ink, font: { fontSize: '20dp', fontWeight: 'bold' }
    }))
    card.add(Ti.UI.createLabel({
      text: handlers.description, top: '8dp', left: '20dp', right: '20dp',
      height: Ti.UI.SIZE, color: colors.muted, font: { fontSize: '14dp' }
    }))
    currentSection.add(card)
    formatCards.push(card)
  }
  const button = Ti.UI.createButton({
    title: isFormat ? 'Waiting for initialization…' : idleTitle,
    enabled: !isFormat,
    top: isFormat ? '12dp' : '8dp', left: isFormat ? '20dp' : '8dp',
    right: isFormat ? '20dp' : '8dp', bottom: isFormat ? '20dp' : 0,
    height: '48dp', color: colors.accent, backgroundColor: colors.tint,
    backgroundSelectedColor: colors.line, borderRadius: '8dp',
    font: { fontSize: '14dp', fontWeight: 'semibold' },
    accessibilityHint: handlers.description || ''
  })
  let state = 'idle'
  let pendingShow = false
  let introPending = false
  let introAccepted = false
  let showIntent = 0
  const sizeGuard = fullscreen ? createFullscreenSizeGuard(() => win) : null
  button.creating = function () {
    state = 'creating'
    button.applyProperties({ title: 'Loading…', backgroundColor: colors.quiet, color: colors.muted, enabled: false })
  }
  button.ready = function () {
    state = 'ready'
    button.applyProperties({
      title: `Show ${title.toLowerCase()}`, backgroundColor: colors.accent,
      backgroundSelectedColor: colors.pressed, color: colors.surface, enabled: true
    })
    if (pendingShow) presentRequestedAd()
  }
  button.cancelPendingShow = function () {
    pendingShow = false
    introPending = false
    introAccepted = false
    showIntent += 1
  }
  button.reset = function () {
    button.cancelPendingShow()
    state = 'idle'
    button.applyProperties({
      title: isFormat && consentBusy ? 'Waiting for consent…'
        : isFormat && !initializationComplete ? 'Waiting for initialization…'
          : fullscreen ? 'Waiting to load…' : idleTitle,
      backgroundColor: colors.tint, backgroundSelectedColor: colors.line,
      color: colors.accent, enabled: !fullscreen && (!isFormat || (initializationComplete && !consentBusy && Admob.canRequestAds()))
    })
  }
  button.failed = function () {
    button.reset()
    state = 'failed'
    button.applyProperties({ title: `Retry ${title.toLowerCase()}`, enabled: true })
  }
  button.loaded = function () {
    state = 'loaded'
    button.applyProperties({
      title: `Reload ${title.toLowerCase()}`, backgroundColor: colors.tint,
      backgroundSelectedColor: colors.line, color: colors.accent, enabled: true
    })
  }
  button.load = function () {
    if (windowClosed || consentBusy || state === 'creating' || state === 'showing') return
    if (!handlers.privacy && (!initializationComplete || !Admob.canRequestAds())) {
      setStatus(`${title} blocked until privacy and initialization complete`)
      return
    }
    button.creating()
    if (sizeGuard) sizeGuard.recordLoad()
    handlers.onLoad(button)
  }
  function presentRequestedAd() {
    if (!pendingShow || state !== 'ready') return
    if (windowClosed || consentBusy || !appActive || !Admob.canRequestAds()) {
      button.cancelPendingShow()
      return
    }
    if (handlers.beforeShow && !introAccepted) {
      if (introPending) return
      introPending = true
      const intent = showIntent
      handlers.beforeShow(accepted => {
        if (intent !== showIntent || !pendingShow) return
        introPending = false
        if (!accepted) { button.cancelPendingShow(); return }
        introAccepted = true
        presentRequestedAd()
      })
      return
    }
    sizeGuard.show(() => {
      pendingShow = false
      state = 'showing'
      button.applyProperties({ title: 'Showing…', enabled: false, backgroundColor: colors.quiet, color: colors.muted })
      handlers.onShow(button)
    }, () => button.load())
  }
  button.addEventListener('click', () => {
    if (consentBusy || state === 'creating' || state === 'showing' || introPending) return
    if (fullscreen) {
      if (windowClosed || !appActive || !Admob.canRequestAds()) {
        setStatus(`${title} blocked by privacy or foreground state`)
        return
      }
      cancelPendingFullscreenShows()
      pendingShow = true
      if (state === 'ready') presentRequestedAd()
      else button.load()
      return
    }
    button.load()
  })
  if (fullscreen) fullscreenButtons.push(button)
  const parent = card || currentSection
  parent.add(button)
  if (handlers.policyUrl) {
    const policy = Ti.UI.createButton({
      title: 'AdMob rewarded interstitial requirements',
      top: '8dp', left: '20dp', right: '20dp', bottom: '8dp',
      height: Ti.UI.SIZE, color: colors.accent, font: { fontSize: '14dp' }
    })
    policy.addEventListener('click', () => Ti.Platform.openURL(handlers.policyUrl))
    parent.add(policy)
  }
  return button
}

// Classic Titanium has no TSS breakpoints. Measure the available viewport,
// not the physical display, so rotation and iPad split view use the same layout.
let previousWidth = 0
function layoutPage() {
  const width = Ti.UI.convertUnits(content.size.width, Ti.UI.UNIT_DIP)
  if (!width || width === previousWidth) return
  previousWidth = width
  const pageWidth = Math.min(width, 960)
  page.width = `${pageWidth}dp`
  const columns = pageWidth >= 700 ? 2 : 1
  const cardWidth = Math.floor((pageWidth - 32) / columns) - 16
  formatCards.forEach(card => { card.width = `${cardWidth}dp` })
}
content.addEventListener('postlayout', layoutPage)

function initializeAdsOnce() {
  if (
    windowClosed ||
    initializationStarted ||
    !Admob.canRequestAds()
  ) {
    return
  }

  initializationStarted = true
  setStatus('Initializing Google Mobile Ads…')

  Admob.initialize({
    ageRestrictedTreatment: Admob.AGE_RESTRICTED_TREATMENT_UNSPECIFIED,
    maxAdContentRating: Admob.MAX_AD_CONTENT_RATING_GENERAL
  })
}

function onModuleInitialized(event) {
  if (windowClosed || initializationComplete) return
  if (!event.success) {
    setStatus(`Initialization failed: ${event.error}`)
    return
  }

  Ti.API.info('Google adapter initialization: ' + JSON.stringify(Admob.getMediationStatus()))
  initializationComplete = true
  updateConsentTools()
  sessionLabel.text = 'TEST ADS / SDK READY'
  loadExampleAds()
}

function loadExampleAds() {
  setStatus('Preparing ads automatically…')
  interstitialButton.load()
  rewardedButton.load()
  appOpenButton.load()
  adaptiveButton.load()
  rewardedInterstitialButton.load()
  adsStoppedForConsent = false
  preserveConsentBannerSlot = false
}

function onTrackingAuthorizationCompleted(event) {
  trackingRequestStarted = false
  Admob.removeEventListener(
    'tracking_authorization_completed',
    onTrackingAuthorizationCompleted
  )
  Ti.API.info(`ATT status: ${event.status}`)
  Ti.API.info('Current ATT state: ' + JSON.stringify(Admob.getTrackingAuthorizationStatus()))
  initializeAdsOnce()
  updateConsentTools()
}

function requestExampleTracking() {
  if (windowClosed || trackingRequestStarted || (Ti.Platform.osname !== 'android' && !appActive)) return
  trackingRequestStarted = true
  Admob.addEventListener('tracking_authorization_completed', onTrackingAuthorizationCompleted)
  updateConsentTools()
  Admob.requestTrackingAuthorization()
}

let trackingQueryCount = 0
function updateTrackingStatus(manual = false) {
  if (manual) trackingQueryCount += 1
  const tracking = Admob.getTrackingAuthorizationStatus()
  const names = ['Not determined', 'Restricted', 'Denied', 'Authorized']
  trackingStatusLabel.text = tracking.applicable
    ? `ATT status: ${names[tracking.status] || 'Unknown'} (${tracking.status}). Authorized: ${tracking.authorized}. Applicable: true.`
    : 'ATT status: not applicable on Android (3). Authorized: true is a portable convention, not general tracking permission.'
  trackingStatusLabel.text += `\nLast checked: ${new Date().toLocaleTimeString()}. Manual checks: ${trackingQueryCount}.`
  if (tracking.applicable && tracking.status !== 0) {
    trackingStatusLabel.text += '\nPermission already resolved. Change it in iOS Settings.'
  }
  trackingQueryButton.enabled = !windowClosed && !consentBusy && !trackingRequestStarted
  trackingPermissionButton.enabled = !windowClosed && appActive && !consentBusy && !trackingRequestStarted
    && !(initializationStarted && !initializationComplete) && tracking.applicable && tracking.status === 0
  trackingPermissionButton.applyProperties({
    backgroundColor: trackingPermissionButton.enabled ? colors.tint : colors.quiet,
    color: trackingPermissionButton.enabled ? colors.accent : colors.muted
  })
  return tracking
}

function continueAfterPrivacyGate(canRequestAds) {
  if (!canRequestAds || initializationStarted || windowClosed) {
    return
  }

  if (trackingRequestStarted) {
    return
  }

  if (Ti.Platform.osname !== 'android' && !appActive) {
    trackingPending = true
    return
  }
  trackingPending = false
  requestExampleTracking()
}

function onApplicationPause() {
  appActive = false
  cancelPendingFullscreenShows()
  updateTrackingStatus()
}
function onApplicationResumed() {
  appActive = true
  if (trackingPending) continueAfterPrivacyGate(Admob.canRequestAds())
  updateTrackingStatus()
}

// Reopening is separate from initial consent; unknown/error is not NOT_REQUIRED.
function setPrivacyOptionsAvailable(available, error) {
  const required = available === true || available === 1
  privacyNote.text = error ? 'Privacy update failed. See Session activity for details.'
    : available === false || available === 0 ? 'No privacy form is required for this session.'
      : 'Checking whether privacy options are required…'
  privacyButton.applyProperties({
    visible: required, touchEnabled: required,
    height: '48dp', top: '8dp'
  })
  privacyNote.applyProperties({
    visible: !required, height: '48dp', top: '8dp'
  })
}

function updateConsentTools() {
  const busy = consentBusy || trackingRequestStarted || (initializationStarted && !initializationComplete)
  consentTestButtons.forEach(button => {
    button.enabled = !busy
    button.title = busy ? 'Run test — please wait…' : 'Run test'
  })
  updateTrackingStatus()
}

function stopAdsForConsent() {
  preserveConsentBannerSlot = true
  destroyBanner()
  destroyInterstitial()
  destroyRewarded()
  destroyRewardedInterstitial()
  destroyAppOpen()
  interstitialButton.reset()
  rewardedButton.reset()
  rewardedInterstitialButton.reset()
  appOpenButton.reset()
  adsStoppedForConsent = true
}

function requestExampleConsent(mode, reset = false) {
  if (windowClosed || consentBusy || trackingRequestStarted || (initializationStarted && !initializationComplete)) return
  if (!consentTestingEnabled && (reset || mode !== 'normal')) return
  let deviceIds = []
  if (consentTestingEnabled) {
    const value = consentDeviceInput.value.trim()
    deviceIds = value.split(/[\s,]+/).filter(Boolean)
    const deviceIdPattern = isAndroid ? /^[a-f0-9]{32}$/i : /^(?:[a-f0-9]{32}|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$/i
    if (mode !== 'normal' && deviceIds.some(id => !deviceIdPattern.test(id))) {
      consentDemoFeedback.text = 'Paste the UMP test-device identifier exactly as logged by the SDK, including any hyphens. Separate devices with commas.'
      setStatus(consentDemoFeedback.text)
      return
    }
    if (mode !== 'normal' && isAndroid && !deviceIds.length) {
      consentDemoFeedback.text = 'Paste this phone’s UMP test-device hash above, then tap Run test. Enter alone does not start the test.'
      setStatus(consentDemoFeedback.text)
      return
    }
    consentDeviceInput.blur()
    Ti.App.Properties.setString('demo.consentDeviceIds', value)
    Ti.App.Properties.setString('demo.consentMode', mode)
  }
  if (consentDemoFeedback) consentDemoFeedback.text = `Requesting ${consentModes[mode].label}… Please wait for Google’s response.`
  consentMode = mode
  openUSOptionsAfterRequest = reset && mode === 'us'
  consentBusy = true
  if (reset) {
    stopAdsForConsent()
    Admob.resetConsent()
  }
  setPrivacyOptionsAvailable(undefined)
  updateConsentTools()
  setStatus(`Requesting consent — ${consentModes[mode].label}${reset ? ' (test consent reset)' : ''}`)
  const config = mode === 'normal' ? {} : { geography: consentModes[mode].geography, testDeviceIds: deviceIds }
  Admob.requestConsent(config)
}

function finishExampleConsent(event, source) {
  const requiresOptions = event.privacyOptionsRequired === true || event.privacyOptionsRequired === 1
  if (openUSOptionsAfterRequest && source === 'Consent completed') {
    openUSOptionsAfterRequest = false
    if (event.success && requiresOptions) {
      if (consentDemoFeedback) consentDemoFeedback.text = 'Opening the US privacy form… Choose your preference, then save and close.'
      setPrivacyOptionsAvailable(event.privacyOptionsRequired)
      Admob.presentPrivacyOptions({})
      return
    }
  }
  consentBusy = false
  if (consentDemoFeedback) {
    const result = !event.success ? 'Request failed. See Session activity; tap Run test to retry.'
      : source === 'Privacy options closed' ? 'Privacy form closed. Your choice has been processed.'
        : requiresOptions ? 'Completed. Review your choice in Advertising privacy options.'
          : consentMode === 'normal' ? 'Actual region restored. Google reports no privacy form is needed.'
            : 'Completed. No privacy form is required.'
    consentDemoFeedback.text = `${consentModes[consentMode].label}: ${result}` + (event.canRequestAds ? ' Ads may load.' : ' Ads remain stopped.')
  }
  if (!event.canRequestAds) {
    preserveConsentBannerSlot = false
    setBannerHeight(0)
  }
  setPrivacyOptionsAvailable(event.privacyOptionsRequired, event.success ? null : event.error || 'Unknown error')
  setStatus(`${source}: success=${event.success}; canRequestAds=${event.canRequestAds}; privacyOptionsRequired=${event.privacyOptionsRequired}${event.error ? `; error=${event.error}` : ''}`)
  if (event.canRequestAds) {
    if (initializationComplete && adsStoppedForConsent) loadExampleAds()
    else continueAfterPrivacyGate(true)
  }
  updateConsentTools()
}

function onConsentComplete(event) {
  finishExampleConsent(event, 'Consent completed')
}

function onPrivacyOptionsDismissed(event) {
  finishExampleConsent(event, 'Privacy options closed')
}

function onAdInspectorClosed(event) {
  if (!event.success) {
    setStatus(`Ad Inspector failed: ${event.error} (${event.code})`)
    return
  }
  setStatus('Ad Inspector closed')
}

// ---------------------------------------------------------------------------
// Banners: one container, reused. Selecting a banner throws away whatever
// is in the host and builds the requested type in its place.
// ---------------------------------------------------------------------------

// platformWidth is in pixels on Android and in points on iOS, and points are
// already the unit customAdSize expects. Dividing on both platforms is the
// mistake that looks right: on a 3x iPhone it asks for a third of the screen.
function screenWidthInDp() {
  const hostWidth = Ti.UI.convertUnits(content.size.width, Ti.UI.UNIT_DIP)
  if (hostWidth > 0) return Math.round(hostWidth)
  const caps = Ti.Platform.displayCaps

  if (Ti.Platform.osname === 'android') {
    return Math.round(caps.platformWidth / caps.logicalDensityFactor)
  }

  return Math.round(caps.platformWidth)
}

function onBannerLoaded(event) {
  setBannerHeight(event.height)
  let message = 'Loaded in the banner slot'
  if (activeBannerButton === collapsibleButton) {
    message = event.isCollapsible === true
      ? 'Collapsible ad received. Its arrow controls collapse.'
      : event.isCollapsible === false
        ? 'Google returned a standard banner. No collapse arrow.'
        : 'Banner loaded. Collapse capability was not reported.'
  }
  setStatus(`Adaptive banner loaded at ${event.height}${event.heightUnit}; isCollapsible=${event.isCollapsible}. ${message}`)
  activeBannerButton.loaded()
}

function onFixedBannerLoaded() {
  setStatus(`Fixed banner loaded at ${screenWidthInDp()}x50dp`)
  fixedButton.loaded()
}

function onBannerFailed(event) {
  setBannerHeight(0)
  setStatus(`Banner failed: ${event.error} (${event.code})`)
  if (activeBannerButton) activeBannerButton.failed()
}

function onBannerDestroyed() {
  if (activeBannerButton) activeBannerButton.reset()
  setBannerHeight(0)
}

function destroyBanner(preserveSlot = false) {
  fixedButton.reset()
  adaptiveButton.reset()
  collapsibleButton.reset()
  activeBannerButton = null
  if (!banner) {
    if (!preserveSlot && !preserveConsentBannerSlot) setBannerHeight(0)
    return
  }

  banner.removeEventListener('postlayout', onAdaptiveLayout)
  banner.removeEventListener(Admob.AD_LOADED, onBannerLoaded)
  banner.removeEventListener(Admob.AD_LOADED, onFixedBannerLoaded)
  banner.removeEventListener(Admob.AD_FAILED_TO_LOAD, onBannerFailed)
  banner.removeEventListener(Admob.AD_DESTROYED, onBannerDestroyed)
  banner.destroy()

  try {
    bannerHost.remove(banner)
  } catch (error) {
    Ti.API.debug(`Banner was already detached: ${error.message}`)
  }

  banner = null
  if (!preserveSlot && !preserveConsentBannerSlot) setBannerHeight(0)
}

// A fixed slot as wide as the screen and 50dp tall. Both numbers come from the
// application: the module passes them to AdSize(width, height) on Android and
// GADAdSizeFromCGSize on iOS, and neither platform adjusts them. Because the
// height is known up front, the slot is reserved before the ad arrives and
// nothing on screen moves when it loads.
function loadFixedFullWidthBanner() {
  if (banner && activeBannerButton === fixedButton) {
    banner.load()
    return
  }
  destroyBanner(true)
  activeBannerButton = fixedButton
  fixedButton.creating()

  banner = Admob.createBanner({
    adUnitId: Admob.TEST_BANNER,
    customAdSize: { width: screenWidthInDp(), height: 50 },
    requestAgent: 'ti.admob.unified example',
    width: Ti.UI.FILL
  })

  banner.addEventListener(Admob.AD_LOADED, onFixedBannerLoaded)
  banner.addEventListener(Admob.AD_FAILED_TO_LOAD, onBannerFailed)
  banner.addEventListener(Admob.AD_DESTROYED, onBannerDestroyed)

  bannerHost.add(banner)
  setBannerHeight(50)
  banner.load()
}

// Anchored adaptive: the application gives the width, Google picks the height.
// Size the iOS placement using Google before loading, then wait for layout.
// The expanded creative overlays the app; its height is not reserved here.
function onAdaptiveLayout() {
  if (!banner || banner.rect.width <= 0 || banner.rect.height <= 0) return
  banner.removeEventListener('postlayout', onAdaptiveLayout)
  banner.load()
}

function loadAdaptiveBanner(collapsible = false) {
  const selectedButton = collapsible ? collapsibleButton : adaptiveButton
  if (banner && activeBannerButton === selectedButton) {
    if (isAndroid || (banner.rect.width > 0 && banner.rect.height > 0)) banner.load()
    else banner.addEventListener('postlayout', onAdaptiveLayout)
    return
  }
  destroyBanner(true)
  activeBannerButton = selectedButton
  activeBannerButton.creating()

  banner = Admob.createAdaptiveBanner({
    adUnitId: Admob.TEST_ADAPTIVE_BANNER,
    adaptiveType: Admob.ADAPTIVE_ANCHORED,
    ...(collapsible ? { collapsible: 'bottom' } : {}),
    ...(!isAndroid ? { height: Ti.UI.FILL } : {}),
    requestAgent: 'ti.admob.unified example',
    width: Ti.UI.FILL
  })

  banner.addEventListener(Admob.AD_LOADED, onBannerLoaded)
  banner.addEventListener(Admob.AD_FAILED_TO_LOAD, onBannerFailed)
  banner.addEventListener(Admob.AD_DESTROYED, onBannerDestroyed)

  if (isAndroid) {
    bannerHost.add(banner)
    banner.load()
  } else {
    setBannerHeight(Admob.getAnchoredAdaptiveBannerSize(bannerHost.rect.width || screenWidthInDp()).height)
    banner.addEventListener('postlayout', onAdaptiveLayout)
    bannerHost.add(banner)
  }
}

// ---------------------------------------------------------------------------
// Fullscreen formats preload automatically. Only presentation needs a tap.
// A consumed ad is replaced after close, without automatically showing it.
// ---------------------------------------------------------------------------

function destroyInterstitial() {
  if (!interstitial) {
    return
  }

  interstitial.removeEventListener(Admob.AD_LOADED, onInterstitialLoaded)
  interstitial.removeEventListener(Admob.AD_FAILED_TO_LOAD, onInterstitialFailed)
  interstitial.removeEventListener(Admob.AD_FAILED_TO_SHOW, onInterstitialFailed)
  interstitial.removeEventListener(Admob.AD_CLOSED, onInterstitialClosed)
  interstitial.destroy()
  interstitial = null
}

function onInterstitialLoaded() {
  setStatus('Interstitial ready to show')
  interstitialButton.ready()
}

function onInterstitialFailed(event) {
  setStatus(`Interstitial failed: ${event.error} (${event.code})`)
  interstitialButton.failed()
}

function onInterstitialClosed() {
  setStatus('Interstitial closed')
  interstitialButton.reset()
  interstitialButton.load()
}

function destroyRewarded() {
  if (!rewarded) {
    return
  }

  rewarded.removeEventListener(Admob.AD_LOADED, onRewardedLoaded)
  rewarded.removeEventListener(Admob.AD_FAILED_TO_LOAD, onRewardedFailed)
  rewarded.removeEventListener(Admob.AD_FAILED_TO_SHOW, onRewardedFailed)
  rewarded.removeEventListener(Admob.AD_REWARDED, onRewardEarned)
  rewarded.removeEventListener(Admob.AD_CLOSED, onRewardedClosed)
  rewarded.destroy()
  rewarded = null
}

function onRewardedLoaded() {
  setStatus('Rewarded ad ready to show')
  rewardedButton.ready()
}

function onRewardedFailed(event) {
  setStatus(`Rewarded ad failed: ${event.error} (${event.code})`)
  rewardedButton.failed()
}

// Closing a rewarded ad is not proof the reward was earned. Only this event is.
function onRewardEarned(event) {
  setStatus(`Reward earned: ${event.rewardAmount} ${event.rewardType}`)
}

function onRewardedClosed() {
  rewardedButton.reset()
  rewardedButton.load()
}

function destroyRewardedInterstitial() {
  if (!rewardedInterstitial) return
  rewardedInterstitial.removeEventListener(Admob.AD_LOADED, onRewardedInterstitialLoaded)
  rewardedInterstitial.removeEventListener(Admob.AD_FAILED_TO_LOAD, onRewardedInterstitialFailed)
  rewardedInterstitial.removeEventListener(Admob.AD_FAILED_TO_SHOW, onRewardedInterstitialFailed)
  rewardedInterstitial.removeEventListener(Admob.AD_REWARDED, onRewardEarned)
  rewardedInterstitial.removeEventListener(Admob.AD_CLOSED, onRewardedInterstitialClosed)
  rewardedInterstitial.destroy()
  rewardedInterstitial = null
}

function onRewardedInterstitialLoaded() {
  setStatus('Rewarded interstitial ready')
  rewardedInterstitialButton.ready()
}

function onRewardedInterstitialFailed(event) {
  setStatus(`Rewarded interstitial failed: ${event.error} (${event.code})`)
  rewardedInterstitialButton.failed()
}

function onRewardedInterstitialClosed() {
  rewardedInterstitialButton.reset()
  rewardedInterstitialButton.load()
}

function destroyAppOpen() {
  if (!appOpen) {
    return
  }

  appOpen.removeEventListener(Admob.AD_LOADED, onAppOpenLoaded)
  appOpen.removeEventListener(Admob.AD_FAILED_TO_LOAD, onAppOpenFailed)
  appOpen.removeEventListener(Admob.AD_FAILED_TO_SHOW, onAppOpenFailedToShow)
  appOpen.removeEventListener(Admob.AD_CLOSED, onAppOpenClosed)
  appOpen.destroy()
  appOpen = null
}

function onAppOpenLoaded() {
  setStatus('App open ad ready to show')
  appOpenButton.ready()
}

function onAppOpenFailed(event) {
  setStatus(`App open ad failed: ${event.error} (${event.code})`)
  appOpenButton.failed()
}

// An app open ad expires four hours after the request. Past that point the
// proxy answers show() with this event instead of presenting an ad that would
// no longer earn revenue.
function onAppOpenFailedToShow(event) {
  setStatus(`App open ad could not show: ${event.error} (${event.code})`)
  appOpenButton.failed()
}

function onAppOpenClosed() {
  setStatus('App open ad closed')
  appOpenButton.reset()
  appOpenButton.load()
}

// The module owns application/activity backgrounding. The app calls these only
// when its own navigation stops showing this placement, such as an inactive tab
// or a child window covering it. Neither call changes visibility or layout.
function pauseBannerForCoveredScreen() {
  if (banner) {
    banner.pause()
  }
}

function resumeBannerForVisibleScreen() {
  if (banner) {
    banner.resume()
  }
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

createSection('Fullscreen ads', 'Ads load automatically. Tap Show when you’re ready.', true)

const interstitialButton = createAdButton('Interstitial', {
  description: 'A full-screen break between moments in your app.',
  onLoad: () => {
    destroyInterstitial()
    interstitial = Admob.createInterstitial({
      adUnitId: Admob.TEST_INTERSTITIAL,
      requestAgent: 'ti.admob.unified example',
      autoReload: false
    })

    interstitial.addEventListener(Admob.AD_LOADED, onInterstitialLoaded)
    interstitial.addEventListener(Admob.AD_FAILED_TO_LOAD, onInterstitialFailed)
    interstitial.addEventListener(Admob.AD_FAILED_TO_SHOW, onInterstitialFailed)
    interstitial.addEventListener(Admob.AD_CLOSED, onInterstitialClosed)
    interstitial.load()
  },
  onShow: () => interstitial.show()
})

const rewardedButton = createAdButton('Rewarded', {
  description: 'An opt-in experience that earns an in-app reward.',
  onLoad: () => {
    // Reuse consumed proxies so a delayed SDK reward still reaches its listener.
    if (rewarded && !rewarded.isLoaded()) {
      rewarded.load()
      return
    }
    destroyRewarded()
    rewarded = Admob.createRewarded({
      adUnitId: Admob.TEST_REWARDED,
      requestAgent: 'ti.admob.unified example',
      autoReload: false
    })

    rewarded.addEventListener(Admob.AD_LOADED, onRewardedLoaded)
    rewarded.addEventListener(Admob.AD_FAILED_TO_LOAD, onRewardedFailed)
    rewarded.addEventListener(Admob.AD_FAILED_TO_SHOW, onRewardedFailed)
    rewarded.addEventListener(Admob.AD_REWARDED, onRewardEarned)
    rewarded.addEventListener(Admob.AD_CLOSED, onRewardedClosed)
    rewarded.load()
  },
  onShow: () => rewarded.show()
})

const appOpenButton = createAdButton('App open', {
  description: 'A full-screen placement for an app’s opening moment.',
  onLoad: () => {
    destroyAppOpen()
    appOpen = Admob.createAppOpen({
      adUnitId: Admob.TEST_APP_OPEN,
      requestAgent: 'ti.admob.unified example',
      autoReload: false
    })

    appOpen.addEventListener(Admob.AD_LOADED, onAppOpenLoaded)
    appOpen.addEventListener(Admob.AD_FAILED_TO_LOAD, onAppOpenFailed)
    appOpen.addEventListener(Admob.AD_FAILED_TO_SHOW, onAppOpenFailedToShow)
    appOpen.addEventListener(Admob.AD_CLOSED, onAppOpenClosed)
    appOpen.load()
  },
  onShow: () => appOpen.show()
})

const rewardedInterstitialButton = createAdButton('Rewarded interstitial', {
  description: 'Complete this test ad to earn 10 demo coins. AdMob requires an introduction explaining the reward, a clear Skip option before the ad starts, and enough time to decide. Tap Show to choose Watch test ad or Skip.',
  policyUrl: 'https://support.google.com/admob/answer/9884467?hl=en',
  onLoad: () => {
    // Reuse consumed proxies so a delayed SDK reward still reaches its listener.
    if (rewardedInterstitial && !rewardedInterstitial.isLoaded()) {
      rewardedInterstitial.load()
      return
    }
    destroyRewardedInterstitial()
    rewardedInterstitial = Admob.createRewardedInterstitial({
      adUnitId: Admob.TEST_REWARDED_INTERSTITIAL,
      requestAgent: 'ti.admob.unified example', autoReload: false
    })
    rewardedInterstitial.addEventListener(Admob.AD_LOADED, onRewardedInterstitialLoaded)
    rewardedInterstitial.addEventListener(Admob.AD_FAILED_TO_LOAD, onRewardedInterstitialFailed)
    rewardedInterstitial.addEventListener(Admob.AD_FAILED_TO_SHOW, onRewardedInterstitialFailed)
    rewardedInterstitial.addEventListener(Admob.AD_REWARDED, onRewardEarned)
    rewardedInterstitial.addEventListener(Admob.AD_CLOSED, onRewardedInterstitialClosed)
    rewardedInterstitial.load()
  },
  beforeShow: complete => {
    const intro = Ti.UI.createAlertDialog({
      title: 'Test ad reward',
      message: 'Watch this test ad to earn 10 demo coins, or skip and continue without watching.',
      buttonNames: ['Watch test ad', 'Skip'], cancel: 1
    })
    intro.addEventListener('click', event => {
      const watch = event.index === 0
      if (!watch) setStatus('Rewarded interstitial skipped')
      complete(watch)
    })
    intro.show()
  },
  onShow: () => rewardedInterstitial.show()
})

createSection('Banner ads', 'Adaptive starts automatically. Choose a format for the banner slot.', true)

const fixedButton = createAdButton('Fixed banner', {
  description: 'A full-width placement with a fixed 50 dp height.',
  onLoad: () => loadFixedFullWidthBanner()
})

const adaptiveButton = createAdButton('Adaptive banner', {
  description: 'Fits the available width. Google selects the height.',
  onLoad: () => loadAdaptiveBanner()
})

const collapsibleButton = createAdButton('Collapsible banner', {
  description: 'Loads a new ad requesting expansion. Google may return a standard banner.',
  onLoad: () => loadAdaptiveBanner(true)
})

createSection('Banner controls', 'Manage the current placement without creating a new ad.', false)

createAdButton('Remove banner', {
  onLoad: button => {
    destroyBanner()
    setStatus('Banner destroyed and host collapsed')
    button.reset()
  }
})

createAdButton('Pause banner', {
  onLoad: button => {
    pauseBannerForCoveredScreen()
    setStatus(banner ? 'Banner paused without hiding or changing its slot' : 'Load a banner first to pause it')
    button.reset()
  }
})

createAdButton('Resume banner', {
  onLoad: button => {
    resumeBannerForVisibleScreen()
    setStatus(banner ? 'The same banner instance resumed' : 'Load a banner first to resume it')
    button.reset()
  }
})

createSection('Privacy & consent', 'Your choices are managed by Google’s consent form.', false)
// Button and status share one stable slot instead of changing the page height.
currentSection.layout = 'composite'
currentSection.height = '64dp'

const privacyButton = createAdButton('Advertising privacy options', {
  privacy: true,
  onLoad: button => {
    consentBusy = true
    stopAdsForConsent()
    updateConsentTools()
    Admob.presentPrivacyOptions({})
    button.reset()
  }
})

const privacyNote = Ti.UI.createLabel({
  top: '8dp',
  left: '8dp',
  right: '8dp',
  height: Ti.UI.SIZE,
  color: colors.muted,
  font: { fontSize: 13 },
  text: 'UMP reports no privacy form for this session. It appears in the EEA, '
    + 'and wherever a message is configured for the app in AdMob.'
})
currentSection.add(privacyNote)

setPrivacyOptionsAvailable(undefined)

createSection('Tracking transparency', 'Check ATT without a prompt. Request it only when the app uses tracking. UMP may already handle the request.', false)
const trackingStatusLabel = Ti.UI.createLabel({
  top: '8dp', left: '8dp', right: '8dp', height: Ti.UI.SIZE,
  color: colors.muted, font: { fontSize: '13dp' }, text: 'ATT status: checking…'
})
currentSection.add(trackingStatusLabel)
const trackingQueryButton = createAdButton('Check ATT status', {
  privacy: true,
  onLoad: button => {
    button.reset()
    updateTrackingStatus(true)
    setStatus('ATT status refreshed without requesting permission')
  }
})
const trackingPermissionButton = createAdButton('Request ATT permission', {
  privacy: true,
  onLoad: button => {
    button.reset()
    const tracking = updateTrackingStatus()
    if (tracking.applicable && tracking.status === 0 && appActive) requestExampleTracking()
  }
})
updateTrackingStatus()

if (consentTestingEnabled) {
  createSection('Consent demo', 'Choose a scenario and run it. Testing clears the previous consent choice.', false)
  currentSection.add(Ti.UI.createLabel({
    text: 'Test device', top: '12dp', left: '8dp', right: '8dp', height: Ti.UI.SIZE,
    color: colors.ink, font: { fontSize: '14dp', fontWeight: 'bold' }
  }))
  currentSection.add(Ti.UI.createLabel({
    text: 'Paste the UMP test-device identifier from the SDK log, including any hyphens. This app remembers it. Leave empty on an iOS simulator.',
    top: '4dp', left: '8dp', right: '8dp', height: Ti.UI.SIZE,
    color: colors.muted, font: { fontSize: '13dp' }
  }))
  consentDeviceInput = Ti.UI.createTextField({
    value: Ti.App.Properties.getString('demo.consentDeviceIds', '') || Ti.App.Properties.getString(`demo.consentDeviceIds.${isAndroid ? 'android' : 'ios'}`, ''), hintText: 'UMP test-device identifier (from SDK log)',
    top: '8dp', left: '8dp', right: '8dp', height: '48dp',
    color: colors.ink, backgroundColor: colors.surface,
    borderColor: colors.line, borderWidth: 1, borderRadius: '8dp',
    autocorrect: false, autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE, font: { fontSize: '13dp' }
  })
  currentSection.add(consentDeviceInput)
  const scenarios = [
    ['eea', 'Europe — consent form', 'Shows the European consent flow.'],
    ['us', 'US — privacy options', 'Opens US privacy options when available.'],
    ['other', 'Other region — no form', 'Tests a region where no dialog is normally needed.'],
    ['normal', 'My actual region', 'Removes the override; Google decides whether a form is needed.']
  ]
  let selectedScenario = Math.max(0, scenarios.findIndex(item => item[0] === consentMode))
  const selector = Ti.UI.createButton({
    title: scenarios[selectedScenario][1] + ' ▾', enabled: true,
    top: '8dp', left: '8dp', right: '8dp', height: '48dp',
    color: colors.accent, backgroundColor: colors.tint, borderRadius: '8dp',
    font: { fontSize: '14dp', fontWeight: 'semibold' }
  })
  currentSection.add(selector)
  selector.addEventListener('click', () => {
    const dialog = Ti.UI.createOptionDialog({
      title: 'Privacy scenario', options: [...scenarios.map(item => item[1]), 'Cancel'], cancel: scenarios.length
    })
    dialog.addEventListener('click', event => {
      if (event.index < 0 || event.index >= scenarios.length) return
      selectedScenario = event.index
      selector.title = scenarios[selectedScenario][1] + ' ▾'
      scenarioHint.text = scenarios[selectedScenario][2]
    })
    dialog.show(isAndroid ? {} : { view: selector })
  })
  selector.title = scenarios[selectedScenario][1] + ' ▾'
  const scenarioHint = Ti.UI.createLabel({
    text: scenarios[selectedScenario][2], top: '8dp', left: '8dp', right: '8dp', height: Ti.UI.SIZE,
    color: colors.muted, font: { fontSize: '13dp' }
  })
  currentSection.add(scenarioHint)
  const runButton = createAdButton('Run test', {
    privacy: true,
    onLoad: button => { button.reset(); requestExampleConsent(scenarios[selectedScenario][0], true) }
  })
  consentTestButtons.push(runButton)
  consentDemoFeedback = Ti.UI.createLabel({
    text: 'Ready to test.', top: '8dp', left: '8dp', right: '8dp', height: Ti.UI.SIZE,
    color: colors.accent, font: { fontSize: '13dp' }
  })
  consentDemoFeedback.height = '64dp'
  consentDemoFeedback.verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP
  currentSection.add(consentDemoFeedback)
  updateConsentTools()
}

createSection('Developer tools', 'Inspect live ad requests with Google’s native Ad Inspector.', false)

createAdButton('Open Ad Inspector', {
  onLoad: button => {
    Admob.openAdInspector()
    button.reset()
  }
})

createSection('Session activity', 'Only Google demo ad units are used.', false)
const activityPanel = Ti.UI.createScrollView({
  top: '16dp', left: '8dp', right: '8dp', height: '240dp',
  contentHeight: Ti.UI.SIZE, scrollType: 'vertical', showVerticalScrollIndicator: true,
  backgroundColor: colors.surface, borderRadius: '12dp'
})
activityPanel.add(activity)
currentSection.add(activityPanel)
page.add(Ti.UI.createLabel({
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  color: colors.muted, font: { fontSize: '12dp' },
  text: 'ti.admob.unified 1.0.0  /  Google Mobile Ads + UMP',
  top: '24dp', left: '24dp', right: '24dp', height: Ti.UI.SIZE
}))

Admob.addEventListener('module_initialized', onModuleInitialized)
Admob.addEventListener('consent_complete', onConsentComplete)
Admob.addEventListener(
  'privacy_options_dismissed',
  onPrivacyOptionsDismissed
)
Admob.addEventListener('ad_inspector_closed', onAdInspectorClosed)

viewport.add(content)
viewport.add(bannerHost)
win.add(session)
win.add(viewport)
Ti.App.addEventListener('pause', onApplicationPause)
Ti.App.addEventListener('resumed', onApplicationResumed)

// On Android, Titanium also fires close while it recreates the activity, for
// example on a light/dark switch. The window survives, so its ads must too.
win.addEventListener('close', event => {
  if (event._closeFromActivityForcedToDestroy) return
  windowClosed = true
  cancelPendingFullscreenShows()
  trackingPending = false
  Ti.App.removeEventListener('pause', onApplicationPause)
  Ti.App.removeEventListener('resumed', onApplicationResumed)
  content.removeEventListener('postlayout', layoutPage)

  Admob.removeEventListener('module_initialized', onModuleInitialized)
  Admob.removeEventListener('consent_complete', onConsentComplete)
  Admob.removeEventListener(
    'privacy_options_dismissed',
    onPrivacyOptionsDismissed
  )
  Admob.removeEventListener('ad_inspector_closed', onAdInspectorClosed)
  Admob.removeEventListener(
    'tracking_authorization_completed',
    onTrackingAuthorizationCompleted
  )
  trackingRequestStarted = false

  destroyBanner()
  destroyInterstitial()
  destroyRewarded()
  destroyRewardedInterstitial()
  destroyAppOpen()
})

win.addEventListener('open', function onOpen() {
  win.removeEventListener('open', onOpen)
  requestExampleConsent(consentMode)
})
win.open()
