# Adopting PurgeTSS in an Existing Alloy App

How to move an Alloy app whose styles live in hand-written `.tss` files (per-controller files, `#id` rules, inline XML attributes) to PurgeTSS utility classes. For upgrading a project that already uses PurgeTSS from one version to another, see [migration-guide.md](migration-guide.md) instead.

> **Source note:** the official PurgeTSS docs have no adoption guide. This page is TiTools author guidance, assembled from behavior verified in the PurgeTSS source (v7.17.1), the Alloy style-priority rules and `utilities.tss`. Every class in the tables below exists in `utilities.tss` with the value shown.

## Ground Rules

- **Never delete the user's `.tss` files without explicit consent.** Convert a view, show the result, and wait for confirmation before removing the old rules (see `SKILL.md` § "RESPECT USER FILES").
- **One view at a time.** Convert, compile, check on both platforms, then move on.
- **Alloy only.** The utility-class workflow does not exist in Classic projects; see [classic-projects.md](classic-projects.md).

## What PurgeTSS Does to Your Styles

| File | What happens |
| --- | --- |
| `app/styles/app.tss` | On the first run it is backed up to `app/styles/_app.tss`. From then on PurgeTSS **rewrites `app.tss` on every run**: resets, then the contents of `_app.tss`, then only the utility classes your views use. Never edit `app.tss` directly. |
| `app/styles/_app.tss` | Your original global styles. Keep custom global classes here; they are copied into `app.tss` on each run. |
| `app/styles/<controller>.tss` | Not touched. PurgeTSS reads these files only so the classes they define are not reported as missing. |
| `alloy.jmk` | The first run adds a hook so `purgetss` runs on every Alloy compile. See [installation-setup.md](installation-setup.md). |

### The Priority Trap

Alloy applies styles from lowest to highest priority: `styles/app.tss` (global), then `styles/<controller>.tss`, then attributes in the XML markup, with theme and platform-specific files layered in between (Alloy guide, "Style Priorities"). PurgeTSS classes land in `app.tss`, the **lowest** layer. During a partial migration this means:

- A leftover rule in `styles/index.tss` for the same element beats the utility class, silently.
- An inline attribute such as `backgroundColor="#fff"` beats both.

When a class "does nothing" mid-migration, look for a leftover rule in the controller's `.tss` or an attribute on the XML tag before suspecting PurgeTSS.

## Workflow

### 1. Set up

```bash
cd your-app
purgetss init   # creates ./purgetss/config.cjs
purgetss        # first purge: backs up app.tss to _app.tss and installs the alloy.jmk hook
```

Commit (or branch) before this step so the backup and the hook are easy to review.

### 2. Convert one view

Before:

```xml
<!-- app/views/index.xml -->
<View id="header">
  <Label id="title" text="Welcome" />
</View>
```

```tss
// app/styles/index.tss
'#header': { backgroundColor: '#ffffff', height: 64, top: 0 }
'#title': { color: '#1f2937', font: { fontSize: 18, fontWeight: 'bold' } }
```

After:

```xml
<!-- app/views/index.xml -->
<View class="top-0 h-16 bg-white">
  <Label class="text-lg font-bold text-gray-800" text="Welcome" />
</View>
```

Keep the `id` attributes if controller code uses them (`$.header`); only the style rules move.

### 3. Remove the old rules (with consent)

Once the converted view looks right on both platforms, and the user agrees:

1. Delete the converted rules from `app/styles/index.tss`. Remove the file only if nothing is left in it.
2. Move any global class still needed from `_app.tss` into utility classes, or leave it in `_app.tss`.
3. Run `purgetss` (or compile) to regenerate `app.tss`.

## Translation Tables

### Properties

| Hand-written TSS | PurgeTSS class |
| --- | --- |
| `backgroundColor: '#ffffff'` | `bg-white` |
| `backgroundColor: '#f3f4f6'` | `bg-gray-100` |
| `color: '#1f2937'` | `text-gray-800` (sets `color` and `textColor`) |
| `font: { fontSize: 18 }` | `text-lg` |
| `font: { fontWeight: 'bold' }` | `font-bold` |
| `width: Ti.UI.FILL` | `w-screen` |
| `width: '100%'` | `w-full` |
| `height: Ti.UI.SIZE` | `h-auto` |
| `height: 64` | `h-16` |
| `height: 60` (not on the scale) | `h-(60)` |
| `top: 0` | `top-0` |
| `top: 16` | `mt-4` |
| `left: 16, right: 16` | `mx-4` |
| `borderRadius: 8` | `rounded-lg` |
| `borderWidth: 1, borderColor: '#e5e7eb'` | `border border-gray-200` |
| `opacity: 0.5` | `opacity-50` |
| `visible: false` | `hidden` |
| `layout: 'horizontal'` | `horizontal` |
| `layout: 'vertical'` | `vertical` |
| `elevation: 4` | `elevation-1` (the scale is ×4: `elevation-4` is `16`) |

Spacing classes multiply by 4 (`mt-4` = 16), and the numbers are unitless: Titanium resolves them with `ti.ui.defaultunit` (see [values-and-units.md](values-and-units.md)). For a value off the scale use an arbitrary value: `h-(60)` keeps the default unit, while `h-(60px)` means explicit pixels and stops the build on v7.8.0 through v7.17.1 (see [arbitrary-values.md](arbitrary-values.md)). Colors in your brand palette belong in `config.cjs` (see [customization-deep-dive.md](customization-deep-dive.md)), not in arbitrary `bg-(#hex)` classes repeated across views.

### Platform and device conditionals

| Hand-written code | PurgeTSS |
| --- | --- |
| `if (OS_IOS) { $.box.top = 40 } else { $.box.top = 20 }` | `class="ios:mt-10 mt-5"` |
| `if (OS_ANDROID) { $.card.elevation = 4 }` | `class="android:elevation-1"` |
| Tablet width set in the controller | `class="tablet:w-6/12 w-screen"` |

See [platform-modifiers.md](platform-modifiers.md) for the full modifier list.

### Animations

| Hand-written animation | PurgeTSS Animation module |
| --- | --- |
| `Ti.UI.createAnimation({ opacity: 0, duration: 300 })` toggled by hand | `<Animation module="purgetss.ui" id="fade" class="close:opacity-0 open:opacity-100 duration-300" />` and `$.fade.play($.box)` |
| A scale-down press effect | `class="close:scale-100 open:scale-95 duration-150"` |

See [animation-system.md](animation-system.md).

## Pitfalls

| Pitfall | Consequence | Prevention |
| --- | --- | --- |
| Editing `app.tss` directly | Overwritten on the next run | Put custom global styles in `_app.tss` |
| Leaving the old rule in `<controller>.tss` | It overrides the utility class | Remove converted rules once the user agrees |
| Keeping inline attributes (`backgroundColor="…"`) | They override every class | Move them into classes |
| Flexbox classes (`flex-row`, `justify-between`) | Classes don't exist | `horizontal` / `vertical` layouts |
| `p-*` on a `View` or `Window` | No effect: `padding` exists only on `TextField`, `TextArea` and Android `CardView` | Margins on the children |
| `w-[100]` | Stops the build | `w-(100)` |
| Converting every view at once | Hard to find what broke | One view per step, tested on both platforms |
