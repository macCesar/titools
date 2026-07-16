# PurgeTSS — Version History (agent summary)

Terse, agent-facing summary of changes that affect how the skill suggests utilities, configures `config.cjs`, or invokes commands. **Not** a full changelog.

**Canonical source:** <https://purgetss.com/changelog> (full release notes, internal fixes, parser changes, dependency bumps).

When in doubt about whether a class, flag, or config key exists in the user's installed version, consult the canonical changelog or grep `./purgetss/styles/utilities.tss` in the project.

---

## v7.11.1
- Symmetric width/height cascade in the SVG image pipeline: a class can pin width-only, height-only, or both; the unpinned side stays `null` in `images.files` and is re-derived from the SVG viewBox on every run (no stale auto-derived dimensions frozen in config).
- `syncConfigImages` mirrors the **current** run instead of taking `max()` across past runs — shrinking a class (e.g. `h-52` → `h-16`) now propagates to `config.cjs`. Pin manually with `images.autoSync: false`.
- Fix: `purgetss images` respects `--yes` for overwrite confirmations (prompt no longer reappears).
- Fix: SVGs listed in `images.files` always emit `.png` regardless of `images.format` (Titanium's `.svg → .png`-only runtime fallback). Raster files and SVGs not in `images.files` still honor `format`.

## v7.11.0
- SVG-aware compile-time image pipeline runs as a `purgetss` post-step. When XML/controllers reference `image="/images/x.svg"` (or `backgroundImage`) alongside utility classes that resolve to numeric width/height (`w-32`, `w-(300)`, `h-auto`), purge compiles the SVG into the 8 Titanium density PNGs (5 Android + 3 iPhone) using dimensions resolved from `app.tss`. Titanium loads the generated `.png` at runtime; the `.svg` attribute in your source is never rewritten. Cache: `purgetss/.cache/svg-images.json` (add to `.gitignore`). See [multi-density-images.md](multi-density-images.md).
- `images.files` array in `config.cjs` — per-file width/height override: `[{ filename: 'images/logos/logo.png', width: 128, height: 52 }]`. CLI `--width` still wins over entries. SVGs detected by the pipeline populate entries automatically (subject to `images.autoSync`); hand-added raster entries survive untouched.
- `images.autoSync` boolean (default `true`) — opt-out for devs managing `images.files` by hand. When `false`, purge still computes dimensions and generates PNGs but never writes back to `config.cjs`.
- `config.cjs` syntax validator emits a formatted `Config Syntax Error` block (file, JSON path, context, issue, fix snippet) for type mismatches in known fields, currently `theme.fontFamily.*` — must be a **string** — replacing cryptic crashes like `rule.startsWith is not a function`.

## v7.10.2
- Pre-v7.7.0 `brand:` configs (flat layout: `brand.padding: <number>`, `brand.iosPadding`, `brand.bgColor`, top-level `brand.notification`/`brand.splash`) auto-migrate to the grouped layout in memory. A one-time per-session notice lists the migrated keys.

## v7.10.1
- "Tailwind" framing dropped from non-functional copy (Class Syntax Error message, `purgetss create` injected Label). Functional integrations (`tailwindcss@3` dep, `shades --tailwind`, VSCode IntelliSense extension) still ship.

## v7.10.0
- `purgetss images` gains `--opacity <0-100>`, `--padding <0-40>`, `--output <relpath>`. CLI-only (no `config.cjs` equivalent). See [multi-density-images.md](multi-density-images.md).
- `purgetss brand` generates `MarketplaceArtworkFeature.png` (1024×500 Google Play Feature Graphic). Override via `--feature-logo <path>` or `--feature-graphic-padding <n>` (default 12%). See [app-branding.md](app-branding.md).
- `theme` objects in `config.cjs` walk recursively at any depth — `theme.extend.colors.brand.primary.500` flattens to class `bg-brand-primary-500`. Default modifier keys (`default`, `global`, `DEFAULT`) collapse. Same for `backgroundGradient` / `backgroundSelectedGradient`. See [arbitrary-values.md](arbitrary-values.md).
- Fix: `apply:` now resolves built-in icon font classes (`fas`, `fab`, `fa-*`, `mi-*`, `ms-*`, `f7-*`) from `dist/` even without `build-fonts`.
- Fix: `brand --padding <n>` shortcut applies to BOTH Android paddings.

## v7.9.0
- Opacity modifiers work on semantic colors: `bg-surface/65` auto-derives `surface_65` in `semantic.colors.json` with light/dark + alpha. **Native rebuild required** (Liveview alone does not refresh `semantic.colors.json`). See [semantic-colors.md](semantic-colors.md).
- `theme.Window` / `theme.View` / `theme.ImageView` at top level = **replace mode** (no framework defaults). Use `theme.extend.Window` for **extend mode** (merge with defaults). See [apply-directive.md](apply-directive.md).
- **Breaking:** glossary path renamed `purgetss/experimental/tailwind-classes/` → `purgetss/glossary/tailwind-classes/`. No transition shim.

## v7.8.0
- `purgetss images --width <n>` pins Android `mdpi` / iPhone `@1x` to `<n>` pixels for SVG sources with disproportionate viewBoxes (Affinity, Illustrator). CLI-only.
- Class syntax pre-validation emits `Class Syntax Error` blocks for 5 patterns: inverted negative (`top-(-10)` → `-top-(10)`), brackets (`top-[10px]` → `top-(10px)`), empty parens (`wh-()`), whitespace in parens, redundant `px` unit. Generic unknown classes still flow into `// Unused or unsupported classes`.

## v7.7.0
- `brand:` config restructured into grouped sections: `brand.logos`, `brand.padding`, `brand.android`, `brand.ios`, `brand.colors`. Old projects keep working; new configs use grouped form. See [app-branding.md](app-branding.md).
- Separate Android brand inputs: `logos.androidLauncher` / `--icon-logo` and `logos.androidSplash` / `--splash-logo`.
- Android splash fallback `default.png` regenerated (Alloy: `app/assets/android/`, Classic: `Resources/android/`). `cleanup-legacy` preserves it.
- New ref: [values-and-units.md](values-and-units.md) — `ti.ui.defaultunit` interpretation of unitless PurgeTSS values.

## v7.6.x
- `purgetss brand` (v7.6.0) — full Titanium branding set from `purgetss/brand/` logos. See [app-branding.md](app-branding.md).
- `purgetss images` (v7.6.0) — multi-density UI images (Android `res-*` + iPhone `@1x`/`@2x`/`@3x`). See [multi-density-images.md](multi-density-images.md).
- `purgetss semantic` (v7.6.0) — Titanium semantic colors for Light/Dark, palette mode or `--single` purpose-based. Classic projects supported since v7.6.2. See [semantic-colors.md](semantic-colors.md).
- `brand:` and `images:` config sections auto-injected. Percentages may be quoted strings (`'15%'`) or plain numbers.
- `brand` / `images` ask `[y/N/a]` before overwriting (skip with `-y`, `PURGETSS_YES=1`, or non-TTY) (v7.6.1).

## v7.5.3
- `Appearance` module — Light/Dark/System mode switching with persistence (`init()`, `set()`, `get()`, `toggle()`). See [appearance-module.md](appearance-module.md).
- Default font family classes (`font-sans`, `font-serif`, `font-mono`) auto-generated with platform-appropriate values.

## v7.5.0
- `theme.extend.Window` / `theme.extend.View` / `theme.extend.ImageView` — customize Ti element defaults.
- Shorthand `apply:` directive — `{ apply: '...' }` auto-normalizes; `default:` wrapper optional.
- Apply directive property deduplication — applied values win over static defaults.
- Automatic platform resolution inside `ios:` / `android:` blocks.

## v7.4.0
- Animation module: 9 new methods (`transition`, `pulse`, `sequence`, `swap`, `shake`, `snapTo`, `reorder`, `undraggable`, `detectCollisions`). 15 methods total. See [animation-system.md](animation-system.md).
- New utility classes: `snap-back`, `snap-center`, `snap-magnet`, `keep-z-index`.
- Delta-based drag for transformed views; property inheritance from Animation object.
