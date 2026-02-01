# Alloy Builtins & Globals

## Compiler Directives

Alloy provides compile-time constants that are replaced with `true`/`false` during build. Use them for platform-specific code without runtime cost.

### OS_IOS / OS_ANDROID

```javascript
// These are compile-time constants — dead code is removed at build
if (OS_IOS) {
  $.window.applyProperties({
    largeTitleEnabled: true,
    largeTitleDisplayMode: Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_ALWAYS
  })
}

if (OS_ANDROID) {
  $.window.activity.onCreateOptionsMenu = (e) => {
    const menu = e.menu
    menu.add({ title: L('settings'), showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER })
  }
}
```

:::warning These are NOT runtime checks
`OS_IOS` and `OS_ANDROID` are replaced by the Alloy compiler with literal `true`/`false`. The opposite platform's code is completely removed from the build output. This is different from `Ti.Platform.osname === 'iphone'` which remains in the code.

**Use for:** Platform-specific APIs, platform-specific UI configuration
**Do NOT use for:** Logic that should be testable on both platforms
:::

### ENV_DEV / ENV_TEST / ENV_PRODUCTION

```javascript
if (ENV_DEV) {
  Ti.API.info('Debug mode: API URL = ' + Alloy.CFG.apiUrl)
}

if (ENV_PRODUCTION) {
  // Enable crash reporting
  crashReporter.init()
}
```

Set environment during build:
```bash
ti build -p ios -T simulator -D development
ti build -p ios -T dist-appstore -D production
```

---

## Alloy.Globals

Shared state and utilities accessible from any controller or lib file. Set in `alloy.js`, available everywhere.

### Common Patterns

```javascript
// alloy.js
const Backbone = require('alloy/backbone')

// --- Theme / Design Tokens ---
Alloy.Globals.theme = {
  primary: '#2563eb',
  bg: '#ffffff',
  text: '#111827'
}

// --- Device Info (cached once) ---
Alloy.Globals.isTablet = Alloy.isTablet
Alloy.Globals.screenWidth = Ti.Platform.displayCaps.platformWidth
Alloy.Globals.screenHeight = Ti.Platform.displayCaps.platformHeight
Alloy.Globals.density = Ti.Platform.displayCaps.dpi

// --- App State Flags ---
Alloy.Globals.isLoggedIn = false
Alloy.Globals.currentUserId = null

// --- Collections ---
Alloy.Collections.products = new Backbone.Collection()
Alloy.Collections.notifications = new Backbone.Collection()
```

### Access from Anywhere

```javascript
// In any controller
const theme = Alloy.Globals.theme
$.label.color = theme.primary

// In TSS (evaluated at compile time for controller creation)
"#header": {
  backgroundColor: Alloy.Globals.theme.primary
}

// In XML with conditional binding
// <View if="Alloy.Globals.isLoggedIn">
```

### Globals vs Services

| Use `Alloy.Globals` for            | Use a Service for             |
| ---------------------------------- | ----------------------------- |
| Static config (theme, device info) | Business logic                |
| Simple flags (isLoggedIn)          | Complex state with listeners  |
| Values set once in `alloy.js`      | Values that change frequently |
| Read-only data                     | Data with side effects        |

---

## Alloy.CFG

Values from `app/config.json`, automatically resolved by environment and platform.

```javascript
// config.json
{
  "global": { "appName": "MyApp" },
  "env:development": { "apiUrl": "https://dev.api.com", "debug": true },
  "env:production": { "apiUrl": "https://api.com", "debug": false },
  "os:ios": { "statusBarStyle": "light" },
  "os:android": { "exitOnBack": true }
}
```

```javascript
// Access anywhere
const url = Alloy.CFG.apiUrl       // Resolved by environment
const debug = Alloy.CFG.debug      // true in dev, false in prod
const appName = Alloy.CFG.appName  // From global
```

:::tip CFG is read-only
`Alloy.CFG` values are set at build time and cannot be modified at runtime. For runtime configuration, use `Alloy.Globals` or `Ti.App.Properties`.
:::

---

## Alloy.isTablet / Alloy.isHandheld

Detect device form factor at runtime.

```javascript
if (Alloy.isTablet) {
  // Show split-view layout
  Navigation.open('tablet/splitView')
} else {
  // Show phone layout
  Navigation.open('phone/list')
}
```

### In TSS

```tss
"#sidebar[formFactor=tablet]": {
  width: 320,
  visible: true
}

"#sidebar[formFactor=handheld]": {
  width: 0,
  visible: false
}
```

### In XML

```xml
<Alloy>
  <!-- Only rendered on tablet -->
  <View formFactor="tablet" id="sidebar">
    <Require src="sidebar/menu" />
  </View>

  <!-- Only rendered on phone -->
  <View formFactor="handheld" id="content">
    <Require src="phone/content" />
  </View>
</Alloy>
```

---

## $.args — Controller Arguments

Every controller receives arguments via `$.args`. This is the standard way to pass data between controllers.

### Basic Usage

```javascript
// Opening controller with args
const ctrl = Alloy.createController('user/profile', {
  userId: 123,
  mode: 'edit',
  onSave: handleSave
})

// Receiving in target controller
// controllers/user/profile.js
const { userId, mode, onSave } = $.args
```

### Common Patterns

```javascript
// Pattern 1: Default values with destructuring
const {
  userId,
  mode = 'view',
  showHeader = true,
  onComplete = () => {}
} = $.args

// Pattern 2: Validation
function init() {
  if (!$.args.userId) {
    Ti.API.error('user/profile requires userId')
    $.getView().close()
    return
  }

  loadUser($.args.userId)
}

// Pattern 3: Passing callbacks for communication
// Parent controller
const editor = Alloy.createController('editor', {
  item: selectedItem,
  onSave: (updatedItem) => {
    refreshList()
  }
})

// Child controller (editor.js)
function save() {
  const data = collectFormData()
  $.args.onSave(data)
  $.getView().close()
}
```

### $.args in Widgets

Widgets also receive args, but through the `<Widget>` tag attributes:

```xml
<Widget id="header" src="appHeader" title="L('home')" showBack="false" />
```

```javascript
// widgets/appHeader/controllers/widget.js
const title = $.args.title || ''
const showBack = $.args.showBack !== 'false'  // XML passes strings
```

:::warning XML attributes are always strings
When passing values through XML attributes, they arrive as strings in `$.args`. Numbers and booleans need to be parsed:
```javascript
const count = parseInt($.args.count, 10)    // "5" → 5
const visible = $.args.visible !== 'false'   // "false" → false
```
For complex data, pass via `Alloy.createController()` in the parent controller instead.
:::

---

## Alloy.createController / Alloy.createWidget

### Controller Creation

```javascript
// Create and open
const ctrl = Alloy.createController('user/profile', { userId: 123 })
ctrl.getView().open()

// Create and embed
const card = Alloy.createController('components/userCard', { user: userData })
$.container.add(card.getView())

// Access controller methods
ctrl.refresh()
ctrl.setData(newData)
```

### Widget Creation

```javascript
// Create widget programmatically (alternative to XML <Widget>)
const loader = Alloy.createWidget('loadingOverlay')
$.window.add(loader.getView())

loader.show(L('loading'))
// ... later
loader.hide()
```

---

## Alloy.createModel / Alloy.createCollection

```javascript
// Create a model instance
const user = Alloy.createModel('User', {
  name: 'John',
  email: 'john@example.com'
})
user.save()

// Create a collection (fetches from adapter)
const users = Alloy.createCollection('User')
users.fetch()

// Collection with query (SQL adapter)
users.fetch({
  query: 'SELECT * FROM users WHERE active = 1 ORDER BY name'
})
```

---

## Conditional Code in XML

### Platform Conditional

```xml
<Alloy>
  <Window>
    <!-- iOS only -->
    <NavigationWindow platform="ios" id="navWin">
      <Require src="home" />
    </NavigationWindow>

    <!-- Android only -->
    <Require platform="android" src="home" />
  </Window>
</Alloy>
```

### Form Factor Conditional

```xml
<Alloy>
  <View formFactor="tablet" id="splitView">
    <!-- Tablet layout -->
  </View>
  <View formFactor="handheld" id="phoneView">
    <!-- Phone layout -->
  </View>
</Alloy>
```

### Custom Conditional (if attribute)

```xml
<!-- Only render if condition is true at creation time -->
<View if="Alloy.Globals.isLoggedIn" id="userMenu">
  <Label text="L('welcome_back')" />
</View>

<View if="Alloy.Globals.featureFlags.newDashboard" id="newDashboard">
  <Require src="dashboard/v2" />
</View>
```

:::warning `if` is evaluated once at controller creation
The `if` attribute is checked when the controller is created. It does NOT react to later changes in the condition. For dynamic visibility, use the `visible` property in the controller.
:::

---

## Quick Reference

| Builtin             | Type              | Where Set         | Mutable |
| ------------------- | ----------------- | ----------------- | ------- |
| `OS_IOS`            | Compiler constant | Build time        | No      |
| `OS_ANDROID`        | Compiler constant | Build time        | No      |
| `ENV_DEV`           | Compiler constant | Build flag        | No      |
| `ENV_PRODUCTION`    | Compiler constant | Build flag        | No      |
| `Alloy.CFG`         | Object            | `config.json`     | No      |
| `Alloy.Globals`     | Object            | `alloy.js`        | Yes     |
| `Alloy.isTablet`    | Boolean           | Runtime           | No      |
| `Alloy.isHandheld`  | Boolean           | Runtime           | No      |
| `Alloy.Collections` | Object            | `alloy.js`        | Yes     |
| `$.args`            | Object            | Parent controller | No      |
