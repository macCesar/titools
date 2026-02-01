# PurgeTSS Examples - WRONG vs CORRECT

Complete examples of common patterns with anti-patterns and correct implementations.

## Titanium Layout Patterns

:::danger NO FLEXBOX IN TITANIUM
Titanium does NOT support CSS Flexbox. All examples use `horizontal`, `vertical`, or `composite` layouts.
:::

### Horizontal Row with Space Between

**❌ WRONG (Flexbox classes don't exist):**
```xml
<View class="flex-row justify-between">
  <Label text="Left" />
  <Label text="Right" />
</View>
```

**✅ CORRECT (Use horizontal layout + spacer):**
```xml
<View class="horizontal w-screen">
  <Label text="Left" />
  <View class="w-screen" />  <!-- Spacer -->
  <Label text="Right" />
</View>
```

**✅ ALTERNATIVE (Use margins):**
```xml
<View class="horizontal w-screen">
  <Label text="Left" class="ml-4" />
  <Label text="Right" class="mr-4" />
</View>
```

### Centered Content (Vertically and Horizontally)

**❌ WRONG (Flexbox center doesn't exist):**
```xml
<View class="flex items-center justify-center">
  <Label text="Centered" />
</View>
```

**✅ CORRECT (Composite layout + center class):**
```xml
<!-- Parent defaults to composite, no layout class needed -->
<View class="h-screen w-screen">
  <Label text="Centered" class="center" />
</View>
```

**✅ ALTERNATIVE (Use margins):**
```xml
<View class="h-screen w-screen">
  <Label text="Centered" class="mt-(40%) ml-(35%)" />
</View>
```

### Vertical Stack with Spacing

**❌ WRONG (Flexbox gap doesn't work):**
```xml
<View class="flex-col gap-4">
  <Label text="Item 1" />
  <Label text="Item 2" />
  <Label text="Item 3" />
</View>
```

**✅ CORRECT (Use vertical layout + margins):**
```xml
<View class="vertical">
  <Label text="Item 1" class="mt-4" />
  <Label text="Item 2" class="mt-4" />
  <Label text="Item 3" class="mt-4" />
</View>
```

### Header with Left/Right Elements

**❌ WRONG (Flexbox justify-between):**
```xml
<View class="flex-row items-center justify-between">
  <Label text="Title" class="font-bold" />
  <Label class="fas fa-bars" />
</View>
```

**✅ CORRECT (Composite + positioning):**
```xml
<View class="h-14 w-screen">
  <Label text="Title" class="center left-4 font-bold" />
  <Label class="fas fa-bars center right-4" />
</View>
```

### Available Layout Classes

| Class        | Description                          | Use Case                       |
| ------------ | ------------------------------------ | ------------------------------ |
| `horizontal` | Children arranged left to right      | Rows of buttons, form fields   |
| `vertical`   | Children arranged top to bottom      | Stacked content, lists         |
| *(no class)* | Defaults to `composite`              | Absolute positioning, overlays |
| `flow-col`   | Horizontal grid flow with 100% width | Special grid layouts           |
| `flow-row`   | Vertical grid flow with 100% height  | Special grid layouts           |

---

## Manual .tss Files Anti-Pattern

**❌ WRONG (Creating manual .tss files):**
```xml
<!-- app/views/index.xml -->
<Alloy>
  <Window class="bg-white">
    <Label id="myLabel" class="text-red-500" text="Hello" />
  </Window>
</Alloy>
```

```javascript
// app/styles/index.tss - ❌ DON'T CREATE THIS!
'#myLabel': {
  color: 'red',
  font: { fontSize: 18 }
}
'.text-red-500': {
  color: '#ef4444'
}
```

**✅ CORRECT (Let PurgeTSS generate app.tss):**
```xml
<!-- app/views/index.xml - ONLY THIS -->
<Alloy>
  <Window class="bg-white">
    <Label class="text-lg text-red-500" text="Hello" />
  </Window>
</Alloy>
```

```bash
# Then run:
purgetss build
# OR just compile:
alloy compile
```

```tss
/* app/styles/app.tss - AUTO-GENERATED */
'.bg-white': { backgroundColor: '#ffffff' }
'.text-red-500': { color: '#ef4444', textColor: '#ef4444' }
'.text-lg': { font: { fontSize: 18 } }
/* ONLY the classes you actually used */
```

---

## Grid with Percentages

**❌ WRONG (Children with % widths, parent without w-screen):**
```xml
<View class="horizontal m-4">
  <View class="w-(48%)">...</view>
  <View class="w-(48%)">...</view>
</View>
<!-- Parent doesn't have w-screen, % calculations may fail -->
```

**✅ CORRECT (Parent has w-screen):**
```xml
<View class="horizontal m-4 w-screen">
  <View class="w-(48%)">...</view>
  <View class="w-(48%)">...</view>
</View>
```

---

## Gap Usage

**❌ WRONG (gap adds margin all around, breaks % widths):**
```xml
<View class="grid grid-cols-2 gap-4">
  <View class="col-span-6">...</view>  <!-- 50% + 16px margins -->
  <View class="col-span-6">...</view>  <!-- 50% + 16px margins -->
</View>
<!-- Total > 100%, elements wrap or overflow -->
```

**✅ CORRECT (Use explicit margins):**
```xml
<View class="horizontal mb-4 w-screen">
  <View class="w-(48%) mr-2">...</view>
  <View class="w-(48%) ml-2">...</view>
</View>
```

---

## Padding on Container Views

**❌ WRONG (Padding on Views doesn't work in Titanium):**
```xml
<View class="p-4">
  <Label text="Hello" />
</View>
```

**✅ CORRECT (Use margins on children instead):**
```xml
<View>
  <Label class="m-4" text="Hello" />
</View>
```

**Why:** Titanium Views don't support padding properties. Use margins on child elements.

---

## `w-full` vs `w-screen`

**❌ WRONG (Using percentage-based width):**
```xml
<View class="w-full">
  <Label text="Full width" />
</View>
```

**✅ CORRECT (Use Ti.UI.FILL):**
```xml
<View class="w-screen">
  <Label text="Full width" />
</View>
```

**Difference:**
- `w-full` = `width: '100%'` (percentage of parent)
- `w-screen` = `width: Ti.UI.FILL` (native fill constant)

**Use `w-screen` for full-width elements** in Titanium.

---

## `rounded-full` Without Size

**❌ WRONG (rounded-full alone doesn't exist):**
```xml
<View class="h-12 w-12 rounded-full" />
```

**✅ CORRECT (Use rounded-full-XX where XX × 4 = element size):**
```xml
<!-- For 48×48 circle, use rounded-full-12 (12 × 4 = 48) -->
<View class="rounded-full-12" />
```

**Note:** `rounded-full-XX` already includes width and height. No need for separate `w-` or `h-` classes.

**Examples:**
- `rounded-full-8` = 32×32 circle
- `rounded-full-12` = 48×48 circle
- `rounded-full-16` = 64×64 circle

---

## Square Brackets for Arbitrary Values

**❌ WRONG (Using square brackets like Tailwind CSS):**
```xml
<View class="w-[100px] bg-[#ff0000]" />
```

**✅ CORRECT (PurgeTSS uses parentheses):**
```xml
<View class="w-(100px) bg-(#ff0000)" />
```

**PurgeTSS syntax for arbitrary values uses `()` not `[]`.**

**Examples:**
- `w-(100px)` - Custom width
- `bg-(#ff0000)` - Custom background color
- `mt-(20dp)` - Custom margin top
- `text-(#333333)` - Custom text color

---

## Layout Defaults

**❌ WRONG (Explicit composite class):**
```xml
<View class="composite">
  <Label class="right-4 top-8" />
</View>
```

**✅ CORRECT (Omit layout - defaults to composite):**
```xml
<View>
  <Label class="right-4 top-8" />
</View>
```

**❌ WRONG (Adding composite to remove vertical):**
```xml
<!-- To switch from vertical to composite -->
<View class="vertical composite">
```

**✅ CORRECT (Just remove vertical):**
```xml
<!-- Omitting layout defaults to composite -->
<View>
```

---

## Quick Reference Table

| Anti-Pattern          | Why It Fails             | Correct Approach        |
| --------------------- | ------------------------ | ----------------------- |
| `flex-row`            | Flexbox not supported    | `horizontal`            |
| `flex-col`            | Flexbox not supported    | `vertical`              |
| `justify-*`           | Flexbox not supported    | Use margins/positioning |
| `items-center`        | Flexbox not supported    | Use `center` class      |
| `p-4` on View         | No padding on containers | `m-4` on children       |
| `w-full`              | Percentage-based         | `w-screen` (Ti.UI.FILL) |
| `rounded-full`        | Needs size suffix        | `rounded-full-12`       |
| `composite` class     | Already default          | Omit it                 |
| `w-[100px]`           | Wrong syntax             | `w-(100px)`             |
| Manual `.tss`         | Overwritten by PurgeTSS  | Use utility classes     |
| `gap` with `%` widths | Total exceeds 100%       | Use explicit margins    |
