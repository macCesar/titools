# SVG-Aware Compile-Time Image Pipeline

Added in PurgeTSS v7.11.0 (refined in v7.11.1), the SVG pipeline runs as a **post-step of `purgetss`** — after the regular purge finishes and `app.tss` is finalized. It scans your views and controllers for SVG references, resolves each SVG's display size from the utility classes on the same node, and generates the matching multi-density PNGs. You do **not** call `purgetss images` separately or declare dimensions anywhere else. The cascade of `w-*` / `h-*` classes in your XML decides the size.

For the standalone `purgetss images` command (all files under `purgetss/images/`, CLI flags, format conversion), see [Multi-density images](./multi-density-images.md).

> **INFO — At a glance**
>
> Drop an SVG into `purgetss/images/`, reference it from a view as `image="/images/<sub>/<name>.svg"` with a numeric `w-*` or `h-*` class, and run `purgetss`. The pipeline emits 8 density variants (5 Android + 3 iPhone PNGs). Titanium loads the generated `.png` at runtime even though your XML still says `.svg`. The SVG attribute in your source is never rewritten.

## Why this exists

Titanium doesn't load `.svg` files natively in `Ti.UI.ImageView`. Without help you have two options, both manual:

1. Hand-rasterize every SVG into `app/assets/{iphone,android}/images/.../*.png` for every density. Tedious, easy to get wrong, and easy to forget when you swap a logo.
2. Run `purgetss images` manually after every SVG edit. Better, but still manual, and you have to know the dimensions in advance.

The SVG pipeline removes both chores: you reference the `.svg` from a view, size it with the same utility classes you use everywhere else, and `purgetss` generates the PNGs on the next run.

## The runtime trick

When a view requests `image="/foo.svg"` and Titanium cannot use that file as SVG, the image loader falls back to a `.png` with the same basename in the platform assets folder. If PurgeTSS writes `foo.png` plus `@2x`, `@3x`, and the Android densities, the view loads correctly even though the XML still references `.svg`. The pipeline never touches the `.svg` string in your source.

## How it works (the short version)

```text
purgetss
├─ regular purge → writes app.tss with .w-32, .h-auto, .w-(300), etc.
└─ SVG post-step:
   1. Parse app.tss → class → props map
   2. Scan views (.xml) and controllers (.js) for SVG references
   3. For each SVG, resolve width/height by applying its classes against app.tss
   4. Sync images.files in config.cjs (autoSync ON)
   5. Generate PNGs with Sharp, using a hash-based cache to skip unchanged files
```

The pipeline only touches SVGs you actually reference from views or controllers. Files that sit in `purgetss/images/` but are not referenced anywhere are ignored by the pipeline (the standalone `purgetss images` command still processes them).

## What gets detected

**XML views:** any node attribute ending in `.svg` is captured along with its `class=""` attribute:

```xml
<ImageView class="w-32 h-auto" image="/images/logos/logo.svg" />
<ImageView class="w-(300) bg-red-500" image="/images/banners/hero.svg" />
<View backgroundImage="/images/textures/grain.svg" class="wh-screen" />
```

Both `image` and `backgroundImage` (and any other attribute whose value ends in `.svg`) are picked up.

**Controllers:** objects passed to `$.UI.create(...)` (or similar) that mix `image: '...svg'` and `classes: '...'` are captured by an AST walker:

```javascript
$.UI.create('ImageView', {
  image: '/images/logos/logo.svg',
  classes: 'w-(300) bg-red-500'
})
```

### Static-scanner limitation

The scanner sees **literal string values only**, not computed paths. Dynamically composed paths are not detected:

```javascript
// NOT detected — path is concatenated at runtime
image: '/images/' + variant + '.svg'
```

For dynamic references, pin the dimensions manually under `images.files` (see [Manual pinning](#manual-pinning-for-undetected-references)) so the pipeline still generates the PNGs.

## How dimensions get resolved

For each SVG reference, the cascade of classes is applied against `app.tss` in declaration order (later-wins, matching Alloy semantics). The pipeline pulls the final `width` and `height` numbers:

| Class on the view              | What `app.tss` resolves            | What the pipeline pins                                          |
| ------------------------------ | ---------------------------------- | -------------------------------------------------------------- |
| `class="w-32"`                 | `width: 128`                       | `widthDp = 128`                                                |
| `class="w-40 h-12"`            | `width: 160`, `height: 48`         | `widthDp = 160`, `heightDp = 48`                               |
| `class="w-(300)"`              | `width: 300` (arbitrary value)     | `widthDp = 300`                                                |
| `class="h-44"` (no `w-*`)      | `height: 176`                      | `heightDp = 176`; width derived from viewBox at generation time |
| `class="w-32 h-auto"`          | `width: 128`, `height: Ti.UI.SIZE` | `widthDp = 128`; height derived from viewBox                   |
| `class="w-full"` (non-numeric) | `width: Ti.UI.FILL`                | skipped with a warning; no usable dim                          |

Note the spacing convention: PurgeTSS multiplies the Tailwind-style numeric scale, so `w-32` resolves to `width: 128` (128 dp), not 32.

### Auto-derived dimensions stay out of config

If you used `h-auto` (or no `h-*`), the height field does **not** appear in the `images.files` entry. The generator re-derives it from the SVG's `viewBox` on every run. The same applies to width when only `h-*` is pinned. This keeps stale values out of `config.cjs` — the unpinned side stays `null` and is always recomputed from the current viewBox.

## Multiple references to the same SVG

If two views reference the same SVG with different classes, the pipeline takes the **max of each dimension across all references**. The generated PNGs are then sharp enough for the largest use:

```xml
<!-- view A -->
<ImageView class="w-32" image="/images/logos/logo.svg" />
<!-- view B -->
<ImageView class="w-(800)" image="/images/logos/logo.svg" />
```

Resolved: `widthDp = 800`. The generated PNGs cover both views; the smaller one just downsamples at runtime.

## How `config.cjs` is synced (autoSync ON)

After resolving dimensions, the pipeline upserts an entry in `images.files`:

```javascript title="./purgetss/config.cjs"
images: {
  autoSync: true,
  files: [
    { filename: 'images/logos/logo.svg', width: 176 }
  ]
}
```

### The current run wins (v7.11.1 cascade policy)

Policy in plain terms: **the current run's cascade wins.** If you change `w-32` to `w-40`, the entry updates to `width: 160`. If you bump back to `w-32`, it updates back to `128`. On every run, the entry mirrors what the views ask for.

This is **not** a high-water mark. The old (pre-7.11.1) policy used `max(existing, derived)`, which froze sizes when you shrank a class — for example `h-52` → `h-16` kept the 208 dp height cemented in config. The 7.11.1 policy follows the cascade, so shrinks propagate correctly. Manual pinning is still available via `autoSync: false`.

### Symmetric width/height cascade (v7.11.1)

`deriveDimensions` accepts width-only, height-only, or both. The unpinned side stays `null` in `images.files`, and `gen-scales` derives it from the SVG viewBox on every run — no more stale auto-derived heights cemented in config. For a height-only source, `gen-scales` computes the width from the inverse aspect ratio.

### No gratuitous rewrites (v7.11.1)

If a run is byte-identical to the previous one (no inserts, no updates — `inserted === 0 && updated === 0`), `config.cjs` is **not** rewritten. Its `mtime` does not change, so downstream `utilities.tss` rebuilds are not triggered for nothing.

### Manual mode: `autoSync: false`

```javascript title="./purgetss/config.cjs"
images: {
  autoSync: false,
  files: [
    { filename: 'images/logos/logo.svg', width: 1024 }
  ]
}
```

With `autoSync: false`:

- The pipeline still derives dimensions and generates PNGs, using the values you wrote in `images.files` — or the cascade fallback for files not listed.
- `config.cjs` is **never** written. Those entries are yours to maintain.

Use this when you want to pin sizes by hand and not have PurgeTSS overwrite your work.

## Force-PNG output

The SVG pipeline **always emits `.png`**, regardless of `images.format`. This is deliberate:

1. Titanium's `image="/foo.svg"` fallback resolves to `.png` only. `.webp`, `.jpeg`, and `.avif` are not picked up through the `.svg` reference.
2. Having a sibling `.webp` (or any non-`.png`) next to `.png` on disk for the same basename **breaks the fallback entirely**. Titanium then shows nothing.

So even if you set `format: 'webp'` (which is honored by `purgetss images` for raster sources and unlisted SVGs), the post-purge pipeline emits `.png` for every SVG it processes. The `--debug` output line reads `png (forced; ignores format: webp)`.

If you genuinely want a `.webp` of an SVG, reference it as `image="/.../foo.webp"` in your XML, not as `.svg`. The standalone `purgetss images` command will then generate `.webp` for that file. See the [WebP and SVG warning](./multi-density-images.md) in the multi-density reference.

## The PNG cache

PurgeTSS keeps a cache at `purgetss/.cache/svg-images.json`:

```json
{
  "logos/logo.svg": {
    "svgHash": "<sha1>",
    "widthDp": 176,
    "heightDp": null,
    "targets": [
      "app/assets/android/images/res-mdpi/logos/logo.png",
      "app/assets/iphone/images/logos/logo@2x.png",
      "..."
    ]
  }
}
```

A cached entry is reused, and Sharp is **not** invoked, when all of these hold:

- The SVG's bytes haven't changed (SHA-1 match).
- `widthDp` resolved is the same as cached.
- `heightDp` resolved is the same as cached.
- Every target PNG path matches and exists on disk.

Otherwise, PurgeTSS regenerates the image. If you `git clean`, delete a PNG by hand, or change a class in XML/JS, the next run regenerates only the affected SVGs. Unaffected entries stay cached.

> **Add `purgetss/.cache/` to `.gitignore`.** It is a per-machine artifact.

## Manual pinning for undetected references

When the static scanner cannot see a reference (dynamic/concatenated paths) or a view has no resolvable `w-*` / `h-*` class, pin the entry by hand so the pipeline still generates the PNGs:

```javascript title="./purgetss/config.cjs"
images: {
  files: [
    { filename: 'images/<sub>/<name>.svg', width: 256 }
  ]
}
```

## Standalone command vs post-purge pipeline

| Aspect                  | `purgetss` (post-purge SVG pipeline) | `purgetss images` (standalone)                    |
| ----------------------- | ------------------------------------ | ------------------------------------------------- |
| What it processes       | Only SVGs referenced from XML/JS     | All files under `purgetss/images/`                |
| Source of dimensions    | Class cascade in `app.tss`           | CLI `--width` > `images.files` > viewBox / source |
| Touches `images.files`? | Yes (autoSync ON)                    | No; only reads it as overrides                    |
| Output format for SVGs  | Always PNG                           | PNG for SVGs in `files`; `format` otherwise       |
| When to run             | Automatic on every `purgetss`        | Manual, after raster source edits                 |

Both share the same `images.files` array and the same generation engine (`gen-scales`). They do not fight each other: the pipeline edits `images.files`; the standalone command reads it as overrides. Run either, or both.

## Troubleshooting

### "no class resolved width or height to a number; skipping"

The SVG is referenced from a view with no resolvable `w-*` or `h-*` class (just `w-full`, `w-screen`, `bg-*`, etc.). Add a numeric `w-*` or `h-*` utility, or pin the size manually in `images.files`:

```javascript
files: [
  { filename: 'images/<sub>/<name>.svg', width: 256 }
]
```

### My change to a class didn't update the PNG

Check that the class actually exists in `app.tss` after purging. The Tailwind-style spacing scale skips numbers like `h-50`; only `h-48`, `h-52`, `h-56` are emitted by default. Add custom values under `theme.extend.spacing` if you need them, or use arbitrary values: `h-(50)`, `h-(200px)`, `h-(12.5rem)`.

If the class is correct but the image didn't refresh on device, it might be the Titanium simulator's image cache. Do a clean build.

### The pipeline didn't detect my SVG reference

The static scanner sees literal string values, not computed paths. Concatenated strings (`'/images/' + variant + '.svg'`) are not detected. Pin the entry in `images.files` manually so the pipeline still generates the PNGs.

### `<ImageView image="/.../foo.svg" />` shows nothing

Two common causes:

1. There is no `.png` next to the `.svg`. Titanium falls back from `.svg` references to `.png` siblings; if the pipeline hasn't generated them yet, the fallback can't fire. Run `purgetss` (or `purgetss images`) and verify the `.png` exists under `app/assets/iphone/images/` and `app/assets/android/images/res-*/`.
2. Both `.png` and `.webp` (or another non-png) sit next to each other for the same basename. That breaks the fallback entirely. Delete the non-`.png` siblings, or let the force-PNG pipeline own the SVG.

### I want to opt out for a specific run

Switch `autoSync: false` and manage the `images.files` entries yourself, or delete the SVG cache entry. The pipeline still derives dimensions and generates the PNGs so views keep working, but it does not write to `config.cjs`.

## See also

- [Multi-density images](./multi-density-images.md) — the standalone `purgetss images` command, `--width`, format conversion, and `images.files` overrides.
- [PurgeTSS Configuration Deep Dive](./customization-deep-dive.md) — the `images:` config block and the config syntax validator.
