# CommonJS advanced patterns

For more on CommonJS in Titanium, see the official CommonJS Modules guide in the Titanium SDK documentation.

## Definitions

- Module: any CommonJS-compliant module used in a Titanium SDK application. This can be a JavaScript file bundled with the app or a native extension that exposes a JavaScript API.
- Resources: the Resources directory of a Titanium application, where source code lives before the build system processes it. In Alloy, CommonJS modules live in `app/lib`.
- `exports`: a free variable within a module. Add properties to expose a public API.
- `module.exports`: an object you can replace to define the module's public API.

## 1. Stateful modules (singleton pattern)

Modules in Titanium are created once per JavaScript context and reused on subsequent `require()` calls. This makes them useful for shared state.

### Example: stateful counter module

```javascript
// app/lib/counter.js
let _count = 0

exports.increment = () => {
  _count++
}

exports.getCount = () => {
  return _count
}

exports.reset = () => {
  _count = 0
}
```

Usage: multiple controllers that require this module share the same `_count` state.

A module is created once per Titanium JavaScript context. Additional contexts create new module instances.

## 2. Native/compiled modules

When `require()` is called, Titanium checks for a native/compiled module before it looks for a JavaScript module. Native modules take priority.

Native modules are identified by a single string and configured in `tiapp.xml`:

```xml
<modules>
  <module version="1.0">ti.paypal</module>
</modules>
```

```javascript
const paypal = require('ti.paypal')
```

Titanium loads `ti.paypal` as a native module and will not look for a JavaScript file in Resources. If no native module matches, it falls back to JavaScript module resolution.

## 3. Module path resolution

The string passed to `require()` is treated as a path to a JavaScript file, without the `.js` extension.

Resolution rules:
- No prefix (`require('app/lib/myModule')`): resolved relative to the `Resources` directory (or `app/lib` in Alloy)
- `/` prefix (`require('/app/lib/myModule')`): also resolved relative to the `Resources` directory
- `./` or `../` prefix (`require('./widgets/SomeView')`): resolved relative to the current module file

Example with relative paths:

Given these files:
- `Resources/app/ui/SomeCustomView.js`
- `Resources/app/ui/widgets/SomeOtherCustomView.js`
- `Resources/app/lib/myModule.js`

Inside `SomeCustomView.js`:
```javascript
const myModule = require('../lib/myModule')
const SomeOtherCustomView = require('./widgets/SomeOtherCustomView')
```

The `.js` extension is omitted in `require()` calls.

## 4. Caching behavior

Titanium caches the object returned by `require()` and returns the same reference without re-evaluating the code.

If you need code evaluated multiple times, export a function that creates what you need instead.

```javascript
// Good: factory pattern
exports.createView = (args) => {
  return Ti.UI.createView(args)
}

// Bad: expecting re-evaluation
```

## 5. ES6+ support (SDK 7.1.0+)

Since Titanium SDK 7.1.0, you can use ES6+ module syntax. Code is transpiled to ES5 for all platforms.

```javascript
// MyClass.js
export default class MyClass {
  constructor(name) {
    this.name = name
  }

  greet() {
    return `Hello, ${this.name}`
  }
}

// Usage in controller
import MyClass from 'MyClass'
const instance = new MyClass('World')
```

## 6. Module composition patterns

### Exports object pattern

```javascript
exports.sayHello = (name) => {
  Ti.API.info(`Hello ${name}`)
}

exports.version = 1.4
```

### Constructor pattern (`module.exports`)

```javascript
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

module.exports = Person
```

### Utility library pattern

```javascript
// app/lib/logger.js
exports.info = (str) => {
  Ti.API.info(`${new Date()}: ${str}`)
}

exports.debug = (str) => {
  Ti.API.debug(`${new Date()}: ${str}`)
}
```

Usage:
```javascript
const logger = require('logger')
logger.info('some log statement with a timestamp')
```

## 7. Inter-module state sharing

When a module assigns a primitive value to `exports`, the consumer gets a copy, not a live reference. Changes to the internal variable are not reflected in the exported property.

```javascript
// app/lib/statefulModule.js
let _stepVal = 5

exports.setPointStep = (value) => {
  _stepVal = value
}

exports.getPointStep = () => {
  return _stepVal
}

exports.stepVal = _stepVal // This is a copy of _stepVal (value: 5)
```

```javascript
const stateful = require('statefulModule')
stateful.setPointStep(10)
Ti.API.info(stateful.getPointStep()) // 10 - correct, uses getter
Ti.API.info(stateful.stepVal)        // 5  - still the original copy
```

Rule: use getter/setter functions for stateful values. Direct property exports of primitives are snapshots at module load time.

## 8. Antipatterns to avoid

### Do not assign directly to `exports`

```javascript
// Wrong
function Person() {}
exports = Person

// Correct
module.exports = Person
```

### Do not mix `module.exports` and `exports.*`

```javascript
// Discouraged
module.exports = Person
exports.foo = 'bar'

// Use one consistently
```

### Avoid globals across modules

Any data a module needs should be passed during construction or initialization. Avoid globals shared across modules.

## 9. Security and scope

All modules have private scope. Variables declared within the module are private unless added to `exports`.

```javascript
const _privateVar = 'secret' // Not accessible outside

exports.publicMethod = () => {
  // Can access _privateVar
  return _privateVar
}
```

## 10. Node.js compatibility

Titanium supports Node.js module patterns and `require()` resolution. Node.js modules can often be used directly.

For details, refer to the official Titanium Node.js guide.
