# Configurable Properties Reference

Complete list of all properties that can be customized in `config.cjs` under the `theme` section.

## Color Properties (50+ properties)

All color properties inherit values from `theme.colors` and support the full Tailwind color palette plus any custom colors you define.

### Background Colors
- `backgroundColor` - Main background color
- `backgroundDisabledColor` - Background when disabled
- `backgroundFocusedColor` - Background when focused
- `backgroundSelectedColor` - Background when selected
- `backgroundGradient` - Gradient backgrounds (uses `from-*` and `to-*` classes)

**Class examples:** `bg-white`, `bg-red-500`, `bg-brand-600`

### Text Colors
- `color` / `textColor` - Main text color
- `titleColor` / `titleTextColor` - Title text color
- `subtitleColor` / `subtitleTextColor` - Subtitle text color
- `hintTextColor` - Placeholder/hint text color

**Class examples:** `text-gray-900`, `text-white`, `text-brand-500`

### UI Element Colors
- `selectedColor` - Color when selected
- `selectedTextColor` - Text color when selected
- `selectedBackgroundColor` - Background when selected
- `selectedButtonColor` - Button color when selected
- `selectedSubtitleColor` - Subtitle color when selected
- `disabledColor` - Color for disabled state
- `highlightedColor` - Color when highlighted

### Border & Separator Colors
- `borderColor` - Border color
- `separatorColor` - Separator line color
- `barColor` - Toolbar/tab bar color

### Navigation & Button Colors
- `tintColor` / `tint` - Main tint color
- `navTintColor` - Navigation bar tint
- `activeTintColor` - Tint when active
- `onTintColor` - Tint for "on" state
- `thumbTintColor` - Slider thumb tint
- `trackTintColor` - Slider track tint

### Indicator Colors
- `indicatorColor` - General indicator color
- `pageIndicatorColor` - Page scroll indicator
- `currentPageIndicatorColor` - Current page indicator
- `pagingControlColor` - Paging control color

### Badge & Notification Colors
- `badgeColor` - Badge background/text color

### Miscellaneous Colors
- `shadowColor` / `viewShadowColor` - Drop shadow color
- `iconColor` - Icon color
- `imageTouchFeedbackColor` - Image touch feedback color
- `keyboardToolbarColor` - Keyboard toolbar color
- `pullBackgroundColor` - Pull-to-refresh background
- `tabsBackgroundColor` - Tab bar background
- `tabsBackgroundSelectedColor` - Selected tab background
- `touchFeedbackColor` - Touch feedback ripple color
- `statusBarBackgroundColor` - Status bar color
- `lightColor` - Light theme color
- `activeTitleColor` - Active title color
- `dateTimeColor` - Date/time picker color
- `resultsBackgroundColor` - Search results background
- `resultsSeparatorColor` - Search results separator

## Spacing & Size Properties

All spacing properties inherit from `theme.spacing` and support the default spacing scale plus custom values.

### Dimensions
- `width` / `w` - Element width
- `height` / `h` - Element height

**Class examples:** `w-64`, `h-screen`, `w-1/2`

### Margin
- `horizontalMargin` - Horizontal margins
- `verticalMargin` - Vertical margins

### Padding
- `padding` / `p` - All sides padding
- `paddingTop` / `pt` - Top padding
- `paddingRight` / `pr` - Right padding
- `paddingBottom` / `pb` - Bottom padding
- `paddingLeft` / `pl` - Left padding

**Class examples:** `p-4`, `px-8`, `py-2`, `pt-4`, `pr-8`, `pb-4`, `pl-8`

### Background Padding
- `backgroundPaddingTop` - Background top padding
- `backgroundPaddingBottom` - Background bottom padding
- `backgroundPaddingLeft` - Background left padding
- `backgroundPaddingRight` - Background right padding

### Content Size
- `contentWidth` - Content width
- `contentHeight` - Content height

### Gaps
- `gap` - Gap between grid/flex items (all sides)
- `gap-x` - Horizontal gap
- `gap-y` - Vertical gap

## Border Properties

- `borderWidth` - Border thickness
- `borderRadius` - Rounded corners

**Class examples:** `border-2`, `rounded-lg`, `rounded-full`

### Background Caps
- `backgroundTopCap` - Background top cap size
- `backgroundLeftCap` - Background left cap size

## Positioning Properties

- `top` - Top position
- `right` / `r` - Right position
- `bottom` - Bottom position
- `left` / `l` - Left position
- `xOffset` - X axis offset
- `yOffset` - Y axis offset

**Class examples:** `top-4`, `right-8`, `bottom-0`, `left-auto`, `right-0`

## Typography Properties

- `fontFamily` - Font family
- `fontSize` / `textSize` - Font size
- `font` - Font weight/style
- `lineHeightMultiple` - Line height multiplier
- `lines` - Maximum lines
- `maxLines` - Maximum lines (alias)
- `minimumFontSize` - Minimum font size for auto-shrink

**Class examples:** `font-sans`, `text-xl`, `font-bold`, `leading-relaxed`

## Layout Properties

- `columnCount` - Multi-column layout count
- `rowCount` - Row layout count
- `rowHeight` - Height of each row
- `maxRowHeight` - Maximum row height
- `minRowHeight` - Minimum row height

## Opacity & Visibility

- `opacity` - Element opacity (0-1)

**Class examples:** `opacity-50`, `opacity-100`

## Transformation Properties

- `rotate` - Rotation angle (degrees)
- `scale` - Scale factor
- `scaleX` - X axis scale
- `scaleY` - Y axis scale
- `origin` - Transform origin point

**Class examples:** `rotate-45`, `scale-110`, `origin-center`

## Animation Properties

- `duration` - Animation duration (milliseconds)
- `delay` - Animation delay (milliseconds)
- `repeat` / `repeatCount` - Repeat count
- `timeout` - Timeout duration
- `countDownDuration` - Countdown timer duration

**Class examples:** `duration-300`, `delay-150`, `repeat-3`

## Z-Index & Layering

- `zIndex` / `z` - Stack order

**Class examples:** `z-10`, `z-50`, `z-auto`

## Shadow Properties

- `shadowRadius` - Shadow blur radius
- `elevation` - Android elevation (shadow)

## Section Properties

- `sectionHeaderTopPadding` - Section header padding

## Separator Properties

- `separatorHeight` - Separator line height

## Paging Properties

- `pagingControlHeight` - Paging control height
- `pagingControlAlpha` - Paging control opacity
- `pagingControlTimeout` - Paging auto-scroll timeout

## Zoom Properties

- `zoomScale` - Current zoom level
- `minZoomScale` - Minimum zoom
- `maxZoomScale` - Maximum zoom
- `scalesPageToFit` - Auto-scale to fit

## Button Properties

- `leftButtonPadding` - Left button padding
- `rightButtonPadding` - Right button padding

## Left/Right Width

- `leftWidth` / `lw` - Left width
- `rightWidth` / `rw` - Right width

## Cache Properties

- `cacheSize` - Cache size limit

## Other Properties

- `activeTab` - Active tab index
- `indentionLevel` - Indentation level
- `keyboardToolbarHeight` - Keyboard toolbar height
- `shiftMode` - Shift mode for text fields

## Quick Reference Table

| Category | Property | Class Prefix Example |
|----------|----------|---------------------|
| **Background** | backgroundColor | `bg-*` |
| | backgroundGradient | `from-*`, `to-*` |
| **Text** | color/textColor | `text-*` |
| | hintTextColor | `placeholder-*` |
| **Border** | borderColor | `border-*` |
| | borderWidth | `border-*` |
| | borderRadius | `rounded-*` |
| **Spacing** | margin | `m-*`, `mt-*`, `mb-*`, `ml-*`, `mr-*` |
| | padding | `p-*`, `pt-*`, `pb-*`, `pl-*`, `pr-*` |
| **Dimensions** | width | `w-*` |
| | height | `h-*` |
| **Position** | top/right/bottom/left | `top-*`, `right-*`, `bottom-*`, `left-*` |
| **Typography** | fontFamily | `font-*` |
| | fontSize | `text-*`, `text-size-*` |
| **Transform** | rotate | `rotate-*` |
| | scale | `scale-*` |
| **Animation** | duration | `duration-*` |
| | delay | `delay-*` |
| **Z-Index** | zIndex | `z-*` |

## Customizing in config.cjs

### Override Default Values

```javascript
theme: {
  spacing: {
    sm: 8,
    md: 12,
    lg: 16,
  }
}
```

### Extend Default Values

```javascript
theme: {
  extend: {
    colors: {
      brand: '#007AFF',
    },
    spacing: {
      '72': '18rem',
      '84': '21rem',
    }
  }
}
```

### Mix Override and Extend

```javascript
theme: {
  // Override default opacity
  opacity: {
    15: '0.15',
    35: '0.35',
  },
  // Extend colors
  extend: {
    colors: {
      brand: '#007AFF',
    }
  }
}
```

## Practical Examples

### Complete Brand Color System

```javascript
// config.cjs
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edfaff',
          100: '#d6f2ff',
          200: '#b5eaff',
          300: '#83dfff',
          400: '#48cbff',
          500: '#1eacff',
          600: '#068eff',
          700: '#007aff',  // Primary
          800: '#085dc5',
          900: '#0d519b',
          950: '#0e315d',
          DEFAULT: '#007aff'  // Allows 'bg-brand' without shade
        },
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      }
    }
  }
}
```

**Usage:**
```xml
<Button class="bg-brand text-white" />
<Button class="bg-brand-700 text-brand-100" />
<Label class="text-success" text="Saved!" />
<Label class="text-error" text="Error occurred" />
```

### Custom Spacing Scale

```javascript
// config.cjs
module.exports = {
  theme: {
    spacing: {
      // Mobile-first spacing
      'xs': 4,
      'sm': 8,
      'md': 16,
      'lg': 24,
      'xl': 32,
      '2xl': 48,
      '3xl': 64,
      // Screen percentages
      'screen-10': '10%',
      'screen-25': '25%',
      'screen-50': '50%'
    }
  }
}
```

**Generated classes:**
```tss
/* Width */
'.w-xs': { width: 4 }
'.w-sm': { width: 8 }
'.w-screen-50': { width: '50%' }

/* Margin */
'.m-md': { top: 16, right: 16, bottom: 16, left: 16 }
'.mt-lg': { top: 24 }

/* Padding */
'.p-xl': { padding: { top: 32, right: 32, bottom: 32, left: 32 } }
```

### Custom Font Family System

```javascript
// config.cjs
module.exports = {
  theme: {
    fontFamily: {
      'sans': 'Roboto-Regular',
      'sans-medium': 'Roboto-Medium',
      'sans-bold': 'Roboto-Bold',
      'serif': 'Merriweather-Regular',
      'mono': 'FiraCode-Regular',
      'display': 'Montserrat-Bold'
    }
  }
}
```

**Usage:**
```xml
<Label class="font-sans text-lg" />
<Label class="font-display text-3xl" />
<Label class="font-mono text-sm" />
```

### Custom Border Radius Scale

```javascript
// config.cjs
module.exports = {
  theme: {
    borderRadius: {
      'none': 0,
      'sm': 4,
      'DEFAULT': 8,
      'md': 12,
      'lg': 16,
      'xl': 24,
      '2xl': 32,
      'card': 20,
      'button': 12,
      'input': 8
    }
  }
}
```

**Usage:**
```xml
<View class="rounded-card bg-white" />
<Button class="rounded-button bg-brand" />
<TextField class="rounded-input border-gray-300" />
```

### Complete Card Component via Ti Element

```javascript
// config.cjs
module.exports = {
  purge: { mode: 'all' },  // Required for Ti Elements
  theme: {
    // Style all Views with specific patterns
    View: {
      DEFAULT: {
        width: 'Ti.UI.SIZE',
        height: 'Ti.UI.SIZE'
      }
    },
    // Custom card class
    '.card': {
      DEFAULT: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb'
      },
      ios: {
        clipMode: 'Ti.UI.iOS.CLIP_MODE_ENABLED'
      },
      android: {
        elevation: 4
      }
    },
    '.card-header': {
      apply: 'p-4 border-b border-gray-200'
    },
    '.card-body': {
      apply: 'p-4'
    },
    '.card-footer': {
      apply: 'p-4 border-t border-gray-100 bg-gray-50'
    }
  }
}
```

**Usage:**
```xml
<View class="card m-4">
  <View class="card-header vertical">
    <Label class="text-lg font-bold text-gray-900" text="Card Title" />
  </View>
  <View class="card-body vertical">
    <Label class="text-gray-600" text="Card content goes here" />
  </View>
  <View class="card-footer">
    <Button class="bg-brand text-white rounded-lg" title="Action" />
  </View>
</View>
```

### Button System with Variants

```javascript
// config.cjs
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: { 500: '#007aff', 600: '#0066dd', 100: '#e0f0ff' }
      }
    },
    // Base button
    '.btn': {
      apply: 'font-bold rounded-lg h-12 px-6'
    },
    // Variants
    '.btn-primary': {
      apply: 'bg-brand-500 text-white'
    },
    '.btn-secondary': {
      apply: 'bg-gray-200 text-gray-800'
    },
    '.btn-outline': {
      apply: 'border-2 border-brand-500 text-brand-500 bg-transparent'
    },
    '.btn-ghost': {
      apply: 'bg-transparent text-brand-500'
    },
    // Sizes
    '.btn-sm': {
      apply: 'h-8 px-3 text-sm'
    },
    '.btn-lg': {
      apply: 'h-14 px-8 text-lg'
    }
  }
}
```

**Usage:**
```xml
<Button class="btn btn-primary" title="Submit" />
<Button class="btn btn-outline" title="Cancel" />
<Button class="btn btn-secondary btn-sm" title="Small" />
<Button class="btn btn-primary btn-lg" title="Large Action" />
```

### Form Input System

```javascript
// config.cjs
module.exports = {
  theme: {
    TextField: {
      DEFAULT: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: '#ffffff',
        color: '#111827',
        hintTextColor: '#9ca3af'
      },
      android: {
        touchFeedback: true
      }
    },
    TextArea: {
      DEFAULT: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        padding: { top: 12, right: 16, bottom: 12, left: 16 },
        backgroundColor: '#ffffff',
        color: '#111827',
        hintTextColor: '#9ca3af'
      }
    },
    '.input-error': {
      apply: 'border-red-500 bg-red-50'
    },
    '.input-success': {
      apply: 'border-green-500 bg-green-50'
    }
  }
}
```

**Usage:**
```xml
<TextField hintText="Email address" />
<TextField class="input-error" hintText="Invalid email" />
<TextArea hintText="Your message..." />
```

## Related References

- [Deep Customization](customization-deep-dive.md) - Config.cjs structure and usage
- [Arbitrary Values](arbitrary-values.md) - Using custom values with parentheses notation
- [Platform Modifiers](platform-modifiers.md) - Platform-specific customization
- [Apply Directive](apply-directive.md) - Extracting utility combinations
- [Custom Rules](custom-rules.md) - Styling Ti Elements, IDs, and classes
