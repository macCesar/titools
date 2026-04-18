# `--cleanup-legacy` — removing obsolete branding artifacts

Titanium project templates ship with a lot of legacy branding assets that made sense a decade ago and are dead weight today. The `--cleanup-legacy` flag scans the project and removes them, but only after verifying through `tiapp.xml` that they are genuinely unused.

## Why cleanup matters

Legacy branding assets bloat the project in three ways:

1. **Repository size** — every `Default-XXXh@3x.png` (some 800 KB+ each) stays in git history forever unless actively deleted.
2. **Build output size** — some legacy assets DO get copied into the APK/IPA even when modern alternatives make them unreachable at runtime. Extra MB mean slower downloads for end users and marginally longer store review times.
3. **Cognitive load** — new contributors look at `res-long-port-hdpi/`, `Default-Landscape-2688h@3x.png`, `background.9.png`, and reasonably assume they matter. They don't, but nobody is willing to delete what they don't fully understand.

## The three buckets

The cleanup logic categorizes targets by how safe removal is:

### SAFE — universally obsolete

Removed without checking any project configuration. These artifacts are fossils from Android versions predating the current SDK's minimum target.

| Artifact | Why it's dead |
|---|---|
| `app/assets/android/images/res-long-*/` | Android's `long` screen qualifier distinguished devices like the Motorola Droid (854×480) from the Nexus One (800×480) in 2009–2011. Since Android 3.0 the system uses dp-based layouts instead. No modern launcher or OS consults these folders. |
| `app/assets/android/images/res-notlong-*/` | Inverse of `long` — same verdict. |

These buckets are almost always empty in practice (Titanium templates create the folders but rarely populate them), so the cleanup is primarily about removing visual noise from the project tree.

### CONDITIONAL — safe given the project's current configuration

Removed only when `tiapp.xml` confirms the artifact is genuinely unused.

| Artifact | Safety rule | Why |
|---|---|---|
| `app/assets/iphone/Default-*.png`, `Default@2x.png` | `<enable-launch-screen-storyboard>true</enable-launch-screen-storyboard>` | With the storyboard active, iOS adapts dynamically to any device resolution via Auto Layout. Apple mandated this in 2020. Without storyboard, these PNGs matter and must stay. |
| `app/assets/android/images/res-*-land-*/`, `res-land-*/` | `tiapp.xml` declares portrait-only orientations | Landscape variants only load when the app can rotate to landscape. |
| `app/assets/android/default.png` | `mipmap-anydpi-v26/ic_launcher.xml` exists (adaptive icons present) | The legacy Titanium Android splash PNG is shadowed by the modern SplashScreen API, which derives the splash from the launcher icon. Only deleted when the modern path is in place. |
| `app/assets/android/appicon.png` | Same adaptive-icons condition | Legacy Android launcher PNG. When adaptive icons exist in `mipmap-*/`, this file is redundant. |

If a safety rule is not satisfied, the artifact is preserved and the user sees a clear reason in the cleanup plan.

### AGGRESSIVE — opt-in via `--aggressive`

Defensible but off by default because there are edge cases.

| Artifact | Reason it's usually safe |
|---|---|
| `app/assets/android/images/res-ldpi/`, `res-*-ldpi/` | ldpi (≤120 dpi, pre-2010 low-end devices) is below 1% of active Android devices globally. |
| `app/platform/android/res/drawable-ldpi/`, `mipmap-ldpi/`, `values-ldpi/` | Same ldpi justification for platform-native resources. |

Users targeting specific low-density markets (some IoT devices, kiosks) should leave `--aggressive` off.

## Safety model

The flag is opinionated about not trashing anybody's work:

- `--dry-run` prints the full plan (paths, sizes, reasons) without deleting anything. Run it first.
- The plan always shows which `tiapp.xml` flags drove each decision (storyboard on/off, orientation, adaptive-icons presence) so the user can verify the detection is correct.
- The skill does not delete files outside the project's asset and platform resource directories.
- It does not touch `tiapp.xml`, source code, `modules/`, `i18n/`, or any application code.
- Conditional targets still require the safety rule to pass — even with `--cleanup-legacy`, nothing conditional deletes unless `tiapp.xml` justifies it.
- Aggressive-bucket targets require the explicit `--aggressive` flag on top of `--cleanup-legacy`.

## Real-world savings

Measured on SNAP Gym, a mid-sized Titanium 13.1 Alloy project, immediately after a fresh `alloy new` template:

| Bucket | Items removed | Disk freed |
|---|---|---|
| SAFE (`res-long-*` + `res-notlong-*`) | 11 folders | ~0 KB (empty templates) |
| CONDITIONAL (`iphone/Default-*.png` × 15) | 15 files | ~5.4 MB |
| CONDITIONAL (`android/default.png`, `appicon.png`) | 2 files | 52 KB |
| **Total (default flags)** | **28 artifacts** | **~5.5 MB** |

Running `--aggressive` on top would remove an additional ~40 KB of `ldpi` folders — small payoff per project, but compounds when applied across multiple apps.

The 5.4 MB of iOS launch images is the largest single win: those PNGs exist in source but are not shipped in modern IPAs (storyboard-driven iOS builds ignore them). Removing them from source shrinks the repo and clears confusion for new contributors.

## When NOT to run cleanup

- **Classic Titanium apps pre-SDK 10**: rely on the legacy assets. Upgrading the SDK is a prerequisite to safely cleaning up.
- **Apps with `<enable-launch-screen-storyboard>false</enable-launch-screen-storyboard>`**: the iOS PNGs are still consulted — the skill correctly skips them, but the user should enable the storyboard before running cleanup to get the savings.
- **Apps that support landscape orientation**: the `res-*-land-*` folders are preserved, which is correct.

## Usage

```bash
# Preview first — nothing deletes in dry-run mode
bash scripts/ti-branding --cleanup-legacy --dry-run

# Apply
bash scripts/ti-branding --cleanup-legacy

# Include ldpi
bash scripts/ti-branding --cleanup-legacy --aggressive

# Point at a specific project (default: current directory)
bash scripts/ti-branding --cleanup-legacy --project /path/to/project

# Combine with generation — brand the app and clean up in one pass
bash scripts/ti-branding ./logo.svg --bg-color "#0B1326" --cleanup-legacy
```

## Verification checklist

After applying cleanup, rebuild for each platform and visually confirm:

- [ ] iOS app on a modern device (iPhone 11 or newer): splash reaches top and bottom (no letterboxing). The storyboard is doing its job; the deleted PNGs are confirmed unused.
- [ ] Android app on API 31+ (Android 12 or newer): splash shows the launcher icon centered on the brand color, then transitions to the app normally.
- [ ] Android app on API 21–30 if the minimum target is that low: app launches without the old `default.png`. Titanium's adaptive-icon fallback kicks in.
- [ ] `git status` lists only the expected deletions. No source code changes.

If any of those fail, the deletion can be reverted with `git checkout -- .` (before committing) or `git restore` (after).
