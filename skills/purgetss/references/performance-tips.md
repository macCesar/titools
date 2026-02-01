# Performance Tips with PurgeTSS

Best practices for optimizing performance in Titanium apps using PurgeTSS utility classes.

## PurgeTSS Classes vs Inline Styles

Using PurgeTSS classes reduces bridge crossings compared to inline styling:

```xml
<!-- BAD: Multiple inline attributes = more bridge crossings -->
<Label text="Hello" width="200" height="40" color="#000" font="{fontSize:16}" />

<!-- GOOD: Single class application, fewer bridge crossings -->
<Label text="Hello" class="h-10 w-1/2 text-base text-black" />
```

PurgeTSS generates optimized TSS that Alloy applies in a single batch during view creation.

## ListView Performance

### Critical Rules

1. **NEVER use `Ti.UI.SIZE` in ListView items** — causes layout recalculation on every scroll
2. **ALWAYS use fixed heights** on `<ItemTemplate>` — enables fast scrolling
3. **USE templates** — reuse view instances instead of creating new ones

### Optimized Template

```xml
<ListView class="wh-screen">
  <Templates>
    <!-- FIXED HEIGHT is critical -->
    <ItemTemplate name="userTemplate" height="64">
      <View class="horizontal h-16 w-screen">
        <ImageView bindId="avatar" class="rounded-full-12 ml-4" />
        <View class="vertical ml-3">
          <Label bindId="name" class="text-base font-bold" />
          <Label bindId="email" class="text-sm text-gray-500" />
        </View>
      </View>
    </ItemTemplate>
  </Templates>

  <ListSection id="section" dataCollection="users">
    <ListItem template="userTemplate"
      avatar:image="{avatar}"
      name:text="{name}"
      email:text="{email}"
    />
  </ListSection>
</ListView>
```

### Efficient Data Binding

```javascript
function renderItems(items) {
  // Pre-format data to avoid calculation during render
  $.section.items = items.map(item => ({
    template: 'feedTemplate',
    properties: { itemId: item.id, searchableText: `${item.title} ${item.description}` },
    title: { text: item.title },
    timestamp: { text: formatTimestamp(item.created_at) }
  }))
}

// Cache formatted values
const timestampCache = new Map()

function formatTimestamp(timestamp) {
  if (timestampCache.has(timestamp)) return timestampCache.get(timestamp)
  const formatted = new Date(timestamp).toLocaleString()
  timestampCache.set(timestamp, formatted)
  return formatted
}
```

### Lazy Loading (Infinite Scroll)

```javascript
const PAGE_SIZE = 20
let currentPage = 1
let isLoading = false
let hasMore = true

function init() {
  loadPage(1)
  $.listView.addEventListener('marker', onMarker)
}

function onMarker(e) {
  if (!hasMore || isLoading) return
  const totalItems = $.section.items?.length || 0
  if (e.itemIndex >= totalItems - 5) loadNextPage()
}

async function loadNextPage() {
  if (isLoading || !hasMore) return
  isLoading = true
  try {
    const items = await api.getFeedPage(++currentPage, PAGE_SIZE)
    if (items.length < PAGE_SIZE) hasMore = false
    $.section.appendItems(items)
  } catch (error) {
    currentPage--
  } finally {
    isLoading = false
  }
}
```

## Bridge Optimization

Every JavaScript → Native call crosses a bridge. Minimize these:

```javascript
// BAD: Multiple bridge crossings
const width = Ti.Platform.displayCaps.platformWidth
const height = Ti.Platform.displayCaps.platformHeight
const dpi = Ti.Platform.displayCaps.dpi

// GOOD: Cache properties locally
const displayCaps = Ti.Platform.displayCaps
const { platformWidth, platformHeight, dpi } = displayCaps
```

## Animation Performance

### Use PurgeTSS Animation Component (Not JavaScript Intervals)

```javascript
// BAD: JavaScript-driven animation (60 bridge crossings/second!)
let x = 0
setInterval(() => {
  x += 1
  $.view.left = x
}, 16)

// GOOD: PurgeTSS native animation
```

```xml
<Animation id="slideIn" module="purgetss.ui"
  class="close:translate-x-full duration-300 open:translate-x-0" />
```

### Hardware-Accelerated Properties

Fast (GPU-accelerated):
- `opacity` — use for fade effects
- `transform` (translate, scale, rotate)

Slow (triggers layout recalculation):
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `visible`

```xml
<!-- GOOD: Animate with GPU-friendly properties -->
<Animation id="fadeIn" module="purgetss.ui" class="close:opacity-0 duration-300 open:opacity-100" />
<Animation id="scalePress" module="purgetss.ui" class="close:scale-100 duration-150 open:scale-95" />

<!-- AVOID: Layout property animations when possible -->
```

## Batch UI Updates

```javascript
// BAD: Multiple bridge crossings
$.nameLabel.text = user.name
$.nameLabel.color = '#000'
$.nameLabel.font = { fontSize: 16 }

// GOOD: Single applyProperties call
$.nameLabel.applyProperties({
  text: user.name,
  color: '#000',
  font: { fontSize: 16 }
})
```

### Dynamic Class Changes

```javascript
// Change styles dynamically using classes array
$.statusLabel.applyProperties({
  classes: isActive ? ['text-green-500'] : ['text-red-500'],
  text: isActive ? L('active') : L('inactive')
})
```

## Debouncing and Throttling

### Debounce (Wait for User to Stop)

```javascript
// lib/helpers/timing.js
exports.debounce = function(fn, delay = 300) {
  let timeoutId = null
  const debounced = function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
  debounced.cancel = () => { clearTimeout(timeoutId); timeoutId = null }
  return debounced
}
```

### Throttle (Limit Execution Rate)

```javascript
exports.throttle = function(fn, limit = 100) {
  let lastRun = 0
  let timeoutId = null
  const throttled = function(...args) {
    const now = Date.now()
    const remaining = limit - (now - lastRun)
    if (remaining <= 0) {
      lastRun = now
      fn.apply(this, args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastRun = Date.now()
        timeoutId = null
        fn.apply(this, args)
      }, remaining)
    }
  }
  throttled.cancel = () => { clearTimeout(timeoutId); timeoutId = null }
  return throttled
}
```

### Common Use Cases

| Pattern  | Use Case          | Delay        |
| -------- | ----------------- | ------------ |
| Debounce | Search input      | 300ms        |
| Debounce | Auto-save         | 1000ms       |
| Debounce | Window resize     | 150ms        |
| Throttle | Scroll events     | 50-100ms     |
| Throttle | Touch/move events | 16ms (60fps) |
| Throttle | API polling       | 5000ms+      |

## Performance Checklist

| Area          | Check                                                  |
| ------------- | ------------------------------------------------------ |
| **ListView**  | Fixed heights on all templates                         |
| **ListView**  | Using templates, not dynamic views                     |
| **ListView**  | Image pre-sizing and caching                           |
| **Bridge**    | Cached `Ti.Platform` properties                        |
| **Bridge**    | Using `applyProperties` for batch updates              |
| **Bridge**    | PurgeTSS classes instead of inline styles              |
| **Memory**    | All global listeners cleaned up in `$.cleanup`         |
| **Memory**    | Heavy objects nulled in cleanup                        |
| **Memory**    | Images resized appropriately                           |
| **Animation** | Using PurgeTSS Animation component                     |
| **Animation** | Animating GPU-friendly properties (opacity, transform) |
| **Events**    | Search inputs debounced (300ms)                        |
| **Events**    | Scroll handlers throttled (50-100ms)                   |
