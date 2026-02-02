# Device Security: Biometrics, Deep Links & Integrity

## Biometric Authentication

### Using ti.identity Module

```javascript
// lib/services/biometricService.js
const Identity = require('ti.identity')

exports.BiometricService = {
  /**
   * Check if biometrics are available
   * @returns {{available: boolean, type: string|null, error: string|null}}
   */
  checkAvailability() {
    if (!Identity.isSupported()) {
      return { available: false, type: null, error: 'Biometrics not supported' }
    }

    const authResult = Identity.deviceCanAuthenticate()

    if (authResult !== Identity.SUCCESS) {
      const errors = {
        [Identity.ERROR_TOUCH_ID_NOT_AVAILABLE]: 'Biometrics not available',
        [Identity.ERROR_TOUCH_ID_NOT_ENROLLED]: 'No biometrics enrolled',
        [Identity.ERROR_PASSCODE_NOT_SET]: 'Device passcode not set'
      }

      return {
        available: false,
        type: null,
        error: errors[authResult] || 'Unknown error'
      }
    }

    // Determine biometric type
    const biometricType = OS_IOS
      ? (Identity.biometryType === Identity.BIOMETRY_TYPE_FACE_ID ? 'Face ID' : 'Touch ID')
      : 'Fingerprint'

    return { available: true, type: biometricType, error: null }
  },

  /**
   * Authenticate user with biometrics
   * @param {string} reason - Reason shown to user
   * @returns {Promise<boolean>}
   */
  authenticate(reason = L('biometric_reason')) {
    return new Promise((resolve, reject) => {
      const { available, error } = this.checkAvailability()

      if (!available) {
        return reject(new Error(error))
      }

      Identity.authenticate({
        reason: reason,
        allowableReuseDuration: 0, // Always require fresh auth
        fallbackTitle: L('use_passcode'), // iOS fallback button
        cancelTitle: L('cancel'),

        callback: (e) => {
          if (e.success) {
            resolve(true)
          } else {
            const errorMsg = e.error || 'Authentication failed'
            reject(new Error(errorMsg))
          }
        }
      })
    })
  },

  /**
   * Get user-friendly name for the biometric type
   */
  getBiometricName() {
    const { available, type } = this.checkAvailability()
    return available ? type : null
  }
}
```

## Biometric Login Flow

```javascript
// controllers/auth/login.js
const { BiometricService } = require('services/biometricService')
const { TokenStorage } = require('services/tokenStorage')
const { AuthService } = require('services/authService')

function init() {
  // Check if biometric login is available and enabled
  const { available, type } = BiometricService.checkAvailability()
  const biometricEnabled = Ti.App.Properties.getBool('biometricEnabled', false)
  const hasStoredCredentials = TokenStorage.hasRefreshToken()

  if (available && biometricEnabled && hasStoredCredentials) {
    // Show biometric login option
    $.biometricBtn.applyProperties({
      visible: true,
      title: String.format(L('login_with'), type)
    })
  }
}

async function onBiometricLogin() {
  try {
    // Authenticate with biometrics
    await BiometricService.authenticate(L('unlock_app'))

    // Refresh token using stored refresh token
    const user = await AuthService.refreshSession()

    // Navigate to main app
    Navigation.replace('main')

  } catch (error) {
    // Biometric failed - show password login
    showMessage(L('biometric_failed'))
  }
}

// Enable biometrics after successful password login
async function onLoginSuccess(user) {
  const { available, type } = BiometricService.checkAvailability()

  if (available && !Ti.App.Properties.getBool('askedBiometric', false)) {
    Ti.App.Properties.setBool('askedBiometric', true)

    // Ask user if they want to enable biometric login
    const dialog = Ti.UI.createAlertDialog({
      title: String.format(L('enable_biometric_title'), type),
      message: String.format(L('enable_biometric_msg'), type),
      buttonNames: [L('not_now'), L('enable')]
    })

    dialog.addEventListener('click', (e) => {
      if (e.index === 1) {
        Ti.App.Properties.setBool('biometricEnabled', true)
      }
    })

    dialog.show()
  }
}
```

## Deep Link Security

### Validating Deep Links

```javascript
// lib/services/deepLinkService.js
const logger = require('services/logger')

// Whitelist of allowed schemes and hosts
const ALLOWED_SCHEMES = ['myapp', 'https']
const ALLOWED_HOSTS = ['myapp.com', 'www.myapp.com']

// Route patterns with their required auth levels
const ROUTES = {
  '/product/:id': { auth: false, handler: 'openProduct' },
  '/order/:id': { auth: true, handler: 'openOrder' },
  '/profile': { auth: true, handler: 'openProfile' },
  '/verify-email': { auth: false, handler: 'verifyEmail' }
}

exports.DeepLinkService = {
  /**
   * Parse and validate a deep link URL
   * @param {string} url - The deep link URL
   * @returns {{valid: boolean, route: string, params: object, error: string}}
   */
  parseUrl(url) {
    try {
      const parsed = this._parseUrlComponents(url)

      // Validate scheme
      if (!ALLOWED_SCHEMES.includes(parsed.scheme)) {
        logger.warn('DeepLink', 'Invalid scheme', { url, scheme: parsed.scheme })
        return { valid: false, error: 'Invalid URL scheme' }
      }

      // Validate host for https URLs
      if (parsed.scheme === 'https' && !ALLOWED_HOSTS.includes(parsed.host)) {
        logger.warn('DeepLink', 'Invalid host', { url, host: parsed.host })
        return { valid: false, error: 'Invalid host' }
      }

      // Match route
      const routeMatch = this._matchRoute(parsed.path)

      if (!routeMatch) {
        logger.warn('DeepLink', 'Unknown route', { url, path: parsed.path })
        return { valid: false, error: 'Unknown route' }
      }

      // Sanitize parameters
      const params = this._sanitizeParams({
        ...routeMatch.params,
        ...parsed.queryParams
      })

      return {
        valid: true,
        route: routeMatch.route,
        handler: routeMatch.handler,
        requiresAuth: routeMatch.requiresAuth,
        params
      }

    } catch (error) {
      logger.error('DeepLink', 'Parse error', { url, error: error.message })
      return { valid: false, error: 'Invalid URL format' }
    }
  },

  /**
   * Handle an incoming deep link
   */
  async handle(url) {
    const result = this.parseUrl(url)

    if (!result.valid) {
      return false
    }

    // Check auth requirement
    if (result.requiresAuth && !AuthService.isAuthenticated()) {
      // Store deep link for after login
      Ti.App.Properties.setString('pendingDeepLink', url)
      Navigation.open('login')
      return true
    }

    // Execute handler
    return this._executeHandler(result.handler, result.params)
  },

  _parseUrlComponents(url) {
    // Custom parsing to handle both custom schemes and https
    const schemeMatch = url.match(/^([a-z]+):\/\//)
    const scheme = schemeMatch ? schemeMatch[1] : 'https'

    const withoutScheme = url.replace(/^[a-z]+:\/\//, '')
    const [hostPath, queryString] = withoutScheme.split('?')
    const [host, ...pathParts] = hostPath.split('/')
    const path = '/' + pathParts.join('/')

    const queryParams = {}
    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [key, value] = pair.split('=')
        queryParams[decodeURIComponent(key)] = decodeURIComponent(value || '')
      })
    }

    return { scheme, host, path, queryParams }
  },

  _matchRoute(path) {
    for (const [pattern, config] of Object.entries(ROUTES)) {
      const params = this._extractParams(pattern, path)
      if (params) {
        return {
          route: pattern,
          handler: config.handler,
          requiresAuth: config.auth,
          params
        }
      }
    }
    return null
  },

  _extractParams(pattern, path) {
    const patternParts = pattern.split('/')
    const pathParts = path.split('/')

    if (patternParts.length !== pathParts.length) return null

    const params = {}

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].slice(1)
        params[paramName] = pathParts[i]
      } else if (patternParts[i] !== pathParts[i]) {
        return null
      }
    }

    return params
  },

  _sanitizeParams(params) {
    const sanitized = {}

    for (const [key, value] of Object.entries(params)) {
      // Remove potentially dangerous characters
      const cleanKey = key.replace(/[<>"'&]/g, '')
      const cleanValue = String(value).replace(/[<>"'&]/g, '').slice(0, 1000)
      sanitized[cleanKey] = cleanValue
    }

    return sanitized
  }
}
```

## Registering Deep Link Handler

```javascript
// alloy.js
const { DeepLinkService } = require('services/deepLinkService')

// iOS: Handle app launch from deep link
if (Ti.App.getArguments().url) {
  DeepLinkService.handle(Ti.App.getArguments().url)
}

// Handle deep links while app is running
Ti.App.addEventListener('resumed', (e) => {
  if (e.url) {
    DeepLinkService.handle(e.url)
  }
})

// Android: Handle intent
if (OS_ANDROID) {
  const activity = Ti.Android.currentActivity
  const intent = activity.intent

  if (intent && intent.data) {
    DeepLinkService.handle(intent.data)
  }

  activity.addEventListener('newintent', (e) => {
    if (e.intent && e.intent.data) {
      DeepLinkService.handle(e.intent.data)
    }
  })
}
```

## Jailbreak/Root Detection

### Detection Service

```javascript
// lib/services/securityService.js
const logger = require('services/logger')

exports.SecurityService = {
  /**
   * Check if device is jailbroken (iOS) or rooted (Android)
   * @returns {{compromised: boolean, reasons: string[]}}
   */
  checkDeviceIntegrity() {
    const reasons = []

    if (OS_IOS) {
      reasons.push(...this._checkiOSJailbreak())
    } else {
      reasons.push(...this._checkAndroidRoot())
    }

    if (reasons.length > 0) {
      logger.warn('Security', 'Device integrity check failed', { reasons })
    }

    return {
      compromised: reasons.length > 0,
      reasons
    }
  },

  _checkiOSJailbreak() {
    const reasons = []
    const file = Ti.Filesystem.getFile

    // Check for common jailbreak files
    const jailbreakPaths = [
      '/Applications/Cydia.app',
      '/Library/MobileSubstrate/MobileSubstrate.dylib',
      '/bin/bash',
      '/usr/sbin/sshd',
      '/etc/apt',
      '/private/var/lib/apt/',
      '/usr/bin/ssh'
    ]

    jailbreakPaths.forEach(path => {
      try {
        if (file(path).exists()) {
          reasons.push(`Jailbreak file found: ${path}`)
        }
      } catch (e) {
        // File access error might indicate sandbox bypass attempt
      }
    })

    // Check if we can write outside sandbox
    try {
      const testFile = file('/private/jailbreak_test')
      testFile.write('test')
      testFile.deleteFile()
      reasons.push('Sandbox bypass detected')
    } catch (e) {
      // Expected - sandbox is working
    }

    return reasons
  },

  _checkAndroidRoot() {
    const reasons = []
    const file = Ti.Filesystem.getFile

    // Check for su binary
    const suPaths = [
      '/system/app/Superuser.apk',
      '/sbin/su',
      '/system/bin/su',
      '/system/xbin/su',
      '/data/local/xbin/su',
      '/data/local/bin/su',
      '/system/sd/xbin/su',
      '/system/bin/failsafe/su',
      '/data/local/su'
    ]

    suPaths.forEach(path => {
      try {
        if (file(path).exists()) {
          reasons.push(`Root binary found: ${path}`)
        }
      } catch (e) {
        // Ignore access errors
      }
    })

    // Check for root management apps
    const rootApps = [
      'com.topjohnwu.magisk',
      'com.koushikdutta.superuser',
      'com.noshufou.android.su',
      'eu.chainfire.supersu'
    ]

    // Note: Checking installed packages requires additional permissions
    // This is a simplified check

    // Check build tags
    const buildTags = Ti.Platform.model
    if (buildTags && buildTags.includes('test-keys')) {
      reasons.push('Test build detected')
    }

    return reasons
  },

  /**
   * Enforce security policy based on device integrity
   */
  enforceSecurityPolicy() {
    const { compromised, reasons } = this.checkDeviceIntegrity()

    if (!compromised) return true

    // Log security event
    logger.error('Security', 'Compromised device detected', {
      reasons,
      platform: Ti.Platform.osname,
      model: Ti.Platform.model
    })

    // Get configured policy
    const policy = Alloy.CFG.securityPolicy || 'warn'

    switch (policy) {
      case 'block':
        // Prevent app usage
        this._showBlockedScreen()
        return false

      case 'restrict':
        // Disable sensitive features
        Ti.App.Properties.setBool('restrictedMode', true)
        this._showWarning()
        return true

      case 'warn':
      default:
        // Just warn the user
        this._showWarning()
        return true
    }
  },

  _showBlockedScreen() {
    const dialog = Ti.UI.createAlertDialog({
      title: L('security_blocked_title'),
      message: L('security_blocked_msg'),
      buttonNames: [L('close')]
    })

    dialog.addEventListener('click', () => {
      // Close the app (iOS) or minimize (Android)
      if (OS_IOS) {
        Ti.Platform.openURL('prefs:root=General')
      }
    })

    dialog.show()
  },

  _showWarning() {
    Ti.UI.createAlertDialog({
      title: L('security_warning_title'),
      message: L('security_warning_msg'),
      buttonNames: [L('i_understand')]
    }).show()
  }
}
```

## Integrating Security Checks

```javascript
// alloy.js
const { SecurityService } = require('services/securityService')

// Check device integrity at app start
const securityCheck = SecurityService.enforceSecurityPolicy()

if (!securityCheck) {
  // Don't initialize the app
  return
}

// Check again periodically (in case of runtime jailbreak tools)
setInterval(() => {
  SecurityService.checkDeviceIntegrity()
}, 5 * 60 * 1000) // Every 5 minutes
```

## Security Checklist

| Category       | Check                      | Implementation           |
| -------------- | -------------------------- | ------------------------ |
| **Biometrics** | Use ti.identity for auth   | BiometricService wrapper |
| **Biometrics** | Never store biometric data | System handles storage   |
| **Biometrics** | Fallback to password       | Always offer alternative |
| **Deep Links** | Whitelist allowed schemes  | ALLOWED_SCHEMES constant |
| **Deep Links** | Whitelist allowed hosts    | ALLOWED_HOSTS constant   |
| **Deep Links** | Sanitize all parameters    | _sanitizeParams()        |
| **Deep Links** | Check auth requirements    | requiresAuth per route   |
| **Integrity**  | Check for jailbreak/root   | checkDeviceIntegrity()   |
| **Integrity**  | Define security policy     | block/restrict/warn      |
| **Integrity**  | Log security events        | Always log compromises   |
