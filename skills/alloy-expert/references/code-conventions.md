# TSS Styling & Code Conventions

## Module System: CommonJS (NOT ES6 modules)

Titanium uses **CommonJS** for modules. Do NOT use ES6 `import`/`export`:

```javascript
// CORRECT - CommonJS
const { Navigation } = require('services/navigation')
exports.Navigation = { /* ... */ }

// WRONG - ES6 modules (won't work in Titanium)
import { Navigation } from 'services/navigation'
export const Navigation = { /* ... */ }
```

## ES6+ Features (Non-Module)

Use `const`, `let`, destructuring, and template literals. Prefer arrow functions for callbacks and traditional functions for main logic.

```javascript
const loadUserData = (userId) => {
  const user = fetchUser(userId)
  return { ...user, loadedAt: Date.now() }
}
```

## No Semicolons
Omit semicolons at the end of lines (ASI handles it).

```javascript
const users = fetchUsers()
const name = user.name
```

## Styling with TSS

### TSS File Organization

Every controller can have a matching TSS file. Alloy also supports a global `app.tss`.

```
app/styles/
├── app.tss              # Global styles (applied to ALL controllers)
├── index.tss            # Styles for index controller only
└── user/
    ├── profile.tss      # Styles for user/profile controller
    └── settings.tss
```

**Style cascade (priority low → high):**
1. `app.tss` — global base styles
2. `<controller>.tss` — controller-specific styles
3. Theme overrides (`app/themes/<name>/styles/`)

### Selector Types

```tss
/* Element selector — applies to ALL elements of this type */
"Label": { color: '#111827', font: { fontSize: 16 } }
"Window": { backgroundColor: '#ffffff' }
"TextField": { height: 48, borderRadius: 8 }

/* Class selector — reusable, apply via class="..." in XML */
".card": { borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' }
".btn-primary": { backgroundColor: '#2563eb', color: '#fff', height: 48, borderRadius: 8 }
".text-secondary": { color: '#6b7280' }

/* ID selector — unique to one element */
"#loginButton": { bottom: 24, left: 16, right: 16 }
"#headerTitle": { font: { fontSize: 24, fontWeight: 'bold' } }
```

**When to use each:**

| Selector            | Use for                     | Example                |
| ------------------- | --------------------------- | ---------------------- |
| Element (`"Label"`) | App-wide defaults           | Base font, color       |
| Class (`".card"`)   | Reusable patterns (3+ uses) | Cards, buttons, inputs |
| ID (`"#name"`)      | Unique element positioning  | Specific layout needs  |

### Class Selectors in XML

```xml
<!-- Combine multiple classes -->
<View class="card mt-md mx-md">
  <Label class="text-secondary" text="L('subtitle')" />
  <Button class="btn-primary" title="L('action')" />
</View>
```

Classes defined in `app.tss` are available in every controller. Classes in `<controller>.tss` are only available in that controller.

### ID + Class Combined

When an element has both an ID and classes, properties merge with ID taking priority:

```tss
/* app.tss */
".btn-primary": { backgroundColor: '#2563eb', color: '#fff', height: 48 }

/* user/profile.tss */
"#saveButton": { bottom: 24, left: 16, right: 16 }
```

```xml
<!-- Gets btn-primary styles + saveButton positioning -->
<Button id="saveButton" class="btn-primary" title="L('save')" />
```

### Building a Design System in app.tss

Define reusable style classes for consistency:

```tss
/* app.tss — Design System */

/* === Layout === */
".row": { layout: 'horizontal', width: Ti.UI.FILL, height: Ti.UI.SIZE }
".col": { layout: 'vertical', width: Ti.UI.FILL, height: Ti.UI.SIZE }

/* === Spacing === */
".mt-sm": { top: 8 }
".mt-md": { top: 16 }
".mt-lg": { top: 24 }
".mx-md": { left: 16, right: 16 }
".mx-lg": { left: 24, right: 24 }

/* === Typography === */
".text-title": { font: { fontSize: 24, fontWeight: 'bold' } }
".text-body": { font: { fontSize: 16 } }
".text-caption": { font: { fontSize: 14 }, color: '#6b7280' }

/* === Components === */
".card": {
  backgroundColor: '#fff',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#e5e7eb',
  width: Ti.UI.FILL,
  height: Ti.UI.SIZE
}

".input": {
  height: 48,
  width: Ti.UI.FILL,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#d1d5db',
  backgroundColor: '#fff',
  paddingLeft: 12,
  font: { fontSize: 16 }
}

".btn-primary": {
  backgroundColor: '#2563eb',
  color: '#fff',
  height: 48,
  width: Ti.UI.FILL,
  borderRadius: 8,
  font: { fontSize: 16, fontWeight: 'bold' }
}
```

### Complete Example

```xml
<!-- views/feature/list.xml -->
<View id="container">
  <Label id="welcomeLabel" text="L('welcome')" />
</View>
```

```tss
/* styles/feature/list.tss */
"#container": {
  layout: 'vertical',
  height: Ti.UI.SIZE,
  width: Ti.UI.FILL,
  backgroundColor: '#f3f4f6'
}

"#welcomeLabel": {
  left: 16,
  right: 16,
  font: { fontSize: 20, fontWeight: 'bold' },
  color: '#2563eb'
}
```

### Titanium Layout Rules

- Three layout modes: `layout: 'horizontal'`, `layout: 'vertical'`, and composite (default — no `layout` needed)
- NO padding on container Views — use margins on children instead
- `width: Ti.UI.FILL` fills available space, `width: Ti.UI.SIZE` wraps content
- `height: Ti.UI.SIZE` is essential for vertical layouts with dynamic content
- Use percentage widths (`width: '50%'`) for proportional column layouts

## Platform & Device Modifiers
Use TSS platform modifiers instead of writing conditional logic in controllers.

```tss
"#header[platform=ios]": { top: 40 }
"#header[platform=android]": { top: 20 }
"#header[formFactor=tablet]": { top: 80 }
```

## applyProperties() Pattern
Use `applyProperties()` to batch UI updates and minimize bridge crossings for properties not managed by classes.

```javascript
$.nameLabel.applyProperties({
  text: user.name,
  opacity: 1
})
```

## ListView Templates
Always use templates for performance. Never create views dynamically inside list rows.

```javascript
function renderUsers(users) {
  const data = users.map(user => ({
    name: { text: user.name },
    template: 'userTemplate'
  }))
  $.section.items = data
}
```

## Memory Cleanup
Always remove listeners to avoid memory leaks. Implement a `cleanup` function.

```javascript
function cleanup() {
  $.destroy()
  // Remove Ti.App listeners here
}
```

## i18n and Accessibility (a11y)
Use `L()` for all text and always include `accessibilityLabel` for interactive elements.

```xml
<Label text="L('welcome_message')" accessibilityLabel="Welcome Header" />
<ImageView image="/images/user.png" accessibilityLabel="User Profile Picture" />
```

## Percentage-Based Layouts
Use percentage widths in TSS for responsive column layouts.

```xml
<View id="row">
  <View id="colLeft" />
  <View id="colRight" />
</View>
```

```tss
"#row": { layout: 'horizontal', width: Ti.UI.FILL }
"#colLeft": { width: '66.66%', backgroundColor: '#ef4444' }
"#colRight": { width: '33.33%', backgroundColor: '#3b82f6' }
```

## Naming Conventions

### Files and Folders
```
app/
├── controllers/
│   ├── index.js              # camelCase for files
│   ├── user/                 # lowercase folders
│   │   ├── profile.js        # feature-based grouping
│   │   └── settings.js
├── lib/
│   ├── api/
│   │   └── userApi.js        # suffixed with type (Api, Service)
│   ├── services/
│   │   └── authService.js
│   └── helpers/
│       └── dateHelper.js
├── views/
│   ├── index.xml             # match controller path exactly
│   └── user/
│       ├── profile.xml
│       └── settings.xml
```

### Variables and Functions
```javascript
// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_COUNT = 3
const DEFAULT_TIMEOUT = 5000

// Variables: camelCase
const userId = $.args.userId
const isLoading = false
let currentPage = 1

// Functions: camelCase, verb prefix for actions
function loadUserData() { /* ... */ }
function handleLoginClick() { /* ... */ }
function validateEmail(email) { /* ... */ }

// Boolean variables: is/has/should prefix
const isAuthenticated = true
const hasPermission = false
const shouldRefresh = true

// Event handlers: on + Event
function onItemClick(e) { /* ... */ }
function onRefresh() { /* ... */ }
function onSearchChange(e) { /* ... */ }

// Private functions: underscore prefix (optional)
function _calculateTotal(items) { /* ... */ }
```

### Classes and Services
```javascript
// Classes: PascalCase
class UserService {
  constructor() { /* ... */ }
}

// Singleton exports: camelCase instance
exports.userService = new UserService()

// Factory functions: create prefix
function createHTTPClient(config) { /* ... */ }
function createAnimationController() { /* ... */ }
```

### Events and Constants
```javascript
// Event names: namespace:action format
const Events = {
  USER_LOGGED_IN: 'user:loggedIn',
  USER_LOGGED_OUT: 'user:loggedOut',
  CART_UPDATED: 'cart:updated',
  NETWORK_ONLINE: 'network:online'
}

// Error codes: UPPER_SNAKE_CASE
const ErrorCodes = {
  AUTH_ERROR: 'AUTH_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
}
```

## Import/Export Patterns

### Named Exports (Preferred)
```javascript
// lib/api/userApi.js
exports.getUser = async function(id) { /* ... */ }
exports.updateUser = async function(id, data) { /* ... */ }
exports.deleteUser = async function(id) { /* ... */ }

// Usage
const { getUser, updateUser } = require('api/userApi')
```

### Default Export (For Classes/Singletons)
```javascript
// lib/services/logger.js
class Logger {
  debug(tag, message) { /* ... */ }
  info(tag, message) { /* ... */ }
  error(tag, message) { /* ... */ }
}

module.exports = new Logger()

// Usage
const logger = require('services/logger')
```

### Mixed Exports
```javascript
// lib/services/eventBus.js
const _ = require('alloy/underscore')._
const Backbone = require('alloy/backbone')

const EventBus = _.clone(Backbone.Events)

// Named export for event constants
exports.Events = {
  USER_UPDATED: 'user:updated',
  SYNC_COMPLETE: 'sync:complete'
}

// Default export for the bus itself
module.exports = EventBus

// Usage
const EventBus = require('services/eventBus')
const { Events } = EventBus
```

### Re-exports (Barrel Files)
```javascript
// lib/api/index.js - Barrel file
exports.userApi = require('./userApi').userApi
exports.productApi = require('./productApi').productApi
exports.orderApi = require('./orderApi').orderApi

// Usage - cleaner imports
const { userApi, productApi } = require('api')
```

### CommonJS Compatibility
```javascript
// When using native modules that use require()
const SomeNativeModule = require('ti.somemodule')

// Wrap in ES6 service
exports.nativeService = {
  doSomething() {
    return SomeNativeModule.performAction()
  }
}
```

## Async/Promise Patterns

### Async/Await (Preferred)
```javascript
// Service layer - always async
exports.fetchUserProfile = async function(userId) {
  const user = await userApi.getById(userId)
  const preferences = await preferencesApi.getByUser(userId)

  return {
    ...user,
    preferences
  }
}

// Controller - with error handling
async function loadData() {
  setLoading(true)

  try {
    const data = await service.fetchData()
    renderData(data)
  } catch (error) {
    handleError(error)
  } finally {
    setLoading(false)
  }
}
```

### Parallel Requests
```javascript
// When requests are independent - run in parallel
async function loadDashboard() {
  const [user, stats, notifications] = await Promise.all([
    userService.getCurrentUser(),
    statsService.getDashboardStats(),
    notificationService.getUnread()
  ])

  renderDashboard({ user, stats, notifications })
}
```

### Sequential with Dependencies
```javascript
// When each request depends on the previous
async function processOrder(cartId) {
  // 1. Get cart (needed for order)
  const cart = await cartService.getById(cartId)

  // 2. Create order (needs cart data)
  const order = await orderService.create(cart)

  // 3. Process payment (needs order)
  const payment = await paymentService.process(order.id)

  return { order, payment }
}
```

### Error Handling with Specific Catches
```javascript
async function login(email, password) {
  try {
    const result = await authService.login(email, password)
    return result

  } catch (error) {
    // Handle specific error types differently
    if (error.code === 'AUTH_ERROR') {
      showMessage(L('invalid_credentials'))
    } else if (error.code === 'NETWORK_ERROR') {
      showMessage(L('check_connection'))
    } else {
      showMessage(L('unknown_error'))
      logger.error('Login', 'Unexpected error', { error: error.message })
    }

    throw error // Re-throw for caller to handle if needed
  }
}
```

### Converting Callbacks to Promises
```javascript
// Wrap Ti.Network.createHTTPClient in Promise
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const client = Ti.Network.createHTTPClient({
      onload: function() {
        try {
          resolve(JSON.parse(this.responseText))
        } catch (e) {
          reject(new Error('Invalid JSON response'))
        }
      },
      onerror: function(e) {
        reject(new Error(e.error || 'Request failed'))
      },
      timeout: 10000
    })

    client.open('GET', url)
    client.send()
  })
}

// Wrap Ti.Media.showCamera in Promise
function takePhoto() {
  return new Promise((resolve, reject) => {
    Ti.Media.showCamera({
      success: (e) => resolve(e.media),
      cancel: () => reject(new Error('User cancelled')),
      error: (e) => reject(new Error(e.error))
    })
  })
}
```

### Debouncing Async Operations
```javascript
// Useful for search, auto-save, etc.
let searchTimeout = null

function onSearchChange(e) {
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(async () => {
    const query = e.value.trim()

    if (query.length < 2) {
      return renderResults([])
    }

    try {
      const results = await searchService.search(query)
      renderResults(results)
    } catch (error) {
      // Ignore errors for outdated searches
      logger.debug('Search', 'Search failed', { query })
    }
  }, 300)
}

function cleanup() {
  clearTimeout(searchTimeout)
  $.destroy()
}
```

### Retry Pattern
```javascript
async function fetchWithRetry(fn, maxRetries = 3) {
  let lastError

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Exponential backoff
      const delay = Math.pow(2, i) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))

      logger.warn('Retry', `Attempt ${i + 1} failed`, { error: error.message })
    }
  }

  throw lastError
}

// Usage
const data = await fetchWithRetry(() => api.getData())
```
