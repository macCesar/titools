# Animation, Matrices, and Transitions

## 1. Overview

Animations add visual interest and professionalism to apps when used appropriately. Titanium supports:
- **Basic property animations** (opacity, position, color, etc.)
- **2D matrix transformations** (scale, rotate, translate) - iOS & Android
- **3D matrix transformations** (x/y/z space) - iOS only
- **iOS transitions** (flip, curl, etc.)
- **Dynamic animations** (physics-based) - iOS only

## 2. Basic Animations

### Property Animation Syntax

```javascript
// Method 1: Direct object
view.animate({
  opacity: 0,
  duration: 2000
});

// Method 2: Animation object (reusable)
var fadeOut = Ti.UI.createAnimation({
  opacity: 0,
  duration: 2000
});
view.animate(fadeOut);

// Method 3: With callback
view.animate({
  opacity: 0,
  duration: 2000
}, function() {
  Ti.API.info('Animation complete');
  // Optional: reverse animation
  view.animate({
    opacity: 1,
    duration: 2000
  });
});
```

### Animation Properties

| Property | Description | Default |
|----------|-------------|---------|
| `duration` | Duration in milliseconds | 0 |
| `delay` | Delay before starting | 0 |
| `curve` | Easing function | `Ti.UI.ANIMATION_CURVE_EASE_IN_OUT` |
| `autoreverse` | Return to original state | `false` |
| `repeat` | Number of times to repeat | 0 |
| `opacity` | Target opacity (0-1) | - |
| `top`, `left`, `bottom`, `right` | Position values | - |
| `width`, `height` | Size values | - |
| `backgroundColor` | Target color | - |
| `transform` | Matrix transformation | - |
| `view` | View for transition | - |
| `transition` | Transition type (iOS) | - |

### Animation Curves (Easing)

```javascript
// Available curves
Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
Ti.UI.ANIMATION_CURVE_EASE_IN
Ti.UI.ANIMATION_CURVE_EASE_OUT
Ti.UI.ANIMATION_CURVE_LINEAR
Ti.UI.ANIMATION_CURVE_SPRING  // iOS only

// Example
view.animate({
  left: 100,
  duration: 1000,
  curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
});
```

### Reversing Animation

```javascript
// Use autoreverse for simple reversal
view.animate({
  opacity: 0,
  duration: 2000,
  autoreverse: true
});

// Or manual reversal with callback
view.animate({
  opacity: 0,
  duration: 2000
}, function() {
  view.animate({
    opacity: 1,
    duration: 2000
  });
});
```

### Repeating Animation

```javascript
// Repeat 3 times
view.animate({
  opacity: 0,
  duration: 500,
  repeat: 3
});

// Infinite loop (with autoreverse)
view.animate({
  opacity: 0,
  duration: 500,
  autoreverse: true,
  repeat: Number.MAX_VALUE  // Infinite
});

// Stop animation
view.animate({ opacity: view.opacity, duration: 0 });
```

## 3. 2D Matrix Animations

2D matrices work on both iOS and Android. Transform in x/y plane: scale, rotate, translate, skew.

### Basic 2D Transform

```javascript
// Create matrix
var matrix2d = Ti.UI.create2DMatrix();

// Apply transformations
matrix2d = matrix2d.rotate(20);      // Rotate 20 degrees
matrix2d = matrix2d.scale(1.5);      // Scale 1.5x
matrix2d = matrix2d.translate(50, 50);  // Move 50px right, 50px down

// Apply animation
view.animate({
  transform: matrix2d,
  duration: 2000,
  autoreverse: true,
  repeat: 3
});
```

### 2D Matrix Methods

| Method | Description |
|--------|-------------|
| `rotate(degrees)` | Rotate clockwise |
| `scale(sx, sy)` | Scale (sy defaults to sx) |
| `translate(dx, dy)` | Move by delta |
| `skew(x, y)` | Skew/shear transformation |
| `invert()` | Invert matrix |
| `multiply(matrix)` | Multiply matrices |
| `length` | Get matrix length |

### Sequential Transformations

Order matters for transformations:

```javascript
// Rotate THEN scale
var matrix1 = Ti.UI.create2DMatrix()
  .rotate(45)
  .scale(2);

// Scale THEN rotate (different result)
var matrix2 = Ti.UI.create2DMatrix()
  .scale(2)
  .rotate(45);
```

### Identity (Reset) Transform

```javascript
// Reset to original state
var identity = Ti.UI.create2DMatrix();
view.animate({
  transform: identity,
  duration: 500
});
```

## 4. 3D Matrix Animations (iOS Only)

3D matrices work in x/y/z space. iOS only.

### Basic 3D Transform

```javascript
var matrix3d = Ti.UI.create3DMatrix();

// Rotate around axis vector (x, y, z)
matrix3d = matrix3d.rotate(180, 1, 1, 0);  // 180° around diagonal

// Scale in 3 dimensions
matrix3d = matrix3d.scale(2, 2, 2);

// Apply animation
view.animate({
  transform: matrix3d,
  duration: 2000,
  autoreverse: true
});
```

### 3D Matrix Methods

| Method | Description |
|--------|-------------|
| `rotate(degrees, x, y, z)` | Rotate around vector |
| `scale(sx, sy, sz)` | Scale in 3D |
| `translate(dx, dy, dz)` | Move in 3D |
| `invert()` | Invert matrix |
| `multiply(matrix)` | Multiply matrices |
| `perspective(p)` | Set perspective (4th row) |

### Flip Card Effect

```javascript
var frontView = Ti.UI.createView({
  backgroundColor: 'red',
  width: 200, height: 200
});

var backView = Ti.UI.createView({
  backgroundColor: 'blue',
  width: 200, height: 200
});

var isFlipped = false;

frontView.addEventListener('click', function() {
  var matrix = Ti.UI.create3DMatrix().rotate(180, 0, 1, 0);

  if (!isFlipped) {
    frontView.animate({
      transform: matrix,
      duration: 500,
      visible: false
    });
    backView.transform = matrix;
    backView.animate({
      transform: Ti.UI.create3DMatrix(),
      duration: 500,
      visible: true
    });
  }
  isFlipped = !isFlipped;
});
```

## 5. iOS Transitions

Transitions are built-in animations for switching between Views/Windows.

### Transition Constants

```javascript
Ti.UI.iPhone.AnimationStyle.CURL_UP
Ti.UI.iPhone.AnimationStyle.CURL_DOWN
Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
Ti.UI.iPhone.AnimationStyle.NONE
Ti.UI.iPhone.AnimationStyle.OPAQUE_FADE  // Fade with black (not transparent)
```

### View Transition

```javascript
var container = Ti.UI.createView({ width: 300, height: 300 });
var box1 = Ti.UI.createView({ backgroundColor: 'red' });
var box2 = Ti.UI.createView({ backgroundColor: 'blue' });
container.add(box1);

var selectedIndex = 0;

container.addEventListener('click', function() {
  if (selectedIndex % 2 === 0) {
    container.animate({
      view: box2,
      transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
    });
  } else {
    container.animate({
      view: box1,
      transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
    });
  }
  selectedIndex++;
});
```

### Window Transition (NavigationWindow)

```javascript
var navWindow = Ti.UI.createNavigationWindow({
  window: Ti.UI.createWindow({ backgroundColor: 'white' })
});

var win1 = Ti.UI.createWindow({
  title: 'Window 1',
  backgroundColor: 'red',
  transitionAnimation: Ti.UI.iOS.createTransitionAnimation({
    hide: Ti.UI.createAnimation({
      transform: Ti.UI.create3DMatrix().translate(-300, 0, 0),
      duration: 500
    }),
    show: Ti.UI.createAnimation({
      transform: Ti.UI.create3DMatrix(),
      duration: 500
    })
  })
});

navWindow.openWindow(win1);
```

## 6. Dynamic Animations (iOS Only)

Physics-based animations using `Ti.UI.iOS.Animator`.

### Gravity Animation

```javascript
var animator = Ti.UI.iOS.createAnimator({
  referenceView: containerView
});

// Add gravity behavior
var gravity = Ti.UI.iOS.createGravityBehavior({
  gravityDirection: { x: 0.0, y: 1.0 }  // Downward
});

// Add items to gravity
gravity.addItem(animatedView);
animator.addBehavior(gravity);

// Add collision boundaries
var collision = Ti.UI.iOS.createCollisionBehavior({
  collisionMode: Ti.UI.iOS.COLLISION_MODE_BOUNDARY,
  boundary: containerView.toImage()
});
collision.addItem(animatedView);
animator.addBehavior(collision);

animator.startAnimator();

// Stop when done
// animator.stopAnimator();
```

### Attachment (Spring) Behavior

```javascript
var attachment = Ti.UI.iOS.createAttachmentBehavior({
  items: [view1, view2],
  anchorPoint: { x: 150, y: 150 },
  frequency: 1.0,  // Oscillations per second
  damping: 0.1,    // Bounciness (0 = none, 1 = no bounce)
  length: 100      // Distance between items
});

animator.addBehavior(attachment);
animator.startAnimator();
```

### Push Behavior

```javascript
var push = Ti.UI.iOS.createPushBehavior({
  pushDirection: { x: 1.0, y: 0.0 },  // Rightward
  mode: Ti.UI.iOS.PUSH_MODE_INSTANTANEOUS,
  pushMagnitude: 5.0
});

push.addItem(viewToPush);
animator.addBehavior(push);
```

## 7. Animation Events

### Animation Lifecycle

```javascript
var animation = Ti.UI.createAnimation({
  opacity: 0,
  duration: 2000
});

// 'start' event
animation.addEventListener('start', function(e) {
  Ti.API.info('Animation started');
});

// 'complete' event
animation.addEventListener('complete', function(e) {
  Ti.API.info('Animation complete. Was canceled: ' + e.cancelled);
});

view.animate(animation);
```

### Stopping Animations

```javascript
// Method 1: Overwrite with new animation (duration: 0)
view.animate({
  opacity: view.opacity,
  duration: 0,
  curve: Ti.UI.ANIMATION_CURVE_LINEAR
});

// Method 2: Remove from parent
parent.remove(view);

// Method 3: Set visible to false
view.visible = false;
```

## 8. Common Animation Patterns

### Fade In/Out

```javascript
function fadeIn(view, duration, callback) {
  view.opacity = 0;
  view.animate({ opacity: 1, duration: duration }, callback);
}

function fadeOut(view, duration, callback) {
  view.animate({ opacity: 0, duration: duration }, function() {
    view.visible = false;
    if (callback) callback();
  });
}
```

### Slide In

```javascript
function slideInFromRight(view, duration) {
  view.left = Ti.Platform.displayCaps.platformWidth;  // Start off-screen
  view.animate({
    left: 0,
    duration: duration,
    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
  });
}
```

### Pulse Animation

```javascript
function pulse(view) {
  view.animate({
    transform: Ti.UI.create2DMatrix().scale(1.1),
    duration: 150,
    autoreverse: true,
    curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
  }, function() {
    // Optional: repeat
    // pulse(view);
  });
}
```

### Shake Animation

```javascript
function shake(view) {
  var shake = Ti.UI.createAnimation({
    transform: Ti.UI.create2DMatrix().translate(10, 0),
    duration: 50,
    autoreverse: true,
    repeat: 5
  });
  view.animate(shake);
}
```

### Bounce In

```javascript
function bounceIn(view) {
  view.transform = Ti.UI.create2DMatrix().scale(0);
  view.animate({
    transform: Ti.UI.create2DMatrix().scale(1.2),
    duration: 300,
    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
  }, function() {
    view.animate({
      transform: Ti.UI.create2DMatrix().scale(1.0),
      duration: 200,
      curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
    });
  });
}
```

## 9. Performance Considerations

### DO:
- Use hardware-accelerated properties (opacity, transform)
- Animate `transform` instead of `top`/`left` when possible
- Use `autoreverse` for simple back-and-forth
- Cache animation objects for reuse
- Stop unused animations

### DON'T:
- Animate `width`/`height` (triggers layout recalculation)
- Animate too many views simultaneously
- Use JavaScript loops for animation
- Animate properties that trigger reflow

### Bad vs Good

```javascript
// BAD - Triggers layout
view.animate({
  left: view.left + 100,
  top: view.top + 100,
  duration: 500
});

// GOOD - Hardware accelerated
view.animate({
  transform: Ti.UI.create2DMatrix().translate(100, 100),
  duration: 500
});
```

## 10. Platform Differences

### iOS vs Android

| Feature | iOS | Android |
|---------|-----|---------|
| 2D Matrix | Full support | Full support |
| 3D Matrix | Full support | Not supported |
| Transitions | Full support | Not supported |
| Dynamic animations | Full support | Not supported |
| Curves | +SPRING | Basic curves only |
| Color animation | RGBA full | Basic colors |

## Best Practices

1. **Keep animations simple** - More complex = more prone to bugs
2. **Test on devices** - Simulator performance differs
3. **Consider accessibility** - Respect `reduceMotion` setting
4. **Use appropriate duration** - 200-300ms for subtle, 500ms for noticeable
5. **Avoid animation chains** - Use callback instead of nesting
6. **Clean up** - Remove event listeners on animation completion
