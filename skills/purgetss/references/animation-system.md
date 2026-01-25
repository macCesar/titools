# PurgeTSS Animation System

The `<Animation>` component (`purgetss.ui`) provides declarative, native 2D Matrix animations and transformations for Titanium.

:::info
**PurgeTSS** includes an Animation module to apply simple 2D Matrix animations and transformations to any element, an array of elements, or even to individual children of an element.
:::

## Installation

```bash
purgetss module
# or
purgetss m
```

Installs `purgetss.ui.js` in `app/lib/`.

## Basic Usage

```xml
<Animation id="myAnimation" module="purgetss.ui" class="duration-200 opacity-0 open:opacity-100" />
```

```javascript
$.myAnimation.play($.myView)
```

## Method Reference

### `play(views, [callback])`

Animates target(s) using defined class properties.

```javascript
$.myAnimation.play($.myView)
$.myAnimation.play([$.view1, $.view2])
$.myAnimation.play($.myView, () => { console.log('done') })
```

**Use cases:**
- One-time animations
- Sequences with callbacks
- Animating multiple views simultaneously

### `toggle(views, [callback])`

Alternates between `open:` and `close:` states.

```javascript
$.myAnimation.toggle($.myView)
```

**Use cases:**
- UI state toggles (show/hide)
- Accordion behavior
- Alternating animations

### `open(views, [callback])`

Forces transition to the `open:` state.

```javascript
$.myAnimation.open($.myView, () => {
  console.log('Opened!');
})
```

**Use cases:**
- Explicit open state management
- Menu/drawer opening
- Modal appearance

### `close(views, [callback])`

Forces transition to the `close:` state.

```javascript
$.myAnimation.close($.myView)
```

**Use cases:**
- Explicit close state management
- Menu/drawer closing
- Modal dismissal

:::info
The `open` and `close` methods provide explicit control over animation states, as opposed to `play` or `toggle` which alternate based on current state.
:::

### `apply(views)`

Applies properties instantly without animation (bypasses bridge thread).

```javascript
$.myAnimation.apply($.myView)
```

**Use cases:**
- Resetting to initial state
- Instant style changes
- Setting up initial positions

### `draggable(views)`

Enables interactive drag-and-drop logic.

```javascript
$.myAnimation.draggable($.myView)
```

**Use cases:**
- Draggable cards
- Interactive sliders
- Custom drag interfaces

## State Modifiers

Define behavior in the `class` attribute:

### `open:` and `close:`

Properties for opening/closing phases.

```xml
<Animation class="close:opacity-0 close:w-28 open:opacity-100 open:w-11/12" />
```

### `complete:`

Immediate properties applied AFTER `open:` phase finishes.

```xml
<Animation class="open:scale-1 complete:bg-(#008800) complete:scale-100" />
```

:::tip
Use `complete:` for post-animation state - e.g., setting a background color after a fade-in completes.
:::

### `children:`

Applies animation rules globally to ALL children of target View.

```xml
<Animation class="children:opacity-50 complete:opacity-100" />

<View>
  <Label />  <!-- All children affected -->
  <View />   <!-- All children affected -->
</View>
```

### `child:`

Targets specific child properties by index (0-based).

```xml
<Animation class="child:0:bg-red-500 child:1:bg-blue-500" />

<View>
  <Label />  <!-- Index 0: Red background -->
  <View />   <!-- Index 1: Blue background -->
</View>
```

## Animation Modifiers

### Timing

- `delay-{ms}` - Delay before animation starts
- `duration-{ms}` - Animation duration
- `ease-in`, `ease-out`, `ease-linear`, `ease-in-out` - Animation curves

```xml
<Animation class="delay-300 duration-500 ease-out" />
```

### Transformation

- `rotate-{degrees}` - Rotation
- `scale-{0-150}` - Scaling (auto-resets to 100% after phase)
- `zoom-in-{0-150}`, `zoom-out-{0-150}` - Zoom effects

```xml
<Animation class="rotate-45 scale-110" />
```

### Repetition

- `repeat-{n}` - Number of repetitions
- `autoreverse` / `autoreverse-false` - Auto-reverse on phase completion

```xml
<Animation class="repeat-3 autoreverse" />
```

### Anchor Points

Control transformation origin: `origin-center`, `origin-top`, `origin-top-right`, `origin-right`, `origin-bottom-right`, `origin-bottom`, `origin-bottom-left`, `origin-left`, `origin-top-left`

```xml
<Animation class="origin-center scale-125" />
```

## Opacity Utilities

- `opacity-to-0` - Fade out
- `opacity-to-100` - Fade in

```xml
<Animation class="opacity-to-0" />
```

## Visibility Utility

- `toggle-visible` - Handles `visible` property based on state

```xml
<Animation class="close:visible open:toggle-visible" />
```

## Drag & Drop Features

### Basic Draggable

```xml
<Animation id="dragMe" class="bounds:m-4" />

<View id="dragMe" class="w-32 h-32 bg-blue-500" />
```

```javascript
$.dragMe.draggable($.dragMe)
```

### Constraint Modifiers

- `horizontal-constraint` - Restrict to horizontal movement
- `vertical-constraint` - Restrict to vertical movement

```xml
<Animation class="horizontal-constraint bounds:m-4" />
```

### Drag Behavior Modifiers

- `drag-animate` - Smooth animation while dragging
- `drag-apply` - Instant property changes while dragging

```xml
<Animation class="drag-animate" />
```

### Event State Modifiers

- `drag:` - Properties when dragging
- `drop:` - Properties when dropped

```xml
<Animation class="drag:opacity-50 drag:scale-105 drop:scale-100" />
```

### Bounds

`bounds:m-{size}` - Sets movement limits within parent View.

```xml
<Animation class="bounds:m-4" />
```

The margin value defines the boundary box size.

## Complete Example: Wordle Animation

```xml
<Alloy>
  <Window class="bg-(#181e2d)">
    <Animation id="myAnimationReset" class="bg-transparent" />
    <Animation id="myAnimationOpen" class="open:scale-1 complete:bg-(#008800) complete:scale-100" />

    <View id="letters" class="horizontal">
      <Label class="wh-10 mx-1 rounded border-white bg-transparent text-center text-white" text="T" />
      <Label class="wh-10 mx-1 rounded border-white bg-transparent text-center text-white" text="I" />
      <Label class="wh-10 mx-1 rounded border-white bg-transparent text-center text-white" text="T" />
      <Label class="wh-10 mx-1 rounded border-white bg-transparent text-center text-white" text="A" />
      <Label class="wh-10 mx-1 rounded border-white bg-transparent text-center text-white" text="N" />
      <Label class="wh-10 mx-1 rounded border-white bg-transparent text-center text-white" text="I" />
      <Label class="wh-10 mx-1 rounded border-white bg-transparent text-center text-white" text="U" />
      <Label class="wh-10 mx-1 rounded border-white bg-transparent text-center text-white" text="M" />
    </View>

    <Button title="Animate" onClick="doAnimate" />
    <Button title="Reset" onClick="doReset" />
  </Window>
</Alloy>
```

```javascript
function doAnimate() {
  $.myAnimationOpen.play($.letters.children)
}

function doReset() {
  $.myAnimationReset.apply($.letters.children)
}

$.index.open()
```

## Twitter Re-tweet Animation Example

```xml
<Animation id="changeRetweet" class="close:duration-150 close:-mb-52 open:-mb-16 open:duration-200" />

<View id="retweetView" class="vertical -mb-52 h-48 w-screen rounded-2xl bg-gray-800">
  <View class="bg-slate-700 mt-4 h-1 w-8" />
  <View class="horizontal mx-4 mt-4">
    <Label class="text-slate-500 fas fa-retweet w-7 text-xl" />
    <Label class="ml-2 text-left text-xl text-white" text="Re-Tweet" />
  </View>
</View>
```

```javascript
function retweetFn() {
  $.changeRetweet.play($.retweetView)
}
```

## Best Practices

### 1. Use Semantic IDs

```xml
<!-- Good -->
<Animation id="fadeIn" class="close:opacity-0 open:opacity-100" />
<Animation id="expandCard" class="close:h-20 open:h-40" />

<!-- Avoid -->
<Animation id="anim1" class="..." />
<Animation id="anim2" class="..." />
```

### 2. Combine Methods for Sequences

```javascript
function playSequence() {
  $.fadeIn.play($.view1, () => {
    $.expandCard.play($.view2)
  })
}
```

### 3. Use `complete:` for Post-Animation State

```xml
<Animation class="open:scale-110 complete:scale-100 duration-200" />
```

### 4. Leverage `children:` for Batch Animations

```xml
<Animation class="children:opacity-0 complete:opacity-100 duration-300" />

<View>
  <Label /> <!-- All fade in together -->
  <View />  <!-- All fade in together -->
</View>
```

### 5. Use `toggle:` for UI States

```javascript
function toggleMenu() {
  $.menuAnimation.toggle($.menuView)
}
```

## Common Patterns

### Modal Fade In/Out

```xml
<Animation id="modalFade" class="close:opacity-0 open:opacity-100" />

<View id="modalView" class="opacity-0">
  <!-- Modal content -->
</View>
```

```javascript
// Open
$.modalFade.open($.modalView)

// Close
$.modalFade.close($.modalView)
```

### Slide Up/Down

```xml
<Animation id="slideUp" class="close:translate-y-full open:translate-y-0" />
```

### Scale on Touch

```xml
<Animation id="cardPop" class="open:scale-105 duration-200" />

<View class="w-screen bg-white shadow" onTouchstart="onCardTouch">
  <!-- Card content -->
</View>
```

```javascript
function onCardTouch(e) {
  $.cardPop.play(e.source)
}
```

### Draggable Element

```xml
<Animation id="draggableCard" class="bounds:m-8" />

<View id="card" class="w-64 h-32 bg-white shadow" />
```

```javascript
$.draggableCard.draggable($.card)
```

## Animation Properties Summary

| Modifier | Purpose | Example |
|----------|---------|---------|
| `open:` | Opening state properties | `open:opacity-100 open:w-full` |
| `close:` | Closing state properties | `close:opacity-0 close:h-0` |
| `complete:` | Post-open state | `complete:bg-green-500` |
| `children:` | All children affected | `children:opacity-50` |
| `child:{n}` | Specific child by index | `child:0:bg-red-500` |
| `drag:` | Dragging state | `drag:opacity-50` |
| `drop:` | Dropped state | `drop:scale-95` |
| `bounds:` | Movement limits | `bounds:m-4` |

| Utility | Purpose | Example |
|---------|---------|---------|
| `delay-{ms}` | Start delay | `delay-300` |
| `duration-{ms}` | Duration | `duration-500` |
| `ease-*` | Animation curve | `ease-out` |
| `rotate-*` | Rotation | `rotate-45` |
| `scale-*` | Scale | `scale-110` |
| `zoom-in-*` | Zoom in | `zoom-in-125` |
| `zoom-out-*` | Zoom out | `zoom-out-75` |
| `opacity-to-0` | Fade out | `opacity-to-0` |
| `opacity-to-100` | Fade in | `opacity-to-100` |
| `toggle-visible` | Visibility toggle | `toggle-visible` |
