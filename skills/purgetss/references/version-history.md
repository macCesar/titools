# PurgeTSS — Version History (agent summary)

Terse, agent-facing summary of changes that affect how the skill suggests utilities, configures `config.cjs`, or invokes commands. **Not** a full changelog.

**Canonical source:** <https://purgetss.com/changelog> (full release notes, internal fixes, parser changes, dependency bumps).

When in doubt about whether a class, flag, or config key exists in the user's installed version, consult the canonical changelog or grep `./purgetss/styles/utilities.tss` in the project.

---

## v7.16.2
- `build-fonts --module` now exports every processed TTF/OTF PostScript name through `families`, including text-only collections; icon CSS additionally populates `icons`. Filename-derived keys such as `poppinsSemiBold` are supported. See [custom-fonts.md](custom-fonts.md).
- In clean Classic projects, saved `shades` palettes and `color-module` no longer scaffold empty brand, font, or image source folders. `shades` still refreshes an existing generated color module. See [classic-projects.md](classic-projects.md).

## v7.16.1
- Alloy auto-purge hooks now expose PurgeTSS output before Alloy's generic failure, print a command-line diagnostic hint, and migrate older active or disabled hooks without losing their state. See [installation-setup.md](installation-setup.md).

## v7.16.0
- `brand.artworkCornerRadius` and optional `brand.splashCornerRadius` add shared rounding for non-icon artwork; the iOS/Android splash, Feature Graphic, and LaunchLogo pieces also accept `cornerRadius`. Values are 0–50, and unsupported pieces reject the key before writing. Platform-masked and store icon outputs remain unrounded. See [app-branding.md](app-branding.md).
- Six CLI radius flags provide shared, splash-only, and per-piece one-run overrides. `--appicon-padding` completes the existing `brand.appicon.padding` contract, whose canonical default is `10%`.
- Branding summaries and `--dry-run` now report effective padding and corner radius for rounded pieces.

## v7.15.0
- Standalone `images`, `semantic`, `shades`, `color-module`, `module`, `icon-library`, and `build-fonts` now support Classic without installing the Alloy hook or utility-class lifecycle. Outputs route to native `Resources/` paths where appropriate. See [classic-projects.md](classic-projects.md).
- `images` follows `<deployment-targets>` from `tiapp.xml` by default; explicit `--android` / `--ios` override that selection.
- Classic `semantic` writes only `Resources/semantic.colors.json`; external Classic `images` runs no longer create unrelated empty `purgetss/` or config artifacts.
- Official icon-font CommonJS modules expose stable `families.default` plus variant aliases. Existing icon lookup APIs remain intact. See [icon-fonts.md](icon-fonts.md).

## v7.14.0
- `brand` became self-contained in standalone Classic projects: it creates the canonical config when missing and adopts a positional logo into `purgetss/brand/logo.{png,svg}` after confirmation when no canonical source exists.
- Normal `brand` runs follow `tiapp.xml` deployment targets; explicit `--only` remains an intentional override.
- Classic Android now receives the 11 `Resources/android/images/res-*` splash variants Titanium consumes, even when `ti create` did not seed the directories.
- Square iOS/store artwork defaults to full-bleed `0%` padding. Android adaptive (`18%`), legacy (`10%`), and splash (`26%`) defaults remain platform-specific.
- Fixes align `DefaultIcon.png` and `DefaultIcon-ios.png` with `brand.icon.padding` and make the documented legacy padding the actual per-side inset.

## v7.13.2
- `brand --help` padding defaults now come from the same piece table as the pipeline. The help output correctly reports adaptive `18%` and splash `26%`; do not preserve the older “stale help strings” warning.

## v7.13.1
- Four vulnerable transitive dependencies patched (`postcss`, `nanoid`, `brace-expansion`, `uuid`). Lockfile only; no API or class changes.

## v7.13.0
- **Breaking — one name per thing in `brand`.** `--splash` → `--splash-icon`, `--notification` → `--notification-icon`, `--splash-logo` → `--splash-icon-logo`, `--feature-logo` → `--feature-graphic-logo`. `--icon-logo` now feeds the `icon` piece (`DefaultIcon.png`); the Android launcher source is `--adaptive-logo`. `--legacy-splash` is gone — the 11 per-qualifier Android splashes are part of `android-splash` and always generated. Logo basenames follow `logo-<piece>` with no exceptions, so `logo-splash` → `logo-splash-icon` and `logo-feature` → `logo-feature-graphic`. **No aliases kept.** See [app-branding.md](app-branding.md).
- **`brand:` config reorganized by piece, not by kind of setting.** 14 piece blocks, each accepting `logo` / `padding` / `background` / `enabled`. `background` cascades from `brand.background`; `padding` deliberately does not. Unknown keys abort the run at both levels instead of being ignored.
- **Config migration moved from memory to disk.** Older `brand:` shapes are rewritten in `config.cjs` once, carrying over customized values and reporting each one moved. Runs on `brand` and on any command that goes through `ensureConfig()`. Replaces `normalizeLegacyBrand()`, which re-translated on every config read.
- **`brand` now covers every image the Titanium template ships** — the 16 `assets/iphone/Default*.png`, the 11 `res-*/default.png`, and `assets/android/appicon.png` were previously left with the grey Alloy logo.
- **`--only <pieces>` filter.** Pieces or groups (`ios`, `store`, `android`), honored by `--dry-run`. Naming a piece generates it even when its opt-in flag is absent; an unknown name aborts before writing.
- **`LaunchLogo.png` (1024×1024) as the iOS launch screen source.** Activated by the presence of `purgetss/brand/logo-launch.{svg,png}`, or `--only launch-logo`. Tune with `--launch-logo` / `--launch-logo-padding`.
- **`brand.optimize` / `--optimize`** — quantize the generated PNGs to a palette. Off by default (lossy); ~71% smaller on the reference set. `--no-optimize` overrides the config per run.
- **Padding defaults changed:** adaptive `19%` → `18%`; the 28 splash images now share one configurable rule (`brand.androidSplash.padding` / `brand.iosSplash.padding`, default `26%`, measured against the canvas's shorter side).
- Intermediate masters are sized to the largest request of the run instead of a fixed 1024 px, so no destination is ever upscaled.
- `--nine-patch` declared but **not implemented** — selecting it prints a warning and writes nothing.
- Fix: `shades` and `semantic` no longer strip every comment from `config.cjs`; they rewrite only the `theme:` section.

## v7.12.1
- `brand --notes` now targets Titanium's **launcher Activity** instead of only the app theme: prints a complete `splashscreen.xml` plus a launcher-only `Theme.SplashScreen` derived from `Theme.Titanium`. See [launch-background.md](launch-background.md).
- Font Awesome Free updated to **7.3.1** — 23 new icon classes (`.fa-lotus`, `.fa-codeberg`, `.fa-copilot`, `.fa-substack`, `.fa-tesla`, `.fa-storybook`, `.fa-matrix`, `.fa-nextcloud`, `.fa-visual-studio`, …), none removed.

## v7.12.0
- `brand --notes` gained Android launch-background snippets (`android:windowSplashScreenBackground` + `android:windowBackground`), so a run that sets a brand background no longer flashes the default theme color at launch.
- `--notes` wording no longer names only `tiapp.xml` — the command edits neither `tiapp.xml` nor the Android theme resources.

## v7.11.2
- Fix: `images.files` sync silently gave up on **any config containing comments** — including the one `purgetss init` generates. Every run printed `Could not insert <file> into images.files` while `files` stayed `[]`.
- Fix: `parseTssMap()` dropped every property following an escaped quote, and classes carrying a nested object (`'.text-xs': { font: { fontSize: 12 } }`) never entered the TSS map — both starved the SVG pipeline of dimensions.
- Fix: **Android `theme` values keep their quotes in custom rules.** `'.welcome-window': { android: { theme: 'Theme.AppDerived.NoTitleBar' } }` used to emit an unquoted value that Alloy cannot compile, because any value containing the substring `Titanium` was treated as a JavaScript expression. Detection is now anchored to the start of the value.

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
