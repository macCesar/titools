# Titanium Element Resets

PurgeTSS automatically resets certain Titanium elements to facilitate UI layout. Understanding these resets is critical for effective PurgeTSS usage.

## Table of Contents

- [Titanium Element Resets](#titanium-element-resets)
  - [Table of Contents](#table-of-contents)
  - [The Three Default Resets](#the-three-default-resets)
  - [View Reset: `Ti.UI.SIZE`](#view-reset-tiuisize)
    - [What `Ti.UI.SIZE` Means](#what-tiuisize-means)
    - [Practical Examples](#practical-examples)
    - [View in Different Layouts](#view-in-different-layouts)
  - [ImageView Reset: iOS Hi-Res](#imageview-reset-ios-hi-res)
  - [Window Reset: White Background](#window-reset-white-background)
  - [Width/Height Inheritance](#widthheight-inheritance)
    - [Shared Spacing Scale](#shared-spacing-scale)
    - [Combined Utilities (`wh-`)](#combined-utilities-wh-)
    - [Color Inheritance](#color-inheritance)
  - [Common Pitfalls](#common-pitfalls)
    - [1. Assuming View fills parent](#1-assuming-view-fills-parent)
    - [2. Padding on View/Window](#2-padding-on-viewwindow)
    - [3. Not using w-screen for percentage calculations](#3-not-using-w-screen-for-percentage-calculations)
    - [4. Confusion about h-screen](#4-confusion-about-h-screen)
  - [Reset Behavior in Generated app.tss](#reset-behavior-in-generated-apptss)
  - [Overriding Resets](#overriding-resets)
  - [Summary Table](#summary-table)

---

## The Three Default Resets

```tss
// Ti Elements
// Property: View
// Description: An empty drawing surface or container
'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }

// Property: ImageView
// Description: A view to display a single image or series of animated images.
'ImageView[platform=ios]': { hires: true }

// Property: Window
// Description: The Window is an empty drawing surface or container.
'Window': { backgroundColor: '#FFFFFF' }
```

## View Reset: `Ti.UI.SIZE`

The most important reset is for the `View` element. By default, `View` is set to `Ti.UI.SIZE` for both width and height.

### What `Ti.UI.SIZE` Means

`Ti.UI.SIZE` means the element will:
- Occupy **ONLY the space needed for its content**
- Grow to accommodate explicit dimensions (`w-64`, `h-32`, etc.)
- Expand to fill margins (`m-4`, `mx-2`, `mt-6 mb-4`, etc.)

:::tip EXPLICIT SIZE VS NATIVE UNDEFINED
In Titanium, most elements like `Label` and `Button` default to `SIZE` behavior, but their property values are `undefined`. 

According to the **UI Composite Layout Behavior Spec**, if a dimension is `undefined` and you apply two opposite pins (e.g., `left` and `right` via `m-xx`), the motor will **compute the dimension based on the pins**, causing the element to stretch.

**PurgeTSS** recommends using the `wh-auto` class (which sets explicit `Ti.UI.SIZE` for both width and height) to override this pinning effect and ensure the element only occupies the space needed for its content regardless of margins.
:::

### Practical Examples

```xml
<!-- View without any classes = SIZE of its content -->
<View>
  <Label text="Hello" />
</View>
<!-- Result: View wraps the label tightly -->

<!-- View with explicit dimensions -->
<View class="h-32 w-64 bg-white">
  <Label text="Hello" />
</View>
<!-- Result: View is exactly 256px wide x 128px tall, label inside -->

<!-- View with margins (expands to include margins) -->
<View class="m-4 bg-blue-500">
  <Label text="Hello" />
</View>
<!-- Result: View is 16px larger on all sides (content + 16px margins) -->

<!-- View with w-screen (fills parent) -->
<View class="h-16 w-screen bg-red-500">
  <Label text="Full width banner" />
</View>
<!-- Result: View fills parent's width, 64px tall -->
```

### View in Different Layouts

**In `vertical` layout:**
```xml
<View class="vertical">
  <View class="bg-blue-500">
    <!-- This View will be SIZE of its content -->
  </View>
  <View class="h-20 w-screen bg-red-500">
    <!-- This View fills width, fixed height -->
  </View>
</View>
```

**In `horizontal` layout:**
```xml
<View class="horizontal">
  <View class="bg-blue-500">
    <!-- SIZE of content, may be very small -->
  </View>
  <View class="h-32 w-32 bg-red-500">
    <!-- Fixed 128x128 -->
  </View>
</View>
```

**In `composite` layout (default):**
```xml
<View>
  <!-- No layout class = composite = default -->
  <View class="left-10 top-20 h-32 w-64 bg-blue-500">
    <!-- Positioning works, can overlap other Views -->
  </View>
</View>
```

## ImageView Reset: iOS Hi-Res

On iOS, `ImageView` automatically gets `hires: true` for high-resolution image display.

```tss
'ImageView[platform=ios]': { hires: true }
```

:::info
This ensures images look crisp on Retina displays without manual configuration.
:::

## Window Reset: White Background

Every `Window` gets a white background by default:

```tss
'Window': { backgroundColor: '#FFFFFF' }
```

You can override this with classes:

```xml
<!-- Custom background color -->
<Window class="bg-gray-900">
  <!-- Dark themed window -->
</Window>

<!-- Gradient background -->
<Window class="from-(#4C61E4) to-(#804C61E4)">
  <!-- Gradient window -->
</Window>

<!-- Transparent background -->
<Window class="bg-transparent">
  <!-- For overlays/modals -->
</Window>
```

## Width/Height Inheritance

These resets affect how width and height properties work throughout your app.

### Shared Spacing Scale

The `spacing` section in `config.cjs` is shared by multiple properties:

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

This automatically generates:
- **Margin**: `m-sm`, `m-md`, `m-lg`, `m-xl`
- **Padding**: `p-sm`, `p-md`, `p-lg`, `p-xl`
- **Width**: `w-sm`, `w-md`, `w-lg`, `w-xl`
- **Height**: `h-sm`, `h-md`, `h-lg`, `h-xl`
- **Gap**: `gap-sm`, `gap-md`, `gap-lg`, `gap-xl`

### Combined Utilities (`wh-`)

PurgeTSS provides `wh-` shortcuts to set both width and height simultaneously. This is more than just a convenience; it ensures consistent dimension resets for components.

| Class        | Titanium Value                          | Purpose                                               |
| ------------ | --------------------------------------- | ----------------------------------------------------- |
| `.wh-auto`   | `width: Ti.UI.SIZE, height: Ti.UI.SIZE` | Explicitly force size-to-content. **The Safe Reset.** |
| `.wh-screen` | `width: Ti.UI.FILL, height: Ti.UI.FILL` | Fill all available parent space.                      |
| `.wh-full`   | `width: '100%', height: '100%'`         | Relative 100% sizing.                                 |

**The `wh-` Scale:**
- **Numeric**: `wh-0` (0px) up to `wh-96` (384px) following the spacing scale.
- **Fractions**: `wh-1/2` (50%), `wh-1/3` (33%), up to `wh-11/12` (91%).

:::tip
Always prefer `wh-screen` (FILL) over `wh-full` (100%) for better native performance in Titanium, unless you specifically need percentage-based calculations against a parent's dimension.
:::

### Color Inheritance

All color properties inherit from `theme.colors`:

```javascript
theme: {
  colors: {
    brand: '#007AFF',
  }
}
```

This generates classes for ALL color properties:
- `bg-brand` (backgroundColor)
- `text-brand` (color/textColor)
- `border-brand` (borderColor)
- `tint-brand` (tint)
- And 50+ more color properties

## Common Pitfalls

### 1. Assuming View fills parent

```xml
<!-- WRONG: Assumes View fills available space -->
<View class="bg-blue-500">
  <!-- On most devices, this will be tiny or invisible -->
</View>

<!-- CORRECT: Explicitly set dimensions -->
<View class="h-64 w-screen bg-blue-500">
  <!-- Fills parent width, 256px tall -->
</View>
```

### 2. Padding on View/Window

```xml
<!-- WRONG: Padding on base elements -->
<View class="bg-white p-4">
  <Label text="Content" />
</View>

<!-- CORRECT: Margin on children -->
<View class="bg-white">
  <Label class="m-4" text="Content" />
</View>
```

:::caution
Do not use `p-` on `View`, `Window`, or `Label`. Use margins on children instead.
:::

### 3. Not using w-screen for percentage calculations

```xml
<!-- WRONG: % widths without w-screen on parent -->
<View class="horizontal m-4">
  <View class="w-(50%)">...</view>  <!-- 50% of what? -->
  <View class="w-(50%)">...</view>
</View>

<!-- CORRECT: Parent has w-screen -->
<View class="horizontal m-4 w-screen">
  <View class="w-(50%)">...</view>  <!-- 50% of parent -->
  <View class="w-(50%)">...</view>
</View>
```

### 4. Confusion about h-screen

```xml
<!-- In a ScrollView with vertical layout -->
<ScrollView class="vertical h-screen">
  <!-- h-screen = FILL = grows to available space -->
  <View class="w-screen">
    <!-- Content here -->
  </View>
</ScrollView>
```

`h-screen` in PurgeTSS = `Ti.UI.FILL`, which means "fill available space" not "device screen height".

## Reset Behavior in Generated app.tss

When PurgeTSS generates your `app.tss`, these resets appear first:

```tss
/* PurgeTSS v7.2.7 */
/* Created by César Estrada */
/* https://purgetss.com */

// Ti Elements
'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }
'ImageView[platform=ios]': { hires: true }
'Window': { backgroundColor: '#FFFFFF' }

/* Main Styles */
'.bg-white': { backgroundColor: '#ffffff' }
'.h-screen': { height: Ti.UI.FILL }
'.w-screen': { width: Ti.UI.FILL }
// ... your custom classes
```

These are **always included** - they're fundamental to how PurgeTSS works.

## Overriding Resets

If you need different default behavior, add custom rules to `_app.tss` or `config.cjs`:

**In `_app.tss`:**
```tss
// Override View default
'View': {
  width: Ti.UI.FILL,  // Default to fill width
  height: Ti.UI.SIZE  // But size to content vertically
}
```

**In `config.cjs` (preferred):**
```javascript
module.exports = {
  theme: {
    View: {
      DEFAULT: {
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE
      }
    }
  }
}
```

:::tip
Prefer `config.cjs` for custom defaults because they're preserved when PurgeTSS regenerates `app.tss`.
:::

## Summary Table

| Element                   | Reset Property  | Reset Value  | Impact                                |
| ------------------------- | --------------- | ------------ | ------------------------------------- |
| `View`                    | width/height    | `Ti.UI.SIZE` | Occupies only content size by default |
| `ImageView[platform=ios]` | hires           | `true`       | High-res images on Retina displays    |
| `Window`                  | backgroundColor | `'#FFFFFF'`  | White background by default           |

Understanding these resets is essential for predictable layouts in PurgeTSS.
