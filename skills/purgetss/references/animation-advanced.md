# PurgeTSS Animation -- Advanced Reference

Runtime property forwarding, timing/utility classes, utility functions, implementation rules, and complex UI examples.

For core animation methods (play, toggle, apply, open, close, draggable, undraggable, detectCollisions, sequence, swap, pulse, shake, snapTo, reorder, transition), see [animation-system.md](./animation-system.md).

---

<!-- TOC-START -->
## Contents

- [Runtime Property Forwarding](#runtime-property-forwarding)
  - [Forwarding and Overrides](#forwarding-and-overrides)
- [Timing and Utility Classes](#timing-and-utility-classes)
  - [anchorPoint / origin-* Classes](#anchorpoint--origin--classes)
  - [autoreverse](#autoreverse)
  - [Curve Classes](#curve-classes)
  - [delay-*](#delay-)
  - [duration-*](#duration-)
  - [repeat-*](#repeat-)
  - [rotate-* and -rotate-*](#rotate--and--rotate-)
  - [scale-*](#scale-)
  - [Snap Classes](#snap-classes)
  - [keep-z-index](#keep-z-index)
  - [Drag Type](#drag-type)
  - [Opacity and Visibility Utilities](#opacity-and-visibility-utilities)
  - [zoom-in-* / zoom-out-*](#zoom-in---zoom-out-)
- [Utility Functions](#utility-functions)
  - [deviceInfo()](#deviceinfo)
  - [saveComponent({ source, directory })](#savecomponent-source-directory-)
- [Runtime Implementation Rules](#runtime-implementation-rules)
  - [Transform conversion](#transform-conversion)
  - [State and children](#state-and-children)
  - [Arrays and callbacks](#arrays-and-callbacks)
  - [Position and drag state](#position-and-drag-state)
  - [Android position consolidation](#android-position-consolidation)
  - [Transition state](#transition-state)
  - [Cleanup limitations](#cleanup-limitations)
- [Complex UI Example](#complex-ui-example)
  - [XML](#xml)
  - [Controller](#controller)

<!-- TOC-END -->

## Runtime Property Forwarding

The constructor keeps the resolved `<Animation>` properties as its base object. Most helpers spread that object into `Ti.UI.createAnimation()` before adding their own fields. This forwards native values such as `duration`, `delay`, `curve`, `opacity`, or `backgroundColor`, but it does not guarantee that every Titanium property is meaningful for every helper.

When you declare an Animation object with utility classes:

```xml
<Animation id="myAnim" module="purgetss.ui" class="duration-150 delay-100 curve-animation-ease-out" />
```

In Classic, the equivalent values are passed directly to `createAnimation()`; see [purgetss-ui-classic.md](./purgetss-ui-classic.md).

### Forwarding and Overrides

| Method | Forwarded base values | Forced or computed values |
| --- | --- | --- |
| `play` / `toggle` / `open` / `close` | Base object plus active state | Active-state transform |
| `apply` | Base object plus active state | Applies immediately rather than creating native motion |
| `sequence` | Same state values as `play` | Serial start order |
| `swap` | Base object | Destination position; source identity transform |
| `pulse` | Base object | Transform fallback, `autoreverse`, `repeat`, and curve |
| `shake` | Non-overridden base values | Transform, divided duration, `autoreverse`, `repeat`, and curve |
| `snapTo` / `reorder` | Base object | Destination position and identity transform |
| `transition` | Base object | Combined layout transform and optional size/opacity |

Method-specific assignments are appended after the spread and therefore win on duplicate keys. The method parameters are feature-specific rather than alternative timing values:

```javascript
// All timing controlled by the Animation object's classes
$.myAnim.swap($.card1, $.card2)
$.myAnim.reorder(cards, [2, 0, 1])
$.myAnim.shake($.errorField, 20)
$.myAnim.snapTo($.card, targets)
$.myAnim.transition(views, fanOutLayout)
```

There is no shared `200ms`/`0ms`/`EASE_IN_OUT` fallback for `swap`, `snapTo`, `reorder`, or `transition`. Configure timing on the Animation object when predictable visible motion matters. Only `shake` computes `(duration ?? 400) / 6`; `pulse` supplies a default scale of `1.2`. Both helpers force ease-in-out.

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

Generated utility inventories may still contain `snap-magnet` names, but the current `purgetss.ui` runtime never reads `animationProperties.snap.magnet`. Do not use or recommend those classes as working drag behavior.

### keep-z-index

Prevents the drag system from promoting the active view on touch start. It does not prevent `draggable(array)` from first assigning each view `zIndex` from its array position, and `swap()` restores z-order from the current draggable registry rather than arbitrary original values.

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

Logs platform and display information and returns `undefined`. It includes `xdpi` and `ydpi` only on Android. Its tablet flag currently recognizes iPad only, so Android tablets are reported as handheld.

```javascript
const { deviceInfo } = require('purgetss.ui')
deviceInfo()
```

Classic loads the generated file with `require('lib/purgetss.ui')`.

### saveComponent({ source, directory })

Calls `source.toImage()`, creates an MD5-based PNG filename, writes it to `directory` (default: `Ti.Filesystem.tempDirectory`), and then invokes `Ti.Media.saveToPhotoGallery()`. It returns `undefined` and has no completion or error callback.

```javascript
const { saveComponent } = require('purgetss.ui')
saveComponent({ source: $.myView, directory: Ti.Filesystem.applicationDataDirectory })
```

Check or request photo-gallery permission before calling it. On iOS, declare the photo-library add usage description required by Titanium. Classic uses `require('lib/purgetss.ui')`; see [purgetss-ui-classic.md#runtime-utilities](./purgetss-ui-classic.md#runtime-utilities).

---

## Runtime Implementation Rules

These are observable rules of the generated module. Use them to diagnose surprising output; they are not a template or promise for future extension methods.

### Transform conversion

At construction time, top-level `scale`, `rotate`, and `anchorPoint` are converted into one `Ti.UI.Matrix2D` and removed from the base object. Separate matrices are prepared for `animationProperties.open` and `.close`. `pulse`, `shake`, `swap`, `snapTo`, `reorder`, and `transition` may replace or reset that transform, so a position helper does not promise to preserve it.

### State and children

`play()`, `toggle()`, `apply()`, and `sequence()` toggle internal open/close state. `open()` and `close()` set it explicitly. The active state is merged into the current base object when `animationProperties` exists.

After a top-level `play`, `toggle`, `open`, or `close`, `animationProperties.complete` starts as a second animation. `apply()` applies `complete` immediately. The public callback belongs to the base play/apply operation; it does not wait for the second top-level `complete` animation.

For each direct child with an active state, merge precedence is:

1. Parent `animationProperties.children`.
2. Child `animationProperties.child`.
3. Child `animationProperties.open`, `.close`, or `.complete`.

Later objects win. Only direct children of the target are considered.

### Arrays and callbacks

`play()`, `open()`, `close()`, and `apply()` accept one view or an array. Array callbacks run once per view and include `index`, `total`, and `getTarget()`. The configured base delay accumulates for successive views. `sequence()` waits for each native completion and invokes its callback once after the final view; an empty array never invokes it.

The callback is a new object containing selected native primitives plus PurgeTSS metadata. It is not the original Titanium event.

### Position and drag state

`swap()`, `snapTo()`, and `reorder()` persist destinations with `applyProperties()` and update private origin fields. They fall back to rendered `rect` coordinates, so call them only after layout.

Drag precedence is precise:

- Constructor bounds are the base; `view.bounds` overrides individual edges.
- Axis restriction comes only from `view.constraint`.
- `view.draggingType` overrides constructor `draggingType`.
- Constructor `draggable.drag/drop` is merged with `view.draggable.drag/drop`; view properties win.
- Every resolved drag/drop property is forwarded to Titanium.
- `snap.center` invokes `snapTo()` after a valid drop; `snap.back` returns a missed drop to its captured origin.
- No `snap.magnet` behavior exists.

Collision detection uses the dragged view's center. On release, the last non-null hover target is a fallback when the final hit test returns `null`.

`draggable(array)` immediately assigns each view `zIndex` from its array index. `keepZIndex` only disables later touch-start promotion. `swap()` restores z-order by the current draggable-registry order, not by arbitrary values present before registration.

### Android position consolidation

Android drag uses zero-duration native animations. At touch end, when translation state exists, the runtime consolidates `translation`, `rotate`, `scale`, and an equivalent `Matrix2D` before collision, snap, or drop callbacks. It does not consolidate only `top` and `left`. iOS uses synchronous property application for standard dragging and a separate transformed-view path.

### Transition state

`transition()` builds one matrix per view from translation, rotation, and scale, applies a supplied `zIndex` before animation, and can animate width, height, and opacity.

Without a matching layout, a view fades out, receives `zIndex: 0`, and has touch disabled. iOS preserves its last transform; Android resets transform, translation, rotation, and scale. A later layout fades the view back in. Completion forces `touchEnabled: true` for every matched view, so reapply `false` for intentionally non-interactive views.

### Cleanup limitations

`undraggable()` removes the latest stored touch/orientation listeners, the first matching draggable and collision registrations, and most private drag state. Current limitations require application discipline:

- `draggable()` does not deduplicate. Repeated registration creates extra listeners and entries that one cleanup call cannot fully remove.
- `_wasDragged` remains on the view after `undraggable()`.
- `detectCollisions()` retains non-null callbacks on the animation object; passing `null` later does not clear them.

Register each view once. On window close, call `undraggable()` for draggable views and registered collision targets, remove application-owned listeners, and release callbacks and animation references that are no longer needed. Do not make application code depend on private underscore fields.

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
