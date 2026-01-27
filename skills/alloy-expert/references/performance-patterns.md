# Performance Optimization Guide

## Critical Rules

1. **NEVER use `Ti.UI.SIZE` in ListView items** - Causes layout recalculation on every scroll
2. **ALWAYS use fixed heights** - Pre-calculated heights enable fast scrolling
3. **USE templates** - Reuse view instances instead of creating new ones
4. **CACHE Ti.Platform properties** - Avoid repeated bridge crossings
5. **USE applyProperties()** - Batch UI updates in a single call

## ListView Performance

### Optimized ListView Template

```xml
<!-- views/user/list.xml -->
<Alloy>
  <ListView class="wh-screen">
    <Templates>
      <!-- FIXED HEIGHT is critical for performance -->
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
      <ListItem template="userTemplate" avatar:image="{avatar}" name:text="{name}" email:text="{email}" />
    </ListSection>
  </ListView>
</Alloy>
```

**PurgeTSS Layout Rules:**
- Use `horizontal`/`vertical` for layout (NOT flexbox)
- Use `m-*` on children for spacing (NOT `p-*` on parent)
- Use `wh-screen` for full width + height

### Efficient Data Binding

```javascript
// controllers/feed/list.js
function renderItems(items) {
  // Pre-format data to avoid calculation in render
  const listItems = items.map(item => ({
    template: 'feedTemplate',
    properties: {
      itemId: item.id,
      searchableText: `${item.title} ${item.description}`
    },
    title: { text: item.title },
    description: { text: item.description },
    timestamp: { text: formatTimestamp(item.created_at) }
  }))

  // Single update
  $.section.items = listItems
}

// Timestamp formatter (cache results)
const timestampCache = new Map()

function formatTimestamp(timestamp) {
  if (timestampCache.has(timestamp)) {
    return timestampCache.get(timestamp)
  }

  const formatted = new Date(timestamp).toLocaleString()
  timestampCache.set(timestamp, formatted)

  return formatted
}
```

### Image Loading & Caching

```javascript
// lib/services/imageCache.js
exports.ImageCache = {
  _cache: new Map(),
  _loading: new Map(),

  // Get image at appropriate size for list item
  getListThumbnail(url) {
    const cacheKey = `thumb_${url}`

    // Return cached if available
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey)
    }

    // Check if already loading
    if (this._loading.has(cacheKey)) {
      return this._loading.get(cacheKey)
    }

    // Load and resize
    const promise = this._loadAndResize(url, { width: 80, height: 80 })
      .then(resized => {
        this._cache.set(cacheKey, resized)
        this._loading.delete(cacheKey)
        return resized
      })

    this._loading.set(cacheKey, promise)

    return promise
  },

  async _loadAndResize(url, size) {
    return new Promise((resolve, reject) => {
      const imageView = Ti.UI.createImageView({
        image: url,
        width: size.width,
        height: size.height,
        preventsDefaultAnimation: true
      })

      imageView.addEventListener('load', () => {
        const blob = imageView.toImage()
        const resized = blob.imageAsResized(size.width, size.height)
        imageView.image = null
        resolve(resized)
      })

      imageView.addEventListener('error', (e) => {
        reject(e)
      })
    })
  },

  clear() {
    this._cache.clear()
    this._loading.clear()
  }
}
```

## Bridge Optimization

### Minimize Bridge Crossings

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

### Use PurgeTSS Classes

```xml
<!-- BAD: Inline styling = more bridge crossings -->
<Label text="Hello" width="200" height="40" color="#000" font="{fontSize:16}" />

<!-- GOOD: Single class application -->
<Label text="Hello" class="h-10 w-1/2 text-base text-black" />
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

### Image Memory Management

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

## Performance Checklist

| Area         | Check                                     |
| ------------ | ----------------------------------------- |
| **ListView** | Fixed heights on all templates            |
| **ListView** | Using templates, not dynamic views        |
| **ListView** | Image pre-sizing and caching              |
| **Bridge**   | Cached Ti.Platform properties             |
| **Bridge**   | Using applyProperties for updates         |
| **Bridge**   | PurgeTSS classes instead of inline styles |
| **Memory**   | All global listeners cleaned up           |
| **Memory**   | Heavy objects nulled in cleanup           |
| **Memory**   | Images resized appropriately              |
| **Database** | Using transactions for batch ops          |
| **Database** | Indexes on frequently queried columns     |
| **Database** | ResultSets and DB handles closed          |

## ScrollView Performance

### Optimizing Large ScrollViews

```xml
<!-- Avoid: Creating many views at once -->
<ScrollView class="wh-screen vertical">
  <!-- DON'T: 100+ views created immediately -->
</ScrollView>

<!-- Better: Use ListView for list-like content -->
<ListView class="wh-screen">
  <!-- Views created on-demand as user scrolls -->
</ListView>
```

### When You Must Use ScrollView

```javascript
// Lazy load content sections
const sections = [
  { id: 'header', height: 200 },
  { id: 'featured', height: 300 },
  { id: 'products', height: 400 },
  { id: 'reviews', height: 500 }
]

let loadedSections = new Set()

function init() {
  // Load only visible sections initially
  loadSection('header')

  $.scrollView.addEventListener('scroll', onScroll)
}

function onScroll(e) {
  const scrollY = e.y
  const viewportHeight = $.scrollView.rect.height

  sections.forEach(section => {
    if (loadedSections.has(section.id)) return

    // Check if section is about to be visible
    const sectionTop = getSectionTop(section.id)

    if (sectionTop < scrollY + viewportHeight + 100) {
      loadSection(section.id)
    }
  })
}

function loadSection(sectionId) {
  if (loadedSections.has(sectionId)) return

  loadedSections.add(sectionId)

  // Load content for this section
  const container = $[sectionId + 'Container']
  const content = createSectionContent(sectionId)
  container.add(content)
}
```

### ScrollView Memory Management

```javascript
// Release images when scrolled far away
function onScroll(e) {
  const scrollY = e.y
  const viewportHeight = $.scrollView.rect.height

  // Release images more than 2 screens away
  const releaseThreshold = viewportHeight * 2

  imageViews.forEach((img, index) => {
    const imgTop = img.rect.y
    const distance = Math.abs(imgTop - scrollY)

    if (distance > releaseThreshold && img.image) {
      // Store URL for later reload
      img._originalUrl = img.image
      img.image = null
    } else if (distance < viewportHeight && img._originalUrl) {
      // Reload when close to viewport
      img.image = img._originalUrl
      delete img._originalUrl
    }
  })
}
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

### PurgeTSS Animation Component (Recommended)

```xml
<!-- Define animations with state modifiers -->
<Animation id="fadeIn" module="purgetss.ui" class="close:opacity-0 duration-300 open:opacity-100" />
<Animation id="fadeOut" module="purgetss.ui" class="close:opacity-100 duration-300 open:opacity-0" />
<Animation id="slideInRight" module="purgetss.ui" class="close:translate-x-full duration-300 open:translate-x-0" />
<Animation id="scalePress" module="purgetss.ui" class="close:scale-100 duration-150 open:scale-95" />
```

```javascript
// Fade in/out
$.fadeIn.open($.card)
$.fadeOut.close($.card)

// Slide animations
$.slideInRight.open($.panel)
$.slideInRight.close($.panel)

// Scale animations (press effect)
$.scalePress.open($.button)  // Scale down
$.scalePress.close($.button) // Scale back up

// Chained animations with callback
$.fadeIn.open($.modal, () => {
  // Animation complete, trigger next animation
  $.slideInRight.open($.content)
})
```

### Hardware-Accelerated Properties

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

### Animation Cleanup

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
const { debounce } = require('lib/helpers/timing')

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
const { throttle } = require('lib/helpers/timing')

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
const { debounce, throttle } = require('lib/helpers/timing')

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
