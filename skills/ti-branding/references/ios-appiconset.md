# iOS appiconset (Xcode 14+)

## One master, all sizes

Since Xcode 14 (2022), Apple no longer requires the full matrix of 20+ icon sizes. A single 1024×1024 source is sufficient — Xcode generates the rest at build time.

Titanium SDK 13.x embraces this:

- Place `DefaultIcon-ios.png` (1024×1024, no alpha) at the project root
- On `ti build`, Titanium writes the generated appiconset to `build/iphone/Assets.xcassets/AppIcon.appiconset/`
- `build/` is regenerated on every build — you never commit the full set to the source tree

If you manually place `app/assets/iphone/appicon-*.png` files, Titanium respects them and only fills in the missing sizes. This skill ignores that path — it only writes the single `DefaultIcon-ios.png` master.

## Why no alpha channel

Apple's review pipeline rejects icons with transparency:

> Apps with app icons that include transparency will be rejected during app review.

The skill flattens alpha by compositing the master over the `--bg-color` before writing `DefaultIcon-ios.png`. Same for `iTunesConnect.png` (App Store submission).

## Relevant file paths

At the project root:

| File | Size | Purpose |
|------|------|---------|
| `DefaultIcon-ios.png` | 1024×1024 | Master for appiconset generation |
| `DefaultIcon.png` | 1024×1024 | Fallback if `DefaultIcon-ios.png` missing (Android uses this too) |
| `iTunesConnect.png` | 1024×1024 | Uploaded to App Store Connect |

The skill generates the first and third; the second can be a copy of the first if the user wants a shared master.

## Dark and tinted variants (iOS 18+)

iOS 18 added dark-mode and tinted versions of app icons, configured via:

- `DefaultIcon-Dark.png` — dark theme variant
- `DefaultIcon-Tinted.png` — tinted grayscale variant for iOS's theme engine

These are **out of scope** for this skill's v1. Users who want them can drop the files into the project root manually; Titanium SDK 13.1+ picks them up automatically.

## Launch images — deliberately not generated

The 30+ `Default-*@3x.png` launch image variants from Titanium documentation are legacy. Modern Titanium uses `LaunchScreen.storyboard`, configured in `tiapp.xml`:

```xml
<ios>
  <enable-launch-screen-storyboard>true</enable-launch-screen-storyboard>
  <default-background-color>#0B1326</default-background-color>
</ios>
```

The storyboard adapts to any device resolution dynamically. Legacy PNG launch images were needed before iOS 14 — they are now dead weight in any app submitted to the App Store (Apple mandates storyboard-based launch as of 2020).

If a user genuinely needs legacy launch images (maintaining a pre-2020 app), that's a separate tool job — this skill explicitly does not generate them.

## References

- Apple HIG: [App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- Apple: [Configuring your project to use asset catalogs](https://developer.apple.com/documentation/xcode/configuring-your-project-to-use-asset-catalogs)
