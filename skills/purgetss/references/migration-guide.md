# Migration Guide

This guide mirrors the official PurgeTSS changelog (see the project `README.md` / `docs/index.md`). It walks through the upgrade-relevant changes from v7.2.6 through v7.11.x, flags breaking changes, and links each section to the reference files that cover the new surface area in depth.

Changelog source of truth: [https://github.com/macCesar/purgeTSS](https://github.com/macCesar/purgeTSS).

---

## Upgrade to v7.11.x

v7.11.0 and v7.11.1 are additive — **no breaking changes**. The headline addition is a compile-time SVG image pipeline that runs automatically as a post-step of `purgetss`, plus a `config.cjs` syntax validator. Nothing new is required on upgrade; the new surface is opt-in. Full release notes in [`version-history.md`](./version-history.md).

### Added in v7.11.0 — SVG compile-time image pipeline (opt-in)

Reference an `.svg` in a view or controller with `image="/images/<sub>/<name>.svg"` (or `backgroundImage="..."`) **alongside** utility classes that resolve to a numeric width/height (`w-32`, `w-(300)`, `h-auto`, …), and after the regular purge finishes PurgeTSS compiles that SVG into the 8 Titanium density variants (5 Android + 3 iPhone PNGs), sizing them from the dimensions resolved in `app.tss`. Titanium loads the generated `.png` automatically at runtime even though the source still references `.svg` — the SVG attribute is never rewritten.

- Cache lives at `purgetss/.cache/svg-images.json` — **add it to `.gitignore`**.
- Projects that never reference `.svg` images with sizing classes see no change. This is entirely opt-in by usage.

See [`multi-density-images.md`](./multi-density-images.md).

### Added in v7.11.0 — `images.files` override array

`config.cjs` accepts an `images.files` array to pin width/height for individual files in `purgetss/images/`:

```javascript
images: {
  autoSync: true,
  files: [
    { filename: 'images/logos/logo.png', width: 128, height: 52 }
  ]
}
```

Entries override a source's natural dimensions when `purgetss images` runs; CLI `--width` still wins over both. SVGs detected by the purge pipeline populate entries automatically (subject to `images.autoSync`). Raster entries you add by hand survive subsequent runs untouched.

### Added in v7.11.0 — `images.autoSync` opt-out

`images.autoSync` (boolean, default `true`). When `false`, purge still computes dimensions and generates the density PNGs, but never writes back to `config.cjs` — for devs who manage `images.files` by hand.

### Added in v7.11.0 — `config.cjs` syntax validator

Type mismatches in known config fields now print a formatted `Config Syntax Error` block (file, JSON path, context, issue, and a fix snippet) instead of a cryptic downstream crash like `rule.startsWith is not a function`. Currently validated: `theme.fontFamily.*` and `theme.extend.fontFamily.*` — **each font-family value must be a string**. The validator runs at config load time.

### Changed in v7.11.1 — symmetric cascade + current-run sync

- **Symmetric width/height cascade** — a class can pin width-only, height-only, or both. The unpinned side stays `null` in `images.files` and is re-derived from the SVG viewBox on every run, so no stale auto-derived dimension gets frozen into config.
- **`syncConfigImages` mirrors the current run** instead of taking `max()` across past runs. Shrinking a class (e.g. `h-52` → `h-16`) now propagates to `config.cjs` rather than freezing the entry at the larger past size. Pin manually with `images.autoSync: false`.
- **`purgetss images` respects `--yes`** for overwrite confirmations — the prompt no longer reappears when `--yes` is supplied.
- **SVGs listed in `images.files` always emit `.png`** regardless of `images.format`, because Titanium's `.svg → .png`-only runtime fallback means other formats wouldn't load. Raster files and SVGs not in `images.files` still honor `format`.

### What to review

- Add `purgetss/.cache/` to `.gitignore` before your next commit if you reference `.svg` images with sizing classes.
- If your `config.cjs` sets `theme.fontFamily` or `theme.extend.fontFamily` to anything other than a string, fix it now — the validator will halt with a `Config Syntax Error` block.
- If you manage `images.files` by hand and don't want purge overwriting your sizes, set `images.autoSync: false`.

---

## Upgrade to v7.10.x

v7.10.0 through v7.10.2 are additive — **no breaking changes**. The notable shift is internal: configs written before v7.7.0 (the `brand:` regroup) now auto-migrate in memory on every run, so projects that never updated to the grouped `brand:` schema keep working without a `TypeError` crash. Full release notes in [`version-history.md`](./version-history.md).

### Added in v7.10.0

- **`purgetss images --opacity / --padding / --output`** — three CLI-only flags aimed at placeholder / default ImageView workflows. `--opacity` multiplies alpha; `--padding` shrinks the rendered image inside each density canvas; `--output` retargets the basename and subpath. See [`multi-density-images.md`](./multi-density-images.md).
- **Google Play Feature Graphic in `brand`** — `purgetss brand` now generates `MarketplaceArtworkFeature.png` (1024×500). Auto-discovers `purgetss/brand/logo-feature.{svg,png}` or reuses the master logo. Tune with `--feature-graphic-padding <n>` (range `0-40`, default `12%`), `brand.padding.featureGraphic`, or `--feature-logo <path>`. See [`app-branding.md`](./app-branding.md).
- **Arbitrary nesting depth in `theme` objects** — property emission walks nested values recursively instead of stopping at level 2. `theme.extend.colors.brand.primary.500` now flattens to `brand-primary-500` instead of being silently dropped. Default keys (`default`, `global`, `DEFAULT`) collapse without contributing to the suffix. See [`arbitrary-values.md`](./arbitrary-values.md).
- **`apply:` resolves bundled icon fonts from `dist/`** — `apply: 'fas fa-times-circle wh-12 ...'` now merges the FontAwesome family and glyph automatically. Same lookup runs for `mi-*` (Material Icons), `ms-*` (Material Symbols), and `f7-*` (Framework7). Project-level `purgetss/styles/fontawesome.tss` still wins over the bundled default. See [`apply-directive.md`](./apply-directive.md).

### Fixed in v7.10.0

- **`borderRadius` arrays inside `apply:`** — the post-merge dedup step now tracks depth on `[]` alongside `{}`, so directional rules like `rounded-{t,b,l,r,tl,tr,bl,br}-*` no longer get split on internal commas.
- **`brand --padding <n>` shortcut** — now applies to BOTH Android paddings (`androidAdaptivePadding` AND `androidLegacyPadding`) as the help text always promised. Previously only fed the adaptive one.

### v7.10.1 — copy-only changes

- **"Tailwind" framing dropped** from copy that did not document a functional integration. Error block now reports `Square brackets "[ ]" are not supported` (previously `Tailwind-style brackets "[ ]"`). The promotional `<Label>` injected into new projects by `purgetss create` changed from `"Tailwind-inspired utility classes for Titanium/Alloy"` to `"Utility-first styling for Titanium/Alloy"`.
- **Functional integrations stay**: `tailwindcss@3` dependency installed by `install-dependencies` (drives the `defaultColors` / `defaultTheme` palette base AND the VSCode IntelliSense extension); `--tailwind` flag on `purgetss shades`; recommended `Tailwind CSS IntelliSense` and `Tailwind Raw Reorder (v4)` VSCode extensions.

### v7.10.2 — pre-7.7.0 brand config auto-migration

If your project still uses the **flat** `brand:` config that predates v7.7.0, v7.10.2 normalizes it in memory on every run before defaults are applied. Without this, the build crashed with `TypeError: Cannot create property 'ios' on number '15'` because `brand.padding` was a number, not an object.

Mapping (see [`app-branding.md` → Upgrading from pre-7.7.0 configs](./app-branding.md#upgrading-from-pre-7-7-0-configs)):

| Pre-7.7.0 flat key | Current grouped key |
| --- | --- |
| `brand.padding: <number\|string>` | `brand.padding.androidLegacy` AND `brand.padding.androidAdaptive` (same value applied to both) |
| `brand.iosPadding` | `brand.padding.ios` |
| `brand.bgColor` | `brand.colors.background` |
| `brand.darkBgColor` | `brand.ios.darkBackground` |
| `brand.notification` | `brand.android.notification` |
| `brand.splash` | `brand.android.splash` |

The grouped key always wins when both forms coexist. A one-time deprecation notice per session lists which legacy keys were migrated. Auto-migration is transitional and may be removed in a future major version — update `config.cjs` to the grouped schema to silence the notice and stay future-proof.

### What to review

- If you maintain a `brand:` block from pre-7.7.0, plan the one-time update to the grouped schema (`logos`, `padding`, `android`, `ios`, `colors`).
- If you previously skipped `apply:` with icon fonts because they were silently dropped, that workaround is no longer needed in v7.10.0.
- Deeply nested color families in `theme.extend.colors.*` that you flattened by hand to stay at depth ≤ 2 can be restructured by domain — the recursive emission now reaches every leaf.

---

## Upgrade to v7.9.0

v7.9.0 ships one **breaking** path rename plus a behavior change for `theme.Window` / `theme.View` / `theme.ImageView` that can surface as a regression if a project depended on the framework defaults being merged in.

### Breaking — glossary output path renamed

The user-facing glossary output path moved from `purgetss/experimental/tailwind-classes/` to `purgetss/glossary/tailwind-classes/`. Tooling or CI that reads from the old path needs updating on upgrade — no transition shim was added on purpose. The `--glossary` flag and command surface are unchanged.

### Headline behavior change — replace mode for top-level `theme.Window` / `View` / `ImageView`

Before v7.9.0, `theme.Window` (no `extend`) still merged with the framework defaults (white `backgroundColor`, `Ti.UI.SIZE` on `View`, iOS `hires: true` on `ImageView`), which produced gradient ghosting and similar overrides. v7.9.0 makes top-level configs behave as true **replace mode**.

If you previously wrote:

```javascript
theme: {
  Window: {
    apply: 'bg-gradient-to-b from-blue-500 to-purple-600'
  }
}
```

…and **depended** on the implicit white background, the gradient now renders without that background underneath. Move the config under `theme.extend.Window` to keep the merged behavior, or add the previously-implicit utilities back into the `apply` string. See [`apply-directive.md` → Extend mode vs replace mode](./apply-directive.md#extend-mode-vs-replace-mode).

### Added in v7.9.0

- **Opacity modifiers on semantic colors** — `bg-surface/65` now works for any class mapped through `theme.extend.colors`. PurgeTSS auto-derives `<originalKey>_<alphaPercent>` entries in `semantic.colors.json` per mode (light/dark). **Native rebuild required** — Liveview hot-reload alone does not refresh `semantic.colors.json`. See [`semantic-colors.md`](./semantic-colors.md#opacity-modifier-auto-derivation).

### Fixed in v7.9.0

- Several fixes around semantic colors, gradients, and Ti Element defaults: tonal palette no longer inverts Light and Dark; gradient `from` / `to` color order is position-stable across `sort()`; `bg-gradient-to-X` direction is preserved when combined with `from-X to-Y` in the same `apply`; `theme.Window` / `theme.View` / `theme.ImageView` no longer ghost framework presets at the top level (see Headline behavior change above).

---

## Upgrade to v7.8.0

v7.8.0 introduces a structured `Class Syntax Error` block that **halts the build** when it detects known class-name mistakes — previously these flowed silently into the `// Unused or unsupported classes` block of `app.tss`.

### Added — Class Syntax Error pre-validation

Five patterns are now caught and reported with file + line + suggested fix:

| Pattern | Offending input | Fix |
| --- | --- | --- |
| Inverted negative sign | `top-(-10)` | `-top-(10)` |
| Square-bracket notation | `top-[10px]` | `top-(10px)` |
| Empty parentheses | `wh-()` | (flagged, no auto-fix) |
| Whitespace inside parentheses | `wh-( 200 )` | `wh-(200)` |
| Redundant `px` unit | `top-(10px)` | `top-(10)` |

All offenders are reported in a single run. Generic unknown classes — typos, vendor utilities not enabled, custom classes not declared yet — continue to flow into `// Unused or unsupported classes`. See [`arbitrary-values.md` → Class syntax pre-validation](./arbitrary-values.md#class-syntax-pre-validation).

### Added — `purgetss images --width <n>` (v7.8.0)

Pins Android `mdpi` (= iPhone `@1x`) to `<n>` pixels wide. Larger scales derive as ×1.5, ×2, ×3, ×4 from that base. Range `[1, 8192]`. Most useful for SVG sources from vector editors (Affinity, Illustrator) with disproportionate viewBoxes. CLI-only — width is per-asset, not a project-wide setting. See [`multi-density-images.md`](./multi-density-images.md#pinning-the-output-width-with---width).

### Fixed in v7.8.0

- The arbitrary-value parser no longer crashes on negative values inside parentheses — `top-(-10)` is now recognized and reported as an inverted-negative-sign error instead of triggering a `Cannot read properties of null (reading 'pop')` exception.

### What to review

- Run the build once on the upgraded version and address every `Class Syntax Error` it surfaces. The offender list is exhaustive in one pass.
- If a CI step depended on a malformed class quietly landing in the unused-classes block, it will now hard-fail — adjust the CI accordingly.

---

## Upgrade to v7.7.0

v7.7.0 cleans up the `brand:` config before stabilizing it. **Pre-7.10.2** projects on the flat schema crashed; from v7.10.2 onward the flat schema auto-migrates in memory (see Upgrade to v7.10.x). The recommended migration is still a one-time update to the grouped schema.

### Restructure — grouped `brand:` config

Branding settings moved out of flat keys into purpose-based groups: `brand.logos`, `brand.padding`, `brand.android`, `brand.ios`, `brand.colors`.

```javascript
// Pre-7.7.0 — flat
brand: {
  padding: 15,
  iosPadding: 4,
  bgColor: '#FFFFFF',
  notification: false,
  splash: false
}

// v7.7.0+ — grouped
brand: {
  padding: {
    ios: '4%',
    androidLegacy: '10%',
    androidAdaptive: '19%'
  },
  android: {
    notification: false,
    splash: false
  },
  colors: {
    background: '#FFFFFF'
  }
}
```

### Added in v7.7.0

- **Separate Android brand inputs** — `logos.androidLauncher` / `--icon-logo` for the Android launcher icon; `logos.androidSplash` / `--splash-logo` for Android 12+ splash artwork. Drop `logo-icon.*` / `logo-splash.*` into `purgetss/brand/` for auto-discovery.
- **Independent Android paddings** — `--android-adaptive-padding` (default `19%`) and `--android-legacy-padding` (default `10%`) replace the single `--padding`. `--padding` is now a shortcut that sets both for one run (note: the shortcut bug where only `androidAdaptive` was applied was fixed in v7.10.0).
- **Android splash fallback regenerated** — `app/assets/android/default.png` (Alloy) or `Resources/android/default.png` (Classic). `cleanup-legacy` no longer removes `default.png`.
- **Values and Units doc** — new official reference explaining how `ti.ui.defaultunit` in `tiapp.xml` interprets PurgeTSS unitless values. See [`values-and-units.md`](./values-and-units.md).

---

## Upgrade to v7.6.0

v7.6.0 introduces three new CLI commands for app-asset generation plus two new `config.cjs` sections. None of the additions are breaking — existing projects continue to work untouched, and the new config sections are auto-injected on first run.

### New CLI commands

- **`brand` command** — generates the complete Titanium branding set (launcher icons, adaptive icons, iOS 18+ Dark and Tinted variants, marketplace artwork, optional notification and splash images) from logos auto-discovered in `./purgetss/brand/`. Works on both Alloy and Classic projects.
- **`images` command** — generates multi-density UI images (Android `res-*` densities plus iPhone `@1x` / `@2x` / `@3x` scales) from sources dropped into `./purgetss/images/`. Subdirectories are preserved, and short-path scope targeting lets you re-process individual files.
- **`semantic` command** — generates Titanium semantic colors (Light/Dark mode) into `app/assets/semantic.colors.json`. Two dispatch modes:
  - **Tonal palette** (default): one base hex → 11 shades with mirror inversion and auto config mapping.
  - **Single purpose-based color** (`--single`): explicit per-mode hex plus optional alpha; writes both the JSON entry AND a class mapping in `config.cjs` in one shot. Class name is auto-derived by stripping the `Color` suffix (e.g. `surfaceColor` → class `surface`). Smart in-place updates when a single name matches an existing palette shade.

### New `config.cjs` sections

- **`brand:` section** — configures padding percentages, background colors, and platform targets for the `brand` command.
- **`images:` section** — configures scale factors and output density mapping for the `images` command.

Percentages can be written as self-documenting strings (e.g. `'15%'`) or plain numbers. Both are accepted. These sections are auto-injected into older `config.cjs` files on the first run of v7.6.0.

### What to review

- If you previously generated app icons or multi-density images manually (or with third-party tooling), plan a migration session to replace that workflow with `brand` and `images`.
- If you maintain a `semantic.colors.json` by hand, back it up before running `semantic` — the command does smart in-place updates, but a backup is cheap insurance.

### Cross-references

- [`app-branding.md`](./app-branding.md) — full walkthrough of the `brand` command and the `./purgetss/brand/` convention.
- [`multi-density-images.md`](./multi-density-images.md) — `images` command, density mapping, and subdirectory behavior.
- [`semantic-colors.md`](./semantic-colors.md) — palette vs single-color modes, alpha handling, and config mapping.
- [`cli-commands.md#brand-command`](./cli-commands.md#brand-command)
- [`cli-commands.md#images-command`](./cli-commands.md#images-command)
- [`cli-commands.md#semantic-command`](./cli-commands.md#semantic-command)

---

## Upgrade to v7.5.3

v7.5.3 is a feature-and-polish release. No breaking changes.

### Added

- **Appearance module** — a new `Appearance` export for Light/Dark/System mode switching with persistence. Exposed methods: `init()`, `set(mode)`, `get()`, `toggle()`.
- **Default font family classes** — `font-sans`, `font-serif`, and `font-mono` are generated automatically with platform-appropriate values (system sans, serif, and monospace stacks for iOS and Android).
- **XML validation** — the pre-validation pass now detects illegal `--` sequences inside XML comments, which previously produced cryptic downstream errors.

### What to review

- If you want runtime theme switching, wire up `Appearance.init()` at app boot and use `Appearance.toggle()` or `Appearance.set('dark')` where the UI exposes the control.
- If you had custom `font-sans` / `font-serif` / `font-mono` classes in `config.cjs`, check for collisions with the new auto-generated ones.

### Cross-references

- [`appearance-module.md`](./appearance-module.md) — full `Appearance` API, persistence behavior, and integration patterns.

---

## Upgrade to v7.5.0

v7.5.0 adds `extend` support for component defaults and improves how `apply` directives are normalized. It also bumps Font Awesome. No breaking changes.

### Added

- **`extend` support for Window, View, and ImageView** — customize component defaults from `theme.extend` in `config.cjs`. Previously only a subset of components supported `extend`.
- **Shorthand `apply`** — `{ apply: '...' }` is automatically normalized, so the `default:` wrapper is now optional.
- **Property deduplication** — values pulled in via `apply` now win over static defaults instead of producing duplicate property entries in the generated TSS.
- **Automatic platform resolution** — classes referenced inside `ios:` / `android:` blocks automatically find their platform-specific version instead of requiring explicit disambiguation.
- **Font Awesome 7.2.0** bundled.

### Fixed

- `extend.Window` was silently ignored in earlier versions — now honored.
- Duplicate `font` properties in generated output.
- Array-type properties generating output without `[ ]` notation.

### What to review

- If you previously worked around the `extend.Window` bug with manual TSS overrides, you can remove those now.
- If you previously wrote `{ default: { apply: '...' } }`, the shorter `{ apply: '...' }` form is equivalent.
- Diff your generated `utilities.tss` against the pre-upgrade version: property deduplication and the array-notation fix may produce cleaner output, which is expected.

### Cross-references

- [`customization-deep-dive.md`](./customization-deep-dive.md) — `theme.extend` patterns for Window, View, and ImageView defaults.
- [`apply-directive.md`](./apply-directive.md) — shorthand `apply` syntax and deduplication behavior.

---

## Upgrade to v7.4.0

v7.4.0 is the **Animation module expansion**. Nine new methods bring the Animation module to 15 total.

### Added

- **New methods**: `transition`, `pulse`, `sequence`, `swap`, `shake`, `snapTo`, `reorder`, `undraggable`, `detectCollisions`.
- **New utility classes**: `snap-back`, `snap-center`, `snap-magnet`, `keep-z-index`.
- **Delta-based drag for transformed views** — drag math now works correctly when the view already has a 2D transform applied.
- **Position normalization** and **property inheritance** from the Animation object — reduces boilerplate when sequencing multiple animations on the same view.

### What to review

- If you previously hand-rolled sequential animations with `Ti.UI.createAnimation` callbacks, consider porting them to `sequence` for readability.
- If you implemented ad-hoc drag/snap logic, compare it with `snapTo` + `detectCollisions` — the new pipeline handles z-index, collision detection, and snap-back without manual bookkeeping.

### Cross-references

- [`animation-system.md`](./animation-system.md) — full Animation module reference including all 15 methods and the snap / drag / collision utilities.

---

## Upgrade to v7.3.x

v7.3.0 introduced a **breaking file rename** plus XML validation and Classic Titanium compatibility improvements.

### Breaking Changes

- **`tailwind.tss` → `utilities.tss`** — the generated utilities output was renamed to reflect that PurgeTSS is a standalone toolkit, not a Tailwind port.
  - Generated file: `purgetss/styles/utilities.tss`
  - Distribution file: `dist/utilities.tss`

### Major Improvements

- **XML syntax validation** — pre-validation now catches malformed Alloy XML before processing, with line numbers and fix suggestions.
- **Classic Titanium compatibility** — `deviceInfo()` now works in both Alloy and Classic projects. The dependency on `Alloy.isTablet` and `Alloy.isHandheld` was removed.

### Required Actions

1. Update any scripts, docs, or project references that still point to the previous `tailwind.tss` filename.
2. Ensure your environment is running Node.js 20 or higher.
3. If you use Font Awesome 7, verify the project after upgrade so PurgeTSS can handle the new `--fa:` properties.

```bash
# Current path
purgetss/styles/utilities.tss
```

### Recommended upgrade command

```bash
npm install -g purgetss@latest
```

If you run into issues after upgrading:

```bash
npm uninstall -g purgetss
npm install -g purgetss
```

---

## Upgrade to v7.2.7

v7.2.7 is a security and maintenance release.

### Added / Updated

- **Security fixes** — command injection in `glob`, prototype pollution in `js-yaml`.
- **Dependency cleanup** — reduces installation size by ~45MB, removed unused packages.
- **Titanium SDK 13.1.0.GA** — new utility classes for `navBarColor`, `forceBottomPosition`, `multipleWindows`.

### What to review

- If you pinned PurgeTSS to a pre-7.2.7 version for reproducibility, plan the bump: the security advisories affect any environment that resolves transitive `glob` or `js-yaml`.

---

## Upgrade to v7.2.6

v7.2.6 is a minor refresh release.

### Updated

- Font Awesome bumped to version 7.1.0.
- Simplified flag property names in `utilities.tss`.

---

## Community-Discovered Patterns

Issues reported and patched outside the official changelog. These are documented here so users upgrading through multiple versions know to re-test the affected surface area. **Needs confirmation** — the version in which each fix shipped has not been verified against the official changelog at time of writing.

### `backgroundGradient.colors` serialization with arrays of objects

Certain versions of PurgeTSS could produce broken output in `utilities.tss` when a custom rule defined `backgroundGradient.colors` as an array of `{ color, offset }` objects, for example:

```javascript
const colors = [
  { color: '#132C50', offset: 0 },
  { color: '#0A1529', offset: 1 },
];
```

If you previously worked around this by inlining the gradient directly in TSS, re-test after upgrading: current versions serialize the array correctly. The exact version in which this was patched is not called out in the official changelog — treat this as a user-observed fix until confirmed.

---

## Quick Checklist

- Replace every legacy `tailwind.tss` reference with `utilities.tss`.
- Verify Node.js 20+ before upgrading past v7.3.0.
- Rebuild after updating `config.cjs` or custom gradient rules.
- Re-test any Classic Titanium code that depends on `deviceInfo()`.
- After v7.5.0: diff generated `utilities.tss` to confirm property deduplication produces the expected output.
- After v7.5.3: consider wiring `Appearance.init()` at app boot if you want runtime Light/Dark switching.
- After v7.6.0: run `brand`, `images`, and `semantic` once in a scratch project before pointing them at production assets, so you can preview the output layout.
- After v7.7.0: migrate the `brand:` block in `config.cjs` to the grouped schema (`logos`, `padding`, `android`, `ios`, `colors`). v7.10.2 auto-migrates flat configs in memory, but the one-time update is recommended to silence the deprecation notice.
- After v7.8.0: run the build once and address every `Class Syntax Error` it surfaces. Update CI to handle the new hard-fail on malformed class names. Migrate any `top-[10px]` style square brackets to `top-(10px)` parentheses.
- After v7.9.0: search for any `purgetss/experimental/tailwind-classes/` references in tooling/CI and update to `purgetss/glossary/tailwind-classes/`. If a project used top-level `theme.Window` / `View` / `ImageView` and depended on framework defaults being merged in, decide between moving the config under `theme.extend.*` or adding the previously-implicit utilities to the `apply` string.
- After v7.10.0: deeply nested color families (`theme.extend.colors.brand.primary.500`) now emit recursively — restructure by domain if it improves readability. `apply:` with bundled icon fonts (`fas`, `mi-*`, `ms-*`, `f7-*`) no longer requires `build-fonts` first. The Google Play Feature Graphic ships automatically with `purgetss brand`.
- After v7.11.0: reference `.svg` images with numeric `w-*`/`h-*` classes to opt into the compile-time SVG pipeline (add `purgetss/.cache/` to `.gitignore`). Ensure every `theme.fontFamily.*` value is a string, not a Tailwind-style array, or the new config validator hard-fails. Use `images.files` to pin per-file sizes and `images.autoSync: false` to stop the pipeline writing back to `config.cjs`.
