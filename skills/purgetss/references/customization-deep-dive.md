# PurgeTSS Deep Customization

PurgeTSS allows for extreme customization through its configuration file, custom rules for Ti Elements, and advanced class syntaxes.

:::info What's New in v7.2.x
**Configuration File Change**: The configuration file has been renamed from `config.js` to `config.cjs` for better CommonJS compatibility. The content structure remains exactly the same.

**Legacy Mode Removed**: Legacy mode has been completely removed from PurgeTSS v7.2.x. All legacy-related options have been eliminated for a cleaner, modern codebase.
:::

## Table of Contents

- [PurgeTSS Deep Customization](#purgetss-deep-customization)
  - [Table of Contents](#table-of-contents)
  - [The `config.cjs` File](#the-configcjs-file)
    - [File Structure](#file-structure)
    - [Creating a Fresh config.cjs](#creating-a-fresh-configcjs)
  - [The `purge` Section](#the-purge-section)
    - [`mode` Property](#mode-property)
    - [`method` Property](#method-property)
    - [`options` Properties](#options-properties)
  - [The `theme` Section](#the-theme-section)
    - [Overriding vs Extending](#overriding-vs-extending)
  - [Customizing Colors](#customizing-colors)
    - [Color Object Syntax](#color-object-syntax)
    - [Overriding Default Colors](#overriding-default-colors)
    - [Extending the Palette](#extending-the-palette)
  - [Customizing Spacing](#customizing-spacing)
    - [Shared Spacing Behavior](#shared-spacing-behavior)
  - [List of Customizable Properties](#list-of-customizable-properties)
    - [Global Properties](#global-properties)
    - [Color Properties (50+ properties)](#color-properties-50-properties)
    - [Configurable Properties (80+ properties)](#configurable-properties-80-properties)
  - [Custom Rules \& Ti Elements](#custom-rules--ti-elements)
    - [Modifier Key](#modifier-key)
    - [Default, Platform, Device, or Conditional Blocks](#default-platform-device-or-conditional-blocks)
    - [Property Values](#property-values)
    - [Complete Example](#complete-example)
  - [The `@apply` Directive](#the-apply-directive)
    - [Platform-Specific Classes with `@apply`](#platform-specific-classes-with-apply)
      - [Correct Usage - With Platform Variant](#correct-usage---with-platform-variant)
      - [Wrong Usage - Omitting Platform Variant](#wrong-usage---omitting-platform-variant)
      - [Why Platform Variants Are Required](#why-platform-variants-are-required)
      - [Combining Platform Variants](#combining-platform-variants)
    - [String vs Array Syntax](#string-vs-array-syntax)
  - [Platform \& Device Modifiers in XML](#platform--device-modifiers-in-xml)
    - [Platform Modifiers](#platform-modifiers)
    - [Device Modifiers](#device-modifiers)
    - [Custom Conditional Modifiers](#custom-conditional-modifiers)
  - [Icon Font Support](#icon-font-support)
  - [Theme Extension Best Practices](#theme-extension-best-practices)
    - [1. Use `extend` for Additions](#1-use-extend-for-additions)
    - [2. Use Direct Properties for Overrides](#2-use-direct-properties-for-overrides)
    - [3. Mix Both When Needed](#3-mix-both-when-needed)
  - [Summary Checklist](#summary-checklist)
  - [Related References](#related-references)

---

## The `config.cjs` File

By default, **PurgeTSS** will look for a `./purgetss/config.cjs` file where you can define customizations.

### File Structure

The config file consists of two main sections: `purge` and `theme`.

```javascript
module.exports = {
  purge: {
    mode: 'all',
    method: 'sync',
    options: {
      missing: true,
      widgets: false,
      safelist: [],
      plugins: []
    }
  },
  theme: {
    extend: {}
  }
}
```

:::info
Every section of the config file is optional, so you only need to specify what you'd like to change. Any missing sections will fall back to the default configuration.
:::

### Creating a Fresh config.cjs

If you need to start with a fresh `config.cjs` file, delete the existing one and run:

```bash
purgetss init
```

## The `purge` Section

The `purge` section controls how **PurgeTSS** will remove unused classes or keep the ones you want.

### `mode` Property

```javascript
purge: {
  mode: 'all', // or 'class'
  method: 'sync' // or 'async'
}
```

**`mode: 'all'` (default)**
- Scans EVERYWHERE in XML files (comments, attributes, classes, IDs, Ti Elements)
- **REQUIRED** if you want PurgeTSS to parse any Ti Elements styled in `config.cjs`
- Most comprehensive but slightly slower

**`mode: 'class'`**
- Searches only in `class` and ID attributes in XML files
- Faster processing
- Cannot parse Ti Elements from `config.cjs`

:::info
**This mode is necessary if you want PurgeTSS to parse any Ti Elements that you've styled in `config.cjs`.**
:::

### `method` Property

Determines how the **auto-purge** task will be executed: `sync` (default) or `async`.

:::tip
If you don't see any changes reflected when changing and rebuilding a project with TiKit Components and LiveView, set the compile method to `async`.
:::

### `options` Properties

```javascript
purge: {
  options: {
    missing: true,      // Reports missing classes
    widgets: false,     // Purges widgets folder too
    safelist: [],       // Array of classes to keep
    plugins: []         // Array of properties to disable
  }
}
```

**`options.missing`**

Set to `true` to get a list of missing or misspelled classes at the end of `app.tss`.

:::info
This is very useful if you want to check if you forgot to add a class definition or if you forgot to remove non-existing classes from your views, especially if you have upgraded from PurgeTSS v5 to v6.
:::

**`options.widgets`**

Set to `true` to also parse all XML files found in the **Widgets** folder.

**`options.safelist`**

Array of classes and Ti Elements to keep regardless of purge mode or usage in XML files.

For large safelists, create a separate module:

```javascript
// ./purgetss/safelist.js
exports.safelist = [
  'Label', 'Button', 'Window',
  'bg-indigo-50', 'bg-indigo-100', /* ... */
  'bg-indigo-800', 'bg-indigo-900',
];

// ./purgetss/config.cjs
module.exports = {
  purge: {
    options: {
      safelist: require('./safelist')
    }
  }
}
```

:::tip
You should put the safelist inside the `purgetss` folder to keep everything organized.
:::

**`options.plugins`**

Array of properties (plugins) to completely disable:

```javascript
plugins: [
  'opacity',       // Disable all opacity classes
  'borderRadius'   // Disable all border-radius classes
]
```

## The `theme` Section

The `theme` section is where you define your project's design system - colors, spacing, typography, borders, and more.

### Overriding vs Extending

**Overriding** - Replaces default values:

```javascript
theme: {
  opacity: {
    15: '0.15',
    35: '0.35',
    65: '0.65',
    85: '0.85'
  }
}
```

This completely replaces the original default `opacity` values.

:::info
Note that any keys you do not provide will be inherited from the default theme, so in the above example, the default theme configuration for things like colors, spacing, border radius, background position, etc. will be preserved.
:::

**Extending** - Adds to default values:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#002359',
    }
  }
}
```

This adds `primary` in addition to all default colors.

You can both override and extend in the same config:

```javascript
theme: {
  opacity: { /* ... */ },           // Override
  extend: {
    colors: { /* ... */ }          // Extend
  }
}
```

## Customizing Colors

### Color Object Syntax

Colors can be defined as simple key-value pairs or nested objects:

```javascript
theme: {
  colors: {
    // Simple values
    transparent: 'transparent',
    white: '#ffffff',
    purple: '#3f3cbb',

    // Nested objects (modifiers)
    primary: {
      solid: '#002359',
      dark: '#000030',
      transparent: '#D9002359'
    },

    // Shade scales
    brand: {
      50: '#edfaff',
      100: '#d6f2ff',
      200: '#b5eaff',
      300: '#83dfff',
      400: '#48cbff',
      500: '#1eacff',
      600: '#068eff',
      700: '#007aff',
      800: '#085dc5',
      900: '#0d519b',
      950: '#0e315d',
      default: '#007aff'
    }
  }
}
```

Nested keys are combined with parent to form classes like `bg-primary-solid` or `text-brand-600`.

### Overriding Default Colors

To override a default color while preserving others:

```javascript
theme: {
  extend: {
    colors: {
      gray: {
        50: '#f7f7f7',
        100: '#ededed',
        200: '#dfdfdf',
        300: '#c8c8c8',
        400: '#adadad',
        500: '#9e9e9e',
        600: '#888888',
        700: '#7b7b7b',
        800: '#676767',
        900: '#545454'
      }
    }
  }
}
```

### Extending the Palette

Add new colors without modifying defaults:

```javascript
theme: {
  extend: {
    colors: {
      'regal-blue': '#243c5a',
    }
  }
}
```

:::info
You can use the `shades` command to generate a range of shades for a given color, automatically adding them to your `config.cjs` file.
:::

## Customizing Spacing

The `spacing` section is shared by `padding`, `margin`, `width`, `height`, and `gap` properties.

```javascript
theme: {
  spacing: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  }
}
```

### Shared Spacing Behavior

:::info
When you include the `spacing` section, PurgeTSS will automatically generate all spacing-related properties and merge them with any other spacing-related properties present in the configuration file.
:::

For example:

```javascript
theme: {
  spacing: {
    tight: '0.25rem',
    loose: '1.0rem'
  },
  width: {
    banner: '5rem'
  },
  height: {
    xl: '3rem',
    '1/3': '33.333333%'
  }
}
```

This generates:
- `m-tight`, `m-loose`, `p-tight`, `p-loose`, etc.
- `w-banner`
- `h-xl`, `h-1/3`

## List of Customizable Properties

### Global Properties

All color properties inherit from `theme.colors`. All spacing properties inherit from `theme.spacing`.

### Color Properties (50+ properties)

All of these support your custom colors:
- `activeTintColor`, `activeTitleColor`, `backgroundColor`, `backgroundDisabledColor`, `backgroundFocusedColor`, `backgroundSelectedColor`, `backgroundSelectedGradient`, `badgeColor`, `barColor`, `borderColor`, `color`, `colors`, `contentScrimColor`, `currentPageIndicatorColor`, `dateTimeColor`, `disabledColor`, `highlightedColor`, `hintTextColor`, `iconColor`, `imageTouchFeedbackColor`, `indicatorColor`, `keyboardToolbarColor`, `lightColor`, `navigationIconColor`, `navTintColor`, `onTintColor`, `pageIndicatorColor`, `pagingControlColor`, `pullBackgroundColor`, `resultsBackgroundColor`, `resultsSeparatorColor`, `selectedBackgroundColor`, `selectedButtonColor`, `selectedColor`, `selectedSubtitleColor`, `selectedTextColor`, `separatorColor`, `shadowColor`, `statusBarBackgroundColor`, `subtitleColor`, `subtitleTextColor`, `tabsBackgroundColor`, `tabsBackgroundSelectedColor`, `thumbTintColor`, `tint`, `tintColor`, `titleAttributes`, `titleColor`, `titleTextColor`, `touchFeedbackColor`, `trackTintColor`, `viewShadowColor`

### Configurable Properties (80+ properties)

- `activeTab`, `backgroundLeftCap`, `backgroundPaddingBottom`, `backgroundPaddingLeft`, `backgroundPaddingRight`, `backgroundPaddingTop`, `backgroundTopCap`, `borderRadius`, `borderWidth`, `bottom`, `cacheSize`, `columnCount`, `contentHeight`, `contentWidth`, `countDownDuration`, `delay`, `duration`, `elevation`, `fontFamily`, `fontSize`, `horizontalMargin`, `indentionLevel`, `keyboardToolbarHeight`, `left`, `leftButtonPadding`, `leftTrackLeftCap`, `leftTrackTopCap`, `leftWidth`, `lineHeightMultiple`, `lines`, `lineSpacing`, `maxElevation`, `maximumLineHeight`, `maxLines`, `maxRowHeight`, `maxZoomScale`, `minimumFontSize`, `minimumLineHeight`, `minRowHeight`, `minZoomScale`, `opacity`, `padding`, `paddingBottom`, `paddingLeft`, `paddingRight`, `paddingTop`, `pageHeight`, `pageWidth`, `pagingControlAlpha`, `pagingControlHeight`, `pagingControlTimeout`, `paragraphSpacingAfter`, `paragraphSpacingBefore`, `repeat`, `repeatCount`, `right`, `rightButtonPadding`, `rightTrackLeftCap`, `rightTrackTopCap`, `rightWidth`, `rotate`, `rowCount`, `rowHeight`, `scale`, `scalesPageToFit`, `scaleX`, `scaleY`, `sectionHeaderTopPadding`, `separatorHeight`, `shadowRadius`, `shiftMode`, `timeout`, `top`, `uprightHeight`, `uprightWidth`, `verticalMargin`, `width`, `xOffset`, `yOffset`, `zIndex`, `zoomScale`

## Custom Rules & Ti Elements

Style any **Ti Element**, **ID**, or **class** with platform/device specificity.

### Modifier Key

- **Ti Elements**: Use exact name: `Label`, `Button`, `ScrollView`
- **IDs**: Use `camelCase`: `#mainBanner`, `sidebarWidget`
- **Classes**: Use `kebab-case`: `.my-custom-class`, `.feature-card` (required for PurgeTSS v6.x+)

:::caution PurgeTSS v5 or earlier projects
For projects created with PurgeTSS v5 or earlier that are now using version 7.x.x or above, please set `purge.options.missing` to true in `config.cjs` to get a report (at the end of `app.tss`) of any missing classes so you can update them to the new naming convention.
:::

### Default, Platform, Device, or Conditional Blocks

- **`DEFAULT` or `default`**: Global style
- **`ios`** or **`android`**: Platform-specific
- **`tablet`** or **`handheld`**: Device-specific
- **`[if=globalVariableName]`**: Conditional with global variable

### Property Values

- **Titanium constants**: Enclose in quotes: `'Ti.UI.SIZE'`, `'Ti.UI.FILL'`
- **Alloy Configuration Values**: Enclose in quotes: `'Alloy.CFG.someValue'`
- **Global Variables**: Enclose in quotes: `'Alloy.Globals.someValue'`
- **Colors**: Use `hex`, `8-digit hex`, `rgb(R,G,B)`, `rgba(R,G,B,A)`, `transparent`, or color names
- **Spacing values**: Use `em`, `rem`, `%`, `px`, `dp`, `cm`, `in`

**Unit conversions:**
- `%`, `px`, `cm`, `in` - Passed without conversion
- `em` or `rem` - Converted: `value * 16`
- `dp` - Unit removed, value remains intact

### Complete Example

```javascript
module.exports = {
  theme: {
    // Custom ID with platform variants
    '#main-banner': {
      DEFAULT: {
        width: '300px',
        height: '80px'
      },
      ios: {
        clipMode: 'Ti.UI.iOS.CLIP_MODE_DISABLED'
      }
    },

    // Custom class with device variants
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

    // Ti Element styling
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

## The `@apply` Directive

Extract repetitive patterns into reusable classes.

```javascript
'.btn-primary': {
  apply: 'bg-blue-600 text-white rounded-lg px-4 py-2 font-bold'
}

'.card-shadow': {
  apply: 'shadow-md'
}
```

:::tip
The `apply` directive is perfect for creating component-specific utility classes that combine multiple PurgeTSS utilities into a single, semantic class name.
:::

### Platform-Specific Classes with `@apply`

Several classes in `tailwind.tss` are platform-specific to prevent polluting objects with properties that are not specific to a particular platform.

:::caution IMPORTANT!
To properly apply these platform styles when creating custom rules, you must specify the platform variant in the `apply` directive.

**Even if you are not targeting a specific platform, you must specify the platform variant.**
:::

#### Correct Usage - With Platform Variant

```javascript
module.exports = {
  theme: {
    '.my-view': {
      // Targeting iOS with platform variant
      'ios': {
        'apply': 'bg-green-500 wh-32 ios:clip-enabled'
      }
    }
  },
}
```

**Generated output:**
```tss
/* Custom Classes */
'.my-view[platform=ios]': { backgroundColor: '#22c55e', clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED, width: 128, height: 128 }
```

#### Wrong Usage - Omitting Platform Variant

```javascript
module.exports = {
  theme: {
    // Missing platform variant in clip-enabled
    '.my-view': {
      'apply': 'wh-32 clip-enabled bg-green-500'
    }
  },
}
```

**Generated output (MISSING the clipMode property):**
```tss
/* Omitting the platform variant in config.cjs will not generate the corresponding property. */
/* Missing the property related to `clip-enabled`. */
'.my-view': { backgroundColor: '#22c55e', width: 128, height: 128 }
```

#### Why Platform Variants Are Required

Certain Titanium properties are platform-specific and will only work when properly scoped:

| Property        | Platform             | Class                                   |
| --------------- | -------------------- | --------------------------------------- |
| `clipMode`      | iOS only             | `ios:clip-enabled`, `ios:clip-disabled` |
| `touchFeedback` | Android only         | `android:touch-feedback`                |
| `hires`         | iOS only (ImageView) | `ios:hires`                             |

When using `@apply` with these properties, you MUST specify the platform variant in the `apply` string so PurgeTSS knows which platform's property to include.

#### Combining Platform Variants

```javascript
module.exports = {
  theme: {
    '.responsive-card': {
      DEFAULT: {
        apply: 'bg-white rounded-lg p-4'
      },
      ios: {
        apply: 'shadow-md ios:clip-enabled'
      },
      android: {
        apply: 'android:touch-feedback'
      },
      handheld: {
        apply: 'w-full'
      },
      tablet: {
        apply: 'w-3/4'
      }
    }
  }
}
```

**Generated output:**
```tss
/* Platform and device specific styles */
'.responsive-card': { backgroundColor: '#ffffff', borderRadius: 8, top: 16, right: 16, bottom: 16, left: 16 }
'.responsive-card[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED }
'.responsive-card[platform=android]': { touchFeedback: true }
'.responsive-card[formFactor=handheld]': { width: '100%' }
'.responsive-card[formFactor=tablet]': { width: '75%' }
```

### String vs Array Syntax

You can use either a string or an array for the `apply` directive:

```javascript
// String syntax
'.btn': {
  apply: 'font-bold border-2 rounded wh-auto my-0.5'
}

// Array syntax (easier to read for long lists)
'.btn-corporate': {
  apply: [
    'bg-corporate-500',
    'text-corporate-100',
    'border-corporate-200'
  ]
}
```

## Platform & Device Modifiers in XML

Conditional styling directly in the `class` attribute using colon notation.

### Platform Modifiers

```xml
<!-- iOS-specific styling -->
<Label class="ios:text-blue-600 android:text-gray-600" />

<!-- Multiple platforms -->
<View class="ios:bg-blue-100 android:bg-gray-100" />
```

### Device Modifiers

```xml
<!-- Tablet vs handheld -->
<View class="tablet:w-3/4 handheld:w-full" />
```

### Custom Conditional Modifiers

```xml
<!-- Using global variables -->
<View class="[if=Alloy.Globals.isIPhoneX]:pb-24" />
```

## Icon Font Support

PurgeTSS automatically maps icon classes to both `text` and `title` properties, making them work on both Labels and Buttons.

```tss
/* Auto-generated for FontAwesome */
'.fa-home': { text: '\uf015', title: '\uf015' }
'.fas': { font: { fontFamily: 'FontAwesome7Free-Solid' } }
```

This allows:
```xml
<!-- Works on Labels -->
<Label class="fas fa-home" />

<!-- Works on Buttons too! -->
<Button class="fas fa-home" />
```

## Theme Extension Best Practices

### 1. Use `extend` for Additions

```javascript
theme: {
  extend: {
    colors: {
      brand: '#007AFF',  // Adds to existing colors
    }
  }
}
```

### 2. Use Direct Properties for Overrides

```javascript
theme: {
  colors: {
    // Completely replaces default grays
    gray: {
      50: '#f7f7f7',
      // ... etc
    }
  }
}
```

### 3. Mix Both When Needed

```javascript
theme: {
  // Override some
  opacity: { /* custom values */ },

  // Extend others
  extend: {
    colors: { /* additional colors */ }
  }
}
```

## Summary Checklist

- [ ] Set `mode: 'all'` if styling Ti Elements in `config.cjs`
- [ ] Use `method: 'async'` for LiveView compatibility issues
- [ ] Enable `missing: true` during development to catch typos
- [ ] Use `kebab-case` for custom class names (v6.x+ requirement)
- [ ] Use `camelCase` for IDs
- [ ] Use exact names for Ti Elements
- [ ] Prefer `extend` over overriding for colors/spacing
- [ ] Use `@apply` for component-specific utility combinations

## Related References

- [Opacity Modifier](opacity-modifier.md) - Add transparency to ANY color with `/50` syntax
- [Configurable Properties](configurable-properties.md) - Complete list of 80+ customizable properties
- [Custom Rules](custom-rules.md) - Styling Ti Elements, IDs, and classes
- [Apply Directive](apply-directive.md) - Extracting utility combinations into reusable classes
- [Platform Modifiers](platform-modifiers.md) - ios:, android:, tablet:, handheld: prefixes
