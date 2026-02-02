# State Management Patterns

## The Problem

As apps grow, state gets scattered:
- `Alloy.Collections` scattered across controllers
- `Ti.App.Properties` for persistence
- Global variables in `alloy.js`
- Service-level caches

This leads to:
- Duplicated state sources
- Inconsistent UI updates
- Difficult debugging

## Solution: Centralized State Store

Create a single source of truth using Backbone.Events:

```javascript
// lib/services/stateStore.js
const Backbone = require('alloy/backbone')

class StateStore {
  constructor() {
    // Internal state
    this.state = {
      user: null,
      authToken: null,
      preferences: {},
      ui: {
        isLoading: false,
        currentRoute: null
      }
    }

    // Event bus for reactivity
    this.events = _.clone(Backbone.Events)
  }

  // Get current state (immutable)
  getState() {
    return { ...this.state }
  }

  // Update state and notify listeners
  setState(updates) {
    const oldState = this.getState()
    this.state = { ...this.state, ...updates }

    // Emit change event
    this.events.trigger('change', this.state, oldState)
  }

  // Listen to specific state changes
  onChange(callback) {
    this.events.on('change', callback)
  }

  // Remove listener
  offChange(callback) {
    this.events.off('change', callback)
  }

  // Listen to specific property
  onPropertyChange(property, callback) {
    this.events.on('change', (newState, oldState) => {
      if (newState[property] !== oldState[property]) {
        callback(newState[property], oldState[property])
      }
    })
  }
}

// Singleton instance
exports.appStore = new StateStore()
```

## State Store Usage

### Initialization in alloy.js

```javascript
// alloy.js
const { appStore } = require('services/stateStore')
const { TokenStorage } = require('services/tokenStorage')

// Initialize store from persisted data
function initAppStore() {
  const token = TokenStorage.get('authToken')
  const userJson = Ti.App.Properties.getString('user')

  if (token && userJson) {
    appStore.setState({
      authToken: token,
      user: JSON.parse(userJson)
    })
  }
}

initAppStore()
```

### Using State in Controllers

```javascript
// controllers/home/index.js
const { appStore } = require('services/stateStore')

function init() {
  // Get current state
  const state = appStore.getState()

  if (state.user) {
    updateUIForUser(state.user)
  }

  // Listen for state changes
  appStore.onChange((newState) => {
    if (newState.user !== state.user) {
      updateUIForUser(newState.user)
    }
  })

  // Listen to specific property
  appStore.onPropertyChange('ui', (ui) => {
    if (ui.isLoading) {
      $.loadingIndicator.show()
    } else {
      $.loadingIndicator.hide()
    }
  })
}

function cleanup() {
  // Always remove listeners
  appStore.offChange()
  $.destroy()
}
```

### Updating State from Services

```javascript
// lib/services/authService.js
const { appStore } = require('services/stateStore')
const { TokenStorage } = require('services/tokenStorage')
const api = require('api/authApi')

exports.login = async function(email, password) {
  appStore.setState({
    'ui.isLoading': true
  })

  try {
    const response = await api.login(email, password)

    // Update store
    appStore.setState({
      user: response.user,
      authToken: response.token,
      'ui.isLoading': false
    })

    // Persist
    TokenStorage.save(response.token)
    Ti.App.Properties.setString('user', JSON.stringify(response.user))

    return response.user

  } catch (error) {
    appStore.setState({
      'ui.isLoading': false
    })
    throw error
  }
}

exports.logout = async function() {
  // Clear store
  appStore.setState({
    user: null,
    authToken: null
  })

  // Clear persistence
  TokenStorage.clear()
  Ti.App.Properties.removeProperty('user')
}
```

## Service Layer State Caching

Services can maintain their own cached state:

```javascript
// lib/services/userService.js
const { appStore } = require('services/stateStore')

class UserService {
  constructor() {
    this.cache = new Map()
  }

  async getProfile(userId) {
    // Check cache first
    if (this.cache.has(userId)) {
      return this.cache.get(userId)
    }

    // Fetch from API
    const profile = await api.getUserProfile(userId)

    // Cache it
    this.cache.set(userId, profile)

    return profile
  }

  invalidateCache(userId) {
    this.cache.delete(userId)
  }

  clearAllCache() {
    this.cache.clear()
  }
}

exports.userService = new UserService()
```

## Collections vs State Store

**Use Alloy.Collections when:**
- Data is list-based (users, items, messages)
- You need data binding in views
- Data comes from API or SQLite

**Use State Store when:**
- Data is app-wide state (user, auth, settings)
- You need reactive updates across controllers
- Data is not list-based

You can use both together:

```javascript
// Good: Collections for data, Store for UI state
appStore.setState({ 'ui.isLoading': true })

Alloy.Collections.users.fetch({
  success: () => {
    appStore.setState({ 'ui.isLoading': false })
  }
})
```

## State Synchronization Pattern

When state needs to sync with server:

```javascript
// lib/services/syncService.js
const { appStore } = require('services/stateStore')

exports.syncWithServer = function() {
  const localState = appStore.getState()

  return api.syncState(localState)
    .then((serverState) => {
      // Merge server state with local
      appStore.setState(serverState)
    })
}

// Auto-sync on app resume
Ti.App.addEventListener('resume', () => {
  syncWithServer().catch(console.error)
})
```

## Anti-Patterns

| Anti-Pattern                          | Why It's Bad                 | Solution                                 |
| ------------------------------------- | ---------------------------- | ---------------------------------------- |
| `Ti.App.fireEvent` for state          | No cleanup, memory leaks     | Use StateStore with `offChange`          |
| Direct collection mutation            | Bypasses reactivity          | Use collection methods (`add`, `remove`) |
| State in multiple places              | Inconsistency bugs           | Single source of truth                   |
| Global variables (`Alloy.Globals`)    | No reactivity, hard to track | Use StateStore                           |
| Controller-to-controller direct calls | Tight coupling               | Use StateStore or events                 |

## Persistence Strategies

### Ti.App.Properties (Simple Key-Value)

Best for: User preferences, flags, simple settings.

```javascript
// lib/services/preferences.js
exports.Preferences = {
  // Simple getters/setters with defaults
  get(key, defaultValue = null) {
    const value = Ti.App.Properties.getString(key, null)
    return value ? JSON.parse(value) : defaultValue
  },

  set(key, value) {
    Ti.App.Properties.setString(key, JSON.stringify(value))
  },

  remove(key) {
    Ti.App.Properties.removeProperty(key)
  },

  // Typed helpers
  getBool(key, defaultValue = false) {
    return Ti.App.Properties.getBool(key, defaultValue)
  },

  setBool(key, value) {
    Ti.App.Properties.setBool(key, value)
  },

  getInt(key, defaultValue = 0) {
    return Ti.App.Properties.getInt(key, defaultValue)
  },

  setInt(key, value) {
    Ti.App.Properties.setInt(key, value)
  }
}

// Usage
Preferences.set('userPrefs', { theme: 'dark', notifications: true })
const prefs = Preferences.get('userPrefs', { theme: 'light' })
```

**Limitations:**
- Not suitable for large data (>1MB)
- No querying capability
- Synchronous I/O can block UI

### SQLite (Structured Data)

Best for: Lists, searchable data, offline-first apps.

```javascript
// lib/services/database.js
const DB_NAME = 'myapp.db'
const DB_VERSION = 1

exports.Database = {
  _db: null,

  open() {
    if (this._db) return this._db

    this._db = Ti.Database.open(DB_NAME)
    this._migrate()

    return this._db
  },

  close() {
    if (this._db) {
      this._db.close()
      this._db = null
    }
  },

  _migrate() {
    const currentVersion = Preferences.getInt('dbVersion', 0)

    if (currentVersion < 1) {
      this._db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE,
          created_at INTEGER DEFAULT (strftime('%s', 'now'))
        )
      `)
      this._db.execute(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`)
    }

    // Add more migrations as needed
    // if (currentVersion < 2) { ... }

    Preferences.setInt('dbVersion', DB_VERSION)
  },

  // CRUD operations
  query(sql, params = []) {
    const db = this.open()
    const rows = db.execute(sql, ...params)
    const results = []

    while (rows.isValidRow()) {
      const row = {}
      for (let i = 0; i < rows.fieldCount; i++) {
        row[rows.fieldName(i)] = rows.field(i)
      }
      results.push(row)
      rows.next()
    }

    rows.close()
    return results
  },

  execute(sql, params = []) {
    const db = this.open()
    db.execute(sql, ...params)
    return db.rowsAffected
  }
}
```

### Hybrid Strategy (Recommended)

```javascript
// lib/services/stateStore.js
const { Preferences } = require('./preferences')
const { Database } = require('./database')

exports.appStore = {
  _state: {},
  _subscribers: [],

  // Initialize from persisted data
  async init() {
    // Load preferences (fast)
    this._state.preferences = Preferences.get('appPreferences', {
      theme: 'system',
      language: 'en'
    })

    // Load auth state from secure storage
    this._state.auth = {
      token: await TokenStorage.get(),
      user: Preferences.get('currentUser', null)
    }

    // Heavy data loaded on-demand from SQLite
    this._state.lists = {
      loaded: false,
      items: []
    }
  },

  // Persist specific state slices
  persist(slice) {
    switch (slice) {
      case 'preferences':
        Preferences.set('appPreferences', this._state.preferences)
        break
      case 'user':
        Preferences.set('currentUser', this._state.auth.user)
        break
      case 'lists':
        // Lists go to SQLite
        this._state.lists.items.forEach(item => {
          Database.execute(
            'INSERT OR REPLACE INTO items (id, name, data) VALUES (?, ?, ?)',
            [item.id, item.name, JSON.stringify(item)]
          )
        })
        break
    }
  }
}
```

### Choosing a Strategy

| Data Type          | Strategy            | Reason                 |
| ------------------ | ------------------- | ---------------------- |
| User preferences   | Ti.App.Properties   | Simple key-value, fast |
| Auth tokens        | Keychain/KeyStore   | Security               |
| User profile       | Properties + Secure | Mixed sensitivity      |
| Lists (100+ items) | SQLite              | Query, pagination      |
| Offline queue      | SQLite              | Durability, FIFO       |
| Cache              | In-memory + SQLite  | Speed + persistence    |

## State Middleware

### Logger Middleware

```javascript
// lib/services/stateStore.js
class StateStore {
  constructor() {
    this._state = {}
    this._middleware = []
    this._subscribers = []
  }

  use(middleware) {
    this._middleware.push(middleware)
    return this
  }

  setState(updates) {
    const oldState = { ...this._state }
    const action = { type: 'SET_STATE', payload: updates }

    // Run middleware chain
    let finalUpdates = updates

    for (const middleware of this._middleware) {
      const result = middleware(oldState, action, finalUpdates)
      if (result === false) {
        // Middleware can block state changes
        return
      }
      if (result && typeof result === 'object') {
        finalUpdates = result
      }
    }

    // Apply state change
    this._state = { ...this._state, ...finalUpdates }

    // Notify subscribers
    this._subscribers.forEach(sub => sub(this._state, oldState))
  }
}

// Logger middleware
const loggerMiddleware = (oldState, action, updates) => {
  if (Alloy.CFG.debug) {
    console.log('[State]', action.type, {
      updates,
      oldState,
      timestamp: new Date().toISOString()
    })
  }
  return updates
}

// Validation middleware
const validationMiddleware = (oldState, action, updates) => {
  // Validate state shape
  if (updates.user && !updates.user.id) {
    console.warn('[State] Invalid user object - missing id')
    return false // Block update
  }
  return updates
}

// Persistence middleware
const persistMiddleware = (oldState, action, updates) => {
  // Auto-persist certain keys
  const persistKeys = ['preferences', 'user']

  Object.keys(updates).forEach(key => {
    if (persistKeys.includes(key)) {
      Preferences.set(key, updates[key])
    }
  })

  return updates
}

// Setup
exports.appStore = new StateStore()
appStore
  .use(loggerMiddleware)
  .use(validationMiddleware)
  .use(persistMiddleware)
```

### Action-Based State Updates

```javascript
// lib/services/stateStore.js
const reducers = {
  'user/login': (state, payload) => ({
    ...state,
    auth: {
      isAuthenticated: true,
      user: payload.user,
      token: payload.token
    }
  }),

  'user/logout': (state) => ({
    ...state,
    auth: {
      isAuthenticated: false,
      user: null,
      token: null
    }
  }),

  'cart/add': (state, payload) => ({
    ...state,
    cart: {
      items: [...state.cart.items, payload.item],
      total: state.cart.total + payload.item.price
    }
  }),

  'cart/remove': (state, payload) => {
    const item = state.cart.items.find(i => i.id === payload.itemId)
    return {
      ...state,
      cart: {
        items: state.cart.items.filter(i => i.id !== payload.itemId),
        total: state.cart.total - (item?.price || 0)
      }
    }
  }
}

class StateStore {
  dispatch(action, payload) {
    const reducer = reducers[action]

    if (!reducer) {
      console.warn(`[State] Unknown action: ${action}`)
      return
    }

    const oldState = { ...this._state }
    this._state = reducer(this._state, payload)

    // Run middleware
    for (const middleware of this._middleware) {
      middleware(oldState, { type: action, payload }, this._state)
    }

    // Notify subscribers
    this._subscribers.forEach(sub => sub(this._state, oldState))
  }
}

// Usage
appStore.dispatch('user/login', { user: userData, token: authToken })
appStore.dispatch('cart/add', { item: product })
```

## State Debugging

### Debug Helper

```javascript
// lib/services/stateDebug.js
exports.StateDebug = {
  _history: [],
  _maxHistory: 50,

  // Record state change
  record(action, oldState, newState) {
    if (!Alloy.CFG.debug) return

    this._history.push({
      timestamp: Date.now(),
      action,
      oldState: JSON.parse(JSON.stringify(oldState)),
      newState: JSON.parse(JSON.stringify(newState)),
      diff: this._computeDiff(oldState, newState)
    })

    // Trim history
    if (this._history.length > this._maxHistory) {
      this._history.shift()
    }
  },

  // Get state history
  getHistory() {
    return [...this._history]
  },

  // Time travel - get state at specific point
  getStateAt(index) {
    if (index < 0 || index >= this._history.length) return null
    return this._history[index].newState
  },

  // Compute diff between states
  _computeDiff(oldState, newState) {
    const diff = { added: {}, removed: {}, changed: {} }

    // Find changed and added
    Object.keys(newState).forEach(key => {
      if (!(key in oldState)) {
        diff.added[key] = newState[key]
      } else if (JSON.stringify(oldState[key]) !== JSON.stringify(newState[key])) {
        diff.changed[key] = { old: oldState[key], new: newState[key] }
      }
    })

    // Find removed
    Object.keys(oldState).forEach(key => {
      if (!(key in newState)) {
        diff.removed[key] = oldState[key]
      }
    })

    return diff
  },

  // Print current state (for debugging)
  logState() {
    console.log('[State Debug] Current state:', JSON.stringify(appStore.getState(), null, 2))
  },

  // Print history
  logHistory() {
    this._history.forEach((entry, i) => {
      console.log(`[${i}] ${entry.action}:`, entry.diff)
    })
  }
}

// Integrate with store middleware
const debugMiddleware = (oldState, action, newState) => {
  StateDebug.record(action.type, oldState, newState)
  return newState
}

appStore.use(debugMiddleware)
```

### Development Panel

```javascript
// controllers/debug/stateViewer.js (Development only)
const { StateDebug } = require('services/stateDebug')
const { appStore } = require('services/stateStore')

function init() {
  if (!Alloy.CFG.debug) {
    $.getView().close()
    return
  }

  refreshView()

  // Subscribe to state changes
  appStore.onChange(refreshView)
}

function refreshView() {
  const state = appStore.getState()

  // Show state tree
  $.stateTree.text = JSON.stringify(state, null, 2)

  // Show history
  const history = StateDebug.getHistory()
  $.historyList.sections[0].items = history.map((entry, i) => ({
    template: 'historyItem',
    index: { text: String(i) },
    action: { text: entry.action },
    time: { text: new Date(entry.timestamp).toLocaleTimeString() }
  }))
}

function onHistoryItemClick(e) {
  const index = e.itemIndex
  const entry = StateDebug.getHistory()[index]

  // Show diff
  Ti.UI.createAlertDialog({
    title: entry.action,
    message: JSON.stringify(entry.diff, null, 2),
    buttonNames: ['OK']
  }).show()
}

function cleanup() {
  appStore.offChange(refreshView)
  $.destroy()
}

$.cleanup = cleanup
```
