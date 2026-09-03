# `purgetss.ui` in Titanium Classic

Titanium Classic uses the same generated `purgetss.ui` runtime as Alloy, but it does not compile Alloy XML, TSS, utility classes, controllers, or `$.*` references. Configure the runtime with JavaScript objects containing native Titanium properties.

<!-- TOC-START -->
## Contents

- [Install and load](#install-and-load)
- [Public exports](#public-exports)
- [Quick start](#quick-start)
- [Animation method contract](#animation-method-contract)
- [Native animation configuration](#native-animation-configuration)
- [States and direct children](#states-and-direct-children)
- [Position helpers](#position-helpers)
- [Drag and collision configuration](#drag-and-collision-configuration)
- [Drag lifecycle and cleanup](#drag-lifecycle-and-cleanup)
- [Layout transitions](#layout-transitions)
- [Appearance in Classic](#appearance-in-classic)
- [Runtime utilities](#runtime-utilities)
- [Related references](#related-references)

<!-- TOC-END -->

## Install and load

Run this from the Classic project root:

```bash
purgetss module
```

The command creates `Resources/lib/purgetss.ui.js`. Load it from a file such as `Resources/app.js`:

```javascript
const {
  createAnimation,
  Appearance,
  deviceInfo,
  saveComponent
} = require('lib/purgetss.ui')
```

Use `createAnimation(args)` for ordinary Classic code. It returns a zero-size, touch-disabled `Ti.UI.View` decorated with animation methods. Treat this view as a behavior object; do not add it to the window.

## Public exports

| Export | Type and return | Contract |
| --- | --- | --- |
| `AnimationProperties` | Constructor returning the decorated animation view | Public, but less clear than the factory in Classic |
| `createAnimation(args)` | Factory returning the decorated animation view | Preferred Classic entry point |
| `Appearance` | Singleton object | `init()`, `set()`, `get()`, `toggle()` |
| `deviceInfo()` | Function returning `undefined` | Logs platform and display information |
| `saveComponent({ source, directory? })` | Function returning `undefined` | Writes a PNG and invokes the photo-gallery API |

## Quick start

```javascript
const { createAnimation, Appearance } = require('lib/purgetss.ui')

Appearance.init()

const window = Ti.UI.createWindow({ backgroundColor: 'surfaceColor' })
const card = Ti.UI.createView({
  width: 220,
  height: 120,
  backgroundColor: 'accentColor',
  opacity: 0,
  transform: Ti.UI.createMatrix2D().scale(0.92)
})
const motion = createAnimation({
  duration: 220,
  curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
  animationProperties: {
    open: { opacity: 1, scale: 1 },
    close: { opacity: 0, scale: 0.92 }
  }
})

function onCardClick() { motion.play(card) }
function onWindowOpen() { motion.open(card) }
function disposeWindow() {
  card.removeEventListener('click', onCardClick)
  window.removeEventListener('open', onWindowOpen)
  window.removeEventListener('close', disposeWindow)
}

card.addEventListener('click', onCardClick)
window.add(card)
window.addEventListener('open', onWindowOpen)
window.addEventListener('close', disposeWindow)
window.open()
```

`surfaceColor` and `accentColor` are names from `Resources/semantic.colors.json`; see [appearance-module.md#titanium-classic](./appearance-module.md#titanium-classic).

## Animation method contract

| Method | Signature | Return and callback |
| --- | --- | --- |
| `play` | `play(viewOrViews, callback?)` | `undefined`; callback once per view after its base animation completes |
| `toggle` | `toggle(viewOrViews, callback?)` | Exact alias of `play` |
| `apply` | `apply(viewOrViews, callback?)` | `undefined`; synchronous callback once per view |
| `open` | `open(viewOrViews, callback?)` | `undefined`; forces open state, callback once per view |
| `close` | `close(viewOrViews, callback?)` | `undefined`; forces close state, callback once per view |
| `draggable` | `draggable(viewOrViews)` | `undefined` |
| `undraggable` | `undraggable(viewOrViews)` | `undefined` |
| `detectCollisions` | `detectCollisions(views, dragCallback?, dropCallback?)` | `undefined` |
| `sequence` | `sequence(viewOrViews, callback?)` | `undefined`; callback once after the final view |
| `swap` | `swap(view1, view2)` | `undefined` |
| `pulse` | `pulse(view, count = 1)` | `undefined` |
| `shake` | `shake(view, intensity = 10)` | `undefined` |
| `snapTo` | `snapTo(view, targets)` | Selected target, `null` if none qualifies, or `undefined` for a missing source |
| `reorder` | `reorder(views, newOrder)` | `undefined` |
| `transition` | `transition(viewOrViews, layouts)` | `undefined` |

`play`, `toggle`, `apply`, `open`, and `close` accept one view or an array. The array callback runs once per view with:

- `type`: native completion type, or `'applied'` for `apply`.
- `bubbles` and `cancelBubble`: selected native primitives.
- `action`: `'play'` or `'apply'`.
- `state`: `'open'` or `'close'`.
- `id` and `targetId`.
- `index` and `total`.
- `getTarget()`: returns the affected view.

This is a newly constructed object, not the original Titanium event. For array playback, the configured base delay accumulates for successive views. `sequence()` instead waits for each native completion and invokes its callback once after the last view. Passing an empty array to `sequence()` produces no callback.

`animationProperties.complete` starts after the active `play`, `toggle`, `open`, or `close` base phase, and is applied immediately after `apply`. The public play callback does not wait for the second top-level `complete` animation.

## Native animation configuration

Pass native `Ti.UI.Animation` values directly:

```javascript
const { createAnimation } = require('lib/purgetss.ui')

const motion = createAnimation({
  id: 'cardMotion',
  duration: 240,
  delay: 40,
  curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
  repeat: 1,
  autoreverse: false,
  opacity: 0.8,
  backgroundColor: '#2563eb',
  scale: 1.05,
  rotate: 4
})
```

The constructor removes `id` from the native animation object. It converts top-level `scale`, `rotate`, and `anchorPoint` into one `Ti.UI.Matrix2D`; it performs the same conversion separately for `animationProperties.open` and `.close`. Helpers such as `pulse`, `shake`, `swap`, `snapTo`, `reorder`, and `transition` can replace or reset that transform.

Most helpers spread the base object before their method-specific assignments, so later helper fields win. There is no shared `200ms` timing fallback for position/layout helpers. Only `shake()` computes `(duration ?? 400) / 6`, rounded to the nearest millisecond; `pulse()` supplies a default scale of `1.2`. Both force `ANIMATION_CURVE_EASE_IN_OUT`.

Titanium exposes `anchorPoint` differently across platforms. Test pivot-dependent animation on both platforms; in Classic, set the view's iOS anchor point before animation and pass an Android animation anchor point only inside a platform guard.

## States and direct children

```javascript
const panelMotion = createAnimation({
  duration: 220,
  animationProperties: {
    open: { opacity: 1, scale: 1 },
    close: { opacity: 0, scale: 0.94 },
    complete: { borderColor: '#22c55e' },
    children: { duration: 160 }
  }
})

titleLabel.animationProperties = {
  child: { delay: 40 },
  open: { opacity: 1, top: 16 },
  close: { opacity: 0, top: 24 },
  complete: { color: '#22c55e' }
}

panelMotion.open(panel)
```

For a direct child, merge precedence is:

1. Parent `animationProperties.children`.
2. Child `animationProperties.child`.
3. Child's active `open`, `close`, or `complete` object.

Later values win. Nested descendants are not traversed automatically.

## Position helpers

- `swap()` exchanges two rendered positions, temporarily promotes both views, persists `top`/`left`, and updates private drag origins. It restores stacking from the current draggable registry order, not arbitrary original z-index values.
- `snapTo()` chooses the nearest target by center distance and returns it immediately. Views must be laid out because it reads `rect`.
- `reorder()` maps each view to the captured position at `newOrder[index]`. A length mismatch returns without changes.
- `pulse()` forces autoreverse, the supplied repeat count, and ease-in-out, then resets the transform.
- `shake()` starts at `-intensity`, animates to `+intensity` through six short phases, and resets the transform.

These methods do not expose completion callbacks. Configure duration, delay, and curve on the object passed to `createAnimation()`.

## Drag and collision configuration

```javascript
const dragMotion = createAnimation({
  duration: 160,
  bounds: { top: 12, right: 12, bottom: 12, left: 12 },
  draggingType: 'animate',
  draggable: {
    drag: { opacity: 0.7, scale: 1.04 },
    drop: { opacity: 1, scale: 1 }
  },
  animationProperties: {
    keepZIndex: true,
    snap: { back: true, center: true }
  }
})

piece.bounds = { bottom: 40 }
piece.constraint = 'horizontal'
piece.draggingType = 'apply'
piece.draggable = {
  drag: { opacity: 0.5 },
  drop: { opacity: 1 }
}

dragMotion.draggable(piece)
dragMotion.detectCollisions([piece, target], (source, hovered) => {
  target.borderColor = hovered === target ? '#22c55e' : 'transparent'
}, (source, droppedOn) => {
  Ti.API.info(`${source.id} dropped on ${droppedOn.id}`)
})
```

Runtime precedence and behavior:

- Global bounds are the base; `view.bounds` overrides individual edges.
- Axis restriction comes from `view.constraint`; a constructor-level constraint is not read.
- Per-view `draggingType` overrides the constructor value.
- Global and per-view `draggable.drag/drop` objects are merged; view fields win.
- Every resolved drag/drop property is forwarded, including size, transform, and anchor-point fields.
- `snap.center` calls `snapTo()` after a valid drop; `snap.back` returns a missed drop to its origin.
- There is no `snap.magnet` behavior.
- Collision detection tests the dragged view's center against registered targets. The last non-null hover target is a fallback at release.

Call drag/collision setup after the views are attached and laid out. `draggable(array)` assigns each view `zIndex` from its array index before registration. `keepZIndex` only prevents later touch-start promotion; register views individually if their existing z-index values must not be overwritten.

## Drag lifecycle and cleanup

Register each view once. The current runtime does not deduplicate repeated `draggable()` calls: they create additional listeners and registry entries. One `undraggable()` call removes only the latest stored listener set and the first matching registry entries.

`undraggable()` removes the stored `touchstart`, `touchmove`, `touchend`, and global `orientationchange` listeners and most private position/collision fields, but it leaves `_wasDragged`. `detectCollisions()` retains the last non-null callbacks on the animation object; passing `null` does not clear them.

```javascript
let dragReady = false

function enableDrag() {
  if (dragReady) return
  dragReady = true
  dragMotion.draggable(piece)
  dragMotion.detectCollisions([piece, target])
}

function disposeWindow() {
  dragMotion.undraggable([piece, target])
  window.removeEventListener('open', enableDrag)
  window.removeEventListener('close', disposeWindow)
  dragReady = false
}

window.addEventListener('open', enableDrag)
window.addEventListener('close', disposeWindow)
```

Release view, callback, and animation references after close. Application code should not depend on private underscore fields.

## Layout transitions

`transition(views, layouts)` accepts these layout fields:

| Field | Default | Behavior |
| --- | --- | --- |
| `translation` | `{ x: 0, y: 0 }` | Matrix translation |
| `rotate` | `0` | Matrix rotation in degrees |
| `scale` | `1` | Matrix scale |
| `zIndex` | unchanged | Assigned before animation |
| `width`, `height` | unchanged | Optional size animation |
| `opacity` | unchanged | Optional opacity animation |

```javascript
const layoutMotion = createAnimation({
  duration: 220,
  curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
})
const fan = [
  { translation: { x: -120, y: 20 }, rotate: -15, scale: 0.8, zIndex: 1 },
  { translation: { x: 0, y: 0 }, rotate: 0, scale: 1, zIndex: 3 },
  { translation: { x: 120, y: 20 }, rotate: 15, scale: 0.8, zIndex: 2 }
]

layoutMotion.transition([cardA, cardB, cardC], fan)
```

A view without a matching layout fades to opacity `0`, receives `zIndex: 0`, and has touch disabled. Extra layouts are ignored. A later matching layout fades a hidden view in and reenables touch. iOS preserves the last transform while hidden; Android resets transform, translation, rotation, and scale. Completion forces `touchEnabled: true` for every matched view, so reapply `false` afterward when a view must remain non-interactive.

On Mac Catalyst, use a fixed-size parent rather than `Ti.UI.FILL` for rotated layouts; a resizable parent can distort the matrix.

## Appearance in Classic

Put semantic colors in `Resources/semantic.colors.json`, use their names directly in native color properties, and call `Appearance.init()` before opening the first window. Classic does not need utility classes, TSS, `purgetss/config.cjs`, or Alloy runtime files. Run a full native build after adding or changing semantic keys; LiveView alone does not rebuild the native catalog.

See [appearance-module.md#titanium-classic](./appearance-module.md#titanium-classic) for setup and all four method contracts.

## Runtime utilities

```javascript
const { deviceInfo, saveComponent } = require('lib/purgetss.ui')

deviceInfo()

function savePreview() {
  if (!Ti.Media.hasPhotoGalleryPermissions()) {
    Ti.Media.requestPhotoGalleryPermissions(event => {
      if (event.success) savePreview()
    })
    return
  }

  saveComponent({
    source: preview,
    directory: Ti.Filesystem.applicationDataDirectory
  })
}
```

`deviceInfo()` logs values and returns `undefined`. It logs `xdpi` and `ydpi` only on Android. Its tablet flag recognizes iPad only, so Android tablets are currently logged as `isTablet: false` and `isHandheld: true`.

`saveComponent()` calls `source.toImage()`, derives an MD5-based `.png` filename, writes it to `directory` (default: `Ti.Filesystem.tempDirectory`), then invokes `Ti.Media.saveToPhotoGallery()`. It returns `undefined` and provides no completion or error callback. Check/request gallery permission before calling it; on iOS, declare the required photo-library add usage description.

## Related references

- [animation-system.md](./animation-system.md) — Alloy syntax and all animation methods.
- [animation-advanced.md](./animation-advanced.md) — generated timing classes and runtime rules.
- [appearance-module.md](./appearance-module.md) — Appearance workflow and API.
- [classic-projects.md](./classic-projects.md) — commands and capabilities available to Classic projects.
