# Arbitrary Values

When you need a one-off value that is not in the defaults, use arbitrary values instead of adding it to `config.cjs`.

> **INFO**
> To generate an arbitrary style, use parentheses notation with almost any default utility class.
>
> Square bracket notation (`[10px]`) is **not supported** because Titanium handles platform and conditional statements in `.tss` files differently. Use parentheses (`(10px)`) instead.

## Class syntax pre-validation

Starting with PurgeTSS v7.8.0, the build runs a pre-validation pass over class names found in XML views and JS controllers before purging. When it spots a malformed arbitrary-value utility, it stops and prints a structured `Class Syntax Error` block so the offending class can be fixed before any TSS is generated. If multiple errors are present, all of them are reported in the same run.

Each error block includes:

- The file path where the offending class lives
- The line number inside that file
- The offending class name (as authored)
- A `Fix:` suggestion with the corrected class name

Example shape:

```
Class Syntax Error
  File: app/views/index.xml
  Line: 12
  Found: top-(-10)
  Fix:   -top-(10)
```

### Detected patterns

The validator catches five narrow, actionable mistakes:

| Pattern                       | Offending input | Suggested fix | Notes                                                            |
| ----------------------------- | --------------- | ------------- | ---------------------------------------------------------------- |
| Inverted negative sign        | `top-(-10)`     | `-top-(10)`   | The `-` prefix goes before the rule, not inside the value        |
| Square-bracket notation       | `top-[10px]`    | `top-(10px)`  | PurgeTSS uses parentheses, not square brackets, for arbitrary values (v7.10.1 reworded the error from `Tailwind-style brackets "[ ]"` to `Square brackets "[ ]" are not supported`) |
| Empty parentheses             | `wh-()`         | (flagged, no auto-fix) | Add a value such as `wh-(10)`                           |
| Whitespace inside parentheses | `wh-( 200 )`    | `wh-(200)`    | No spaces allowed between `(`, the value, and `)`                |
| Redundant `px` unit           | `top-(10px)`    | `top-(10)`    | PurgeTSS treats unit-less arbitrary values as pixels             |

### Unknown classes are still silently dropped

The pre-validator only fires on the five patterns above. Any other unknown class — typos, custom utilities not yet declared, vendor classes that are not enabled in `config.cjs` — is **not** reported as a `Class Syntax Error`. Those classes continue to flow into the `// Unused or unsupported classes` comment block in `app.tss`, exactly like before. This keeps the validator focused on actionable mistakes and avoids noise while you sketch out class names.

### v7.8.0 parser fix for negatives inside parentheses

Before v7.8.0, an inverted negative such as `top-(-10)` could be silently misparsed by the arbitrary-value pipeline (the `-` inside the parentheses confused the token matcher, producing wrong or missing TSS output without any warning). v7.8.0 hardens that path: the parser now correctly recognizes `top-(-10)` as authored, classifies it as an inverted-negative-sign error, and surfaces the `Class Syntax Error` block with the `-top-(10)` fix instead of producing silent garbage.

## Arbitrary nesting depth in `theme` objects (v7.10.0)

Since v7.10.0, property emission walks nested `theme.*` values **recursively** instead of stopping at level 2, so deeply nested color families, gradients, and background gradients now flatten into class suffixes without being silently dropped.

Before v7.10.0:

```javascript
// pre-v7.10.0 — only colors.brand was reached; .primary.500 was silently dropped
theme: {
  extend: {
    colors: {
      brand: {
        primary: { 500: '#3b82f6', 700: '#1d4ed8' }
      }
    }
  }
}
```

The classes `bg-brand-primary-500`, `text-brand-primary-700`, etc. were **not** generated.

From v7.10.0 onward:

```javascript
// v7.10.0+ — recursive walk emits the full path
theme: {
  extend: {
    colors: {
      brand: {
        primary: { 500: '#3b82f6', 700: '#1d4ed8' }
      }
    }
  }
}
```

```tss
/* utilities.tss */
'.bg-brand-primary-500': { backgroundColor: '#3b82f6' }
'.bg-brand-primary-700': { backgroundColor: '#1d4ed8' }
'.text-brand-primary-500': { color: '#3b82f6', textColor: '#3b82f6' }
/* ...and every other color property */
```

The same recursive emission applies to `backgroundGradient` and `backgroundSelectedGradient` definitions inside `theme.extend`.

### Default modifier keys collapse silently

Three special keys — `default`, `global`, `DEFAULT` — collapse without contributing to the class-name suffix. That lets you keep a default variant alongside named variants without polluting the class name:

```javascript
theme: {
  extend: {
    colors: {
      surface: {
        DEFAULT: '#f9fafb',  // emits .bg-surface (no suffix)
        muted: '#e5e7eb'     // emits .bg-surface-muted
      }
    }
  }
}
```

```tss
'.bg-surface':       { backgroundColor: '#f9fafb' }
'.bg-surface-muted': { backgroundColor: '#e5e7eb' }
```

If you have a project that previously kept color shades only at depth ≤ 2 to avoid the silent-drop behavior, you can now restructure them by domain without paying for nesting.

## Color Properties

You can set arbitrary color values for all available color properties using `hex`, `rgb`, or `rgba` values, directly in XML files or in `config.cjs`.

```xml
<Alloy>
  <Window class="from-(#4C61E4) to-(#804C61E4)">
    <Label class="w-(250) bg-(rgba(100,200,50)) text-(#4C61E4) text-(15) rounded-4 h-8 text-center" text="Green Label" />
  </Window>
</Alloy>
```

```tss
/* Ti Elements */
'Window': { backgroundColor: '#FFFFFF' }

/* Main Styles */
'.h-8': { height: 32 }
'.rounded-4': { borderRadius: 8 }
'.text-center': { textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER }

/* Arbitrary Values */
'.bg-(rgba(100,200,50))': { backgroundColor: 'rgba(100,200,50)' }
'.from-(#4C61E4)': { backgroundGradient: { colors: [ '#004C61E4', '#4C61E4' ] } }
'.text-(#4C61E4)': { color: '#4C61E4', textColor: '#4C61E4' }
'.text-(15)': { font: { fontSize: 15 } }
'.to-(#804C61E4)': { backgroundGradient: { colors: [ '#804C61E4' ] } }
'.w-(250)': { width: 250 }
```

### List of Color Properties

You can set an arbitrary value for any of the following color properties:

- `active-tint-` (*hex-rgb-or-rgba-value*)
- `active-title-` (*hex-rgb-or-rgba-value*)
- `badge-` (*hex-rgb-or-rgba-value*)
- `bar-` (*hex-rgb-or-rgba-value*)
- `bg-` (*hex-rgb-or-rgba-value*)
- `bg-focused-` (*hex-rgb-or-rgba-value*)
- `bg-selected-` (*hex-rgb-or-rgba-value*)
- `bg-selected-from-` (*hex-rgb-or-rgba-value*)
- `bg-selected-to-` (*hex-rgb-or-rgba-value*)
- `border-` (*hex-rgb-or-rgba-value*)
- `current-page-indicator-` (*hex-rgb-or-rgba-value*)
- `date-time-` (*hex-rgb-or-rgba-value*)
- `disabled-` (*hex-rgb-or-rgba-value*)
- `drop-shadow-` (*hex-rgb-or-rgba-value*)
- `from-` (*hex-rgb-or-rgba-value*)
- `highlighted-` (*hex-rgb-or-rgba-value*)
- `image-touch-feedback-` (*hex-rgb-or-rgba-value*)
- `indicator-` (*hex-rgb-or-rgba-value*)
- `keyboard-toolbar-` (*hex-rgb-or-rgba-value*)
- `nav-tint-` (*hex-rgb-or-rgba-value*)
- `on-tint-` (*hex-rgb-or-rgba-value*)
- `page-indicator-` (*hex-rgb-or-rgba-value*)
- `paging-control-` (*hex-rgb-or-rgba-value*)
- `placeholder-` (*hex-rgb-or-rgba-value*)
- `pull-bg-` (*hex-rgb-or-rgba-value*)
- `results-bg-` (*hex-rgb-or-rgba-value*)
- `results-separator-` (*hex-rgb-or-rgba-value*)
- `selected-` (*hex-rgb-or-rgba-value*)
- `selected-button-` (*hex-rgb-or-rgba-value*)
- `selected-subtitle-` (*hex-rgb-or-rgba-value*)
- `selected-text-` (*hex-rgb-or-rgba-value*)
- `separator-` (*hex-rgb-or-rgba-value*)
- `shadow-` (*hex-rgb-or-rgba-value*)
- `subtitle-` (*hex-rgb-or-rgba-value*)
- `tabs-bg-` (*hex-rgb-or-rgba-value*)
- `tabs-bg-selected-` (*hex-rgb-or-rgba-value*)
- `text-` (*hex-rgb-or-rgba-value*)
- `thumb-tint-` (*hex-rgb-or-rgba-value*)
- `tint-` (*hex-rgb-or-rgba-value*)
- `title-` (*hex-rgb-or-rgba-value*)
- `title-attributes-` (*hex-rgb-or-rgba-value*)
- `title-attributes-shadow-` (*hex-rgb-or-rgba-value*)
- `title-text-` (*hex-rgb-or-rgba-value*)
- `to-` (*hex-rgb-or-rgba-value*)
- `touch-feedback-` (*hex-rgb-or-rgba-value*)
- `track-tint-` (*hex-rgb-or-rgba-value*)

## Spacing Properties

You can set arbitrary values for most size and dimension properties using `rem`, `px`, or `pt` values, directly in XML files or in `config.cjs`.

```xml
<Alloy>
  <Window>
    <Label class="w-(10rem) h-(1.75rem) text-(15) rounded-(5) bg-blue-800 text-center text-white" text="My custom Label" />
  </Window>
</Alloy>
```

```tss
/* Ti Elements */
'Window': { backgroundColor: '#FFFFFF' }

/* Main Styles */
'.bg-blue-800': { backgroundColor: '#1e40af' }
'.text-center': { textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER }
'.text-white': { color: '#ffffff', textColor: '#ffffff' }

/* Arbitrary Values */
'.h-(1.75rem)': { height: 28 }
'.rounded-(5)': { borderRadius: 5 }
'.text-(15)': { font: { fontSize: 15 } }
'.w-(10rem)': { width: 160 }
```

### List of Spacing Properties

- Background padding
  - `bg-padding-b-` (*any-size-value-and-unit*)
  - `bg-padding-l-` (*any-size-value-and-unit*)
  - `bg-padding-r-` (*any-size-value-and-unit*)
  - `bg-padding-t-` (*any-size-value-and-unit*)
- Background left and top cap
  - `bg-l-cap-` (*any-size-value-and-unit*)
  - `bg-t-cap-` (*any-size-value-and-unit*)
- Top, right, bottom, left
  - `bottom-` (*any-size-value-and-unit*)
  - `left-` (*any-size-value-and-unit*)
  - `l-` (*any-size-value-and-unit*)
  - `right-` (*any-size-value-and-unit*)
  - `r-` (*any-size-value-and-unit*)
  - `top-` (*any-size-value-and-unit*)
  - `x-` (*any-size-value-and-unit*)
  - `y-` (*any-size-value-and-unit*)
- Content width and content height
  - `content-` (*any-size-value-and-unit*)
  - `content-h-` (*any-size-value-and-unit*)
  - `content-w-` (*any-size-value-and-unit*)
- Gaps
  - `gap-` (*any-size-value-and-unit*)
  - `gap-b-` (*any-size-value-and-unit*)
  - `gap-l-` (*any-size-value-and-unit*)
  - `gap-r-` (*any-size-value-and-unit*)
  - `gap-t-` (*any-size-value-and-unit*)
  - `gap-x-` (*any-size-value-and-unit*)
  - `gap-y-` (*any-size-value-and-unit*)
- Width and height
  - `h-` (*any-size-value-and-unit*)
  - `w-` (*any-size-value-and-unit*)
- `indentation-level-` (*any-size-value-and-unit*)
- `keyboard-toolbar-h-` (*any-size-value-and-unit*)
- Left and right button padding
  - `left-button-padding-` (*any-size-value-and-unit*)
  - `right-button-padding-` (*any-size-value-and-unit*)
- Left and right width
  - `left-w-` (*any-size-value-and-unit*)
  - `lw-` (*any-size-value-and-unit*)
  - `right-w-` (*any-size-value-and-unit*)
  - `rw-` (*any-size-value-and-unit*)
- Margin
  - `m-` (*any-size-value-and-unit*)
  - `mb-` (*any-size-value-and-unit*)
  - `ml-` (*any-size-value-and-unit*)
  - `mr-` (*any-size-value-and-unit*)
  - `mt-` (*any-size-value-and-unit*)
  - `mx-` (*any-size-value-and-unit*)
  - `my-` (*any-size-value-and-unit*)
- `max-elevation-` (*any-size-value-and-unit*)
- Max and min row height
  - `max-row-h-` (*any-size-value-and-unit*)
  - `min-row-h-` (*any-size-value-and-unit*)
- Padding
  - `p-` (*any-size-value-and-unit*)
  - `pb-` (*any-size-value-and-unit*)
  - `pl-` (*any-size-value-and-unit*)
  - `pr-` (*any-size-value-and-unit*)
  - `pt-` (*any-size-value-and-unit*)
  - `px-` (*any-size-value-and-unit*)
  - `py-` (*any-size-value-and-unit*)
- paddingTop, paddingRight, paddingBottom, paddingLeft
  - `padding-` (*any-size-value-and-unit*)
  - `padding-b-` (*any-size-value-and-unit*)
  - `padding-bottom-` (*any-size-value-and-unit*)
  - `padding-l-` (*any-size-value-and-unit*)
  - `padding-left-` (*any-size-value-and-unit*)
  - `padding-r-` (*any-size-value-and-unit*)
  - `padding-right-` (*any-size-value-and-unit*)
  - `padding-t-` (*any-size-value-and-unit*)
  - `padding-top-` (*any-size-value-and-unit*)
  - `padding-x-` (*any-size-value-and-unit*)
  - `padding-y-` (*any-size-value-and-unit*)
- `paging-control-h-` (*any-size-value-and-unit*)
- Border radius
  - `rounded-` (*any-size-value-and-unit*)
  - `rounded-b-` (*any-size-value-and-unit*)
  - `rounded-bl-` (*any-size-value-and-unit*)
  - `rounded-br-` (*any-size-value-and-unit*)
  - `rounded-l-` (*any-size-value-and-unit*)
  - `rounded-r-` (*any-size-value-and-unit*)
  - `rounded-t-` (*any-size-value-and-unit*)
  - `rounded-tl-` (*any-size-value-and-unit*)
  - `rounded-tr-` (*any-size-value-and-unit*)
- `row-h-` (*any-size-value-and-unit*)
- `section-header-top-padding-` (*any-size-value-and-unit*)
- `separator-h-` (*any-size-value-and-unit*)
- `shadow-radius-` (*any-size-value-and-unit*)
- xOffset and yOffset
  - `x-offset-` (*any-size-value-and-unit*)
  - `y-offset-` (*any-size-value-and-unit*)

## Miscellaneous Properties

You can set arbitrary values for the following properties, like border radius and opacity.

### List of Miscellaneous Properties

- `active-tab-` (*number-value*)
- `border-width-` (*number-value*)
- `cache-size-` (*number-value*)
- `count-down-` (*in-milliseconds*)
- `delay-` (*in-milliseconds*)
- `duration-` (*in-milliseconds*)
- `elevation-` (*number-value*)
- `font-` (*valid-font-weight-value*)
- `horizontal-margin-` (*decimal-value*)
- `lines-` (*number-value*)
- `max-length-` (*number-value*)
- `max-lines-` (*number-value*)
- `max-zoom-scale-` (*decimal-value*)
- `min-zoom-scale-` (*decimal-value*)
- `min-` (*number-value*)
- `minimum-text-` (*number-value*)
- `opacity-` (*decimal-value-from-0-to-1*)
- `origin-` (*x-and-y-coordinates*)
- `paging-control-alpha-` (*decimal-value-from-0-to-1*)
- `paging-control-timeout-` (*in-milliseconds*)
- `repeat-count-` (*number-value*)
- `repeat-` (*number-value*)
- `rotate-` (*number-value*)
- `scale-` (*decimal-value*)
- `text-size-` (*number-value*)
- `timeout-` (*in-milliseconds*)
- `vertical-margin-` (*decimal-value*)
- `z-` (*number-value*)
- `zoom-scale-` (*decimal-value*)

## Examples

You can use any supported units depending on the property you are generating. Use `hex` or `rgba` values for any color property, or `rem` or `px` for position and sizing properties.

### Credit Card

```xml
<Alloy>
  <Window class="bg-(#53606b)">
    <View class="w-(2in) h-(3.5in) bg-(#4C61E4) rounded-(20)">
      <View class="m-(50px) h-screen w-screen">
        <View class="horizontal ml-0 mt-0">
          <View class="w-(3rem) h-(3rem) rounded-(1.5rem) opacity-(0.35) bg-white" />
          <View class="-ml-(20) w-(3rem) h-(3rem) rounded-(1.5rem) opacity-(0.25) bg-white" />
          <Label class="ml-2.5 font-bold text-white">Mastercard</Label>
        </View>
      </View>

      <View class="bottom-(0) bg-(#6D80FB) h-16 w-screen">
        <View class="horizontal">
          <Label class="fab fa-apple text-2xl text-white" />
          <Label class="ml-2 text-2xl font-bold text-white" text="Pay" />
        </View>
      </View>
    </View>
  </Window>
</Alloy>
```

### Front Cover

Try this example on an iPad or tablet.

```xml
<Alloy>
  <Window class="bg-white">
    <View class="bg-(#1B6F3F) w-(2300px) h-(1600px) ml-0 mt-0">
      <View class="mt-(100px) h-(200px) left-(150px) horizontal">
        <Label class="fas fa-cloud text-(48px) text-white" />
        <Label class="ml-(30px) text-(48px) h-(200px) font-bold text-white">ZULTYS</Label>
      </View>
    </View>
  </Window>
</Alloy>
```

### Menu Bar

```xml
<Alloy>
  <Window class="bg-(#53606b)" backgroundImage="https://i.pinimg.com/originals/ab/70/a1/ab70a19f087cc9ba2b03e3bee71acc3e.jpg">
    <View class="h-(150px) bg-(#53A500) horizontal mt-0 w-screen">
      <Label class="w-(4.5rem) text-(16px) h-(150px) text-(#12681E) text-center font-bold" text="Home" />
      <Label class="w-(4.5rem) text-(16px) h-(150px) text-(#12681E) bg-(#6DB400) text-center font-bold" text="News" />
    </View>
  </Window>
</Alloy>
```

## Community-Discovered Patterns

These constraints reflect community experience using arbitrary values against the realities of the Titanium layout engine. They are not part of the official reference but prevent common mistakes.

> **Titanium Layout Constraint**
> Prefer `w-screen` instead of `w-full` when you need fill behavior. `w-full` maps to `100%`, not `Ti.UI.FILL`.

> **Titanium Padding Constraint**
> PurgeTSS can generate arbitrary `padding-*` values, but Titanium still does not support native `padding` on `View`, `Window`, `ScrollView`, or `TableView`. Use margins on children for those elements.
