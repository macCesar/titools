---
name: purgetss
description: "Expert styling and UI/UX design system using the PurgeTSS toolkit for Titanium SDK. Use when Claude needs to: (1) Set up a new project with utility-first styling, (2) Implement complex Grid-based or responsive layouts, (3) Create declarative animations using the Animation component, (4) Automate assets like Icon Fonts or Color Palettes via CLI, (5) Configure advanced design rules in config.cjs, or (6) Work with arbitrary values, platform modifiers, and custom Ti Elements."
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

- **NO `p-` padding classes**: Titanium does NOT support a native `padding` property on `View`, `Window`, `ScrollView`, or `TableView`. Always use **margins on children** (`m-`) to simulate internal spacing.
- **View defaults to `SIZE`**: Use `w-screen`/`h-screen` to fill space when needed.
- **`rounded-full`**: To get a perfect circle, use `rounded-full-XX` (where XX is the width/height of the square element).
- **`rounded-full-XX` includes size**: These classes already set `width`, `height`, and `borderRadius`. Do **not** add `w-XX h-XX`/`wh-XX` unless you need to override.
- **`m-xx` on FILL elements**: Adding `m-4` to a `w-screen` element pins it to all four edges (top, bottom, left, right). This will **stretch the component vertically** to fill the parent unless you explicitly add `h-auto` (`Ti.UI.SIZE`) to constrain it to its content.
- **`w-XX` + `h-XX` → `wh-XX`**: If both width and height use the same scale value, prefer a single `wh-XX` (order doesn't matter: `w-10 h-10` and `h-10 w-10` are equivalent).
- **Use `wh-` shortcuts**: PurgeTSS provides a complete scale of combined width/height utilities:
    - **Numeric Scale**: `wh-0` to `wh-96` (e.g., `wh-16` sets both to 64px).
    - **Fractions**: `wh-1/2`, `wh-3/4`, up to `wh-11/12` for proportional sizing.
    - **Special Values**: `wh-auto` (explicit `SIZE`), `wh-full` (`100%`), and `wh-screen` (`FILL`).
    - Using these instead of separate `w-` and `h-` classes improves XML readability and reduces generated TSS size.

:::tip LAYOUT TIP: EDGE PINNING
If using margins (`m-`) causes your `Label` or `Button` to stretch unexpectedly, it is due to Titanium's **Edge Pinning** rule (2 opposite pins = computed dimension). Use the `wh-auto` class to explicitly force `SIZE` behavior and prevent stretching.
:::

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
- [Smart Mappings](references/smart-mappings.md) - How gap, shadows, and grid work under the hood
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

## Related Skills

For tasks beyond styling, use these complementary skills:

| Task | Use This Skill |
|------|----------------|
| Project architecture, services, controllers | `alloy-expert` |
| Complex UI components, ListViews, gestures | `ti-ui` |
| Alloy MVC concepts, data binding, TSS syntax | `alloy-guides` |
| Native features (camera, location, push) | `ti-howtos` |
