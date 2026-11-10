# User interface

> Build screens with Titanium's layout system, lists, icons, and the places the platforms differ.

- Source: https://titaniumsdk.com/docs/build/ui
- Written for Titanium SDK 13.4.0 and later.
- This corpus documents Titanium SDK 13.4.1. Anything here that does not name a version describes 13.4.1.
- Titanium is maintained by TiDev. The Appcelerator toolchain is retired: there is no `appc` CLI, no Appcelerator Studio and no hosted build service. The supported CLI is `titanium` on npm, invoked as `ti`.

---

A Titanium view is a real native view. `Ti.UI.createButton()` makes a
`UIButton` on iOS and an `android.widget.Button` on Android, and you get a
handle to it. Nothing here is drawn by Titanium or approximated in a web view.

What Titanium adds on top is one layout system, shared by both platforms, so a
screen you describe once positions itself on either. That system is the first
thing to learn and the thing most new Titanium code gets wrong.

![Two boxed screenshots labelled iOS and Android, side by side, showing the same screen: a heading, a switch, a button and a slider in the same order at the same positions. Each control is drawn in its own platform's style, so the iOS switch is green and its button is plain blue text, while the Android switch is blue and its button is a filled rectangle.](https://titaniumsdk.com/docs/guides/one-codebase.png)

## Start here

[Layout and positioning](layouts-and-positioning.md) is the one to read first. Three
layout modes, two sizing constants, and a precedence order that explains why a
view you gave a `height` to ignored your `bottom`.

[Lists and tables](listviews-and-performance.md) covers `ListView` and `TableView`, and
which of the two to reach for. The short answer is `ListView`.

[Icons and launch screens](icons-and-splash-screens.md) is a
reference: what sizes each platform wants and where the files go.

[Platform conventions](platform-conventions.md) is for the places
iOS and Android genuinely diverge, rather than the small differences that fit
in a note on the page you were already reading.

## The API reference is the other half

These pages explain how the pieces fit together. What every property does, on
which platform, and since which release is in the
[Titanium API](https://titaniumsdk.com/docs/sdk.md), which is generated from the SDK itself and is
complete. When a guide and the reference disagree, the reference is right.
