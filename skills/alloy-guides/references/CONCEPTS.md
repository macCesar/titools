# Alloy concepts and project structure

Alloy is Titanium's MVC framework. A screen normally has an XML view for structure, a TSS file for style and a JavaScript controller for behavior. Alloy compiles them into ordinary Titanium JavaScript before the native build; the underlying Titanium API remains available.

Install Alloy separately with `npm install -g alloy`. Use Alloy for applications with several screens, shared styles, reusable controllers/widgets or persistent models. Classic is plain Titanium JavaScript and suits prototypes or small tools. `alloy new` converts an existing Classic project in place.

## Files and ownership

| Path | Purpose |
| --- | --- |
| `app/views/index.xml` | Initial XML hierarchy |
| `app/styles/app.tss` | Styles shared across the app |
| `app/styles/index.tss` | Styles for `index.xml` |
| `app/controllers/index.js` | Initial controller behavior |
| `app/models/` | Backbone model definitions and collections |
| `app/widgets/` | Reusable components |
| `app/lib/` | Plain CommonJS modules |
| `app/assets/` | Images and `semantic.colors.json` |
| `app/platform/` | Files copied into the native project |
| `app/themes/` | Build-time themes |
| `app/alloy.js` | Initializer, before the first controller |
| `app/config.json` | Application settings and compiler configuration |
| `plugins/ti.alloy/` | Compiler hook installed by `alloy new` |
| `tiapp.xml` | App identity, SDK, native configuration and deployment targets |
| `Resources/` | Generated output; never edit it |
| `build/` | Generated native project and compiled output |

Assets are referenced relative to `app/assets`: `app/assets/images/logo.png` becomes `images/logo.png`. Use `app/assets/android` and `app/assets/iphone` for platform-specific assets; only the matching assets enter the package. Native files under `app/platform` are copied without processing.

Commit source, assets, `tiapp.xml` and `DefaultIcon.png`. Do not commit `build/`, generated `Resources/`, or top-level `platform/` and `i18n/` in an Alloy project. `alloy new` writes their ignore rules. Keep keystores and signing credentials out of the repository.

The Classic template's initial `Resources/app.js` can remain after conversion; subsequent Alloy builds replace generated output. Do not change it to implement an Alloy screen.

For app identity, native permissions and signing, use `ti-guides`. For the view/controller/style relationship, read [XML views](./VIEWS_XML.md), [styles](./VIEWS_STYLES.md) and [controllers](./CONTROLLERS.md).

Sources: [Alloy](https://titaniumsdk.com/docs/alloy.md), [project structure](https://titaniumsdk.com/docs/build/project-structure.md), [first app](https://titaniumsdk.com/docs/build/first-app.md).
