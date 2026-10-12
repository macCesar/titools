'use strict'

/**
 * Copy-ready TiAdMobUnified integration.
 *
 * Alloy:   app/lib/ads.js
 * Classic: Resources/lib/ads.js
 *
 * The Google Mobile Ads SDK owns banner refresh. This library never creates a
 * refresh timer and never changes banner visibility while pausing.
 */

const Admob = require('ti.admob.unified')

const resources = new Set()

let startup = null
let startupOptions = {}
let gateResolved = false
let canRequest = false
let sdkReady = false
let privacyOperation = null
let inspectorOperation = null

function call(handler, event) {
  if (typeof handler !== 'function') {
    return
  }

  try {
    handler(event || {})
  } catch (error) {
    Ti.API.error(`[ads] Event handler failed: ${error.message || error}`)
  }
}

function waitForEvent(name, invoke) {
  return new Promise(resolve => {
    let settled = false

    function finish(event) {
      if (settled) {
        return
      }

      settled = true
      Admob.removeEventListener(name, finish)
      resolve(event || {})
    }

    Admob.addEventListener(name, finish)

    try {
      invoke()
    } catch (error) {
      finish({ success: false, error: error.message || String(error) })
    }
  })
}

function synchronizeResources(method) {
  Array.from(resources).forEach(resource => {
    if (typeof resource[method] === 'function') {
      resource[method]()
    }
  })
}

async function initializeIfAllowed() {
  canRequest = Admob.canRequestAds()

  if (!canRequest) {
    return false
  }

  if (sdkReady) {
    return true
  }

  const initialized = await waitForEvent('module_initialized', () => {
    Admob.initialize(startupOptions.initialization || {})
  })

  sdkReady = initialized.success === true || initialized.success === 1
  if (!sdkReady) {
    Ti.API.warn(`[ads] Google Mobile Ads initialization failed: ${initialized.error || 'unknown error'}`)
  }

  return sdkReady
}

/**
 * Runs UMP -> optional ATT -> eligibility -> SDK initialization once.
 *
 * options.consent: dictionary passed to requestConsent()
 * options.requestTrackingAuthorization: true only when the app has a real ATT use case
 * options.initialization: dictionary passed to initialize()
 */
function start(options) {
  if (startup) {
    return startup
  }

  startupOptions = options || {}
  startup = (async () => {
    const consent = await waitForEvent('consent_complete', () => {
      Admob.requestConsent(startupOptions.consent || {})
    })

    if (consent.success === false || consent.success === 0) {
      Ti.API.warn(`[ads] UMP completed with an error: ${consent.error || 'unknown error'}`)
    }

    let tracking = null
    if (startupOptions.requestTrackingAuthorization === true) {
      tracking = await waitForEvent('tracking_authorization_completed', () => {
        Admob.requestTrackingAuthorization()
      })
    }

    await initializeIfAllowed()
    gateResolved = true
    synchronizeResources('sync')

    return {
      consent,
      tracking,
      canRequestAds: canRequest,
      initialized: sdkReady
    }
  })()

  return startup
}

function addListener(proxy, listeners, name, handler) {
  if (!name || typeof handler !== 'function') {
    return
  }

  proxy.addEventListener(name, handler)
  listeners.push([name, handler])
}

function removeListeners(proxy, listeners) {
  listeners.forEach(entry => proxy.removeEventListener(entry[0], entry[1]))
  listeners.length = 0
}

function bannerProperties(options, adaptive) {
  const properties = {
    adUnitId: options.adUnitId,
    width: options.width || Ti.UI.FILL
  }

  for (const key of ['keywords', 'contentUrl', 'requestAgent', 'extras']) {
    if (options[key] !== undefined) {
      properties[key] = options[key]
    }
  }

  if (adaptive) {
    if (Ti.Platform && Ti.Platform.osname !== 'android') properties.height = Ti.UI.FILL
    properties.adaptiveType = options.adaptiveType || Admob.ADAPTIVE_ANCHORED
    for (const key of ['maxHeight', 'collapsible']) {
      if (options[key] !== undefined) {
        properties[key] = options[key]
      }
    }
  } else {
    properties.adSize = options.adSize || Admob.BANNER
    if (options.customAdSize !== undefined) {
      properties.customAdSize = options.customAdSize
    }
  }

  return properties
}

function createBannerPlacement(options, adaptive) {
  if (!options || !options.host || !options.adUnitId) {
    throw new Error('A banner requires host and adUnitId')
  }

  const host = options.host
  const content = options.content
  const reservedHeight = Number(options.reservedHeight)

  if (!Number.isFinite(reservedHeight) || reservedHeight <= 0) {
    throw new Error('A banner requires a positive reservedHeight in dp')
  }

  let proxy = null
  let listeners = []
  let destroyed = false
  let locallyPaused = options.paused === true

  function reserve(height) {
    const dimension = `${Math.max(0, Number(height) || 0)}dp`
    host.height = dimension
    if (content) {
      content.bottom = dimension
    }
  }

  function detach(destroyNative) {
    if (!proxy) {
      return
    }

    const target = proxy
    proxy = null
    removeListeners(target, listeners)

    if (destroyNative) {
      target.destroy()
    }

    try {
      host.remove(target)
    } catch (error) {
      Ti.API.debug(`[ads] Banner was already detached: ${error.message || error}`)
    }
  }

  function onLoaded(event) {
    const actualHeight = Number(event.height)
    reserve(actualHeight > 0 ? actualHeight : reservedHeight)
    call(options.onLoaded, event)
  }

  function onFailedToLoad(event) {
    detach(true)
    if (options.collapseOnFailure !== false) {
      reserve(0)
    }
    call(options.onFailedToLoad, event)
  }

  function onDestroyed(event) {
    detach(false)
    reserve(0)
    call(options.onDestroyed, event)
  }

  function attachForwarder(name, optionName) {
    addListener(proxy, listeners, name, event => call(options[optionName], event))
  }

  const placement = {
    sync() {
      if (destroyed || locallyPaused || proxy) {
        return
      }

      if (!canRequest || !sdkReady) {
        if (gateResolved) {
          reserve(0)
        }
        return
      }

      reserve(reservedHeight)
      proxy = adaptive
        ? Admob.createAdaptiveBanner(bannerProperties(options, true))
        : Admob.createBanner(bannerProperties(options, false))

      addListener(proxy, listeners, Admob.AD_LOADED, onLoaded)
      addListener(proxy, listeners, Admob.AD_FAILED_TO_LOAD, onFailedToLoad)
      addListener(proxy, listeners, Admob.AD_DESTROYED, onDestroyed)
      attachForwarder(Admob.AD_CLICKED, 'onClicked')
      attachForwarder(Admob.AD_IMPRESSION, 'onImpression')
      attachForwarder(Admob.AD_OPENED, 'onOpened')
      attachForwarder(Admob.AD_CLOSED, 'onClosed')

      if (adaptive && Ti.Platform && Ti.Platform.osname !== 'android') {
        const target = proxy
        const anchored = !options.adaptiveType || options.adaptiveType === Admob.ADAPTIVE_ANCHORED
        let measuredWidth = 0
        function prepareSize(width) {
          if (!anchored || width <= 0 || measuredWidth === width) return false
          measuredWidth = width
          const height = Admob.getAnchoredAdaptiveBannerSize(width).height
          const changed = host.height !== `${height}dp`
          reserve(height)
          return changed
        }
        prepareSize(host.rect ? host.rect.width : 0)
        function loadAfterLayout() {
          if (destroyed || proxy !== target || target.rect.width <= 0 || target.rect.height <= 0) return
          if (prepareSize(target.rect.width)) return
          target.removeEventListener('postlayout', loadAfterLayout)
          target.load()
        }
        addListener(target, listeners, 'postlayout', loadAfterLayout)
        host.add(target)
      } else {
        host.add(proxy)
        proxy.load()
      }
    },

    pause() {
      if (destroyed || locallyPaused) {
        return
      }

      locallyPaused = true
      if (proxy) {
        proxy.pause()
      }
    },

    resume() {
      if (destroyed || !locallyPaused) {
        return
      }

      locallyPaused = false
      if (proxy) {
        proxy.resume()
      }
      placement.sync()
    },

    rebuild() {
      if (destroyed) {
        return
      }

      detach(true)
      reserve(reservedHeight)
      placement.sync()
    },

    retry() {
      placement.rebuild()
    },

    authorizationChanged() {
      if (destroyed) {
        return
      }

      detach(true)
      reserve(canRequest && sdkReady ? reservedHeight : 0)
      placement.sync()
    },

    isLoaded() {
      return Boolean(proxy && proxy.isLoaded())
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      resources.delete(placement)
      detach(true)
      reserve(0)
    }
  }

  resources.add(placement)
  reserve(reservedHeight)
  placement.sync()
  return placement
}

function createBanner(options) {
  return createBannerPlacement(options, false)
}

function createAdaptiveBanner(options) {
  return createBannerPlacement(options, true)
}

const fullscreenEvents = [
  ['AD_LOADED', 'onLoaded'],
  ['AD_FAILED_TO_LOAD', 'onFailedToLoad'],
  ['AD_OPENED', 'onOpened'],
  ['AD_SHOWED_FULLSCREEN_CONTENT', 'onShowed'],
  ['AD_CLOSED', 'onClosed'],
  ['AD_CLICKED', 'onClicked'],
  ['AD_IMPRESSION', 'onImpression'],
  ['AD_FAILED_TO_SHOW', 'onFailedToShow'],
  ['AD_REWARDED', 'onRewarded'],
  ['AD_DESTROYED', 'onDestroyed']
]

function fullscreenProperties(options) {
  const properties = {
    adUnitId: options.adUnitId,
    autoReload: options.autoReload === true
  }

  for (const key of ['keywords', 'requestAgent', 'extras']) {
    if (options[key] !== undefined) {
      properties[key] = options[key]
    }
  }

  return properties
}

// Shared by the managers and the raw-API playground. Rotation alone does no work.
function createFullscreenSizeGuard(getSize) {
  let requestedSize = null
  function sizeKey() {
    const size = getSize()
    return size && size.width > 0 && size.height > 0
      ? `${Math.round(size.width)}x${Math.round(size.height)}` : null
  }
  return {
    recordLoad() { requestedSize = sizeKey() },
    show(present, reload) {
      const currentSize = sizeKey()
      if (currentSize && currentSize !== requestedSize) {
        reload()
        return false
      }
      present()
      return true
    }
  }
}

function createFullscreen(options, factoryName) {
  if (!options || !options.adUnitId) {
    throw new Error(`${factoryName} requires adUnitId`)
  }

  let proxy = null
  let listeners = []
  let destroyed = false
  let loadRequested = options.autoLoad === true
  let loading = false
  const sizeGuard = createFullscreenSizeGuard(() => (options.window || Ti.UI.currentWindow)?.size)

  function detach(destroyNative) {
    if (!proxy) {
      return
    }

    const target = proxy
    proxy = null
    loading = false
    removeListeners(target, listeners)
    if (destroyNative) {
      target.destroy()
    }
  }

  const manager = {
    sync() {
      if (destroyed || proxy || !loadRequested || !canRequest || !sdkReady) {
        return
      }

      proxy = Admob[factoryName](fullscreenProperties(options))

      fullscreenEvents.forEach(entry => {
        const eventName = Admob[entry[0]]
        if (!eventName) {
          return
        }

        addListener(proxy, listeners, eventName, event => {
          if (entry[0] === 'AD_LOADED' || entry[0] === 'AD_FAILED_TO_LOAD') loading = false
          if (entry[0] === 'AD_CLOSED' && options.autoReload === true) {
            loading = true
            sizeGuard.recordLoad()
          }
          if (entry[0] === 'AD_CLOSED' && options.autoReload !== true) {
            loadRequested = false
          }
          if (entry[0] === 'AD_FAILED_TO_SHOW') {
            loadRequested = false
          }
          if (entry[0] === 'AD_DESTROYED') {
            detach(false)
            call(options[entry[1]], event)
            return
          }
          call(options[entry[1]], event)
        })
      })

      loading = true
      sizeGuard.recordLoad()
      proxy.load()
    },

    load() {
      if (destroyed || loading) {
        return false
      }

      loadRequested = true
      if (proxy) {
        loading = true
        sizeGuard.recordLoad()
        proxy.load()
      } else {
        manager.sync()
      }
      return true
    },

    show() {
      if (!proxy || loading || !proxy.isLoaded()) {
        return false
      }

      return sizeGuard.show(() => proxy.show(), () => manager.retry())
    },

    isLoaded() {
      return Boolean(proxy && proxy.isLoaded())
    },

    retry() {
      if (destroyed) {
        return false
      }

      detach(true)
      loadRequested = true
      manager.sync()
      return true
    },

    authorizationChanged() {
      if (destroyed) {
        return
      }

      detach(true)
      manager.sync()
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      resources.delete(manager)
      detach(true)
    }
  }

  resources.add(manager)
  manager.sync()
  return manager
}

function createInterstitial(options) {
  return createFullscreen(options, 'createInterstitial')
}

function createRewarded(options) {
  return createFullscreen(options, 'createRewarded')
}

function createAppOpen(options) {
  return createFullscreen(options, 'createAppOpen')
}

function showPrivacyOptions() {
  if (privacyOperation) return privacyOperation
  privacyOperation = (async () => {
    const result = await waitForEvent('privacy_options_dismissed', () => {
      Admob.presentPrivacyOptions({})
    })

    await initializeIfAllowed()
    synchronizeResources('authorizationChanged')
    return result
  })().finally(() => { privacyOperation = null })
  return privacyOperation
}

function isPrivacyOptionsRequired() {
  return Admob.isPrivacyOptionsRequired()
}

function openAdInspector() {
  if (inspectorOperation) return inspectorOperation
  inspectorOperation = waitForEvent('ad_inspector_closed', () => Admob.openAdInspector())
    .finally(() => { inspectorOperation = null })
  return inspectorOperation
}

function isReady() {
  return canRequest && sdkReady
}

function destroyAll() {
  Array.from(resources).forEach(resource => resource.destroy())
}

module.exports = {
  start,
  isReady,
  isPrivacyOptionsRequired,
  showPrivacyOptions,
  openAdInspector,
  createBanner,
  createAdaptiveBanner,
  createFullscreenSizeGuard,
  createInterstitial,
  createRewarded,
  createAppOpen,
  destroyAll
}
