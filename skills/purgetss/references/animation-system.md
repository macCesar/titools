# PurgeTSS Animation System

<!-- TOC-START -->
## Contents

- [Introduction](#introduction)
- [Methods Reference (All 15)](#methods-reference-all-15)
- [Modifiers](#modifiers)
- [The `play` Method](#the-play-method)
- [Callback Event Object](#callback-event-object)
- [The `apply` Method](#the-apply-method)
- [The `open` and `close` Methods](#the-open-and-close-methods)
- [The `draggable` Method](#the-draggable-method)
- [The `undraggable` Method](#the-undraggable-method)
- [The `detectCollisions` Method](#the-detectcollisions-method)
- [The `sequence` Method](#the-sequence-method)
- [The `swap` Method](#the-swap-method)
- [The `pulse` Method](#the-pulse-method)
- [The `shake` Method](#the-shake-method)
- [The `snapTo` Method](#the-snapto-method)
- [The `reorder` Method](#the-reorder-method)
- [The `transition` Method](#the-transition-method)

<!-- TOC-END -->

## Introduction

PurgeTSS includes an Animation module for 2D Matrix animations and transformations. It works on single elements, arrays of elements, or individual children of an element.

The Animation object describes an animation in a few ways:
- A single-phase animation with an end state
- A multi-phase animation using the `open`, `close`, and `complete` modifiers
- Global states for children of a View using the `children` modifier

When you call `play` on a View, it animates from its current state to the state described by the Animation object. You can animate position, size, colors, transformation matrix, and opacity. Control timing with classes like `duration-*` and `delay-*`.

### Installation

```bash
purgetss module
# alias:
purgetss m
```

### Usage

```xml
<Animation id="myAnimation" module="purgetss.ui" class="a-set-of-purgetss-classes-and-modifiers" />
```

You can use any position, size, color, transformation, and opacity classes from `utilities.tss`.

---

## Methods Reference (All 15)

| Method | Signature | Description |
| --- | --- | --- |
| `play` | `play(views, cb)` | Animate views to Animation object state; toggles open/close on repeated calls |
| `toggle` | `toggle(views, cb)` | Alias for `play`; toggles between open and close states |
| `apply` | `apply(views, cb)` | Apply properties instantly without animation |
| `open` | `open(views, cb)` | Explicitly run the opening animation (no toggle) |
| `close` | `close(views, cb)` | Explicitly run the closing animation (no toggle) |
| `draggable` | `draggable(views)` | Make views draggable via touch events |
| `undraggable` | `undraggable(views)` | Remove draggable behavior and clean up all listeners |
| `detectCollisions` | `detectCollisions(views, dragCB, dropCB)` | Enable collision detection with hover/drop callbacks |
| `sequence` | `sequence(views, cb)` | Animate views one after another (sequential, not parallel) |
| `swap` | `swap(view1, view2)` | Animate two views exchanging positions |
| `pulse` | `pulse(view, count)` | Scale-up-and-back animation (default count=1) |
| `shake` | `shake(view, intensity)` | Horizontal shake for feedback (default intensity=10) |
| `snapTo` | `snapTo(view, targets)` | Snap view to nearest target by center distance; returns matched target or null |
| `reorder` | `reorder(views, newOrder)` | Animate views to new positions by index mapping |
| `transition` | `transition(views, layouts)` | Multi-view layout transitions using Matrix2D (translate, rotate, scale) |

The `play`, `toggle`, `open`, `close`, `apply`, and `sequence` methods accept an optional callback with an enriched event object.

---

## Modifiers

| Modifier | Purpose |
| --- | --- |
| `open:` | Properties applied during open state |
| `close:` | Properties applied during close state |
| `complete:` | Additional properties applied after an open animation finishes |
| `children:` | Global properties for all children of a View |
| `child:` | Individual properties for specific children |
| `bounds:` | Drag boundaries within parent |
| `drag:` | Properties applied while dragging |
| `drop:` | Properties applied on drop |

### Timing and Special Classes

`delay-*`, `duration-*`, `rotate-*`, `scale-*`, `repeat-*`, `zoom-in-*`, `zoom-out-*`, `drag-apply`, `drag-animate`, `ease-in`, `ease-out`, `ease-linear`, `ease-in-out`, `vertical-constraint`, `horizontal-constraint`.

---

## The `play` Method

Runs the animation for a single view or an array of views. Toggles between open and close states on repeated calls.

```javascript
$.myAnimation.play($.myView)
```

### Basic Example

```xml
<Animation module="purgetss.ui" id="myAnimation" class="wh-32 bg-green-500 duration-1000" />
<View id="square" class="wh-16 bg-blue-500" />
```

```javascript
$.myAnimation.play($.square)
// Blue square animates from 64x64 to 128x128 and changes to green
```

### open/close Modifiers

Define different states for opening and closing:

```xml
<Animation id="changeColor" module="purgetss.ui" class="close:bg-blue-700 open:bg-purple-500" />
```

First call applies `open:` properties; next call applies `close:` properties; continues toggling.

### `complete` Modifier

Applies additional properties after an `open` animation finishes:

```xml
<Animation module="purgetss.ui" id="myAnimationOpen"
  class="open:scale-1 complete:bg-(#008800) complete:scale-100" />
```

View scales to `scale-1` (open), then on completion receives `bg-(#008800)` and `scale-100`.

### Animating Arrays

Pass an array or `.children` to animate all views:

```javascript
$.myAnimation.play($.squaresView.children)
$.myAnimation.play([$.view1, $.view2, $.view3])
```

The callback fires once per view. Use `e.index` and `e.total` to track progress.

---

## Callback Event Object

All methods that accept a callback (`play`, `toggle`, `open`, `close`, `apply`, `sequence`) receive an enriched event object:

```javascript
$.myAnimation.play($.myView, (e) => {
  console.log(e.action)    // 'play'
  console.log(e.state)     // 'open' or 'close'
  console.log(e.id)        // Animation object ID
  console.log(e.targetId)  // ID of the animated view
})
```

### Event Object Properties

| Property | Type | Description |
| --- | --- | --- |
| `type` | `String` | `'complete'` (for play/open/close) or `'applied'` (for apply) |
| `bubbles` | `Boolean` | Whether the event bubbles |
| `cancelBubble` | `Boolean` | Whether bubbling is cancelled |
| `action` | `String` | `'play'` or `'apply'` |
| `state` | `String` | `'open'` or `'close'` |
| `id` | `String` | ID of the Animation object |
| `targetId` | `String` | ID of the animated view |
| `index` | `Number` | Position of the view in the array (0-based) |
| `total` | `Number` | Total number of views in the array |
| `getTarget()` | `Function` | Returns the animated view object |

### Tracking Array Progress

```javascript
$.myAnimation.play([$.card1, $.card2, $.card3], (e) => {
  console.log(`Animated ${e.index + 1} of ${e.total}`)
  if (e.index === e.total - 1) console.log('All animations complete')
})
```

Use `getTarget()` to reference the specific view that just finished:

```javascript
$.myAnimation.play([$.card1, $.card2, $.card3], (e) => {
  e.getTarget().borderColor = 'green'
})
```

---

## The `apply` Method

Applies properties instantly without animation. Callback has `action='apply'` and `type='applied'`.

```javascript
$.myAnimation.apply($.myView)

$.myAnimation.apply($.myView, (e) => {
  console.log(e.action)    // 'apply'
  console.log(e.state)     // 'open' or 'close'
})
```

### TikTok-Style Rotation Example

```xml
<Animation module="purgetss.ui" id="rotate" class="platform-wh-inverted rotate-90" />
<Animation module="purgetss.ui" id="counterRotate" class="platform-wh -rotate-90" />
<ScrollableView id="scrollableView" class="overlay-enabled disable-bounce">
  <View class="bg-blue-500"><Label text="Page 1" /></View>
  <View class="bg-red-500"><Label text="Page 2" /></View>
</ScrollableView>
```

```javascript
$.rotate.apply($.scrollableView)
$.counterRotate.apply($.scrollableView.views)
$.index.open()
```

---

## The `open` and `close` Methods

Run opening and closing animations explicitly. They do not toggle -- you get direct control.

```javascript
$.myAnimation.open(views, callback)
$.myAnimation.close(views, callback)
```

`open` uses properties under the `open:` modifier; `close` uses `close:` modifier. The callback receives the same enriched event object as `play`.

### Panel with Zoom-In Effect

```xml
<View id="panel" class="hidden opacity-0" onClick="onOverlayTap">
  <View class="h-screen w-screen bg-(#80000000)" />
  <View id="content" class="zoom-in-110 close:duration-0 open:duration-100 mx-6 rounded-xl bg-slate-800" />
</View>
<Animation id="panelAnim" module="purgetss.ui" class="opacity-to-100 duration-75 ease-out" />
```

```javascript
function showPanel() {
  $.panel.show()
  $.panelAnim.open($.panel)
}

function closePanel() {
  $.panelAnim.close($.panel, () => { $.panel.hide() })
}
```

Key classes: `zoom-in-110` (pop effect), `opacity-to-100` (fade overlay), `close:duration-0 open:duration-100` (instant close, animated open).

---

## The `draggable` Method

Makes one or more views draggable.

```javascript
$.draggableAnimation.draggable([$.red, $.green, $.blue])
```

A blank or existing Animation object can be reused. When used with an array, zIndex is managed automatically.

### `drag:` and `drop:` Modifiers

- **Global modifiers** on the Animation object apply to all views
- **Local modifiers** on individual views override globals
- While dragging, `size`, `scale`, and `anchorPoint` transformations are **not** applied

```xml
<Animation id="draggableAnimation" module="purgetss.ui" class="drag:duration-100 drag:opacity-50 drop:opacity-100" />
<Label id="green" class="drag:bg-green-800 drop:bg-green-500 ml-10 h-32 w-32 rounded-lg bg-green-500" />
```

### `draggingType` Property

| Class | Behavior |
| --- | --- |
| `drag-animate` | Animate properties (default) |
| `drag-apply` | Apply properties instantly |

### `bounds:` Modifier

Limits movement within the parent. Local on the view or global on the Animation object (local overrides global):

```xml
<View id="card" class="bounds:m-2 bounds:mb-16 mt-8 h-24 w-64" />
<Animation id="dragAnim" module="purgetss.ui" class="bounds:m-2 bounds:mb-16" />
```

### Constraints

| Class | Effect |
| --- | --- |
| `horizontal-constraint` | Horizontal movement only |
| `vertical-constraint` | Vertical movement only |

---

## The `undraggable` Method

Removes draggable behavior and cleans up all listeners from one or more views.

```javascript
$.draggableAnimation.undraggable($.card)
$.draggableAnimation.undraggable([$.card1, $.card2, $.card3])
```

Removes: `touchstart`/`touchend`/`touchmove` listeners, `Ti.Gesture.orientationchange` listener, collision detection registry entries, and internal properties (`_originTop`, `_originLeft`, `_visualTop`, `_visualLeft`, `_collisionEnabled`, `_dragListeners`, `_wasDragged`, `_bouncingBack`).

**Use cases:** Lock a piece after correct placement, toggle edit/presentation mode, cleanup on window close (prevents memory leaks from global `orientationchange` listener).

```javascript
function onClose() {
  $.anim.undraggable(allDraggableViews)
}
```

---

## The `detectCollisions` Method

After calling `draggable()`, enable collision detection based on center-point hit testing.

```javascript
$.myAnimation.draggable(views)
$.myAnimation.detectCollisions(views, dragCB, dropCB)
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `views` | `View/Array` | Views to register for collision detection |
| `dragCB` | `Function(source, target)` | Called during drag; `target` is the view under the drag center, or `null` when leaving |
| `dropCB` | `Function(source, target)` | Called on drop when a collision target is found |

### Snap Classes

Off by default -- opt-in via classes on the `<Animation>` object:

| Class | Behavior |
| --- | --- |
| `snap-back` | View returns to origin when dropped **outside** any target |
| `snap-center` | View auto-centers on target when dropped **on** it (uses `snapTo` internally) |

```xml
<Animation id="myAnim" module="purgetss.ui" class="snap-back snap-center duration-200" />
```

### Example

```javascript
const views = [$.dropZone, $.card]
$.myAnimation.draggable(views)
$.myAnimation.detectCollisions(views,
  (source, target) => {
    if (target) {
      target.borderColor = 'green'
    } else {
      $.dropZone.borderColor = '#9ca3af'
    }
  },
  (source, target) => {
    console.log(`Dropped ${source.id} onto ${target.id}`)
  }
)
```

### Drag-to-Swap Grid

Combining `draggable` + `detectCollisions` + `swap`:

```javascript
const cards = [$.c0, $.c1, $.c2, $.c3]
$.gridAnim.draggable(cards)

let lastTarget = null
$.gridAnim.detectCollisions(cards,
  (source, target) => {
    if (lastTarget && lastTarget !== target) lastTarget.applyProperties({ opacity: 1 })
    if (target) target.applyProperties({ opacity: 0.6 })
    lastTarget = target
  },
  (source, target) => {
    if (target) {
      target.applyProperties({ opacity: 1 })
      $.gridAnim.swap(source, target)
    }
    lastTarget = null
  }
)
```

---

## The `sequence` Method

Animates views one after another. Unlike `play(array)` which runs in parallel, `sequence` waits for each view to complete before starting the next.

```javascript
$.myAnimation.sequence(views, callback)
```

- The `open`/`close` state is toggled once for the entire sequence
- Each view fully completes before the next starts
- The callback fires once after the last view finishes

### Onboarding Reveal Example

```xml
<Animation id="revealAnim" module="purgetss.ui" class="open:opacity-100 close:opacity-0 duration-300" />
<Label id="title" class="opacity-0 text-2xl font-bold" text="Welcome" />
<Label id="subtitle" class="opacity-0 mt-2 text-lg text-gray-500" text="To the app" />
<Button id="cta" class="opacity-0 mt-4 rounded bg-blue-500 text-white" title="Get Started" />
```

```javascript
$.fadeIn.sequence([$.title, $.subtitle, $.cta], () => {
  console.log('All views animated in sequence')
})

// Use close() to force state back before revealing again
$.revealAnim.close(views)
```

---

## The `swap` Method

Exchanges positions of two views with animation.

```javascript
$.myAnimation.swap(view1, view2)
```

**Behavior:**
- Inherits `duration`, `delay`, `curve` from Animation object. Fallback: **200ms**, **0ms**, **EASE_IN_OUT**
- Handles iOS transform reset automatically
- Temporarily elevates z-index; restores after completion
- Updates `_originLeft`/`_originTop` for subsequent drag operations
- **Automatic position normalization**: no explicit `top`/`left` needed -- resolved via `view.rect`
- **Bounce-back safe**: completes any in-progress bounce-back before swapping

### Memory Card Game Example

```javascript
let firstCard = null
function onCardTap({ source }) {
  $.flipAnim.open(source)
  if (!firstCard) { firstCard = source; return }
  if (firstCard.valor === source.valor) {
    firstCard = null
  } else {
    $.gameAnim.swap(firstCard, source)
    setTimeout(() => { $.flipAnim.close([firstCard, source]); firstCard = null }, 500)
  }
}
```

---

## The `pulse` Method

Scales a view up and back using native `autoreverse` + `repeat`.

```javascript
$.myAnimation.pulse(view, count)
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `view` | `View` | -- | The view to pulse |
| `count` | `Number` | `1` | Number of pulses |

- Scale from Animation object's `scale` class (e.g., `scale-(1.3)`). Fallback: **1.2x**
- Duration inherited; full cycle is double (up + back)
- Always uses `EASE_IN_OUT`; resets transform on completion

```xml
<Animation id="pulseAnim" module="purgetss.ui" class="scale-(1.3) autoreverse duration-150" />
```

```javascript
$.pulseAnim.pulse($.badge)
$.pulseAnim.pulse($.badge, 3)
```

---

## The `shake` Method

Horizontal shake for error/feedback.

```javascript
$.myAnimation.shake(view, intensity)
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `view` | `View` | -- | The view to shake |
| `intensity` | `Number` | `10` | Horizontal displacement in pixels |

- `duration`: inherited, divided by 6 for each shake cycle. Fallback: 400ms
- `delay`: inherited, applied before shake starts
- `curve`: always `EASE_IN_OUT` (fixed)
- `autoreverse` and `repeat`: always `true` and `3` (fixed)

```javascript
$.errorAnim.shake($.emailField, 5)
$.emailField.applyProperties({ borderColor: '#ef4444' })
```

---

## The `snapTo` Method

Snaps a view to the nearest target by center-to-center Euclidean distance. Returns the matched target or `null`.

```javascript
const matched = $.myAnimation.snapTo(view, targets)
```

- Inherits `duration`, `delay`, `curve`. Fallback: **200ms**, **0ms**, **EASE_IN_OUT**
- Handles iOS transform reset; updates `_originLeft`/`_originTop`
- Automatic position normalization

### Puzzle Game with Collision Detection

```javascript
$.puzzleAnim.draggable(pieces)
$.puzzleAnim.detectCollisions(pieces.concat(slots),
  null,
  (source, target) => {
    if (source.valor === target.valor) {
      $.puzzleAnim.undraggable(source)
      source.applyProperties({ opacity: 0.6 })
    }
  }
)
```

`snap-center` auto-centers on the slot; `snap-back` returns to origin if dropped outside; `undraggable` locks when correct.

---

## The `reorder` Method

Animates views to new positions by index mapping. All views animate simultaneously.

```javascript
$.myAnimation.reorder(views, newOrder)
```

- `newOrder` maps current index to new position: `[2, 1, 0]` reverses, `[1, 2, 0]` rotates
- Length must match `views` length
- Inherits `duration`, `delay`, `curve`. Fallback: **200ms**, **0ms**, **EASE_IN_OUT**
- Automatic position normalization

```javascript
const tasks = [$.taskHigh, $.taskMedium, $.taskLow]
$.taskAnim.reorder(tasks, [2, 1, 0])  // reverse order
$.taskAnim.reorder(tasks, [1, 2, 0])  // rotate
```

---

## The `transition` Method

Animates multiple views simultaneously to layout positions defined by `Matrix2D.translate().rotate().scale()`.

```javascript
$.myAnimation.transition(views, layouts)
```

### Layout Object Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `translation` | `Object` | `{x:0, y:0}` | Translation offset in pixels |
| `rotate` | `Number` | `0` | Rotation in degrees |
| `scale` | `Number` | `1` | Scale factor |
| `zIndex` | `Number` | -- | Applied synchronously before animation |
| `width` | `Number` | -- | Optional width change |
| `height` | `Number` | -- | Optional height change |
| `opacity` | `Number` | -- | Optional opacity change |

### Behavior

- Inherits `duration`, `delay`, `curve` from Animation object
- Each view gets a single `Ti.UI.createAnimation()` with combined `Matrix2D` transform
- All animations launch simultaneously
- `zIndex` applied synchronously before animation starts
- **Mismatched lengths**: extra views fade out; extra layouts ignored; faded views fade back in when given a layout entry

### Reusable Presets

```javascript
const fanOut = [
  { translation: { x: -120, y: 20 }, rotate: -15, scale: 0.8, zIndex: 1 },
  { translation: { x: 0, y: 0 }, rotate: 0, scale: 1, zIndex: 3 },
  { translation: { x: 120, y: 20 }, rotate: 15, scale: 0.8, zIndex: 2 }
]

const stack = [
  { translation: { x: -8, y: 16 }, rotate: 0, scale: 0.9, zIndex: 1 },
  { translation: { x: 0, y: 8 }, rotate: 0, scale: 0.95, zIndex: 2 },
  { translation: { x: 8, y: 0 }, rotate: 0, scale: 1, zIndex: 3 }
]

// Same preset, different view groups
$.anim.transition(screensA, fanOut)
$.anim.transition(screensB, fanOut)
```

### Photo Gallery Example

```xml
<Animation id="galleryAnim" module="purgetss.ui" class="keep-z-index duration-150" />
```

```javascript
const photos = [$.photo1, $.photo2, $.photo3]
function doFan() { $.galleryAnim.transition(photos, fan) }
function doStack() { $.galleryAnim.transition(photos, stack) }
$.galleryAnim.draggable(photos)  // photos keep rotation/scale while dragging
```

`keep-z-index` preserves the layout order during drag.

### Mac Catalyst Note

On Mac Catalyst, parent containers of transitioned views should use **fixed dimensions** (not `Ti.UI.FILL`). Resizable containers trigger a UIKit re-layout that distorts rotated `Matrix2D` transforms. This does not affect iOS or Android.

---

For property inheritance, timing/utility classes, utility functions, implementation rules, and complex UI examples, see [animation-advanced.md](./animation-advanced.md).
