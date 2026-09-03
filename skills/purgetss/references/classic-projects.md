# Classic Project Support

Since PurgeTSS 7.15, the utility-class lifecycle remains Alloy-only while independent asset and CommonJS commands can run in Titanium Classic projects. Detect the project layout before choosing a command or output path.

Official source: <https://purgetss.com/docs/commands#alloy-and-classic-compatibility>

## Compatibility Matrix

| Command | Alloy | Classic | Classic behavior |
| --- | :---: | :---: | --- |
| `brand` | yes | yes | Writes branding assets to Classic paths and follows enabled `tiapp.xml` deployment targets; explicit `--only` overrides that filter. |
| `images` | yes | yes | Writes density variants under `Resources/android/images/res-*/` and `Resources/iphone/images/`; follows deployment targets unless `--android` or `--ios` is explicit. |
| `semantic` | yes | yes | Writes only `Resources/semantic.colors.json`; it does not create `purgetss/`, `config.cjs`, TSS, `app/`, or a hook. |
| `shades` | yes | yes | Output-only modes work anywhere. On a fresh Classic project, saving creates only `purgetss/config.cjs`; if the color module already exists, it is regenerated. |
| `color-module` | yes | yes | Writes `app/lib/purgetss.colors.js` or `Resources/lib/purgetss.colors.js`; Classic creates no unrelated empty source folders. |
| `module` | yes | yes | Writes `app/lib/purgetss.ui.js` or `Resources/lib/purgetss.ui.js`. |
| `icon-library` | yes | yes | Copies fonts to `Resources/fonts/` and optional modules to `Resources/lib/`; `--styles` is skipped in Classic. |
| `build-fonts` | yes | yes | Copies fonts to `Resources/fonts/` and optionally writes `Resources/lib/purgetss.fonts.js`; it does not generate TSS in Classic. |
| Root `purgetss`, `--all`, `init`, `create`, `install-dependencies`, `build`, `watch` | yes | no | These commands own the Alloy utility-class lifecycle. |
| `update`, `sudo-update` | yes | yes | Global CLI maintenance; no project layout is required. |

## The Hard Boundary

A Classic project does not receive or need:

- `app/`
- `app/styles/app.tss`
- `purgetss/styles/utilities.tss`
- `purgetss/styles/fonts.tss`
- `alloy.jmk`
- utility classes in views or controllers
- `$.UI.create()`
- the PurgeTSS CLI/package during application compilation or as an app dependency (generated CommonJS modules execute normally)

Files generated under `Resources/` are native Titanium resources. Compile the Classic app normally with `ti build`.

Do not interpret the presence of `purgetss/config.cjs` in a Classic project as permission to use utilities. Commands such as `brand`, `images`, `shades`, and `color-module` may use that file as development-time input without installing the Alloy lifecycle.

Classic `shades` and `color-module` do not scaffold the empty `purgetss/brand/`, `purgetss/fonts/`, or `purgetss/images/` conventions created by Alloy initialization. On a fresh project, `shades` creates only its config; `color-module` creates that config when missing plus its module. If the module already exists, saving a palette refreshes it automatically.

## Layout and Output Routing

| Artifact | Alloy | Classic |
| --- | --- | --- |
| Semantic colors | `app/assets/semantic.colors.json` | `Resources/semantic.colors.json` |
| Android UI densities | `app/assets/android/images/res-*/` | `Resources/android/images/res-*/` |
| iPhone UI scales | `app/assets/iphone/images/` | `Resources/iphone/images/` |
| Font files | `app/assets/fonts/` | `Resources/fonts/` |
| Color module | `app/lib/purgetss.colors.js` | `Resources/lib/purgetss.colors.js` |
| UI module | `app/lib/purgetss.ui.js` | `Resources/lib/purgetss.ui.js` (see [`purgetss.ui` in Classic](./purgetss-ui-classic.md)) |
| Custom-font module | `app/lib/purgetss.fonts.js` | `Resources/lib/purgetss.fonts.js` |

## Loading Generated Modules in Classic

Titanium resolves local CommonJS paths from `Resources/`. Omit both the `Resources/` prefix and the `.js` extension from `require()`.

| Generated file | Classic `require()` path |
| --- | --- |
| `Resources/lib/purgetss.colors.js` | `require('lib/purgetss.colors')` |
| `Resources/lib/purgetss.ui.js` | `require('lib/purgetss.ui')` |
| `Resources/lib/purgetss.fonts.js` | `require('lib/purgetss.fonts')` |
| `Resources/lib/fontawesome.js` | `require('lib/fontawesome')` |
| `Resources/lib/materialicons.js` | `require('lib/materialicons')` |
| `Resources/lib/materialsymbols.js` | `require('lib/materialsymbols')` |
| `Resources/lib/framework7icons.js` | `require('lib/framework7icons')` |

This follows Titanium's [CommonJS module path resolution](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_Guide/Best_Practices_and_Recommendations/CommonJS_Modules_in_Titanium.html#javascript-module-path-resolution).

## Deployment Targets

`brand` and `images` read `<deployment-targets>` from `tiapp.xml` independently of whether the layout is Alloy or Classic.

- A normal run generates only enabled platform families.
- `images --android` and `images --ios` are explicit overrides.
- `brand --only <piece-or-group>` is an explicit override and may prepare assets for a platform before that target is enabled.

Do not assume that Classic means Android-only or that an Alloy project targets both platforms.

## Standalone First-Run Behavior

### `brand`

In a Classic project without `purgetss/config.cjs`, `brand` creates the canonical config before resolving settings. If a positional PNG/SVG is supplied and no canonical `purgetss/brand/logo.{png,svg}` exists, the command moves the source into that convention after overwrite confirmation and reports the destination. It never replaces an existing canonical logo silently.

Classic Android receives the 11 `Resources/android/images/res-*` splash variants even when a fresh `ti create` template did not seed those folders. Titanium consumes those qualifier paths.

### `images`

Running `images` without a positional source establishes the `purgetss/images/` convention. Passing an existing external file or directory does not create an empty `purgetss/images/` folder or a config file merely to process that source.

### `semantic`

Classic `semantic` is deliberately output-only: it writes the native JSON and does not bootstrap any other PurgeTSS artifact. Classic code uses semantic keys directly in Titanium color properties rather than through utility classes.

## Audit Checklist

When auditing a Classic project that uses PurgeTSS:

1. Confirm every invoked command is marked Classic-compatible in the matrix.
2. Confirm outputs use `Resources/`, never Alloy's `app/assets/` or `app/lib/`.
3. Reject any added `alloy.jmk`, generated TSS, utility classes, or `$.UI.create()`.
4. For `brand` and `images`, compare generated platform families with `tiapp.xml` deployment targets and any explicit override flags.
5. Confirm `semantic` did not create unrelated PurgeTSS setup files.
6. For `icon-library --styles`, expect Classic to skip TSS output.
7. For `build-fonts`, expect font files and optional CommonJS output only; no `fonts.tss`.

## Related References

- [CLI Commands](./cli-commands.md)
- [App Icons & Branding](./app-branding.md)
- [Multi-Density Images](./multi-density-images.md)
- [Semantic Colors](./semantic-colors.md)
- [Icon Font Libraries](./icon-fonts.md)
- [Custom Fonts](./custom-fonts.md)
- [`purgetss.ui` in Titanium Classic](./purgetss-ui-classic.md)
