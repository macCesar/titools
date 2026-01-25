---
name: alloy-expert
description: "Complete Titanium SDK + Alloy development expertise following PurgeTSS standards. Use when Claude needs to: (1) Design project architecture and folder structures, (2) Implement controllers, views, and services, (3) Choose between Models vs Collections for data strategies, (4) Establish communication patterns (Event Bus, Services), (5) Write clean ES6+ code with proper memory cleanup, (6) Apply PurgeTSS utility classes correctly, (7) Implement testing, error handling, and logging, (8) Optimize performance (ListView, bridge, memory), (9) Apply security patterns for mobile apps, (10) Migrate legacy Titanium apps to modern architecture."
---

# Titanium Alloy Expert

Complete architectural and implementation guidance for building scalable, maintainable Titanium Alloy applications with PurgeTSS styling.

## Workflow

1. **Architecture**: Define structure (`lib/api`, `lib/services`, `lib/helpers`)
2. **Data Strategy**: Choose Models (SQLite) or Collections (API)
3. **Contracts**: Define I/O specs for cross-layer communication
4. **Implementation**: Write XML views + ES6+ controllers
5. **Quality**: Testing, error handling, logging, performance
6. **Cleanup**: Implement `cleanup()` pattern for memory management

## Code Standards (Low Freedom)

- **NO SEMICOLONS**: Let ASI handle it
- **MODERN SYNTAX**: `const/let`, destructuring, template literals
- **applyProperties()**: Batch UI updates to minimize bridge crossings
- **MEMORY CLEANUP**: Every controller with global listeners MUST have `$.cleanup = cleanup`
- **ERROR HANDLING**: Use AppError classes, log with context, never swallow errors
- **TESTABLE**: Inject dependencies, avoid hard coupling

## PurgeTSS Rules (Low Freedom)

| WRONG | CORRECT | Why |
|-------|---------|-----|
| `flex-row` | `horizontal` | Flexbox not supported |
| `flex-col` | `vertical` | Flexbox not supported |
| `w-full` | `w-screen` | `w-full` doesn't exist |
| `p-4` on View | `m-4` on children | No padding on containers |
| `justify-*` | margins/positioning | Flexbox not supported |
| `items-center` | layout + sizing | Different meaning in Titanium |
| `rounded-full` | `rounded-full-12` | Need size suffix (12×4=48px) |
| `border-[1px]` | `border-(1)` | Parentheses, not brackets |

## Quick Decision Matrix

| Question | Answer |
|----------|--------|
| Where does API call go? | `lib/api/` |
| Where does business logic go? | `lib/services/` |
| Where do I store auth tokens? | Keychain (iOS) / KeyStore (Android) via service |
| Models or Collections? | Collections for API data, Models for SQLite persistence |
| Ti.App.fireEvent or EventBus? | **Always EventBus** (Backbone.Events) |
| Direct navigation or service? | **Always Navigation service** (auto cleanup) |
| Manual TSS or PurgeTSS? | **Always PurgeTSS utility classes** |
| Controller 100+ lines? | Extract logic to services |

## Reference Guides (Progressive Disclosure)

### Architecture
- **[Structure & Organization](references/alloy-structure.md)**: Models vs Collections, folder maps, styling strategies
- **[Architectural Patterns](references/patterns.md)**: Repository, Service Layer, Event Bus, Factory, Singleton
- **[Contracts & Communication](references/contracts.md)**: Layer interaction examples and JSDoc specs
- **[Anti-Patterns](references/anti-patterns.md)**: Fat controllers, flexbox classes, memory leaks, direct API calls

### Implementation
- **[Code Conventions](references/code-conventions.md)**: ES6 features, PurgeTSS usage, accessibility
- **[Controller Patterns](references/controller-patterns.md)**: Templates, animation, dynamic styling
- **[Examples](references/examples.md)**: API clients, SQL models, full screen examples

### Quality & Reliability
- **[Testing](references/testing.md)**: Unit testing, mocking patterns, controller testing, test helpers
- **[Error Handling & Logging](references/error-handling.md)**: AppError classes, Logger service, validation

### Performance & Security
- **[Performance Patterns](references/performance-patterns.md)**: ListView, bridge optimization, memory management, lazy loading
- **[Security Patterns](references/security-patterns.md)**: Token storage, certificate pinning, encryption, OWASP
- **[State Management](references/state-management.md)**: Centralized store, reactive patterns, synchronization

### Migration
- **[Migration Patterns](references/migration-patterns.md)**: Step-by-step guide for modernizing legacy apps

## Specialized Titanium Skills

For specific feature implementations, defer to these specialized skills:

| Task | Use This Skill |
|------|----------------|
| PurgeTSS setup, advanced styling, animations | `purgetss` |
| Location, Maps, Push Notifications, Media APIs | `ti-howtos` |
| UI layouts, ListViews, gestures, platform-specific UI | `ti-ui` |
| Alloy CLI, configuration files, debugging | `alloy-howtos` |
| Alloy MVC complete reference | `alloy-guides` |
| Hyperloop, native modules, app distribution | `ti-guides` |

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
