# Alloy Configuration Files Reference

## Build Configuration File (alloy.jmk)

Alloy provides hooks to customize compilation using a JS Makefile (JMK).

**Location:** `app/alloy.jmk`

**Example:**
```javascript
task('pre:compile', function(event, logger) {
    logger.showTimestamp = true;
    logger.info('building project at ' + event.dir.project);
});

task('post:compile', function(event, logger) {
    logger.info('compile finished!');
});
```

### Compiler Tasks (Event Names)

| Task | When Called |
|------|-------------|
| `pre:load` | After project clean, before copying assets to `Resources` |
| `pre:compile` | Before compiler starts |
| `post:compile` | After compiler finishes, before exit |
| `compile:app.js` | After compiling `app.js`, before writing to disk |

### Event Object

| Property | Type | Description |
|----------|------|-------------|
| `adapters` | Array | List of adapters |
| `alloyConfig` | Object | Compiler config: `platform`, `file`, `deploytype`, `beautify` |
| `autoStyle` | Boolean | Autostyle enabled for project |
| `dependencies` | Object | Value of `dependencies` key in config.json |
| `dir` | Object | Directory paths: `home`, `project`, `resources`, `resourcesAlloy`, `assets`, `config`, `controllers`, `migrations`, `models`, `styles`, `themes`, `views`, `widgets`, `builtins`, `template` |
| `sourcemap` | Boolean | Generate source mapping files |
| `theme` | String | Theme name being used |
| `code` | String | *(compile:app.js only)* Contents of `app.js` |
| `appJSFile` | String | *(compile:app.js only)* Absolute path to `app.js` |

### Logger Object

**Properties:**
- `DEBUG`, `INFO`, `WARN`, `ERROR`, `NONE` - Log level constants
- `logLevel` - Set output level
- `showTimestamp` - Show timestamps (Boolean)
- `stripColors` - Suppress color output (Boolean)

**Methods:**
- `debug(String msg)` - Output debug message
- `info(String msg)` - Output info message
- `warn(String msg)` - Output warning
- `error(String msg)` - Output error

## Project Configuration File (config.json)

**Location:** `app/config.json`

Specifies global values, conditional environment/platform values, and widget dependencies.

### Objects

| Object | Description |
|--------|-------------|
| `global` | Key-value pairs for all environments and platforms |
| `env:development` | Development builds (simulator/emulator) |
| `env:test` | Test builds on device |
| `env:production` | Production builds (after package installation) |
| `os:android` | Android-specific values |
| `os:ios` | iOS-specific values |
| `dependencies` | Widget dependencies (name: version) |
| `autoStyle` | Enable autostyle for entire project |
| `backbone` | Backbone.js version: `0.9.2`, `1.1.2`, or `1.3.3` |

**Precedence:** `os` > `env` > `global`

**Combined:** Use `os:ios env:production` for platform+environment specificity.

**Access:** Prefix keys with `Alloy.CFG.` at runtime.

**Example:**
```json
{
    "global": { "foo": 1 },
    "env:development": { "foo": 2 },
    "env:test": { "foo": 3 },
    "env:production": { "foo": 4 },
    "os:ios env:production": { "foo": 5 },
    "os:ios env:development": { "foo": 6 },
    "os:ios env:test": { "foo": 7 },
    "os:android": { "foo": 8 },
    "dependencies": {
        "com.foo.widget": "1.0"
    }
}
```

iPhone simulator prints `Alloy.CFG.foo` as `6`.

## Widget Configuration File (widget.json)

**Location:** Widget root directory

Follows npm package.json format with exceptions.

### Keys

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `id` | String | Yes | Must match widget root folder name |
| `copyright` | String | No | Copyright information |
| `license` | String | No | License information |
| `min-alloy-version` | Float | No* | Minimum Alloy version required |
| `min-titanium-version` | Float | No* | Minimum Titanium version required |
| `tags` | String | No | Comma-delimited keywords |
| `platforms` | String | No* | Supported platforms (comma-delimited) |

(*) Currently not checked but will be in future versions.
