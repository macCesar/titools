# Migration patterns for legacy Titanium apps

<!-- TOC-START -->
## Contents

- [Assessment checklist](#assessment-checklist)
- [Phase 1: styling-system organization](#phase-1-styling-system-organization)
- [Phase 1B: feedback surfaces](#phase-1b-feedback-surfaces)
- [Phase 2: service layer extraction](#phase-2-service-layer-extraction)
- [Phase 3: event system migration](#phase-3-event-system-migration)
- [Phase 4: navigation service](#phase-4-navigation-service)
- [Phase 5: state management](#phase-5-state-management)
- [Migration order](#migration-order)
- [Rollback strategy](#rollback-strategy)
- [Common migration pitfalls](#common-migration-pitfalls)

<!-- TOC-END -->

## Assessment checklist

Before migrating, evaluate the current codebase:

| Area        | Signs of Legacy Code                               | Target State                                  |
| ----------- | -------------------------------------------------- | --------------------------------------------- |
| Styling     | Inline attributes, scattered styles                | PurgeTSS utilities when detected; otherwise organized Alloy TSS |
| Controllers | 200+ lines, API calls, business logic              | Thin orchestrators (<100 lines)               |
| Events      | `Ti.App.fireEvent` everywhere                      | Backbone.Events or StateStore                 |
| Navigation  | Direct `Alloy.createController().getView().open()` | Navigation service                            |
| Data        | Scattered `Ti.App.Properties`, no collections      | Centralized state + Collections               |

## Phase 1: styling-system organization

**Goal**: Migrate from inline and scattered styling into the styling system the
project actually uses.

### Step 0: detect PurgeTSS

Check for `purgetss/` or `purgetss/config.cjs` before editing styles.

- **PurgeTSS detected:** invoke the `purgetss` skill, use verified utilities and
  semantic colors, configure reusable rules in `config.cjs`, and never edit the
  generated `app/styles/app.tss`.
- **No PurgeTSS:** use standard per-controller TSS and a manually maintained
  `app/styles/app.tss` for genuinely global selectors.

Do not migrate a PurgeTSS application back into manual TSS by following a generic
Alloy example.

### Step 1: audit existing styles

Find inline attributes and classify them for the detected styling system:
```bash
# Find inline styling in XML views
rg -n 'backgroundColor=|font=|color=' app/views/
```

### Step 2: move inline attributes to TSS

```xml
<!-- BEFORE: Inline attributes -->
<View id="header" backgroundColor="#fff" height="60" top="0">
  <Label id="title" text="Welcome" color="#333" font="{fontSize:18, fontWeight:'bold'}" />
</View>
```

```xml
<!-- AFTER in standard Alloy: clean XML + TSS file -->
<View id="header">
  <Label id="title" text="L('welcome')" />
</View>
```

```tss
/* styles/index.tss */
"#header": { backgroundColor: "#fff", height: 60, top: 0 }
"#title": { color: "#333", font: { fontSize: 18, fontWeight: "bold" } }
```

### Step 3: organize standard Alloy TSS

This step applies only when PurgeTSS is not present.

1. Use `app.tss` for genuinely global styles shared across views
2. Use per-controller TSS files for view-specific styles
3. Use class selectors for reusable style patterns:
```tss
/* app.tss - Global reusable styles */
".card": { borderRadius: 12, backgroundColor: '#fff' }
".btn-primary": { backgroundColor: '#2563eb', color: '#fff', height: 44, borderRadius: 8 }
```

In either styling path, replace hard-coded visual colors with semantic roles as
part of the migration. See [Theming and Dark Mode](theming.md).

## Phase 1B: feedback surfaces

Inventory native alerts, option dialogs, Toasts, and local overlays. Classify
each occurrence before replacing it, then migrate one window at a time. Preserve
system-owned pickers, permission prompts, sharing, and biometric UI.

Use [Feedback Migration](feedback-migration.md) for the sequence, deliberate
silence rules, and verification contract.

## Phase 2: service layer extraction

**Goal**: Move business logic from controllers to services.

### Identify fat controllers

Signs of a fat controller:
- API calls with `Ti.Network.createHTTPClient`
- Complex data transformations
- Native module interactions
- 100+ lines of code

### Extract to services

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

## Phase 3: event system migration

**Goal**: Replace `Ti.App.fireEvent` with Backbone.Events.

### Step 1: create event bus

```javascript
// alloy.js
Alloy.Events = _.clone(Backbone.Events)
```

### Step 2: find all Ti.App event usage

```bash
# Find all Ti.App.fireEvent calls
grep -r "Ti.App.fireEvent" app/controllers/
grep -r "Ti.App.addEventListener" app/controllers/
```

### Step 3: migrate events

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

### Step 4: add cleanup functions

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

## Phase 4: navigation service

**Goal**: Centralize navigation with automatic cleanup.

### Step 1: create navigation service

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

### Step 2: replace direct navigation

```javascript
// BEFORE: Direct navigation (no cleanup)
Alloy.createController('detail', { id: 123 }).getView().open()

// AFTER: Navigation service (auto cleanup)
const navigation = require('services/navigation')
navigation.open('detail', { id: 123 })
```

## Phase 5: state management

**Goal**: Centralize app state for consistency.

### Step 1: identify scattered state

Look for:
- `Ti.App.Properties.getString/setString` scattered across controllers
- `Alloy.Globals` for sharing data
- Direct collection access from multiple controllers

### Step 2: create state store

See [state-management.md](state-management.md) for full implementation.

### Step 3: migrate state access

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

## Migration order

Recommended sequence to minimize risk:

1. **Styling-system organization** - Establish semantic tokens and the correct PurgeTSS/Alloy path
2. **Feedback surfaces** - Migrate one window without changing domain outcomes
3. **Service Layer** - Extract logic without changing behavior
4. **Navigation Service** - Centralize with cleanup
5. **Event System** - Replace Ti.App events
6. **State Management** - Last, as it touches everything

## Rollback strategy

For each phase:

1. **Create a branch** before starting
2. **Migrate one feature** completely
3. **Test thoroughly** before moving to next feature
4. **Delete the replaced implementation** after the vertical slice passes

Use version control for rollback. Do not keep commented legacy implementations:
they conceal duplicate listeners, stale callbacks, and incomplete migrations.

## Common migration pitfalls

| Pitfall                          | Consequence         | Prevention                           |
| -------------------------------- | ------------------- | ------------------------------------ |
| Migrating styles without testing | Broken layouts      | Test each view on both platforms     |
| Forgetting cleanup functions     | Memory leaks        | Add cleanup before adding listeners  |
| Partial event migration          | Duplicate events    | Grep for all usages before migrating |
| Breaking navigation flow         | Lost state, crashes | Test all navigation paths            |
| Rushing state migration          | Inconsistent UI     | Migrate one state slice at a time    |
