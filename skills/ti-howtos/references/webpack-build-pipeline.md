# Webpack Build Pipeline

Webpack integration is available as an **alternative build pipeline** starting with Titanium SDK 9.1.0. It is not mandatory — projects work without it. When enabled, Webpack manages your project's assets and code bundling.

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

## 6. Project Plugins
Webpack support is powered by plugins that handle different project types. Plugins are automatically selected based on your project:

| Plugin                             | Purpose                 |
| ---------------------------------- | ----------------------- |
| `@appcd/webpack-plugin-alloy`      | Alloy project support   |
| `@appcd/webpack-plugin-classic`    | Classic project support |
| `@appcd/webpack-plugin-babel`      | Babel transpilation     |
| `@appcd/webpack-plugin-typescript` | TypeScript support      |

### Custom Plugin Configuration
Plugins can be customized using the `webpack-chain` API in your project's `webpack.config.js`:

```javascript
module.exports = (api) => {
    // Add a custom alias
    api.chainWebpack((config) => {
        config.resolve.alias.set('@utils', api.resolve('app/lib/utils'));
    });
};
```

Common customizations:
- **Add alias**: `config.resolve.alias.set(name, path)`
- **Add loader**: `config.module.rule(name).use(name).loader(loader)`
- **Delete plugin**: `config.plugins.delete(name)`

## 7. Advanced Configuration
You can extend the configuration via plugins in `package.json`:
```json
{
  "appcdWebpackPlugins": [
    "my-local-plugin.js"
  ]
}
```

## 8. Global Configuration
Configure Webpack daemon settings in `~/.appcelerator/appcd/config.json`:
```json
{
    "webpack": {
        "inactivityTimeout": 600000
    }
}
```

## 9. Troubleshooting

**Build seems stuck**: The Webpack daemon may need a restart:
```bash
appcd exec /webpack/latest/stop
```

**View build logs**:
```bash
appcd logcat "*webpack*"
```

## 10. Known Limitations
- **Hyperloop**: Currently not compatible with the Webpack pipeline.
- **Alloy.jmk**: Build hooks are not supported — use Webpack plugins instead.
- First build may be slower due to daemon startup.
