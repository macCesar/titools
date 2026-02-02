/**
 * ControllerAutoCleanup - Automatic Controller Cleanup for Alloy
 *
 * Monkey-patches Alloy.createController to automatically cleanup
 * controllers when their views are closed, preventing memory leaks.
 *
 * INSTALLATION:
 * 1. Copy this file to your app: app/lib/ControllerAutoCleanup.js
 * 2. Add as first line in alloy.js: require('ControllerAutoCleanup')
 *
 * No other code changes needed - cleanup happens automatically.
 *
 * @see https://github.com/jasonkneen/AlloyXL original inspiration
 */

'use strict'

// Logger (optional - remove if not using)
let log = null
try {
  log = require('Logger')?.create('CONTROLLER_CLEANUP')
} catch (e) {
  // Fallback simple logger
  log = {
    debug: (msg, data) => Ti.API.debug(`[ControllerCleanup] ${msg}`, data),
    info: (msg, data) => Ti.API.info(`[ControllerCleanup] ${msg}`, data),
    warn: (msg, data) => Ti.API.warn(`[ControllerCleanup] ${msg}`, data),
    error: (msg, data) => Ti.API.error(`[ControllerCleanup] ${msg}`, data)
  }
}

// Store original Alloy.createController
const originalCreateController = Alloy.createController

/**
 * Recursively cleanup a controller and all its child views
 * @param {Object} controller - Alloy controller to cleanup
 */
function cleanupController(controller) {
  if (!controller) return

  // Cleanup child views first (recursive)
  if (controller.__views) {
    Object.values(controller.__views).forEach((childView) => {
      if (childView && typeof childView === 'object') {
        cleanupController(childView)
      }
    })
  }

  // Only cleanup actual Alloy controllers (not plain views)
  if (controller.__iamalloy) {
    // Remove all Backbone event listeners
    if (typeof controller.off === 'function') {
      controller.off()
    }

    // Call Alloy's destroy method
    if (typeof controller.destroy === 'function') {
      controller.destroy()
    }

    log?.debug('Controller cleaned up', { id: controller.id })
  }

  // Clear reference
  controller = null
}

/**
 * Enhanced Alloy.createController with automatic cleanup
 * @param {string} name - Controller name/path
 * @param {Object} args - Arguments to pass to controller
 * @returns {Object} Alloy controller
 */
function createController(name, args = {}) {
  try {
    const controller = originalCreateController(name, args)

    // Only process controllers with views
    if (!controller.__views || Object.keys(controller.__views).length === 0) {
      return controller
    }

    const view = controller.getView()
    const controllerName = name.split('/').pop() || name
    const viewId = view?.id

    // Track controllers globally (optional, for debugging)
    Alloy.Controllers = Alloy.Controllers || {}

    // Warn about controller name conflicts
    if (Alloy.Controllers[controllerName] && !viewId) {
      log?.warn('Controller name conflict - consider using unique IDs', {
        controller: controllerName,
        path: controller.__controllerPath
      })
    }

    // Use view ID as key if available, otherwise controller name
    const registryKey = viewId || controllerName
    Alloy.Controllers[registryKey] = controller

    /**
     * Add `once()` helper - listen to event one time only
     * @param {string} eventName - Event name
     * @param {Function} callback - Callback function
     * @returns {Object} controller for chaining
     */
    controller.once = function (eventName, callback) {
      const wrapper = (...args) => {
        controller.off(eventName, wrapper)
        callback(...args)
      }
      controller.on(eventName, wrapper)
      return controller
    }

    // Only add auto-cleanup to views with addEventListener
    if (view && typeof view.addEventListener === 'function') {
      // Window-like views with open() method
      if (typeof view.open === 'function') {
        view.addEventListener('open', function onOpen(e) {
          view.removeEventListener('open', onOpen)
          controller.trigger('open', e)
          log?.debug('Controller opened', { name: controllerName })
        })

        view.addEventListener('close', function onClose() {
          view.removeEventListener('close', onClose)
          view = null

          cleanupController(controller)
          delete Alloy.Controllers[registryKey]

          log?.debug('Controller cleaned up', { name: controllerName })
        })

        view.addEventListener('postlayout', function onPostLayout(e) {
          view.removeEventListener('postlayout', onPostLayout)
          controller.trigger('postlayout', e)
          log?.debug('Controller layout finished', { name: controllerName })
        })
      } else {
        // View-like views without open() (Widget, etc.)
        view.addEventListener('postlayout', function onPostLayout(e) {
          view.removeEventListener('postlayout', onPostLayout)
          controller.trigger('postlayout', e)
          log?.debug('View layout finished', { name: controllerName })
        })
      }
    }

    return controller

  } catch (error) {
    log?.error('Error creating controller', {
      name,
      error: error.message,
      stack: error.stack
    })
    throw error
  }
}

// Replace Alloy.createController with enhanced version
Alloy.createController = createController

log?.info('ControllerAutoCleanup loaded - automatic cleanup enabled')

// Export createController for direct use if needed
exports.createController = createController

/**
 * USAGE:
 *
 * // alloy.js - Load as first line
 * require('ControllerAutoCleanup')
 *
 * // All controllers now auto-cleanup on close
 * Alloy.createController('profile').getView().open()
 */
