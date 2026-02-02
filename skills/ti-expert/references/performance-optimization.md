# Performance Optimization: Bridge, Memory, Animation & Timing

## Bridge Optimization

### Minimize Bridge Crossings

Every JavaScript -> Native call crosses a bridge. Minimize these:

```javascript
// BAD: Multiple bridge crossings
const width = Ti.Platform.displayCaps.platformWidth
const height = Ti.Platform.displayCaps.platformHeight
const dpi = Ti.Platform.displayCaps.dpi

// GOOD: Cache properties locally
const displayCaps = Ti.Platform.displayCaps
const { platformWidth, platformHeight, dpi } = displayCaps
```

### Batch UI Updates

```javascript
// BAD: Multiple bridge crossings
$.nameLabel.text = user.name
$.nameLabel.color = '#000'
$.nameLabel.font = { fontSize: 16 }
$.nameLabel.left = 10

// GOOD: Single applyProperties call
$.nameLabel.applyProperties({
  text: user.name,
  color: '#000',
  font: { fontSize: 16 },
  left: 10
})
```

### Use TSS Files Instead of Inline Attributes

```xml
<!-- BAD: Inline styling = scattered and hard to maintain -->
<Label text="Hello" width="200" height="40" color="#000" font="{fontSize:16}" />

<!-- GOOD: Style defined in TSS file -->
<Label id="helloLabel" text="Hello" />
```

```tss
/* In the corresponding .tss file */
"#helloLabel": { width: 200, height: 40, color: '#000', font: { fontSize: 16 } }
```

## Memory Management

### Controller Cleanup Pattern

```javascript
// controllers/detail.js
// Store references for cleanup
const _listeners = []
const _intervals = []
const _timers = []

function init() {
  // Store listener reference
  const updateHandler = onUpdate.bind(this)
  Ti.App.addEventListener('app:update', updateHandler)
  _listeners.push({ type: 'Ti.App', event: 'app:update', handler: updateHandler })

  // Store interval reference
  const intervalId = setInterval(pollData, 30000)
  _intervals.push(intervalId)

  // Store timer reference
  const timerId = setTimeout(showTimeout, 5000)
  _timers.push(timerId)
}

function cleanup() {
  // Remove all listeners
  _listeners.forEach(({ type, event, handler }) => {
    if (type === 'Ti.App') {
      Ti.App.removeEventListener(event, handler)
    } else {
      $.getView().removeEventListener(event, handler)
    }
  })

  // Clear all intervals
  _intervals.forEach(clearInterval)

  // Clear all timers
  _timers.forEach(clearTimeout)

  // Null heavy objects
  this._largeData = null
  this._cachedImages = null

  // Destroy Alloy bindings
  $.destroy()

  // Log cleanup
  console.log('Detail controller cleaned up')
}

$.cleanup = cleanup
```

## Image Memory Management

```javascript
// lib/services/imageManager.js
exports.ImageManager = {
  // Resize images to avoid loading full-resolution into memory
  resizeForDisplay(imageUrl, maxWidth, maxHeight) {
    const imageView = Ti.UI.createImageView({
      image: imageUrl,
      width: Ti.UI.SIZE,
      height: Ti.UI.SIZE
    })

    // Get actual size
    const blob = imageView.toImage()

    // Calculate aspect ratio
    const aspect = blob.width / blob.height
    let newWidth = maxWidth
    let newHeight = maxWidth / aspect

    if (newHeight > maxHeight) {
      newHeight = maxHeight
      newWidth = maxHeight * aspect
    }

    // Resize to reduce memory footprint
    return blob.imageAsResized(newWidth, newHeight)
  },

  // Release image memory when done
  release(imageView) {
    if (!imageView) return

    // Release image memory
    if (imageView.image && imageView.image.release) {
      imageView.image.release()
    }

    imageView.image = null
  }
}
```

## Lazy Loading Pattern

```javascript
// controllers/feed/list.js
const PAGE_SIZE = 20
let currentPage = 1
let isLoading = false
let hasMore = true

function init() {
  loadPage(1)

  // Detect near end of list
  $.listView.addEventListener('marker', onMarker)
}

function onMarker(e) {
  if (!hasMore || isLoading) return

  const totalItems = $.section.items?.length || 0

  // Load more when 5 items from end
  if (e.itemIndex >= totalItems - 5) {
    loadNextPage()
  }
}

async function loadNextPage() {
  if (isLoading || !hasMore) return

  isLoading = true

  try {
    const items = await api.getFeedPage(++currentPage, PAGE_SIZE)

    if (items.length < PAGE_SIZE) {
      hasMore = false
    }

    $.section.appendItems(items)

  } catch (error) {
    console.error('Failed to load more items', error)
    currentPage-- // Retry same page
  } finally {
    isLoading = false
  }
}

function cleanup() {
  $.listView.removeEventListener('marker', onMarker)
  $.destroy()
}

$.cleanup = cleanup
```

## Database Performance

```javascript
// lib/services/database.js
exports.DB = {
  // Use transactions for multiple writes
  batchInsert(items) {
    const db = Ti.Database.open('mydb')

    try {
      db.begin_transaction()

      items.forEach(item => {
        db.execute(
          'INSERT INTO items (name, value, created_at) VALUES (?, ?, ?)',
          item.name,
          item.value,
          Date.now()
        )
      })

      db.commit()

      console.log(`Inserted ${items.length} items`)

    } catch (e) {
      db.rollback()
      console.error('Batch insert failed', e)
      throw e

    } finally {
      db.close()
    }
  },

  // Use prepared statements for repeated queries
  findUsersByName(namePattern) {
    const db = Ti.Database.open('mydb')

    try {
      const rows = db.execute(
        'SELECT id, name, email FROM users WHERE name LIKE ?',
        `%${namePattern}%`
      )

      const users = []

      while (rows.isValidRow()) {
        users.push({
          id: rows.fieldByName('id'),
          name: rows.fieldByName('name'),
          email: rows.fieldByName('email')
        })
        rows.next()
      }

      rows.close()

      return users

    } finally {
      db.close()
    }
  },

  // Create indexes for frequently queried columns
  createIndexes() {
    const db = Ti.Database.open('mydb')

    db.execute('CREATE INDEX IF NOT EXISTS idx_items_name ON items(name)')
    db.execute('CREATE INDEX IF NOT EXISTS idx_items_date ON items(created_at)')

    db.close()
  }
}
```

## Performance Monitoring

```javascript
// lib/services/perfMonitor.js
exports.Perf = {
  _metrics: {
    renders: [],
    bridgeCrossings: 0
  },

  start(label) {
    const start = Date.now()

    return {
      label,
      start,

      end() {
        const duration = Date.now() - this.start
        Perf._metrics.renders.push({ label: this.label, duration })

        console.log(`[PERF] ${this.label}: ${duration}ms`)

        if (duration > 100) {
          console.warn(`[PERF] SLOW: ${this.label} took ${duration}ms`)
        }
      }
    }
  },

  countBridgeCall() {
    this._metrics.bridgeCrossings++
  },

  logMemoryUsage() {
    const available = Ti.Platform.availableMemory

    console.log(`[MEMORY] Available: ${available}MB`)
  },

  getReport() {
    const avgRender = this._metrics.renders.reduce((sum, m) =>
      sum + m.duration, 0
    ) / (this._metrics.renders.length || 1)

    return {
      averageRenderTime: Math.round(avgRender),
      totalBridgeCalls: this._metrics.bridgeCrossings,
      slowOperations: this._metrics.renders.filter(m => m.duration > 100)
    }
  }
}

// Usage example
const measure = Perf.start('user_list_render')
renderUsers(users)
measure.end()
```

## Animation Performance

### 60fps Animation Rules

```javascript
// Rule 1: Use native animations (not JavaScript intervals)
// BAD: JavaScript-driven animation
let x = 0
setInterval(() => {
  x += 1
  $.view.left = x // 60 bridge crossings per second!
}, 16)

// GOOD: Native animation
const animation = Ti.UI.createAnimation({
  left: 100,
  duration: 500,
  curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
})
$.view.animate(animation)
```

### Ti.UI.createAnimation (Recommended)

```javascript
// Fade in
function fadeIn(view, callback) {
  const animation = Ti.UI.createAnimation({
    opacity: 1,
    duration: 300,
    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
  })
  if (callback) animation.addEventListener('complete', callback)
  view.animate(animation)
}

// Fade out
function fadeOut(view, callback) {
  const animation = Ti.UI.createAnimation({
    opacity: 0,
    duration: 300,
    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
  })
  if (callback) animation.addEventListener('complete', callback)
  view.animate(animation)
}

// Slide in from right
function slideInRight(view) {
  view.transform = Ti.UI.createMatrix2D().translate(Ti.Platform.displayCaps.platformWidth, 0)
  view.animate(Ti.UI.createAnimation({
    transform: Ti.UI.createMatrix2D(),
    duration: 300,
    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
  }))
}

// Chained animations with callback
fadeIn($.modal, () => {
  slideInRight($.content)
})
```

## Hardware-Accelerated Properties

```javascript
// These properties are GPU-accelerated (fast):
// - opacity
// - transform (translate, scale, rotate)

// These trigger layout recalculation (slow):
// - width, height
// - top, left, right, bottom
// - visible

// GOOD: Animate opacity for fade effects
const fadeOut = Ti.UI.createAnimation({
  opacity: 0,
  duration: 200
})

// GOOD: Use transform for movement
const slideRight = Ti.UI.createAnimation({
  duration: 300,
  transform: Ti.UI.createMatrix2D().translate(100, 0),
})

// AVOID: Animating layout properties
const badAnimation = Ti.UI.createAnimation({
  left: 100,  // Triggers layout recalc
  width: 200, // Triggers layout recalc
  duration: 300
})
```

## Animation Cleanup

```javascript
// Always remove animation listeners
let currentAnimation = null

function animateIn() {
  currentAnimation = Ti.UI.createAnimation({
    opacity: 1,
    duration: 300
  })

  const onComplete = () => {
    currentAnimation.removeEventListener('complete', onComplete)
    currentAnimation = null
  }

  currentAnimation.addEventListener('complete', onComplete)
  $.view.animate(currentAnimation)
}

function cleanup() {
  // Cancel any running animation
  if (currentAnimation) {
    $.view.animate({ duration: 0 }) // Cancel
    currentAnimation = null
  }
  $.destroy()
}

$.cleanup = cleanup
```

## Debouncing and Throttling

### Debounce Pattern

Use when you want to wait for the user to stop an action before processing.

```javascript
// lib/helpers/timing.js
exports.debounce = function debounce(fn, delay = 300) {
  let timeoutId = null

  const debounced = function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId)
    timeoutId = null
  }

  return debounced
}
```

```javascript
// Usage: Search input
const { debounce } = require('helpers/timing')

const debouncedSearch = debounce(async (query) => {
  const results = await searchService.search(query)
  renderResults(results)
}, 300)

function onSearchChange(e) {
  debouncedSearch(e.value)
}

function cleanup() {
  debouncedSearch.cancel()
  $.destroy()
}
```

### Throttle Pattern

Use when you want to limit how often a function can run.

```javascript
// lib/helpers/timing.js
exports.throttle = function throttle(fn, limit = 100) {
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

  throttled.cancel = () => {
    clearTimeout(timeoutId)
    timeoutId = null
  }

  return throttled
}
```

```javascript
// Usage: Scroll handler
const { throttle } = require('helpers/timing')

const throttledScroll = throttle((scrollY) => {
  updateHeaderOpacity(scrollY)
  checkLazyLoadImages(scrollY)
}, 50) // Max 20 calls per second

function onScroll(e) {
  throttledScroll(e.y)
}

function cleanup() {
  throttledScroll.cancel()
  $.scrollView.removeEventListener('scroll', onScroll)
  $.destroy()
}
```

### Common Use Cases

| Pattern  | Use Case         | Delay        |
| -------- | ---------------- | ------------ |
| Debounce | Search input     | 300ms        |
| Debounce | Auto-save        | 1000ms       |
| Debounce | Window resize    | 150ms        |
| Throttle | Scroll events    | 50-100ms     |
| Throttle | Mouse/touch move | 16ms (60fps) |
| Throttle | API polling      | 5000ms+      |

### Combined Pattern for Real-time + Final

```javascript
// Show immediate feedback while typing, but only search when done
const { debounce, throttle } = require('helpers/timing')

// Update UI immediately (throttled)
const updateSuggestions = throttle((query) => {
  // Filter local cache for quick suggestions
  const suggestions = localCache.filter(q => q.includes(query))
  renderSuggestions(suggestions)
}, 100)

// Search API only when typing stops (debounced)
const searchApi = debounce(async (query) => {
  const results = await api.search(query)
  renderResults(results)
}, 500)

function onSearchChange(e) {
  const query = e.value.trim()

  if (query.length > 0) {
    updateSuggestions(query)  // Immediate feedback
    searchApi(query)          // API call when done typing
  } else {
    clearResults()
  }
}

function cleanup() {
  updateSuggestions.cancel()
  searchApi.cancel()
  $.destroy()
}
```

## Performance Checklist

| Area          | Check                                   |
| ------------- | --------------------------------------- |
| **Bridge**    | Cached Ti.Platform properties           |
| **Bridge**    | Using applyProperties for updates       |
| **Bridge**    | TSS styles instead of inline attributes |
| **Memory**    | All global listeners cleaned up         |
| **Memory**    | Heavy objects nulled in cleanup         |
| **Memory**    | Images resized appropriately            |
| **Database**  | Using transactions for batch ops        |
| **Database**  | Indexes on frequently queried columns   |
| **Database**  | ResultSets and DB handles closed        |
| **Animation** | Using native animations, not intervals  |
| **Animation** | GPU-accelerated properties preferred    |
| **Timing**    | Debounce on search/input                |
| **Timing**    | Throttle on scroll/touch events         |
