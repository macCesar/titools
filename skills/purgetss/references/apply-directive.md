# The `apply` Directive

## Create Complex Classes and IDs

:::info
Use the `apply` directive to compose multiple classes into reusable components, extract repetitive patterns, or create platform-specific variants.
:::

The `apply` directive allows you to:
- Set any ID, class, or Ti Element
- Use default PurgeTSS classes
- Use arbitrary values
- Use newly defined classes in `config.cjs`
- Set a string or array of classes
- Combine with platform, device, or conditional properties

## Basic Syntax

```javascript
// purgetss/config.cjs
theme: {
  Label: {
    apply: 'text-base font-bold text-gray-700'
  },
  '#carrousel': {
    apply: 'w-screen h-auto bg-teal-200 mx-2 my-4 horizontal'
  },
  '.my-custom-class': {
    apply: 'font-bold border-2 rounded wh-auto my-0.5 font-saira-condensed'
  }
}
```

## String vs Array of Classes

```javascript
// String of classes
'.btn': {
  apply: 'font-bold border-2 rounded wh-auto my-0.5'
}

// Array of classes
'.btn-primary': {
  apply: [
    'bg-green-500',
    'text-green-100',
    'border-green-200'
  ]
}
```

## Using Arbitrary Values

```javascript
'.progress': {
  apply: 'h-(1rem) horizontal bg-(#e9ecef) text-(.75rem) rounded-(.25rem)'
}
```

## Using Custom Classes from `theme.extend`

```javascript
// Define custom colors first
theme: {
  extend: {
    colors: {
      corporate: {
        100: '#dddfe1',
        200: '#babfc4',
        500: '#53606b'
      }
    }
  },
  // Then use them in apply
  '.btn-corporate': {
    apply: 'bg-corporate-500 text-corporate-100 border-corporate-200'
  }
}
```

## Platform-Specific Classes

:::caution IMPORTANT
For platform-specific styles (e.g., `ios:clip-enabled`), you **must specify the platform variant** in the `apply` directive, even if not directly targeting that platform.
:::

```javascript
// CORRECT - Platform variant specified
'.my-view': {
  'ios': {
    'apply': 'bg-green-500 wh-32 ios:clip-enabled'
  }
}

// WRONG - Platform variant omitted
'.my-view': {
  'apply': 'wh-32 clip-enabled bg-green-500'
}
```

## Complete Example with Platform Variants

```javascript
// config.cjs
module.exports = {
  theme: {
    extend: {
      colors: {
        corporate: {
          100: '#dddfe1',
          200: '#babfc4',
          500: '#53606b'
        }
      }
    },
    '.btn': {
      // Default button
      apply: 'wh-auto font-bold border-2 rounded my-0.5',
      // iOS variant
      ios: {
        apply: 'w-screen mx-4'
      },
      // Handheld variant
      handheld: {
        apply: 'h-20'
      },
      // Conditional variant
      '[if=Alloy.Globals.iPhoneX]': {
        apply: 'mb-12'
      }
    },
    '.btn-corporate': {
      // Use custom colors
      apply: [
        'bg-corporate-500',
        'text-corporate-100',
        'border-corporate-200'
      ],
      // Platform-specific
      ios: {
        apply: 'ios:shadow-offset-0'
      }
    }
  }
}
```

## Generated TSS

```css
'.btn': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontWeight: 'bold' } }
'.btn[platform=ios]': { right: 16, left: 16, width: Ti.UI.FILL }
'.btn[formFactor=handheld]': { height: 80 }
'.btn[if=Alloy.Globals.iPhoneX]': { bottom: 48 }

'.btn-corporate': { backgroundColor: '#53606b', borderColor: '#babfc4', color: '#dddfe1', textColor: '#dddfe1' }
'.btn-corporate[platform=ios]': { shadowOffset: { x: 0, y: 0 } }
```

## Composing Component Libraries

```javascript
// config.cjs - Building a component library
theme: {
  // Base button
  '.btn': {
    apply: 'px-4 py-2 rounded font-semibold text-center cursor-pointer'
  },
  // Variants
  '.btn-primary': {
    apply: 'bg-blue-500 text-white hover:bg-blue-600'
  },
  '.btn-secondary': {
    apply: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  },
  '.btn-danger': {
    apply: 'bg-red-500 text-white hover:bg-red-600'
  },
  // Sizes
  '.btn-sm': {
    apply: 'px-2 py-1 text-sm'
  },
  '.btn-lg': {
    apply: 'px-6 py-3 text-lg'
  }
}
```
