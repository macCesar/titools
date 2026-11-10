# CLI commands


The CLI is `titanium`, and `ti` is the same binary. Ten commands.

| Command      | Does                                               |
| ------------ | -------------------------------------------------- |
| `ti build`   | Builds a project, and installs and runs it         |
| `ti clean`   | Removes previous build directories                 |
| `ti config`  | Gets and sets CLI config options                   |
| `ti create`  | Creates a project, module, or Apple Watch app      |
| `ti info`    | Reports the development environment                |
| `ti module`  | Lists installed modules                            |
| `ti project` | Gets and sets `tiapp.xml` settings                 |
| `ti sdk`     | Manages installed SDKs                             |
| `ti serve`   | Serves a project through the Titanium Vite runtime |
| `ti setup`   | Configures the CLI                                 |

Every command takes `--help`, and that output is generated from the CLI you
have installed, so it is always the authority over this page.

## Global options

These work on any command.

| Option                     | Effect                                                  |
| -------------------------- | ------------------------------------------------------- |
| `-d, --project-dir <path>` | The project to act on, instead of the working directory |
| `-s, --sdk [version]`      | Build with a specific SDK rather than the newest        |
| `--no-prompt`              | Never ask. **Required for scripting**                   |
| `--no-banner`              | Drop the version banner                                 |
| `--no-color`               | Drop ANSI colour                                        |
| `--no-progress-bars`       | Drop progress bars                                      |
| `-q, --quiet`              | Suppress output                                         |
| `--config [json]`          | Mix a JSON object into the config for this run          |
| `--config-file [file]`     | Use a different config file                             |
| `--debug`                  | CLI's own debug logging                                 |

`--no-prompt` turns a missing required option from a question into an error,
which is what you want in CI and what makes a hung build impossible.

## ti build

```sh
ti build --platform android
ti build --platform ios --target device
```

`--platform` takes `android` or `ios`. `--target` defaults to `emulator` on
Android and `simulator` on iOS.

| Platform | Targets                                                                           |
| -------- | --------------------------------------------------------------------------------- |
| Android  | `emulator`, `device`, `dist-playstore`                                            |
| iOS      | `simulator`, `device`, `dist-appstore`, `dist-adhoc`, `macos`, `dist-macappstore` |

Options worth knowing:

| Option                     | Effect                                |
| -------------------------- | ------------------------------------- |
| `-b, --build-only`         | Compile, do not install or run        |
| `-f, --force`              | Full rebuild                          |
| `-C, --device-id <id>`     | Which emulator, simulator or device   |
| `-D, --deploy-type <type>` | `development`, `test` or `production` |
| `--liveview`               | Reload the running app on save        |
| `-l, --log-level <level>`  | `trace` to `error`                    |
| `--skip-js-minify`         | Skip minification                     |
| `--source-maps`            | Inline source maps for transpiled JS  |

Signing options are per platform: `-K/--keystore`, `-P/--store-password`,
`-L/--alias` on Android; `-V/--developer-name`, `-R/--distribution-name`,
`-P/--pp-uuid` on iOS. See
[certificates and provisioning](https://titaniumsdk.com/docs/distribute/signing).

## ti create

```sh
ti create --type app --name Hello --id com.example.hello --platforms android,ios --workspace-dir .
```

`--type` is `app`, `module` or `applewatch`. With `--no-prompt`, **`--type` and
`--workspace-dir` have no usable default** and must both be passed.

`--alloy` runs `alloy new` on the project afterwards, which needs Alloy
installed. `--template` takes a template name, a directory, a zip or a URL.

`--platforms` accepts `android`, `ios` and `iphone`. `ios` targets iPhone and
iPad; `iphone` targets iPhone only.

## ti info

```sh
ti info
ti info -t android --json
```

`-t/--types` narrows to one area, and `--json` makes it machine-readable. This
is the first command to run when a build breaks for no visible reason.

## ti sdk

```sh
ti sdk list
ti sdk install 13.4.1.GA
ti sdk uninstall 13.3.0.GA
```

`install` with no version takes the newest stable. `-b/--branch` installs from
a CI branch.

## ti config

```sh
ti config                                   # print everything
ti config android.sdkPath /path/to/sdk      # set one
ti config paths.modules --append /path      # add to a list
ti config paths.modules --remove /path      # take one out
```

See [CLI configuration](https://titaniumsdk.com/docs/reference/config) for the keys.

## ti project

Reads and writes `tiapp.xml` without a text editor, which is what to use in a
release script:

```sh
ti project version 1.2.0
ti project --output json
```

## ti module

```sh
ti module list
```

`list` is the only subcommand. It reports project, configured-path and global
scopes, so it also answers which copy of a module a build will use.

## ti clean

```sh
ti clean
ti clean --platforms android
```

Removes `build/`. Worth doing when a failure does not match the source.

## ti setup

An interactive wizard. `ti setup check` is the useful non-interactive part, and
overlaps `ti info`.

## CLI configuration keys


The CLI stores its own settings, separately from any project. They live in
`~/.titanium/config.json`, and `ti config` is how to read and write them.

```sh
ti config                                  # everything
ti config cli.logLevel                     # one key
ti config cli.logLevel info                # set it
ti config cli.logLevel --remove            # back to the default
```

The path is printed by `ti config --help`, so a machine that keeps it elsewhere
will say so.

### Keys

### Paths

| Key              | What                                     |
| ---------------- | ---------------------------------------- |
| `paths.sdks`     | Extra directories to find SDKs in        |
| `paths.modules`  | Extra directories to find modules in     |
| `paths.plugins`  | Extra directories to find CLI plugins in |
| `paths.commands` | Extra CLI commands                       |
| `paths.hooks`    | Extra build hooks                        |

These take lists, so they have `--append` and `--remove`:

```sh
ti config paths.modules --append ~/shared/modules
```

A path added here applies to every project on the machine, which makes a build
depend on the machine. It is useful for a shared module cache and a liability
for anything a colleague needs too.

### Android

| Key                                  | What                                       |
| ------------------------------------ | ------------------------------------------ |
| `android.sdkPath`                    | Where the Android SDK is                   |
| `android.ndkPath`                    | Where the NDK is, if you build native code |
| `android.buildTools.selectedVersion` | Pin build tools when the newest is too new |

`android.sdkPath` is what `ti setup android` writes, and it is the answer to
"the build cannot find the Android SDK" - not an environment variable.
`ANDROID_HOME` is **not** read by the app build; the detection order is this
config key, then `ANDROID_SDK_ROOT`, then `ANDROID_SDK`, then `adb` on `PATH`.

### iOS

| Key                    | What                             |
| ---------------------- | -------------------------------- |
| `ios.developerName`    | Default development certificate  |
| `ios.distributionName` | Default distribution certificate |

Setting these saves passing `--developer-name` on every device build.

### CLI behaviour

| Key                      | Default | What                                  |
| ------------------------ | ------- | ------------------------------------- |
| `cli.logLevel`           | `trace` | Default verbosity                     |
| `cli.colors`             | `true`  | ANSI colour                           |
| `cli.progressBars`       | `true`  | Progress bars                         |
| `cli.prompt`             | `true`  | Ask for missing values                |
| `cli.width`              | `80`    | Wrap width                            |
| `cli.completion`         | `false` | Shell completion                      |
| `cli.httpProxyServer`    | empty   | Proxy for CLI requests                |
| `cli.rejectUnauthorized` | `true`  | Verify TLS on CLI requests            |
| `cli.ignoreDirs`         | a regex | Directories never copied into a build |
| `cli.ignoreFiles`        | a regex | Files never copied into a build       |

> [!WARNING]
> `cli.rejectUnauthorized false` disables certificate verification for
> everything the CLI fetches, including SDK downloads. If a corporate proxy is
> the reason, set `cli.httpProxyServer` instead and leave verification on.

`cli.ignoreDirs` and `cli.ignoreFiles` are why `.git` and `.DS_Store` do not end
up inside your app. Widen them to keep something else out; replacing them
wholesale is how a `.git` directory ships to the store.

### App

| Key             | What                               |
| --------------- | ---------------------------------- |
| `app.workspace` | Default directory for new projects |
| `user.name`     | Name used in generated files       |

## Per-run overrides

`--config` takes JSON and applies for that run only, which is the way to script
something without changing the machine:

```sh
ti build --platform android --config '{"cli":{"logLevel":"warn"}}'
```

`--config-file` points at a different file entirely, which is how CI can carry
its own settings without touching a developer's.

## What is not here

Anything about the app itself - id, name, version, permissions, modules - is in
`tiapp.xml`, not here. See [tiapp.xml](https://titaniumsdk.com/docs/reference/tiapp-xml). The rule is
that this file describes the machine and `tiapp.xml` describes the app, which
is also why this one is not in version control and that one is.

## Release scope

CLI commands and SDK build support are versioned separately. `ti serve` belongs to the Vite integration: check installed `ti serve --help` and the runtime's supported SDK versions before adopting it in a released 13.4.1 project. Do not infer SDK 14 GA from a command listed by a newer CLI. For API contracts use the project's versioned reference.
