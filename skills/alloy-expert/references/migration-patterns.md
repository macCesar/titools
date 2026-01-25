# Migration Patterns for Legacy Titanium Apps

## Assessment Checklist

Before migrating, evaluate the current codebase:

| Area | Signs of Legacy Code | Target State |
|------|---------------------|--------------|
| Styling | Manual `.tss` files, inline attributes | PurgeTSS utility classes |
| Controllers | 200+ lines, API calls, business logic | Thin orchestrators (<100 lines) |
| Events | `Ti.App.fireEvent` everywhere | Backbone.Events or StateStore |
| Navigation | Direct `Alloy.createController().getView().open()` | Navigation service |
| Data | Scattered `Ti.App.Properties`, no collections | Centralized state + Collections |

## Phase 1: PurgeTSS Integration

**Goal**: Migrate from manual TSS to utility-first styling.

### Step 1: Initialize PurgeTSS

```bash
# In existing project
cd your-app
purgetss init
```

### Step 2: Backup Existing Styles

PurgeTSS automatically backs up `app.tss` to `_app.tss`. Your custom styles are preserved.

### Step 3: Migrate Views Incrementally

```xml
<!-- BEFORE: Manual styling -->
<View id="header">
  <Label id="title" text="Welcome" />
</View>

<!-- styles/index.tss -->
"#header": { backgroundColor: "#fff", height: 60, top: 0 }
"#title": { color: "#333", font: { fontSize: 18, fontWeight: "bold" } }
```

```xml
<!-- AFTER: PurgeTSS classes -->
<View class="bg-white h-16 top-0">
  <Label class="text-gray-800 text-lg font-bold" text="Welcome" />
</View>

<!-- No manual TSS needed - delete #header and #title styles -->
```

### Step 4: Remove Manual TSS Files

Once a view is fully migrated to utility classes:
1. Remove corresponding entries from `_app.tss`
2. Delete any controller-specific `.tss` files
3. Run `purgetss` to regenerate `app.tss`

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
export async function getProfile() {
  return apiClient.get('/profile')
}

// lib/services/userService.js
export async function loadUserProfile() {
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

export function open(route, params = {}, options = {}) {
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

export function back() {
  const current = stack[stack.length - 1]
  if (current) {
    current.controller.getView().close()
  }
}

export function getStack() {
  return [...stack]
}
```

### Step 2: Replace Direct Navigation

```javascript
// BEFORE: Direct navigation (no cleanup)
Alloy.createController('detail', { id: 123 }).getView().open()

// AFTER: Navigation service (auto cleanup)
const navigation = require('lib/services/navigation')
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
import { appStore } from 'lib/services/stateStore'
appStore.setState({ user })

// In any controller
const { user } = appStore.getState()
```

## Migration Order

Recommended sequence to minimize risk:

1. **PurgeTSS** - Visual only, no logic changes
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

| Pitfall | Consequence | Prevention |
|---------|-------------|------------|
| Migrating styles without testing | Broken layouts | Test each view on both platforms |
| Forgetting cleanup functions | Memory leaks | Add cleanup before adding listeners |
| Partial event migration | Duplicate events | Grep for all usages before migrating |
| Breaking navigation flow | Lost state, crashes | Test all navigation paths |
| Rushing state migration | Inconsistent UI | Migrate one state slice at a time |
