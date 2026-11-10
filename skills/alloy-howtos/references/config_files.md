# Alloy configuration

`app/config.json` holds runtime settings and compiler configuration. A generated project uses these sections:

```json
{
    "global": {},
    "env:development": {},
    "env:test": {},
    "env:production": {},
    "os:android": {},
    "os:ios": {},
    "dependencies": {},
    "backbone": "1.4.0"
}
```

## Runtime values and overrides

```json
{
    "global": { "apiRoot": "https://example.com/api", "pageSize": 20 },
    "env:production": { "apiRoot": "https://api.example.com" },
    "os:android": { "pageSize": 10 }
}
```

Read the resulting values with `Alloy.CFG.apiRoot`. The selected `env:` is the build deploy type, not its target. Simulator builds normally use `development`; `--deploy-type production` selects production.

For conflicting keys, released Alloy 3.0.1 merges `global`, then the matching `env:`, then `os:`: the OS value wins. The current published configuration page reverses the last two in its prose. Do not rely on that wording; verify the installed compiler when a collision matters.

The merged configuration ships in the app and can be extracted. API roots belong here; secrets belong on a server. Compiler settings can also appear in the generated configuration: do not treat it as a secret store or assume compiler-only keys are stripped.

## Compile-time constants

| Constant | True when |
| --- | --- |
| `OS_IOS`, `OS_ANDROID` | Building that platform |
| `ENV_DEV`, `ENV_DEVELOPMENT` | Development deploy type |
| `ENV_TEST` | Test deploy type |
| `ENV_PROD`, `ENV_PRODUCTION` | Production deploy type |
| `DIST_ADHOC` | Target `dist-adhoc` |
| `DIST_STORE` | Target `dist-appstore` or `dist-playstore` |

These are compiler-provided, not entries in `config.json`. Write the platform condition explicitly so the compiler can remove the other branch:

```javascript
if (OS_IOS) {
    // iOS-specific implementation.
}
```

Guard or remove logging before distribution; release logging can expose interpolated private data. Do not infer a target named `dist-store` from the constant.

## Themes, widgets and Backbone

Set a build-time theme using `{ "global": { "theme": "dark" } }` and provide its directory under `app/themes/dark`. See [styles and themes](../../alloy-guides/references/VIEWS_STYLES.md#themes).

`dependencies` lists widget IDs and versions. Provide those widget directories under `app/widgets`; an undeclared widget is not compiled. See [widgets](../../alloy-guides/references/WIDGETS.md).

`backbone` pins the bundled Backbone version. The released Alloy 3.0.1 template already selects `1.4.0`; do not infer that the project needs unreleased Alloy 3.1.0 from the current model guide's attribution. Check the actual config and `alloy --version`.

## Build hooks

`app/alloy.jmk` runs around compilation and can copy inputs or adjust generated output:

```javascript
task('post:compile', (event, logger) => {
    logger.info(`compiled ${event.dir.project}`);
});
```

Keep hooks small: they execute on each build. The current guide names `pre:load`, `post:load`, `pre:compile` and `post:compile`; released Alloy 3.0.1 implements `pre:load`, `pre:compile` and `post:compile`, but not `post:load`. Do not write a `post:load` recipe without checking support in the version actually installed.

Sources: [configuration](https://titaniumsdk.com/docs/alloy/config.md), [models](https://titaniumsdk.com/docs/alloy/models.md). The precedence, Backbone and hook caveats are verified against released Alloy 3.0.1.
