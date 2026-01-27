# Dynamic Component Creation with PurgeTSS

## Table of Contents

- [Dynamic Component Creation with PurgeTSS](#dynamic-component-creation-with-purgetss)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Method 1: `$.UI.create()` (Recommended)](#method-1-uicreate-recommended)
    - [Basic Syntax](#basic-syntax)
    - [Complete Example: Theme Card](#complete-example-theme-card)
    - [Supported Components](#supported-components)
    - [Classes Format Options](#classes-format-options)
    - [Platform Modifiers in Dynamic Components](#platform-modifiers-in-dynamic-components)
    - [Arbitrary Values](#arbitrary-values)
    - [Adding Children Dynamically](#adding-children-dynamically)
  - [Method 2: `Alloy.createStyle()` + `applyProperties()`](#method-2-alloycreatestyle--applyproperties)
    - [When to Use This Method](#when-to-use-this-method)
    - [Basic Syntax](#basic-syntax-1)
    - [Complete Example](#complete-example)
    - [Classes Format](#classes-format)
  - [Comparison: Which Method to Use?](#comparison-which-method-to-use)
  - [Real-World Examples](#real-world-examples)
    - [Example 1: Dynamic Form Fields](#example-1-dynamic-form-fields)
    - [Example 2: Dynamic List Items](#example-2-dynamic-list-items)
    - [Example 3: Dynamic Theme Switching](#example-3-dynamic-theme-switching)
    - [Example 4: Dynamic Icon Grid](#example-4-dynamic-icon-grid)
  - [Important Notes](#important-notes)
    - [PurgeTSS Processes Classes During Build](#purgetss-processes-classes-during-build)
    - [Class Verification](#class-verification)
    - [Platform-Specific Best Practices](#platform-specific-best-practices)
  - [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
    - [❌ Don't Use `Ti.UI.create()` with Manual Styles](#-dont-use-tiuicreate-with-manual-styles)
    - [✅ Use `$.UI.create()` with PurgeTSS Classes](#-use-uicreate-with-purgetss-classes)
    - [❌ Don't Mix Styles and Classes](#-dont-mix-styles-and-classes)
    - [✅ Use Only Classes (or Only Styles)](#-use-only-classes-or-only-styles)
  - [Summary](#summary)

---

## Overview

When creating components dynamically in Controllers (not declaratively in XML), PurgeTSS provides two powerful methods to apply utility classes:

1. **`$.UI.create()`** - Create components with PurgeTSS classes (Recommended)
2. **`Alloy.createStyle()` + `applyProperties()`** - Apply PurgeTSS styles to existing components

:::tip BEST PRACTICE
**Always prefer `$.UI.create()` for dynamic components** - it's cleaner, more readable, and PurgeTSS will process the classes automatically during build.
:::

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
    valor: themeName,
    title: themeTitle, // Add title for TTS support

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
classes: ['w-(100px)', 'h-auto', 'bg-(#ff0000)', 'rounded-lg']
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
  'h-(200px)',        // Custom height with unit
  'bg-(#3b82f6)',     // Custom hex color
  'm-(10dp)',         // Custom margin with unit
  'border-(2)'        // Custom border width
]
```

### Adding Children Dynamically

```javascript
function createListItem(text, icon) {
  const container = $.UI.create('View', {
    classes: ['horizontal', 'm-4', 'p-4', 'bg-white', 'rounded-lg']
  })

  const iconView = $.UI.create('Label', {
    text: icon,
    classes: ['text-2xl', 'mr-4']
  })

  const label = $.UI.create('Label', {
    text: text,
    classes: ['text-base', 'font-semibold']
  })

  container.add(iconView)
  container.add(label)

  return container
}
```

---

## Method 2: `Alloy.createStyle()` + `applyProperties()`

### When to Use This Method

Use `Alloy.createStyle()` when you need to:
- Apply PurgeTSS styles to an **existing component** (created without `$.UI.create()`)
- Modify styles dynamically after component creation
- Apply styles from a different view/controller

### Basic Syntax

```javascript
// Create style object
const style = Alloy.createStyle('viewName', {
  apiName: 'Ti.UI.View',
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
  const errorStyle = Alloy.createStyle('index', {
    apiName: 'Ti.UI.TextField',
    classes: ['border-2', 'border-red-500', 'bg-red-50']
  })

  // Apply to existing input field
  inputField.applyProperties(errorStyle)
}

function clearError(inputField) {
  // Create normal style
  const normalStyle = Alloy.createStyle('index', {
    apiName: 'Ti.UI.TextField',
    classes: ['border-1', 'border-gray-300', 'bg-white']
  })

  // Apply to existing input field
  inputField.applyProperties(normalStyle)
}
```

### Classes Format

```javascript
// String format
Alloy.createStyle('index', { classes: 'bg-white rounded-lg' })

// Array format
Alloy.createStyle('index', {
  classes: ['bg-white', 'rounded-lg', 'text-center']
})
```

---

## Comparison: Which Method to Use?

| Scenario                        | Recommended Method                          | Example                                          |
| ------------------------------- | ------------------------------------------- | ------------------------------------------------ |
| **Creating new components**     | `$.UI.create()`                             | `$.UI.create('View', { classes: ['bg-white'] })` |
| **Styling existing components** | `Alloy.createStyle()` + `applyProperties()` | `view.applyProperties(Alloy.createStyle(...))`   |
| **Dynamic style changes**       | `Alloy.createStyle()` + `applyProperties()` | Form validation, theme switching                 |
| **Component factories**         | `$.UI.create()`                             | Reusable component creators                      |

---

## Real-World Examples

### Example 1: Dynamic Form Fields

```javascript
// lib/factories/formFactory.js
exports.createFormField = function fieldType, options) {
  const baseClasses = ['w-screen', 'h-12', 'mx-4', 'border-gray-300', 'border-(1)', 'rounded-lg']

  switch (fieldType) {
    case 'text':
      return $.UI.create('TextField', {
        hintText: options.hint,
        classes: [...baseClasses, 'bg-white', 'px-4']
      })

    case 'textarea':
      return $.UI.create('TextArea', {
        hintText: options.hint,
        classes: [...baseClasses, 'h-24', 'bg-white', 'px-4']
      })

    case 'button':
      return $.UI.create('Button', {
        title: options.title,
        classes: ['w-screen', 'h-14', 'mx-4', 'mt-6', 'bg-blue-500', 'rounded-xl', 'text-white', 'font-bold']
      })
  }
}
```

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
    classes: ['vertical', 'p-4']
  })

  const title = $.UI.create('Label', {
    text: product.name,
    classes: ['text-lg', 'font-bold', 'mb-2']
  })

  const price = $.UI.create('Label', {
    text: `$${product.price}`,
    classes: ['text-xl', 'text-green-600', 'font-bold']
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
      window: Alloy.createStyle('index', { classes: 'bg-white' }),
      text: Alloy.createStyle('index', { classes: 'text-gray-900' })
    },
    dark: {
      window: Alloy.createStyle('index', { classes: 'bg-gray-900' }),
      text: Alloy.createStyle('index', { classes: 'text-gray-100' })
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
  const grid = $.UI.create('View', {
    classes: ['w-screen', 'grid-cols-4', 'gap-4', 'p-4']
  })

  items.forEach(item => {
    const icon = $.UI.create('View', {
      classes: ['vertical', 'items-center']
    })

    const iconView = $.UI.create('Label', {
      text: item.icon,
      classes: ['text-3xl', 'mb-2', 'text-blue-500']
    })

    const label = $.UI.create('Label', {
      text: item.label,
      classes: ['text-xs', 'text-center', 'text-gray-600']
    })

    icon.add(iconView)
    icon.add(label)
    grid.add(icon)
  })

  return grid
}
```

---

## Important Notes

### PurgeTSS Processes Classes During Build

:::info HOW IT WORKS
When you use `$.UI.create()` or `Alloy.createStyle()` with classes:

1. PurgeTSS scans your controllers for these class references
2. It adds the classes to the generated `app.tss`
3. At runtime, Alloy applies the styles to your components

This means you get **full PurgeTSS power** even with dynamic components!
:::

### Class Verification

Just like with XML views, **always verify classes exist** before using them:

```javascript
// ✅ CORRECT - Verified classes
classes: ['w-screen', 'h-auto', 'bg-white', 'rounded-lg']

// ❌ WRONG - These classes don't exist
classes: ['flex-row', 'justify-center', 'p-4']  // No flexbox, no p-* on View
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

// Avoid: Conditional logic in controllers
if (OS_IOS) {
  classes.push('mx-4')
} else {
  classes.push('mx-2')
}
```

---

## Anti-Patterns to Avoid

### ❌ Don't Use `Ti.UI.create()` with Manual Styles

```javascript
// WRONG - Manual styling, no PurgeTSS benefits
const view = Ti.UI.createView({
  width: Ti.UI.FILL,
  height: Ti.UI.SIZE,
  backgroundColor: '#ffffff',
  borderRadius: 8
})
```

### ✅ Use `$.UI.create()` with PurgeTSS Classes

```javascript
// CORRECT - Full PurgeTSS power
const view = $.UI.create('View', {
  classes: ['w-screen', 'h-auto', 'bg-white', 'rounded-lg']
})
```

### ❌ Don't Mix Styles and Classes

```javascript
// CONFUSING - Mix of styles and classes
const view = $.UI.create('View', {
  backgroundColor: '#ffffff',  // Manual style
  classes: ['w-screen', 'rounded-lg']  // PurgeTSS classes
})
```

### ✅ Use Only Classes (or Only Styles)

```javascript
// CORRECT - Pure PurgeTSS
const view = $.UI.create('View', {
  classes: ['w-screen', 'h-auto', 'bg-white', 'rounded-lg']
})

// OR for truly dynamic/runtime-only values
const view = Ti.UI.createView({
  backgroundColor: dynamicColor,  // Runtime value
  width: calculatedWidth
})
// Then apply PurgeTSS classes
view.applyProperties(Alloy.createStyle('index', {
  classes: ['rounded-lg', 'm-4']
}))
```

---

## Summary

| Method                    | Use Case                    | Syntax                                               |
| ------------------------- | --------------------------- | ---------------------------------------------------- |
| **`$.UI.create()`**       | Creating new components     | `$.UI.create('View', { classes: ['bg-white'] })`     |
| **`Alloy.createStyle()`** | Styling existing components | `Alloy.createStyle('view', { classes: 'bg-white' })` |
| **`applyProperties()`**   | Apply style to component    | `component.applyProperties(style)`                   |

:::tip REMEMBER
Both methods give you **full access to PurgeTSS utilities**:
- All color classes (`bg-*`, `text-*`, `border-*`)
- All spacing classes (`m-*`, `p-*`, `gap-*`)
- All layout classes (`horizontal`, `vertical`)
- All typography classes (`text-*`, `font-*`)
- Platform modifiers (`ios:*`, `android:*`)
- Arbitrary values (`w-(100px)`, `bg-(#ff0000)`)
:::
