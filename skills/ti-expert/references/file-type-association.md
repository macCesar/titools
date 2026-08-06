# File type association

How to make the OS hand your app a file — so a document with your extension
opens your app when the user taps it, arrives over AirDrop or Quick Share, or is
picked from another app's share sheet.

This is a configuration problem more than a coding one, and it fails in a
specific way that wastes days: the system gives no error, no warning, and no log
line when a key is in the wrong place. The app simply never gets the file, and
every symptom looks like "iOS/Android doesn't allow this", which is the wrong
conclusion. Most of this file is about telling those failures apart.

## Contents

1. [Decide what you are declaring](#1-decide-what-you-are-declaring)
2. [iOS: declaring the type](#2-ios-declaring-the-type)
3. [iOS: claiming the documents](#3-ios-claiming-the-documents)
4. [iOS: the root-level keys](#4-ios-the-root-level-keys)
5. [iOS: receiving the file](#5-ios-receiving-the-file)
6. [Android: the intent filter](#6-android-the-intent-filter)
7. [Android: receiving the file](#7-android-receiving-the-file)
8. [Document icons](#8-document-icons)
9. [Verify instead of assuming](#9-verify-instead-of-assuming)
10. [Symptom to cause](#10-symptom-to-cause)

## 1. Decide what you are declaring

Two questions decide everything downstream.

**Is the type yours or someone else's?** A format your app invented is
*exported* — you own the identifier and define what it means. A format that
already exists (PDF, CSV, a competitor's format) is *imported* — you are
declaring that you can handle a type someone else defined. On iOS these are
different keys (`UTExportedTypeDeclarations` vs `UTImportedTypeDeclarations`);
declaring someone else's type as exported is how two apps end up fighting over
an identifier.

**What is the file, as far as the system is concerned?** This matters more than
it looks, and it is the first place people go wrong. A backup archive that
happens to be a ZIP internally is *not* a ZIP as far as the user is concerned —
it is your document. If you declare it as conforming to `public.zip-archive`,
iOS Files treats it as an archive: tapping it lists the contents instead of
handing it to your app, because that is what the system does with archives, and
it is doing exactly what you told it.

Conform to `public.data` for an opaque document whose internals are your
business. The internal format is an implementation detail; the declared type is
a user-facing contract.

The same reasoning applies to the extension. `.zip` makes your app volunteer for
every ZIP on the device; a distinct extension keeps the association narrow.

## 2. iOS: declaring the type

Goes inside `<ios><plist><dict>` in `tiapp.xml`:

```xml
<key>UTExportedTypeDeclarations</key>
<array>
  <dict>
    <key>UTTypeIdentifier</key>
    <string>com.example.myapp.mytype</string>
    <key>UTTypeDescription</key>
    <string>My App Document</string>
    <key>UTTypeConformsTo</key>
    <array>
      <string>public.data</string>
    </array>
    <key>UTTypeTagSpecification</key>
    <dict>
      <key>public.filename-extension</key>
      <array>
        <string>mytype</string>
      </array>
    </dict>
  </dict>
</array>
```

Use reverse-DNS under your bundle id for the identifier. The extension in
`UTTypeTagSpecification` carries no leading dot.

For a type you did not invent, use `UTImportedTypeDeclarations` with the same
structure and the identifier its owner published.

## 3. iOS: claiming the documents

Declaring a type says the type exists. `CFBundleDocumentTypes` says your app
handles it:

```xml
<key>CFBundleDocumentTypes</key>
<array>
  <dict>
    <key>CFBundleTypeName</key>
    <string>My App Document</string>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>LSHandlerRank</key>
    <string>Owner</string>
    <key>LSItemContentTypes</key>
    <array>
      <string>com.example.myapp.mytype</string>
    </array>
    <key>CFBundleTypeExtensions</key>
    <array>
      <string>mytype</string>
    </array>
  </dict>
</array>
```

`LSHandlerRank` decides who wins when several apps claim the same type:
`Owner` for a format you defined, `Alternate` for one you merely support,
`Default` when no other app claims it. `CFBundleTypeRole` is `Editor` if your
app can modify the file, `Viewer` if it only reads it.

## 4. iOS: the root-level keys

This is where the day gets lost, so it is worth stating plainly:
**`LSSupportsOpeningDocumentsInPlace` is a root-level `Info.plist` key.** It is a
sibling of `CFBundleDocumentTypes`, not a key inside its dictionary.

Nesting it reads as natural — it describes how documents of that type are
opened, so it looks like it belongs with the type. iOS does not read it there
and says nothing about it. The resulting state is deceptive: the app *is*
registered as owner of the type, so the system knows it exists, but nothing ever
declared that the app can open it in place. Files falls back to previewing the
document, and the behavior is indistinguishable from "iOS won't launch
third-party apps from Files" — a conclusion people reach, write down, and design
around.

```xml
<!-- correct: sibling of CFBundleDocumentTypes, at the root of the plist dict -->
<key>CFBundleDocumentTypes</key>
<array>...</array>

<key>LSSupportsOpeningDocumentsInPlace</key>
<true/>
```

Apple's own requirement makes this non-optional: when you declare
`CFBundleDocumentTypes`, you must also set either
`LSSupportsOpeningDocumentsInPlace` or `UISupportsDocumentBrowser` (the latter
only if the app uses `UIDocumentBrowserViewController`). Omitting both also
triggers the *Missing Document Configuration* warning from App Store Connect,
which is often the first hint anyone gets that something is wrong.

There is a second reason to set it beyond launching. Without it, iOS copies the
document into the app's Inbox before delivering it — a full second copy on disk.
For a document that carries photos or video, that is a real cost paid every time
the user opens one.

### The neighboring key that is not the same thing

`UIFileSharingEnabled` (also root-level) exposes the app's entire `Documents`
directory inside the Files app. It is unrelated to opening a document your app
was handed, and it is not required for this to work.

Enabling it makes every JSON file, cache and media asset the app keeps in
`Documents` browsable by the user. That is a product decision — sometimes the
right one, for an app whose documents *are* the user's files — but reaching for
it while debugging a file association exposes the app's internals as a side
effect of a fix that was never about that.

## 5. iOS: receiving the file

The app receives the document URL through the `handleurl` event on
`Ti.App.iOS`:

```javascript
Ti.App.iOS.addEventListener('handleurl', event => {
  const url = event.launchOptions && event.launchOptions.url
  // resolve, validate, then adopt
})
```

Register the listener at a point that survives the app being launched *by* the
file rather than merely resumed — a cold launch delivers the event early. Store
whatever identifies the last handled document, because the same launch payload
can be read more than once during a lifecycle and reprocessing it silently
imports the same file twice.

**Validate before acting.** An intent filter or a UTI claim is a public
invitation: any file with the right extension reaches your app, including one
that is malformed or came from somewhere unexpected. Read the manifest, check
the version, and fail with a message the user understands — never start writing
over existing data on the strength of a filename.

### Saving a file back out

Two APIs are easy to confuse:

- `Ti.UI.iOS.DocumentViewer` is a **previewer**. If the file type is not
  previewable it does not present and does not report an error.
- `ti.documentpicker.export()` opens the system destination dialog — this is the
  one for "save a copy where the user chooses".

## 6. Android: the intent filter

Android associates by intent filter on the activity that should receive the
file, declared inside `<android><manifest><application>` in `tiapp.xml`:

```xml
<activity android:name=".MyAppActivity">
  <intent-filter>
    <action android:name="android.intent.action.VIEW"/>
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE"/>
    <data android:scheme="content"/>
    <data android:scheme="file"/>
    <data android:mimeType="*/*"/>
    <data android:host="*"/>
    <data android:pathPattern=".*\\.mytype"/>
    <data android:pathPattern=".*\\..*\\.mytype"/>
    <data android:pathPattern=".*\\..*\\..*\\.mytype"/>
  </intent-filter>
</activity>
```

Three things in that block are not obvious.

**`pathPattern` is not a regular expression.** It supports only `*` (zero or
more of the preceding character) and `.` (any character), and the matching is
greedy without backtracking. `.*\\.mytype` therefore fails on any filename
containing an earlier dot — `my.backup.mytype` does not match — so the
conventional fix is to repeat the pattern with one extra `.*\\.` per additional
dot you want to tolerate. Three variants covers most real filenames. The
backslash is doubled because the manifest is XML.

**A custom extension usually has no registered MIME type**, so the file arrives
as `application/octet-stream` or with whatever type the sending app guessed.
`android:mimeType="*/*"` is what makes the filter reachable at all; the
`pathPattern` entries are what keep it from volunteering for every file on the
device. Both halves are load-bearing — `*/*` alone makes your app an option for
opening anything.

**Matching is by name, which has a consequence.** A `content://` URI whose path
does not carry the filename will not match, no matter what its MIME type says.
This is a real limit of the mechanism, not a misconfiguration to hunt down.

### Whether to also filter ACTION_SEND

`ACTION_VIEW` covers tapping the file — in a file manager, a messaging app, or a
notification. `ACTION_SEND` covers another app sharing content *to* you, which
is how Quick Share and most share buttons deliver.

Adding `ACTION_SEND` has a side effect worth predicting: your app then appears
in its own share sheet, offering to receive the file it just produced. If the
app's only outbound flow is exporting a document, that is confusing enough to be
worth skipping — tapping the received file still works through `ACTION_VIEW`.

## 7. Android: receiving the file

Read the intent from the current activity, falling back to the launch intent:

```javascript
const activity = Ti.Android.currentActivity || Ti.Android.rootActivity
const intent = (activity && activity.intent) || Ti.App.Android.launchIntent
const action = intent.getAction()

// ACTION_VIEW  → intent.getData()
// ACTION_SEND  → intent.getBlobExtra(Ti.Android.EXTRA_STREAM)
```

**A `content://` URI is not a path.** It is a handle into another app's content
provider, valid only for as long as the grant lasts. Read the blob and write it
to a file you own under `applicationDataDirectory` before doing anything else;
code that treats it as a filesystem path works on some devices and fails on
others, which is the worst kind of bug to inherit.

Give that landing spot its own directory, separate from the working area your
import routine clears at the start of a run — otherwise the incoming file
deletes itself moments before it is read.

As on iOS, the same launch intent can be read more than once during a lifecycle.
Remember the last one handled.

## 8. Document icons

A document icon is what lets someone find their file months later without
reading filenames. It is also the part most likely to be quietly ignored by the
system, so it is worth confirming before producing a full set of images.

**iOS derives one for free — check that before drawing anything.** With no icon
keys declared at all, the Files app renders the document as a page with the app
icon inside it (verified 2026-08-05 on a Titanium 13.4.0 app: no
`UTTypeIconFiles`, no `CFBundleTypeIconFiles`, not a single document PNG in the
project). For a type only your app produces, that is usually enough — it reads as
"a document belonging to this app", which is the whole job, and it costs nothing
to maintain.

Note the sequencing this implies: the derived icon is only meaningful once the
app icon is final, since it is built from it. Producing a document icon set
before app identity is settled means judging a fallback that is itself a
placeholder.

If you do want a custom one, declare `UTTypeIconFiles` in the type declaration
and `CFBundleTypeIconFiles` in the document type entry, both arrays of PNG
filenames (with extension) placed in `app/assets/iphone/`. Confirm it is actually
honored on a device before producing the full size set — there are long-standing
developer reports of the system preferring its derived version anyway.

**Android.** The icon belongs on the `intent-filter`, not on the data element:

```xml
<intent-filter android:icon="@drawable/mytype">
```

with the drawable under `platform/android/res/drawable/`. Android does not
oblige file managers to use it, and several show their own icon based on MIME
type — with `application/octet-stream`, expect some to render it generic no
matter what you ship.

Android has no derived-icon fallback, so the two platforms are not symmetrical:
on iOS doing nothing produces something reasonable, while on Android doing
nothing leaves the file generic. Decide them separately rather than as one task.

## 9. Verify instead of assuming

Every claim in this file is checkable in seconds, and the failure modes are
silent enough that checking is the only way to know.

**Confirm the built binary, not `tiapp.xml`.** The build normalizes and merges
plists, so what you wrote is not necessarily what shipped:

```bash
# what the installed app actually declares
plutil -extract LSSupportsOpeningDocumentsInPlace raw -o - "<App>.app/Info.plist"
plutil -extract CFBundleDocumentTypes xml1 -o - "<App>.app/Info.plist"
```

A key in the wrong place returns *"No value at that key path"* — the same result
as not declaring it at all, which is precisely the point.

For a simulator build, locate the bundle with:

```bash
xcrun simctl get_app_container <device-udid> <bundle-id> app
```

**On Android, ask the package manager who claims the type:**

```bash
adb shell cmd package query-activities -a android.intent.action.VIEW \
  -d "file:///sdcard/Download/test.mytype"
```

Run it twice — once with your extension and once with a neighbouring one
(`.zip`, `.txt`) — to confirm the filter is both reachable *and* narrow. A
filter that matches everything looks identical to a correct one until you test
the negative case.

**The final check is a person tapping the file.** Nothing above proves the OS
routes it; it only proves the declaration is well formed. Test a cold launch
(app not running) separately from a warm one — they take different paths through
the launch handling and only one of them may be wired up.

## 10. Symptom to cause

| Symptom | Likely cause |
| --- | --- |
| iOS Files previews the document instead of launching the app | `LSSupportsOpeningDocumentsInPlace` missing from the **root** of `Info.plist`, or nested inside `CFBundleDocumentTypes` |
| iOS Files lists the file's contents like a folder | Type conforms to `public.zip-archive` (or another archive type) instead of `public.data` |
| App is offered for unrelated files of other apps | Extension or MIME type too broad (`.zip`, `application/zip`); on Android, `mimeType="*/*"` with no `pathPattern` |
| App offers itself in its own share sheet | An `ACTION_SEND` filter that the app's own outbound flow matches |
| Android: file with several dots in its name never opens the app | `pathPattern` variants missing for the extra dots |
| Android: a `content://` file never opens the app | The URI path carries no filename — a limit of name-based matching, not a bug |
| iOS: the same document imports twice | The launch payload was read more than once; no "last handled" guard |
| *Missing Document Configuration* on App Store upload | `CFBundleDocumentTypes` declared without `LSSupportsOpeningDocumentsInPlace` or `UISupportsDocumentBrowser` |
| Document icon stays generic | App icon not final (the fallback derives from it), or the file manager ignores the declared icon |

## Sources

- Verified 2026-08-05 on a shipping Titanium 13.4.0 app: moving
  `LSSupportsOpeningDocumentsInPlace` from inside the `CFBundleDocumentTypes`
  dict to the root of the plist changed `plutil -extract` from *"No value at
  that key path"* to `true`, and changed Files behavior from previewing the
  document to launching the app.
- Verified on the same app: an exported type conforming to `public.zip-archive`
  made iOS Files list the archive contents; `public.data` did not.
- Verified with `cmd package query-activities`: a narrow extension plus
  `pathPattern` stops the app being offered for unrelated archives.
- Verified 2026-08-05 in the iOS Files app: with no icon keys declared, the
  document renders as a page with the app icon inside it.
- `Ti.App.iOS` `handleurl` event — see `ti-api/references/api-app-platform.md`.
- Apple, *Information Property List* reference, for
  `LSSupportsOpeningDocumentsInPlace`, `UIFileSharingEnabled` and
  `UISupportsDocumentBrowser`.
- Icon key names and sizes come from Apple's archived *Registering the File
  Types Your App Supports*; confirm sizes against current documentation before
  producing a full set.
