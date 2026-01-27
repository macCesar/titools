# Alloy Configuration Files Reference

## Table of Contents

- [Alloy Configuration Files Reference](#alloy-configuration-files-reference)
  - [Table of Contents](#table-of-contents)
  - [Build Configuration File (alloy.jmk)](#build-configuration-file-alloyjmk)
    - [Compiler Tasks (Event Names)](#compiler-tasks-event-names)
    - [Event Object](#event-object)
    - [Logger Object](#logger-object)
    - [Objects](#objects)
    - [Keys](#keys)

---

## Build Configuration File (alloy.jmk)

Alloy provides hooks to customize compilation using a JS Makefile (JMK).

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

### Compiler Tasks (Event Names)

| Task             | When Called                                               |
| ---------------- | --------------------------------------------------------- |
| `pre:load`       | After project clean, before copying assets to `Resources` |
| `pre:compile`    | Before compiler starts                                    |
| `post:compile`   | After compiler finishes, before exit                      |
| `compile:app.js` | After compiling `app.js`, before writing to disk          |

### Event Object

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

### Logger Object
...
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

**Precedence:** `os` > `env` > `global`. Combinations (e.g., `os:ios env:production`) override single values.
...
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
