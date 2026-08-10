---
name: ti-expert
description: "Use when designing, reviewing, auditing, or analyzing Titanium SDK architecture and implementation (Alloy or Classic) — creating controllers/views/services, choosing models vs collections, deciding between app-owned and system UI, designing reusable Widgets or feedback/modality patterns, hunting memory leaks and cleanup gaps, testing, migrating legacy apps, building adaptive layouts for tablets, foldables and large screens, or moving documents in and out of the app: custom file types, UTIs, CFBundleDocumentTypes, Android intent filters, AirDrop/Quick Share, document icons, sharing a link or file via the iOS share sheet or Android intent chooser. AUTO-DETECT: If tiapp.xml exists, invoke BEFORE architectural decisions, new controllers/views, feedback components, or restructuring. Titanium navigation, memory, event, and modal patterns differ from web frameworks."
argument-hint: "[architecture-topic]"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(git *), Bash(node *)
---

# Titanium expert

Practical architecture and implementation guidance for Titanium SDK apps (Alloy and Classic). Focus on maintainability, clear boundaries, and low-friction testing.

## Required workflow

This file is an index. Read the references that govern the task before making a recommendation or changing code.

| Task | Required reading |
| --- | --- |
| Architecture tier, folders, or boundaries | [Architecture tiers](references/architecture-tiers.md), [Alloy structure](references/alloy-structure.md) |
| Feedback, alerts, choices, or app-owned versus system UI | [Feedback surfaces](references/feedback-surfaces.md) |
| Reusable Snackbar, Dialog, Bottom Sheet, Widget, or `<Require>` | [Feedback Widget contracts](references/feedback-widget-contracts.md), [Alloy structure](references/alloy-structure.md) |
| Migrating native dialogs, Toasts, or local overlays | [Feedback migration](references/feedback-migration.md), [Migration patterns](references/migration-patterns.md) |
| Theme or dark mode | [Theming](references/theming.md); if PurgeTSS is detected, invoke the `purgetss` skill before styling |
| Tablet, foldable, large screen, or responsive behavior | [Adaptive layouts](references/adaptive-layouts.md) |
| Opening or receiving files: custom extensions, UTIs, intent filters, AirDrop, Quick Share, document icons | [File type association](references/file-type-association.md) |
| Sending content out: share sheet, intent chooser, sharing a link or a file, `dk.napp.social`, `com.alcoapps.socialshare` | [Sharing content out](references/sharing.md) |
| Security architecture | [Security fundamentals](references/security-fundamentals.md), [Device security](references/security-device.md) |
| Testing or performance | Load the matching guide under Quality & Performance below |

Support recommendations with `[source: references/<file>.md]`. If a claim cannot be verified from the loaded references or inspected project, prefix it with `FROM_MEMORY (unverified):` and do not present it as a settled project fact.

## Project detection

> **️ℹ️ Auto-detects Alloy vs Classic projects**
> This skill detects project type automatically and tailors guidance.
>
> Alloy indicators:
> - `app/` folder (MVC structure)
> - `app/views/`, `app/controllers/` folders
> - `alloy.jmk` or `config.json` files
>
> Classic indicators:
> - `Resources/` folder with `app.js` at root
> - No `app/` folder structure
>
> Behavior:
> - Alloy detected: provides Alloy MVC patterns and Backbone.js guidance
> - Classic detected: avoids Alloy-only patterns and recommends Classic options or migration
> - Unknown: asks the user to clarify the project type

## Workflow

1. Architecture: define structure by technical type with flat folders (`lib/api`, `lib/services`, `lib/actions`, `lib/repositories`, `lib/helpers`)
2. Data strategy: choose Models (SQLite) or Collections (API)
3. Contracts: define I/O specs between layers
4. UI ownership: classify app-owned feedback, screen state, and system-owned flows
5. Implementation: write XML views and ES6+ controllers
6. Quality: testing, error handling, logging, performance
7. Cleanup: implement a `cleanup()` pattern for memory management

## Architectural Maturity Tiers

Choose the appropriate tier based on project complexity:

### Tier 1: Basic (Rapid Prototyping)
- **Best for**: Simple utility apps or developers transitioning from Classic.
- **Structure**: Logic resides directly within `index.js`.
- **UI Access**: Direct usage of the `$` object throughout the file.
- **Pros**: Zero boilerplate, extremely fast start.
- **Cons**: Unmaintainable beyond 500 lines of code.

### Tier 2: Intermediate (Modular Alloy)
- **Best for**: Standard commercial applications.
- **Structure**: Business logic extracted to `app/lib/` using a flat technical-type organization.
- **Pattern**: Slim Controllers that `require()` services.
- **Memory**: Mandatory implementation of `$.cleanup = cleanup`.

### Tier 3: Advanced / Enterprise (Service-Oriented)
- **Best for**: High-complexity apps (IDEs like TiDesigner, multi-state platforms).
- **Architecture**: Dependency Injection via a `ServiceRegistry`.
- **ID Scoping**: Services do not receive the entire `$` object. They receive a "Scoped UI" object containing only relevant IDs.
- **Cognitive Load**: "Black Box" logic—encapsulated units that reduce mental fatigue.
- **Observability**: Structured logging with a mandatory `service` context.

Detailed examples and full implementation samples are available in: [Architectural Tiers Detail](references/architecture-tiers.md)

## Organization policy (low freedom)

- Use technical-type organization in `lib` (for example: `api`, `services`, `actions`, `repositories`, `helpers`, `policies`, `providers`).
- Keep `lib` flat and predictable: `lib/<type>/<file>.js` only.
- Do not recommend deep nesting like `lib/services/auth/session/login.js`.
- Keep UI layers aligned by screen (`controllers/`, `views/`, `styles/`) and avoid unnecessary depth.


## Code standards (low freedom)

- No semicolons: let ASI handle it
- Modern syntax: `const/let`, destructuring, template literals
- Prefer stable property ordering in JS objects and `applyProperties()` calls
- Default to alphabetical property order when it does not break a meaningful semantic grouping
- `applyProperties()`: batch UI updates to reduce bridge crossings
- Memory cleanup: any controller with global listeners must set `$.cleanup = cleanup`
- Error handling: use AppError classes, log with context, never swallow errors
- Testable code: inject dependencies, avoid hard coupling

## Titanium style sheets rules (low freedom)

Before styling, detect `purgetss/` or `purgetss/config.cjs`. If present, invoke the `purgetss` skill, verify every utility, and never edit the generated `app/styles/app.tss`. Without PurgeTSS, use standard Alloy TSS files. In either case, keep behavior in XML/controllers and use semantic colors for app-owned surfaces when the project supports them.

> **🚨 Critical: platform-specific properties require modifiers**
> Using `Ti.UI.iOS.*` or `Ti.UI.Android.*` properties without platform modifiers breaks cross-platform builds.
>
> Example of the damage:
> ```tss
> // Wrong: adds Ti.UI.iOS to Android project
> "#mainWindow": {
>   statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT
> }
> ```
>
> Correct: always use platform modifiers
> ```tss
> // Correct: only adds to iOS
> "#mainWindow[platform=ios]": {
>   statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT
> }
> ```
>
> Properties that always need platform modifiers:
> - iOS: `statusBarStyle`, `modalStyle`, `modalTransitionStyle`, any `Ti.UI.iOS.*`
> - Android: `actionBar` configuration, any `Ti.UI.Android.*` constant
>
> Available modifiers: `[platform=ios]`, `[platform=android]`, `[formFactor=handheld]`, `[formFactor=tablet]`, `[if=Alloy.Globals.customVar]`
>
> For more platform-specific patterns, see the `ti-ui` skill.

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
| How to create a new Alloy project? | `ti create -t app --alloy` (not `--classic` + `alloy new`)     |
| Fastest way to build?              | `tn <recipe>` (using TiNy CLI wrapper)                         |
| Controller > 100 lines?            | Extract to Tier 2 (Services)                                   |
| More than 50 IDs in XML?           | Use Tier 3 (ID Scoping)                                        |
| Where does API call go?            | `lib/api/`                                                     |
| Where does business logic go?      | `lib/services/`                                                |
| How deep should `lib` folders be?  | One level: `lib/<type>/<file>.js`                              |
| Where do I store auth tokens?      | Keychain (iOS) / KeyStore (Android) via service                |
| Models or Collections?             | Collections for API data, Models for SQLite persistence        |
| Ti.App.fireEvent or EventBus?      | Always EventBus (Backbone.Events)                              |
| Direct navigation or service?      | Always Navigation service (auto cleanup)                       |
| Snackbar, Dialog, or Bottom Sheet? | Classify urgency, persistence, reversibility, and choice first |
| Widget or `<Require>`?             | Widget for a self-contained API/lifecycle; `<Require>` for app composition |
| App-owned or native UI?            | Keep OS trust/protected flows native; style app-owned feedback |
| Inline styles or style system?     | PurgeTSS utilities when detected; otherwise Alloy TSS          |

## Reference guides (progressive disclosure)

### Architecture & Patterns
- [Architectural Tiers Detail](references/architecture-tiers.md)
- [Architectural Patterns](references/patterns.md) (Factory, Singleton, Repository)
- [Structure & Organization](references/alloy-structure.md)
- [Contracts & Communication](references/contracts.md)
- [State Management](references/state-management.md)
- [Anti-patterns to Avoid](references/anti-patterns.md)
- [Adaptive Layouts](references/adaptive-layouts.md) (responsive breakpoints, tablet/foldable/desktop support, Android 16/17 resizability compliance, orientation locks and which Android activities they must cover)

### Implementation & API
- [Alloy Builtins & Globals](references/alloy-builtins.md)
- [Code Conventions](references/code-conventions.md)
- [Controller Patterns](references/controller-patterns.md)
- [File Type Association](references/file-type-association.md) (custom extensions and UTIs, `CFBundleDocumentTypes`, Android intent filters, receiving files from AirDrop/Quick Share, document icons)
- [Sharing Content Out](references/sharing.md) (share sheet and intent chooser, why iOS still needs `dk.napp.social` and Android does not, text versus file, iPad popovers)
- [Feedback Surfaces & App-Owned UI](references/feedback-surfaces.md)
- [Feedback Widget Contracts](references/feedback-widget-contracts.md)
- [Feedback Migration](references/feedback-migration.md)
- [Theming & Dark Mode](references/theming.md)
- [Migration Patterns](references/migration-patterns.md)
- [Examples Collection](references/examples.md)

### Quality & Performance
- [Performance Optimization](references/performance-optimization.md)
- [ListView & ScrollView Performance](references/performance-listview.md)
- [Error Handling & Logging](references/error-handling.md)
- [Unit & Integration Testing](references/testing-unit.md)
- [E2E Testing & CI/CD](references/testing-e2e-ci.md)

### Security
- [Security Fundamentals](references/security-fundamentals.md)
- [Device Security](references/security-device.md)

### Tools
- [CLI Expert & TiNy](references/cli-expert.md)
