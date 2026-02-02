# CLI Expert Strategies & TiNy

Mastering the command line is essential for a Titanium expert. This guide covers advanced workflows, optimization techniques, and the use of **TiNy (`tn`)** for efficient development.

## The Expert Workflow

An expert doesn't just run `ti build`. They optimize for speed, reliability, and automation.

### 1. The "Inner Loop" Optimization
Reduce the time between writing code and seeing it on the device.

- **LiveView**: Use `--liveview` for near-instant UI updates without full recompilation.
  ```bash
  ti build -p ios --liveview
  ```
- **Build Only**: Use `-b` to verify Alloy compilation and JavaScript syntax without launching the simulator.
  ```bash
  ti build -p ios -b
  ```
- **Skip Minification**: In development, always skip minification to speed up the build process.
  ```bash
  ti build -p ios --skip-js-minify
  ```

### 2. Precise Cleaning
Don't use `ti clean` as a first resort (it's slow).
- **Targeted Clean**: If Alloy isn't reflecting changes, try deleting `Resources/` and `build/` manually or use `ti clean -p <platform>`.
- **Pre-Production**: Always run a full `ti clean` before a production/App Store build to ensure no stale assets are included.

### 3. Advanced Debugging
- **Trace Logging**: Use `--log-level trace` when a build fails for mysterious reasons (e.g., a broken hook or native module issue).
- **Build Logs**: Check `build/build.log` for the full output of the last build process.

---

## TiNy (`tn`): The Expert's Power Tool

**TiNy** is a modern CLI wrapper for Titanium SDK that drastically reduces keystrokes and manages complex build configurations through "recipes".

### Why Experts Use TiNy
- **Speed**: `tn ios` vs `ti build -p ios -T simulator`.
- **Consistency**: Recipes ensure every team member builds with the same flags.
- **Device Management**: Easily target specific simulators/emulators by name.

### Quick Start
1. **Install**: `npm install -g tn`
2. **Repo**: https://github.com/jasonkneen/tn
3. **Generate Recipes**: Detect all connected devices/simulators.
   ```bash
   tn generate
   ```
4. **Build**:
   ```bash
   tn iphone-16-pro
   tn pixel-8-pro-api-34
   ```

### Expert Recipes
Recipes can be flags or options. Multiple recipes can be combined.

| Command        | Expansion                           |
| -------------- | ----------------------------------- |
| `tn ios`       | `--platform ios`                    |
| `tn android`   | `--platform android`                |
| `tn appstore`  | `--ios --target dist-appstore`      |
| `tn playstore` | `--android --target dist-playstore` |
| `tn watch`     | `--ios --launch-watch-app`          |

### Customizing Your Workflow
- **Save Global Recipe**:
  ```bash
  tn save my-debug --ios --simulator --log-level trace --skip-js-minify
  ```
- **Project-Specific Recipes**: Save a `tn.json` in your project root for team-wide recipes (e.g., specific provisioning profiles).
  ```bash
  tn project save release --playstore --keystore ./android/release.keystore
  ```

### Composition & Placeholders
You can use `%s` as a placeholder in recipes for values:
```bash
tn save ci -b --pp-uuid <UUID> --distribution-name "<NAME>" --ah --installr --installr-release-notes %s

# Usage:
tn ci "Fixed login bug"
```

---

## Automation Integration

Experts automate their builds using `package.json` scripts, often combining `ti` or `tn` with other tools.

```json
"scripts": {
  "start": "tn ios --liveview",
  "build:android": "tn android",
  "clean": "ti clean",
  "prod:ios": "tn appstore --distribution-name 'My Company'",
  "lint": "eslint app/"
}
```

---

## Pro-Tips
- **SDK Switching**: Use `-s <version>` to test your app against a specific SDK version without changing your global default.
- **Sim Focus**: Use `--no-sim-focus` if you want to keep your editor in focus while the simulator launches in the background.
- **Concurrent Builds**: You can often build for iOS and Android simultaneously in different terminal tabs if your machine has the resources.
