# Arbitrary Values

Sometimes you need a value that is not in the defaults, or you only need it once and do not want to add it to `config.cjs`. Use arbitrary values for that.

> **️ℹ️ INFO**
> To generate an arbitrary style, use parentheses notation with almost any default utility class.
>
> Do not use square bracket notation. PurgeTSS uses parentheses because Titanium handles platform and conditional statements in `.tss` files differently.

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

- `active-tint-(*hex-rgb-or-rgba-value*)`
- `active-title-(*hex-rgb-or-rgba-value*)`
- `badge-(*hex-rgb-or-rgba-value*)`
- `bar-(*hex-rgb-or-rgba-value*)`
- `bg-(*hex-rgb-or-rgba-value*)`
- `bg-focused-(*hex-rgb-or-rgba-value*)`
- `bg-selected-(*hex-rgb-or-rgba-value*)`
- `bg-selected-from-(*hex-rgb-or-rgba-value*)`
- `bg-selected-to-(*hex-rgb-or-rgba-value*)`
- `border-(*hex-rgb-or-rgba-value*)`
- `current-page-indicator-(*hex-rgb-or-rgba-value*)`
- `date-time-(*hex-rgb-or-rgba-value*)`
- `disabled-(*hex-rgb-or-rgba-value*)`
- `drop-shadow-(*hex-rgb-or-rgba-value*)`
- `from-(*hex-rgb-or-rgba-value*)`
- `highlighted-(*hex-rgb-or-rgba-value*)`
- `image-touch-feedback-(*hex-rgb-or-rgba-value*)`
- `indicator-(*hex-rgb-or-rgba-value*)`
- `keyboard-toolbar-(*hex-rgb-or-rgba-value*)`
- `nav-tint-(*hex-rgb-or-rgba-value*)`
- `on-tint-(*hex-rgb-or-rgba-value*)`
- `page-indicator-(*hex-rgb-or-rgba-value*)`
- `paging-control-(*hex-rgb-or-rgba-value*)`
- `placeholder-(*hex-rgb-or-rgba-value*)`
- `pull-bg-(*hex-rgb-or-rgba-value*)`
- `results-bg-(*hex-rgb-or-rgba-value*)`
- `results-separator-(*hex-rgb-or-rgba-value*)`
- `selected-(*hex-rgb-or-rgba-value*)`
- `selected-button-(*hex-rgb-or-rgba-value*)`
- `selected-subtitle-(*hex-rgb-or-rgba-value*)`
- `selected-text-(*hex-rgb-or-rgba-value*)`
- `separator-(*hex-rgb-or-rgba-value*)`
- `shadow-(*hex-rgb-or-rgba-value*)`
- `subtitle-(*hex-rgb-or-rgba-value*)`
- `tabs-bg-(*hex-rgb-or-rgba-value*)`
- `tabs-bg-selected-(*hex-rgb-or-rgba-value*)`
- `text-(*hex-rgb-or-rgba-value*)`
- `thumb-tint-(*hex-rgb-or-rgba-value*)`
- `tint-(*hex-rgb-or-rgba-value*)`
- `title-(*hex-rgb-or-rgba-value*)`
- `title-attributes-(*hex-rgb-or-rgba-value*)`
- `title-attributes-shadow-(*hex-rgb-or-rgba-value*)`
- `title-text-(*hex-rgb-or-rgba-value*)`
- `to-(*hex-rgb-or-rgba-value*)`
- `touch-feedback-(*hex-rgb-or-rgba-value*)`
- `track-tint-(*hex-rgb-or-rgba-value*)`

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
  - `bg-padding-b-(*any-size-value-and-unit*)`
  - `bg-padding-l-(*any-size-value-and-unit*)`
  - `bg-padding-r-(*any-size-value-and-unit*)`
  - `bg-padding-t-(*any-size-value-and-unit*)`
- Background left and top cap
  - `bg-l-cap-(*any-size-value-and-unit*)`
  - `bg-t-cap-(*any-size-value-and-unit*)`
- Top, right, bottom, left
  - `bottom-(*any-size-value-and-unit*)`
  - `left-(*any-size-value-and-unit*)`
  - `l-(*any-size-value-and-unit*)`
  - `right-(*any-size-value-and-unit*)`
  - `r-(*any-size-value-and-unit*)`
  - `top-(*any-size-value-and-unit*)`
  - `x-(*any-size-value-and-unit*)`
  - `y-(*any-size-value-and-unit*)`
- Content width and content height
  - `content-(*any-size-value-and-unit*)`
  - `content-h-(*any-size-value-and-unit*)`
  - `content-w-(*any-size-value-and-unit*)`
- Gaps
  - `gap-(*any-size-value-and-unit*)`
  - `gap-b-(*any-size-value-and-unit*)`
  - `gap-l-(*any-size-value-and-unit*)`
  - `gap-r-(*any-size-value-and-unit*)`
  - `gap-t-(*any-size-value-and-unit*)`
  - `gap-x-(*any-size-value-and-unit*)`
  - `gap-y-(*any-size-value-and-unit*)`
- Width and height
  - `h-(*any-size-value-and-unit*)`
  - `w-(*any-size-value-and-unit*)`
- `indentation-level-(*any-size-value-and-unit*)`
- `keyboard-toolbar-h-(*any-size-value-and-unit*)`
- Left and right button padding
  - `left-button-padding-(*any-size-value-and-unit*)`
  - `right-button-padding-(*any-size-value-and-unit*)`
- Left and right width
  - `left-w-(*any-size-value-and-unit*)`
  - `lw-(*any-size-value-and-unit*)`
  - `right-w-(*any-size-value-and-unit*)`
  - `rw-(*any-size-value-and-unit*)`
- Margin
  - `m-(*any-size-value-and-unit*)`
  - `mb-(*any-size-value-and-unit*)`
  - `ml-(*any-size-value-and-unit*)`
  - `mr-(*any-size-value-and-unit*)`
  - `mt-(*any-size-value-and-unit*)`
  - `mx-(*any-size-value-and-unit*)`
  - `my-(*any-size-value-and-unit*)`
- `max-elevation-(*any-size-value-and-unit*)`
- Max and min row height
  - `max-row-h-(*any-size-value-and-unit*)`
  - `min-row-h-(*any-size-value-and-unit*)`
- Padding
  - `p-(*any-size-value-and-unit*)`
  - `pb-(*any-size-value-and-unit*)`
  - `pl-(*any-size-value-and-unit*)`
  - `pr-(*any-size-value-and-unit*)`
  - `pt-(*any-size-value-and-unit*)`
  - `px-(*any-size-value-and-unit*)`
  - `py-(*any-size-value-and-unit*)`
- `padding-(*any-size-value-and-unit*)`
  - `padding-b-(*any-size-value-and-unit*)`
  - `padding-bottom-(*any-size-value-and-unit*)`
  - `padding-l-(*any-size-value-and-unit*)`
  - `padding-left-(*any-size-value-and-unit*)`
  - `padding-r-(*any-size-value-and-unit*)`
  - `padding-right-(*any-size-value-and-unit*)`
  - `padding-t-(*any-size-value-and-unit*)`
  - `padding-top-(*any-size-value-and-unit*)`
  - `padding-x-(*any-size-value-and-unit*)`
  - `padding-y-(*any-size-value-and-unit*)`
- `paging-control-h-(*any-size-value-and-unit*)`
- Border radius
  - `rounded-(*any-size-value-and-unit*)`
  - `rounded-b-(*any-size-value-and-unit*)`
  - `rounded-bl-(*any-size-value-and-unit*)`
  - `rounded-br-(*any-size-value-and-unit*)`
  - `rounded-l-(*any-size-value-and-unit*)`
  - `rounded-r-(*any-size-value-and-unit*)`
  - `rounded-t-(*any-size-value-and-unit*)`
  - `rounded-tl-(*any-size-value-and-unit*)`
  - `rounded-tr-(*any-size-value-and-unit*)`
- `row-h-(*any-size-value-and-unit*)`
- `section-header-top-padding-(*any-size-value-and-unit*)`
- `separator-h-(*any-size-value-and-unit*)`
- `shadow-radius-(*any-size-value-and-unit*)`
- xOffset and yOffset
  - `x-offset-(*any-size-value-and-unit*)`
  - `y-offset-(*any-size-value-and-unit*)`

## Miscellaneous Properties

You can set arbitrary values for the following properties, like border radius and opacity.

### List of Miscellaneous Properties

- `active-tab-(*number-value*)`
- `border-width-(*number-value*)`
- `cache-size-(*number-value*)`
- `count-down-(*in-milliseconds*)`
- `delay-(*in-milliseconds*)`
- `duration-(*in-milliseconds*)`
- `elevation-(*number-value*)`
- `font-(*valid-font-weight-value*)`
- `horizontal-margin-(*decimal-value*)`
- `lines-(*number-value*)`
- `max-length-(*number-value*)`
- `max-lines-(*number-value*)`
- `max-zoom-scale-(*decimal-value*)`
- `min-zoom-scale-(*decimal-value*)`
- `min-(*number-value*)`
- `minimum-text-(*number-value*)`
- `opacity-(*decimal-value-from-0-to-1*)`
- `origin-(*x-and-y-coordinates*)`
- `paging-control-alpha-(*decimal-value-from-0-to-1*)`
- `paging-control-timeout-(*in-milliseconds*)`
- `repeat-count-(*number-value*)`
- `repeat-(*number-value*)`
- `rotate-(*number-value*)`
- `scale-(*decimal-value*)`
- `text-size-(*number-value*)`
- `timeout-(*in-milliseconds*)`
- `vertical-margin-(*decimal-value*)`
- `z-(*number-value*)`
- `zoom-scale-(*decimal-value*)`

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

> **⚠️ Titanium Layout Constraint**
> Prefer `w-screen` instead of `w-full` when you need fill behavior. `w-full` maps to `100%`, not `Ti.UI.FILL`.

> **⚠️ Titanium Padding Constraint**
> PurgeTSS can generate arbitrary `padding-*` values, but Titanium still does not support native `padding` on `View`, `Window`, `ScrollView`, or `TableView`. Use margins on children for those elements.
