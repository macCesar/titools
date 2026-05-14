# PurgeTSS — Version History

Release-by-release feature additions and behavior changes. The current behavior of PurgeTSS is documented in the main `SKILL.md` and its reference files; this page is the historical record.

## What's New in v7.10.2

- **Pre-7.7.0 brand config auto-migration.** Configs written before v7.7.0 (the `brand:` regroup) now auto-migrate in memory on every run. The legacy flat layout (`brand.padding: <number>`, `brand.iosPadding`, `brand.bgColor`, `brand.darkBgColor`, top-level `brand.notification` / `brand.splash`) used to crash auto-purge with `TypeError: Cannot create property 'ios' on number '15'`. `getConfigFile()` now normalizes legacy keys to the grouped layout (`brand.padding.{ios, androidLegacy, androidAdaptive}`, `brand.android.*`, `brand.ios.darkBackground`, `brand.colors.background`) before applying defaults. When both legacy and new keys coexist, the new key wins. A one-time deprecation notice per session lists the migrated keys. See [App Icons & Branding → Upgrading from pre-7.7.0 configs](app-branding.md).
- **Internal logger fix.** `logger.warning` and `logger.success` are now defined. Across `brand`, `images`, `cleanup-legacy`, and `svg-utils`, ~30 callsites of `logger.warning` and ~10 of `logger.success` referenced methods that did not exist on the logger object — any opt-in command path that hit one used to throw `TypeError: logger.warning is not a function`. The auto-purge entry point most users hit did not reach those callsites, so the bug stayed latent until commands like `purgetss brand` or `purgetss images` were run.

## What's New in v7.10.1

- **"Tailwind" framing dropped from copy that did not document a functional integration.** The Class Syntax Error block now reports `'Square brackets "[ ]" are not supported'` instead of `'Tailwind-style brackets "[ ]" are not supported'`. The promotional `<Label>` injected into new projects by `purgetss create` changed from `"Tailwind-inspired utility classes for Titanium/Alloy"` to `"Utility-first styling for Titanium/Alloy"`.
- **Functional integrations stay.** The `tailwindcss@3` dependency installed by `install-dependencies` (drives both the `defaultColors` / `defaultTheme` palette base AND the VSCode IntelliSense extension) still ships. The `--tailwind` flag on `purgetss shades` and the recommended `Tailwind CSS IntelliSense` / `Tailwind Raw Reorder (v4)` VSCode extensions are unchanged.

## What's New in v7.10.0

- **`purgetss images` got three CLI-only flags.**
  - `--opacity <n>` (integer `0-100`) multiplies the alpha channel of every generated density by `n/100` — useful for placeholder or default ImageView images that render at reduced opacity (loading states, watermarks). With `--format jpeg`, the JPEG flatten-on-white step composites the semi-transparent image onto white instead of producing transparent JPEGs (JPEG has no alpha).
  - `--padding <n>` (integer `0-40`) shrinks the rendered image inside each density canvas by symmetric percentage borders, preserving canvas size with transparent fill — useful for breathing room around an unpadded logo.
  - `--output <relpath>` overrides the basename and subpath relative to each platform's `images/` root, so a logo from `purgetss/brand/` can be written as `images/logos/loading.png` across all densities in a single command.
  - The three flags combine naturally for "transparent placeholder with padding under a custom path". See [Multi-Density Images](multi-density-images.md).
- **`purgetss brand` now generates `MarketplaceArtworkFeature.png` (1024×500 Google Play Feature Graphic)** alongside the existing iTunesConnect and MarketplaceArtwork submission assets. Auto-discovers `purgetss/brand/logo-feature.{svg,png}` or reuses the master logo if not provided. Default vertical padding is `12%`; override with `--feature-graphic-padding <n>` (range `0-40`), config `brand.padding.featureGraphic`, or CLI `--feature-logo <path>` for a dedicated source. Submission artwork only — written to project root for upload to the Play Console, not bundled into the APK. See [App Icons & Branding](app-branding.md).
- **Arbitrary nesting depth in `config.cjs` `theme` objects.** Property emission now walks nested values recursively instead of stopping at level 2, so `theme.extend.colors.brand.primary.500` flattens to `brand-primary-500` instead of being silently dropped. Same for `backgroundGradient` and `backgroundSelectedGradient`. Default modifier keys (`default`, `global`, `DEFAULT`) collapse without contributing to the suffix. See [Arbitrary Values](arbitrary-values.md).
- **Fix:** `apply:` now resolves built-in icon font classes (`fas`, `fab`, `fa-*`, `mi-*`, `ms-*`, `f7-*`) from `dist/` for projects that don't run `build-fonts`. Previously those classes were silently dropped from generated rules — `apply: 'fas fa-times-circle wh-12 ...'` produced everything except the FontAwesome family and the icon glyph. See [Apply Directive → Use icon font classes](apply-directive.md).
- **Fix:** `borderRadius: [...]` arrays no longer get truncated when combined with other utilities in an `apply:` string. The post-merge dedup step (from v7.9.0) tracked depth on `{}` only, so `borderRadius: [0, 0, 0, 16]` (emitted by directional `rounded-{t,b,l,r,tl,tr,bl,br}-*` utilities) was split on its internal commas. The depth tracker now respects `[]` alongside `{}`.
- **Fix:** `brand --padding <n>` shortcut now applies to BOTH Android paddings as the help text always promised. Previously the shortcut only fed `androidAdaptivePadding` while `androidLegacyPadding` fell through to its own config value, so `purgetss brand --padding 17` actually produced `androidAdaptive=17, androidLegacy=10`.

## What's New in v7.9.0

- Opacity modifier on semantic colors — `bg-surface/65` syntax now works for any class mapped through `theme.extend.colors`. PurgeTSS auto-derives `<originalKey>_<alphaPercent>` entries in `semantic.colors.json` per mode (light/dark). See [Semantic Colors → Opacity modifier auto-derivation](semantic-colors.md#opacity-modifier-auto-derivation). **Native rebuild required** — Liveview hot-reload alone does not refresh `semantic.colors.json`
- `theme.Window` / `theme.View` / `theme.ImageView` presets now use **replace mode** — they no longer carry framework defaults (white background, `Ti.UI.SIZE`, iOS `hires: true`). This fixes gradient ghosting where a preset Window with `bg-gradient-*` apply was being covered by the implicit `backgroundColor: '#FFFFFF'`. Use `theme.extend.Window` / `theme.extend.View` / `theme.extend.ImageView` when you want **extend mode** (merge with defaults). See [Apply Directive → Extend mode vs replace mode](apply-directive.md#extend-mode-vs-replace-mode)
- Glossary path renamed: `purgetss/experimental/tailwind-classes/` → `purgetss/glossary/tailwind-classes/`

## What's New in v7.8.0

- `purgetss images --width <n>` — pin SVG output to a specific base width; PurgeTSS derives per-density assets from the multiplier scale (×1 / ×1.5 / ×2 / ×3 / ×4). Range `[1, 8192]`. CLI-only (no `images:` config equivalent — width is per-asset). See [Multi-Density Images → Pinning the output width with --width](multi-density-images.md#pinning-the-output-width-with---width)
- Class syntax pre-validation — the build now emits a `Class Syntax Error` block (file path + line + `Fix:` suggestion) for 5 detected patterns: inverted negative sign (`top-(-10)` → `-top-(10)`), Tailwind brackets (`top-[10px]` → `top-(10px)`), empty parens (`wh-()`), whitespace inside parens (`wh-( 200 )` → `wh-(200)`), redundant `px` unit (`top-(10px)` → `top-(10)`). See [Arbitrary Values → Class syntax pre-validation](arbitrary-values.md#class-syntax-pre-validation)
- Parser fix for negative values inside parentheses — `top-(-10)` is now correctly flagged as inverted-negative-sign instead of silently misparsed

## What's New in v7.7.0

- `brand:` config restructured — flat keys replaced by purpose-based groups: `brand.logos`, `brand.padding`, `brand.android`, `brand.ios`, `brand.colors`
- Separate Android brand inputs — `logos.androidLauncher` / `--icon-logo` for Android launcher icons; `logos.androidSplash` / `--splash-logo` for Android 12+ splash artwork. Drop `logo-icon.*` and `logo-splash.*` into `purgetss/brand/`
- `--android-adaptive-padding` (default `19%`) and `--android-legacy-padding` (default `10%`) replace the single `--padding`. The shortcut `--padding` now sets both Android paddings to the same value for one run
- Legacy Android splash fallback regenerated — `app/assets/android/default.png` (Alloy) or `Resources/android/default.png` (Classic). `cleanup-legacy` no longer removes `default.png`
- New official doc: [Values and Units](values-and-units.md) — explains `ti.ui.defaultunit` interpretation of PurgeTSS unitless values

## What's New in v7.6.x

- `brand` command — complete Titanium branding set (launcher icons, adaptive, iOS 18+ Dark/Tinted, marketplace) from logos in `./purgetss/brand/` (v7.6.0)
- `images` command — multi-density UI images (Android res-*dpi + iPhone @1x/@2x/@3x) from `./purgetss/images/` (v7.6.0)
- `semantic` command — Titanium semantic colors for Light/Dark mode (palette mode + single mode) (v7.6.0)
- `brand:` and `images:` config sections auto-injected into older configs (v7.6.0)
- Percentages as strings (`'15%'`) for self-documenting clarity in brand/images configs (v7.6.0)
- Confirmation prompt for destructive writes in `brand` / `images` (`y` / `N` / `a`); auto-skipped on non-TTY, with `-y`, or `PURGETSS_YES=1` (v7.6.1)
- `semantic` command works in Classic projects — writes to `Resources/semantic.colors.json` (v7.6.2)

## What's New in v7.5.3

- Appearance module — Light/Dark/System mode switching with persistence
- Default font family classes (`font-sans`, `font-serif`, `font-mono`) generated automatically with platform-appropriate values
- XML validation — detects illegal `--` inside XML comments during pre-validation

## What's New in v7.5.0

- `extend` support for Window, View, and ImageView in `config.cjs`
- Shorthand `apply` directive normalization
- Apply directive property deduplication
- Automatic platform resolution in apply directives
- Updated Font Awesome to 7.2.0
- Fixed: `extend.Window` was silently ignored
- Fixed: Array-type properties (`extendEdges`, `mediaTypes`) bracket notation

## What's New in v7.4.0

- 9 new Animation methods: `transition`, `pulse`, `sequence`, `swap`, `shake`, `snapTo`, `reorder`, `undraggable`, `detectCollisions` (module now has 15 methods total)
- Snap behavior classes: `snap-back`, `snap-center`, `snap-magnet`
- `keep-z-index` utility class
- Enriched callback event object with `action`, `state`, `id`, `targetId`, `index`, `total`, `getTarget()`
- Delta-based drag for views with rotate/scale transforms
- Position normalization for draggable views
- Property inheritance from Animation object for all new methods
