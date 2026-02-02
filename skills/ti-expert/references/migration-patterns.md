# Migration Patterns for Legacy Titanium Apps

## Assessment Checklist

Before migrating, evaluate the current codebase:

| Area        | Signs of Legacy Code                               | Target State                                  |
| ----------- | -------------------------------------------------- | --------------------------------------------- |
| Styling     | Inline attributes, scattered styles                | Organized TSS files (per-controller + global) |
| Controllers | 200+ lines, API calls, business logic              | Thin orchestrators (<100 lines)               |
| Events      | `Ti.App.fireEvent` everywhere                      | Backbone.Events or StateStore                 |
| Navigation  | Direct `Alloy.createController().getView().open()` | Navigation service                            |
| Data        | Scattered `Ti.App.Properties`, no collections      | Centralized state + Collections               |

## Phase 1: TSS Organization

**Goal**: Migrate from inline styling and scattered styles to well-organized TSS files.

### Step 1: Audit Existing Styles

Find all inline attributes and consolidate into TSS files:
```bash
# Find inline styling in XML views
grep -r 'backgroundColor=' app/views/
grep -r 'font=' app/views/
grep -r 'color=' app/views/
```

### Step 2: Move Inline Attributes to TSS

```xml
<!-- BEFORE: Inline attributes -->
<View id="header" backgroundColor="#fff" height="60" top="0">
  <Label id="title" text="Welcome" color="#333" font="{fontSize:18, fontWeight:'bold'}" />
</View>
```

```xml
<!-- AFTER: Clean XML + TSS file -->
<View id="header">
  <Label id="title" text="L('welcome')" />
</View>
```

```tss
/* styles/index.tss */
"#header": { backgroundColor: "#fff", height: 60, top: 0 }
"#title": { color: "#333", font: { fontSize: 18, fontWeight: "bold" } }
```

### Step 3: Organize TSS Structure

1. Use `app.tss` for global styles (shared across all views)
2. Use per-controller TSS files for view-specific styles
3. Use class selectors for reusable style patterns:
```tss
/* app.tss - Global reusable styles */
".card": { borderRadius: 12, backgroundColor: '#fff' }
".btn-primary": { backgroundColor: '#2563eb', color: '#fff', height: 44, borderRadius: 8 }
```

## Phase 2: Service Layer Extraction

**Goal**: Move business logic from controllers to services.

### Identify Fat Controllers

Signs of a fat controller:
- API calls with `Ti.Network.createHTTPClient`
- Complex data transformations
- Native module interactions
- 100+ lines of code

### Extract to Services

```javascript
// BEFORE: Fat controller
// controllers/user/profile.js
function loadProfile() {
  const client = Ti.Network.createHTTPClient({
    onload: function() {
      const data = JSON.parse(this.responseText)
      // 50 lines of data transformation...
      updateUI(transformedData)
    },
    onerror: function() {
      // Error handling...
    }
  })
  client.open('GET', 'https://api.example.com/profile')
  client.setRequestHeader('Authorization', 'Bearer ' + token)
  client.send()
}
```

```javascript
// AFTER: Thin controller + Service
// lib/api/userApi.js
exports.getProfile = async function() {
  return apiClient.get('/profile')
}

// lib/services/userService.js
exports.loadUserProfile = async function() {
  const data = await userApi.getProfile()
  return transformProfile(data)
}

// controllers/user/profile.js
async function loadProfile() {
  try {
    const profile = await userService.loadUserProfile()
    updateUI(profile)
  } catch (error) {
    handleError(error)
  }
}
```

## Phase 3: Event System Migration

**Goal**: Replace `Ti.App.fireEvent` with Backbone.Events.

### Step 1: Create Event Bus

```javascript
// alloy.js
Alloy.Events = _.clone(Backbone.Events)
```

### Step 2: Find All Ti.App Event Usage

```bash
# Find all Ti.App.fireEvent calls
grep -r "Ti.App.fireEvent" app/controllers/
grep -r "Ti.App.addEventListener" app/controllers/
```

### Step 3: Migrate Events

```javascript
// BEFORE: Ti.App events (memory leaks, no cleanup)
Ti.App.fireEvent('user:updated', { user: userData })
Ti.App.addEventListener('user:updated', onUserUpdated)

// AFTER: Backbone.Events (proper cleanup)
Alloy.Events.trigger('user:updated', { user: userData })
Alloy.Events.on('user:updated', onUserUpdated)

// In cleanup()
Alloy.Events.off('user:updated', onUserUpdated)
```

### Step 4: Add Cleanup Functions

Every controller that listens to events needs cleanup:

```javascript
// controllers/dashboard.js
function init() {
  Alloy.Events.on('user:updated', refreshUser)
  Alloy.Events.on('data:sync', refreshData)
}

function cleanup() {
  Alloy.Events.off('user:updated', refreshUser)
  Alloy.Events.off('data:sync', refreshData)
  $.destroy()
}

$.cleanup = cleanup
```

## Phase 4: Navigation Service

**Goal**: Centralize navigation with automatic cleanup.

### Step 1: Create Navigation Service

```javascript
// lib/services/navigation.js
const stack = []

exports.open = function(route, params = {}, options = {}) {
  const controller = Alloy.createController(route, params)
  const view = controller.getView()

  // Bind cleanup to close event
  view.addEventListener('close', () => {
    if (controller.cleanup) {
      controller.cleanup()
    }
    stack.pop()
  })

  stack.push({ route, controller })

  if (options.modal) {
    view.open({ modal: true })
  } else {
    view.open()
  }

  return controller
}

exports.back = function() {
  const current = stack[stack.length - 1]
  if (current) {
    current.controller.getView().close()
  }
}

exports.getStack = function() {
  return [...stack]
}
```

### Step 2: Replace Direct Navigation

```javascript
// BEFORE: Direct navigation (no cleanup)
Alloy.createController('detail', { id: 123 }).getView().open()

// AFTER: Navigation service (auto cleanup)
const navigation = require('services/navigation')
navigation.open('detail', { id: 123 })
```

## Phase 5: State Management

**Goal**: Centralize app state for consistency.

### Step 1: Identify Scattered State

Look for:
- `Ti.App.Properties.getString/setString` scattered across controllers
- `Alloy.Globals` for sharing data
- Direct collection access from multiple controllers

### Step 2: Create State Store

See [state-management.md](state-management.md) for full implementation.

### Step 3: Migrate State Access

```javascript
// BEFORE: Scattered state
// In controller A
Ti.App.Properties.setString('user', JSON.stringify(user))

// In controller B
const user = JSON.parse(Ti.App.Properties.getString('user'))

// AFTER: Centralized state
// In service
const { appStore } = require('services/stateStore')
appStore.setState({ user })

// In any controller
const { user } = appStore.getState()
```

## Migration Order

Recommended sequence to minimize risk:

1. **TSS Organization** - Visual only, no logic changes
2. **Service Layer** - Extract logic without changing behavior
3. **Navigation Service** - Centralize with cleanup
4. **Event System** - Replace Ti.App events
5. **State Management** - Last, as it touches everything

## Rollback Strategy

For each phase:

1. **Create a branch** before starting
2. **Migrate one feature** completely
3. **Test thoroughly** before moving to next feature
4. **Keep legacy code** commented until stable

```javascript
// Temporary: Keep both during migration
// Legacy:
// Ti.App.fireEvent('user:updated', data)

// New:
Alloy.Events.trigger('user:updated', data)
```

## Common Migration Pitfalls

| Pitfall                          | Consequence         | Prevention                           |
| -------------------------------- | ------------------- | ------------------------------------ |
| Migrating styles without testing | Broken layouts      | Test each view on both platforms     |
| Forgetting cleanup functions     | Memory leaks        | Add cleanup before adding listeners  |
| Partial event migration          | Duplicate events    | Grep for all usages before migrating |
| Breaking navigation flow         | Lost state, crashes | Test all navigation paths            |
| Rushing state migration          | Inconsistent UI     | Migrate one state slice at a time    |
