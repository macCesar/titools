# Practical Alloy conventions

Keep structure in XML, shared appearance in `app/styles/app.tss`, screen-specific styles in the corresponding TSS file and behavior in the controller. The controller can still use the Titanium API directly.

Read `$.args` at the top of a controller so its inputs are visible in one place. Share plain code through CommonJS modules in `app/lib`, and initialize shared configuration in `app/alloy.js` before the first controller.

A controller is not a native Window. Construct it, then call `getView().open()`, or expose a method that opens its own Window. Do not combine both opening approaches.

Clean up external listeners, timers and service subscriptions when the controller is disposed. Separately call `$.destroy()` to remove generated data bindings. See [controllers](../../alloy-guides/references/CONTROLLERS.md#cleaning-up) for callback ownership and the required lifecycle.

Use widgets for reuse between projects and `<Require>` for composition within one app. Pass widget arguments and report changes through exported methods/events; coupling a reusable widget to the app's global state defeats that isolation.

Use models for data that persists, is shared between screens or outlives a screen. A plain array and `Ti.Network` are adequate for data fetched once and rendered. Keep data transforms inexpensive because they run per row when data changes.

Do not edit or commit generated `Resources/` or `build/`. Keep signing credentials out of the repository. Do not put secrets in `config.json` or production logs; both reach the app package/device.

Sources: [Alloy](https://titaniumsdk.com/docs/alloy.md), [controllers](https://titaniumsdk.com/docs/alloy/controllers.md), [models](https://titaniumsdk.com/docs/alloy/models.md), [widgets](https://titaniumsdk.com/docs/alloy/widgets.md), [project structure](https://titaniumsdk.com/docs/build/project-structure.md).
