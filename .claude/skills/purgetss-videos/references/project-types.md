# Alloy and Classic tutorials

Detect the type from the source project, as `purgetss` Step 1 describes: Alloy has `app/views/`, `app/controllers/` and `app/styles/`; Classic has `Resources/` without the Alloy tree. The type decides what may appear on screen and in the narration.

## Alloy

- Utility classes in XML views, `$.UI.create()` in controllers, `purgetss/config.cjs`, the generated `app.tss`, and every standalone command are in scope.
- Besides `purgetss`, load the Titanium skills the tutorial touches: `alloy-guides` for XML, controllers and TSS; `alloy-howtos` for config and build hooks; `ti-guides` for project and build setup; `ti-api` for API contracts; `ti-expert` for architecture; `ti-ui` for native layout and interaction.
- Titanium layouts are native, not CSS. Verify every class, respect platform modifiers, use dp.
- Keep each app to one screen and minimal controller logic. Remove global listeners and unregister draggable views on close.
- Never edit the generated `app.tss` on camera or in the fixture, and never commit build output.
- When a tutorial starts before PurgeTSS is initialized, verify in the take copy that `purgetss/`, the build hook and the backup are absent and the XML has no classes. Rehearse initialization in a separate copy; never reuse the rehearsal copy for the take or rely on restoring only the XML.

## Classic

- Only the standalone commands that write native files under `Resources/` are in scope: `brand`, `images`, `semantic`, `shades`, `color-module`, `icon-library`, `build-fonts`, `module`. Check `purgetss` `references/classic-projects.md` for the current list and output paths.
- Never show or introduce `app/`, `alloy.jmk`, TSS, utility classes or `$.UI.create()`.
- Never run the Alloy lifecycle commands in a Classic project: the bare `purgetss`, `--all`, `init`, `create`, `install-dependencies`, `build`, `watch`.
- `purgetss.ui` in Classic is used through CommonJS `require()`; verify the API against `purgetss` `references/purgetss-ui-classic.md`.

## Configuration changed by a command

`shades` and `semantic` change versioned configuration. Repeat those episodes from a clean copy of the fixture, never from a copy a previous take already modified.
