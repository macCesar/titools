# Custom Rules

Custom rules in PurgeTSS let you style Titanium elements, IDs, and classes in `config.cjs`. You can also target specific platforms, devices, or conditional blocks using global variables.

## Classes, IDs, and Ti Elements

You can style any Ti Element, IDs, or your own classes with as many attributes as needed. You can also target specific platforms, devices, or add conditional blocks with global variables.

Whether you want to style a Ti Element, a custom ID prefixed with `#`, or a custom class prefixed with `.`, the structure is the same.

### Modifier Key

- For Titanium elements, use the exact name of the element, such as `Label`, `Button`, or `ScrollView`.
- For IDs, use `camelCase` to match the JavaScript convention.
- For classes, use `kebab-case` to stay compatible with PurgeTSS v6.x and above. For example, use `.my-custom-class-name` instead of `.myCustomClassName`.

:::caution
If your project started on PurgeTSS v5 or earlier and you now use 7.x or later, set `purge.options.missing` to `true` in `config.cjs`. It reports missing classes at the end of `app.tss` so you can update them to the newer naming convention.
:::

### Default, Platform, Device, or Conditional Blocks

- To generate a global style, use either the lowercase `default` or the uppercase `DEFAULT` keyword.
- To target a specific platform, use the `ios` or `android` keywords.
- To target a specific device, use the `tablet` or `handheld` keywords.
- To target a condition with a global variable, use the `[if=globalVariableName]` keyword.

### Property Values

- For Titanium constants, Alloy configuration values, or global variables, always enclose them in quotes.
- For color values, you can use `hex`, `8-digit hex`, `rgb(R,G,B)`, `rgba(R,G,B,A)`, `transparent`, or standard color names.
- For spacing values, you can use `em`, `rem`, `%`, `px`, `dp`, `cm`, or `in`.
  - `%`, `px`, `cm`, and `in` are passed through without conversion.
  - `em` and `rem` values are converted with `value * 16`.
  - `dp` removes the unit and keeps the value as-is.

:::warning Platform-Specific Constants
If a rule uses `Ti.UI.iOS.*` or `Ti.UI.Android.*` constants, keep that property inside the matching `ios` or `android` block to avoid cross-platform compilation failures.
:::

## `config.cjs` File Example

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    '#main-banner': {
      DEFAULT: {
        width: '300px',
        height: '80px'
      },
      ios: {
        clipMode: 'Ti.UI.iOS.CLIP_MODE_DISABLED'
      }
    },
    '.gallery': {
      DEFAULT: {
        height: 'Ti.UI.SIZE'
      },
      ios: {
        clipMode: 'Ti.UI.iOS.CLIP_MODE_ENABLED'
      },
      android: {
        hiddenBehavior: 'Ti.UI.HIDDEN_BEHAVIOR_GONE'
      },
      handheld: {
        width: '250px'
      },
      tablet: {
        width: '500px'
      }
    },
    TextField: {
      DEFAULT: {
        top: 10,
        left: 20,
        right: 20,
        bottom: 0
      },
      '[if=Alloy.Globals.iPhoneX]': {
        bottom: 'Alloy.CFG.iPhoneXNotchSize'
      },
      android: {
        touchFeedback: true
      }
    }
  }
};
```

`Custom ./purgetss/styles/utilities.tss file`
```tss
/* Property: TextField */
/* Description: A single line text field. */
'TextField': { top: 10, left: 20, right: 20, bottom: 0 }
'TextField[if=Alloy.Globals.iPhoneX]': { bottom: Alloy.CFG.iPhoneXNotchSize }
'TextField[platform=android]': { touchFeedback: true }

/* Custom Classes */
'#main-banner': { width: '300px', height: '80px' }
'#main-banner[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }

'.gallery': { height: Ti.UI.SIZE }
'.gallery[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED }
'.gallery[platform=android]': { hiddenBehavior: Ti.UI.HIDDEN_BEHAVIOR_GONE }
'.gallery[formFactor=handheld]': { width: '250px' }
'.gallery[formFactor=tablet]': { width: '500px' }
```
