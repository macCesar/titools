# Security Fundamentals for Titanium Mobile Apps

## Token Storage Strategy

**NEVER store tokens in:** `Ti.App.Properties` (plaintext), localStorage, or files.

**USE platform-specific secure storage:**

```javascript
// lib/services/tokenStorage.js
exports.TokenStorage = {
  save(token) {
    if (Ti.Platform.osname === 'android') {
      // Use Android KeyStore
      const keyStore = Ti.Android.createKeyStore({
        name: 'SecureKeyStore'
      })
      keyStore.addEntry('authToken', token)
    } else {
      // Use iOS Keychain
      Ti.KeychainItem.setItem({
        identifier: 'authToken',
        value: token,
        accessGroup: 'com.yourapp.keychain'
      })
    }
  },

  get() {
    if (Ti.Platform.osname === 'android') {
      const keyStore = Ti.Android.createKeyStore({
        name: 'SecureKeyStore'
      })
      return keyStore.getEntry('authToken')
    } else {
      return Ti.KeychainItem.getItem({
        identifier: 'authToken',
        accessGroup: 'com.yourapp.keychain'
      })
    }
  },

  clear() {
    if (Ti.Platform.osname === 'android') {
      const keyStore = Ti.Android.createKeyStore({
        name: 'SecureKeyStore'
      })
      keyStore.removeEntry('authToken')
    } else {
      Ti.KeychainItem.removeItem({
        identifier: 'authToken',
        accessGroup: 'com.yourapp.keychain'
      })
    }
  }
}
```

## Certificate Pinning

Prevent man-in-the-middle attacks by pinning SSL certificates:

```javascript
// lib/api/pinnedClient.js
exports.createPinnedClient = function() {
  const client = Ti.Network.createHTTPClient({
    // Security: Enable certificate pinning
    certificatePinning: true,

    // Specify allowed certificates
    validatesSecureCertificate: true,

    onload: () => {
      // Success
    },

    onerror: (e) => {
      // Certificate validation failed
      if (e.error.indexOf('certificate') >= 0) {
        Ti.API.error('Certificate pinning failed - possible MITM attack')
      }
    }
  })

  return client
}
```

**Add certificates to tiapp.xml:**

```xml
<ti:app>
  <certificates>
    <certificate>
      <name>api.example.com</name>
      <type>rsa</type>
      <file>certificates/api-pin.pem</file>
    </certificate>
  </certificates>
</ti:app>
```

## Data Encryption at Rest

```javascript
// lib/services/encryption.js
// AES-256 encryption for sensitive local data

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

// Usage: Secure cache of sensitive user data
module.exports = class SecureCache {
  constructor(encryptionKey) {
    this.key = encryptionKey
    this.cache = {}
  }

  set(key, value) {
    const encrypted = encrypt(JSON.stringify(value), this.key)
    this.cache[key] = encrypted
  }

  get(key) {
    if (!this.cache[key]) return null

    const decrypted = decrypt(this.cache[key], this.key)
    return JSON.parse(decrypted)
  }

  clear() {
    this.cache = {}
  }
}
```

## Secure HTTP Communication

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

## Authentication Token Refresh Pattern

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

## Input Validation

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

## OWASP Mobile Security Checklist

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
