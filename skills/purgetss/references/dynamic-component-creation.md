# Dynamic Component Creation with PurgeTSS

> **SCOPE NOTE**
>
> This reference covers dynamic component creation using **Alloy's `$.UI.create()` helper** and **`$.createStyle()` + `applyProperties()`**, both combined with PurgeTSS utility classes. It is an Alloy + PurgeTSS integration guide, **not** documentation for the `purgetss.ui` native module (see [animation-system.md](./animation-system.md) and [animation-advanced.md](./animation-advanced.md) for Alloy animation usage, or [purgetss-ui-classic.md](./purgetss-ui-classic.md) for the generated Classic runtime).
>
> For general Alloy controller and view patterns, refer to the `alloy-guides` and `alloy-howtos` skills.

<!-- TOC-START -->
## Contents

- [Community-Discovered Patterns](#community-discovered-patterns)
- [Overview](#overview)
- [Method 1: `$.UI.create()` (Recommended)](#method-1-uicreate-recommended)
- [Method 2: `$.createStyle()` + `applyProperties()`](#method-2-createstyle--applyproperties)
- [Comparison: Which Method to Use?](#comparison-which-method-to-use)
- [Real-World Examples](#real-world-examples)
- [Important Notes](#important-notes)
- [Changing Classes at Runtime](#changing-classes-at-runtime)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
- [Summary](#summary)

<!-- TOC-END -->

## Community-Discovered Patterns

The guidance in this file reflects patterns that PurgeTSS users have converged on when building components imperatively from Alloy controllers. It complements — but is not a substitute for — official Alloy documentation.

## Overview

When creating components dynamically in Controllers (not declaratively in XML), PurgeTSS provides two methods to apply utility classes:

1. **`$.UI.create()`** - Create components with PurgeTSS classes (Recommended)
2. **`$.createStyle()` + `applyProperties()`** - Apply PurgeTSS styles to existing components

> **BEST PRACTICE**
>
> Always prefer `$.UI.create()` for dynamic components — it's cleaner, more readable, and PurgeTSS picks up the classes during build as long as they are written as literals under a `classes:` key in a controller (see [What the Class Scanner Collects](#what-the-class-scanner-collects)).

---

## Method 1: `$.UI.create()` (Recommended)

### Basic Syntax

```javascript
$.UI.create('ComponentType', {
  // Component properties
  property: value,

  // PurgeTSS utility classes
  classes: ['class-1', 'class-2', 'class-3']
  // OR as string:
  // classes: 'class-1 class-2 class-3'
})
```

### Complete Example: Theme Card

```javascript
// controllers/settings/themes.js
function createThemeCard(themeName, themeTitle, imagePath) {
  return $.UI.create('View', {
    // View properties
    accessibilityLabel: themeTitle, // Read by VoiceOver/TalkBack (Ti.UI.View has no `title` property)

    // PurgeTSS utility classes
    classes: [
      'w-(160)',      // Arbitrary width: 160px
      'ios:mx-1',     // Platform-specific margin (iOS only)
      'border-6',     // Border width: 6dp
      'h-auto',       // Height: SIZE
      'rounded',      // Border radius: 4dp
      'border-white', // Border color: white
      'bg-white'      // Background: white
    ]
  })
}
```

### Supported Components

`$.UI.create()` works with **ALL Titanium UI components**:

| Component Type   | Example                                                                             |
| ---------------- | ----------------------------------------------------------------------------------- |
| `View`           | `$.UI.create('View', { classes: ['w-screen', 'h-auto'] })`                          |
| `Label`          | `$.UI.create('Label', { text: 'Hello', classes: ['text-xl', 'font-bold'] })`        |
| `Button`         | `$.UI.create('Button', { title: 'Click', classes: ['bg-blue-500', 'rounded-lg'] })` |
| `ImageView`      | `$.UI.create('ImageView', { image: '/img.png', classes: ['wh-16', 'rounded'] })`    |
| `TextField`      | `$.UI.create('TextField', { classes: ['border-gray-300', 'border-(1)'] })`          |
| `ScrollView`     | `$.UI.create('ScrollView', { classes: ['wh-screen', 'bg-gray-50'] })`               |
| Any UI component | All `Ti.UI.*` components are supported                                              |

### Classes Format Options

```javascript
// Option 1: Array of classes (recommended for readability)
classes: ['w-screen', 'h-auto', 'bg-white', 'rounded-lg']

// Option 2: String with space-separated classes
classes: 'w-screen h-auto bg-white rounded-lg'

// Option 3: Mix arbitrary values with predefined classes
classes: ['w-(100)', 'h-auto', 'bg-(#ff0000)', 'rounded-lg']
```

### Platform Modifiers in Dynamic Components

```javascript
// Platform-specific classes work perfectly
classes: [
  'ios:mx-2',        // iOS: horizontal margin
  'android:mx-1',    // Android: horizontal margin
  'bg-white',         // Both platforms: white background
  'tablet:text-lg'    // Tablets only: larger text
]
```

### Arbitrary Values

```javascript
// Arbitrary values use parentheses notation
classes: [
  'w-(160)',          // Custom width
  'h-(12.5rem)',      // Custom height with a unit
  'bg-(#3b82f6)',     // Custom hex color
  'm-(10dp)',         // Custom margin with unit
  'border-(2)'        // Custom border width
]
```

### Adding Children Dynamically

```javascript
function createListItem(text, icon) {
  const container = $.UI.create('View', {
    classes: ['horizontal', 'bg-white', 'rounded-lg']
  })

  const iconView = $.UI.create('Label', {
    text: icon,
    classes: ['m-4', 'text-2xl']
  })

  const label = $.UI.create('Label', {
    text: text,
    classes: ['my-4', 'text-base', 'font-semibold']
  })

  container.add(iconView)
  container.add(label)

  return container
}
```

---

## Method 2: `$.createStyle()` + `applyProperties()`

### When to Use This Method

Use the controller's `createStyle()` method when you need to:
- Apply PurgeTSS styles to an **existing component** (created without `$.UI.create()`)
- Build a style dictionary once and apply it to several components
- Style a view of another controller (`Alloy.createController('dialog').createStyle(...)`, as in the Alloy dynamic styles guide)

### Basic Syntax

```javascript
// Create style object
const style = $.createStyle({
  apiName: 'View',
  classes: 'bg-white rounded-lg'
})

// Apply to existing component
$.myView.applyProperties(style)
```

### Complete Example

```javascript
// controllers/form/validation.js
function showError(inputField, errorMessage) {
  // Create error style
  const errorStyle = $.createStyle({
    apiName: 'TextField',
    classes: ['border-2', 'border-red-500', 'bg-red-50']
  })

  // Apply to existing input field
  inputField.applyProperties(errorStyle)
}

function clearError(inputField) {
  // Create normal style
  const normalStyle = $.createStyle({
    apiName: 'TextField',
    classes: ['border-1', 'border-gray-300', 'bg-white']
  })

  // Apply to existing input field
  inputField.applyProperties(normalStyle)
}
```

### Classes Format

```javascript
// String format
$.createStyle({ apiName: 'View', classes: 'bg-white rounded-lg' })

// Array format
$.createStyle({
  apiName: 'Label',
  classes: ['bg-white', 'rounded-lg', 'text-center']
})
```

---

## Comparison: Which Method to Use?

| Scenario                        | Recommended Method                          | Example                                          |
| ------------------------------- | ------------------------------------------- | ------------------------------------------------ |
| **Creating new components**     | `$.UI.create()`                             | `$.UI.create('View', { classes: ['bg-white'] })` |
| **Styling existing components** | `$.createStyle()` + `applyProperties()`     | `view.applyProperties($.createStyle(...))`       |
| **Swapping classes at runtime** | `$.addClass()` / `$.removeClass()` / `$.resetClass()` | Form validation, active/inactive states |
| **Component factories**         | `$.UI.create()`                             | Reusable component creators                      |

---

## Real-World Examples

### Example 1: Dynamic Form Fields

```javascript
// controllers/form.js
function createFormField(fieldType, options) {
  switch (fieldType) {
    case 'text':
      return $.UI.create('TextField', {
        hintText: options.hint,
        classes: ['w-screen', 'h-12', 'mx-4', 'border-gray-300', 'border-(1)', 'rounded-lg', 'bg-white', 'px-4']
      })

    case 'textarea':
      return $.UI.create('TextArea', {
        hintText: options.hint,
        classes: ['w-screen', 'h-24', 'mx-4', 'border-gray-300', 'border-(1)', 'rounded-lg', 'bg-white', 'px-4']
      })

    case 'button':
      return $.UI.create('Button', {
        title: options.title,
        classes: ['w-screen', 'h-14', 'mx-4', 'mt-6', 'bg-blue-500', 'rounded-xl', 'text-white', 'font-bold']
      })
  }
}
```

> **NOTE — Keep factories in controllers, with literal class lists**
>
> - `$` is the controller instance, so `$.UI.create()` is not available in a plain `app/lib/` CommonJS module, and PurgeTSS does not scan `app/lib/` for classes.
> - Each class list is written out in full under `classes:`. A shared `baseClasses` array spread into `classes: [...baseClasses, ...]` is invisible to the scanner: spread elements are skipped and the array itself is not under a `classes:` key, so those classes would be purged from `app.tss`.
> - `px-4` sets `padding`, which exists only on `Ti.UI.TextField`, `Ti.UI.TextArea` (Android and iOS) and `Ti.UI.Android.CardView` (apidoc 13_4_1_GA).

### Example 2: Dynamic List Items

```javascript
// controllers/products/list.js
function createProductCard(product) {
  const card = $.UI.create('View', {
    classes: ['mx-4', 'mb-4', 'bg-white', 'rounded-xl', 'shadow-lg']
  })

  const image = $.UI.create('ImageView', {
    image: product.imageUrl,
    classes: ['w-screen', 'h-40', 'rounded-t-xl']
  })

  const info = $.UI.create('View', {
    classes: ['vertical']
  })

  const title = $.UI.create('Label', {
    text: product.name,
    classes: ['mx-4', 'mt-4', 'text-lg', 'font-bold']
  })

  const price = $.UI.create('Label', {
    text: `$${product.price}`,
    classes: ['mx-4', 'mb-4', 'text-xl', 'text-green-600', 'font-bold']
  })

  info.add(title)
  info.add(price)
  card.add(image)
  card.add(info)

  return card
}
```

### Example 3: Dynamic Theme Switching

```javascript
// controllers/settings/theme.js
function applyTheme(theme) {
  const themes = {
    light: {
      window: $.createStyle({ apiName: 'Window', classes: 'bg-white' }),
      text: $.createStyle({ apiName: 'Label', classes: 'text-gray-900' })
    },
    dark: {
      window: $.createStyle({ apiName: 'Window', classes: 'bg-gray-900' }),
      text: $.createStyle({ apiName: 'Label', classes: 'text-gray-100' })
    }
  }

  $.mainWindow.applyProperties(themes[theme].window)
  $.titleLabel.applyProperties(themes[theme].text)
}
```

### Example 4: Dynamic Icon Grid

```javascript
// controllers/dashboard/grid.js
function createIconGrid(items) {
  // `grid` goes on the container; `grid-cols-4` (width: 25%) goes on each cell
  const grid = $.UI.create('View', {
    classes: ['grid']
  })

  items.forEach(item => {
    const cell = $.UI.create('View', {
      classes: ['grid-cols-4']
    })

    // Optional gutter: `gap-*` sets margins, so it goes on an inner view
    const icon = $.UI.create('View', {
      classes: ['gap-1', 'vertical']
    })

    const iconView = $.UI.create('Label', {
      text: item.icon,
      classes: ['mx-auto', 'mt-4', 'text-3xl', 'text-blue-500']
    })

    const label = $.UI.create('Label', {
      text: item.label,
      classes: ['mx-2', 'mb-4', 'text-xs', 'text-center', 'text-gray-600']
    })

    icon.add(iconView)
    icon.add(label)
    cell.add(icon)
    grid.add(cell)
  })

  return grid
}
```

---

## Important Notes

### PurgeTSS Processes Classes During Build

> **NOTE — HOW IT WORKS**
>
> When you use `$.UI.create()` or `$.createStyle()` with classes:
>
> 1. PurgeTSS scans your controllers for these class references
> 2. It adds the classes to the generated `app.tss`
> 3. At runtime, Alloy applies the styles to your components
>
> This works only for classes the scanner can see (next section). Anything else is purged from `app.tss` and silently does nothing at runtime.

### What the Class Scanner Collects

PurgeTSS parses every file in `app/controllers/**/*.js`, plus `app/widgets/**/controllers/*.js` when `purge.options.widgets` is `true`. Files in `app/lib/` are not scanned.

It collects class names only from these shapes:

| Shape | Example |
| --- | --- |
| Value of a `classes:` or `apply:` property | `classes: ['bg-white', 'rounded-lg']`, `classes: 'bg-white rounded-lg'` |
| Second argument of any `*Class(target, value)` call, or `resetClass(target, value)` | `$.addClass($.label, 'text-red-500')` |

Inside those, it reads string literals, template literals without `${}`, array elements, and both branches of a ternary (`isActive ? 'text-green-500' : 'text-red-500'`).

It does not see classes held in a variable, built by concatenation or interpolation (`` `bg-${color}-500` ``), added with `.push()`, or spread from another array (`[...baseClasses]`). For classes that must be built dynamically, list them in `purge.options.safelist` in `purgetss/config.cjs`, which keeps them no matter the purge mode (see the PurgeTSS configuring guide, `options.safelist`):

```javascript
// purgetss/config.cjs
module.exports = {
  purge: {
    options: {
      safelist: ['bg-red-500', 'bg-green-500', 'bg-blue-500']
    }
  }
}
```

### Class Verification

Just like with XML views, always verify classes exist before using them:

```javascript
// CORRECT - Verified classes
classes: ['w-screen', 'h-auto', 'bg-white', 'rounded-lg']

// WRONG - These classes don't exist
classes: ['flex-row', 'justify-center']  // No flexbox in Titanium

// NO EFFECT - `p-4` exists, but it sets `padding`, which only TextField, TextArea and Android CardView have
$.UI.create('View', { classes: ['p-4'] })  // Use margins on the children instead
```

See [Class Index](class-index.md) for available classes.

### Platform-Specific Best Practices

```javascript
// Best practice: Use platform modifiers
classes: [
  'w-screen',
  'ios:mx-4',      // iOS spacing
  'android:mx-2',  // Android spacing
  'bg-white'
]

// Avoid: Conditional logic in controllers (the scanner does not see `.push()`, so classes added only this way are purged)
if (OS_IOS) {
  classes.push('mx-4')
} else {
  classes.push('mx-2')
}
```

---

## Changing Classes at Runtime

`applyProperties({ classes: [...] })` does not restyle a view: it only sets a `classes` property on the proxy. To change the classes of a view that already exists, use the controller's `addClass`, `removeClass` and `resetClass` methods (Alloy dynamic styles guide). Pass the view, then the classes as an array or space-separated string, and optionally inline properties as a third argument:

```javascript
// Toggle status styling dynamically
function setStatus(isActive) {
  $.removeClass($.statusLabel, isActive ? 'text-red-500' : 'text-green-500')
  $.addClass($.statusLabel, isActive ? 'text-green-500' : 'text-red-500', {
    text: isActive ? L('active') : L('inactive')
  })
}
```

- `resetClass(view, classes)` replaces every class on the view, including the ones set in XML, so pass the full list.
- Enable autostyle (`<Alloy autoStyle="true">` in the view, or `autoStyle: true` in `config.json`) so removing a class also reverts its properties. Without it, a removed class leaves its values on the view.
- The PurgeTSS scanner reads the second argument of these calls, including both branches of a ternary.

### Conditional Styling Based on State

```javascript
// Loading state button
function setLoading(isLoading) {
  $.submitBtn.applyProperties({
    enabled: !isLoading,
    title: isLoading ? L('saving') : L('save')
  })
}

// Error state on form field
function showFieldError(field, errorLabel, hasError) {
  $[field].applyProperties({
    borderColor: hasError ? '#ef4444' : '#d1d5db'
  })
  $[errorLabel].applyProperties({
    visible: hasError
  })
}
```

### Visibility Toggle Pattern

```javascript
// Show/hide views based on state
function setState(state) {
  const states = ['loadingState', 'contentState', 'errorState']
  states.forEach(s => {
    $[s].visible = s === state
  })
}
```

> **NOTE — When to use `addClass`/`removeClass` vs `applyProperties`**
>
> - Use `addClass`/`removeClass`/`resetClass` when you want to swap entire style sets (e.g., active/inactive states)
> - Use `applyProperties` with direct values when changing individual properties (e.g., text, enabled)
> - Combine both for complex state changes

---

## Anti-Patterns to Avoid

### Don't use `Ti.UI.create()` with Manual Styles

```javascript
// WRONG - Manual styling, no PurgeTSS benefits
const view = Ti.UI.createView({
  width: Ti.UI.FILL,
  height: Ti.UI.SIZE,
  backgroundColor: '#ffffff',
  borderRadius: 8
})
```

### Use `$.UI.create()` with PurgeTSS classes

```javascript
// CORRECT - Full PurgeTSS power
const view = $.UI.create('View', {
  classes: ['w-screen', 'h-auto', 'bg-white', 'rounded-lg']
})
```

### Mixing inline properties and classes: keep inline values for runtime data

Alloy supports inline properties next to `classes`, and inline properties take precedence over class styles. Use them for values only known at runtime, and keep static styling in classes so it stays consistent with the rest of the app:

```javascript
// Avoid - a static value that a class already covers
const view = $.UI.create('View', {
  backgroundColor: '#ffffff',  // Same as `bg-white`
  classes: ['w-screen', 'rounded-lg']
})
```

```javascript
// CORRECT - Pure PurgeTSS
const view = $.UI.create('View', {
  classes: ['w-screen', 'h-auto', 'bg-white', 'rounded-lg']
})

// CORRECT - Runtime values inline, static styling as classes
const view = $.UI.create('View', {
  backgroundColor: dynamicColor,  // Runtime value, overrides any class color
  width: calculatedWidth,
  classes: ['rounded-lg', 'm-4']
})
```

---

## Summary

| Method                    | Use Case                    | Syntax                                               |
| ------------------------- | --------------------------- | ---------------------------------------------------- |
| **`$.UI.create()`**       | Creating new components     | `$.UI.create('View', { classes: ['bg-white'] })`     |
| **`$.createStyle()`**     | Styling existing components | `$.createStyle({ apiName: 'View', classes: 'bg-white' })` |
| **`applyProperties()`**   | Apply style to component    | `component.applyProperties(style)`                   |
| **`$.addClass()` / `$.removeClass()` / `$.resetClass()`** | Swapping classes at runtime | `$.addClass($.label, 'text-red-500')` |

> **NOTE — REMEMBER**
>
> Both methods give you full access to PurgeTSS utilities:
>
> - All color classes (`bg-*`, `text-*`, `border-*`)
> - All spacing classes (`m-*`, `gap-*`, and `p-*` where the Titanium component supports padding)
> - All layout classes (`horizontal`, `vertical`)
> - All typography classes (`text-*`, `font-*`)
> - Platform modifiers (`ios:*`, `android:*`)
> - Arbitrary values (`w-(100)`, `bg-(#ff0000)`)
