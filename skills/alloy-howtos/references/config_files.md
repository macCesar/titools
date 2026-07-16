# Alloy configuration files reference

## Build configuration file (alloy.jmk)

Alloy exposes hooks to customize compilation with a JS Makefile (JMK).

**Location:** `app/alloy.jmk`

**Example:**
```javascript
task('pre:compile', (event, logger) => {
    logger.showTimestamp = true;
    logger.info(`building project at ${event.dir.project}`);
});

task('post:compile', (event, logger) => {
    logger.info('compile finished!');
});
```

### Compiler tasks (event names)

| Task             | When Called                                               |
| ---------------- | --------------------------------------------------------- |
| `pre:load`       | After project clean, before copying assets to `Resources` |
| `pre:compile`    | Before compiler starts                                    |
| `post:compile`   | After compiler finishes, before exit                      |
| `compile:app.js` | After compiling `app.js`, before writing to disk          |

### Event object

| Property       | Type    | Description                                                                                                                                                                                                         |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `adapters`     | Array   | List of adapters                                                                                                                                                                                                    |
| `alloyConfig`  | Object  | Compiler config: `platform` (android/ios), `file` (selective compile), `deploytype` (development/test/production), `beautify` (Boolean)                                                                             |
| `autoStyle`    | Boolean | Autostyle enabled for project                                                                                                                                                                                       |
| `dependencies` | Object  | Value of `dependencies` key in config.json                                                                                                                                                                          |
| `dir`          | Object  | Directory paths: `home` (app path), `project` (root path), `resources`, `resourcesAlloy`, `assets`, `config`, `controllers`, `migrations`, `models`, `styles`, `themes`, `views`, `widgets`, `builtins`, `template` |
| `sourcemap`    | Boolean | If `true`, generates mapping files to link generated Titanium files in `Resources` back to the source files in `app` for debugging.                                                                                 |
| `theme`        | String  | Theme name being used                                                                                                                                                                                               |
| `code`         | String  | *(compile:app.js only)* Contents of `app.js`                                                                                                                                                                        |
| `appJSFile`    | String  | *(compile:app.js only)* Absolute path to `app.js`                                                                                                                                                                   |

### Logger object

The `logger` object controls compilation log output.

#### Properties

| Property        | Type    | Description                                     |
| --------------- | ------- | ----------------------------------------------- |
| `DEBUG`         | Number  | READONLY. Output all log messages.              |
| `INFO`          | Number  | READONLY. Output all except debug messages.     |
| `WARN`          | Number  | READONLY. Output only warning and error.        |
| `ERROR`         | Number  | READONLY. Output only error messages.           |
| `NONE`          | Number  | READONLY. Disable log messages.                 |
| `logLevel`      | Number  | Sets which log messages to output.              |
| `showTimestamp` | Boolean | If `true`, outputs timestamp with log messages. |
| `stripColors`   | Boolean | If `true`, suppresses color output.             |

#### Methods

| Method               | Description                    |
| -------------------- | ------------------------------ |
| `debug(msg: String)` | Outputs a debug log message.   |
| `info(msg: String)`  | Outputs an info log message.   |
| `warn(msg: String)`  | Outputs a warning log message. |
| `error(msg: String)` | Outputs an error log message.  |

---

## Global initializer (alloy.js)

**Location:** `app/alloy.js`

Runs before any controllers load. Use it to set up globals and singletons.

Common uses:
- Creating `Alloy.Collections` (e.g., `Alloy.Collections.myModel = Alloy.createCollection('myModel');`)
- Setting up `Alloy.Globals` (shared references, utility functions)
- Initializing singletons (analytics, logging, network managers)
- Configuring global event listeners

**Example:**
```javascript
// app/alloy.js
Alloy.Globals.loading = Alloy.createWidget('com.example.loading');
Alloy.Collections.users = Alloy.createCollection('user');

// Global utility
Alloy.Globals.alert = (title, message) => {
    Ti.UI.createAlertDialog({ title, message }).show();
};
```

---

## Project configuration file (config.json)

**Location:** `app/config.json`

Alloy uses `config.json` for global values, environment and platform overrides, and widget dependencies.
### Objects

| Object            | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `global`          | Key-value pairs for all environments and platforms          |
| `env:development` | Development builds (simulator/emulator)                     |
| `env:test`        | Test builds on device                                       |
| `env:production`  | Production builds (after package installation)              |
| `os:android`      | Android-specific values                                     |
| `os:ios`          | iOS-specific values                                         |
| `dependencies`    | Widget dependencies (name: version)                         |
| `autoStyle`       | Enable autostyle for entire project                         |
| `backbone`        | Backbone.js version: `0.9.2` (default), `1.1.2`, or `1.3.3` |

**Precedence:** `os` > `env` > `global`. Combinations (for example, `os:ios env:production`) override single values.

**Runtime access:** Values are available at runtime via `Alloy.CFG.<key>`.

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

Accessing values: `Ti.API.info(Alloy.CFG.foo)` on iPhone simulator returns `6`.

---

## Widget configuration file (widget.json)

**Location:** Root directory of the widget. Follows the npm `package.json` format with a few exceptions.
### Keys

| Key                    | Type   | Required | Description                           |
| ---------------------- | ------ | -------- | ------------------------------------- |
| `id`                   | String | Yes      | Must match widget root folder name    |
| `copyright`            | String | No       | Copyright information                 |
| `license`              | String | No       | License information                   |
| `min-alloy-version`    | Float  | No*      | Minimum Alloy version required        |
| `min-titanium-version` | Float  | No*      | Minimum Titanium version required     |
| `tags`                 | String | No       | Comma-delimited keywords              |
| `platforms`            | String | No*      | Supported platforms (comma-delimited) |

(*) Currently, `min-alloy-version`, `min-titanium-version`, and `platforms` are not strictly enforced, but Alloy will perform checks against these in future versions.
