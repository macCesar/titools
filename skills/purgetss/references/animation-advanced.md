# PurgeTSS Animation -- Advanced Reference

Property inheritance, timing/utility classes, utility functions, implementation rules, and complex UI examples.

For core animation methods (play, toggle, apply, open, close, draggable, undraggable, detectCollisions, sequence, swap, pulse, shake, snapTo, reorder, transition), see [animation-system.md](./animation-system.md).

---

<!-- TOC-START -->
## Contents

- [Property Inheritance from the Animation Object](#property-inheritance-from-the-animation-object)
- [Timing and Utility Classes](#timing-and-utility-classes)
- [Utility Functions](#utility-functions)
- [Implementation Rules](#implementation-rules)
- [Method Implementation Template](#method-implementation-template)
- [Complex UI Example](#complex-ui-example)

<!-- TOC-END -->

## Property Inheritance from the Animation Object

All methods in the Animation module inherit properties from the `<Animation>` object's classes. You configure animation behavior in XML and it applies to every method call.

When you declare an Animation object with utility classes:

```xml
<Animation id="myAnim" module="purgetss.ui" class="duration-150 delay-100 curve-animation-ease-out" />
```

The parsed properties (`duration: 150`, `delay: 100`, `curve: EASE_OUT`) are stored in the internal `args` object. Each method reads from `args` as its default values.

### Inheritance Matrix

| Property | play/toggle | open/close | apply | sequence | swap | reorder | snapTo | shake | pulse | transition |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `duration` | Y | Y | -- | Y | Y | Y | Y | Y (div6) | Y | Y |
| `delay` | Y | Y | -- | Y | Y | Y | Y | Y | Y | Y |
| `curve` | Y | Y | -- | Y | Y | Y | Y | fixed | fixed | Y |
| `autoreverse` | Y | Y | -- | Y | -- | -- | -- | fixed | fixed | -- |
| `repeat` | Y | Y | -- | Y | -- | -- | -- | fixed | param | -- |

**Legend:**
- **Y** = inherited from Animation object
- **--** = not applicable to this method
- **fixed** = uses internal fixed values (`shake`: `autoreverse: true`, `repeat: 3`, `curve: EASE_IN_OUT`; `pulse`: `autoreverse: true`, `curve: EASE_IN_OUT`)
- **param** = controlled by method parameter (`pulse` `count` sets the repeat value)
- **(div6)** = `shake` divides the inherited duration by 6 for each oscillation cycle

### Fallback Defaults

When a property is not set on the Animation object and no explicit parameter is passed:

| Property | `swap` / `reorder` / `snapTo` | `shake` |
| --- | :---: | :---: |
| `duration` | 200ms | 400ms |
| `delay` | 0ms | 0ms |
| `curve` | `EASE_IN_OUT` | `EASE_IN_OUT` (fixed) |

### Explicit Parameters Take Precedence

An explicit value passed as a method parameter always overrides the inherited value:

```javascript
// All timing controlled by the Animation object's classes
$.myAnim.swap($.card1, $.card2)
$.myAnim.reorder(cards, [2, 0, 1])
$.myAnim.shake($.errorField, 20)
$.myAnim.snapTo($.card, targets)
$.myAnim.transition(views, fanOutLayout)
```

---

## Timing and Utility Classes

### anchorPoint / origin-* Classes

Controls the pivot point of the animation. Available as both `origin-*` and `anchor-point-*` variants:

| Class | anchorPoint |
| --- | --- |
| `origin-center` / `anchor-point-center` | `{ x: 0.5, y: 0.5 }` |
| `origin-top` / `anchor-point-top` | `{ x: 0.5, y: 0 }` |
| `origin-top-right` / `anchor-point-top-right` | `{ x: 1, y: 0 }` |
| `origin-right` / `anchor-point-right` | `{ x: 0.5, y: 1 }` |
| `origin-bottom-right` / `anchor-point-bottom-right` | `{ x: 1, y: 1 }` |
| `origin-bottom` / `anchor-point-bottom` | `{ x: 0.5, y: 1 }` |
| `origin-bottom-left` / `anchor-point-bottom-left` | `{ x: 0, y: 1 }` |
| `origin-left` / `anchor-point-left` | `{ x: 0, y: 0.5 }` |
| `origin-top-left` / `anchor-point-top-left` | `{ x: 0, y: 0 }` |

### autoreverse

Whether the animation replays in reverse after completing. Default: `false`.

```css
'.autoreverse': { autoreverse: true }
'.autoreverse-false': { autoreverse: false }
```

### Curve Classes

```css
'.curve-animation-ease-in': { curve: Ti.UI.ANIMATION_CURVE_EASE_IN }
'.curve-animation-ease-in-out': { curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT }
'.curve-animation-ease-out': { curve: Ti.UI.ANIMATION_CURVE_EASE_OUT }
'.curve-animation-linear': { curve: Ti.UI.ANIMATION_CURVE_LINEAR }
```

### delay-*

Delay in milliseconds before starting the animation. Range: **0** to **5000ms**.

Values: `delay-0`, `delay-25`, `delay-50`, `delay-75`, `delay-100`, `delay-150`, `delay-200`, `delay-250`, `delay-300`, `delay-350`, `delay-400`, `delay-450`, `delay-500`, `delay-600`, `delay-700`, `delay-800`, `delay-900`, `delay-1000`, `delay-2000`, `delay-3000`, `delay-4000`, `delay-5000`.

### duration-*

Duration of the animation in milliseconds. Range: **0** to **5000ms**.

Values: `duration-0`, `duration-25`, `duration-50`, `duration-75`, `duration-100`, `duration-150`, `duration-200`, `duration-250`, `duration-300`, `duration-350`, `duration-400`, `duration-450`, `duration-500`, `duration-600`, `duration-700`, `duration-800`, `duration-900`, `duration-1000`, `duration-2000`, `duration-3000`, `duration-4000`, `duration-5000`.

### repeat-*

Number of times the animation should run. If `autoreverse` is true, one repeat means the animation plays forward and backward once. Range: **0** to **12**.

Values: `repeat-0` through `repeat-12`.

### rotate-* and -rotate-*

Rotation in degrees. Range: **0** to **180**, positive and negative.

```css
'.rotate-0': { rotate: 0 }
'.rotate-1': { rotate: 1 }
'.rotate-2': { rotate: 2 }
'.rotate-3': { rotate: 3 }
'.rotate-6': { rotate: 6 }
'.rotate-12': { rotate: 12 }
'.rotate-45': { rotate: 45 }
'.rotate-90': { rotate: 90 }
'.rotate-180': { rotate: 180 }
'.-rotate-0': { rotate: 0 }
'.-rotate-1': { rotate: -1 }
'.-rotate-2': { rotate: -2 }
'.-rotate-3': { rotate: -3 }
'.-rotate-6': { rotate: -6 }
'.-rotate-12': { rotate: -12 }
'.-rotate-45': { rotate: -45 }
'.-rotate-90': { rotate: -90 }
'.-rotate-180': { rotate: -180 }
```

### scale-*

Scales the matrix by the specified factor. Same value for horizontal and vertical. Default: `1`.

```css
'.scale-0': { scale: 0 }
'.scale-1': { scale: 0.01 }
'.scale-5': { scale: 0.05 }
'.scale-10': { scale: 0.10 }
'.scale-25': { scale: 0.25 }
'.scale-50': { scale: 0.5 }
'.scale-75': { scale: 0.75 }
'.scale-90': { scale: 0.9 }
'.scale-95': { scale: 0.95 }
'.scale-100': { scale: 1 }
'.scale-105': { scale: 1.05 }
'.scale-110': { scale: 1.1 }
'.scale-125': { scale: 1.25 }
'.scale-150': { scale: 1.5 }
```

### Snap Classes

Control how draggable views behave when dropped. All are **off by default**.

| Class | TSS | Description |
| --- | --- | --- |
| `snap-back` | `{ animationProperties: { snap: { back: true } } }` | Returns to origin when dropped outside target |
| `snap-back-false` | `{ animationProperties: { snap: { back: false } } }` | Disables snap-back |
| `snap-center` | `{ animationProperties: { snap: { center: true } } }` | Auto-centers on target |
| `snap-center-false` | `{ animationProperties: { snap: { center: false } } }` | Disables snap-center |
| `snap-magnet` | `{ animationProperties: { snap: { magnet: true } } }` | (Planned) Magnetic attraction |
| `snap-magnet-false` | `{ animationProperties: { snap: { magnet: false } } }` | Disables snap-magnet |

### keep-z-index

Prevents the drag system from auto-promoting the dragged view's z-index. Useful when using `transition` presets where z-order is part of the layout.

```css
'.keep-z-index': { animationProperties: { keepZIndex: true } }
'.keep-z-index-false': { animationProperties: { keepZIndex: false } }
```

### Drag Type

```css
'.drag-apply': { draggingType: 'apply' }
'.drag-animate': { draggingType: 'animate' }
```

### Opacity and Visibility Utilities

```css
'.opacity-to-0': { opacity: 1, animationProperties: { open: { opacity: 0 }, close: { opacity: 1 } } }
'.opacity-to-100': { opacity: 0, animationProperties: { open: { opacity: 1 }, close: { opacity: 0 } } }
'.toggle-visible': { animationProperties: { open: { visible: true }, close: { visible: false } } }
```

### zoom-in-* / zoom-out-*

Animates zoom in and zoom out. Sets the View's scale to the specified value, then animates it back to 1. Range: **0** to **150**.

```css
'.zoom-in-0': { animationProperties: { open: { scale: 0 }, complete: { scale: 1 } } }
'.zoom-in-50': { animationProperties: { open: { scale: 0.5 }, complete: { scale: 1 } } }
'.zoom-in-95': { animationProperties: { open: { scale: 0.95 }, complete: { scale: 1 } } }
'.zoom-in-110': { animationProperties: { open: { scale: 1.1 }, complete: { scale: 1 } } }
'.zoom-out-0': { animationProperties: { close: { scale: 0 }, complete: { scale: 1 } } }
'.zoom-out-50': { animationProperties: { close: { scale: 0.5 }, complete: { scale: 1 } } }
'.zoom-out-95': { animationProperties: { close: { scale: 0.95 }, complete: { scale: 1 } } }
'.zoom-out-110': { animationProperties: { close: { scale: 1.1 }, complete: { scale: 1 } } }
```

Full range: `zoom-in-0`, `zoom-in-1`, `zoom-in-5`, `zoom-in-10`, `zoom-in-25`, `zoom-in-50`, `zoom-in-75`, `zoom-in-90`, `zoom-in-95`, `zoom-in-100`, `zoom-in-105`, `zoom-in-110`, `zoom-in-125`, `zoom-in-150` (and same for `zoom-out-*`).

---

## Utility Functions

The module exports helper functions alongside the Animation component:

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

---

## Implementation Rules

Rules that every method in the Animation module must follow. They keep behavior consistent with the declarative model of PurgeTSS.

### Rule 1: Inherit from the `<Animation />` object via `...args`

Every method MUST inherit all properties from the Animation object by spreading `args`. Never cherry-pick individual properties.

The `<Animation />` object is the single source of truth for animation behavior. When a developer declares:

```xml
<Animation id="myAnim" module="purgetss.ui" class="curve-animation-ease-out opacity-50 delay-100 duration-300" />
```

Every property -- timing AND visual -- is available in `args` and MUST be inherited by all methods.

```javascript
// CORRECT -- inherits everything, method-specific props override
view.animate({ ...args, left: destLeft, top: destTop, transform: Ti.UI.createMatrix2D() })

// WRONG -- cherry-picks individual properties, breaks if new ones are added
view.animate({ duration: args.duration, delay: args.delay, left: destLeft, top: destTop })
```

This is the same pattern used by the core `playView` function:

```javascript
const animation = Ti.UI.createAnimation(args)
view.animate(animation)
```

If a developer adds `opacity-50` to their `<Animation>`, they expect ALL methods to animate opacity, not just `play`.

### Rule 2: Override by position, not by exclusion

If a method needs fixed values for specific properties, they go AFTER `...args` to override. Never filter or exclude properties from args.

```javascript
// CORRECT -- shake: inherits everything, then overrides what it needs
view.animate({
  ...args,
  transform: Ti.UI.createMatrix2D().translate(intensity, 0),
  duration: Math.round((args.duration ?? 400) / 6),
  autoreverse: true,
  repeat: 3,
  curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
})

// WRONG -- filters args, only picks what it thinks it needs
view.animate({
  duration: args.duration,
  transform: Ti.UI.createMatrix2D().translate(intensity, 0),
  autoreverse: true,
  repeat: 3
})
```

Properties declared later in the object literal override earlier ones:

```javascript
// If args = { duration: 300, opacity: 0.5, curve: EASE_OUT }
view.animate({
  ...args,        // duration: 300, opacity: 0.5, curve: EASE_OUT
  duration: 50,   // overrides to 50
  curve: EASE_IN  // overrides to EASE_IN
})
// Result: { duration: 50, opacity: 0.5, curve: EASE_IN }
// opacity 0.5 is preserved from args -- not lost by filtering
```

### Rule 3: No timing parameters in method signatures

The existing core methods (`play`, `open`, `close`, `apply`, `sequence`) do NOT accept `duration`, `delay`, or `curve` as parameters. New methods MUST follow the same pattern. Only parameters specific to the method's unique functionality are allowed.

```javascript
// CORRECT -- only method-specific parameters
animationView.swap = (view1, view2) => {
animationView.reorder = (views, newOrder) => {
animationView.shake = (view, intensity = 10) => {
animationView.snapTo = (view, targets) => {
animationView.pulse = (view, count = 1) => {

// WRONG -- timing parameters belong in the <Animation /> object
animationView.swap = (view1, view2, duration) => {
animationView.shake = (view, intensity, duration) => {
```

Users control timing declaratively:

```xml
<!-- Fast swap -->
<Animation id="fastSwap" module="purgetss.ui" class="duration-75" />

<!-- Slow swap with delay -->
<Animation id="slowSwap" module="purgetss.ui" class="delay-200 duration-500" />
```

```javascript
// Same method call, different behavior -- controlled by XML
$.fastSwap.swap($.card1, $.card2)
$.slowSwap.swap($.card1, $.card2)
```

### Rule 4: Consolidate state with `applyProperties` post-animation

After animating position (`left`/`top`), ALWAYS consolidate with `applyProperties` in the callback so the final state is real (not just visual via transform).

```javascript
// CORRECT -- consolidates after animation
view.animate({
  ...args, left: destLeft, top: destTop, transform: Ti.UI.createMatrix2D()
}, () => {
  view.applyProperties({ left: destLeft, top: destTop, transform: Ti.UI.createMatrix2D() })
})

// WRONG -- animation ends but view's actual properties are stale
view.animate({
  ...args, left: destLeft, top: destTop, transform: Ti.UI.createMatrix2D()
})
```

On iOS, dragging uses `transform.translate()` -- the view's `left`/`top` properties don't change. `applyProperties` ensures the view's actual properties match the visual position and the transform is reset to identity.

### Rule 5: Track position with `_origin*` properties

Methods that move position (`swap`, `reorder`, `snapTo`, and future methods like `slideTo`) MUST update `_originTop`/`_originLeft` after the animation so that subsequent drag/swap operations work correctly.

```javascript
// CORRECT -- updates origin tracking
view.animate({
  ...args, left: destLeft, top: destTop, transform: Ti.UI.createMatrix2D()
}, () => {
  view.applyProperties({ left: destLeft, top: destTop, transform: Ti.UI.createMatrix2D() })
})

view._originTop = destTop
view._originLeft = destLeft
```

How `_origin*` works:
- `_originTop`/`_originLeft` represent the view's "logical grid position"
- `swap` reads from `view._originTop ?? view.top` -- falls back to the actual `top` if no origin is set
- `onTouchStart` in the drag handler saves the current `top`/`left` as `_origin*` for bounce-back
- `undraggable` cleans up all `_origin*` properties

### Rule 6: Consolidate Android drag position before drop animations

On Android, drag uses `animate({ duration: 0 })` which is asynchronous -- the last frame may still be in-flight when `touchend` fires. Before starting any drop animation on Android, consolidate the view's position with `applyProperties`:

```javascript
if (!params.isIOS) {
  draggableView.applyProperties({
    top: draggableView._visualTop ?? draggableView.top,
    left: draggableView._visualLeft ?? draggableView.left
  })
}
```

This applies to both the snap path and the bounce-back path in `onTouchEnd`. iOS does not need this because drag uses synchronous `transform.translate()`.

**Collision fallback on drop:** During drag, `checkCollision` runs on every `touchmove`. When the user releases while still in motion, the drag center may exit the target between the last `touchmove` and `touchend`. The module tracks `lastKnownTarget` and uses it as fallback when `checkCollision` returns null on drop.

### Rule 7: Clean up in `undraggable`

Every internal property added to views MUST be cleaned up in `undraggable`:

| Property | Set by | Purpose |
| --- | --- | --- |
| `_originTop` / `_originLeft` | `swap`, `reorder`, `snapTo`, `onTouchStart` | Logical position tracking |
| `_visualTop` / `_visualLeft` | `handleTouchMove` | Visual position during drag |
| `_dragListeners` | `makeViewsDraggable` | Touch event listener references |
| `_collisionEnabled` | `detectCollisions` | Collision detection flag |
| `_wasDragged` | `onTouchStart` / `handleTouchMove` | Drag detection flag |
| `_bouncingBack` | `onTouchEnd` (bounce-back) | Prevents origin capture during mid-animation; `swap` cancels it before animating |

When adding a new method that stores internal state on views, add the cleanup to `undraggable`:

```javascript
animationView.undraggable = (_views) => {
  const arr = Array.isArray(_views) ? _views : [_views]
  arr.forEach(view => {
    // ... existing cleanup ...
    delete view._newProperty  // ADD cleanup for any new internal property
  })
}
```

---

## Method Implementation Template

When creating a new method, follow this template:

```javascript
animationView.newMethod = (view, specificParam = defaultValue) => {
  if (params.debug) { console.log('') }
  logger('`newMethod` method called on: ' + params.id)
  if (!view) { return notFound() }

  view.animate({
    ...args,                          // Rule 1: inherit all from <Animation />
    specificProp: computedValue,      // Rule 2: override AFTER ...args
  }, () => {
    view.applyProperties({ ... })    // Rule 4: consolidate state
  })

  view._originTop = newTop           // Rule 5: track position (if applicable)
  view._originLeft = newLeft
}
// Rule 3: no timing params in signature
// Rule 7: add cleanup to undraggable (if new internal state)
```

---

## Complex UI Example

This example combines several Animation module features in a single UI: a collapsible sidebar, an expandable card, and draggable elements.

Install FontAwesome fonts first:

```bash
purgetss icon-library -v=fa
```

### XML

```xml
<Alloy>
  <Window class="exit-on-close-false portrait bg-purple-700">
    <Animation id="draggableAnimation" module="purgetss.ui" class="bounds:m-4 bounds:mb-20" />

    <!-- Sidebar -->
    <Animation id="sideBarAnimation" module="purgetss.ui" class="close:w-24 duration-150 open:w-72" />
    <Animation id="sideBarAnimationChevron" module="purgetss.ui" class="close:rotate-0 duration-150 open:rotate-180" />

    <View id="sideBar" class="ml-2 h-1/2 w-24">
      <View class="vertical ios:shadow-lg mr-8 rounded-lg bg-white" ios:onSingletap="doAction" android:onClick="doAction">
        <View class="grid-flow-row">
          <View class="ml-0 w-64 grid-rows-7">
            <View class="horizontal bg-selected-purple-100 items-center" action="home">
              <Label class="touch-enabled-false fas fa-home ml-0 h-full w-16 border-transparent bg-transparent text-center text-xl text-purple-700" />
              <Label class="touch-enabled-false text-purple-700" text="Home" />
            </View>
          </View>
          <!-- More menu items: profile, messages, help, settings, password, sign-out -->
        </View>
      </View>
      <Button id="sideBarChevron" class="fas rounded-10 fa-chevron-right mr-1.5 h-10 w-10 border-4 border-purple-700 bg-white text-xl text-purple-700" ios:onSingletap="sideBarClicked" android:onClick="sideBarClicked" />
    </View>

    <!-- My Card -->
    <Animation id="myCardAnimation" module="purgetss.ui" class="open:h-(298) close:h-24 duration-150" />
    <Animation id="myCardAnimationChevron" module="purgetss.ui" class="close:rotate-0 duration-150 open:rotate-180" />

    <View id="myCard" class="mr-6 mt-6 h-24 w-8/12 rounded-lg shadow-lg">
      <View class="vertical rounded-lg bg-white">
        <View class="h-auto w-screen">
          <ImageView class="rounded-16 m-4 ml-4 h-16 w-16" image="https://randomuser.me/api/portraits/women/17.jpg" />
          <View class="vertical ml-24 h-auto">
            <Label class="ml-0 text-sm font-bold text-gray-800" text="Someone Famous" />
            <Label class="ml-0 text-xs font-bold text-gray-400" text="Website Designer" />
          </View>
        </View>
        <View class="rounded-1 mx-2 h-0.5 w-screen bg-gray-300" />
        <View class="bubble-parent-false mt-2 h-48 w-screen grid-flow-row" ios:onSingletap="doAction" android:onClick="doAction">
          <!-- Card menu items: edit profile, inbox, settings, support, sign-out -->
        </View>
      </View>
      <View class="rounded-tl-br-md wh-8 bubble-parent-false mb-0 mr-0 bg-blue-400">
        <Button id="myCardChevron" class="fas fa-chevron-down border-transparent bg-transparent text-white" ios:onSingletap="myCardClicked" android:onClick="myCardClicked" />
      </View>
    </View>

    <Label id="action" class="mx-4 mb-6 h-10 w-screen rounded-lg bg-purple-800 text-sm font-bold text-purple-50" />
  </Window>
</Alloy>
```

### Controller

```javascript
$.index.open()

$.draggableAnimation.draggable($.myCard)

function sideBarClicked() {
  $.sideBarAnimation.play($.sideBar)
  $.sideBarAnimationChevron.play($.sideBarChevron)
}

function myCardClicked() {
  $.myCardAnimation.play($.myCard)
  $.myCardAnimationChevron.play($.myCardChevron)
}

function doAction(event) {
  if (event.source.action) {
    $.action.text = `   Action: ${event.source.action}`
  }
}
```

This demonstrates: `play` for sidebar/card toggle, `open:`/`close:` modifiers for different states, `draggable` with `bounds:` modifier, and multiple Animation objects controlling different UI elements.
