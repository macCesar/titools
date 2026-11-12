# Performance Tips with PurgeTSS

> **DISCLAIMER**
> The application-performance patterns below are curated community guidance, rather than a mirror of official PurgeTSS documentation. The final [CLI generation and execution profiles](#cli-generation-and-execution-profiles) section describes the official v7.19.0+ CLI behavior. CLI generation measurements do not measure application runtime performance.

<!-- TOC-START -->
## Contents

- [Community-Discovered Patterns](#community-discovered-patterns)
- [PurgeTSS Classes vs Inline Styles](#purgetss-classes-vs-inline-styles)
- [ListView Performance](#listview-performance)
- [Bridge Optimization](#bridge-optimization)
- [Animation Performance](#animation-performance)
- [Batch UI Updates](#batch-ui-updates)
- [Debouncing and Throttling](#debouncing-and-throttling)
- [Performance Checklist](#performance-checklist)
- [CLI Generation and Execution Profiles](#cli-generation-and-execution-profiles)

<!-- TOC-END -->

## Community-Discovered Patterns

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
  class="close:opacity-0 open:opacity-100 duration-300" />
```

### Hardware-Accelerated Properties

Fast (GPU-accelerated):
- `opacity` — use for fade effects
- `transform` (`scale`, `rotate`)

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
// Swap PurgeTSS classes on an existing view; the third argument sets inline properties
$.resetClass($.statusLabel, isActive ? 'text-green-500' : 'text-red-500', {
  text: isActive ? L('active') : L('inactive')
})
```

`applyProperties({ classes })` does not restyle a view: Alloy resolves classes only through `$.UI.create()`, `$.createStyle()`, and `$.addClass()` / `$.removeClass()` / `$.resetClass()`. Alloy recommends enabling `autoStyle` on views whose classes change this way. An equivalent one-off form is `$.statusLabel.applyProperties($.createStyle({ apiName: 'Label', classes: ['text-green-500'] }))`.

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
| **Memory**    | All global listeners removed when the window closes (e.g. a `cleanup` function — project convention, not Alloy API); `$.destroy()` frees data bindings |
| **Memory**    | Heavy objects nulled in cleanup                        |
| **Memory**    | Images resized appropriately                           |
| **Animation** | Using PurgeTSS Animation component                     |
| **Animation** | Animating GPU-friendly properties (opacity, transform) |
| **Events**    | Search inputs debounced (300ms)                        |
| **Events**    | Scroll handlers throttled (50-100ms)                   |

## CLI Generation and Execution Profiles

Official sources: the PurgeTSS [performance guide](https://purgetss.com/docs/performance) and package README, checked against v7.20.1. These profiling and caching features were introduced in v7.19.0. Version 7.20.1 also corrects icon priority and fallback per selector; see [Custom Fonts](custom-fonts.md#css-formats-and-selector-priority).

### Saving and Reading a Profile

Use the global option with a command or alias:

```bash
purgetss --profile purge-profile.json
purgetss build --profile build-profile.json
purgetss bf --module --profile fonts-profile.json
purgetss --all --profile all-profile.json
purgetss --debug --profile purge-profile.json
```

The destination is relative to the current directory unless absolute. Its parent directory must exist; a later run with the same destination replaces the file. Normal progress messages remain available. `--debug` prints timings and does not write JSON by itself. Controlled failures also save profiles. If writing the profile fails, the CLI reports to stderr and preserves the command's original exit code.

Profiles use `schemaVersion: 1`:

| Field | Meaning |
| --- | --- |
| `command` | Canonical name even for an alias; `--all` identifies a combined run. |
| `status` | `completed`, `skipped`, or `failed`. |
| `durationMs` | Milliseconds from profile creation to its final snapshot. |
| `cpu.user`, `cpu.system` | CLI process CPU time in microseconds. |
| `memory` | Process memory in bytes; `peakRssBytes` is peak resident memory. |
| `phases` | Work timings; a phase can identify skipped or failed work. |
| `counters` | Command-dependent work counts. |
| `skipReason` | Optional reason; the LiveView guard uses `liveview-2s`. |

File-operation counters count attempted reads, writes and copies during command execution; copies also count as writes. `sourceReads`, `xmlParses` and `jsParses` describe the shared source analyzer. Total reads include more than XML/controller source reads. The normal `Finished purging in` message measures purge work, an external timer includes Node startup, and profiles/phases have their own start points. Compare equivalent measurements.

### LiveView and Skipped Work

The two-second guard remains: if `app.tss` was purged less than two seconds ago, the purge is skipped and records `liveview-2s`. Every completed purge writes `app.tss`, even with identical content, renewing the modification time used by the guard. A skipped purge leaves it untouched.

With `--all`, other phases can finish while the purge is skipped: overall status can be `completed` with a skipped purge phase. An empty font directory can produce a skipped `build-fonts` phase without failing the combined run. Let the guard interval pass when comparing full purges, and keep initial, subsequent completed and skipped runs separate.

### Generation Signatures and Unchanged Files

The CLI evaluates `config.cjs` per invocation and builds from an independent copy. Its signature includes the effective configuration, generator sources and relevant font/style inputs, detecting edits within the same second. It stores less than 4 KiB of metadata in `purgetss/.cache/generator-signature.json`; add `purgetss/.cache/` to `.gitignore`.

An existing project without a signature rebuilds its catalog once, which can make that first call slower. Values that cannot be signed reliably cause conservative rebuilding. Messages distinguish missing, unreadable or invalid signatures, changed generator inputs and inputs that cannot be signed reliably. A rebuild does not necessarily mean `config.cjs` changed. Explicit `build` still computes the full catalog, definitions and requested glossary.

| Message | File behavior |
| --- | --- |
| `file created!` | Missing file written. |
| `file updated!` | Existing file written because its bytes changed. |
| `unchanged (not written)` | Identical bytes; file and modification time preserved. |

This applies to generated text such as `utilities.tss`, `definitions.css`, `fonts.tss` and font modules. Explicit `build` or `build-fonts` can succeed without rewriting them; missing outputs are created. `Copying font` and `Processing` report those operations, not proof of changed TSS. `app.tss` follows the LiveView timestamp rule above.

### Work Reused Within One Invocation

Extraction, missing-class diagnostics and SVG reference detection share source text, XML parse results and controller ASTs during one purge. The context is released on completion or failure; the next invocation reads the sources again. XML/JavaScript/AST results are not cached between invocations. The SVG pipeline's [PNG cache](./svg-pipeline.md#the-png-cache) is separate.

Larger class selections and exact `apply` lookups use indexes while preserving order, duplicates, first matches, font priorities and prefix searches. Help and version do not evaluate project configuration. Paired TSS/JavaScript font generators share CSS/codepoint input. Image generation shares metadata and identical renders per image, with at most two jobs; output order, codecs, dimensions, alpha, supersampling, compression and optional quantization remain unchanged.

### Published Measurement Boundaries

The official optimization validation used the same Mac and Node 22.23.2, one initial call and five subsequent samples per variant in alternating order. These are median process times for completed purges; skips were measured separately:

| Workload | XML parses | JS parses | Before | After | Reduction |
| --- | ---: | ---: | ---: | ---: | ---: |
| Real project A | 70 | 54 | 1140.2 ms | 471.9 ms | 58.6% |
| Real project B | 10 | 10 | 680.5 ms | 448.8 ms | 34.1% |
| Real project C | 198 | 36 | 1591.3 ms | 547.1 ms | 65.6% |
| Minimal fixture | 1 | 0 | 480.3 ms | 388.4 ms | 19.1% |

Parse counts describe per-purge analyzer work, not class counts or overall app complexity. Generated outputs matched byte for byte; signature metadata was verified separately. The minimal fixture's initial call rose from 398.3 to 481.2 ms to establish its signature. These subsequent-run results apply to the tested machine and projects, not every app.

All 56 image outputs matched bytes, decoded pixels, dimensions and alpha across the tested codecs, including Sharp 0.35.3 versus 0.35.5. The two-job queue's measured maximum RSS stayed within 20% of the reference; image quality settings were retained. These are published upstream results, not new measurements from using this skill. Fixtures and reproduction commands are in the upstream [optimization report](https://github.com/macCesar/purgeTSS/blob/main/docs/project/optimization.md).
