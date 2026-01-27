# Webpack Build Pipeline

Starting with Titanium SDK 9.1.0, Webpack is the default build engine for managing your project's assets and code.

## Table of Contents

- [Webpack Build Pipeline](#webpack-build-pipeline)
  - [Table of Contents](#table-of-contents)
  - [1. Key Benefits](#1-key-benefits)
  - [2. The `@` Alias](#2-the--alias)
  - [3. NPM Dependency Management](#3-npm-dependency-management)
  - [4. Platform-Specific Files](#4-platform-specific-files)
  - [5. Diagnostic Web UI](#5-diagnostic-web-ui)
  - [6. Advanced Configuration](#6-advanced-configuration)
  - [7. Known Limitations](#7-known-limitations)

---

## 1. Key Benefits
- **Lightning-Fast Incremental Builds**: Only what changes is processed.
- **Native NPM Support**: Install any NPM library in the root and use it directly.
- **Build-Time Resolution**: `require` calls are resolved during compilation, not at runtime.

## 2. The `@` Alias
Webpack introduces the `@` alias to reference the source code root without using complex relative paths (`../../`).

| Project Type | Path mapped by `@` |
| :----------- | :----------------- |
| **Alloy**    | `app/lib`          |
| **Classic**  | `src`              |

**Usage Example:**
```javascript
// Before (without webpack)
import Utils from '../../utils/helper';

// Now (with webpack)
import Utils from '@/utils/helper';
```

## 3. NPM Dependency Management
Simply install your favorite package in the project root:
```bash
npm install lodash
```
And use it in your Titanium code:
```javascript
import _ from 'lodash';
const data = _.chunk(['a', 'b', 'c', 'd'], 2);
```

## 4. Platform-Specific Files
Webpack automatically detects platform-specific files using the `filename.<platform>.js` pattern.

**Example:**
- `utils.js` (common)
- `utils.ios.js` (iOS only)
- `utils.android.js` (Android only)

When doing `import { func } from '@/utils'`, Webpack will select the correct version based on the build target.

## 5. Diagnostic Web UI
Webpack includes a web interface to analyze the build and asset sizes.
Default URL: `http://localhost:1732/webpack/latest/web`

## 6. Advanced Configuration
You can extend the configuration via plugins in `package.json`:
```json
{
  "appcdWebpackPlugins": [
    "my-local-plugin.js"
  ]
}
```

## 7. Known Limitations
- **Hyperloop**: Currently not compatible with the Webpack pipeline.
- **Alloy.jmk**: Older makefiles are ignored by Webpack.
