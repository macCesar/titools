# Layouts, Positioning, and View Hierarchy

## 🚨 CRITICAL: Platform-Specific Properties Require Modifiers

:::danger NEVER use platform-specific properties directly
**Using `Ti.UI.iOS.*` or `Ti.UI.Android.*` properties WITHOUT modifiers will:**

1. **Add iOS code to Android builds** → compilation failures
2. **Add Android code to iOS builds** → compilation failures
3. **Create invalid cross-platform code**

**REAL EXAMPLE of the damage:**
```javascript
// ❌ WRONG - Adds Ti.UI.iOS to Android project
const win = Ti.UI.createWindow({
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT  // FAILS on Android!
})
```

**CORRECT approaches:**

**Option 1 - TSS modifier (Alloy projects):**
```tss
// ✅ CORRECT - Only adds to iOS
"#mainWindow[platform=ios]": {
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT
}
```

**Option 2 - Conditional code:**
```javascript
if (OS_IOS) {
  $.mainWindow.statusBarStyle = Ti.UI.iOS.StatusBar.LIGHT_CONTENT
}
```

**Common platform-specific properties that REQUIRE modifiers:**
- iOS: `statusBarStyle`, `modalStyle`, `modalTransitionStyle`, any `Ti.UI.iOS.*`
- Android: `actionBar` config, any `Ti.Android.*` constant
:::

## 1. Units of Measurement

### Available Units

| Unit         | Description                | Platform Notes                              |
| ------------ | -------------------------- | ------------------------------------------- |
| `dp` / `dip` | Density-independent pixels | **Recommended** for cross-platform          |
| `px`         | Absolute pixels            | Use sparingly - varies by screen density    |
| `%`          | Percentage of parent size  | Relative to parent's dimension              |
| `mm`         | Millimeters                | Absolute physical unit                      |
| `cm`         | Centimeters                | Absolute physical unit                      |
| `in`         | Inches                     | Absolute physical unit                      |
| `system`     | Platform default           | iOS = dip, Android = px (unless configured) |

### Density-Independent Pixels (dp)

**Android**: `actual pixels = dip × (screen density) / 160`
- mdpi (160 dpi): 1dp = 1px
- hdpi (240 dpi): 1dp = 1.5px
- xhdpi (320 dpi): 1dp = 2px
- xxhdpi (480 dpi): 1dp = 3px

**iOS**: Effectively `1dip = 1px` on non-retina, `1dip = 2px` on retina

### Default Units in tiapp.xml

You can set app-wide default units via the `ti.ui.defaultunit` property in `tiapp.xml`:

```xml
<property name="ti.ui.defaultunit" type="string">dp</property>
```

When set, numeric values without explicit units (e.g., `width: 100`) use this unit instead of the platform default.

### Platform Coordinate Grid Differences

> **Important**: iOS and Android use different default coordinate systems:
> - **iOS** uses a density-independent grid (e.g., 320×480 dip for iPhone classic, 1024×768 for iPad). Values are always in dip.
> - **Android** uses a pixel-based grid by default (varies by device: HVGA 320×480px, WVGA800 480×800px, etc.).
>
> This is why setting `ti.ui.defaultunit` to `dp` is recommended for cross-platform consistency — it normalizes Android's behavior to match iOS's density-independent approach.

### Best Practice

Always use `dp` for consistent sizing across devices:

```javascript
// GOOD
const view = Ti.UI.createView({
  width: '100dp',
  height: '50dp'
});

// AVOID (platform-dependent)
const view = Ti.UI.createView({
  width: 100,  // pixels - varies by device
  height: 50
});
```

## 2. Positioning Properties

### Edge-Based Positioning

Relative to parent edges:

```javascript
const view = Ti.UI.createView({
  top: 20,      // 20dp from top
  left: 30,     // 30dp from left
  bottom: 10,   // 10dp from bottom (height = parent.height - 30)
  right: 15     // 15dp from right (width = parent.width - 45)
});
```

### Center Positioning

```javascript
const view = Ti.UI.createView({
  center: { x: 50, y: 50 }  // 50% from parent's top-left
});
```

### Dynamic Sizing

Omit a dimension to calculate dynamically:

```javascript
const view = Ti.UI.createView({
  top: 10,
  bottom: 10,  // Height = parent.height - 20
  left: 0,
  right: 0      // Width = parent.width
});
```

## 3. Layout Modes

### Composite (Default)

Views stack on top of each other:

```javascript
const container = Ti.UI.createView({
  layout: 'composite'  // default
});

const view1 = Ti.UI.createView({
  backgroundColor: 'red',
  top: 10, left: 10, width: 100, height: 100
});

const view2 = Ti.UI.createView({
  backgroundColor: 'blue',
  top: 20, left: 20, width: 100, height: 100
});

container.add(view1);
container.add(view2);
// view2 appears on top of view1
```

Stacking order controlled by:
- Addition order
- `zIndex` property (higher = on top)

> **Android limitation**: `zIndex` is only supported by composite layouts. The `zIndex` property is ignored by horizontal and vertical layouts.

### Vertical Layout

Children stack vertically:

```javascript
const container = Ti.UI.createView({
  layout: 'vertical',
  height: Ti.UI.SIZE  // Grows to fit children
});

const label1 = Ti.UI.createLabel({
  text: 'First',
  height: Ti.UI.SIZE
});

const label2 = Ti.UI.createLabel({
  text: 'Second',
  top: 10,  // Offset from previous sibling's bottom
  height: Ti.UI.SIZE
});

container.add(label1);
container.add(label2);
// label2 appears below label1 with 10dp gap
```

**Vertical Layout Rules**:
- Children's `top` property acts as **offset** from previous sibling
- Children are **horizontally centered** by default
- Set `horizontalWrap: false` to prevent wrapping

### Horizontal Layout

Children line up left to right:

```javascript
const container = Ti.UI.createView({
  layout: 'horizontal',
  width: Ti.UI.FILL,
  height: Ti.UI.SIZE
});

const view1 = Ti.UI.createView({
  width: 100, height: 50,
  backgroundColor: 'red'
});

const view2 = Ti.UI.createView({
  width: 100, height: 50,
  left: 10,  // Offset from previous sibling's right
  backgroundColor: 'blue'
});

container.add(view1);
container.add(view2);
// view2 appears to right of view1 with 10dp gap
```

**Horizontal Layout Rules**:
- Children's `left` property acts as **offset** from previous sibling
- `horizontalWrap: true` (default) - moves to next row if insufficient space
- `horizontalWrap: false` - continues on same row (may overflow)

## 4. Auto-Size Behaviors

### Ti.UI.SIZE

View sizes to fit its content:

```javascript
const label = Ti.UI.createLabel({
  text: 'Hello World',
  width: Ti.UI.SIZE,   // Width fits text
  height: Ti.UI.SIZE  // Height fits text
});
```

### Ti.UI.FILL

View fills remaining space in parent:

```javascript
const view = Ti.UI.createView({
  width: Ti.UI.FILL,   // Fill remaining width
  height: Ti.UI.FILL   // Fill remaining height
});
```

### Component Defaults

| SIZE Components | FILL Components | Mixed                                  |
| :-------------- | :-------------- | :------------------------------------- |
| Button          | Window          | TableViewRow (FILL width, SIZE height) |
| Label           | View            | Slider (FILL width, SIZE height)       |
| ImageView       | ScrollView      | Toolbar (FILL width, SIZE height)      |
| Switch          | WebView         |                                        |
| TextField       | ScrollableView  |                                        |

### ScrollView Auto-Sizing

When a `ScrollView`'s `contentWidth` or `contentHeight` is set to `"auto"` or `Ti.UI.SIZE`, the scroll view's content area grows based on the bottom/right offsets of its child views:

```javascript
const scrollView = Ti.UI.createScrollView({
  contentWidth: 'auto',
  contentHeight: 'auto',
  layout: 'vertical'
});
```

### Auto-Size in Layout Modes

In `vertical`/`horizontal` layouts:
- `FILL` takes into account previously added siblings
- Example: First child `FILL`, second child `SIZE` → second gets remaining space

## 5. Combining Layouts

### Nested Layouts

```javascript
const outerContainer = Ti.UI.createView({
  layout: 'vertical',
  width: Ti.UI.FILL,
  height: Ti.UI.FILL
});

// Top section
const header = Ti.UI.createView({
  layout: 'horizontal',
  height: 50,
  backgroundColor: 'blue'
});

const title = Ti.UI.createLabel({
  text: 'Header',
  color: 'white'
});

const button = Ti.UI.createButton({
  title: 'Menu'
});

header.add(title);
header.add(button);

// Content area
const content = Ti.UI.createView({
  layout: 'composite',
  backgroundColor: 'white',
  height: Ti.UI.FILL
});

outerContainer.add(header);
outerContainer.add(content);
```

## 6. View Hierarchy and Z-Index

### Stacking Order

Views added later appear on top:

```javascript
const view1 = Ti.UI.createView({
  backgroundColor: 'red',
  width: 100, height: 100
});

const view2 = Ti.UI.createView({
  backgroundColor: 'blue',
  width: 100, height: 100,
  top: 50, left: 50
});

win.add(view1);
win.add(view2);  // view2 appears on top of view1
```

### The `size` Property and `postlayout` Event

The read-only `size` property provides the width and height of a view after layout. This property won't return accurate values until a `postlayout` event has been received:

```javascript
const view = Ti.UI.createView({ width: '50%', height: Ti.UI.SIZE });

view.addEventListener('postlayout', () => {
  Ti.API.info(`Actual size: ${view.size.width}x${view.size.height}`);
});
```

### Explicit Z-Index

```javascript
const view1 = Ti.UI.createView({
  backgroundColor: 'red',
  zIndex: 1,
  width: 100, height: 100
});

const view2 = Ti.UI.createView({
  backgroundColor: 'blue',
  zIndex: 2,  // Higher = on top
  width: 100, height: 100,
  top: 50, left: 50
});

win.add(view2);
win.add(view1);  // Still below view2 due to zIndex
```

## 7. Common Layout Patterns

### Full-Screen Overlay

```javascript
const overlay = Ti.UI.createView({
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  width: Ti.UI.FILL,
  height: Ti.UI.FILL,
  zIndex: 999  // Ensure on top
});

const dialog = Ti.UI.createView({
  backgroundColor: 'white',
  width: 300,
  height: 200,
  borderRadius: 10
});

overlay.add(dialog);
win.add(overlay);
```

### Centered Content

```javascript
const container = Ti.UI.createView({
  width: Ti.UI.FILL,
  height: Ti.UI.FILL
});

const centered = Ti.UI.createView({
  width: 200,
  height: 100,
  backgroundColor: 'blue',
  center: { x: '50%', y: '50%' }
});

container.add(centered);
```

### Bottom-Aligned Content

```javascript
const footer = Ti.UI.createView({
  backgroundColor: 'gray',
  height: 50,
  bottom: 0  // Anchor to bottom
});
```

### Percentage-Based Layout

```javascript
const leftPanel = Ti.UI.createView({
  width: '30%',
  height: Ti.UI.FILL,
  backgroundColor: 'lightgray'
});

const rightPanel = Ti.UI.createView({
  width: '70%',
  height: Ti.UI.FILL,
  left: '30%',  // Starts where left ends
  backgroundColor: 'white'
});
```

## 8. Platform Considerations

### Android Density-Specific Resources

Place resources in appropriate directories:
- `res-ldpi`, `res-mdpi`, `res-hdpi`, `res-xhdpi`, `res-xxhdpi`

### iOS Asset Catalog

PNG/JPEG images with naming convention:
- `foo.png` - Non-retina
- `foo@2x.png` - Retina
- `foo@3x.png` - iPhone 6 Plus

## Best Practices

1. **Use `dp` units** for cross-platform consistency
2. **Prefer `Ti.UI.FILL`** over percentages for containers
3. **Avoid `Ti.UI.SIZE` in ListViews** for performance
4. **Use layout modes** instead of manual positioning when possible
5. **Test on multiple devices** with different screen sizes
6. **Use `zIndex` sparingly** - rely on addition order when possible
