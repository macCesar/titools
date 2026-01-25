# Arbitrary Values in PurgeTSS

Sometimes, you may need a specific value that is not included among the default values, or that you only need to use once in your project and do not want to include in the `config.cjs` file. In these cases, you can use **arbitrary values**.

## Parentheses Notation

:::info
**To generate an arbitrary style, you can use *parenthesis notation* with almost any default utility classes.**

Unfortunately, you cannot use square bracket notation like in Tailwind, because Titanium handles platform and conditional statements in `.tss` files differently.
:::

## Color Properties

You can set arbitrary color values **to ALL available color properties**, using `hex`, `rgb`, `rgba`, or standard color names.

### Examples

```xml
<!-- Arbitrary hex colors -->
<Window class="from-(#4C61E4) to-(#804C61E4)">
  <Label class="bg-(#4C61E4) text-(#ff0000)" />
</Window>

<!-- Arbitrary rgba colors -->
<View class="bg-(rgba(100,200,50,0.5)) border-(rgba(255,0,0,0.3))" />

<!-- Standard color names -->
<Label class="text-(crimson) bg-(lightgoldenrodyellow)" />
```

### Complete List of Color Properties

All of these support arbitrary values with parentheses notation:

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

You can set arbitrary values **to MOST size and dimension properties**, using `rem`, `px`, `pt`, `%`, `cm`, `in`, or `dp` values.

### Unit Conversion Rules

- `%`, `px`, `cm`, `in` - Passed without conversion
- `em` or `rem` - Converted with formula: `value * 16`
- `dp` - Unit type removed, value remains intact

### Examples

```xml
<!-- Width and height -->
<Label class="w-(10rem) h-(1.75rem) w-(250px) h-(80%)" />
<View class="w-(2in) h-(3.5in)" />

<!-- Margins and padding -->
<View class="m-(50px) mt-(1rem) p-(20px) pb-(0.5rem)" />

<!-- Positioning -->
<Label class="left-(150px) top-(275px) right-(50px) bottom-(75px)" />

<!-- Border radius -->
<View class="rounded-(20px) rounded-(1.5rem) rounded-(5)" />

<!-- Negative margins -->
<View class="-ml-(20px) -mt-(10)" />
```

### Complete List of Spacing Properties

**Background Padding:**
- `bg-padding-b-(*any-size-value-and-unit*)`
- `bg-padding-l-(*any-size-value-and-unit*)`
- `bg-padding-r-(*any-size-value-and-unit*)`
- `bg-padding-t-(*any-size-value-and-unit*)`

**Background Left and Top Cap:**
- `bg-l-cap-(*any-size-value-and-unit*)`
- `bg-t-cap-(*any-size-value-and-unit*)`

**Positioning (Top, Right, Bottom, Left):**
- `bottom-(*any-size-value-and-unit*)`
- `left-(*any-size-value-and-unit*)`
- `l-(*any-size-value-and-unit*)`
- `right-(*any-size-value-and-unit*)`
- `r-(*any-size-value-and-unit*)`
- `top-(*any-size-value-and-unit*)`
- `x-(*any-size-value-and-unit*)`
- `y-(*any-size-value-and-unit*)`

**Content Width and Height:**
- `content-(*any-size-value-and-unit*)`
- `content-h-(*any-size-value-and-unit*)`
- `content-w-(*any-size-value-and-unit*)`

**Gaps:**
- `gap-(*any-size-value-and-unit*)`
- `gap-b-(*any-size-value-and-unit*)`
- `gap-l-(*any-size-value-and-unit*)`
- `gap-r-(*any-size-value-and-unit*)`
- `gap-t-(*any-size-value-and-unit*)`
- `gap-x-(*any-size-value-and-unit*)`
- `gap-y-(*any-size-value-and-unit*)`

**Width and Height:**
- `h-(*any-size-value-and-unit*)`
- `w-(*any-size-value-and-unit*)`

**Indentation:**
- `indentation-level-(*any-size-value-and-unit*)`

**Keyboard Toolbar:**
- `keyboard-toolbar-h-(*any-size-value-and-unit*)`

**Button Padding:**
- `left-button-padding-(*any-size-value-and-unit*)`
- `right-button-padding-(*any-size-value-and-unit*)`

**Left and Right Width:**
- `left-w-(*any-size-value-and-unit*)`
- `lw-(*any-size-value-and-unit*)`
- `right-w-(*any-size-value-and-unit*)`
- `rw-(*any-size-value-and-unit*)`

**Margin:**
- `m-(*any-size-value-and-unit*)`
- `mb-(*any-size-value-and-unit*)`
- `ml-(*any-size-value-and-unit*)`
- `mr-(*any-size-value-and-unit*)`
- `mt-(*any-size-value-and-unit*)`
- `mx-(*any-size-value-and-unit*)`
- `my-(*any-size-value-and-unit*)`

**Max/Min Row Height:**
- `max-row-h-(*any-size-value-and-unit*)`
- `min-row-h-(*any-size-value-and-unit*)`

**Padding:**
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

**Paging Control:**
- `paging-control-h-(*any-size-value-and-unit*)`

**Border Radius:**
- `rounded-(*any-size-value-and-unit*)`
- `rounded-b-(*any-size-value-and-unit*)`
- `rounded-bl-(*any-size-value-and-unit*)`
- `rounded-br-(*any-size-value-and-unit*)`
- `rounded-l-(*any-size-value-and-unit*)`
- `rounded-r-(*any-size-value-and-unit*)`
- `rounded-t-(*any-size-value-and-unit*)`
- `rounded-tl-(*any-size-value-and-unit*)`
- `rounded-tr-(*any-size-value-and-unit*)`

**Row Height:**
- `row-h-(*any-size-value-and-unit*)`

**Section Header:**
- `section-header-top-padding-(*any-size-value-and-unit*)`

**Separator:**
- `separator-h-(*any-size-value-and-unit*)`

**Shadow Radius:**
- `shadow-radius-(*any-size-value-and-unit*)`

**Offsets:**
- `x-offset-(*any-size-value-and-unit*)`
- `y-offset-(*any-size-value-and-unit*)`

## Miscellaneous Properties

You can set arbitrary values to properties like border radius, opacity, font size, etc.

### Examples

```xml
<!-- Opacity -->
<View class="opacity-(0.35) opacity-(0.85)" />

<!-- Font size -->
<Label class="text-(15) text-(22px) text-(2rem)" />

<!-- Border width -->
<View class="border-width-(2) border-(5)" />

<!-- Rotation -->
<View class="rotate-(45) rotate-(1.5)" />

<!-- Scale -->
<View class="scale-(1.5) scale-(0.8)" />

<!-- z-index -->
<View class="z-(100) z-(-1)" />

<!-- Duration (milliseconds) -->
<Animation class="duration-(300)" />
```

### Complete List of Miscellaneous Properties

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

## Real-World Examples

### Credit Card Component

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

      <View class="bottom-(0) bg-(#6D80FB) h-16 w-full">
        <View class="horizontal">
          <Label class="fab fa-apple text-2xl text-white" />
          <Label class="ml-2 text-2xl font-bold text-white" text="Pay"/>
        </View>
      </View>
    </View>
  </Window>
</Alloy>
```

### Complex Layout with Absolute Positioning

```xml
<Alloy>
  <Window class="bg-white">
    <!-- Background banner -->
    <View class="bg-(#1B6F3F) w-(2300px) h-(1600px) ml-0 mt-0">
      <View class="mt-(100px) h-(200px) left-(150px) horizontal">
        <Label class="fas fa-cloud text-(48px) text-white" />
        <Label class="ml-(30px) text-(48px) h-(200px) font-bold text-white">ZULTYS</Label>
      </View>

      <View class="vertical left-(150px) w-(1300px)">
        <Label class="text-(64px) mt-(275px) font-bold text-white">Convert your business</Label>
        <Button class="mt-(75px) bg-(#fff) text-(#25A25B) h-(100px) w-(400px) rounded-(20px) left-(0) font-bold">Request Free Demo</Button>
      </View>
    </View>

    <!-- Floating card with overlap -->
    <View class="mt-(100px) mr-(150px) w-(1800px) h-(200px) bg-(#0B4825)">
      <Label class="left-(50px) text-(22px) font-normal text-white">We can have your remote teams up in 24 hours</Label>
      <Button class="bg-(#25A25B) h-(100px) w-(350px) rounded-(20px) right-(50px) text-white">Request Free Demo</Button>
    </View>

    <!-- Positioned image -->
    <View class="mt-(450px) right-(250px) rounded-(60px)">
      <ImageView class="h-(1480px) w-(900px)" image="https://example.com/image.jpg" />
    </View>
  </Window>
</Alloy>
```

## Tips for Using Arbitrary Values

:::tip
**Prefer `config.cjs` for repeated values** - If you find yourself using the same arbitrary value multiple times, consider adding it to `config.cjs` under `theme.extend` instead.
:::

:::tip
**Mix arbitrary values with utilities** - You can combine arbitrary values with standard PurgeTSS utilities: `class="bg-white rounded-(20px) p-(20px) text-center"`
:::

:::caution
**Unit consistency** - Be consistent with units within a layout. Mixing `rem`, `px`, and `%` arbitrarily can lead to inconsistent spacing across devices.
:::
