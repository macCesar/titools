# Sharing content out

How to hand a link, a text or a file from your app to the rest of the system — the share sheet on iOS, the intent chooser on Android.

The two platforms are not symmetric and have not been for years, which is the single fact that explains every confusing implementation you will find in an older codebase. Android does this with the core SDK and no module. iOS does not: the SDK exposes no wrapper for `UIActivityViewController`, so a native module is still required. Code written before that split settled tends to route both platforms through the module, or through a cross-platform helper that only ever needed to exist for iOS.

This file is about sending content **out**. For receiving files — declaring a custom extension, UTIs, intent filters, `handleurl` — see [File type association](file-type-association.md).

## Contents

1. [The platform split](#1-the-platform-split)
2. [Android: the core SDK is enough](#2-android-the-core-sdk-is-enough)
3. [iOS: which module, and why one is still needed](#3-ios-which-module-and-why-one-is-still-needed)
4. [Text is not a file](#4-text-is-not-a-file)
5. [Do not pass text alongside a file](#5-do-not-pass-text-alongside-a-file)
6. [iPad needs an anchor](#6-ipad-needs-an-anchor)
7. [Knowing whether the user actually shared](#7-knowing-whether-the-user-actually-shared)
8. [Failing without an exception](#8-failing-without-an-exception)
9. [Verify instead of assuming](#9-verify-instead-of-assuming)
10. [Symptom to cause](#10-symptom-to-cause)

## 1. The platform split

| | Text or link | File |
| --- | --- | --- |
| **Android** | `Ti.Android.createIntent` + `createIntentChooser` | Same, with `putExtraUri` |
| **iOS** | Native module — no SDK API | Native module, or `DocumentViewer` if the type is previewable |

The asymmetry is historical, not architectural. Sharing on Titanium used to go through `com.alcoapps.socialshare`, a CommonJS wrapper by Ricardo Alcocer that split by platform and drove the same iOS module underneath. Once Android could open the system sheet directly, the Android branch stopped needing anything and the module became iOS-only — but the wrapper stayed in projects, and with it a layer of indirection that no longer buys anything.

**When you find one of those wrappers,** check what it still does. The usual finding is dead weight: version-comparison helpers, Facebook app-id variables, `image_blob` / `image_url` normalization for an argument shape nobody passes anymore. Adapting the old helper costs more than writing the two branches.

## 2. Android: the core SDK is enough

`Ti.Android.createIntent` and `Ti.Android.createIntentChooser` are core SDK APIs and are not deprecated. No module, no widget.

```javascript
function shareTextAndroid (text, chooserTitle) {
  const activity = Ti.Android.rootActivity || Ti.Android.currentActivity

  // No activity, no chooser to present. Calling startActivity on null throws in
  // the face of whoever tapped Share.
  if (!activity) {
    return false
  }

  const intent = Ti.Android.createIntent({
    action: Ti.Android.ACTION_SEND,
    type: 'text/plain'
  })

  intent.putExtra(Ti.Android.EXTRA_TEXT, text)
  activity.startActivity(Ti.Android.createIntentChooser(intent, chooserTitle))

  return true
}
```

For a file, two things change and both are mandatory:

```javascript
intent.putExtraUri(Ti.Android.EXTRA_STREAM, file.nativePath)
intent.addFlags(Ti.Android.FLAG_GRANT_READ_URI_PERMISSION)
```

`putExtraUri` makes the SDK convert the path into a `content://` URI served by `TiFileProvider`, which ships declared in the merged manifest — nothing to configure. **Without `FLAG_GRANT_READ_URI_PERMISSION` the receiving app cannot read the file.** It is granted a URI it has no permission for, so the share appears to work and the other app shows an error or an empty attachment.

Set `type` to the real MIME type rather than `*/*`. An unknown type falls back to `application/octet-stream`, which offers every app on the device instead of the ones that can do something useful.

## 3. iOS: which module, and why one is still needed

There is no share sheet API in the SDK. This is verifiable rather than folklore — see [Verify instead of assuming](#9-verify-instead-of-assuming). The SDK offers `Ti.UI.iOS.DocumentViewer`, which is a previewer, and `Ti.App.iOS.UserActivity`, which is Handoff. Neither presents `UIActivityViewController`.

**The module is `dk.napp.social`**, and its provenance matters because the obvious repository is the wrong one:

| Repository | Status |
| --- | --- |
| [viezel/TiSocial.Framework](https://github.com/viezel/TiSocial.Framework) | **Archived April 2021.** Last release 2.0.0. This is the one search engines surface. |
| [hansemannn/TiSocial.Framework](https://github.com/hansemannn/TiSocial.Framework) | **The maintained fork.** Its 3.0.0 release states "Moved to this fork as the base repository". |

Releases on the fork: 3.0.0 (macOS support), 3.0.1 (fixes a possible iPad crash), 3.0.2 (restores iOS 12 compatibility). **3.0.2 is the highest published version.** If a project declares something higher in `tiapp.xml`, that build came from somewhere other than a release — treat the local copy as irreplaceable and say so in the project's install instructions, because nobody can download it.

```javascript
function shareTextIos (text, subject) {
  const social = require('dk.napp.social')

  if (!social.isActivityViewSupported()) {
    return false
  }

  social.activityView({ subject: subject || '', text }, [])
  return true
}
```

Require the module inside the iOS branch, not at the top of the file. A module-level `require` runs on Android too, where it resolves to nothing useful.

## 4. Text is not a file

`DocumentViewer` takes the URL of a file; there is no way to hand it a string. So a file has two possible routes on iOS and a text has one.

**The file route via `DocumentViewer` works only when iOS can preview the type.** The viewer presents the document and its action button opens the real system sheet — no module involved. But "presents" is conditional: with a type the system cannot render, it presents nothing and reports no error. Silence, and the user sees a tap that did nothing.

So the decision is about the type, not about the file:

- **Type the system knows** (PDF, image, ZIP, plain text) → `DocumentViewer` is enough, and it saves you the module on this path.
- **Opaque type** — anything conforming to `public.data`, which is what a custom document type usually declares so that Files hands it over instead of previewing it (see [File type association](file-type-association.md)) → the viewer has nothing to show. Use the module's `activityView({ file })`.

This is the trap worth naming: **the same declaration that makes tapping the file open your app is what stops `DocumentViewer` from presenting it.** The two behaviors pull in opposite directions and both are correct.

## 5. Do not pass text alongside a file

When sharing a file, pass only the file. Adding `text` to the same payload makes iOS treat the string as a **second item** in the sheet, and "Save to Files" writes two files: the document, plus a `.txt` holding the caption.

```javascript
// wrong — "Save to Files" leaves the backup AND a stray text file
social.activityView({ file: file.nativePath, text: title }, [])

// right — the subject rides along without becoming an item
social.activityView({ file: file.nativePath, subject: title }, [])
```

The symptom shows up only in destinations that write to disk. Sharing to a messaging app looks fine, which is why this survives testing.

## 6. iPad needs an anchor

On iPad the sheet is a popover and must be anchored to the view that was tapped, or it has nowhere to attach:

```javascript
if (Ti.Platform.osname === 'ipad') {
  options.view = sourceView
  social.activityPopover(options, [])
  return true
}

social.activityView(options, [])
```

This means the controller has to pass the source view down to the sharing service — usually `event.source` from the tap handler. Services that take only a URL cannot support iPad without changing their signature, which is why the parameter is worth adding before the app ships on tablets.

## 7. Knowing whether the user actually shared

Both platforms open a sheet and return immediately. Neither the intent chooser nor a bare `activityView` call tells you what happened next.

On iOS the module emits it:

```javascript
const social = require('dk.napp.social')

social.addEventListener('complete', event => {
  // event.activityName — where it went
})

social.addEventListener('cancelled', () => {})
```

Register these **once**, at module scope inside the iOS branch, not per share — re-adding on every tap leaks listeners.

Android has no equivalent through the chooser. If the product needs to know, that asymmetry is the design constraint, and treating "sheet opened" as success is the honest fallback.

Skip all of this when nothing depends on the answer. An analytics event or a "Shared!" confirmation is a reason; symmetry with iOS is not.

## 8. Failing without an exception

Sharing fails for reasons that are not bugs: no activity, a device without sheet support, a file that was deleted between the tap and the call. **Return a boolean and let the caller decide whether to warn.** Throwing from a share function means an exception reaches whoever tapped a button.

```javascript
function share (payload, sourceView) {
  try {
    return OS_ANDROID
      ? shareAndroid(payload)
      : shareIos(payload, sourceView)
  } catch (error) {
    Ti.API.error(`[sharing] Could not share: ${error.message}`)
    return false
  }
}
```

The failure worth auditing in an existing codebase is a **mixed contract**: one branch returning `false` while its sibling throws or returns nothing. It usually means one path was hardened after a crash and the other was never revisited.

## 9. Verify instead of assuming

Whether the SDK exposes something is checkable in the installed SDK's API metadata, and takes less time than the argument about it:

```bash
JSCA=~/Library/Application\ Support/Titanium/mobilesdk/osx/<version>/api.jsca

python3 - "$JSCA" <<'PY'
import json, sys
d = json.load(open(sys.argv[1]))
for t in d.get('types', []):
    if any(k in t['name'] for k in ('Activity', 'Share', 'Social', 'DocumentViewer')):
        print(t['name'])
PY
```

On 13.4.0.GA this returns `Titanium.UI.iOS.DocumentViewer`, `Titanium.App.iOS.UserActivity`, `Titanium.UI.ActivityIndicator` and the Android `Activity` types — and nothing wrapping `UIActivityViewController`. The same query tells you whether an API you are about to rely on is marked deprecated.

For the module, check what is actually installed rather than what `tiapp.xml` claims:

```bash
ls ~/Library/Application\ Support/Titanium/modules/iphone/dk.napp.social/
cat ~/Library/Application\ Support/Titanium/modules/iphone/dk.napp.social/*/manifest
```

**Do not verify a suspicion by comparing against a sibling project.** Two codebases that share a lineage share its mistakes, so agreement between them proves nothing. The control is the platform documentation or the SDK metadata.

## 10. Symptom to cause

| Symptom | Cause |
| --- | --- |
| Tapping Share does nothing on iOS, no error | File type is not previewable and the code used `DocumentViewer`. Use the module for opaque types. |
| Receiving app shows an error or an empty attachment (Android) | Missing `FLAG_GRANT_READ_URI_PERMISSION`. |
| "Save to Files" writes two files | `text` passed alongside `file`. Use `subject`. |
| Sheet does not appear on iPad | `activityView` used instead of `activityPopover`, or no `view` anchor. |
| Crash when tapping Share on Android | `startActivity` on a null activity. Guard `rootActivity || currentActivity`. |
| Chooser offers every app on the device | `type` left as `*/*` or an unknown extension falling back to `application/octet-stream`. |
| `Couldn't find module: dk.napp.social` | Module not installed, or `require` at file scope running on Android. |
| Module version in `tiapp.xml` has no matching release | Locally built copy. It cannot be downloaded; document it as an install requirement. |

## Sources

- Titanium SDK 13.4.0.GA `api.jsca` — the absence of a share sheet API on iOS and the non-deprecated status of `Ti.Android.createIntentChooser`.
- [hansemannn/TiSocial.Framework](https://github.com/hansemannn/TiSocial.Framework) — maintained fork, releases 3.0.0 through 3.0.2.
- [viezel/TiSocial.Framework](https://github.com/viezel/TiSocial.Framework) — original, archived April 2021.
- [ricardoalcocer/socialshare](https://github.com/ricardoalcocer/socialshare) — the historical cross-platform wrapper, for recognizing it in old code.
