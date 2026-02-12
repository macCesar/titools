---
name: ti-expert
description: "Titanium SDK architecture and implementation expert. Use when designing, reviewing, analyzing, or examining Titanium project structure (Alloy or Classic), creating controllers/views/services, choosing models vs collections, implementing communication patterns, handling memory cleanup, testing, auditing code, or migrating legacy apps. Automatically identifies project type."
argument-hint: "[architecture-topic]"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(git *), Bash(node *)
---

# Titanium expert

Practical architecture and implementation guidance for Titanium SDK apps (Alloy and Classic). Focus on maintainability, clear boundaries, and low-friction testing.

## Project detection

:::info Auto-detects Alloy vs Classic projects
This skill detects project type automatically and tailors guidance.

Alloy indicators:
- `app/` folder (MVC structure)
- `app/views/`, `app/controllers/` folders
- `alloy.jmk` or `config.json` files

Classic indicators:
- `Resources/` folder with `app.js` at root
- No `app/` folder structure

Behavior:
- Alloy detected: provides Alloy MVC patterns and Backbone.js guidance
- Classic detected: avoids Alloy-only patterns and recommends Classic options or migration
- Unknown: asks the user to clarify the project type
:::

## Workflow

1. Architecture: define structure by technical type with flat folders (`lib/api`, `lib/services`, `lib/actions`, `lib/repositories`, `lib/helpers`)
2. Data strategy: choose Models (SQLite) or Collections (API)
3. Contracts: define I/O specs between layers
4. Implementation: write XML views and ES6+ controllers
5. Quality: testing, error handling, logging, performance
6. Cleanup: implement a `cleanup()` pattern for memory management

## Organization policy (low freedom)

- Use technical-type organization in `lib` (for example: `api`, `services`, `actions`, `repositories`, `helpers`, `policies`, `providers`).
- Keep `lib` flat and predictable: `lib/<type>/<file>.js` only.
- Do not recommend deep nesting like `lib/services/auth/session/login.js`.
- Keep UI layers aligned by screen (`controllers/`, `views/`, `styles/`) and avoid unnecessary depth.

## Quick start example

Minimal example that matches the conventions:

View (`views/userCard.xml`)
```xml
<Alloy>
  <View id="cardContainer">
    <View id="headerRow">
      <ImageView id="userIcon" image="/images/user.png" />
      <Label id="name" />
    </View>
    <Button id="viewProfileBtn"
      title="L('view_profile')"
      onClick="onViewProfile"
    />
  </View>
</Alloy>
```

Styles (`styles/userCard.tss`)
```tss
"#cardContainer": { left: 8, right: 8, top: 8, height: Ti.UI.SIZE, borderRadius: 12, backgroundColor: '#fff' }
"#headerRow": { layout: 'horizontal', left: 12, right: 12, top: 12, height: Ti.UI.SIZE, width: Ti.UI.FILL }
"#userIcon": { width: 32, height: 32 }
"#name": { left: 12, font: { fontSize: 18, fontWeight: 'bold' } }
"#viewProfileBtn": { left: 12, right: 12, bottom: 12, height: 40, width: Ti.UI.FILL, borderRadius: 6, backgroundColor: '#2563eb', color: '#fff' }
```

Controller (`controllers/userCard.js`)
```javascript
const { Navigation } = require('services/navigation')

function init() {
  const user = $.args.user
  $.name.text = user.name
}

function onViewProfile() {
  Navigation.open('userProfile', { userId: $.args.user.id })
}

function cleanup() {
  $.destroy()
}

$.cleanup = cleanup
```

Service (`lib/services/navigation.js`)
```javascript
exports.Navigation = {
  open(route, params = {}) {
    const controller = Alloy.createController(route, params)
    const view = controller.getView()

    view.addEventListener('close', function() {
      if (controller.cleanup) controller.cleanup()
    })

    view.open()
    return controller
  }
}
```

## Code standards (low freedom)

- No semicolons: let ASI handle it
- Modern syntax: `const/let`, destructuring, template literals
- `applyProperties()`: batch UI updates to reduce bridge crossings
- Memory cleanup: any controller with global listeners must set `$.cleanup = cleanup`
- Error handling: use AppError classes, log with context, never swallow errors
- Testable code: inject dependencies, avoid hard coupling

## Titanium style sheets rules (low freedom)

:::danger Critical: platform-specific properties require modifiers
Using `Ti.UI.iOS.*` or `Ti.UI.Android.*` properties without platform modifiers breaks cross-platform builds.

Example of the damage:
```tss
// Wrong: adds Ti.UI.iOS to Android project
"#mainWindow": {
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT
}
```

Correct: always use platform modifiers
```tss
// Correct: only adds to iOS
"#mainWindow[platform=ios]": {
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT
}
```

Properties that always need platform modifiers:
- iOS: `statusBarStyle`, `modalStyle`, `modalTransitionStyle`, any `Ti.UI.iOS.*`
- Android: `actionBar` configuration, any `Ti.UI.Android.*` constant

Available modifiers: `[platform=ios]`, `[platform=android]`, `[formFactor=handheld]`, `[formFactor=tablet]`, `[if=Alloy.Globals.customVar]`

For more platform-specific patterns, see the `ti-ui` skill.
:::

Titanium layout system:
- Three layout modes: `layout: 'horizontal'`, `layout: 'vertical'`, and composite (default, no `layout` needed)
- No padding on container Views: use margins on children instead
- `width: Ti.UI.FILL` fills available space (preferred), `width: '100%'` = 100% of parent
- `height: Ti.UI.SIZE` wraps content, `height: Ti.UI.FILL` fills available space

## Alloy builtins quick reference

Key builtins: `OS_IOS`/`OS_ANDROID` (compile-time), `Alloy.CFG` (config.json), `Alloy.Globals` (shared state), `$.args` (controller params), `$.destroy()` (cleanup bindings), `platform="ios"` / `formFactor="tablet"` (XML conditionals).

For the complete reference with examples, see [Alloy builtins and globals](references/alloy-builtins.md).

## Quick decision matrix

| Question                           | Answer                                                         |
| ---------------------------------- | -------------------------------------------------------------- |
| How to create a new Alloy project? | `ti create -t app --alloy` (not `--classic` + `alloy new`)      |
| Fastest way to build?              | `tn <recipe>` (using TiNy CLI wrapper)                         |
| Where does API call go?            | `lib/api/`                                                     |
| Where does business logic go?      | `lib/services/`                                                |
| How deep should `lib` folders be?  | One level: `lib/<type>/<file>.js`                             |
| Where do I store auth tokens?      | Keychain (iOS) / KeyStore (Android) via service                |
| Models or Collections?             | Collections for API data, Models for SQLite persistence        |
| Ti.App.fireEvent or EventBus?      | Always EventBus (Backbone.Events)                              |
| Direct navigation or service?      | Always Navigation service (auto cleanup)                       |
| Inline styles or TSS files?        | Always TSS files (per-controller + `app.tss` for global)        |
| Controller 100+ lines?             | Extract logic to services                                      |

## Reference guides (progressive disclosure)

Architecture
- [CLI expert and TiNy](references/cli-expert.md): advanced build workflows, LiveView, TiNy (`tn`) recipes
- [Structure and organization](references/alloy-structure.md): models vs collections, folder maps, widget patterns, automatic cleanup
- [Alloy builtins and globals](references/alloy-builtins.md): `OS_IOS`/`OS_ANDROID`, `Alloy.CFG`, `Alloy.Globals`, `$.args`, compiler directives
- [ControllerAutoCleanup.js](assets/ControllerAutoCleanup.js): drop-in utility for automatic controller cleanup
- [Architectural patterns](references/patterns.md): repository, service layer, event bus, factory, singleton
- [Contracts and communication](references/contracts.md): layer interaction examples and JSDoc specs
- [Anti-patterns](references/anti-patterns.md): fat controllers, memory leaks, inline styling, direct API calls

Implementation
- [Code conventions](references/code-conventions.md): ES6 features, TSS design system, accessibility
- [Theming and dark mode](references/theming.md): theme system, Alloy.Globals palette, runtime switching, design tokens
- [Controller patterns](references/controller-patterns.md): templates, animation, dynamic styling
- [Examples](references/examples.md): API clients, SQL models, full screen examples

Quality and reliability
- [Unit and integration testing](references/testing-unit.md): unit testing, mocking patterns, controller testing, test helpers
- [E2E testing and CI/CD](references/testing-e2e-ci.md): Appium, WebdriverIO, GitHub Actions, Fastlane
- [Error handling and logging](references/error-handling.md): AppError classes, Logger service, validation

Performance and security
- [ListView and ScrollView performance](references/performance-listview.md): ListView templates, data binding, image caching, ScrollView optimization
- [Performance optimization](references/performance-optimization.md): bridge crossings, memory management, animations, debounce/throttle, database
- [Security fundamentals](references/security-fundamentals.md): token storage, certificate pinning, encryption, HTTPS, OWASP
