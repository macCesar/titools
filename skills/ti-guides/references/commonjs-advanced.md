# CommonJS Advanced Patterns

> For more on CommonJS in Titanium, see the official CommonJS Modules guide in the Titanium SDK documentation.

## Definitions

- **Module** - Any CommonJS-compliant module consumed in a Titanium SDK application. This can be a JavaScript file included with the app, or a native extension to Titanium which exposes a JavaScript API.
- **Resources** - The Resources directory of a Titanium application, where user source code lives before processing by the build system. **Note**: For Alloy, CommonJS modules are placed in `app/lib`.
- **`exports`** - A free variable within a module, to which multiple properties may be added to create a public interface.
- **`module.exports`** - An object within a module, which may be REPLACED by an object representing the public interface to the module.

## 1. Stateful Modules (Singleton Pattern)

Modules in Titanium are created once per JavaScript context and then passed by reference on subsequent `require()` calls. This makes them ideal for maintaining application state.

### Example: Stateful Counter Module
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

**Usage**: Multiple controllers requiring this module share the same `_count` state.

### Critical Note
A module is created once **per Titanium JavaScript context**. Additional contexts create new module instances.

## 2. Native/Compiled Modules

When `require()` is called, Titanium first checks for a native/compiled module before looking for a JavaScript module. Native modules take priority.

Native modules are identified by a single string and configured in `tiapp.xml`:

```xml
<modules>
  <module version="1.0">ti.paypal</module>
</modules>
```

```javascript
const paypal = require('ti.paypal')
```

Titanium loads `ti.paypal` as a native module and will NOT look for a JavaScript file in Resources. Only if no native module matches does Titanium fall back to JavaScript module resolution.

## 3. Module Path Resolution

The string passed to `require()` is treated as a path to a JavaScript file, minus the `.js` extension.

**Resolution rules:**
- **No prefix** (`require('app/lib/myModule')`) - resolved relative to the `Resources` directory (or `app/lib` in Alloy)
- **`/` prefix** (`require('/app/lib/myModule')`) - also resolved relative to the `Resources` directory
- **`./` or `../` prefix** (`require('./widgets/SomeView')`) - resolved relative to the current module file

**Example with relative paths:**

Given these files:
- `Resources/app/ui/SomeCustomView.js`
- `Resources/app/ui/widgets/SomeOtherCustomView.js`
- `Resources/app/lib/myModule.js`

Inside `SomeCustomView.js`:
```javascript
const myModule = require('../lib/myModule')
const SomeOtherCustomView = require('./widgets/SomeOtherCustomView')
```

The `.js` extension is always omitted in `require()` calls.

## 4. Caching Behavior

Titanium caches the object returned by `require()` and provides the same reference without re-evaluating the code.

**Implication**: If you think you need code evaluated multiple times, create a module with a callable function instead.

```javascript
// Good - factory pattern
exports.createView = (args) => {
  return Ti.UI.createView(args)
}

// Bad - expecting re-evaluation
```

## 5. ES6+ Support (SDK 7.1.0+)

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

## 6. Module Composition Patterns

### Exports Object Pattern
```javascript
exports.sayHello = (name) => {
  Ti.API.info(`Hello ${name}`)
}

exports.version = 1.4
```

### Constructor Pattern (module.exports)
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

### Utility Library Pattern
```javascript
// app/lib/logger.js
exports.info = (str) => {
  Ti.API.info(`${new Date()}: ${str}`)
}

exports.debug = (str) => {
  Ti.API.debug(`${new Date()}: ${str}`)
}
```

**Usage:**
```javascript
const logger = require('logger')
logger.info('some log statement with a timestamp')
```

## 7. Inter-Module State Sharing

When a module assigns a primitive value to `exports`, the consumer gets a **copy**, not a live reference. Subsequent changes to the internal variable are NOT reflected in the exported property.

```javascript
// app/lib/statefulModule.js
let _stepVal = 5

exports.setPointStep = (value) => {
  _stepVal = value
}

exports.getPointStep = () => {
  return _stepVal
}

exports.stepVal = _stepVal // This is a COPY of _stepVal (value: 5)
```

```javascript
const stateful = require('statefulModule')
stateful.setPointStep(10)
Ti.API.info(stateful.getPointStep()) // 10 - correct, uses getter
Ti.API.info(stateful.stepVal)        // 5  - still the original copy!
```

**Rule**: Always use getter/setter functions for stateful values. Direct property exports of primitives are snapshots at module load time.

## 8. Antipatterns to Avoid

### Don't Assign Directly to exports
```javascript
// ❌ WRONG - won't work
function Person() {}
exports = Person

// ✅ CORRECT
module.exports = Person
```

### Don't Mix module.exports and exports.*
```javascript
// ❌ DISCOURAGED
module.exports = Person
exports.foo = 'bar'

// ✅ Use one consistently
```

### No Global Variables Across Modules
Any data a module needs must be passed during construction or initialization. Never rely on globals shared across modules.

## 9. Security and Scope

All modules have private scope. Variables declared within the module are private unless added to `exports`.

```javascript
const _privateVar = 'secret' // Not accessible outside

exports.publicMethod = () => {
  // Can access _privateVar
  return _privateVar
}
```

## 10. Node.js Compatibility

Titanium supports Node.js module patterns and `require()` resolution. Node.js modules can often be used directly.

For detailed Node.js support information, refer to the official Titanium Node.js guide.
