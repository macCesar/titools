# Custom Rules for Ti Elements, IDs, and Classes

Custom rules in PurgeTSS allow you to style **Titanium elements**, **IDs**, and **classes** with flexibility and precision. Configure these rules in the `config.cjs` file with optional platform, device, or conditional targeting.

:::info
This feature is particularly useful for meeting visual and design requirements across multiple platforms (iOS and Android).
:::

## Naming Conventions

| Target Type | Naming Convention | Example |
|-------------|-------------------|---------|
| **Ti Elements** | Exact element name | `Label`, `Button`, `ScrollView` |
| **IDs** | camelCase | `#mainBanner`, `#sidebarWidget` |
| **Classes** | kebab-case | `.my-custom-class`, `.feature-card` |

:::caution PurgeTSS v5 or earlier
For projects upgraded from PurgeTSS v5 or earlier, set `purge.options.missing` to `true` in `config.cjs` to get a report of any missing classes at the end of `app.tss`.
:::

## Modifier Keys

### Platform, Device, and Conditional Blocks

| Modifier | Description |
|----------|-------------|
| `DEFAULT` / `default` | Global style |
| `ios` | iOS-specific |
| `android` | Android-specific |
| `tablet` | Tablet devices |
| `handheld` | Handheld devices |
| `[if=globalVariableName]` | Conditional block with global variable |

## Property Values

- **Titanium constants, Alloy config, Global Variables**: Always enclose in quotes
- **Colors**: hex, 8-digit hex, `rgb(R,G,B)`, `rgba(R,G,B,A)`, `transparent`, or color names
- **Spacing**: `em`, `rem`, `%`, `px`, `dp`, `cm`, or `in`
  - `%`, `px`, `cm`, `in` - Passed without conversion
  - `em` / `rem` - Converted: `value * 16`
  - `dp` - Unit removed, value intact

## Config Example

```javascript
// purgetss/config.cjs
module.exports = {
  theme: {
    // ID with platform-specific styles
    '#main-banner': {
      DEFAULT: {
        width: '300px',
        height: '80px'
      },
      ios: {
        clipMode: 'Ti.UI.iOS.CLIP_MODE_DISABLED'
      }
    },

    // Class with device targeting
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

    // Ti Element with conditional block
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
}
```

## Generated TSS Output

```css
/* Ti Element */
'TextField': { top: 10, left: 20, right: 20, bottom: 0 }
'TextField[if=Alloy.Globals.iPhoneX]': { bottom: Alloy.CFG.iPhoneXNotchSize }
'TextField[platform=android]': { touchFeedback: true }

/* Custom IDs */
'#main-banner': { width: '300px', height: '80px' }
'#main-banner[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }

/* Custom Classes */
'.gallery': { height: Ti.UI.SIZE }
'.gallery[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED }
'.gallery[platform=android]': { hiddenBehavior: Ti.UI.HIDDEN_BEHAVIOR_GONE }
'.gallery[formFactor=handheld]': { width: '250px' }
'.gallery[formFactor=tablet]': { width: '500px' }
```

## Complete Styling Example

```javascript
// config.cjs - Styling a custom card component
module.exports = {
  theme: {
    '.card': {
      DEFAULT: {
        apply: 'bg-white rounded-lg shadow-md p-4 m-2'
      },
      ios: {
        apply: 'ios:shadow-offset-0'
      }
    },
    '.card-title': {
      DEFAULT: {
        apply: 'text-lg font-bold text-gray-900 mb-2'
      }
    },
    '.card-button': {
      DEFAULT: {
        apply: 'bg-blue-500 text-white px-4 py-2 rounded mt-4'
      },
      android: {
        apply: 'android:ripple-enabled'
      }
    }
  }
}
```
