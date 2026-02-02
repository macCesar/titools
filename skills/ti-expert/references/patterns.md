# Architectural Patterns for Titanium + Alloy

## 1. Native Module Abstraction (Wrapper)

**Use when:** Using native modules like Maps, Biometrics, or specialized Media players.

```javascript
// lib/services/biometricService.js
const Identity = require('ti.identity')

let isAvailable = null

exports.BiometricService = {
  checkAvailability() {
    if (isAvailable !== null) return isAvailable

    isAvailable = Identity.isSupported() &&
      (Identity.deviceCanAuthenticate() === Identity.SUCCESS)

    return isAvailable
  },

  authenticate(reason) {
    return new Promise((resolve, reject) => {
      if (!this.checkAvailability()) {
        return reject(new Error('Biometrics not available'))
      }

      Identity.authenticate({
        reason: reason || L('biometric_reason'),
        callback: (e) => {
          if (e.success) {
            resolve(true)
          } else {
            reject(new Error(e.error || 'Authentication failed'))
          }
        }
      })
    })
  }
}
```

## 2. Repository Pattern for Data

**Use when:** Complex data access, multiple data sources, or need to abstract SQLite/API.

```javascript
// lib/repositories/userRepository.js
const db = Ti.Database.open('app')

exports.UserRepository = {
  getById(id) {
    const rs = db.execute('SELECT * FROM users WHERE id = ?', id)
    const user = rs.isValidRow() ? this._rowToUser(rs) : null
    rs.close()
    return user
  },

  getAll() {
    const rs = db.execute('SELECT * FROM users ORDER BY name')
    const users = []
    while (rs.isValidRow()) {
      users.push(this._rowToUser(rs))
      rs.next()
    }
    rs.close()
    return users
  },

  save(user) {
    if (user.id) {
      db.execute(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        user.name, user.email, user.id
      )
    } else {
      db.execute(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        user.name, user.email
      )
      user.id = db.lastInsertRowId
    }
    return user
  },

  delete(id) {
    db.execute('DELETE FROM users WHERE id = ?', id)
  },

  _rowToUser(rs) {
    return {
      id: rs.fieldByName('id'),
      name: rs.fieldByName('name'),
      email: rs.fieldByName('email')
    }
  }
}
```

## 3. Service Layer Pattern

**Use when:** Business logic, orchestrating multiple operations.

```javascript
// lib/services/authService.js
const authApi = require('api/authApi').authApi
const { TokenStorage } = require('services/tokenStorage')
const { appStore } = require('services/stateStore')
const { Validator } = require('helpers/validator')

exports.AuthService = {
  async login(email, password) {
    // 1. Validate input
    Validator.email(email)
    Validator.password(password)

    // 2. Call API
    const response = await authApi.login({ email, password })

    // 3. Store token securely
    TokenStorage.save(response.token)

    // 4. Update app state
    appStore.setState({
      user: response.user,
      isAuthenticated: true
    })

    return response.user
  },

  async logout() {
    try {
      await authApi.logout()
    } finally {
      TokenStorage.clear()
      appStore.setState({
        user: null,
        isAuthenticated: false
      })
    }
  },

  isAuthenticated() {
    return !!TokenStorage.get()
  }
}
```

## 4. Event Bus for Decoupling

**Use when:** Decoupled modules need to communicate without knowing about each other.

```javascript
// lib/services/eventBus.js
const _ = require('alloy/underscore')._
const Backbone = require('alloy/backbone')

const EventBus = _.clone(Backbone.Events)

// Named events for type safety
const Events = {
  USER_UPDATED: 'user:updated',
  CART_CHANGED: 'cart:changed',
  NETWORK_STATUS: 'network:status',
  SYNC_COMPLETE: 'sync:complete'
}

module.exports = EventBus
module.exports.Events = Events
```

**Usage in controllers:**

```javascript
// controllers/profile.js
const EventBus = require('services/eventBus')
const { Events } = EventBus

function init() {
  EventBus.on(Events.USER_UPDATED, onUserUpdated)
}

function onUserUpdated(user) {
  $.nameLabel.text = user.name
}

function cleanup() {
  EventBus.off(Events.USER_UPDATED, onUserUpdated)
  $.destroy()
}

$.cleanup = cleanup
```

## 5. Factory Pattern for Dynamic Views

**Use when:** Creating similar views with different configurations.

```javascript
// lib/factories/cardFactory.js
exports.createProductCard = function(product) {
  const card = Ti.UI.createView({
    width: Ti.UI.FILL,
    height: 120,
    backgroundColor: '#fff'
  })

  const image = Ti.UI.createImageView({
    image: product.imageUrl,
    width: 80,
    height: 80,
    left: 16
  })

  const title = Ti.UI.createLabel({
    text: product.name,
    left: 112,
    top: 16,
    font: { fontSize: 16, fontWeight: 'bold' }
  })

  const price = Ti.UI.createLabel({
    text: `$${product.price}`,
    left: 112,
    bottom: 16,
    color: '#22c55e'
  })

  card.add(image)
  card.add(title)
  card.add(price)

  // Attach data for event handling
  card.productId = product.id

  return card
}
```

## 6. Navigation Service Pattern

**Use when:** Centralizing navigation with automatic cleanup and history management.

```javascript
// lib/services/navigation.js
const stack = []

exports.Navigation = {
  open(route, params = {}, options = {}) {
    const controller = Alloy.createController(route, params)
    const view = controller.getView()

    // Auto-cleanup on close
    view.addEventListener('close', () => {
      if (typeof controller.cleanup === 'function') {
        controller.cleanup()
      }
      const idx = stack.findIndex(s => s.controller === controller)
      if (idx !== -1) stack.splice(idx, 1)
    })

    stack.push({ route, controller, params })

    if (options.modal) {
      view.open({ modal: true })
    } else if (options.animated === false) {
      view.open({ animated: false })
    } else {
      view.open()
    }

    return controller
  },

  back() {
    const current = stack[stack.length - 1]
    if (current) {
      current.controller.getView().close()
    }
  },

  backTo(route) {
    while (stack.length > 0) {
      const current = stack[stack.length - 1]
      if (current.route === route) break
      current.controller.getView().close()
    }
  },

  replace(route, params = {}) {
    const current = stack.pop()
    if (current) {
      current.controller.getView().close({ animated: false })
    }
    return this.open(route, params, { animated: false })
  },

  getStack() {
    return stack.map(s => s.route)
  }
}
```

## 7. Collection Binding Pattern

**Use when:** Binding API data to ListViews with automatic updates.

```javascript
// alloy.js - Initialize collection
Alloy.Collections.products = new Backbone.Collection()

// controllers/products/list.js
function init() {
  loadProducts()

  // Collection changes auto-update bound ListView
  Alloy.Collections.products.on('reset add remove', onCollectionChange)
}

async function loadProducts() {
  const products = await productApi.getAll()
  Alloy.Collections.products.reset(products)
}

function onCollectionChange() {
  // Optional: Handle empty state
  $.emptyState.visible = Alloy.Collections.products.length === 0
}

function cleanup() {
  Alloy.Collections.products.off('reset add remove', onCollectionChange)
  $.destroy()
}

$.cleanup = cleanup
```

```xml
<!-- views/products/list.xml -->
<ListView id="listView">
  <ListSection dataCollection="products">
    <ListItem title="{name}" subtitle="{description}" />
  </ListSection>
</ListView>
```

## 8. Cleanup Pattern

**Use when:** Preventing memory leaks by removing global listeners.

```javascript
// controllers/dashboard.js
const EventBus = require('services/eventBus')
const { Events } = EventBus
const { appStore } = require('services/stateStore')

// Store references for cleanup
let storeUnsubscribe = null

function init() {
  // Event bus listeners
  EventBus.on(Events.USER_UPDATED, onUserUpdated)
  EventBus.on(Events.SYNC_COMPLETE, onSyncComplete)

  // State store subscription
  storeUnsubscribe = appStore.onChange(onStateChange)

  // Ti.App listeners (avoid if possible, use EventBus)
  Ti.App.addEventListener('pause', onAppPause)
  Ti.App.addEventListener('resume', onAppResume)
}

function cleanup() {
  // Remove all event bus listeners
  EventBus.off(Events.USER_UPDATED, onUserUpdated)
  EventBus.off(Events.SYNC_COMPLETE, onSyncComplete)

  // Unsubscribe from store
  if (storeUnsubscribe) {
    storeUnsubscribe()
    storeUnsubscribe = null
  }

  // Remove Ti.App listeners
  Ti.App.removeEventListener('pause', onAppPause)
  Ti.App.removeEventListener('resume', onAppResume)

  // Destroy Alloy bindings
  $.destroy()
}

// CRITICAL: Expose cleanup
$.cleanup = cleanup
```

## 9. Singleton Service Pattern

**Use when:** Services that should have only one instance app-wide.

```javascript
// lib/services/analyticsService.js
let instance = null

class AnalyticsService {
  constructor() {
    if (instance) {
      return instance
    }

    this.queue = []
    this.isInitialized = false
    instance = this
  }

  init(config) {
    if (this.isInitialized) return

    // Initialize analytics SDK
    this.isInitialized = true

    // Flush queued events
    this.queue.forEach(event => this._send(event))
    this.queue = []
  }

  track(eventName, properties = {}) {
    const event = {
      name: eventName,
      properties,
      timestamp: Date.now()
    }

    if (this.isInitialized) {
      this._send(event)
    } else {
      this.queue.push(event)
    }
  }

  _send(event) {
    // Send to analytics backend
    Ti.API.info(`[Analytics] ${event.name}`, event.properties)
  }
}

exports.Analytics = new AnalyticsService()
