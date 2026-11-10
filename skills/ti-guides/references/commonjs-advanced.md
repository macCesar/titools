# Using modules


Two different things get added to a Titanium project and both are called
dependencies.

A **native module** wraps platform code the core SDK does not expose: Bluetooth,
maps, barcodes. It ships as a built binary per platform.

An **npm package** is JavaScript. If it runs without Node's built-ins and
without a browser, it will probably run here.

## Native modules

The [modules directory](https://titaniumsdk.com/modules) lists what TiDev maintains. Installing one is
three steps: unpack it, declare it, require it.

> [!NOTE]
> There is no install command yet. `ti module` has one subcommand, `list`, so
> unpacking is done by hand. `ti module install` and `ti module search` are
> planned; until they ship, this is the path.

Download the release archive for the module and unzip it into a `modules`
directory beside `tiapp.xml`. The archive already carries the right shape, so
unzipping it in place gives you:

```
modules/
  android/ti.map/5.7.0/
  iphone/ti.map/7.3.1/
```

That is `modules/<platform>/<id>/<version>/`, and the platform directory is
`android`, `iphone` or `commonjs` - `iphone` covers iPad and macOS too.

Check the CLI can see it:

```sh
ti module list
```

It reports three scopes - project, configured paths, and global - so the output
also tells you which copy a build will pick up.

Then declare it in `tiapp.xml`, per platform:

```xml
<modules>
  <module platform="android">ti.map</module>
  <module platform="iphone">ti.map</module>
</modules>
```

Both steps are needed. A module on disk that `tiapp.xml` does not name is not
built in, and the failure is a `require` that returns nothing rather than an
error at build time.

Then require it by id:

```js
const Map = require('ti.map');
```

Pin a version when more than one is unpacked and you care which one you get:

```xml
<module platform="android" version="5.7.0">ti.map</module>
```

Without a version the newest installed copy wins, which means a machine with
two versions in `modules/` and a colleague's machine with one can produce
different builds from the same commit.

> [!IMPORTANT]
> A module is native code, so it is built for specific platforms and against a
> range of SDK versions. A module that has not been rebuilt for a newer Titanium
> SDK may fail at build time with a linker error rather than anything that names
> the module. Check the module's own page for the versions it supports.

### Where modules live

`modules/<platform>/<moduleid>/<version>/` in the project, which is committed
like any other source. Some teams keep them out of version control and install
in CI instead; either works, as long as the whole team does the same thing.

Unpacking into the global directory instead makes the module available to every
project on that machine and to nobody else's, which makes a build depend on the
machine it runs on. Prefer the project-local copy. On macOS the global one is
`~/Library/Application Support/Titanium/modules`, and `ti module list` prints
the full path of everything it finds.

## npm packages

`package.json` in the project root, and `npm install` as normal:

```sh
npm install lodash
```

```js
const _ = require('lodash');
```

Titanium bundles what is in `node_modules` at build time. There is no
resolution at runtime, so a package pulled in dynamically by name computed at
runtime will not be there.

**Check runtime dependencies:** Titanium is not a full Node.js or browser runtime. Some Node-compatible shims (`fs`, `path`, `os`, `buffer`, `events`, `process`) exist in the released API; verify the exact supported subset. Packages requiring unavailable Node APIs such as `child_process`, a DOM or Node native bindings do not work unchanged. A package that only touches `Ti.*` and plain JavaScript is fine.
Check before adopting a large dependency; the failure arrives at runtime as an
undefined require.

Keep `node_modules` out of version control as you would anywhere else.

## Which one do I need

If it talks to hardware, the operating system, or a platform SDK, it is a
native module and somebody has to have written it. If it is an algorithm, a
parser, or a client for an HTTP API, it is probably an npm package.

If neither exists, writing a native module is covered under Extending Titanium.

## Next

[Debugging and profiling](https://titaniumsdk.com/docs/build/debugging) covers finding out why the
thing you just added is not working.

## Application CommonJS paths

Classic `Resources/myModule.js` and Alloy `app/lib/myModule.js` are required as `require('myModule')`; the Alloy source prefix `app/lib/` is not a runtime module prefix. Use literal native requires by ID and declare the module first. Check the selected SDK's versioned API for Node-compatible shims rather than assuming full Node behavior.
