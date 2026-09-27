# Brand Padding & Geometry

How `purgetss brand` sizes the logo inside each piece: per-piece padding, how the source is read and how sharp the output is, the shared splash rule, rounded non-icon artwork, and the Android adaptive mask math.

For the `brand` command itself, its pieces and config, see [App Icons & Branding](./app-branding.md).

## Padding guidance

Padding belongs to the piece, not to the project. Each piece has its own key and its own flag:

| Piece | Config | Flag | Default |
| --- | --- | --- | --- |
| `adaptive` | `brand.adaptive.padding` | `--android-adaptive-padding` | `18%` |
| `legacy-icon` | `brand.legacyIcon.padding` | `--android-legacy-padding` | `10%` |
| `appicon` | `brand.appicon.padding` | `--appicon-padding` | `10%` |
| `icon` | `brand.icon.padding` | `--ios-padding` | `0%` |
| `feature-graphic` | `brand.featureGraphic.padding` | `--feature-graphic-padding` | `12%` |
| `launch-logo` | `brand.launchLogo.padding` | `--launch-logo-padding` | `12%` |
| `android-splash` | `brand.androidSplash.padding` | `--android-splash-padding` | `26%` |
| `ios-splash` | `brand.iosSplash.padding` | `--ios-splash-padding` | `26%` |

`--padding` is a shortcut for the two Android launcher paddings in a single run, and `--splash-padding` for the two splash paddings. `--ios-padding` moves the four square iOS/marketplace pieces together (`icon`, `dark`, `tinted`, `marketplace`); in config each of them has its own key.

There is deliberately **no global padding value that cascades down**. The defaults answer to different constraints: `18%` answers to the Android launcher mask, while finished square iOS/store artwork stays full-bleed at `0%`. One inherited number could silently break the launcher mask or add an unwanted frame to finished artwork. `background`, which has no such trap, is inherited from `brand.background`.

### How the source is read, and how sharp the output is

Two things are worth knowing about what happens to your `logo.svg` or `logo.png` before any padding is applied.

**The container is what counts, not the artwork's bounding box.** An SVG is read at its `viewBox`, a raster at its full canvas, and neither is trimmed to where the pixels actually are. So whatever margin a designer baked into the file **adds** to the padding configured per piece. A round logo exported inside a 2048×2048 PNG with 25% of its own air, generated at `adaptive: { padding: '18%' }`, ends up covering about 32% of the icon canvas, not 64%. If a mark comes out smaller than the numbers suggest, that is almost always why: crop the source or lower the padding.

**The masters are sized to the run.** The source is rasterized once into two intermediate masters, and every piece scales down from them, so their resolution is the ceiling on output sharpness. Rather than a fixed size, `brand` measures the largest number of pixels any selected piece will ask for and builds the masters at exactly that. A default run reports it:

```text
  • Masters at 1024 px — the largest any selected piece asks for
```

Lower a padding and the figure rises with it (`--splash-padding 4` needs 1413 px), so output never goes soft against a fixed ceiling. Every destination is a reduction or the same size, never an upscale.

The one case this cannot fix is a raster source that is simply too small: a 512-px PNG cannot produce a sharp 1024-px icon. Prefer SVG, or a PNG of at least 1024×1024.

### Splash padding

The 28 splash images (`default.png`, the 11 `res-*`, and the 16 iPhone launch images) share one rule: the logo is fitted into a square whose side is a share of the canvas's **shorter** side.

Measuring against the shorter side is what lets a single number work across canvases as different as 1440×2560 and 800×480: at 800×480 the limit comes from the height, at 240×400 from the width, and the logo keeps the same visual weight in portrait and in landscape.

| `androidSplash.padding` / `iosSplash.padding` | Logo | `default.png` (1440×2560) | `res-notlong-port-mdpi` (320×480) |
| --- | --- | --- | --- |
| `20%` | 60% of the shorter side | 864 px | 192 px |
| `26%` (default) | 48% | 691 px | 153 px |
| `30%` | 40% | 576 px | 128 px |
| `35%` | 30% | 432 px | 96 px |

The `26%` default is calibrated against the Titanium template itself: the Alloy logo in the stock `default.png` measures 665×488 px on a 1440×2560 canvas, so `26%` lands within 4% of the size Titanium ships.

Before v7.13.0 none of this was configurable: `default.png` used a hardcoded box of 72% × 26% of its own canvas, and the `res-*` set a separate hardcoded 60%. Two rules for the same piece, neither adjustable.

## Rounded non-icon artwork

`brand.artworkCornerRadius` rounds artwork only in the 16 iPhone launch images, Android `default.png` plus its 11 qualifier variants, `MarketplaceArtworkFeature.png`, and `LaunchLogo.png`. A piece may override it with `cornerRadius`; `brand.splashCornerRadius` is an optional shared override for the two legacy splash pieces.

```javascript
brand: {
  artworkCornerRadius: '22%',
  iosSplash: { padding: '26%', cornerRadius: '18%' },
  featureGraphic: { padding: '12%', cornerRadius: '20%' }
}
```

Values are integer numbers or percentage strings from `0` through `50`, measured against the shorter side of the resized artwork. `0%` preserves the previous output byte for byte; `50%` makes square artwork circular and a wordmark capsule-shaped. Normal and `--dry-run` summaries report the effective padding and radius.

Precedence is:

- Feature Graphic / LaunchLogo: piece-specific flag → `--artwork-corner-radius` → piece config → `brand.artworkCornerRadius` → `0%`.
- Legacy splashes: platform flag → `--splash-corner-radius` → `--artwork-corner-radius` → piece config → `brand.splashCornerRadius` → `brand.artworkCornerRadius` → `0%`.

Store and launcher icons remain unmasked for platform processing. Despite their filenames, `iTunesConnect.png` and `MarketplaceArtwork.png` are app icons: Apple asks for square, unmasked artwork and Google Play applies its own rounded mask, so pre-rounding them would be wrong. `cornerRadius` is rejected in `DefaultIcon*`, `iTunesConnect.png`, `MarketplaceArtwork.png`, adaptive, legacy, and app icons, Android 12+ `splash_icon.png`, notification icons, and any other unsupported piece; invalid, fractional, negative, non-numeric, or greater-than-50 values also abort before files are written.

### Adaptive icon padding

Android's adaptive canvas is 108 dp. The mask leaves roughly 72 dp visible, and the **guaranteed** safe area is a 66 dp circle inscribed in it. What each padding means in those terms:

| Padding | Logo | vs. the 66 dp safe circle | vs. the ~72 dp the mask shows |
| --- | --- | --- | --- |
| `15%` | 75.6 dp | outside | **outside** — clipped on any launcher |
| `16%` | 73.4 dp | outside | **outside** |
| `18%` | 69.1 dp | corners outside | inside — **the default** |
| `19.44%` | 66.0 dp | exactly on it | inside |
| `20%` | 64.8 dp | inside | inside — most conservative |

`18%` sits between the guaranteed circle and the mask edge: a logo that carries its own margin never reaches those corners, which is why it is a safe default in practice. Raise it to `20%` if your mark runs edge to edge and you see clipping on a circular launcher.

A useful visual check is the "corners" heuristic: imagine a circle inscribed in your 1024×1024 canvas with the given padding. If your logo's outermost corners fit inside that circle, you're safe on circular launchers (Pixel default, Oppo Android 15). If they poke out, they'll be clipped.

The official Android spec floor is `19.44%` (108dp canvas, 66dp inscribed safe-zone circle). That is the theoretical worst-case for aggressive adaptive masks, which is why the adaptive default sits close to it.

### Legacy icon padding

Legacy `ic_launcher.png` does not go through the same adaptive mask, so it can usually run tighter. That is why the default for `brand.legacyIcon.padding` is `10%`.

## See also

- [App Icons & Branding](./app-branding.md) — the `brand` command, its pieces and config.
- [`brand` command reference](./cli-commands.md#brand-command) — terse flag list, including every padding and corner-radius flag.
