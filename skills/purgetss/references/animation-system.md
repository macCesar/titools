# PurgeTSS Animation System

The `<Animation>` component (`purgetss.ui`) provides declarative, native 2D Matrix animations and transformations for Titanium.

:::info
**PurgeTSS** includes an Animation module to apply simple 2D Matrix animations and transformations to any element, an array of elements, or even to individual children of an element.
:::

The Animation object describes the properties of an animation. It represents:
- A single-phase animation with an end state
- A multi-phase animation using the `open`, `close`, and `complete` modifiers
- Global states for children of a View using the `children` modifier

When the `play` method is called on a View, the View is animated from its current state to the state described by the `Animation` object. The properties that can be animated include the view's position, size, colors, transformation matrix, and opacity.

## Table of Contents

- [PurgeTSS Animation System](#purgetss-animation-system)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
  - [Available Methods](#available-methods)
  - [The `play` Method](#the-play-method)
    - [`play(views, [callback])`](#playviews-callback)
    - [Play Example 1](#play-example-1)
    - [Play Example 2: Complex Animations with States](#play-example-2-complex-animations-with-states)
    - [`toggle(views, [callback])`](#toggleviews-callback)
  - [The `open` and `close` Methods](#the-open-and-close-methods)
    - [`open(views, [callback])`](#openviews-callback)
      - [Open Method Example](#open-method-example)
    - [`close(views, [callback])`](#closeviews-callback)
      - [Close Method Example](#close-method-example)
  - [The `apply` Method](#the-apply-method)
    - [`apply(views)`](#applyviews)
    - [Apply Example: TikTok-like Interface](#apply-example-tiktok-like-interface)
  - [The `draggable` Method](#the-draggable-method)
    - [Draggable Example](#draggable-example)
    - [`drag` and `drop` Modifiers](#drag-and-drop-modifiers)
      - [Drag \& Drop Example](#drag--drop-example)
    - [`draggingType` Property](#draggingtype-property)
      - [Dragging Type Example](#dragging-type-example)
    - [`bounds` Modifier](#bounds-modifier)
      - [Bounds Example 1: Local Bounds](#bounds-example-1-local-bounds)
      - [Bounds Example 2: Global Bounds](#bounds-example-2-global-bounds)
    - [`vertical` and `horizontal` Constraints](#vertical-and-horizontal-constraints)
      - [Constraint Example](#constraint-example)
  - [State Modifiers](#state-modifiers)
    - [`open:` and `close:`](#open-and-close)
    - [`complete:` Modifier](#complete-modifier)
      - [Complete Example: Wordle Animation](#complete-example-wordle-animation)
    - [`children:`](#children)
    - [`child:`](#child)
  - [Complex UI Elements](#complex-ui-elements)
  - [Available Utilities](#available-utilities)
    - [anchorPoint](#anchorpoint)
    - [autoreverse](#autoreverse)
    - [curve](#curve)
    - [delay](#delay)
    - [duration](#duration)
    - [repeat](#repeat)
    - [rotate](#rotate)
    - [scale](#scale)
    - [drag-apply, drag-animate](#drag-apply-drag-animate)
    - [opacity-to-\*, toggle-visible](#opacity-to--toggle-visible)
    - [zoom-in-*, zoom-out-*](#zoom-in--zoom-out-)
  - [Best Practices](#best-practices)
    - [1. Use Semantic IDs](#1-use-semantic-ids)
    - [2. Combine Methods for Sequences](#2-combine-methods-for-sequences)
    - [3. Use `complete:` for Post-Animation State](#3-use-complete-for-post-animation-state)
    - [4. Leverage `children:` for Batch Animations](#4-leverage-children-for-batch-animations)
    - [5. Use `toggle` for UI States](#5-use-toggle-for-ui-states)
  - [Common Patterns](#common-patterns)
    - [Modal Fade In/Out](#modal-fade-inout)
    - [Slide Up/Down](#slide-updown)
    - [Scale on Touch](#scale-on-touch)
    - [Draggable Element with Bounds](#draggable-element-with-bounds)
  - [Animation Properties Summary](#animation-properties-summary)
    - [State Modifiers](#state-modifiers-1)
    - [Timing and Special Classes](#timing-and-special-classes)

---

## Installation

```bash
purgetss module
# or
purgetss m
```

Installs `purgetss.ui.js` in `app/lib/`.

## Basic Usage

```xml
<Animation id="myAnimation" module="purgetss.ui" class="opacity-0 duration-200 open:opacity-100" />
```

```javascript
$.myAnimation.play($.myView)
```

**You can set any position, size, colors, transformation, and opacity classes from `tailwind.tss`.**

---

## Available Methods

| Method           | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `play`, `toggle` | Animate element(s) or children with Animation properties |
| `open`, `close`  | Explicitly manage opening/closing animations             |
| `apply`          | Apply properties instantly without animation             |
| `draggable`      | Convert View(s) to draggable elements                    |

---

## The `play` Method

The `play` method is used to reproduce the animation for a single view or an array of views. You can chain multiple Animation objects with callback functions to create a sequence of animations.

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

### Play Example 1

Create an Animation element and the view you want to animate, and set the desired properties.

```xml title="index.xml"
<Alloy>
  <Window>
    <Animation module="purgetss.ui" id="myAnimation" class="wh-32 bg-green-500 duration-1000" />

    <View id="square" class="wh-16 bg-blue-500" />
  </Window>
</Alloy>
```

```javascript title="index.js"
$.index.open()

$.myAnimation.play($.square)
```

When the `play` method is called, the blue square will go from size 64x64 to 128x128 and change its color to green.

### Play Example 2: Complex Animations with States

```xml title="index.xml"
<Alloy>
  <Window class="keep-screen-on">
    <Animation id="changeWidth" class="close:w-28 debug open:w-11/12" module="purgetss.ui" />
    <Animation id="changeColor" class="close:bg-blue-700 debug open:bg-purple-500" module="purgetss.ui" />
    <Animation id="changeTransparency" class="close:duration-300 open:mt-(null) close:mt-8 open:h-11/12 close:w-14 close:h-14 close:opacity-100 open:w-10/12 open:opacity-50 open:duration-150" module="purgetss.ui" />
    <Animation id="changeRetweet" class="close:duration-150 close:-mb-52 open:-mb-16 open:duration-200" module="purgetss.ui" />

    <View class="vertical">
      <Button class="ios:mt-16 mt-1 w-48 rounded bg-purple-500 text-purple-50" onClick="squaresFn" title="3 Squares" />
      <Button class="mt-2 w-48 rounded bg-purple-500 text-purple-50" onClick="toggleFn" title="Toggle Colors" />
      <Button class="mt-2 w-48 rounded bg-purple-500 text-purple-50" onClick="retweetFn" title="Toggle Re-Tweet" />

      <View id="squaresView" class="vertical mt-10 w-screen">
        <View class="wh-28 rounded-xl bg-blue-700" />
        <View class="wh-28 mt-4 rounded-xl bg-blue-700" />
        <View class="wh-28 mt-4 rounded-xl bg-blue-700" />
      </View>
    </View>

    <View id="blueSquareView" class="mt-8 h-14 w-14 rounded-xl bg-blue-500" onClick="transparencyFn" />

    <View id="retweetView" class="vertical -mb-52 h-48 w-screen rounded-2xl bg-gray-800" onClick="retweetFn">
      <View class="mt-4 h-1 w-8 bg-slate-700" />

      <View class="horizontal mx-4 mt-4">
        <Label class="fas fa-retweet w-7 text-xl text-slate-500" />
        <Label class="ml-2 text-left text-xl text-white" text="Re-Tweet" />
      </View>

      <View class="horizontal mx-4 mt-4">
        <Label class="fas fa-pencil-alt w-7 text-xl text-slate-500" />
        <Label class="ml-2 text-left text-xl text-white" text="Quote Tweet" />
      </View>
    </View>
  </Window>
</Alloy>
```

```javascript title="index.js"
function transparencyFn() {
  $.changeTransparency.play($.blueSquareView)
}

function toggleFn() {
  $.changeColor.toggle($.squaresView.children)
}

function squaresFn() {
  $.changeWidth.play($.squaresView.children)
}

function retweetFn() {
  $.changeRetweet.play($.retweetView)
}

$.index.open()
```

### `toggle(views, [callback])`

Alternates between `open:` and `close:` states.

```javascript
$.myAnimation.toggle($.myView)
```

**Use cases:**
- UI state toggles (show/hide)
- Accordion behavior
- Alternating animations

---

## The `open` and `close` Methods

The `open` and `close` methods provide a clear and straightforward way to manage the opening and closing animations of your views, utilizing the predefined classes with the `open` and `close` modifiers.

By using these methods, you can ensure consistent and manageable animation behavior across your application, as opposed to using the `play` or `toggle` methods, which alternate between the `open` and `close` states based on the current state of the view.

This explicit control helps in scenarios where the exact state of the view is crucial for the desired user experience or application logic.

### `open(views, [callback])`

The `open` method triggers the opening animation for the specified views. It uses the properties defined under the classes with the `open` modifier.

```javascript
$.myAnimation.open(views, callback);
```

- `views`: The view or array of views to apply the opening animation to.
- `callback`: An optional callback function that gets called when the animation completes.

#### Open Method Example

```xml title="index.xml"
<Alloy>
  <Window>
    <Animation module="purgetss.ui" id="myAnimation" class="close:opacity-0 open:opacity-100" />

    <View id="myView" class="opacity-0" />
  </Window>
</Alloy>
```

```javascript title="index.js"
$.myAnimation.open($.myView, () => {
  console.log('Open animation complete');
});
```

In this example, the `myView` element will apply the animation properties defined in the classes with the `open` modifier when the `open` method is called, making the view fully opaque.

### `close(views, [callback])`

The `close` method triggers the closing animation for the specified views. It uses the properties defined under the classes with the `close` modifier.

```javascript
$.myAnimation.close(views, callback);
```

- `views`: The view or array of views to apply the closing animation to.
- `callback`: An optional callback function that gets called when the animation completes.

#### Close Method Example

```xml title="index.xml"
<Alloy>
  <Window>
    <Animation module="purgetss.ui" id="myAnimation" class="close:opacity-0 open:opacity-100" />

    <View id="myView" class="opacity-100" />
  </Window>
</Alloy>
```

```javascript title="index.js"
$.myAnimation.close($.myView, () => {
  console.log('Close animation complete');
});
```

In this example, the `myView` element will apply the animation properties defined in the classes with the `close` modifier when the `close` method is called, making the view fully transparent.

:::info
The `open` and `close` methods provide explicit control over animation states, as opposed to `play` or `toggle` which alternate based on current state.
:::

---

## The `apply` Method

Use the `apply` method when you need to immediately apply the properties and transformations to a view without any animation.

### `apply(views)`

Applies properties instantly without animation (bypasses bridge thread).

```javascript
$.myAnimation.apply($.myView)
```

**Use cases:**
- Resetting to initial state
- Instant style changes
- Setting up initial positions

### Apply Example: TikTok-like Interface

The `apply` method sets the properties instantly. In this example, the `ScrollableView` is rotated 90 degrees, and its content is counter-rotated -90 degrees to simulate a **TikTok-like** interface.

```xml title="index.xml"
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

```javascript title="index.js"
$.rotate.apply($.scrollableView)

$.counterRotate.apply($.scrollableView.views)

$.index.open()
```

---

## The `draggable` Method

The `draggable` method allows you to convert any view or an array of views into draggable elements.

- You can set **basic animations** when dragging or dropping elements using the `drag:` and `drop:` modifiers.
- You can `apply` or `animate` the properties either globally or locally using the `drag-apply` or `drag-animate` classes.
- You can also constrain any view using the `horizontal-constraint` or `vertical-constraint` classes.

```javascript
// Calling a draggable method
$.draggableAnimation.draggable('A View or an array of Views')
```

:::info
**You can create a blank `Animation` object or use an existing one to call the `draggable` method to convert a view or array of views into 'draggable' objects.**

**When using an Animation object on an array of views, it will handle the zIndex of each draggable element.**
:::

### Draggable Example

```xml title="index.xml"
<Alloy>
  <Window class="keep-screen-on exit-on-close-false">
    <Animation module="purgetss.ui" id="draggableAnimation" />

    <Label text="Draggable Example" class="mt-16 text-center" />

    <View id="red" class="ml-4 h-32 w-32 rounded-lg bg-red-500" />

    <View id="green" class="ml-10 h-32 w-32 rounded-lg bg-green-500" />

    <View id="blue" class="ml-16 h-32 w-32 rounded-lg bg-blue-500" />
  </Window>
</Alloy>
```

```javascript title="index.js"
$.index.open()

$.draggableAnimation.draggable([$.red, $.green, $.blue])
```

### `drag` and `drop` Modifiers

The `drag:` and `drop:` modifiers allow you to set basic animations while dragging and dropping elements.

- You can set 'global' modifiers in the `Animation` object, or you can set individual modifiers for each view.
- Local modifiers will overwrite any global modifier.

:::info
To simplify things, we are restricting the types of animations that can be applied while dragging (or dropping).

**Mainly, we are not applying any `size`, `scale`, or `anchorPoint` transformation.**
:::

#### Drag & Drop Example

```xml title="index.xml"
<Alloy>
  <Window class="keep-screen-on exit-on-close-false">
    <!-- Global set of modifiers -->
    <Animation id="draggableAnimation" module="purgetss.ui" class="drag:duration-100 drag:opacity-50 drop:opacity-100" />

    <Label text="Global Modifiers:\ndrag:duration-100 drag:opacity-50 drop:opacity-100" class="mt-16 text-center" />

    <!-- No local modifiers -->
    <Label id="red" class="mx-2 ml-4 h-32 w-32 rounded-lg bg-red-500 text-center text-xs text-white" text="No local modifiers" />

    <!-- drag:bg-green-800 drop:bg-green-500 -->
    <Label id="green" class="drag:bg-green-800 drop:bg-green-500 ml-10 h-32 w-32 rounded-lg bg-green-500 text-center text-xs text-white" text="drag:bg-green-800 drop:bg-green-500" />

    <!-- drag:opacity-25 -->
    <Label id="blue" class="drag:opacity-25 ml-16 h-32 w-32 rounded-lg bg-blue-500 text-center text-xs text-white" text="drag:opacity-25" />
  </Window>
</Alloy>
```

### `draggingType` Property

To control how `drag:` and `drop:` modifiers are applied, you can use either the `drag-animate` (default) or `drag-apply` class. The `drag-animate` class will animate the properties, while the `drag-apply` class will apply them immediately.

```css title="tailwind.tss"
/* Component(s): For the Animation Component */
/* Property(ies): draggingType */
.drag-apply { draggingType: 'apply' }
.drag-animate { draggingType: 'animate' }
```

#### Dragging Type Example

In the following example, the `Animation` element sets the global dragging type to `drag-apply`, but the green square overwrites it to `drag-animate`.

```xml title="index.xml"
<Alloy>
  <Window class="keep-screen-on exit-on-close-false">
    <!-- Global set of modifiers -->
    <Animation id="draggableAnimation" module="purgetss.ui" class="drag-apply drag:duration-500 drag:opacity-50 drop:opacity-100" />

    <Label text="draggingType Example:\ndrag-apply drag:duration-500 drag:opacity-50 drop:opacity-100" class="mt-16 text-center" />

    <!-- No local modifiers, will be using the global modifiers -->
    <Label id="red" class="ml-4 h-32 w-32 rounded-lg bg-red-500 text-center text-xs text-white" text="No local modifiers" />

    <!-- drag-animate drag:bg-green-800 drop:bg-green-500 -->
    <Label id="green" class="drag-animate drag:bg-green-800 drop:bg-green-500 ml-10 h-32 w-32 rounded-lg bg-green-500 text-center text-xs text-white" text="drag-animate drag:bg-green-800 drop:bg-green-500" />

    <!-- drag:opacity-25 -->
    <Label id="blue" class="drag:opacity-25 ml-16 h-32 w-32 rounded-lg bg-blue-500 text-center text-xs text-white" text="drag:opacity-25" />
  </Window>
</Alloy>
```

### `bounds` Modifier

You can set boundaries in which a view can move within its parent view using the `bounds:` modifier.

- You can set global boundaries in the Animation object and/or local boundaries for each individual child view.
- Local values will overwrite any global values.

#### Bounds Example 1: Local Bounds

The `card` view has a boundary of `m-4` and a bottom boundary of `mb-16`.

```xml title="index.xml"
<Alloy>
  <Window class="keep-screen-on exit-on-close-false bg-green-50">
    <Animation id="draggableAnimation" module="purgetss.ui" />

    <View class="mx-6 mb-6 mt-10 h-screen w-screen rounded-lg bg-green-200">
      <View id="card" class="bounds:m-2 bounds:mb-16 mt-8 h-24 w-64 shadow-lg">
        <View id="cardInside" class="w-screen rounded-lg border-2 border-purple-700 bg-white">
          <ImageView id="theImage" class="rounded-16 prevent-default-image m-4 ml-4 h-16 w-16 bg-gray-50" image="https://randomuser.me/api/portraits/women/17.jpg" />

          <View class="vertical ml-24 w-screen">
            <Label class="ml-0 text-sm font-bold text-gray-800" text="Ms. Jane Doe" />
            <Label class="ml-0 text-xs font-bold text-gray-400" text="Website Designer" />
          </View>
        </View>
      </View>

      <Label class="bg-(#80000000) mx-2 mb-2 h-12 w-screen rounded-lg text-center text-white" text="Some Element..." />
    </View>
  </Window>
</Alloy>
```

```javascript title="index.js"
$.index.open()

$.draggableAnimation.draggable($.card)
```

#### Bounds Example 2: Global Bounds

In this example, the boundaries are set globally in the `draggableAnimation` view. Every card view will use these global values.

```xml title="index.xml"
<Alloy>
  <Window class="keep-screen-on exit-on-close-false bg-green-50">
    <Animation id="draggableAnimation" module="purgetss.ui" class="bounds:m-2 bounds:mb-16" />

    <View class="wh-screen mx-6 mb-6 mt-10 rounded-lg bg-green-200">
      <View id="card" class="mt-8 h-24 w-64 shadow-lg">
        <View id="cardInside" class="w-screen rounded-lg border-2 border-purple-700 bg-white">
          <ImageView id="theImage" class="rounded-16 prevent-default-image wh-16 m-4 bg-gray-50" image="https://randomuser.me/api/portraits/women/17.jpg" />

          <View class="vertical ml-24 w-screen">
            <Label class="ml-0 text-sm font-bold text-gray-800" text="Ms. Jane Doe" />
            <Label class="ml-0 text-xs font-bold text-gray-400" text="Website Designer" />
          </View>
        </View>
      </View>

      <View id="card2" class="mt-40 h-24 w-64 shadow-lg">
        <View id="cardInside" class="w-screen rounded-lg border-2 border-purple-700 bg-white">
          <ImageView id="theImage" class="rounded-16 prevent-default-image wh-16 m-4 bg-gray-50" image="https://randomuser.me/api/portraits/women/21.jpg" />

          <View class="vertical ml-24 w-screen">
            <Label class="ml-0 text-sm font-bold text-gray-800" text="Ms. Jane Doe" />
            <Label class="ml-0 text-xs font-bold text-gray-400" text="Website Designer" />
          </View>
        </View>
      </View>

      <View id="card3" class="mt-72 h-24 w-64 shadow-lg">
        <View id="cardInside" class="w-screen rounded-lg border-2 border-purple-700 bg-white">
          <ImageView id="theImage" class="rounded-16 prevent-default-image wh-16 m-4 bg-gray-50" image="https://randomuser.me/api/portraits/women/25.jpg" />

          <View class="vertical ml-24 w-screen">
            <Label class="ml-0 text-sm font-bold text-gray-800" text="Ms. Jane Doe" />
            <Label class="ml-0 text-xs font-bold text-gray-400" text="Website Designer" />
          </View>
        </View>
      </View>

      <Label class="bg-(#80000000) mx-2 mb-2 h-12 w-screen rounded-lg text-center text-white" text="Some Element..." />
    </View>
  </Window>
</Alloy>
```

```javascript title="index.js"
$.index.open()

$.draggableAnimation.draggable([$.card, $.card2, $.card3])
```

### `vertical` and `horizontal` Constraints

To add a vertical or horizontal constraint to any `dragging` element, set the `vertical-constraint` or `horizontal-constraint` classes on the view.

```css
/* Component(s): Ti.UI.Animation */
/* Property(ies): A custom property to use it with the Animation module */
'.horizontal-constraint': { constraint: 'horizontal' }
'.vertical-constraint': { constraint: 'vertical' }
```

#### Constraint Example

In this example, the `card` view will move only from side to side.

```xml title="index.xml"
<Alloy>
  <Window class="keep-screen-on exit-on-close-false">
    <Animation id="draggableAnimation" module="purgetss.ui" />

    <View id="card" class="horizontal-constraint h-24 w-64 shadow-lg">
      <View id="cardInside" class="w-screen rounded-lg border-2 border-purple-700 bg-white">
        <ImageView id="theImage" class="rounded-16 wh-16 m-4 ml-4" image="https://randomuser.me/api/portraits/women/17.jpg" />

        <View class="vertical ml-24 w-screen">
          <Label class="ml-0 text-sm font-bold text-gray-800" text="Ms. Jane Doe" />
          <Label class="ml-0 text-xs font-bold text-gray-400" text="Website Designer" />
        </View>
      </View>
    </View>
  </Window>
</Alloy>
```

```javascript title="index.js"
$.index.open()

$.draggableAnimation.draggable($.card)
```

---

## State Modifiers

Define behavior in the `class` attribute:

### `open:` and `close:`

Properties for opening/closing phases.

```xml
<Animation class="close:opacity-0 close:w-28 open:w-11/12 open:opacity-100" />
```

### `complete:` Modifier

To apply additional properties after an `open` animation is finished, use the `complete` modifier.

```xml
<Animation class="open:scale-1 complete:bg-(#008800) complete:scale-100" />
```

:::tip
Use `complete:` for post-animation state - e.g., setting a background color after a fade-in completes.
:::

#### Complete Example: Wordle Animation

In the following code, the `open` animation reduces the children of the `letters` view to a size of 1%. After completion, the `complete` modifier will set the background color to green and the scaling back to 100%.

```xml title="index.xml"
<Alloy>
  <Window title="App Wordle" class="bg-(#181e2d)">
    <Animation module="purgetss.ui" id="myAnimationReset" class="bg-transparent" />
    <Animation module="purgetss.ui" id="myAnimationOpen" class="open:scale-1 complete:bg-(#008800) complete:scale-100" />

    <View class="vertical">
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

      <Button title="Animate" class="mt-8" android:onClick="doAnimate" ios:onSingletap="doAnimate" />
      <Button title="Reset" class="mt-4" android:onClick="doReset" ios:onSingletap="doReset" />
    </View>
  </Window>
</Alloy>
```

```javascript title="index.js"
$.index.open()

function doAnimate() {
  $.myAnimationOpen.play($.letters.children)
}

function doReset() {
  $.myAnimationReset.apply($.letters.children)
}
```

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

---

## Complex UI Elements

Here is an example of the Animation module with a more complex UI featuring an animated sidebar and expandable card.

:::tip
To use this example, you'll need to install the FontAwesome fonts in your project by running:
```bash
purgetss icon-library -v=fa
```
:::

```xml title="index.xml"
<Alloy>
  <Window class="exit-on-close-false portrait bg-purple-700">
    <Animation id="draggableAnimation" module="purgetss.ui" class="bounds:m-4 bounds:mb-20" />

    <!-- Sidebar -->
    <Animation id="sideBarAnimation" module="purgetss.ui" class="close:w-24 duration-150 open:w-72" />
    <Animation id="sideBarAnimationChevron" module="purgetss.ui" class="close:rotate-0 duration-150 open:rotate-180" />

    <View id="sideBar" class="ml-2 h-1/2 w-24">
      <View class="vertical ios:shadow-lg mr-8 rounded-lg bg-white" ios:onSingletap="doAction" android:onClick="doAction">
        <View class="grid-flow-row">
          <View class="grid-rows-7 ml-0 w-64">
            <View class="horizontal bg-selected-purple-100 items-center" action="home">
              <Label class="touch-enabled-false fas fa-home ml-0 h-full w-16 border-transparent bg-transparent text-center text-xl text-purple-700" />
              <Label class="touch-enabled-false text-purple-700" text="Home" />
            </View>
          </View>

          <View class="grid-rows-7 ml-0 w-64">
            <View class="horizontal bg-selected-purple-100 items-center" action="profile">
              <Label class="touch-enabled-false fas fa-user ml-0 h-full w-16 border-transparent bg-transparent text-center text-xl text-purple-700" />
              <Label class="touch-enabled-false text-purple-700" text="Profile" />
            </View>
          </View>

          <View class="grid-rows-7 ml-0 w-64">
            <View class="horizontal bg-selected-purple-100 items-center" action="messages">
              <Label class="touch-enabled-false fas fa-comment ml-0 h-full w-16 border-transparent bg-transparent text-center text-xl text-purple-700" />
              <Label class="touch-enabled-false text-purple-700" text="Messages" />
            </View>
          </View>

          <View class="grid-rows-7 ml-0 w-64">
            <View class="horizontal bg-selected-purple-100 items-center" action="help">
              <Label class="touch-enabled-false fas fa-question-circle ml-0 h-full w-16 border-transparent bg-transparent text-center text-xl text-purple-700" />
              <Label class="touch-enabled-false text-purple-700" text="Help" />
            </View>
          </View>

          <View class="grid-rows-7 ml-0 w-64">
            <View class="horizontal bg-selected-purple-100 items-center" action="settings">
              <Label class="touch-enabled-false fas fa-cog ml-0 h-full w-16 border-transparent bg-transparent text-center text-xl text-purple-700" />
              <Label class="touch-enabled-false text-purple-700" text="Settings" />
            </View>
          </View>

          <View class="grid-rows-7 ml-0 w-64">
            <View class="horizontal bg-selected-purple-100 items-center" action="password">
              <Label class="touch-enabled-false fas fa-lock ml-0 h-full w-16 border-transparent bg-transparent text-center text-xl text-purple-700" />
              <Label class="touch-enabled-false text-purple-700" text="Password" />
            </View>
          </View>

          <View class="grid-rows-7 ml-0 w-64">
            <View class="horizontal bg-selected-purple-100 items-center" action="sign-out">
              <Label class="touch-enabled-false fas fa-sign-out-alt ml-0 h-full w-16 border-transparent bg-transparent text-center text-xl text-purple-700" />
              <Label class="touch-enabled-false text-purple-700" text="Sign Out" />
            </View>
          </View>
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
          <View class="ml-0 w-screen grid-rows-5">
            <View class="horizontal bg-selected-purple-100 items-center" action="profile">
              <Label class="touch-enabled-false fas fa-user ml-0 h-full w-14 border-transparent bg-transparent text-center text-xl text-purple-700" />
              <Label class="touch-enabled-false text-sm text-purple-700" text="Edit Profile" />
            </View>
          </View>

          <View class="ml-0 w-screen grid-rows-5">
            <View class="horizontal bg-selected-purple-100 items-center" action="inbox">
              <Label class="touch-enabled-false fas fa-inbox ml-0 h-full w-14 border-transparent bg-transparent text-center text-xl text-purple-700" />
              <Label class="touch-enabled-false text-sm text-purple-700" text="Inbox" />
            </View>
          </View>

          <View class="ml-0 w-screen grid-rows-5">
            <View class="horizontal bg-selected-purple-100 items-center" action="settings">
              <Label class="touch-enabled-false fas fa-cog ml-0 h-full w-14 border-transparent bg-transparent text-center text-xl text-purple-700" />
              <Label class="touch-enabled-false text-sm text-purple-700" text="Settings" />
            </View>
          </View>

          <View class="ml-0 w-screen grid-rows-5">
            <View class="horizontal bg-selected-purple-100 items-center" action="support">
              <Label class="touch-enabled-false fas fa-question-circle ml-0 h-full w-14 border-transparent bg-transparent text-center text-xl text-purple-700" />
              <Label class="touch-enabled-false text-sm text-purple-700" text="Support" />
            </View>
          </View>

          <View class="ml-0 w-screen grid-rows-5">
            <View class="horizontal bg-selected-purple-100 items-center" action="sign-out">
              <Label class="touch-enabled-false fas fa-sign-out-alt ml-0 h-full w-14 border-transparent bg-transparent text-center text-xl text-purple-700" />
              <Label class="touch-enabled-false text-sm text-purple-700" text="Sign Out" />
            </View>
          </View>
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

```javascript title="index.js"
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

---

## Available Utilities

Along with the regular utilities like color, widths, and heights, you can set the following utilities on your animations:

### anchorPoint

Coordinate of the view about which to pivot an animation.

This is specified as a dictionary object with x and y properties, where `{x: 0.5, y: 0.5}` represents the center of whatever is being rotated.

**Default:** `(0.5, 0.5)`

```css
/* Property(ies): anchorPoint */
/* Component(s): Ti.UI.Animation, Ti.UI.View */
'.origin-center': { anchorPoint: { x: 0.5, y: 0.5 } }
'.origin-top': { anchorPoint: { x: 0.5, y: 0 } }
'.origin-top-right': { anchorPoint: { x: 1, y: 0 } }
'.origin-right': { anchorPoint: { x: 0.5, y: 1 } }
'.origin-bottom-right': { anchorPoint: { x: 1, y: 1 } }
'.origin-bottom': { anchorPoint: { x: 0.5, y: 1 } }
'.origin-bottom-left': { anchorPoint: { x: 0, y: 1 } }
'.origin-left': { anchorPoint: { x: 0, y: 0.5 } }
'.origin-top-left': { anchorPoint: { x: 0, y: 0 } }

/* anchor-point-{position} variant */
'.anchor-point-center': { anchorPoint: { x: 0.5, y: 0.5 } }
'.anchor-point-top': { anchorPoint: { x: 0.5, y: 0 } }
'.anchor-point-top-right': { anchorPoint: { x: 1, y: 0 } }
'.anchor-point-right': { anchorPoint: { x: 0.5, y: 1 } }
'.anchor-point-bottom-right': { anchorPoint: { x: 1, y: 1 } }
'.anchor-point-bottom': { anchorPoint: { x: 0.5, y: 1 } }
'.anchor-point-bottom-left': { anchorPoint: { x: 0, y: 1 } }
'.anchor-point-left': { anchorPoint: { x: 0, y: 0.5 } }
'.anchor-point-top-left': { anchorPoint: { x: 0, y: 0 } }
```

### autoreverse

Specifies if the animation should be replayed in reverse upon completion.

**Default:** `false`

```css
/* Property: autoreverse */
/* Description: Specifies if the animation should be replayed in reverse upon completion. */
/* Component(s): Ti.UI.Animation */
'.autoreverse': { autoreverse: true }
'.autoreverse-false': { autoreverse: false }
```

### curve

Animation curve or easing function to apply to the animation.

This API can be assigned the following constants:

```css
/* Property: curve */
/* Description: Animation curve or easing function to apply to the animation. */
/* Component(s): Ti.UI.Animation */
'.curve-animation-ease-in': { curve: Ti.UI.ANIMATION_CURVE_EASE_IN }
'.curve-animation-ease-in-out': { curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT }
'.curve-animation-ease-out': { curve: Ti.UI.ANIMATION_CURVE_EASE_OUT }
'.curve-animation-linear': { curve: Ti.UI.ANIMATION_CURVE_LINEAR }
```

### delay

Delay, in milliseconds before starting the animation.

```css
/* Property: delay */
/* Description: Delay, in milliseconds before starting the animation. */
/* Component(s): Ti.UI.Animation */
'.delay-0': { delay: 0 }
'.delay-25': { delay: 25 }
'.delay-50': { delay: 50 }
'.delay-75': { delay: 75 }
'.delay-100': { delay: 100 }
'.delay-150': { delay: 150 }
'.delay-200': { delay: 200 }
'.delay-250': { delay: 250 }
'.delay-300': { delay: 300 }
'.delay-350': { delay: 350 }
'.delay-400': { delay: 400 }
'.delay-450': { delay: 450 }
'.delay-500': { delay: 500 }
'.delay-600': { delay: 600 }
'.delay-700': { delay: 700 }
'.delay-800': { delay: 800 }
'.delay-900': { delay: 900 }
'.delay-1000': { delay: 1000 }
'.delay-2000': { delay: 2000 }
'.delay-3000': { delay: 3000 }
'.delay-4000': { delay: 4000 }
'.delay-5000': { delay: 5000 }
```

### duration

Duration of the animation, in milliseconds.

```css
/* Property: duration */
/* Component(s): Ti.UI.Animation */
'.duration-0': { duration: 0 }
'.duration-25': { duration: 25 }
'.duration-50': { duration: 50 }
'.duration-75': { duration: 75 }
'.duration-100': { duration: 100 }
'.duration-150': { duration: 150 }
'.duration-200': { duration: 200 }
'.duration-250': { duration: 250 }
'.duration-300': { duration: 300 }
'.duration-350': { duration: 350 }
'.duration-400': { duration: 400 }
'.duration-450': { duration: 450 }
'.duration-500': { duration: 500 }
'.duration-600': { duration: 600 }
'.duration-700': { duration: 700 }
'.duration-800': { duration: 800 }
'.duration-900': { duration: 900 }
'.duration-1000': { duration: 1000 }
'.duration-2000': { duration: 2000 }
'.duration-3000': { duration: 3000 }
'.duration-4000': { duration: 4000 }
'.duration-5000': { duration: 5000 }
```

### repeat

Number of times the animation should be performed.

If `autoreverse` is true, then one repeat of the animation consists of the animation being played once forward and once backward.

```css
/* Property: repeat */
/* Component(s): Ti.UI.Animation */
'.repeat-0': { repeat: 0 }
'.repeat-1': { repeat: 1 }
'.repeat-2': { repeat: 2 }
'.repeat-3': { repeat: 3 }
'.repeat-4': { repeat: 4 }
'.repeat-5': { repeat: 5 }
'.repeat-6': { repeat: 6 }
'.repeat-7': { repeat: 7 }
'.repeat-8': { repeat: 8 }
'.repeat-9': { repeat: 9 }
'.repeat-10': { repeat: 10 }
'.repeat-11': { repeat: 11 }
'.repeat-12': { repeat: 12 }
```

### rotate

Utility to specify the amount of rotation.

This is specified as the rotation angle in degrees.

**Default:** `No rotation.`

```css
/* Property: rotate */
/* Component(s): MatrixCreationDict, Matrix2DCreationDict */
'.rotate-0': { rotate: 0 }
'.rotate-1': { rotate: 1 }
'.rotate-2': { rotate: 2 }
'.rotate-3': { rotate: 3 }
'.rotate-6': { rotate: 6 }
'.rotate-12': { rotate: 12 }
'.rotate-45': { rotate: 45 }
'.rotate-90': { rotate: 90 }
'.rotate-180': { rotate: 180 }

/* Property(ies): rotate ( Negative values ) */
/* Component(s): For the Animation Component */
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

### scale

Scales the matrix by the specified scaling factor. The same scaling factor is used for both horizontal and vertical scaling.

**Default:** `1`

```css
/* Property: scale */
/* Component(s): MatrixCreationDict, Matrix2DCreationDict, Matrix3DCreationDict */
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

### drag-apply, drag-animate

To control how `drag:` and `drop:` modifiers are applied, you can use either the `drag-animate` (*default*) or `drag-apply` class. The `drag-animate` class will animate the properties, while the `drag-apply` class will apply them immediately.

```css
/* Property(ies): draggingType */
/* Component(s): For the Animation Component */
'.drag-apply': { draggingType: 'apply' }
'.drag-animate': { draggingType: 'animate' }
```

### opacity-to-*, toggle-visible

A special utility to automatically animate the opacity of a view and toggle its visibility.

```css
/* Property(ies): toggle - For the Animation module */
/* Component(s): Animation */
'.opacity-to-0': { opacity: 1, animationProperties: { open: { opacity: 0 }, close: { opacity: 1 } } }
'.opacity-to-100': { opacity: 0, animationProperties: { open: { opacity: 1 }, close: { opacity: 0 } } }
'.toggle-visible': { animationProperties: { open: { visible: true }, close: { visible: false } } }
```

### zoom-in-*, zoom-out-*

A special utility to automatically animate the zoom-in and zoom-out of a view.

It will initially set the view's scale to the specified value and then animate it to 1.

```css
/* Property(ies): animationProperties - scales the view (in or out) and resets it to 100% when the animation completes */
/* Component(s): Animation */
'.zoom-in-0': { animationProperties: { open: { scale: 0 }, complete: { scale: 1 } } }
'.zoom-in-1': { animationProperties: { open: { scale: 0.01 }, complete: { scale: 1 } } }
'.zoom-in-5': { animationProperties: { open: { scale: 0.05 }, complete: { scale: 1 } } }
'.zoom-in-10': { animationProperties: { open: { scale: 0.10 }, complete: { scale: 1 } } }
'.zoom-in-25': { animationProperties: { open: { scale: 0.25 }, complete: { scale: 1 } } }
'.zoom-in-50': { animationProperties: { open: { scale: 0.5 }, complete: { scale: 1 } } }
'.zoom-in-75': { animationProperties: { open: { scale: 0.75 }, complete: { scale: 1 } } }
'.zoom-in-90': { animationProperties: { open: { scale: 0.9 }, complete: { scale: 1 } } }
'.zoom-in-95': { animationProperties: { open: { scale: 0.95 }, complete: { scale: 1 } } }
'.zoom-in-100': { animationProperties: { open: { scale: 1 }, complete: { scale: 1 } } }
'.zoom-in-105': { animationProperties: { open: { scale: 1.05 }, complete: { scale: 1 } } }
'.zoom-in-110': { animationProperties: { open: { scale: 1.1 }, complete: { scale: 1 } } }
'.zoom-in-125': { animationProperties: { open: { scale: 1.25 }, complete: { scale: 1 } } }
'.zoom-in-150': { animationProperties: { open: { scale: 1.5 }, complete: { scale: 1 } } }
'.zoom-out-0': { animationProperties: { close: { scale: 0 }, complete: { scale: 1 } } }
'.zoom-out-1': { animationProperties: { close: { scale: 0.01 }, complete: { scale: 1 } } }
'.zoom-out-5': { animationProperties: { close: { scale: 0.05 }, complete: { scale: 1 } } }
'.zoom-out-10': { animationProperties: { close: { scale: 0.10 }, complete: { scale: 1 } } }
'.zoom-out-25': { animationProperties: { close: { scale: 0.25 }, complete: { scale: 1 } } }
'.zoom-out-50': { animationProperties: { close: { scale: 0.5 }, complete: { scale: 1 } } }
'.zoom-out-75': { animationProperties: { close: { scale: 0.75 }, complete: { scale: 1 } } }
'.zoom-out-90': { animationProperties: { close: { scale: 0.9 }, complete: { scale: 1 } } }
'.zoom-out-95': { animationProperties: { close: { scale: 0.95 }, complete: { scale: 1 } } }
'.zoom-out-100': { animationProperties: { close: { scale: 1 }, complete: { scale: 1 } } }
'.zoom-out-105': { animationProperties: { close: { scale: 1.05 }, complete: { scale: 1 } } }
'.zoom-out-110': { animationProperties: { close: { scale: 1.1 }, complete: { scale: 1 } } }
'.zoom-out-125': { animationProperties: { close: { scale: 1.25 }, complete: { scale: 1 } } }
'.zoom-out-150': { animationProperties: { close: { scale: 1.5 }, complete: { scale: 1 } } }
```

---

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
<Animation class="complete:scale-100 duration-200 open:scale-110" />
```

### 4. Leverage `children:` for Batch Animations

```xml
<Animation class="children:opacity-0 complete:opacity-100 duration-300" />

<View>
  <Label /> <!-- All fade in together -->
  <View />  <!-- All fade in together -->
</View>
```

### 5. Use `toggle` for UI States

```javascript
function toggleMenu() {
  $.menuAnimation.toggle($.menuView)
}
```

---

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
<Animation id="cardPop" class="duration-200 open:scale-105" />

<View class="w-screen bg-white shadow" onTouchstart="onCardTouch">
  <!-- Card content -->
</View>
```

```javascript
function onCardTouch(e) {
  $.cardPop.play(e.source)
}
```

### Draggable Element with Bounds

```xml
<Animation id="draggableCard" class="bounds:m-8" />

<View id="card" class="h-32 w-64 bg-white shadow" />
```

```javascript
$.draggableCard.draggable($.card)
```

---

## Animation Properties Summary

### State Modifiers

| Modifier    | Purpose                  | Example                        |
| ----------- | ------------------------ | ------------------------------ |
| `open:`     | Opening state properties | `open:opacity-100 open:w-full` |
| `close:`    | Closing state properties | `close:opacity-0 close:h-0`    |
| `complete:` | Post-open state          | `complete:bg-green-500`        |
| `children:` | All children affected    | `children:opacity-50`          |
| `child:{n}` | Specific child by index  | `child:0:bg-red-500`           |
| `drag:`     | Dragging state           | `drag:opacity-50`              |
| `drop:`     | Dropped state            | `drop:scale-95`                |
| `bounds:`   | Movement limits          | `bounds:m-4`                   |

### Timing and Special Classes

| Utility                                             | Purpose                       | Example                            |
| --------------------------------------------------- | ----------------------------- | ---------------------------------- |
| `delay-{ms}`                                        | Delay before animation starts | `delay-300`                        |
| `duration-{ms}`                                     | Duration of animation         | `duration-500`                     |
| `ease-in`, `ease-out`, `ease-linear`, `ease-in-out` | Animation curve               | `ease-out`                         |
| `rotate-{degrees}`                                  | Rotation                      | `rotate-45`, `-rotate-90`          |
| `scale-{0-150}`                                     | Scale                         | `scale-110`                        |
| `repeat-{n}`                                        | Repetitions                   | `repeat-3`                         |
| `autoreverse`                                       | Auto-reverse on completion    | `autoreverse`                      |
| `zoom-in-{0-150}`                                   | Zoom in effect                | `zoom-in-125`                      |
| `zoom-out-{0-150}`                                  | Zoom out effect               | `zoom-out-75`                      |
| `drag-apply`                                        | Instant drag properties       | `drag-apply`                       |
| `drag-animate`                                      | Animated drag properties      | `drag-animate`                     |
| `horizontal-constraint`                             | Horizontal movement only      | `horizontal-constraint`            |
| `vertical-constraint`                               | Vertical movement only        | `vertical-constraint`              |
| `opacity-to-0`                                      | Fade out                      | `opacity-to-0`                     |
| `opacity-to-100`                                    | Fade in                       | `opacity-to-100`                   |
| `toggle-visible`                                    | Visibility toggle             | `toggle-visible`                   |
| `origin-*`                                          | Anchor point                  | `origin-center`, `origin-top-left` |
