# The `apply` Directive

## Table of Contents

- [The `apply` Directive](#the-apply-directive)
  - [Table of Contents](#table-of-contents)
  - [Create Complex Classes and IDs](#create-complex-classes-and-ids)
  - [Set Any ID, Class, or Ti Element](#set-any-id-class-or-ti-element)
  - [Use Any of the Default Classes](#use-any-of-the-default-classes)
  - [Use Arbitrary Values](#use-arbitrary-values)
  - [Use Any Newly Defined Class in config.cjs](#use-any-newly-defined-class-in-configcjs)
  - [Set a String of Classes or an Array of Classes](#set-a-string-of-classes-or-an-array-of-classes)
  - [Combine with Any Platform, Device, or Conditional-Block Properties](#combine-with-any-platform-device-or-conditional-block-properties)
  - [Platform-Specific Classes](#platform-specific-classes)
    - [Omitting the Platform Variant](#omitting-the-platform-variant)
  - [Complete Example with Platform Variants](#complete-example-with-platform-variants)
  - [Composing Component Libraries](#composing-component-libraries)

---

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

## Set Any ID, Class, or Ti Element

```javascript
// purgetss/config.cjs
theme: {
  extend: {},
  Label: {
    apply: 'text-base font-bold text-gray-700'
  },
  fontWeight: {
    bold: 'bold'
  },
  fontFamily: {
    'saira-condensed': 'SairaCondensed-Regular'
  },
  '#carrousel': {
    apply: 'w-screen h-auto bg-teal-200 mx-2 my-4 horizontal'
  },
  '.my-custom-class': {
    apply: 'font-bold border-2 rounded wh-auto my-0.5 font-saira-condensed'
  }
}
```

**Generated TSS:**

```css
'Label': { color: '#374151', textColor: '#374151', font: { fontSize: 16, fontWeight: 'bold' } }

/* Custom Classes */
'#carrousel': { backgroundColor: '#99f6e4', height: Ti.UI.SIZE, layout: 'horizontal', right: 8, left: 8, top: 16, bottom: 16, width: Ti.UI.FILL }
'.my-custom-class': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontFamily: 'SairaCondensed-Regular', fontWeight: 'bold' } }
'.font-saira-condensed': { font: { fontFamily: 'SairaCondensed-Regular' } }
'.font-bold': { font: { fontWeight: 'bold' } }
```

## Use Any of the Default Classes

```javascript
// purgetss/config.cjs
theme: {
  '.btn': {
    apply: 'font-bold border-2 rounded wh-auto my-0.5 font-saira-condensed'
  },
  '.btn-primary': {
    apply: 'bg-green-500 text-green-100 border-green-200'
  },
}
```

**Generated TSS:**

```css
/* Custom Classes */
'.btn': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontFamily: 'SairaCondensed-Regular', fontWeight: 'bold' } }
'.btn-primary': { backgroundColor: '#22c55e', borderColor: '#bbf7d0', color: '#dcfce7', textColor: '#dcfce7' }
```

## Use Arbitrary Values

You can use arbitrary values to define your custom classes.

```javascript
// purgetss/config.cjs
theme: {
  extend: {},
  '.progress': {
    apply: 'h-(1rem) horizontal bg-(#e9ecef) text-(.75rem) rounded-(.25rem)'
  }
}
```

**Generated TSS:**

```css
/* Custom Classes */
'.progress': { backgroundColor: '#e9ecef', borderRadius: 4, height: 16, layout: 'horizontal', font: { fontSize: 12 } }
```

## Use Any Newly Defined Class in config.cjs

In the following example, we are creating `corporate` color classes so we can use them in the `apply` directive with `bg-corporate-500`, `text-corporate-100`, and `border-corporate-200`.

```javascript
// purgetss/config.cjs
theme: {
  extend: {
    colors: {
      // New color values that will generate bg-colors, text-colors, border-colors classes.
      corporate: {
        100: '#dddfe1', 200: '#babfc4', 500: '#53606b'
      }
    }
  },
  '.btn': {
    apply: 'wh-auto font-bold border-2 rounded my-0.5'
  },
  '.btn-corporate': {
    // Newly created classes ( see extend.colors.corporate )
    apply: 'bg-corporate-500 text-corporate-100 border-corporate-200'
  }
}
```

**Generated TSS:**

```css
/* Custom Classes */
'.btn': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontWeight: 'bold' } }
'.btn-corporate': { backgroundColor: '#53606b', borderColor: '#babfc4', color: '#dddfe1', textColor: '#dddfe1' }
/* ... */
/* color Property */
'.text-corporate-100': { color: '#dddfe1', textColor: '#dddfe1' }
'.text-corporate-200': { color: '#babfc4', textColor: '#babfc4' }
'.text-corporate-500': { color: '#53606b', textColor: '#53606b' }
/* backgroundColor Property */
'.bg-corporate-100': { backgroundColor: '#dddfe1' }
'.bg-corporate-200': { backgroundColor: '#babfc4' }
'.bg-corporate-500': { backgroundColor: '#53606b' }
/* borderColor Property */
'.border-corporate-100': { borderColor: '#dddfe1' }
'.border-corporate-200': { borderColor: '#babfc4' }
'.border-corporate-500': { borderColor: '#53606b' }
/* And the rest of color properties! */
```

## Set a String of Classes or an Array of Classes

```javascript
// purgetss/config.cjs
theme: {
  extend: {
    colors: {
      corporate: {
        100: '#dddfe1', 200: '#babfc4', 500: '#53606b'
      }
    }
  },
  // Use a string of classes
  '.btn': {
    apply: 'font-bold border-2 rounded wh-auto my-0.5'
  },
  // or an array of classes
  '.btn-corporate': {
    apply: [
      'bg-corporate-500',
      'text-corporate-100',
      'border-corporate-200'
    ]
  }
}
```

**Generated TSS:**

```css
/* Custom Classes */
'.btn': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontWeight: 'bold' } }
'.btn-corporate': { backgroundColor: '#53606b', borderColor: '#babfc4', color: '#dddfe1', textColor: '#dddfe1' }
```

## Combine with Any Platform, Device, or Conditional-Block Properties

```javascript
// purgetss/config.cjs
theme: {
  '.btn': {
    // Default .btn
    apply: 'font-bold border-2 rounded wh-auto my-0.5',

    // Specific to iOS devices
    ios: {
      apply: 'w-screen mx-4'
    },

    // Specific to handheld devices
    handheld: {
      apply: 'h-20'
    },

    // Specific to iPhoneX (if Alloy.Global.iPhoneX is set)
    '[if=Alloy.Globals.iPhoneX]': {
      apply: 'mb-12'
    }
  },
}
```

**Generated TSS:**

```css
/* Custom Classes */
'.btn': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontWeight: 'bold' } }
'.btn[platform=ios]': { right: 16, left: 16, width: Ti.UI.FILL }
'.btn[formFactor=handheld]': { height: 80 }
'.btn[if=Alloy.Globals.iPhoneX]': { bottom: 48 }
```

## Platform-Specific Classes

Several classes in `tailwind.tss` are platform-specific to prevent polluting objects with properties that are not specific to a particular platform.

:::caution IMPORTANT
To properly apply these platform styles when creating custom rules, you **must specify the platform variant** in the `apply` directive.

**Even if you are not targeting a specific platform, you must specify the platform variant.**
:::

```javascript
// purgetss/config.cjs
module.exports = {
  theme: {
    '.my-view': {
      // Targeting iOS.
      'ios': {
        'apply': 'bg-green-500 wh-32 ios:clip-enabled'
      }
    }
  },
};
```

**Generated TSS:**

```css
/* Custom Classes */
'.my-view[platform=ios]': { backgroundColor: '#22c55e', clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED, width: 128, height: 128 }
```

### Omitting the Platform Variant

If you omit the platform variant, **PurgeTSS** won't be able to determine which platform you are targeting, and the custom class will not have the corresponding property.

```javascript
// purgetss/config.cjs
module.exports = {
  theme: {
    // Even if you are not targeting a specific platform, you must specify the platform variant
    '.my-view': {
      // Missing platform variant in clip-enabled
      'apply': 'wh-32 clip-enabled bg-green-500'
    }
  },
};
```

**Generated TSS (missing clip-enabled property):**

```css
/* Omitting the platform variant in `config.cjs` will not generate the corresponding property. */
/* Missing the property related to `clip-enabled`. */
'.my-view': { backgroundColor: '#22c55e', width: 128, height: 128 }
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

**Generated TSS:**

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
