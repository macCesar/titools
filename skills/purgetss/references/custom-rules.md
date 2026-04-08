# Custom Rules

Custom rules in PurgeTSS let you style Titanium elements, IDs, and classes in `config.cjs`. You can also target specific platforms, devices, or conditional blocks using global variables. Handy when a project spans iOS and Android and you want to keep styles in one place.

## Classes, IDs, and Ti Elements

Whether you want to style a Ti Element (also known as a markup element), a custom ID prefixed with a hash (`#`), or a custom class prefixed with a period (`.`), the structure is the same.

### Modifier Key

- For Titanium elements, use the exact name of the element, such as `Label`, `Button`, or `ScrollView`.
- For IDs, use `camelCase` to match the JavaScript convention.
- For classes, use `kebab-case` to stay compatible with PurgeTSS v6.x and above. For example, use `.my-custom-class-name` instead of `.myCustomClassName`.

> **CAUTION -- PurgeTSS v5 or Earlier Projects**
> If your project started on PurgeTSS v5 or earlier and you now use 7.x.x or later, set `purge.options.missing` to `true` in `config.cjs`. It will report missing classes at the end of `app.tss` so you can update them to the new naming convention.

### Default, Platform, Device, or Conditional Blocks

- To generate a global style, use either the lowercase `default` or the uppercase `DEFAULT` keyword.
- To target a specific platform, use the `ios` or `android` keywords.
- To target a specific device, use the `tablet` or `handheld` keywords.
- To target a condition with a global variable, use the `[if=globalVariableName]` keyword.

### Property Values

- For `Titanium` constants, `Alloy Configuration Values`, or `Global Variables`, always enclose them in quotes.
- For `color` values, you can use `hex`, `8-digit hex`, `rgb(R,G,B)`, `rgba(R,G,B,A)`, `transparent`, or any of the standard color names. Use hex values if you want to avoid issues with the opacity modifier.
- For `spacing` values, you can use different types of units: `em`, `rem`, `%`, `px`, `dp`, `cm`, or `in`.
  - `%`, `px`, `cm`, or `in` are passed through without conversion.
  - `em` or `rem` values are converted with this formula: `value * 16`.
  - `dp` removes the unit and keeps the value as-is.

> **Platform-Specific Constants**
> If a rule uses `Ti.UI.iOS.*` or `Ti.UI.Android.*` constants, keep that property inside the matching `ios` or `android` block to avoid cross-platform compilation failures.

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

`./purgetss/styles/utilities.tss`
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
