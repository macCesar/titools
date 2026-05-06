# Multi-Density Images

The `purgetss images` command (shipped in PurgeTSS v7.6.0) generates every Titanium density variant of your UI images — buttons, illustrations, screen graphics, inline icons, logos — from a single high-resolution source per image. Alloy and Classic layouts are auto-detected.

- **Android**: `res-mdpi`, `res-hdpi`, `res-xhdpi`, `res-xxhdpi`, `res-xxxhdpi` (5 densities)
- **iPhone**: `@1x`, `@2x`, `@3x` (3 scales via filename suffix)

For the terse flag reference, see the [`images` command reference](./cli-commands.md#images-command). For launcher icons and branding, see [App Icons & Branding](./app-branding.md).

> **INFO**
>
> The `images` command at a glance
> One source per image in `purgetss/images/`, run `purgetss images`, and every density lands in the right place under `app/assets/android/images/res-*/` and `app/assets/iphone/images/`. Works on both Alloy and Classic projects.

## Why multi-density?

Android's UI toolkit resolves images by **density**: a Pixel 7 (xxhdpi ≈ 3×) picks files from `res-xxhdpi/`, a low-end Moto (hdpi ≈ 1.5×) picks from `res-hdpi/`. If the right density isn't available, Android upscales the closest one, which looks noticeably blurry on high-DPI screens.

iOS uses the same idea with filename suffixes: `icon.png`, `icon@2x.png`, `icon@3x.png`. iPhone 15 Pro picks `@3x`, older iPads pick `@2x`.

Shipping every variant keeps your UI sharp on every device. `purgetss images` does it in one pass from a single source per image.

## Quick start

Drop source images into `purgetss/images/`, then run the command:

```bash
cp my-hero-illustration.png purgetss/images/
cp my-button.svg purgetss/images/buttons/primary.svg

purgetss images
```

Output in an Alloy project:

```text
app/assets/
├── android/images/
│   ├── res-mdpi/
│   │   ├── my-hero-illustration.png
│   │   └── buttons/primary.svg
│   ├── res-hdpi/…
│   ├── res-xhdpi/…
│   ├── res-xxhdpi/…
│   └── res-xxxhdpi/…
└── iphone/images/
    ├── my-hero-illustration.png        (@1x)
    ├── my-hero-illustration@2x.png
    ├── my-hero-illustration@3x.png
    └── buttons/
        ├── primary.svg                 (@1x)
        ├── primary@2x.svg
        └── primary@3x.svg
```

Classic projects output to `assets/android/images/res-*/` and `assets/iphone/images/` under the project root instead of under `app/assets/` — the command auto-detects the layout.

## The `purgetss/images/` convention

`init` creates `purgetss/images/` (alongside `fonts/` and `brand/`), so the folder is already there the first time you look for it, even before you've dropped any sources.

```text
purgetss/images/
├── logo-screen.svg
├── hero.png
├── buttons/
│   ├── primary.png
│   └── secondary.png
└── icons/
    └── home.svg
```

Supported input formats: `.svg`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`.

**Subdirectories are preserved in the output.** A file at `purgetss/images/buttons/primary.png` ends up at `app/assets/android/images/res-*/buttons/primary.png` and `app/assets/iphone/images/buttons/primary.png`. Organize however makes sense for your project.

> **INFO**
>
> Use SVG whenever you can
> SVG scales losslessly to every density. A single `icon.svg` rasterizes perfectly to every `res-*dpi` folder without pixel loss. PNG/JPG sources must be downscaled and lose a bit of sharpness at smaller densities.

## Source sizes — the 4× master convention

PurgeTSS (and Titanium Alloy generally) treats every source image as a **4× master** (`res-xxxhdpi` / `@xxxhdpi` on Android, equivalent to `@4x` on iPhone if iOS supported it). All smaller densities are **downscaled** from that source.

That means:

| Source size (logical) | Use for |
| --- | --- |
| 1920×1080 or larger | Full-screen illustration / hero image |
| 800×800 | Card, list item, large icon |
| 200×200 | Button, inline icon |
| 96×96 | Small inline icon |

If your source is smaller than 4×, the tool still runs but the larger density outputs are essentially upscaled — quality drops on high-DPI devices.

Recommended sizes for common UI elements (in source pixels, assumed 4×):

- **Full-screen illustration**: at least `1920×1080`
- **Tab bar icon**: at least `192×192` (source for 48px at xxxhdpi)
- **List-row thumbnail**: at least `320×320`
- **Button background**: match the intended display size × 4

## Pinning the output width with `--width`

The 4× master convention works well for raster sources (`.png`, `.jpg`, `.webp`) because the file's pixel dimensions usually reflect the intended 4× size. **SVGs are different.** Their logical size comes from the `viewBox`, and vector editors (Affinity Designer, Illustrator, Figma exports) frequently emit viewBoxes in points or with disproportionate values — a logo can ship with `viewBox="0 0 29559 13542"` and `purgetss images` would happily scale every density from that base, producing files far too large for any UI surface.

`--width <n>` (added in PurgeTSS v7.8.0) is the escape hatch: it pins the **`mdpi` / `@1x`** output width to exactly `n` pixels, then derives every other density from that base. Height stays proportional to the source aspect ratio — you only specify width.

```bash
purgetss images logo.svg --width 256
```

### Multiplier table

The pinned width drives the scale for every density:

| Scale | Multiplier | Width if `--width 256` |
| --- | --- | --- |
| `mdpi` / `@1x` | ×1 | 256 |
| `hdpi` | ×1.5 | 384 |
| `xhdpi` / `@2x` | ×2 | 512 |
| `xxhdpi` / `@3x` | ×3 | 768 |
| `xxxhdpi` | ×4 | 1024 |

### Validation

`--width` accepts integers in `[1, 8192]`. Out-of-range values are rejected immediately and the command exits without writing anything:

```bash
purgetss images logo.svg --width 0
# Invalid --width '0'. Must be an integer between 1 and 8192.

purgetss images logo.svg --width 9000
# Invalid --width '9000'. Must be an integer between 1 and 8192.

purgetss images logo.svg --width abc
# Invalid --width 'NaN'. Must be an integer between 1 and 8192.
```

The upper bound of `8192` exists because `--width 8192` already produces a `xxxhdpi` output of 32 768 px — that's Sharp's render ceiling and well beyond anything a Titanium UI needs.

### The hint message for unflagged SVGs

Whenever you run `purgetss images` against an SVG **without** `--width`, PurgeTSS prints a one-time hint:

```text
⚠  SVG source detected without --width. Output sizes will be derived from
   each SVG's viewBox (treated as a 4× master).
   For SVGs from vector editors with disproportionate viewBoxes, pass
   --width <n> (e.g. --width 256) to pin the @1x/mdpi width.
```

This is a hint, **not an error**. The legacy 4×-from-viewBox behavior still runs in the same invocation. If your SVG has a sensible viewBox (`300×150` for a 300px-wide logo at 1×, etc.), the default is fine. If the viewBox is in points or noticeably larger than expected, re-run with `--width <n>` for predictable scaling.

### Why CLI-only (no `images:` config equivalent)

`--width` deliberately has **no matching property** in the `images:` block of `purgetss/config.cjs`. The reason: width is a **per-asset** decision, not a project-wide setting. A hero illustration, an inline icon, and a logo each need different widths — pinning a single value globally would make most outputs wrong. Project-wide settings like `quality` or `format` belong in `config.cjs`; per-invocation values like `--width` only make sense as CLI flags passed against the specific source you're regenerating.

## The `images:` config section

On the first run, `purgetss images` injects an `images:` block into your existing `purgetss/config.cjs` (between `brand:` and `theme:`) with these defaults:

```javascript
images: {
  quality: 85,             // JPEG/WebP/AVIF quality (0-100)
  format: null,            // null = keep original; 'webp' | 'jpeg' | 'png' to convert every image
  confirmOverwrites: true  // prompt before overwriting files (set false to skip)
}
```

| Key | Default | Purpose |
| --- | --- | --- |
| `quality` | `85` | Quality for lossy formats (JPEG, WebP, AVIF). Range `0–100`. |
| `format` | `null` | `null` keeps each source's original format. Set `'webp'`, `'jpeg'`, or `'png'` to convert every output. |
| `confirmOverwrites` | `true` | When `false`, the `[y/N/a]` prompt is skipped. |

Change whatever you want to override globally; CLI flags still win for one-off runs.

## Output layouts

**Alloy layout** (auto-detected when `app/assets/` exists):

```text
<project>/
└── app/assets/
    ├── android/images/
    │   ├── res-mdpi/
    │   ├── res-hdpi/
    │   ├── res-xhdpi/
    │   ├── res-xxhdpi/
    │   └── res-xxxhdpi/
    └── iphone/images/
        ├── <name>.<ext>           (@1x)
        ├── <name>@2x.<ext>
        └── <name>@3x.<ext>
```

**Classic layout** (auto-detected otherwise):

```text
<project>/
└── assets/
    ├── android/images/res-*/
    └── iphone/images/
```

Subdirectory structure inside `purgetss/images/` is preserved in both layouts.

## Overwrite confirmation

`images` writes directly into the project, so it asks before overwriting anything:

```text
Continue? [y/N/a]
```

- `y` / `yes` — write this time
- `N` / `no` / `Enter` — abort (nothing is written)
- `a` / `always` — write, then add `confirmOverwrites: false` to the `images:` section of `config.cjs` so the prompt stays quiet on future runs

The prompt is skipped automatically when:

- `stdin` is not a TTY (the `alloy.jmk` hook, CI, a pipe)
- you pass `-y` / `--yes` — one-shot bypass
- `PURGETSS_YES=1` is set in the environment — lasts the whole shell session
- `confirmOverwrites: false` is already in the `images:` config

```bash
purgetss images -y                             # skip prompt once
PURGETSS_YES=1 purgetss images                 # skip for the whole session
```

## Re-processing a single file or subfolder

Common workflow: you tweaked one image in Affinity or Figma and only want to regenerate that one, not the whole folder.

Pass its path directly:

```bash
purgetss images buttons/primary.png
```

Short paths auto-resolve against `purgetss/images/`, so you don't need to type `purgetss/images/buttons/primary.png`. The command tries two interpretations in order:

1. `purgetss/images/buttons/primary.png` (matches the convention folder).
2. `./buttons/primary.png` (fallback, relative to the project root).

Subdirectory structure is preserved in the output whenever the source lives inside `purgetss/images/`, whether you pass the full folder, a subfolder, or a single file. Re-processing one file produces the same output path it had in a full run.

### Re-process a whole subfolder

```bash
purgetss images buttons/
```

Walks `purgetss/images/buttons/` recursively and regenerates every image inside. Everything outside stays untouched.

### Pointing to sources outside the convention

If your source images live elsewhere (e.g. next to your design files in `docs/screenshots/`), pass an absolute or cwd-relative path:

```bash
purgetss images ./docs/screenshots/home-hero.png
purgetss images /Users/cesar/Design/banner.svg
```

When the source is outside `purgetss/images/`, subdirectory preservation uses the directory of the source file as the root instead.

## Platform filter

By default, every run generates both Android densities and iPhone scales. Scope to one platform for targeted runs:

```bash
purgetss images --android                # Android only (skip iPhone)
purgetss images --ios                    # iPhone only (skip Android)
```

Useful when:

- You're iterating on an iOS-only screen and don't need to regenerate Android assets every time.
- You want to tune JPEG quality differently for the two platforms (run the command twice with different flags).

The two flags are mutually exclusive. Pass neither to get both.

## Format conversion

The default preserves each source's format: drop in `.png`, get out `.png`; drop in `.jpg`, get out `.jpg`. Add `--format <ext>` to convert every output to a single target format:

```bash
purgetss images --format webp            # convert every output to WebP
purgetss images --format jpeg --quality 90
```

Valid targets: `webp`, `jpeg`, `png`, `avif`, `gif`, `tiff`.

### Why WebP?

WebP produces ~25–35% smaller files than JPEG at similar visual quality, and Titanium supports it natively on both platforms. For a large UI asset library, switching to WebP can shave several MB off your APK/IPA.

```bash
purgetss images --format webp --quality 85
```

Keep the default `format: null` when you need to stay in the same format as the source — for example PNG with alpha that shouldn't be flattened.

## Full pipeline alongside `build`

The typical sequence when iterating on an app:

```bash
# 1. Edit your source images in Affinity/Figma, drop into purgetss/images/
# 2. Regenerate the variants
purgetss images

# 3. Run purgetss build to regenerate utilities.tss if you changed classes
purgetss build

# 4. Build the app
ti build -p android -T emulator
```

If you only tweaked CSS classes (no image changes), you don't need to re-run `purgetss images`. It's safe to skip.

## Cleaning up

`purgetss images` never deletes files. It only creates them. If you remove an image from `purgetss/images/`, the previously-generated copies in `app/assets/android/images/res-*/` and `app/assets/iphone/images/` stay in place. Remove them manually (or via git) when you clean up.

## Full flag reference

**Source selection**

| Argument | Purpose |
| --- | --- |
| `[source]` (positional) | Optional path to override auto-discovery. Resolves first against `purgetss/images/` (short paths like `buttons/btn.png`), then against cwd. |

**Platform filter**

| Flag | Purpose |
| --- | --- |
| `--android` | Only Android density variants. Mutually exclusive with `--ios`. |
| `--ios` | Only iPhone scale variants. Mutually exclusive with `--android`. |

**Output format**

| Flag | Purpose |
| --- | --- |
| `--format <ext>` | Convert all outputs to: `webp`, `jpeg`, `png`, `avif`, `gif`, `tiff`. Default: keep source format. |
| `--quality <n>` | Quality `0–100` for lossy formats. Default `85`. |
| `--width <n>` | (v7.8.0) Pin `mdpi` / `@1x` output width to `n` pixels; `[1, 8192]`. Other densities derive from this base (×1.5 / ×2 / ×3 / ×4). Most useful for SVG sources with non-standard viewBoxes. CLI-only — no `config.cjs` equivalent because width is per-asset. |

**Project & output**

| Flag | Purpose |
| --- | --- |
| `--dry-run` | Preview without writing any files. |
| `--project <path>` | Project root (defaults to cwd). |
| `-y`, `--yes` | Skip the overwrite confirmation prompt for this invocation. |

**Diagnostics**

| Flag | Purpose |
| --- | --- |
| `--debug` | Print extra diagnostics. |

### Examples

```bash
purgetss images                                        # uses purgetss/images/ + config
purgetss images background/pink-texture.png            # re-process one file (short path)
purgetss images background/                            # re-process one subfolder
purgetss images --android                              # only Android densities
purgetss images --format webp --quality 90             # convert all outputs to WebP
purgetss images --dry-run                              # preview
```

## Troubleshooting

### The output is blurry on high-DPI devices

Your source is likely smaller than the 4× master convention. A larger source means sharper output across all densities. Aim for at least 4× the intended display size, or use SVG sources when possible.

### JPG output has a white background instead of transparency

JPEG doesn't support alpha channels. If your source is PNG with transparency and you convert to JPEG (via `--format jpeg`), the alpha gets flattened on white. To preserve transparency, keep the format as PNG or WebP:

```bash
purgetss images --format webp            # supports alpha
purgetss images --format png             # keeps alpha
```

### My subdirectories aren't preserved in the output

Verify your source path is inside `purgetss/images/`. When passing sources from outside the convention (e.g. `./docs/screenshots`), the directory of the source file is used as the root, so a file at `./docs/screenshots/hero.png` outputs to `images/hero.png` (flat), not `images/screenshots/hero.png`.

Move the file into `purgetss/images/screenshots/` if you want subdirectory preservation.

### I want to preview what would happen before writing files

```bash
purgetss images --dry-run
```

Shows every file that would be written, no side effects.

### Can I use this for app icons?

**No.** App icons need a different pipeline: adaptive icons with foreground + background + monochrome layers, mask safe-zones, marketplace flattening, iOS 18+ Dark/Tinted variants. Use [`purgetss brand`](./app-branding.md) for the launcher icon.

`purgetss images` is for the UI assets *inside* your screens: buttons, backgrounds, illustrations, inline icons.

## Community-Discovered Patterns

- **4× master convention predates PurgeTSS.** Treating the source as a 4× master (`xxxhdpi` on Android, `@4x` equivalent on iOS) is the same convention Titanium Alloy has always used internally when resolving density-qualified image paths. `purgetss images` formalizes the workflow but doesn't invent a new rule — any Alloy project already ships with the same assumption.
- **Short-path fallback order matters for monorepos.** When you pass `buttons/primary.png`, the command tries `purgetss/images/buttons/primary.png` first, then `./buttons/primary.png` relative to cwd. In a monorepo where a design folder might shadow the convention, the convention wins. To force the cwd-relative interpretation, pass `./buttons/primary.png` with the explicit `./` prefix or an absolute path.

## See also

- [`images` command reference](./cli-commands.md#images-command) — terse flag list.
- [App Icons & Branding](./app-branding.md) — sibling `brand` command for launcher icons and marketplace artwork.
