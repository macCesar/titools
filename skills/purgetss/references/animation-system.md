# Animation System

## Introduction

PurgeTSS includes an Animation module to apply simple 2D Matrix animations and transformations to any element, an array of elements, or individual children of an element.

The Animation object describes an animation in a few ways:

- A single-phase animation with an end state.
- A multi-phase animation using the `open`, `close`, and `complete` modifiers.
- Global states for children of a View using the `children` modifier.

When you call `play` on a view, it animates from its current state to the state described by the `Animation` object. You can animate position, size, colors, transformation matrix, and opacity. Timing is controlled with classes like `duration-*` and `delay-*`.

## Available Methods

- `play`, `toggle`: Animate an element, an array of elements, or individual children using the `Animation` object.
- `open`, `close`: Explicitly run opening and closing animations.
- `apply`: Apply properties instantly without animation.
- `draggable`: Convert a View or array of Views into draggable elements.

All methods except `draggable` accept an optional callback. The callback receives an enriched event object.

## Available Modifiers

- `open:`, `close:`, `complete:`: Set different properties for each state.
- `children:`: Set global properties for all children of a View.
- `child:`: Set individual properties for each child of a View.
- `bounds:`: Set boundaries within which the View can move inside its parent.
- `drag:`, `drop:`: Set different properties when dragging or dropping elements.

## Timing and Special Classes

- `delay-*`: Delay before the animation starts.
- `duration-*`: Duration of the animation.
- `rotate-*`: Rotation of the element.
- `scale-*`: Scaling of the element.
- `repeat-*`: Number of repeats.
- `zoom-in-*`, `zoom-out-*`: Zoom in or out.
- `drag-apply`, `drag-animate`: Apply properties instantly or animate them while dragging.
- `ease-in`, `ease-out`, `ease-linear`, `ease-in-out`: Animation curve.
- `vertical-constraint`, `horizontal-constraint`: Constrain dragging to one axis.

## Utility Functions

The module also exports two helper functions:

- `deviceInfo()`: Logs detailed platform and display information to the console. Works in both Alloy and Classic Titanium projects.
- `saveComponent({ source, directory })`: Saves a snapshot of a view as a PNG to the photo gallery.

## Installation

Use the `purgetss module` command to install the module in the `lib` folder.

```bash
purgetss module

# alias:
purgetss m
```

## Usage

This is the simplest Animation object with a set of PurgeTSS classes:

```xml
<Animation id="myAnimation" module="purgetss.ui" class="a-set-of-purgetss-classes-and-modifiers" />
```

You can use position, size, color, transformation, and opacity classes from `utilities.tss`.

## The `play` Method

The `play` method runs the animation for a single view or an array of views. You can also chain multiple Animation objects with callbacks to build sequences.

```javascript
$.myAnimation.play($.myView)
```

### Play Example 1

```xml
<Alloy>
  <Window>
    <Animation module="purgetss.ui" id="myAnimation" class="wh-32 bg-green-500 duration-1000" />

    <View id="square" class="wh-16 bg-blue-500" />
  </Window>
</Alloy>
```

```javascript
$.index.open()

$.myAnimation.play($.square)
```

When `play` runs, the blue square goes from `64x64` to `128x128` and changes to green.

### `open` and `close` Modifiers

Use `open` and `close` to define different states, such as opening and closing behaviors.

```xml
<Animation id="changeColor" class="close:bg-blue-700 open:bg-purple-500" module="purgetss.ui" />
```

### `complete` Modifier

Use `complete` to apply additional properties after an `open` animation finishes.

```xml
<Animation module="purgetss.ui" id="myAnimationOpen" class="open:scale-1 complete:bg-(#008800) complete:scale-100" />
```

### Callback Event Object

When you pass a callback to `play`, `toggle`, `open`, or `close`, it receives an enriched event object instead of the raw native event:

```javascript
$.myAnimation.play($.myView, (e) => {
  console.log(e.action)   // 'play'
  console.log(e.state)    // 'open' or 'close'
  console.log(e.id)       // Animation object ID
  console.log(e.targetId) // ID of the animated view
})
```

#### Event Object Properties

| Property       | Type       | Description                                   |
| -------------- | ---------- | --------------------------------------------- |
| `type`         | `String`   | Event type (`'complete'`)                     |
| `bubbles`      | `Boolean`  | Whether the event bubbles                     |
| `cancelBubble` | `Boolean`  | Whether bubbling is cancelled                 |
| `action`       | `String`   | `'play'` or `'apply'`                         |
| `state`        | `String`   | `'open'` or `'close'`                         |
| `id`           | `String`   | ID of the Animation object                    |
| `targetId`     | `String`   | ID of the animated view                       |
| `index`        | `Number`   | Position of the view in the array (`0`-based) |
| `total`        | `Number`   | Total number of views in the array            |
| `getTarget()`  | `Function` | Returns the animated view object              |

When you pass an array to `play`, the callback is called once per view. Use `index` and `total` to track progress.

## The `apply` Method

Use `apply` when you want to set properties immediately without animation.

```javascript
$.myAnimation.apply($.myView)
```

### Apply Example

`apply` sets properties instantly. In this example, the `ScrollableView` is rotated `90` degrees and its content is counter-rotated `-90` degrees to mimic a TikTok-style layout.

```xml
<Alloy>
  <Window class="exit-on-close-false keep-screen-on">
    <Animation module="purgetss.ui" id="rotate" class="platform-wh-inverted rotate-90" />
    <Animation module="purgetss.ui" id="counterRotate" class="platform-wh -rotate-90" />

    <ScrollableView id="scrollableView" class="overlay-enabled disable-bounce paging-control-alpha-100 scrolling-enabled show-paging-control paging-control-h-14 paging-control-on-top-false paging-control-transparent page-indicator-(rgba(0,0,0,0.24)) current-page-indicator-(rgba(0,0,0,1))">
      <View class="bg-blue-500">
        <Label class="text-center" text="View's Content" />
      </View>

      <View class="bg-red-500">
        <Label class="text-center" text="View's Content" />
      </View>

      <View class="bg-green-500">
        <Label class="text-center" text="View's Content" />
      </View>
    </ScrollableView>
  </Window>
</Alloy>
```

```javascript
$.rotate.apply($.scrollableView)
$.counterRotate.apply($.scrollableView.views)
$.index.open()
```

`apply` also accepts the same enriched callback event object as `play`, with `action` set to `'apply'`.

## The `open` and `close` Methods

Use `open` and `close` to run opening and closing animations based on the `open:` and `close:` modifiers. They do not toggle based on current view state, so you get explicit control.

### `open`

```javascript
$.myAnimation.open($.myView, (e) => {
  console.log(e.state)    // 'open'
  console.log(e.targetId) // ID of the animated view
})
```

Example:

```xml
<Animation module="purgetss.ui" id="myAnimation" class="close:opacity-0 open:opacity-100" />
<View id="myView" class="opacity-0" />
```

### `close`

```javascript
$.myAnimation.close($.myView, (e) => {
  console.log(e.state)    // 'close'
  console.log(e.targetId) // ID of the animated view
})
```

Example:

```xml
<Animation module="purgetss.ui" id="myAnimation" class="close:opacity-0 open:opacity-100" />
<View id="myView" class="opacity-100" />
```

## The `draggable` Method

The `draggable` method converts a view or an array of views into draggable elements.

- Use `drag:` and `drop:` modifiers for basic drag/drop animations.
- Use `drag-apply` or `drag-animate` to apply properties instantly or animate them while dragging.
- Use `horizontal-constraint` or `vertical-constraint` to constrain movement.

```javascript
$.draggableAnimation.draggable([$.red, $.green, $.blue])
```

:::info
You can create a blank Animation object or reuse an existing one to call `draggable` on a view or array of views.

When you use an Animation object with an array of views, it manages `zIndex` for each draggable element.
:::

### Drag and Drop Modifiers

- `drag:` and `drop:` set basic animations while dragging and dropping.
- Global modifiers can be defined on the Animation object.
- Local modifiers on a view override global modifiers.

While dragging, PurgeTSS does not apply `size`, `scale`, or `anchorPoint` transformations.

### `draggingType`

Use `drag-animate` (default) or `drag-apply` to control how `drag:` and `drop:` modifiers are applied.

```tss
'.drag-apply': { draggingType: 'apply' }
'.drag-animate': { draggingType: 'animate' }
```

### `bounds`

Use `bounds:` with optional local or global values to limit movement within a parent view.

Examples:

- Local bounds on the draggable view:

```xml
<View id="card" class="bounds:m-2 bounds:mb-16 mt-8 h-24 w-64 shadow-lg" />
```

- Global bounds on the Animation object:

```xml
<Animation id="draggableAnimation" module="purgetss.ui" class="bounds:m-2 bounds:mb-16" />
```

### Constraints

Add `vertical-constraint` or `horizontal-constraint` to restrict movement while dragging.

```tss
'.horizontal-constraint': { constraint: 'horizontal' }
'.vertical-constraint': { constraint: 'vertical' }
```

## Complex UI Elements

The official docs include a larger example that combines:

- A draggable card.
- A collapsible sidebar.
- Chevron rotations.
- Grid utilities for menu rows.
- Font Awesome icons.

Before running that example, install Font Awesome:

```bash
purgetss icon-library -v=fa
```

Then wire the handlers with `play()` for the expanding/collapsing elements and `draggable()` for the card.

## Available Utilities

Along with regular utilities like colors, widths, and heights, the animation module adds these animation-specific utilities.

### `anchorPoint`

Controls the pivot point of the animation.

Examples:

```tss
'.origin-center': { anchorPoint: { x: 0.5, y: 0.5 } }
'.origin-top-left': { anchorPoint: { x: 0, y: 0 } }
'.anchor-point-bottom-right': { anchorPoint: { x: 1, y: 1 } }
```

### `autoreverse`

Specifies whether the animation should replay in reverse after completion.

```tss
'.autoreverse': { autoreverse: true }
'.autoreverse-false': { autoreverse: false }
```

### `curve`

Sets the animation curve.

```tss
'.curve-animation-ease-in': { curve: Ti.UI.ANIMATION_CURVE_EASE_IN }
'.curve-animation-ease-in-out': { curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT }
'.curve-animation-ease-out': { curve: Ti.UI.ANIMATION_CURVE_EASE_OUT }
'.curve-animation-linear': { curve: Ti.UI.ANIMATION_CURVE_LINEAR }
```

### `delay`, `duration`, `repeat`

Timing utilities are available in numeric scales such as `delay-100`, `duration-300`, or `repeat-3`.

### `rotate`

Rotation utilities include positive and negative values such as:

```tss
'.rotate-45': { rotate: 45 }
'.rotate-90': { rotate: 90 }
'.-rotate-90': { rotate: -90 }
```

### `scale`

Scale utilities include values such as:

```tss
'.scale-50': { scale: 0.5 }
'.scale-95': { scale: 0.95 }
'.scale-100': { scale: 1 }
'.scale-125': { scale: 1.25 }
```

### `drag-apply`, `drag-animate`

```tss
'.drag-apply': { draggingType: 'apply' }
'.drag-animate': { draggingType: 'animate' }
```

### `opacity-to-*`, `toggle-visible`

Helpers to automatically animate opacity and toggle visibility.

```tss
'.opacity-to-0': { opacity: 1, animationProperties: { open: { opacity: 0 }, close: { opacity: 1 } } }
'.opacity-to-100': { opacity: 0, animationProperties: { open: { opacity: 1 }, close: { opacity: 0 } } }
'.toggle-visible': { animationProperties: { open: { visible: true }, close: { visible: false } } }
```

### `zoom-in-*`, `zoom-out-*`

Zoom utilities animate scale in `open` or `close` states and then reset to `1` on `complete`.

Representative examples:

```tss
'.zoom-in-50': { animationProperties: { open: { scale: 0.5 }, complete: { scale: 1 } } }
'.zoom-in-95': { animationProperties: { open: { scale: 0.95 }, complete: { scale: 1 } } }
'.zoom-out-50': { animationProperties: { close: { scale: 0.5 }, complete: { scale: 1 } } }
'.zoom-out-95': { animationProperties: { close: { scale: 0.95 }, complete: { scale: 1 } } }
```

:::warning Titanium Layout Reminder
The Animation module animates Titanium views, not DOM nodes. Keep Titanium layout constraints in mind when animating size or position, and prefer `w-screen` when you need fill behavior.
:::
