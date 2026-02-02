# ListView & ScrollView Performance

## Critical Rules

1. **NEVER use `Ti.UI.SIZE` in ListView items** - Causes layout recalculation on every scroll
2. **ALWAYS use fixed heights** - Pre-calculated heights enable fast scrolling
3. **USE templates** - Reuse view instances instead of creating new ones

## Optimized ListView Template

```xml
<!-- views/user/list.xml -->
<Alloy>
  <ListView id="listView">
    <Templates>
      <!-- FIXED HEIGHT is critical for performance -->
      <ItemTemplate name="userTemplate" height="64">
        <View id="rowContainer">
          <ImageView bindId="avatar" id="avatarImg" />
          <View id="userInfo">
            <Label bindId="name" id="nameLabel" />
            <Label bindId="email" id="emailLabel" />
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

```tss
/* styles/user/list.tss */
"#listView": { width: Ti.UI.FILL, height: Ti.UI.FILL }
"#rowContainer": { layout: 'horizontal', height: 64, width: Ti.UI.FILL }
"#avatarImg": { left: 16, width: 48, height: 48, borderRadius: 24 }
"#userInfo": { layout: 'vertical', left: 12 }
"#nameLabel": { font: { fontSize: 16, fontWeight: 'bold' } }
"#emailLabel": { font: { fontSize: 14 }, color: '#6b7280' }
```

**Titanium Layout Rules:**
- Use `layout: 'horizontal'`/`layout: 'vertical'` for directional layouts
- Use margins on children for spacing (NOT padding on parent)
- Use `width: Ti.UI.FILL, height: Ti.UI.FILL` for full width + height

## Efficient Data Binding

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

## Image Loading & Caching

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

## ScrollView Performance

### Optimizing Large ScrollViews

```xml
<!-- Avoid: Creating many views at once -->
<ScrollView id="scrollView" layout="vertical">
  <!-- DON'T: 100+ views created immediately -->
</ScrollView>

<!-- Better: Use ListView for list-like content -->
<ListView id="listView">
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

## ScrollView Memory Management

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

## Performance Checklist (UI)

| Area         | Check                              |
| ------------ | ---------------------------------- |
| **ListView** | Fixed heights on all templates     |
| **ListView** | Using templates, not dynamic views |
| **ListView** | Image pre-sizing and caching       |
| **Scroll**   | Lazy loading content sections      |
| **Scroll**   | Release off-screen images          |
| **Images**   | Resized appropriately for display  |
