# PurgeTSS Examples - WRONG vs CORRECT

Complete examples of common patterns with anti-patterns and correct implementations.

<!-- TOC-START -->
## Contents

- [Community-Discovered Patterns](#community-discovered-patterns)
  - [Titanium Layout Patterns](#titanium-layout-patterns)
  - [Horizontal Row with Space Between](#horizontal-row-with-space-between)
  - [Centered Content (Vertically and Horizontally)](#centered-content-vertically-and-horizontally)
  - [Vertical Stack with Spacing](#vertical-stack-with-spacing)
  - [Header with Left/Right Elements](#header-with-leftright-elements)
  - [Available Layout Classes](#available-layout-classes)
  - [Manual .tss Files Anti-Pattern](#manual-tss-files-anti-pattern)
  - [Grid with Percentages](#grid-with-percentages)
  - [Gap Usage](#gap-usage)
  - [Padding on Container Views](#padding-on-container-views)
  - [`w-full` vs `w-screen`](#w-full-vs-w-screen)
  - [`rounded-full` Is a Fixed 8×8 Circle](#rounded-full-is-a-fixed-88-circle)
  - [Square Brackets for Arbitrary Values](#square-brackets-for-arbitrary-values)
  - [Layout Defaults](#layout-defaults)
  - [ScrollView Without `content-w-screen` / `content-h-auto`](#scrollview-without-content-w-screen--content-h-auto)
  - [`theme.View` (Replace) vs `theme.extend.View` (Merge)](#themeview-replace-vs-themeextendview-merge)
  - [Quick Reference Table](#quick-reference-table)

<!-- TOC-END -->

## Community-Discovered Patterns

The examples below catalog anti-patterns observed in real Titanium + PurgeTSS projects, paired with the correct approach. They are not exhaustive rules from official docs — they reflect pitfalls the community has hit often enough to warrant dedicated guidance.

### Titanium Layout Patterns

> **🚨 NO FLEXBOX IN TITANIUM**
> Titanium does NOT support CSS Flexbox. All examples use `horizontal`, `vertical`, or `composite` layouts.

### Horizontal Row with Space Between

**❌ WRONG (Flexbox classes don't exist):**
```xml
<View class="flex-row justify-between">
  <Label text="Left" />
  <Label text="Right" />
</View>
```

**✅ CORRECT (Composite parent + edge positioning):**
```xml
<!-- Parent defaults to composite; each child is pinned to one edge -->
<View class="w-screen">
  <Label text="Left" class="left-0" />
  <Label text="Right" class="right-0" />
</View>
```

**✅ ALTERNATIVE (Use margins):**
```xml
<!-- In a composite parent, ml-4 emits left: 16 and mr-4 emits right: 16 -->
<View class="w-screen">
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

**✅ CORRECT (Composite layout, no positioning on the child):**
```xml
<!-- Parent defaults to composite, no layout class needed.
     A child with no top/left/bottom/right centers itself. -->
<View class="h-screen w-screen">
  <Label text="Centered" />
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
  <!-- Omitting top/bottom lets each child center vertically in the composite bar -->
  <Label text="Title" class="left-4 font-bold" />
  <Label class="fas fa-bars right-4" />
</View>
```

### Available Layout Classes

| Class           | Description                          | Use Case                       |
| --------------- | ------------------------------------ | ------------------------------ |
| `horizontal`    | Children arranged left to right      | Rows of buttons, form fields   |
| `vertical`      | Children arranged top to bottom      | Stacked content, lists         |
| *(no class)*    | Defaults to `composite`              | Absolute positioning, overlays |
| `grid-flow-col` | Horizontal grid flow with 100% width | Special grid layouts           |
| `grid-flow-row` | Vertical grid flow with 100% height  | Special grid layouts           |

---

### Manual .tss Files Anti-Pattern

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
# Then run (bare command = purge; `purgetss build` only regenerates utilities.tss):
purgetss
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

### Grid with Percentages

**❌ WRONG (Children with % widths, parent without w-screen):**
```xml
<View class="horizontal m-4">
  <View class="w-(48%)">...</View>
  <View class="w-(48%)">...</View>
</View>
<!-- Parent doesn't have w-screen, % calculations may fail -->
```

**✅ CORRECT (Parent has w-screen):**
```xml
<View class="horizontal m-4 w-screen">
  <View class="w-(48%)">...</View>
  <View class="w-(48%)">...</View>
</View>
```

---

### Gap Usage

**❌ WRONG (gap on the column itself: margins add to the % width):**
```xml
<View class="grid">
  <View class="grid-cols-2 gap-4">...</View>  <!-- 50% + 16 left + 16 right -->
  <View class="grid-cols-2 gap-4">...</View>  <!-- 50% + 16 left + 16 right -->
</View>
<!-- Total > 100%, elements wrap or overflow -->
```

**✅ CORRECT (Official grid pattern: gap on an inner View inside each column):**
```xml
<View class="grid">
  <View class="grid-cols-2">
    <View class="gap-4">...</View>
  </View>
  <View class="grid-cols-2">
    <View class="gap-4">...</View>
  </View>
</View>
```

**✅ ALTERNATIVE (Use explicit margins):**
```xml
<View class="horizontal mb-4 w-screen">
  <View class="w-(48%) mr-2">...</View>
  <View class="w-(48%) ml-2">...</View>
</View>
```

---

### Padding on Container Views

**❌ WRONG (Padding on Views doesn't work in Titanium):**
```xml
<View class="p-4">
  <Label text="Hello" />
</View>
```

**✅ CORRECT (Use margins on children instead):**
```xml
<View>
  <Label class="m-4 wh-auto" text="Hello" />
</View>
```

**Why:** Titanium Views don't support padding properties. Use margins on child elements, and add `wh-auto` on `Label`/`Button`/`Switch` (or any `SIZE`-default component) when opposite margins would otherwise trigger Titanium edge pinning.

---

### `w-full` vs `w-screen`

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

### `rounded-full` Is a Fixed 8×8 Circle

**❌ WRONG (`rounded-full` emits `width: 8, height: 8, borderRadius: 4`, which conflicts with `w-12 h-12`; at 48×48 a radius of 4 is not a circle):**
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

### Square Brackets for Arbitrary Values

**❌ WRONG (Square brackets are not supported):**
```xml
<View class="w-[100] bg-[#ff0000]" />
```

**✅ CORRECT (PurgeTSS uses parentheses):**
```xml
<View class="w-(100) bg-(#ff0000)" />
```

**PurgeTSS syntax for arbitrary values uses `()` not `[]`. A unitless value follows `ti.ui.defaultunit`; `w-(100px)` is explicit pixels (it stops the build only on v7.8.0 through v7.17.1).**

> **🚨 v7.8.0+ HARD-FAILS THE BUILD ON SQUARE BRACKETS**
> Since v7.8.0, the build stops with a structured `Class Syntax Error` block (file path + line number + `Fix:` suggestion) the moment it spots `top-[10px]`, `wh-[12]`, or any other square-bracket utility. Pre-v7.8.0, those classes silently dropped into the `// Unused or unsupported classes` block of `app.tss` — easy to miss. Now they're loud and actionable.
>
> v7.10.1 reworded the error message from `'Tailwind-style brackets "[ ]" are not supported'` to `'Square brackets "[ ]" are not supported'`. Same enforcement, less framing.
>
> See [Arbitrary Values → Class syntax pre-validation](arbitrary-values.md#class-syntax-pre-validation) for the full list of patterns the pre-validator catches (4 since v7.18.0: inverted negative sign, square brackets, empty parentheses, and whitespace inside parentheses).

**Examples:**
- `w-(100)` - Custom width
- `bg-(#ff0000)` - Custom background color
- `mt-(20dp)` - Custom margin top
- `text-(#333333)` - Custom text color

---

### Layout Defaults

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

### ScrollView Without `content-w-screen` / `content-h-auto`

**WRONG (ScrollView with children that overflow horizontally or never scroll vertically):**
```xml
<ScrollView class="w-screen h-screen">
  <View class="vertical">
    <Label text="Very long content..." />
    <!-- many items -->
  </View>
</ScrollView>
```

**CORRECT (Explicit content sizing on the ScrollView itself):**
```xml
<ScrollView class="w-screen h-screen content-w-screen content-h-auto">
  <View class="vertical">
    <Label text="Very long content..." />
    <!-- many items -->
  </View>
</ScrollView>
```

**Why:** `content-w-screen` sets `contentWidth: Ti.UI.FILL` so the scroll area matches the viewport horizontally; `content-h-auto` sets `contentHeight: Ti.UI.SIZE` so vertical scroll expands to fit children. Omitting these often produces a ScrollView that never scrolls or clips content unexpectedly.

---

### `theme.View` (Replace) vs `theme.extend.View` (Merge)

**Replace mode (`theme.View`, no `extend`) — the framework default `Ti.UI.SIZE` for View is dropped:**
```javascript
// purgetss/config.cjs
module.exports = {
  theme: {
    View: { apply: 'bg-white' }
  }
}
```

**Extend mode (`theme.extend.View`) — merges with the built-in defaults:**
```javascript
// purgetss/config.cjs
module.exports = {
  theme: {
    extend: {
      View: { apply: 'bg-white' }
    }
  }
}
```

**Why:** `Window`, `View`, and `ImageView` have built-in defaults (white Window background, `Ti.UI.SIZE` on View, iOS `hires: true` on ImageView). Under `theme.extend` your customization merges with them; at the top level of `theme` your config replaces them. The `DEFAULT` / `default` wrapper is not deprecated: `View: { apply: '...' }` and `View: { default: { apply: '...' } }` produce the same TSS, and the explicit wrapper is how you add `ios:` / `android:` blocks next to it.

---

### Quick Reference Table

| Anti-Pattern                          | Why It Fails                         | Correct Approach                             |
| ------------------------------------- | ------------------------------------ | -------------------------------------------- |
| `flex-row`                            | Flexbox not supported                | `horizontal`                                 |
| `flex-col`                            | Flexbox not supported                | `vertical`                                   |
| `justify-*`                           | Flexbox not supported                | Use margins/positioning                      |
| `items-center`                        | Exists but maps to fill, not centering — avoid for centering | Use layout + positioning         |
| `p-4` on View                         | No padding on containers             | `m-4` on children                            |
| `w-full`                              | Percentage-based                     | `w-screen` (Ti.UI.FILL)                      |
| `rounded-full` with `w-*`/`h-*`       | Fixed 8×8 circle, conflicts on size  | `rounded-full-12`                            |
| `composite` class                     | Already default                      | Omit it                                      |
| `w-[100]`                             | Stops the build (v7.8.0+)            | `w-(100)`                                    |
| Manual `.tss`                         | Duplicates classes; its rules override `app.tss` | Use utility classes (`app.tss` itself is rewritten on every run) |
| `gap` on a `%`-width column           | Total exceeds 100%                   | `gap-*` on an inner View, or explicit margins |
| ScrollView without `content-*` sizing | No/unexpected scroll                 | Add `content-w-screen` + `content-h-auto`    |
| `theme.View` to tweak one default     | Replaces all View defaults           | `theme.extend.View`                          |
