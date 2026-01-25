---
name: purgetss
description: Expert styling and UI/UX design system using the PurgeTSS toolkit for Titanium SDK. Use when Claude needs to: (1) Set up a new project with utility-first styling, (2) Implement complex Grid-based or responsive layouts, (3) Create declarative animations using the <Animation> component, (4) Automate assets like Icon Fonts or Color Palettes via CLI, (5) Configure advanced design rules in config.cjs, or (6) Work with arbitrary values, platform modifiers, and custom Ti Elements.
---

# PurgeTSS Expert

Utility-first styling toolkit for Titanium/Alloy mobile apps.

## Core Workflow

1. **Setup**: `purgetss create 'name'` or `purgetss init` for existing projects
2. **Build**: Write XML with utility classes → PurgeTSS auto-generates `app.tss`
3. **Configure**: Customize via `purgetss/config.cjs`

## Project Structure

```bash
./purgetss/
├─ fonts/              # Custom font files (.ttf, .otf)
├─ styles/
│  ├─ definitions.css  # For VS Code IntelliSense
│  └─ tailwind.tss     # All PurgeTSS utility classes
└─ config.cjs          # Theme configuration

./app/styles/
├─ app.tss             # AUTO-GENERATED - DO NOT EDIT DIRECTLY
└─ _app.tss            # YOUR CUSTOM STYLES (persists across runs)
```

### The `_app.tss` File

:::info CUSTOM STYLES LOCATION
Your original `app.tss` is backed up to `_app.tss` on first run.

**Use `_app.tss` for custom styles that persist across PurgeTSS runs.**

Every purge copies `_app.tss` content into the generated `app.tss`.

Better approach: define custom classes in `config.cjs` instead.
:::

## Quick Start

```bash
purgetss create 'MyApp' -d -v fa
# -d: Install dev dependencies (ESLint, Tailwind)
# -v: Copy icon fonts (fa, mi, ms, f7)
```

## Critical Rules (Low Freedom)

### 🚨 NEVER Create Manual .tss Files

:::danger DEFEATS PURPOSE OF PURGETSS
**PurgeTSS automatically generates ALL styles.**

- **DO NOT** create `app/styles/index.tss`, `login.tss`, or ANY manual `.tss` files
- **ONLY** use utility classes in XML views
- PurgeTSS parses XML → extracts used classes → generates clean `app.tss`
:::

### 🚨 NO FLEXBOX - Titanium Doesn't Support It

:::danger FLEXBOX CLASSES DO NOT EXIST
The following are **NOT supported**:
- ❌ `flex`, `flex-row`, `flex-col`
- ❌ `justify-between`, `justify-center`, `justify-start`, `justify-end`
- ❌ `items-center` for alignment (exists but sets `width/height: FILL`)

**Use Titanium layouts instead:**
- ✅ `horizontal` - Children left to right
- ✅ `vertical` - Children top to bottom
- ✅ Omit layout class - Defaults to `composite` (absolute positioning)
:::

### Other Mandatory Rules

- **NO `p-` padding on base elements** (View, Window, ScrollView, TableView) - Use margins on children
- **View defaults to `SIZE`** - Use `w-screen`/`h-screen` to fill space
- **`w-full` does NOT exist** - Use `w-screen` for full width
- **`rounded-full` does NOT exist** - Use `rounded-full-XX` (XX × 4 = size, border-radius = half)
- **`m-xx` fills parent container** - Add `h-auto`/`w-auto` to constrain to content size
- **`wh-screen` exists** - Shortcut for `w-screen h-screen`
- **NEVER add `composite` class explicitly** - That's the default, use `horizontal`/`vertical` when needed
- **Arbitrary values use parentheses**: `w-(100px)`, `bg-(#ff0000)` - NO square brackets
- **`mode: 'all'` required** in `config.cjs` for Ti Elements styling
- **Classes use `kebab-case`**: `.my-class`, IDs use `camelCase`: `#myId`

## Common Anti-Patterns

**WRONG:**
```xml
<View class="flex-row justify-between">  <!-- Flexbox doesn't exist -->
<View class="p-4">  <!-- No padding on Views -->
<View class="composite">  <!-- Never add composite explicitly -->
```

**CORRECT:**
```xml
<View class="horizontal">
<View class="m-4">  <!-- Use margins on children -->
<View>  <!-- Omit layout = composite by default -->
```

## Reference Guides

Load these only when needed:

### Setup & Configuration
- [Installation & Setup](references/installation-setup.md) - First run, VS Code, LiveView
- [CLI Commands](references/cli-commands.md) - All `purgetss` commands

### Customization
- [Deep Customization](references/customization-deep-dive.md) - config.cjs, colors, spacing, Ti Elements
- [Custom Rules](references/custom-rules.md) - Styling Ti Elements, IDs, classes
- [Apply Directive](references/apply-directive.md) - Extracting utility combinations
- [Configurable Properties](references/configurable-properties.md) - All 80+ customizable properties

### Layout & Styling
- [Grid Layout System](references/grid-layout.md) - 12-column grid, responsive layouts
- [Arbitrary Values](references/arbitrary-values.md) - Parentheses notation for custom values
- [Platform Modifiers](references/platform-modifiers.md) - ios:, android:, tablet:, handheld:
- [Opacity Modifier](references/opacity-modifier.md) - Color transparency with /50 syntax
- [Titanium Resets](references/titanium-resets.md) - Default styles for Ti elements

### Assets & Animations
- [Icon Fonts](references/icon-fonts.md) - Font Awesome 7, Material Icons, custom fonts
- [Animation Component](references/animation-system.md) - Declarative `<Animation>` API

## Examples

For complete WRONG vs CORRECT examples including:
- Titanium layout patterns (horizontal, vertical, composite)
- Grid with percentages
- Gap usage
- Manual .tss anti-patterns

See [EXAMPLES.md](references/EXAMPLES.md)
