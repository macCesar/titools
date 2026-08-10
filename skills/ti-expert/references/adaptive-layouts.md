# Adaptive layouts

Patterns for building responsive Titanium apps that work across phones, tablets, foldables, and desktop mode.

This reference is NOT derived from official Titanium documentation. It addresses Google's Android 17 resizability requirements and provides reusable patterns for adaptive UI in Titanium/Alloy apps.

<!-- TOC-START -->
## Contents

- [1. Context: Android 17 resizability requirements](#1-context-android-17-resizability-requirements)
- [2. Detecting window size](#2-detecting-window-size)
- [3. Layout strategy](#3-layout-strategy)
- [4. Controller pattern](#4-controller-pattern)
- [5. Grid simulation](#5-grid-simulation)
- [6. Anti-patterns](#6-anti-patterns)
- [7. tiapp.xml configuration](#7-tiappxml-configuration)
- [8. Quick reference](#8-quick-reference)

<!-- TOC-END -->

## 1. Context: Android 17 resizability requirements

Starting with Android 17 (API 37), on devices with screens >= 600dp (tablets, foldables, desktop mode), Google ignores these manifest attributes:

- `android:screenOrientation` (all values, including `portrait`)
- `setRequestedOrientation()`
- `android:resizeableActivity`
- `android:minAspectRatio` / `android:maxAspectRatio`

Deadline: August 2027 — Google Play requires `targetSdkVersion="37"` for all new apps and updates.

Scope: Only affects screens >= 600dp. Phones (< 600dp) and games (`android:appCategory="game"`) are exempt.

What this means: portrait-only apps will be forced into landscape/resized on large screens. If the UI doesn't support it, it will break.

### It already started in Android 16 (API 36)

This is usually described as an API 37 change, but it lands one release earlier: an app targeting **API 36** already has `android:screenOrientation` ignored on >= 600dp displays running Android 16. The difference is that API 36 still ships an opt-out:

```xml
<!-- inside <application>, or on an individual <activity> -->
<property
  android:name="android.window.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY"
  android:value="true"/>
```

The opt-out stops working the moment you target API 37, so treat it as a bridge while the layout is made adaptive — not as a fix. Source: [Android 16 behavior changes](https://developer.android.com/about/versions/16/behavior-changes-16).

Worth knowing when debugging: this only kicks in at >= 600dp. If a **phone** is rotating despite a portrait lock, the cause is in the app, not in Android — see the orientation debugging recipe in section 7.

### Related: edge-to-edge (API 36)

Before the resizability requirement (API 37), Android SDK 36 removes the opt-out for edge-to-edge rendering, causing Titanium layouts to overlap system navigation bars. The Titanium core team has a PR to handle this at the SDK level: tidev/titanium-sdk#14399 — adds an `EdgeToEdgeHelper` with correct padding so existing apps work without code changes.

| Android requirement | API level | Who handles it |
|---|---|---|
| Edge-to-edge (system bars) | SDK 36 | Titanium SDK (PR #14399) |
| Resizability / orientation unlock | SDK 37 | App developer (this reference) |

### Full requirements checklist

| Requirement | Ti.UI.FILL/SIZE solves it? | What to do in Titanium |
|---|---|---|
| No orientation lock on >= 600dp | Yes | Remove the lock from tiapp.xml |
| Multi-window / split-screen | Yes | Avoid fixed dimensions |
| Variable aspect ratios | Yes | Use FILL/SIZE/percentages |
| Preserve state on config changes | **Handled by Titanium** | Titanium declares `android:configChanges` on all Activities automatically — Android does NOT destroy/recreate them on rotation, resize, or split-screen. No extra code needed. |
| External input (keyboard, mouse) | **No** | Handle `keypressed` events, ensure touch targets work with mouse clicks |

For most apps, removing the portrait lock and using `Ti.UI.FILL`/`Ti.UI.SIZE` correctly is sufficient. External input is only needed for apps targeting desktop mode or connected displays.

### Two levels of adaptive layout

**Level 1 — Fluid layout (most apps):** Use `Ti.UI.FILL`, `Ti.UI.SIZE`, and percentages. No JS code needed. The layout engine adapts automatically. With PurgeTSS: `w-screen`, `h-auto`, and percentage utilities.

**Level 2 — Breakpoint-driven layout (structural changes):** Use the responsive helper + `postlayout` event + layout adapters when the structure must change (e.g., sidebar lateral on tablet, hidden on phone). The rest of this reference covers Level 2 patterns.

## 2. Detecting window size

### platformWidth vs win.size

There are two ways to get dimensions, and they behave differently:

| API | Returns | In split-screen |
|---|---|---|
| `Ti.Platform.displayCaps.platformWidth` | Full device screen width (pixels on Android) | Always returns full device width — WRONG for layout decisions |
| `$.win.size.width` (after `postlayout`) | Actual window width in app's default unit | Returns the real available width — CORRECT for layout decisions |

Google explicitly recommends: "do not use device screen size for layout decisions — use the actual window size." In native Android this is `WindowManager.getCurrentWindowMetrics()`. In Titanium, the equivalent is `win.size` after `postlayout`.

### Units: dp is the default in Titanium

Titanium uses `dp` as the default unit. The `win.size` property returns values in the app's default unit. Since the default is dp, `win.size.width` already returns dp values — do NOT divide by `logicalDensityFactor` or you will get a double-conversion (halved values).

`platformWidth` is different: it returns absolute pixels on Android regardless of `ti.ui.defaultunit`. This requires dividing by `logicalDensityFactor` to convert to dp.

### Responsive helper — `app/lib/responsive.js`

```javascript
/**
 * Detects breakpoints using the actual window size.
 * Accurate in split-screen, multi-window, and freeform modes.
 *
 * win.size returns dp values (Titanium default unit is dp).
 * Do NOT divide by logicalDensityFactor — that would double-convert.
 */
const getInfoFromWindow = (winSize) => {
	const dpWidth = winSize.width
	const dpHeight = winSize.height

	const isPortrait = dpHeight > dpWidth
	const isTablet = Math.min(dpWidth, dpHeight) >= 600

	let breakpoint = 'phone'
	if (dpWidth >= 900) {
		breakpoint = 'desktop'
	} else if (dpWidth >= 600) {
		breakpoint = 'tablet'
	}

	return { dpWidth, dpHeight, isPortrait, isTablet, breakpoint }
}

/**
 * Fallback: detects breakpoints using device screen size.
 * Use only when win.size is not available (e.g., before postlayout).
 * NOT accurate in split-screen — returns full device width.
 *
 * platformWidth returns pixels on Android — must convert to dp.
 */
const getInfoFromDevice = () => {
	const { platformWidth: w, platformHeight: h, logicalDensityFactor: density } = Ti.Platform.displayCaps

	const isPortrait = Ti.Gesture.portrait
	const factor = OS_ANDROID ? density : 1
	const dpWidth = (isPortrait ? Math.min(w, h) : Math.max(w, h)) / factor
	const dpHeight = (isPortrait ? Math.max(w, h) : Math.min(w, h)) / factor
	const isTablet = Math.min(w, h) / factor >= 600

	let breakpoint = 'phone'
	if (dpWidth >= 900) {
		breakpoint = 'desktop'
	} else if (dpWidth >= 600) {
		breakpoint = 'tablet'
	}

	return { dpWidth, dpHeight, isPortrait, isTablet, breakpoint }
}

const onChange = (callback) => {
	const handler = () => {
		callback(getInfoFromDevice())
	}

	Ti.Gesture.addEventListener('orientationchange', handler)
	return handler
}

const removeOff = (handler) => {
	Ti.Gesture.removeEventListener('orientationchange', handler)
}

module.exports = { getInfoFromWindow, getInfoFromDevice, onChange, removeOff }
```

### Quick inline detection

```javascript
// After postlayout — accurate in split-screen
const dpWidth = $.win.size.width  // already dp, no conversion needed
const isTablet = Math.min($.win.size.width, $.win.size.height) >= 600
```

## 3. Layout strategy

| Breakpoint | dpWidth   | Strategy                              |
| ---------- | --------- | ------------------------------------- |
| Phone      | < 600dp   | Vertical stack, sidebar hidden        |
| Tablet     | 600-899dp | Side-by-side split (30/70 or 40/60)   |
| Desktop    | >= 900dp  | Fixed or percentage sidebar + fluid content |

## 4. Controller pattern

### View — `app/views/example.xml`

```xml
<Alloy>
  <Window id="win" backgroundColor="#fff">
    <View id="container">
      <View id="sidebar" />
      <View id="content" />
    </View>
  </Window>
</Alloy>
```

### Styles — `app/styles/example.tss`

```tss
"#container": {
  width: Ti.UI.FILL,
  height: Ti.UI.FILL
}

"#sidebar": {
  backgroundColor: "#eee",
  layout: "vertical"
}

"#content": {
  backgroundColor: "#fff",
  layout: "vertical"
}
```

### Controller — `app/controllers/example.js`

```javascript
const Responsive = require('/responsive')

let state = Responsive.getInfoFromDevice()
let postlayoutHandler

// --- Layout adapters ---

function layoutPhone() {
	$.container.layout = 'vertical'

	$.sidebar.visible = false

	$.content.applyProperties({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL
	})
}

function layoutTablet() {
	$.container.layout = 'horizontal'

	$.sidebar.applyProperties({
		height: Ti.UI.FILL,
		visible: true,
		width: '30%'
	})

	$.content.applyProperties({
		height: Ti.UI.FILL,
		width: '70%'
	})
}

function layoutDesktop() {
	$.container.layout = 'horizontal'

	$.sidebar.applyProperties({
		height: Ti.UI.FILL,
		visible: true,
		width: 280
	})

	$.content.applyProperties({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL
	})
}

// --- Apply layout based on breakpoint ---

function applyLayout() {
	switch (state.breakpoint) {
		case 'phone':
			layoutPhone()
			break
		case 'tablet':
			layoutTablet()
			break
		case 'desktop':
			layoutDesktop()
			break
	}
}

// --- Lifecycle ---

// Use postlayout to detect actual window size.
// This is accurate in split-screen where platformWidth is not.
postlayoutHandler = () => {
	const newState = Responsive.getInfoFromWindow($.win.size)
	const changed = newState.breakpoint !== state.breakpoint

	state = newState

	// Only re-apply layout when breakpoint changes.
	// Percentage-based widths adapt automatically via the layout engine.
	// Re-applying the same layout causes visible double-adjustment flicker.
	if (changed) {
		applyLayout()
	}
}

$.win.addEventListener('postlayout', postlayoutHandler)

applyLayout()

// --- Memory cleanup (mandatory for controllers with global listeners) ---

function cleanup() {
	if (postlayoutHandler) {
		$.win.removeEventListener('postlayout', postlayoutHandler)
		postlayoutHandler = null
	}
}

$.win.addEventListener('close', cleanup)
$.cleanup = cleanup
```

## 5. Grid simulation

Titanium does NOT have a `gap` property. Use `left` / `top` offsets in horizontal/vertical layouts to simulate spacing between siblings.

```javascript
function createRow() {
	return Ti.UI.createView({
		layout: 'horizontal',
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL
	})
}

function createCol(percent, spacing) {
	return Ti.UI.createView({
		width: percent + '%',
		height: Ti.UI.SIZE,
		left: spacing || 0
	})
}

// Usage in a tablet layout:
function layoutTabletGrid() {
	$.content.removeAllChildren()

	const row = createRow()

	const col1 = createCol(48)
	col1.add(Ti.UI.createLabel({ text: 'Left column' }))

	// 4% gap simulated via left offset
	const col2 = createCol(48, '4%')
	col2.add(Ti.UI.createLabel({ text: 'Right column' }))

	row.add(col1)
	row.add(col2)

	$.content.add(row)
}
```

## 6. Anti-patterns

```javascript
// ❌ Using platformWidth for layout decisions in split-screen
// Returns full device width, not the app's window width
const dpWidth = Ti.Platform.displayCaps.platformWidth / density
// Use $.win.size.width after postlayout instead

// ❌ Dividing win.size by logicalDensityFactor
// win.size already returns dp (Titanium's default unit) — double-conversion!
const dpWidth = $.win.size.width / density  // WRONG: halves the value

// ❌ Using Ti.Gesture.isPortrait() — not a method, it's a property
Ti.Gesture.isPortrait()   // TypeError!
Ti.Gesture.portrait       // correct — boolean property

// ❌ Setting orientation imperatively — silently overrides the manifest
$.win.activity.requestedOrientation = Ti.Android.SCREEN_ORIENTATION_PORTRAIT
// The manifest value is applied in onCreate; this runs afterwards and always wins.
// Nothing in tiapp.xml can beat it, which makes it invisible when debugging.
// Declare `orientationModes` on the window instead (see section 7).

// ❌ Detecting tablets with a pixel threshold
Math.min(displayCaps.platformWidth, displayCaps.platformHeight) >= 600
// platformWidth returns PIXELS on Android. A 720x1604 @xhdpi phone is 360dp wide,
// but 720 >= 600 reports "tablet". Use Alloy.isTablet / the formFactor query, which
// read Ti.Platform.Android.physicalSizeCategory instead of raw pixels.

// ❌ Passing an empty orientationModes array to mean "no preference"
orientationModes: []
// An empty array maps to SCREEN_ORIENTATION_SENSOR (TiWindowProxy.setOrientationModes),
// so it doesn't clear the setting — it actively unlocks rotation, overriding the manifest.
// To leave orientation alone, don't set the property at all.

// ❌ Using gap property — does NOT exist in Titanium
{ layout: 'horizontal', gap: 10 }

// ❌ Anonymous listeners on global objects — memory leak, can never be removed
Ti.Gesture.addEventListener('orientationchange', () => { ... })

// ❌ Re-applying layout when breakpoint hasn't changed — causes flicker
// Percentage-based widths already adapt via the layout engine
```

## 7. tiapp.xml configuration

### Android: enable multiple orientations

The `<activity>` element must include `android:name` and be nested inside `<application>`. Without `android:name`, Android's manifest merger fails with "Missing 'name' key attribute on element activity".

Titanium generates the main activity name as `<app-id>.<Appname>Activity`. For example, app ID `com.example.myapp` with name `MyApp` produces `com.example.myapp.MyappActivity`.

```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
  <manifest>
    <application>
      <activity
        android:name="com.example.myapp.MyappActivity"
        android:screenOrientation="fullSensor"/>
    </application>
  </manifest>
</android>
```

To verify the exact generated activity name, check `build/android/app/src/main/AndroidManifest.xml` after a build.

### Which activities a lock has to cover

`android:screenOrientation` is per-activity — it is not inherited from `<application>`. Every window the app opens runs inside one of a small, fixed set of activities declared by the Titanium AAR, so read the canonical list from the SDK instead of memorising it:

```bash
cat ~/.gradle/caches/*/transforms/*/transformed/jetified-titanium-*/AndroidManifest.xml
```

As of 13.4.0 there are exactly six, and `android:name` takes the fully-qualified form:

```
org.appcelerator.titanium.TiActivity
org.appcelerator.titanium.TiTranslucentActivity
ti.modules.titanium.media.TiCameraActivity
ti.modules.titanium.media.TiCameraXActivity
ti.modules.titanium.media.TiVideoActivity
ti.modules.titanium.ui.android.TiPreferencesActivity
```

The seventh is the app's own root activity, generated from the `<name>` in tiapp.xml (see the derivation rule above). Which one hosts what:

| What the app does | Activity |
|---|---|
| `Window.open()`, Tab, TabGroup, NavigationWindow | `org.appcelerator.titanium.TiActivity` |
| Window with `modal:true`, `opacity`, or a `backgroundColor` with alpha < 255 | `org.appcelerator.titanium.TiTranslucentActivity` |
| `showCamera({ overlay })` | `ti.modules.titanium.media.TiCameraActivity` (`TiCameraXActivity` when `useCameraX:true`) |
| `showCamera()` with no overlay | none of yours — Titanium launches the system camera app |
| VideoPlayer added to a regular Window | `org.appcelerator.titanium.TiActivity` |

Two things are better left undeclared:

- **`android:configChanges`.** The CLI strips it before the merge even happens — `_build.js` keeps a list of the `TiBaseActivity`-derived activities and calls `removeActivityAttribute(name, 'android:configChanges')` on each, with the reason spelled out in the source: *"Most devs don't set this right, causing UI to disappear when a config change occurs for a missing setting."* So a hand-written subset is not dangerous, just dead weight — Titanium's full list always wins.
- **A lock on `TiTranslucentActivity`.** Android 8–11 throws `IllegalStateException` ("Only fullscreen opaque activities can request orientation") when a translucent activity requests a fixed orientation. Declaring `orientationModes` on those windows is safer: the SDK applies it inside a try/catch (`TiWindowProxy.setOrientationModes`), so the worst case is a modal that rotates instead of an app that crashes.

### Prefer orientationModes over the manifest

`orientationModes` is defined on `TiWindowProxy`, so the same declaration works on `Window`, `TabGroup` and `NavigationWindow`. Being per-window it also composes with form-factor queries, which is what you usually want:

```xml
<!-- PurgeTSS -->
<TabGroup class="handheld:portrait tablet:landscape">
```

```tss
/* plain TSS equivalent */
'#tabs[formFactor=handheld]': { orientationModes: [ Ti.UI.PORTRAIT ] }
```

Alloy resolves `formFactor` from `Ti.Platform.Android.physicalSizeCategory`, which is why this is more reliable than any width comparison you could write yourself.

Keep the manifest for what Alloy cannot reach: the root activity, which shows the splash before any JS runs, and optionally `TiActivity` as a blanket fallback for windows that carry no class.

A single Ti Element rule covers every window in the app without touching a single view, which is usually all an Alloy app needs:

```javascript
// purgetss/config.cjs
module.exports = {
  theme: { extend: {} },
  'Window': { handheld: { apply: 'portrait' } }
}
```

```tss
/* generated — applies to every Window, including modal ones */
'Window[formFactor=handheld]': { orientationModes: [ Ti.UI.PORTRAIT ] }
```

Note it matches `Window` only, so a `TabGroup` still needs its own class. And because the declaration is per-window, it does nothing for the splash — that one stays in the manifest.

### Debugging a rotation that shouldn't happen

Ask the system for the effective value instead of re-reading the manifest:

```bash
adb shell dumpsys activity activities | grep -E "topResumedActivity|requestedOrientation"
```

If `requestedOrientation` disagrees with what tiapp.xml declares, something overrode it at runtime — grep the app for `requestedOrientation` and `orientationModes` before touching the manifest again. Note that an *existing* `orientationModes` can be the bug rather than the fix: an empty array unlocks rotation (see the anti-patterns above).

Before blaming the OS, let the SDK tell you. Titanium logs a warning when Android drops the request on a large screen, so this either hits or rules that cause out immediately:

```bash
adb logcat | grep "Orientation request will be ignored"
# Fixed orientation is not supported on large screens (smallest width: <N>dp).
# Orientation request will be ignored on Android 16+.
```

And to see the size bucket the device actually reports — `normal` means a phone, so the >= 600dp rule does not apply and the cause is in the app:

```bash
adb shell am get-config    # e.g. ...-sw360dp-w360dp-h802dp-normal-...
```

To confirm what actually shipped in the binary:

```bash
aapt2 dump xmltree --file AndroidManifest.xml <apk> | grep -A2 "E: activity"
```

### iOS: support all orientations on iPad

```xml
<ios>
  <plist>
    <dict>
      <key>UISupportedInterfaceOrientations</key>
      <array>
        <string>UIInterfaceOrientationPortrait</string>
      </array>
      <key>UISupportedInterfaceOrientations~ipad</key>
      <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
      </array>
    </dict>
  </plist>
</ios>
```

## 8. Quick reference

| Concept | Titanium API |
| --- | --- |
| Window size (split-screen safe) | `$.win.size.width` / `$.win.size.height` after `postlayout` — already in dp |
| Device screen size | `Ti.Platform.displayCaps.platformWidth` — pixels on Android, needs `/logicalDensityFactor` |
| Orientation (boolean) | `Ti.Gesture.portrait`, `Ti.Gesture.landscape` — properties, not methods |
| Orientation event | `Ti.Gesture.addEventListener('orientationchange', handler)` |
| Lock orientation | `orientationModes` on the window — not `activity.requestedOrientation` |
| Tablet detection | `Alloy.isTablet` / `[formFactor=tablet]` — never a pixel threshold |
| Effective orientation at runtime | `adb shell dumpsys activity activities \| grep requestedOrientation` |
| Window resize event | `$.win.addEventListener('postlayout', handler)` — fires on rotation, split-screen, resize |
| Auto-size | `Ti.UI.SIZE` (fit content), `Ti.UI.FILL` (fill remaining) |
| Percentages | `width: '50%'` relative to parent |
| Spacing | `left`/`top` as offset from previous sibling in horizontal/vertical |
| Batch updates | `view.applyProperties({...})` to reduce bridge overhead |

For detailed layout APIs, see the `ti-ui` skill's [layouts-and-positioning.md](../../ti-ui/references/layouts-and-positioning.md) and [orientation.md](../../ti-ui/references/orientation.md).
