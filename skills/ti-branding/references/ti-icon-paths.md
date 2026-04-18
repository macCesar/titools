# Canonical paths — Titanium SDK 13.x

## Alloy layout (primary)

```
project-root/
├── DefaultIcon-ios.png              # iOS master (1024² no alpha)
├── DefaultIcon.png                  # Generic master (1024² no alpha) — fallback
├── iTunesConnect.png                # 1024² App Store submission
├── MarketplaceArtwork.png           # 512² Google Play submission
├── tiapp.xml
└── app/
    ├── assets/
    │   ├── iphone/                  # (optional) manual iOS appiconset — skill doesn't write here
    │   └── android/
    │       ├── appicon.png          # 128² legacy fallback (pre-adaptive)
    │       └── images/              # density-scaled in-app image assets (NOT launcher)
    └── platform/
        └── android/
            └── res/
                ├── mipmap-mdpi/
                │   ├── ic_launcher.png              # legacy 48²
                │   ├── ic_launcher_foreground.png   # adaptive 108²
                │   ├── ic_launcher_background.png   # adaptive 108²
                │   └── ic_launcher_monochrome.png   # themed 108²
                ├── mipmap-hdpi/    # 72 / 162 / 162 / 162
                ├── mipmap-xhdpi/   # 96 / 216 / 216 / 216
                ├── mipmap-xxhdpi/  # 144 / 324 / 324 / 324
                ├── mipmap-xxxhdpi/ # 192 / 432 / 432 / 432
                ├── mipmap-anydpi-v26/
                │   └── ic_launcher.xml              # binds the 3 adaptive layers
                ├── drawable-mdpi/
                │   ├── ic_stat_notify.png           # (optional) 24² white+alpha
                │   └── splash_icon.png              # (optional) 288² Android 12+ splash
                ├── drawable-hdpi/  # 36 / 432
                ├── drawable-xhdpi/ # 48 / 576
                ├── drawable-xxhdpi/ # 72 / 864
                └── drawable-xxxhdpi/ # 96 / 1152
```

## Classic layout

Same structure, different roots. The skill detects `Resources/` and remaps:

| Alloy path | Classic path |
|---|---|
| `app/assets/android/appicon.png` | `Resources/android/appicon.png` |
| `app/platform/android/res/...` | `platform/android/res/...` |

Root-level files (`DefaultIcon*.png`, `iTunesConnect.png`, `MarketplaceArtwork.png`) are identical in both layouts.

## What Titanium does at build time

- **iOS**: reads the root master → writes to `build/iphone/Assets.xcassets/AppIcon.appiconset/` (build directory, regenerated every build, never commited)
- **Android**: copies `app/platform/android/res/*` verbatim to `build/android/app/src/main/res/`, plus copies `app/assets/android/appicon.png` to `build/.../res/drawable-*dpi/appicon.png` if the legacy path is used

Result: anything the skill writes to `app/platform/android/res/` or `app/assets/` survives builds. Nothing the skill generates can be accidentally overwritten by `ti build`.

## What the skill writes

After confirming with the user, the skill copies from its staging directory to:

| Target | Files |
|---|---|
| Project root | `DefaultIcon-ios.png`, `iTunesConnect.png`, `MarketplaceArtwork.png` |
| `app/platform/android/res/mipmap-*/` | Launcher icons (adaptive triplet + legacy flat), 5 densities |
| `app/platform/android/res/mipmap-anydpi-v26/` | `ic_launcher.xml` |
| `app/platform/android/res/drawable-*/` (optional) | `ic_stat_notify.png`, `splash_icon.png` |

The skill never touches `tiapp.xml`, `config.json`, source code, or anything outside the asset/resource paths above.

## Required `tiapp.xml` entry

For the adaptive icon to be picked up, `tiapp.xml` must reference it:

```xml
<android>
  <manifest>
    <application android:icon="@mipmap/ic_launcher"/>
  </manifest>
</android>
```

The skill checks for this and, if missing, prints the snippet — does not edit the file. See `tiapp-xml-snippets.md` for the full set.
