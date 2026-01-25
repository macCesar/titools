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
import Backbone from 'alloy/backbone'

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
export const appStore = new StateStore()
```

## State Store Usage

### Initialization in alloy.js

```javascript
// alloy.js
import { appStore } from 'lib/services/stateStore'
import { TokenStorage } from 'lib/services/tokenStorage'

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
import { appStore } from 'lib/services/stateStore'

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
import { appStore } from 'lib/services/stateStore'
import { TokenStorage } from 'lib/services/tokenStorage'
import * as api from 'lib/api/authApi'

export async function login(email, password) {
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

export async function logout() {
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
import { appStore } from 'lib/services/stateStore'

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

export const userService = new UserService()
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
import { appStore } from 'lib/services/stateStore'

export function syncWithServer() {
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

| Anti-Pattern | Why It's Bad | Solution |
|--------------|--------------|----------|
| `Ti.App.fireEvent` for state | No cleanup, memory leaks | Use StateStore with `offChange` |
| Direct collection mutation | Bypasses reactivity | Use collection methods (`add`, `remove`) |
| State in multiple places | Inconsistency bugs | Single source of truth |
| Global variables (`Alloy.Globals`) | No reactivity, hard to track | Use StateStore |
| Controller-to-controller direct calls | Tight coupling | Use StateStore or events |
