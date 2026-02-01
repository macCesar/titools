# Alloy MVC Structure Reference

## Standard Project Structure

```
app/
├── controllers/           # View orchestrators
│   ├── index.js          # Bootstrap only (no business logic)
│   └── feature/
│       └── list.js       # Controller for list view
├── models/               # OPTIONAL: For persistence with migrations
│   └── user.js           # Model definition (ONLY if using SQLite)
├── views/                # XML views
│   ├── index.xml
│   └── feature/
│       └── list.xml      # View definition
├── styles/               # TSS styles (one per view + global)
│   ├── app.tss           # Global application styles
│   ├── index.tss         # Styles for index view
│   └── feature/
│       └── list.tss      # Styles for feature/list view
├── lib/                  # Reusable logic (no UI)
│   ├── api/
│   │   └── client.js     # API calls
│   ├── services/
│   │   ├── auth.js       # Business logic services
│   │   ├── navigation.js # Navigation orchestration
│   │   └── nativeService.js # Native module wrapper (e.g. Audio, FB, Maps)
│   └── helpers/
│       ├── utils.js      # Pure utility functions
│       └── i18n.js       # Complex string transformations
├── widgets/              # Truly reusable components (used in 3+ places)
│   └── customButton/
├── config.json           # Alloy configuration
└── alloy.js              # Collections & Global services
```

## lib/ Folder and Module Require Paths

:::danger CRITICAL: lib/ Folder is FLATTENED During Build
When Alloy compiles, the **entire `lib/` folder is flattened to the root of Resources**. This means:
- `app/lib/services/picsum.js` → `Resources/iphone/services/picsum.js`
- `app/lib/api/client.js` → `Resources/iphone/api/client.js`

**Therefore, require statements should NOT include `lib/` prefix:**
```javascript
// ❌ WRONG - Will fail at runtime
const client = require('lib/api/client')

// ✅ CORRECT - Path relative to flattened lib/
const client = require('api/client')
const picsum = require('services/picsum')
```

**This applies to:**
- All files in `app/lib/` (services, api, helpers, etc.)
- Cross-references within lib/ files
- Controller requires of lib/ files

**Example project structure:**
```
app/
├── lib/
│   ├── services/
│   │   ├── picsum.js     # require('services/logger')
│   │   ├── navigation.js # require('services/logger')
│   │   └── logger.js
│   └── api/
│       └── client.js     # require('services/logger')
├── controllers/
│   └── index.js          # require('services/picsum')
```
:::

## Data Layer: Two Approaches

### Approach A: Alloy Models (app/models/) - For Persistence

**Use when:**
- You need SQLite persistence
- You need schema migrations between app versions
- You need offline-first functionality

```javascript
// app/models/User.js
exports.definition = {
  config: {
    columns: {
      id: 'INTEGER PRIMARY KEY',
      name: 'TEXT',
      email: 'TEXT'
    },
    adapter: {
      type: 'sql',
      collection_name: 'users'
    }
  }
}

// Usage
const users = Alloy.createCollection('User')
users.fetch()
```

---

### Approach B: Backbone Collections Direct (alloy.js) - For API Data

**Use when:**
- Data comes from APIs
- No local persistence needed
- You want simplicity and flexibility

```javascript
// alloy.js - Define collections globally
Alloy.Collections.frames = new Backbone.Collection()
Alloy.Collections.mockups = new Backbone.Collection()
```

**In views - bind with dataCollection:**
```xml
<ListSection id="section" dataCollection="frames">
  <ListItem title:text="{title}" />
</ListSection>
```

**In controllers - manipulate directly:**
```javascript
// Reset collection
Alloy.Collections.frames.reset()

// Add items
Alloy.Collections.frames.add(newItem)

// Fetch from API
api.getFrames()
  .then(frames => Alloy.Collections.frames.reset(frames))
```

## Controller Rules

**DO:**
- Define styles in TSS files (per-controller + `app.tss` for global).
- Orchestrate view and model/collection interactions.
- Handle UI events and delegate to services.
- Format data for display (simple cases).
- Manage view lifecycle (including cleanup).

**DON'T:**
- Use inline style attributes in XML (define in TSS files).
- Make direct API calls (use lib/api/ or lib/services/).
- Contain heavy business logic.
- Call native modules directly (use a service wrapper).

## Navigation & Cleanup Pattern

### Automatic Cleanup with ControllerAutoCleanup

For automatic controller cleanup without code changes, use the ControllerAutoCleanup utility.

**Installation:**

1. Copy `ControllerAutoCleanup.js` to `app/lib/`
2. Add as first line in `alloy.js`:

```javascript
// alloy.js
require('ControllerAutoCleanup')

// Rest of your alloy.js initialization...
Alloy.Collections.frames = new Backbone.Collection()
```

**How it works:**

- Monkey-patches `Alloy.createController` to add automatic cleanup
- Listens for `close` events and recursively cleans up controllers
- No code changes needed - existing `Alloy.createController().getView().open()` calls get cleanup automatically

**Benefits:**

| Without ControllerAutoCleanup              | With ControllerAutoCleanup |
| ------------------------------------------ | -------------------------- |
| Must remember manual cleanup               | Cleanup automatic          |
| Easy to forget, causes memory leaks        | Memory leaks prevented     |
| Repetitive code in each navigation service | One-line install           |

See [ControllerAutoCleanup.js](../assets/ControllerAutoCleanup.js) for the complete source code.

## i18n and Accessibility Rules

- All static text must use `L('key')`.
- All interactive elements must have `accessibilityLabel`.
- Use `lib/helpers/i18n.js` for strings that require logic (e.g., "You have 5 messages").
- Use **TSS platform modifiers** (`[platform=ios]`, `[platform=android]`) for platform-specific design instead of conditional code.

## Widget Structure

Widgets are self-contained, reusable components used in 3+ places across the app.

```
app/widgets/
└── loadingOverlay/
    ├── controllers/
    │   └── widget.js      # Main widget controller
    ├── views/
    │   └── widget.xml     # Main widget view
    ├── styles/
    │   └── widget.tss     # Widget-specific styles
    └── widget.json        # Widget manifest
```

### widget.json Configuration
```json
{
  "id": "com.app.loadingOverlay",
  "name": "Loading Overlay",
  "description": "Full-screen loading indicator with optional message",
  "author": "Your Name",
  "version": "1.0.0",
  "copyright": "Copyright (c) 2024",
  "license": "MIT",
  "min-alloy-version": "1.0.0",
  "min-titanium-version": "9.0.0",
  "tags": "ui, loading",
  "platforms": "android,ios"
}
```

### Widget View (widget.xml)
```xml
<Alloy>
  <View id="container">
    <View id="box">
      <ActivityIndicator id="spinner" />
      <Label id="messageLabel" />
    </View>
  </View>
</Alloy>
```

```tss
/* styles/widget.tss */
"#container": { width: Ti.UI.FILL, height: Ti.UI.FILL, visible: false, backgroundColor: 'rgba(0,0,0,0.5)' }
"#box": { width: 128, height: 128, layout: 'vertical', borderRadius: 16, backgroundColor: '#fff' }
"#spinner": { top: 24 }
"#messageLabel": { left: 16, right: 16, top: 16, font: { fontSize: 14 }, color: '#4b5563' }
```

### Widget Controller (widget.js)
```javascript
// Widget controller receives args via $.args
const args = $.args || {}

// Initialize with defaults
let message = args.message || L('loading')

// Public API
$.show = (msg) => {
  if (msg) message = msg
  $.messageLabel.text = message
  $.spinner.show()
  $.container.visible = true
}

$.hide = () => {
  $.spinner.hide()
  $.container.visible = false
}

$.setMessage = (msg) => {
  $.messageLabel.text = msg
}

// Cleanup
$.cleanup = () => {
  $.spinner.hide()
  $.destroy()
}
```

### Using Widgets
```xml
<!-- In any view -->
<Alloy>
  <Window>
    <!-- Your content -->

    <!-- Add widget -->
    <Widget id="loader" src="loadingOverlay" message="L('please_wait')" />
  </Window>
</Alloy>
```

```javascript
// In controller
const loadData = () => {
  $.loader.show(L('loading_data'))

  api.fetchData()
    .then(renderData)
    .finally(() => $.loader.hide())
}
```

:::tip Widget Styles
Widgets have their own `styles/widget.tss` file. Define all widget-specific styles there to keep them self-contained and portable.
:::

### Widget ↔ Controller Communication

**Pattern 1: Public methods on $**

The widget exposes methods directly on `$`:

```javascript
// widgets/loadingOverlay/controllers/widget.js
$.show = (msg) => { /* ... */ }
$.hide = () => { /* ... */ }

// Parent controller
$.loader.show(L('loading'))
$.loader.hide()
```

**Pattern 2: Callbacks via $.args**

Pass functions as arguments for child → parent communication:

```xml
<!-- Parent view -->
<Widget id="picker" src="datePicker" />
```

```javascript
// Parent controller - pass callback after creation
$.picker.onDateSelected = (date) => {
  $.dateLabel.text = formatDate(date)
}

// Widget controller
function handleSelection(e) {
  if ($.args.onDateSelected) {
    $.args.onDateSelected(e.value)
  }
  // Or if set as property:
  if ($._onDateSelected) {
    $._onDateSelected(e.value)
  }
}
```

**Pattern 3: Backbone Events (for complex communication)**

```javascript
// Widget controller (emits events)
$.trigger('item:selected', { item: selectedItem })
$.trigger('search:changed', { query: text })

// Parent controller (listens)
$.searchWidget.on('search:changed', (data) => {
  filterResults(data.query)
})

// Cleanup in parent
function cleanup() {
  $.searchWidget.off('search:changed')
  $.destroy()
}
```

### Widget with Internal State

```javascript
// widgets/counter/controllers/widget.js
let count = parseInt($.args.initial || '0', 10)

function render() {
  $.countLabel.text = String(count)
  $.decrementBtn.enabled = count > 0
}

$.increment = () => {
  count++
  render()
  $.trigger('change', { value: count })
}

$.decrement = () => {
  if (count > 0) {
    count--
    render()
    $.trigger('change', { value: count })
  }
}

$.getValue = () => count

$.setValue = (val) => {
  count = val
  render()
}

// Expose for click handlers in XML
$.incrementBtn.addEventListener('click', $.increment)
$.decrementBtn.addEventListener('click', $.decrement)

$.cleanup = () => {
  $.incrementBtn.removeEventListener('click', $.increment)
  $.decrementBtn.removeEventListener('click', $.decrement)
  $.destroy()
}

render()
```

### When to Use Widget vs Require

| Use `<Widget>` when                   | Use `<Require>` when            |
| ------------------------------------- | ------------------------------- |
| Component is used in 3+ places        | Component is used in 1-2 places |
| Needs its own self-contained styles   | Shares styles with parent       |
| Has public API (show/hide/setValue)   | Just renders, no API needed     |
| Could be extracted to another project | Specific to this app            |
| Needs its own `widget.json` manifest  | Lightweight, no manifest needed |

## config.json Reference

The `app/config.json` file configures Alloy compilation and runtime behavior.

```json
{
  "global": {
    "theme": "default"
  },
  "env:development": {
    "apiUrl": "https://dev-api.example.com",
    "debug": true,
    "logLevel": "debug"
  },
  "env:test": {
    "apiUrl": "https://staging-api.example.com",
    "debug": true,
    "logLevel": "info"
  },
  "env:production": {
    "apiUrl": "https://api.example.com",
    "debug": false,
    "logLevel": "error"
  },
  "os:android": {
    "androidSpecificSetting": true
  },
  "os:ios": {
    "iosSpecificSetting": true
  },
  "dependencies": {
    "com.app.loadingOverlay": "1.0"
  },
  "autoStyle": false,
  "backbone": "1.4.0",
  "sourcemap": true
}
```

### Accessing Config Values
```javascript
// In any controller or lib file
const apiUrl = Alloy.CFG.apiUrl
const isDebug = Alloy.CFG.debug
const logLevel = Alloy.CFG.logLevel

// Environment check
if (Alloy.CFG.debug) {
  console.log('Debug mode enabled')
}
```

### Key Configuration Options

| Property       | Description                               |
| -------------- | ----------------------------------------- |
| `theme`        | Theme folder to use from `app/themes/`    |
| `autoStyle`    | Auto-apply TSS styles by element ID/class |
| `backbone`     | Backbone.js version to use                |
| `sourcemap`    | Generate source maps for debugging        |
| `dependencies` | Widget dependencies and versions          |
| `adaptersPath` | Custom path for sync adapters             |
