---
name: ti-expert
description: "Titanium SDK architecture and implementation expert. Use when designing, reviewing, analyzing, or examining Titanium project structure (Alloy or Classic), creating controllers/views/services, choosing models vs collections, implementing communication patterns, handling memory cleanup, testing, auditing code, or migrating legacy apps. Automatically identifies project type."
argument-hint: "[architecture-topic]"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(git *), Bash(node *)
---

# Titanium Expert

Complete architectural and implementation guidance for building scalable, maintainable Titanium SDK applications (Alloy & Classic).

## Project Detection

:::info AUTO-DETECTS ALLOY VS CLASSIC PROJECTS
This skill automatically detects project type when invoked and provides appropriate guidance.

**Detection occurs automatically** - no manual command needed.

**Alloy project indicators:**
- `app/` folder (MVC structure)
- `app/views/`, `app/controllers/` folders
- `alloy.jmk` or `config.json` files

**Classic project indicators:**
- `Resources/` folder with `app.js` at root
- No `app/` folder structure

**Behavior based on detection:**
- **Alloy detected** → Provides Alloy-specific architecture patterns, MVC folder structure, Backbone.js patterns
- **Classic detected** → Indicates incompatibility, does not suggest Alloy-specific patterns, recommends migration or Classic resources
- **Unknown** → Asks user to clarify project type
:::

## Workflow

1. **Architecture**: Define structure (`lib/api`, `lib/services`, `lib/helpers`)
2. **Data Strategy**: Choose Models (SQLite) or Collections (API)
3. **Contracts**: Define I/O specs for cross-layer communication
4. **Implementation**: Write XML views + ES6+ controllers
5. **Quality**: Testing, error handling, logging, performance
6. **Cleanup**: Implement `cleanup()` pattern for memory management

## Quick Start Example

Minimal example following all conventions:

**View (views/user/card.xml)**
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

**Styles (styles/user/card.tss)**
```tss
"#cardContainer": { left: 8, right: 8, top: 8, height: Ti.UI.SIZE, borderRadius: 12, backgroundColor: '#fff' }
"#headerRow": { layout: 'horizontal', left: 12, right: 12, top: 12, height: Ti.UI.SIZE, width: Ti.UI.FILL }
"#userIcon": { width: 32, height: 32 }
"#name": { left: 12, font: { fontSize: 18, fontWeight: 'bold' } }
"#viewProfileBtn": { left: 12, right: 12, bottom: 12, height: 40, width: Ti.UI.FILL, borderRadius: 6, backgroundColor: '#2563eb', color: '#fff' }
```

**Controller (controllers/user/card.js)**
```javascript
const { Navigation } = require('services/navigation')

function init() {
  const user = $.args.user
  $.name.text = user.name
}

function onViewProfile() {
  Navigation.open('user/profile', { userId: $.args.user.id })
}

function cleanup() {
  $.destroy()
}

$.cleanup = cleanup
```

**Service (lib/services/navigation.js)**
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

## Code Standards (Low Freedom)

- **NO SEMICOLONS**: Let ASI handle it
- **MODERN SYNTAX**: `const/let`, destructuring, template literals
- **applyProperties()**: Batch UI updates to minimize bridge crossings
- **MEMORY CLEANUP**: Every controller with global listeners MUST have `$.cleanup = cleanup`
- **ERROR HANDLING**: Use AppError classes, log with context, never swallow errors
- **TESTABLE**: Inject dependencies, avoid hard coupling

## Titanium Style Sheets Rules (Low Freedom)

:::danger CRITICAL: Platform-Specific Properties Require Modifiers
Using `Ti.UI.iOS.*` or `Ti.UI.Android.*` properties WITHOUT platform modifiers causes cross-platform compilation failures.

**Example of the damage:**
```tss
// ❌ WRONG - Adds Ti.UI.iOS to Android project
"#mainWindow": {
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT  // FAILS on Android!
}
```

**CORRECT - Always use platform modifiers:**
```tss
// ✅ CORRECT - Only adds to iOS
"#mainWindow[platform=ios]": {
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT
}
```

**Properties that ALWAYS require platform modifiers:**
- iOS: `statusBarStyle`, `modalStyle`, `modalTransitionStyle`, any `Ti.UI.iOS.*`
- Android: `actionBar` configuration, any `Ti.UI.Android.*` constant

**Available modifiers:** `[platform=ios]`, `[platform=android]`, `[formFactor=handheld]`, `[formFactor=tablet]`, `[if=Alloy.Globals.customVar]`

**For more platform-specific patterns, see the `ti-ui` skill.**
:::

**Titanium layout system:**
- Three layout modes: `layout: 'horizontal'`, `layout: 'vertical'`, and composite (default — no `layout` needed)
- No padding on container Views — use margins on children instead
- `width: Ti.UI.FILL` fills available space (preferred), `width: '100%'` = 100% of parent
- `height: Ti.UI.SIZE` wraps content, `height: Ti.UI.FILL` fills available space

## Alloy Builtins Quick Reference

Key builtins: `OS_IOS`/`OS_ANDROID` (compile-time), `Alloy.CFG` (config.json), `Alloy.Globals` (shared state), `$.args` (controller params), `$.destroy()` (cleanup bindings), `platform="ios"` / `formFactor="tablet"` (XML conditionals).

For the complete reference with examples, see **[Alloy Builtins & Globals](references/alloy-builtins.md)**.

## Quick Decision Matrix

| Question                           | Answer                                                         |
| ---------------------------------- | -------------------------------------------------------------- |
| How to create a new Alloy project? | **`ti create -t app --alloy`** (not `--classic` + `alloy new`) |
| Fastest way to build?              | **`tn <recipe>`** (using TiNy CLI wrapper)                     |
| Where does API call go?            | `lib/api/`                                                     |
| Where does business logic go?      | `lib/services/`                                                |
| Where do I store auth tokens?      | Keychain (iOS) / KeyStore (Android) via service                |
| Models or Collections?             | Collections for API data, Models for SQLite persistence        |
| Ti.App.fireEvent or EventBus?      | **Always EventBus** (Backbone.Events)                          |
| Direct navigation or service?      | **Always Navigation service** (auto cleanup)                   |
| Inline styles or TSS files?        | **Always TSS files** (per-controller + `app.tss` for global)   |
| Controller 100+ lines?             | Extract logic to services                                      |

## Reference Guides (Progressive Disclosure)

### Architecture
- **[CLI Expert & TiNy](references/cli-expert.md)**: Advanced build workflows, LiveView, and TiNy (`tn`) recipes
- **[Structure & Organization](references/alloy-structure.md)**: Models vs Collections, folder maps, widget patterns, automatic cleanup
- **[Alloy Builtins & Globals](references/alloy-builtins.md)**: OS_IOS/OS_ANDROID, Alloy.CFG, Alloy.Globals, $.args, compiler directives
- **[ControllerAutoCleanup.js](assets/ControllerAutoCleanup.js)**: Drop-in utility for automatic controller cleanup (prevents memory leaks)
- **[Architectural Patterns](references/patterns.md)**: Repository, Service Layer, Event Bus, Factory, Singleton
- **[Contracts & Communication](references/contracts.md)**: Layer interaction examples and JSDoc specs
- **[Anti-Patterns](references/anti-patterns.md)**: Fat controllers, memory leaks, inline styling, direct API calls

### Implementation
- **[Code Conventions](references/code-conventions.md)**: ES6 features, TSS design system, accessibility
- **[Theming & Dark Mode](references/theming.md)**: Theme system, Alloy.Globals palette, runtime switching, design tokens
- **[Controller Patterns](references/controller-patterns.md)**: Templates, animation, dynamic styling
- **[Examples](references/examples.md)**: API clients, SQL models, full screen examples

### Quality & Reliability
- **[Unit & Integration Testing](references/testing-unit.md)**: Unit testing, mocking patterns, controller testing, test helpers
- **[E2E Testing & CI/CD](references/testing-e2e-ci.md)**: Appium, WebdriverIO, GitHub Actions, Fastlane
- **[Error Handling & Logging](references/error-handling.md)**: AppError classes, Logger service, validation

### Performance & Security
- **[ListView & ScrollView Performance](references/performance-listview.md)**: ListView templates, data binding, image caching, ScrollView optimization
- **[Performance Optimization](references/performance-optimization.md)**: Bridge crossings, memory management, animations, debounce/throttle, database
- **[Security Fundamentals](references/security-fundamentals.md)**: Token storage, certificate pinning, encryption, HTTPS, OWASP
- **[Device Security](references/security-device.md)**: Biometric auth, deep link validation, jailbreak/root detection
- **[State Management](references/state-management.md)**: Centralized store, reactive patterns, synchronization

### Migration
- **[Migration Patterns](references/migration-patterns.md)**: Step-by-step guide for modernizing legacy apps

## Specialized Titanium Skills

For specific feature implementations, defer to these specialized skills:

| Task                                                  | Use This Skill |
| ----------------------------------------------------- | -------------- |
| Location, Maps, Push Notifications, Media APIs        | `ti-howtos`    |
| UI layouts, ListViews, gestures, platform-specific UI | `ti-ui`        |
| Alloy CLI, configuration files, debugging             | `alloy-howtos` |
| Alloy MVC complete reference                          | `alloy-guides` |
| Hyperloop, native modules, app distribution           | `ti-guides`    |

## Guiding Principles

1. **Thin Controllers**: Max 100 lines. Delegate to services.
2. **Single Source of Truth**: One state store, not scattered Properties.
3. **Always Cleanup**: Every listener added = listener removed in `cleanup()`.
4. **Never Block UI**: All API/DB calls are async with loading states.
5. **Fail Gracefully**: Centralized error handling with user-friendly messages.

## Response Format

**For Architecture Questions:**
1. Decision: What should be done
2. Justification: Technical rationale
3. Structure: File and folder placement
4. Contract: Clear I/O specification

**For Implementation Tasks:**
1. Code First: Show implementation immediately
2. Minimal Comments: Explain only the "Why" for complex logic
3. No Explanations: Deliver exactly what was asked concisely
