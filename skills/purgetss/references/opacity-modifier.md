# Opacity Modifier

The opacity modifier allows you to add transparency to **ANY color property** by appending an opacity value between 0 and 100, separated by a slash (`/`).

:::info
You can add an **opacity modifier to ANY of the available color properties** by adding an **opacity value** between 0 and 100 to the end of the color name separated by a slash ( / ).
:::

## Table of Contents

- [Opacity Modifier](#opacity-modifier)
  - [Table of Contents](#table-of-contents)
  - [Basic Syntax](#basic-syntax)
  - [How It Works](#how-it-works)
  - [Usage in XML](#usage-in-xml)
    - [Background Colors](#background-colors)
    - [Text Colors](#text-colors)
    - [Border Colors](#border-colors)
    - [All Color Properties](#all-color-properties)
  - [Usage with `@apply` Directive](#usage-with-apply-directive)
  - [Complete List of Supported Color Properties](#complete-list-of-supported-color-properties)
    - [Background Properties](#background-properties)
    - [Text Properties](#text-properties)
    - [Border Properties](#border-properties)
    - [UI Element Properties](#ui-element-properties)
    - [Navigation Properties](#navigation-properties)
    - [Indicator Properties](#indicator-properties)
    - [Tint Properties](#tint-properties)
    - [Miscellaneous Properties](#miscellaneous-properties)
  - [Opacity Value Reference](#opacity-value-reference)
  - [Common Patterns](#common-patterns)
    - [Hover/Active States](#hoveractive-states)
    - [Disabled Appearance](#disabled-appearance)
    - [Overlay/Backdrop](#overlaybackdrop)
    - [Glassmorphism Effect](#glassmorphism-effect)
    - [Gradient Fades](#gradient-fades)
  - [Limitations](#limitations)
  - [Performance Considerations](#performance-considerations)
  - [Combining with Arbitrary Colors](#combining-with-arbitrary-colors)

---

## Basic Syntax

```xml
<Label class="bg-blue-500/50 text-purple-900/75" />
```

The opacity value (0-100) is converted to a decimal (0.0-1.0) and applied as an 8-digit hex color with alpha channel.

## How It Works

Given `bg-blue-500/50`:
- `blue-500` = `#3b82f6` (RGB: 59, 130, 246)
- Opacity 50% = `0x80` (hex) = `128` (decimal)
- Result: `#803b82f6` (80% of the way to transparent)

## Usage in XML

### Background Colors

```xml
<!-- Semi-transparent backgrounds -->
<View class="bg-red-500/25" />  <!-- 25% opacity -->
<View class="bg-green-500/50" /> <!-- 50% opacity -->
<View class="bg-blue-500/75" />  <!-- 75% opacity -->
```

### Text Colors

```xml
<Label class="text-gray-900/50" text="Faded text" />
<Label class="text-brand-600/80" text="Mostly opaque" />
```

### Border Colors

```xml
<View class="border-2 border-purple-500/30" />
```

### All Color Properties

```xml
<Window class="bg-indigo-500/20">
  <View class="border-(#ff0000)/50 shadow-(#000)/30">
    <Label class="text-white/90 placeholder-gray-400/50" />
  </View>
</Window>
```

## Usage with `@apply` Directive

You can also use color opacity modifiers in the `apply` directive in `config.cjs`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#ce10cc'
      }
    },
    '.main-banner': {
      apply: [
        'bg-primary/35',
        'border-primary/75'
      ]
    }
  }
}
```

**Generated classes:**
```tss
/* Custom Styles */
'.main-banner': { backgroundColor: '#59ce10cc', borderColor: '#bfce10cc' }

/* Color Properties */
'.bg-primary': { backgroundColor: '#ce10cc' }
'.bg-primary/35': { backgroundColor: '#59ce10cc' }
'.border-primary': { borderColor: '#ce10cc' }
'.border-primary/75': { borderColor: '#bfce10cc' }
```

## Complete List of Supported Color Properties

The opacity modifier works with **ALL** color properties:

### Background Properties
- `bg-*` - backgroundColor
- `bg-focused-*` - backgroundFocusedColor
- `bg-selected-*` - backgroundSelectedColor
- `from-*` - backgroundGradient (start)
- `to-*` - backgroundGradient (end)

### Text Properties
- `text-*` - color / textColor
- `title-*` - titleColor / titleTextColor
- `subtitle-*` - subtitleColor / subtitleTextColor
- `placeholder-*` - hintTextColor

### Border Properties
- `border-*` - borderColor
- `separator-*` - separatorColor
- `bar-*` - barColor

### UI Element Properties
- `badge-*` - badgeColor
- `disabled-*` - disabledColor
- `highlighted-*` - highlightedColor
- `selected-*` - selectedColor
- `selected-button-*` - selectedButtonColor
- `selected-subtitle-*` - selectedSubtitleColor
- `selected-text-*` - selectedTextColor

### Navigation Properties
- `nav-tint-*` - navTintColor
- `active-tint-*` - activeTintColor
- `on-tint-*` - onTintColor
- `thumb-tint-*` - thumbTintColor
- `track-tint-*` - trackTintColor

### Indicator Properties
- `indicator-*` - indicatorColor
- `current-page-indicator-*` - currentPageIndicatorColor
- `page-indicator-*` - pageIndicatorColor
- `paging-control-*` - pagingControlColor

### Tint Properties
- `tint-*` - tintColor
- `shadow-*` - shadowColor / viewShadowColor
- `drop-shadow-*` - dropShadow color

### Miscellaneous Properties
- `active-title-*` - activeTitleColor
- `date-time-*` - dateTimeColor
- `image-touch-feedback-*` - imageTouchFeedbackColor
- `keyboard-toolbar-*` - keyboardToolbarColor
- `light-*` - lightColor
- `navigation-icon-*` - navigationIconColor
- `pull-bg-*` - pullBackgroundColor
- `results-bg-*` - resultsBackgroundColor
- `results-separator-*` - resultsSeparatorColor
- `tabs-bg-*` - tabsBackgroundColor
- `tabs-bg-selected-*` - tabsBackgroundSelectedColor
- `title-attributes-*` - titleAttributes color
- `title-attributes-shadow-*` - titleAttributes shadow color
- `touch-feedback-*` - touchFeedbackColor

## Opacity Value Reference

| Opacity Value | Decimal | Hex Alpha | Result            |
| ------------- | ------- | --------- | ----------------- |
| `/0`          | 0.00    | `00`      | Fully transparent |
| `/10`         | 0.10    | `1A`      | 10% visible       |
| `/20`         | 0.20    | `33`      | 20% visible       |
| `/25`         | 0.25    | `40`      | 25% visible       |
| `/30`         | 0.30    | `4D`      | 30% visible       |
| `/40`         | 0.40    | `66`      | 40% visible       |
| `/50`         | 0.50    | `80`      | 50% visible       |
| `/60`         | 0.60    | `99`      | 60% visible       |
| `/70`         | 0.70    | `B3`      | 70% visible       |
| `/75`         | 0.75    | `BF`      | 75% visible       |
| `/80`         | 0.80    | `CC`      | 80% visible       |
| `/90`         | 0.90    | `E6`      | 90% visible       |
| `/95`         | 0.95    | `F2`      | 95% visible       |
| `/100`        | 1.00    | `FF`      | Fully opaque      |

## Common Patterns

### Hover/Active States

```xml
<Button class="bg-brand-500 active:bg-brand-600/80" />
```

### Disabled Appearance

```xml
<Label class="text-gray-800 disabled:text-gray-400/50" />
```

### Overlay/Backdrop

```xml
<!-- Semi-transparent overlay -->
<View class="absolute inset-0 bg-black/50" />
```

### Glassmorphism Effect

```xml
<View class="border-white/30 bg-white/20 backdrop-blur-md" />
```

### Gradient Fades

```xml
<View class="from-brand-500/100 to-brand-500/0" />
```

## Limitations

:::caution Semantic Colors Cannot Use Opacity Modifier

Semantic colors (defined as objects with light/dark values) cannot be modified with the opacity modifier because they are defined as an object with light and dark values, not as a single color value.

**This won't work:**
```javascript
// In config.cjs
colors: {
  semantic: {
    light: '#ffffff',
    dark: '#000000'
  }
}
```

```xml
<!-- This will NOT work -->
<View class="bg-semantic/50" />
```

**Solution:** Use standard color scales instead:
```javascript
colors: {
  semantic: '#888888'
}
```

```xml
<!-- This WILL work -->
<View class="bg-semantic/50" />
```
:::

## Performance Considerations

Using opacity modifiers is as performant as regular color classes since the conversion happens at build time, not runtime. The generated `app.tss` contains the final hex values with alpha channels.

## Combining with Arbitrary Colors

You can combine opacity modifiers with arbitrary color values:

```xml
<View class="bg-(#4C61E4)/50" />
<Label class="text-(rgba(255,0,0,0.5))" />
```

Note: When using `rgba()` directly, the opacity modifier is redundant since `rgba()` already includes alpha.
