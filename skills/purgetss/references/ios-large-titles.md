# iOS Large Titles

Enabling Large Titles on a Window is not a single-property change. When you pair `largeTitleEnabled` with a `ScrollView` inside a `NavigationWindow` or `TabGroup`, **three interdependent iOS Window properties** must work together — otherwise you get either content hidden behind the nav bar or a visible rendering delay when the window opens.

| Property | Value | Why it matters |
| --- | --- | --- |
| `autoAdjustScrollViewInsets` | `true` | iOS automatically adjusts the ScrollView content insets so content starts below the nav bar instead of behind it. |
| `extendEdges` | `[Ti.UI.EXTEND_EDGE_ALL]` | Content extends under the nav/tab bars, producing the translucent blur effect Large Titles depend on. |
| `largeTitleEnabled` | `true` | Shows the large title that collapses to the standard nav bar title as the user scrolls. |

Using only `largeTitleEnabled` causes the nav bar region to render empty for a moment before the title draws. Using `extendEdges` without `autoAdjustScrollViewInsets` pushes content behind the nav bar without compensating the ScrollView insets. All three must be present.

## iOS-only — use the `ios:` modifier

Large Title properties are iOS-only. On Android they either do nothing or raise compile-time errors. Always scope them with the `ios:` platform block in `config.cjs`, not as defaults that leak to Android.

## Global defaults in `config.cjs`

Rather than repeating the three classes on every `Window`, set them once at the Ti Element level so every iOS Window inherits the base behavior:

`./purgetss/config.cjs`
```js
module.exports = {
  theme: {
    Window: {
      ios: {
        apply: 'auto-adjust-scroll-view-insets extend-edges-all large-title-enabled'
      }
    }
  }
};
```

Generated style in `./purgetss/styles/utilities.tss`:

```tss
'Window[platform=ios]': { autoAdjustScrollViewInsets: true, extendEdges: [ Ti.UI.EXTEND_EDGE_ALL ], largeTitleEnabled: true }
```

Individual windows now only need to override `largeTitleDisplayMode` when they want different collapse behavior (e.g. detail windows).

> **Why an `ios:` block and not an inline `ios:` prefix?** `auto-adjust-scroll-view-insets` and `extend-edges-all` are platform-specific classes — they only exist with `[platform=ios]` suffix in `utilities.tss`. The `ios:` block ensures PurgeTSS resolves the platform-suffixed version. See [apply-directive.md](apply-directive.md) → "Platform-Specific Classes".

## NavigationWindow example

`./app/views/index.xml`
```xml
<Alloy>
  <NavigationWindow id="navWin">
    <Window title="Home">
      <ScrollView class="vertical content-w-screen content-h-auto">
        <!-- Content starts below the nav bar automatically -->
      </ScrollView>
    </Window>
  </NavigationWindow>
</Alloy>
```

The Window inherits `auto-adjust-scroll-view-insets`, `extend-edges-all`, and `large-title-enabled` from the `theme.Window.ios.apply` defaults above.

## TabGroup example

On iOS, `TabGroup` wraps each `Tab`'s Window in an **implicit NavigationWindow**. You do not declare the inner `NavigationWindow` yourself — iOS adds it. The three-property pattern applies identically:

`./app/views/index.xml`
```xml
<Alloy>
  <TabGroup>
    <Tab title="Home">
      <Window title="Home">
        <ScrollView class="vertical content-w-screen content-h-auto">
          <!-- Each tab gets its own implicit NavigationWindow -->
        </ScrollView>
      </Window>
    </Tab>
  </TabGroup>
</Alloy>
```

## Controlling the collapse behavior: `largeTitleDisplayMode`

`largeTitleDisplayMode` controls how the title behaves in the navigation stack:

| Mode | Constant | Behavior |
| --- | --- | --- |
| Automatic | `Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_AUTOMATIC` | Inherits from previous window; collapses on scroll. |
| Always | `Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_ALWAYS` | Title stays large regardless of scroll position. |
| Never | `Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_NEVER` | Always uses the standard (small) title size. |

### Detail windows: use `large-title-display-mode-never`

Detail windows typically should not show a large title — it looks oversized for a secondary screen. PurgeTSS ships a utility class for this:

```xml
<Window class="large-title-display-mode-never" title="Detail">
  <!-- Standard nav bar title, regardless of global largeTitleEnabled default -->
</Window>
```

This overrides only the display mode, so the window still benefits from the inherited `autoAdjustScrollViewInsets` and `extendEdges` defaults.

## ScrollView pairing: `content-w-screen content-h-auto`

When Large Titles are active, the paired ScrollView needs its content area sized so iOS can shrink/grow the title as the user scrolls. The canonical pattern:

```xml
<ScrollView class="vertical content-w-screen content-h-auto">
  <!-- children -->
</ScrollView>
```

- `content-w-screen` → `contentWidth: Ti.UI.FILL`
- `content-h-auto` → `contentHeight: Ti.UI.SIZE`

Sizing the content height to `Ti.UI.SIZE` is what lets iOS determine whether there is enough content to allow the large title to collapse on scroll.

## Quick reference — class to property map

| Class | Property | Value |
| --- | --- | --- |
| `auto-adjust-scroll-view-insets` | `autoAdjustScrollViewInsets` | `true` |
| `extend-edges-all` | `extendEdges` | `[Ti.UI.EXTEND_EDGE_ALL]` |
| `large-title-enabled` | `largeTitleEnabled` | `true` |
| `large-title-enabled-false` | `largeTitleEnabled` | `false` |
| `large-title-display-mode-never` | `largeTitleDisplayMode` | `Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_NEVER` |
| `content-w-screen` | `contentWidth` | `Ti.UI.FILL` |
| `content-h-auto` | `contentHeight` | `Ti.UI.SIZE` |

## Community-Discovered Patterns

### TabGroup implicit-NavigationWindow wrapping

A recurring source of confusion: iOS `TabGroup` already wraps each `Tab` in an implicit `NavigationWindow`. Manually nesting a `NavigationWindow` inside a `Tab` can produce a double nav bar or break `openWindow()` push transitions. Keep the markup flat — `Tab > Window` — and rely on the implicit wrapper.

### Detail windows should opt out, not opt in

When `theme.Window.ios.apply` sets `large-title-enabled` as a default, every pushed window inherits it. Apply `large-title-display-mode-never` on detail windows pushed via `openWindow()` so the parent keeps the collapse animation while detail screens render with a standard title. This mirrors Apple's own first-party app conventions (Settings, Mail).

### Cross-reference

The three-property pairing (`autoAdjustScrollViewInsets` + `extendEdges` + `largeTitleEnabled`) is also documented as a reusable global-defaults recipe in [apply-directive.md](apply-directive.md) under *Community-Discovered Patterns → Global Window defaults for Large Titles + ScrollView (iOS)*. Prefer that recipe over per-window repetition whenever the whole app uses Large Titles.
