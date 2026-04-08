# PurgeTSS Animation System

## Introduction

PurgeTSS includes an Animation module for applying 2D Matrix animations and transformations to Titanium views. The Animation object describes animations in three modes:

- **Single-phase**: An end state applied via `play`.
- **Multi-phase**: Using `open:`, `close:`, and `complete:` modifiers for state-based animations.
- **Children**: Using `children:` and `child:` modifiers for global/individual children properties.

When `play` is called on a view, it animates from the current state to the state described by the Animation object. Position, size, colors, transformation matrix, and opacity are all animatable. Timing is controlled with `duration-*`, `delay-*`, and `curve` classes.

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

Classes from `utilities.tss` are used for position, size, color, transformation, and opacity.

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
| `sequence` | `sequence(views, cb)` | Animate views one after another (sequential) |
| `swap` | `swap(view1, view2)` | Animate two views exchanging positions |
| `pulse` | `pulse(view, count)` | Scale-up-and-back animation (default count=1) |
| `shake` | `shake(view, intensity)` | Horizontal shake for feedback (default intensity=10) |
| `snapTo` | `snapTo(view, targets)` | Snap view to nearest target by center distance; returns matched target or null |
| `reorder` | `reorder(views, newOrder)` | Animate views to new positions by index mapping |
| `transition` | `transition(views, layouts)` | Multi-view layout transitions using Matrix2D |

---

## Modifiers

| Modifier | Purpose |
| --- | --- |
| `open:` | Properties applied during open state |
| `close:` | Properties applied during close state |
| `complete:` | Properties applied after open animation finishes |
| `children:` | Global properties for all children of a View |
| `child:` | Individual properties for specific children |
| `bounds:` | Drag boundaries within parent |
| `drag:` | Properties applied while dragging |
| `drop:` | Properties applied on drop |

---

## The `play` Method

Runs the animation for a single view or an array of views. Toggles between open and close states on repeated calls.

### Basic Example

```xml
<Alloy>
  <Window>
    <Animation module="purgetss.ui" id="myAnimation" class="wh-32 bg-green-500 duration-1000" />
    <View id="square" class="wh-16 bg-blue-500" />
  </Window>
</Alloy>
```

```javascript
$.myAnimation.play($.square)
```

The blue square animates from `64x64` to `128x128` and changes color to green.

### open/close Modifiers

Define different states for opening and closing:

```xml
<Animation id="changeColor" module="purgetss.ui" class="close:bg-blue-700 open:bg-purple-500" />
```

First call applies `open:` properties; next call applies `close:` properties; continues toggling.

### complete Modifier (Wordle-style)

The `complete:` modifier applies additional properties after an `open` animation finishes:

```xml
<Animation module="purgetss.ui" id="wordleFlip"
  class="duration-300 open:scale-1 complete:bg-(#008800) complete:scale-100" />
```

Sequence: view scales to `scale-1` (open), then on completion receives `bg-(#008800)` and `scale-100`.

### Animating Arrays of Views

Pass an array to animate all views with the same Animation object:

```javascript
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
| `type` | `String` | `'complete'` or `'applied'` |
| `bubbles` | `Boolean` | Whether the event bubbles |
| `cancelBubble` | `Boolean` | Whether bubbling is cancelled |
| `action` | `String` | `'play'` or `'apply'` |
| `state` | `String` | `'open'` or `'close'` |
| `id` | `String` | ID of the Animation object |
| `targetId` | `String` | ID of the animated view |
| `index` | `Number` | Position of the view in the array (0-based) |
| `total` | `Number` | Total number of views in the array |
| `getTarget()` | `Function` | Returns the animated view object |

---

## The `apply` Method

Applies properties instantly without animation. Same callback structure as `play`, but with `action='apply'` and `type='applied'`.

```javascript
$.myAnimation.apply($.myView)
```

### TikTok Rotation Example

Rotate a `ScrollableView` 90 degrees and counter-rotate its content for a TikTok-style vertical scroll layout:

```xml
<Alloy>
  <Window class="exit-on-close-false keep-screen-on">
    <Animation module="purgetss.ui" id="rotate" class="platform-wh-inverted rotate-90" />
    <Animation module="purgetss.ui" id="counterRotate" class="platform-wh -rotate-90" />

    <ScrollableView id="scrollableView" class="overlay-enabled disable-bounce">
      <View class="bg-blue-500"><Label text="Page 1" /></View>
      <View class="bg-red-500"><Label text="Page 2" /></View>
      <View class="bg-green-500"><Label text="Page 3" /></View>
    </ScrollableView>
  </Window>
</Alloy>
```

```javascript
$.rotate.apply($.scrollableView)
$.counterRotate.apply($.scrollableView.views)
$.index.open()
```

---

## The `open` and `close` Methods

Explicit control over animation direction. Unlike `play`/`toggle`, these do **not** toggle state automatically.

### open

```javascript
$.myAnimation.open($.myView, (e) => {
  console.log(e.state)  // 'open'
})
```

### close

```javascript
$.myAnimation.close($.myView, (e) => {
  console.log(e.state)  // 'close'
})
```

### Panel Zoom-In Example

```xml
<Animation module="purgetss.ui" id="panelAnim"
  class="duration-300 close:opacity-0 close:scale-50 open:opacity-100 open:scale-100" />
<View id="panel" class="opacity-0" />
```

```javascript
// Show panel
$.panelAnim.open($.panel)

// Hide panel (explicit, no toggle)
$.panelAnim.close($.panel)
```

---

## The `draggable` Method

Converts views into draggable elements via touch events.

```javascript
$.draggableAnimation.draggable([$.red, $.green, $.blue])
```

A blank Animation object or an existing one can be reused. When used with an array, zIndex is managed automatically.

### drag: and drop: Modifiers

- **Global modifiers** on the Animation object apply to all views.
- **Local modifiers** on individual views override globals.
- While dragging, `size`, `scale`, and `anchorPoint` transformations are **not** applied.

```xml
<!-- Global drag/drop on Animation -->
<Animation id="dragAnim" module="purgetss.ui" class="drag:opacity-75 drop:opacity-100" />

<!-- Local override on specific view -->
<View id="card" class="drag:bg-yellow-200 drop:bg-white" />
```

### draggingType

Controls how `drag:` and `drop:` properties are applied:

| Class | TSS | Behavior |
| --- | --- | --- |
| `drag-animate` | `{ draggingType: 'animate' }` | Animate properties (default) |
| `drag-apply` | `{ draggingType: 'apply' }` | Apply properties instantly |

### bounds: Modifier

Limits movement within the parent view. Can be set locally on the view or globally on the Animation object:

```xml
<!-- Local bounds -->
<View id="card" class="bounds:m-2 bounds:mb-16 mt-8 h-24 w-64" />

<!-- Global bounds -->
<Animation id="dragAnim" module="purgetss.ui" class="bounds:m-2 bounds:mb-16" />
```

### Constraints

Restrict movement to a single axis:

| Class | TSS | Effect |
| --- | --- | --- |
| `horizontal-constraint` | `{ constraint: 'horizontal' }` | Horizontal only |
| `vertical-constraint` | `{ constraint: 'vertical' }` | Vertical only |

---

## The `undraggable` Method

Removes draggable behavior and **all** associated listeners from views.

```javascript
$.dragAnim.undraggable([$.red, $.green, $.blue])
```

### Cleaned Up Listeners

- `touchstart`, `touchend`, `touchmove`
- `Ti.Gesture` `orientationchange`

### Cleaned Up Internal Properties

- `_originTop`, `_originLeft`
- `_visualTop`, `_visualLeft`
- `_collisionEnabled`
- `_dragListeners`
- `_wasDragged`
- `_bouncingBack`

### Use Cases

- **Lock after placement**: Lock a puzzle piece after it is placed correctly.
- **Toggle edit/presentation mode**: Enable drag in edit mode, disable in presentation mode.
- **Cleanup on window close**: Remove all listeners before closing a window to prevent leaks.

---

## The `detectCollisions` Method

Enables center-point hit testing between draggable views and target views.

```javascript
$.collisionAnim.detectCollisions(targets, dragCallback, dropCallback)
```

**Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `views` | `View/Array` | Target views to test against |
| `dragCB` | `Function(source, target)` | Called during drag when source overlaps a target |
| `dropCB` | `Function(source, target)` | Called on drop when source overlaps a target |

### Snap Classes

| Class | Description |
| --- | --- |
| `snap-back` | Returns to origin when dropped outside a target |
| `snap-center` | Auto-centers on the target (uses `snapTo` internally) |
| `snap-magnet` | (Planned) Magnetic attraction behavior |
| `keep-z-index` | Preserve z-order during drag |

Each has a `-false` variant to disable (e.g., `snap-back-false`).

### Example with Drag Highlights and Drop Handling

```xml
<Animation id="collisionAnim" module="purgetss.ui"
  class="snap-back snap-center drag:opacity-75 drop:opacity-100 duration-200" />

<View id="dropZone" class="w-32 h-32 bg-gray-200 rounded-lg" />
<View id="draggableItem" class="w-16 h-16 bg-blue-500 rounded-lg" />
```

```javascript
$.collisionAnim.draggable($.draggableItem)
$.collisionAnim.detectCollisions(
  $.dropZone,
  (source, target) => {
    // Drag hover: highlight target
    target.backgroundColor = '#e0f0ff'
  },
  (source, target) => {
    // Drop: handle placement
    target.backgroundColor = '#d1d5db'
    console.log(`${source.id} dropped on ${target.id}`)
  }
)
```

### Drag-to-Swap Grid Example

Combining `draggable` + `detectCollisions` + `swap`:

```javascript
const items = [$.item1, $.item2, $.item3, $.item4]
$.gridAnim.draggable(items)
$.gridAnim.detectCollisions(
  items,
  (source, target) => { /* highlight */ },
  (source, target) => {
    $.gridAnim.swap(source, target)
  }
)
```

---

## The `sequence` Method

Animates views one after another (sequential). The open/close state toggles once for the entire sequence, not per view.

```javascript
$.seqAnim.sequence([$.step1, $.step2, $.step3], (e) => {
  console.log('Sequence complete')
})
```

The callback fires **once** after the last view completes.

### Onboarding Reveal Example

```xml
<Animation id="revealAnim" module="purgetss.ui"
  class="duration-500 open:opacity-100 close:opacity-0" />

<Label id="step1" class="opacity-0" text="Welcome!" />
<Label id="step2" class="opacity-0" text="Swipe to navigate" />
<Label id="step3" class="opacity-0" text="Let's go!" />
```

```javascript
$.revealAnim.sequence([$.step1, $.step2, $.step3])
```

Each label fades in one after the other.

---

## The `swap` Method

Exchanges positions of two views with animation.

```javascript
$.swapAnim.swap($.viewA, $.viewB)
```

**Behavior:**
- Inherits `duration`, `delay`, and `curve` from the Animation object. Fallback: **200ms**, **0ms**, **EASE_IN_OUT**.
- **Automatic position normalization**: No explicit `top`/`left` needed on views.
- **Bounce-back safe**: Works correctly with snap-back enabled views.
- Updates `_originLeft` and `_originTop` for subsequent drag/collision operations.

### Memory Card Game Example

```xml
<Animation id="cardAnim" module="purgetss.ui" class="duration-300 ease-in-out" />
```

```javascript
function onMatch(card1, card2) {
  $.cardAnim.swap(card1, card2)
}
```

---

## The `pulse` Method

Scale-up-and-back animation using native `autoreverse` and `repeat`.

```javascript
$.pulseAnim.pulse($.badge, 3)  // pulse 3 times
```

**Behavior:**
- Scale factor from the Animation object (e.g., `scale-(1.3)`). Fallback: **1.2x**.
- Duration inherited from Animation object. Full cycle duration is **double** (scale up + autoreverse back).
- `count` parameter defaults to **1**.

### Notification Badge Example

```xml
<Animation id="pulseAnim" module="purgetss.ui" class="duration-200 scale-(1.3)" />
<View id="badge" class="wh-6 rounded-full bg-red-500" />
```

```javascript
// Pulse badge 2 times on new notification
$.pulseAnim.pulse($.badge, 2)
```

---

## The `shake` Method

Horizontal displacement animation for user feedback (e.g., invalid input).

```javascript
$.shakeAnim.shake($.loginField, 15)  // intensity = 15px
```

**Behavior:**
- `intensity` is horizontal displacement in pixels. Default: **10**.
- Duration from Animation object is divided by **6** internally for shake cycles. Fallback: **400ms** total.
- Internally uses `autoreverse: true` and `repeat: 3` (fixed, not configurable).
- Curve is fixed to `EASE_IN_OUT`.

### Login Validation Example

```xml
<Animation id="shakeAnim" module="purgetss.ui" class="duration-300" />
<TextField id="loginField" class="w-64 h-10 border-1 rounded-lg" />
```

```javascript
function onLoginFailed() {
  $.shakeAnim.shake($.loginField)
}
```

---

## The `snapTo` Method

Snaps a view to the nearest target based on Euclidean distance from center points. Returns the matched target view or `null`.

```javascript
const matched = $.snapAnim.snapTo($.piece, [$.slot1, $.slot2, $.slot3])
if (matched) {
  console.log(`Snapped to ${matched.id}`)
}
```

**Behavior:**
- Inherits `duration`, `delay`, and `curve` from Animation object. Fallback: **200ms**, **0ms**, **EASE_IN_OUT**.
- Automatic position normalization.
- Returns the target view closest to the source by center distance, or `null` if no targets provided.

### Puzzle Game Example with Collision Detection

```javascript
$.puzzleAnim.draggable($.piece)
$.puzzleAnim.detectCollisions(
  [$.slot1, $.slot2, $.slot3],
  null,
  (source, target) => {
    const matched = $.puzzleAnim.snapTo(source, [target])
    if (matched) {
      $.puzzleAnim.undraggable(source)  // lock piece
    }
  }
)
```

---

## The `reorder` Method

Animates views to new positions defined by an index mapping array. All views animate simultaneously.

```javascript
$.reorderAnim.reorder([$.a, $.b, $.c], [2, 0, 1])
```

**Index mapping:**
- `[2, 1, 0]` reverses three views.
- `[1, 2, 0]` rotates positions left.
- Array length **must** match the views array length.
- Automatic position normalization.

### Sort by Priority Example

```xml
<Animation id="sortAnim" module="purgetss.ui" class="duration-400 ease-in-out" />

<View id="low" class="h-12 bg-green-200"><Label text="Low" /></View>
<View id="med" class="h-12 bg-yellow-200"><Label text="Medium" /></View>
<View id="high" class="h-12 bg-red-200"><Label text="High" /></View>
```

```javascript
// Reorder: high first, medium second, low third
$.sortAnim.reorder([$.low, $.med, $.high], [2, 1, 0])
```

---

## The `transition` Method

Multi-view layout transitions using Matrix2D. All animations launch simultaneously.

```javascript
$.transAnim.transition(views, layouts)
```

### Layout Object Properties

| Property | Type | Description |
| --- | --- | --- |
| `translation` | `{ x, y }` | Translate position |
| `rotate` | `Number` | Rotation in degrees |
| `scale` | `Number` | Scale factor |
| `zIndex` | `Number` | Z-order |
| `width` | `Number/String` | Target width |
| `height` | `Number/String` | Target height |
| `opacity` | `Number` | Target opacity (0-1) |

### Mismatched Lengths Behavior

- **Extra views** (more views than layouts): Extra views fade out.
- **Extra layouts** (more layouts than views): Extra layouts are ignored.
- **Faded views**: When transitioning back to a layout that includes them, faded views fade back in.

### Reusable Presets

Define layout presets as reusable arrays:

```javascript
const fanOut = [
  { translation: { x: -100, y: 0 }, rotate: -15 },
  { translation: { x: 0, y: -20 }, rotate: 0 },
  { translation: { x: 100, y: 0 }, rotate: 15 }
]

const stack = [
  { translation: { x: 0, y: 0 }, rotate: 0, scale: 1 },
  { translation: { x: 2, y: 2 }, rotate: 0, scale: 0.98 },
  { translation: { x: 4, y: 4 }, rotate: 0, scale: 0.96 }
]

const reset = [
  { translation: { x: 0, y: 0 }, rotate: 0, scale: 1 },
  { translation: { x: 0, y: 0 }, rotate: 0, scale: 1 },
  { translation: { x: 0, y: 0 }, rotate: 0, scale: 1 }
]
```

### Photo Gallery Example

```xml
<Animation id="galleryAnim" module="purgetss.ui" class="duration-500 ease-in-out" />

<View id="photo1" class="w-48 h-64"><ImageView image="/img1.jpg" /></View>
<View id="photo2" class="w-48 h-64"><ImageView image="/img2.jpg" /></View>
<View id="photo3" class="w-48 h-64"><ImageView image="/img3.jpg" /></View>
```

```javascript
const photos = [$.photo1, $.photo2, $.photo3]

// Fan out
$.galleryAnim.transition(photos, fanOut)

// Stack
$.galleryAnim.transition(photos, stack)

// Reset
$.galleryAnim.transition(photos, reset)
```

### Mac Catalyst Note

On **Mac Catalyst**, parent containers must have fixed dimensions (explicit `width` and `height`) for transitions to work correctly.

### keep-z-index Class

Add `keep-z-index` to the Animation object to preserve z-order during transitions:

```xml
<Animation id="transAnim" module="purgetss.ui" class="keep-z-index duration-500" />
```

---

## Property Inheritance Matrix

Shows which timing/animation properties each method inherits from the Animation object.

| Property | play/toggle | open/close | apply | sequence | swap | reorder | snapTo | shake | pulse | transition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `duration` | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ (÷6) | ✅ | ✅ |
| `delay` | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | — | — | ✅ |
| `curve` | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | fixed | — | ✅ |
| `autoreverse` | ✅ | ✅ | — | ✅ | — | — | — | fixed | ✅ | — |
| `repeat` | ✅ | ✅ | — | ✅ | — | — | — | fixed | param | — |

**Legend:** ✅ = inherited from Animation object, — = not applicable, fixed = hardcoded internally, param = controlled by method parameter, (÷6) = duration divided by 6.

### Fallback Defaults

| Method | Duration | Delay | Curve |
| --- | --- | --- | --- |
| `swap` | 200ms | 0ms | EASE_IN_OUT |
| `reorder` | 200ms | 0ms | EASE_IN_OUT |
| `snapTo` | 200ms | 0ms | EASE_IN_OUT |
| `shake` | 400ms (total) | — | EASE_IN_OUT (fixed) |

---

## Timing and Utility Classes

### anchorPoint / origin-* Classes

Controls the pivot point of the animation. 9 positions:

| Class | anchorPoint |
| --- | --- |
| `origin-center` | `{ x: 0.5, y: 0.5 }` |
| `origin-top` | `{ x: 0.5, y: 0 }` |
| `origin-top-right` | `{ x: 1, y: 0 }` |
| `origin-right` | `{ x: 1, y: 0.5 }` |
| `origin-bottom-right` | `{ x: 1, y: 1 }` |
| `origin-bottom` | `{ x: 0.5, y: 1 }` |
| `origin-bottom-left` | `{ x: 0, y: 1 }` |
| `origin-left` | `{ x: 0, y: 0.5 }` |
| `origin-top-left` | `{ x: 0, y: 0 }` |

### autoreverse

```tss
'.autoreverse': { autoreverse: true }
'.autoreverse-false': { autoreverse: false }
```

### Curve Classes

| Class | Constant |
| --- | --- |
| `ease-in` | `Ti.UI.ANIMATION_CURVE_EASE_IN` |
| `ease-out` | `Ti.UI.ANIMATION_CURVE_EASE_OUT` |
| `ease-linear` | `Ti.UI.ANIMATION_CURVE_LINEAR` |
| `ease-in-out` | `Ti.UI.ANIMATION_CURVE_EASE_IN_OUT` |

### delay-*

Range: **0** to **5000ms**. Examples: `delay-0`, `delay-100`, `delay-500`, `delay-1000`, `delay-5000`.

### duration-*

Range: **0** to **5000ms**. Examples: `duration-0`, `duration-150`, `duration-300`, `duration-1000`, `duration-5000`.

### repeat-*

Range: **0** to **12**. Examples: `repeat-0`, `repeat-1`, `repeat-3`, `repeat-12`.

### rotate-* and -rotate-*

Range: **0** to **180** degrees, positive and negative.

```tss
'.rotate-45': { rotate: 45 }
'.rotate-90': { rotate: 90 }
'.rotate-180': { rotate: 180 }
'.-rotate-45': { rotate: -45 }
'.-rotate-90': { rotate: -90 }
'.-rotate-180': { rotate: -180 }
```

### scale-*

Range: **0** to **150**. Value is divided by 100 for the actual scale factor.

```tss
'.scale-0': { scale: 0 }
'.scale-50': { scale: 0.5 }
'.scale-95': { scale: 0.95 }
'.scale-100': { scale: 1 }
'.scale-125': { scale: 1.25 }
'.scale-150': { scale: 1.5 }
```

### Snap Classes

| Class | Description |
| --- | --- |
| `snap-back` | Returns to origin when dropped outside target |
| `snap-back-false` | Disables snap-back |
| `snap-center` | Auto-centers on target |
| `snap-center-false` | Disables snap-center |
| `snap-magnet` | (Planned) Magnetic attraction |
| `snap-magnet-false` | Disables snap-magnet |

### Z-Index

| Class | Description |
| --- | --- |
| `keep-z-index` | Preserve z-order during drag/transition |
| `keep-z-index-false` | Allow z-order management (default) |

### Drag Type

| Class | Description |
| --- | --- |
| `drag-apply` | Apply drag/drop properties instantly |
| `drag-animate` | Animate drag/drop properties (default) |

### Opacity and Visibility

```tss
'.opacity-to-0': { opacity: 1, animationProperties: { open: { opacity: 0 }, close: { opacity: 1 } } }
'.opacity-to-100': { opacity: 0, animationProperties: { open: { opacity: 1 }, close: { opacity: 0 } } }
'.toggle-visible': { animationProperties: { open: { visible: true }, close: { visible: false } } }
```

### zoom-in-* / zoom-out-*

Range: **0** to **150**. Zoom utilities animate scale in open/close states and reset to 1 on complete.

```tss
'.zoom-in-50': { animationProperties: { open: { scale: 0.5 }, complete: { scale: 1 } } }
'.zoom-in-95': { animationProperties: { open: { scale: 0.95 }, complete: { scale: 1 } } }
'.zoom-out-50': { animationProperties: { close: { scale: 0.5 }, complete: { scale: 1 } } }
'.zoom-out-95': { animationProperties: { close: { scale: 0.95 }, complete: { scale: 1 } } }
```

---

## Utility Functions

### deviceInfo()

Logs detailed platform and display information to the console. Works in both Alloy and Classic Titanium projects.

```javascript
const { deviceInfo } = require('purgetss.ui')
deviceInfo()
```

### saveComponent({ source, directory })

Saves a snapshot of a view as a PNG to the photo gallery.

```javascript
const { saveComponent } = require('purgetss.ui')
saveComponent({ source: $.myView, directory: 'screenshots' })
```

### createAnimation(args)

Factory function to create Animation objects programmatically.

```javascript
const { createAnimation } = require('purgetss.ui')
const anim = createAnimation({ duration: 300, curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT })
```

---

## Implementation Rules

Rules for developers extending or maintaining the Animation module:

1. **Inherit from Animation object via `...args`**: Always spread the Animation object properties as the base; method-specific overrides come after.
2. **Override by position, not exclusion**: When a method needs different values, override the specific property rather than filtering out unwanted properties.
3. **No timing parameters in method signatures**: Methods like `swap`, `pulse`, `shake` do not accept duration/delay/curve as parameters. These are always inherited from the Animation object or use hardcoded fallbacks.
4. **Consolidate state with `applyProperties` post-animation**: After an animation completes, call `applyProperties` on the view to persist the final state, preventing visual jumps on subsequent animations.
5. **Track position with `_origin*` properties**: After any position-changing operation (`swap`, `reorder`, `snapTo`, drag), update `_originLeft` and `_originTop` on the view for correct subsequent operations.
6. **Consolidate Android drag position before drop animations**: On Android, the visual position during drag uses different coordinates than the layout system. Consolidate before running drop animations.
7. **Clean up in `undraggable`**: All listeners and internal properties added by `draggable`/`detectCollisions` must be removed in `undraggable` to prevent memory leaks.
