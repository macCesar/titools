# Webpack build pipeline

Webpack integration is an alternative build pipeline starting with Titanium SDK 9.1.0. It is optional. When enabled, Webpack manages asset and code bundling.

## 1. Key benefits
- Fast incremental builds: only changed files are processed.
- npm support: install packages in the root and import them directly.
- Build-time resolution: `require` calls are resolved during compilation, not at runtime.

## 2. The `@` alias
Webpack adds the `@` alias to reference the source root without deep relative paths.

| Project type | Path mapped by `@` |
| :----------- | :----------------- |
| Alloy        | `app/lib`          |
| Classic      | `src`              |

Usage example:

```javascript
// Before (without webpack)
import Utils from '../../utils/helper';

// Now (with webpack)
import Utils from '@/utils/helper';
```

## 3. npm dependency management
Install a package in the project root:

```bash
npm install lodash
```

Use it in Titanium code:

```javascript
import _ from 'lodash';
const data = _.chunk(['a', 'b', 'c', 'd'], 2);
```

## 4. Platform-specific files
Webpack detects platform-specific files using the `filename.<platform>.js` pattern.

Example:
- `utils.js` (common)
- `utils.ios.js` (iOS only)
- `utils.android.js` (Android only)

When you `import { func } from '@/utils'`, Webpack picks the correct version for the build target.

## 5. Diagnostic web UI
Webpack includes a web interface to analyze builds and asset sizes.
Default URL: `http://localhost:1732/webpack/latest/web`

## 6. Project plugins
Webpack support is powered by plugins chosen based on project type:

| Plugin                             | Purpose                 |
| ---------------------------------- | ----------------------- |
| `@appcd/webpack-plugin-alloy`      | Alloy project support   |
| `@appcd/webpack-plugin-classic`    | Classic project support |
| `@appcd/webpack-plugin-babel`      | Babel transpilation     |
| `@appcd/webpack-plugin-typescript` | TypeScript support      |

### Custom plugin configuration
Customize with the `webpack-chain` API in `webpack.config.js`:

```javascript
module.exports = (api) => {
  // Add a custom alias
  api.chainWebpack((config) => {
    config.resolve.alias.set('@utils', api.resolve('app/lib/utils'));
  });
};
```

Common customizations:
- Add alias: `config.resolve.alias.set(name, path)`
- Add loader: `config.module.rule(name).use(name).loader(loader)`
- Delete plugin: `config.plugins.delete(name)`

## 7. Advanced configuration
Extend configuration via plugins in `package.json`:

```json
{
  "appcdWebpackPlugins": [
    "my-local-plugin.js"
  ]
}
```

## 8. Global configuration
Configure Webpack daemon settings in `~/.appcelerator/appcd/config.json`:

```json
{
  "webpack": {
    "inactivityTimeout": 600000
  }
}
```

## 9. Troubleshooting

Build seems stuck: the Webpack daemon may need a restart.

```bash
appcd exec /webpack/latest/stop
```

View build logs:

```bash
appcd logcat "*webpack*"
```

## 10. Known limitations
- Hyperloop is not compatible with the Webpack pipeline.
- Alloy.jmk build hooks are not supported. Use Webpack plugins instead.
- The first build may be slower due to daemon startup.
