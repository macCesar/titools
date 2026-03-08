# Security fundamentals for Titanium mobile apps

## Token storage strategy

**NEVER store tokens in:** `Ti.App.Properties` (plaintext), localStorage, or files.

**USE the `ti.identity` module** — it handles iOS Keychain and Android Keystore through a unified API. Both platforms use `Identity.createKeychainItem()`.

```javascript
// lib/services/tokenStorage.js
const Identity = require('ti.identity')

// Create a keychainItem once per identifier
function createItem(identifier) {
  return Identity.createKeychainItem({ identifier })
}

exports.TokenStorage = {
  save(token) {
    return new Promise((resolve, reject) => {
      const item = createItem('authToken')
      item.addEventListener('save', (e) => {
        e.success ? resolve() : reject(new Error(e.error))
      })
      item.save(token)
    })
  },

  get() {
    return new Promise((resolve, reject) => {
      const item = createItem('authToken')
      item.addEventListener('read', (e) => {
        e.success ? resolve(e.value) : reject(new Error(e.error))
      })
      item.read()
    })
  },

  clear() {
    return new Promise((resolve, reject) => {
      const item = createItem('authToken')
      item.addEventListener('reset', (e) => {
        e.success ? resolve() : reject(new Error(e.error))
      })
      item.reset()
    })
  }
}
```

> Verified against official `ti.identity` module docs. `Identity.createKeychainItem({identifier})` is the cross-platform API — it maps to iOS Keychain and Android Keystore automatically. `Ti.Android.createKeyStore()` and `Ti.KeychainItem.setItem()` do NOT exist.

## Certificate pinning

Prevent man-in-the-middle attacks by pinning SSL certificates using the **`ti.https` module** (community module — not built into the SDK):

```javascript
// lib/api/pinnedClient.js
// Requires: ti.https module — install via npm or tiapp.xml modules section
const HTTPS = require('ti.https')

const securityManager = HTTPS.createX509CertificatePinningSecurityManager([
  {
    url: 'https://api.example.com',
    serverCertificate: Ti.Filesystem.getFile(
      Ti.Filesystem.resourcesDirectory, 'certificates/api-pin.pem'
    ).read()
  }
])

exports.createPinnedClient = function(options = {}) {
  return Ti.Network.createHTTPClient({
    securityManager,           // must be set at creation time
    validatesSecureCertificate: true,
    timeout: 10000,
    ...options
  })
}
```

> `certificatePinning: true` is NOT a valid `HTTPClient` property. Certificate pinning requires the `ti.https` module and must be set via the `securityManager` property when creating the client. Note that the `validatesSecureCertificate` property of `HTTPClient` is not honored for pinned URLs — the security manager takes precedence.

## Data encryption at rest

> **Community pattern** — `ti.crypto` is a third-party community module (not part of the Titanium SDK core). Verify availability and compatibility before using in production.

```javascript
// lib/services/encryption.js
// AES-256 encryption for sensitive local data
// Requires: ti.crypto community module

const crypto = require('ti.crypto')

exports.encrypt = function(data, key) {
  return crypto.encrypt({
    data: data,
    key: key,
    algorithm: crypto.AES_256_CBC,
    options: { mode: crypto.CBC }
  })
}

exports.decrypt = function(encryptedData, key) {
  return crypto.decrypt({
    data: encryptedData,
    key: key,
    algorithm: crypto.AES_256_CBC,
    options: { mode: crypto.CBC }
  })
}
```

## Secure HTTP communication

```javascript
// lib/api/secureClient.js
exports.createSecureClient = function(baseUrl) {
  return {
    request(method, endpoint, data = null) {
      return new Promise((resolve, reject) => {
        const client = Ti.Network.createHTTPClient({
          timeout: 10000,

          onload: function() {
            if (this.status === 200) {
              try {
                resolve(JSON.parse(this.responseText))
              } catch (e) {
                reject(new Error('Invalid JSON response'))
              }
            } else {
              reject(new Error(`HTTP ${this.status}`))
            }
          },

          onerror: function(e) {
            // Log security events
            if (this.status === 401 || this.status === 403) {
              Ti.API.warn(`[SECURITY] Unauthorized: ${endpoint}`)
            }
            reject(e)
          }
        })

        client.open(method, `${baseUrl}${endpoint}`)

        // Security headers
        client.setRequestHeader('User-Agent', `MyApp/${Ti.App.version}`)
        client.setRequestHeader('Accept', 'application/json')
        client.setRequestHeader('Content-Type', 'application/json')

        client.send(data ? JSON.stringify(data) : null)
      })
    },

    get(endpoint) {
      return this.request('GET', endpoint)
    },

    post(endpoint, data) {
      return this.request('POST', endpoint, data)
    }
  }
}
```

## Authentication token refresh pattern

```javascript
// lib/services/authService.js
const { TokenStorage } = require('services/tokenStorage')

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes before expiry

exports.refreshAuthToken = async function() {
  const refreshToken = TokenStorage.get('refreshToken')

  const response = await api.post('/auth/refresh', {
    refresh_token: refreshToken
  })

  TokenStorage.save(response.access_token)

  // Set up auto-refresh
  scheduleTokenRefresh(response.expires_in)
}

function scheduleTokenRefresh(expiresIn) {
  const refreshTime = expiresIn - TOKEN_REFRESH_THRESHOLD

  setTimeout(() => {
    refreshAuthToken().catch(() => {
      // Refresh failed - redirect to login
      Alloy.createController('login').getView().open()
    })
  }, refreshTime)
}
```

## Input validation

```javascript
// lib/services/validator.js
exports.Validator = {
  email(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(email)) {
      throw new ValidationError('Invalid email format')
    }
    return email.trim().toLowerCase()
  },

  password(password) {
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters')
    }
    // Add more rules as needed
    return password
  },

  sanitizeInput(input) {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>\"']/g, '')
      .trim()
  }
}
```

## Owasp mobile security checklist

| Category             | Check                       | Implementation                     |
| -------------------- | --------------------------- | ---------------------------------- |
| **Data Storage**     | Credentials stored securely | Keychain/KeyStore for tokens       |
| **Data Storage**     | Sensitive data encrypted    | AES-256 for cached data            |
| **Communication**    | HTTPS only                  | `validatesSecureCertificate: true` |
| **Communication**    | Certificate pinning         | SSL pinning enabled                |
| **Authentication**   | Token refresh               | Auto-refresh before expiry         |
| **Authentication**   | Session timeout             | Auto-logout after inactivity       |
| **Input Validation** | Server-side validation      | Never trust client input           |
| **Input Validation** | Sanitize user input         | Remove XSS patterns                |
| **Cryptography**     | No hardcoded keys           | Keys from secure storage           |
| **Cryptography**     | Use standard algorithms     | AES-256, SHA-256                   |
