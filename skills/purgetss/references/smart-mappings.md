# Smart Mappings & Platform Realities

Platform-bridge knowledge: how PurgeTSS utility classes translate to Titanium native properties under the hood. This is a curated synthesis — class names resemble Tailwind, but the values they emit target Titanium SDK properties (`zIndex`, `viewShadowOffset`, `elevation`, `anchorPoint`, `rotate`, `layout`, etc.), not CSS.

For the full inventory of every available class, see [`class-index.md`](./class-index.md) and [`class-categories.md`](./class-categories.md).

## Community-Discovered Patterns

### 1. The "Gap" Utility (External Margins, Not CSS Gap)

In PurgeTSS, `gap` is mapped to **external margins** on the element itself (`top`, `right`, `bottom`, `left`) because Titanium lacks a native CSS-style gap property.

- **Behavior**: `.gap-4` emits `{ top: 16, right: 16, bottom: 16, left: 16 }` on the element — 16dp of margin on **all four sides**.
- **Critical Difference from CSS**: In web CSS, `gap` only renders *between* flex/grid children. Here, two siblings each carrying `.gap-4` will show **32dp** of total space between them (16dp contributed by each).
- **Directional variants** (verified in `lib/templates/` → compiled `dist/utilities.tss`):
  - `.gap-x-{size}` — emits `right` and `left` only (horizontal margins).
  - `.gap-y-{size}` — emits `top` and `bottom` only (vertical margins).
  - `.gap-{t|r|b|l}-{size}` — single-side gap (e.g. `.gap-t-4`).
- **Evidence**: Official [`purgetss-docs-context7/docs/grid-system.md`](https://github.com/macCesar/purgeTSS) § "Gutter utilities".

### 2. Hybrid Shadows (iOS vs. Android in One Class)

Shadow utilities (`.shadow-xs`, `.shadow-sm`, `.shadow`, `.shadow-md`, `.shadow-lg`, `.shadow-xl`, `.shadow-2xl`, `.shadow-inner`, `.shadow-outline`, `.shadow-none`) emit cross-platform depth by setting iOS and Android properties simultaneously:

- **iOS**: `viewShadowOffset`, `viewShadowRadius`, `viewShadowColor`.
- **Android**: `elevation`.
- **Z-Order Warning (Android-only)**: On Android, `elevation` doubles as a stacking-order hint — an elevated view renders *on top of* siblings with lower or no elevation. iOS shadows do **not** affect z-order. If you apply `.shadow-md` to one card in a list, it may unexpectedly cover adjacent cards on Android.
- **Evidence**: `dist/utilities.tss` (see `'.shadow-md': { viewShadowOffset: ..., elevation: 24 }`), cross-referenced against Titanium SDK `Ti.UI.View` property behavior.

### 3. Grid Container Auto-Width

The `.grid` and `.grid-flow-col` classes emit **both** `layout: 'horizontal'` **and** `width: '100%'` (`.grid-flow-row` emits `layout: 'vertical', height: '100%'`).

- **Why the width is baked in**: PurgeTSS resets `View` defaults to `SIZE`. A grid container needs an explicit dimension so that percentage-based children (e.g. `.col-span-6` emitting `width: '50%'`) have a parent measurement to resolve against.
- **Official docs** ([`grid-system.md`](https://github.com/macCesar/purgeTSS)) only document the `layout: 'horizontal'` half. The `width: '100%'` behavior is **verified against `lib/templates/` → `dist/utilities.tss`** (lines emit `'.grid': { layout: 'horizontal', width: '100%' }`).
- **Manual override**: If you need a grid sized to its content only, pair it with `.wh-auto` or an explicit sizing utility.

### 4. Native Rotations via `rotate` (Not CSS Transform)

The `.rotate-{n}` utilities (`rotate-0`, `rotate-1`, `rotate-2`, `rotate-3`, `rotate-6`, `rotate-12`, `rotate-45`, `rotate-90`, `rotate-135`, `rotate-180`, `rotate-225`, `rotate-270`, `rotate-315`, `rotate-360`) map **directly** to Titanium's `rotate` property — a plain numeric degree value on the view.

- **Default anchor**: Titanium rotates around the view's **center**. To change this, use an `.origin-*` utility (`.origin-top`, `.origin-top-left`, `.origin-center`, `.origin-bottom-right`, etc.) which emits `anchorPoint: { x, y }`.
- **No chained transforms**: Unlike CSS (`transform: rotate(45deg) scale(1.5)`), Titanium treats each transformation as an independent view property. For combined transforms you must build a `Ti.UI.2DMatrix`/`Ti.UI.Matrix2D` and assign it to `transform`.
- **Evidence**: `dist/utilities.tss` lines `'.rotate-45': { rotate: 45 }` and `'.origin-center': { anchorPoint: { x: 0.5, y: 0.5 } }`.

### 5. Z-Index Uses the Full `z-index-*` Prefix

- **Classes**: `.z-index-0`, `.z-index-10`, `.z-index-20`, `.z-index-30`, `.z-index-40`, `.z-index-50` (six values total).
- **Mapping**: Each emits the Titanium `zIndex` property with the numeric suffix (`.z-index-10` → `{ zIndex: 10 }`).
- **Important — no Tailwind-style `z-10` shorthand exists.** The full `z-index-` prefix is required. See [`class-index.md`](./class-index.md) (under `zIndex`) and [`class-categories.md`](./class-categories.md) (row "`z-index-*`").
- **Titanium stacking note**: In a Titanium parent, the **order in which children are added** sets the base stacking (last `add()`ed is on top). `zIndex` should be used sparingly for explicit overlays; for Android, remember that `elevation` (from `.shadow-*` or `.elevation-*`) also influences rendering order.
- **Evidence**: `dist/utilities.tss` lines 7952–7957.
