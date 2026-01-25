# CommonJS Advanced Patterns

## 1. Stateful Modules (Singleton Pattern)

Modules in Titanium are created once per JavaScript context and then passed by reference on subsequent `require()` calls. This makes them ideal for maintaining application state.

### Example: Stateful Counter Module
```javascript
// app/lib/counter.js
var _count = 0

exports.increment = function() {
  _count++
}

exports.getCount = function() {
  return _count
}

exports.reset = function() {
  _count = 0
}
```

**Usage**: Multiple controllers requiring this module share the same `_count` state.

### Critical Note
A module is created once **per Titanium JavaScript context**. Additional contexts create new module instances.

## 2. Caching Behavior

Titanium caches the object returned by `require()` and provides the same reference without re-evaluating the code.

**Implication**: If you think you need code evaluated multiple times, create a module with a callable function instead.

```javascript
// Good - factory pattern
exports.createView = function(args) {
  return Ti.UI.createView(args)
}

// Bad - expecting re-evaluation
```

## 3. ES6+ Support (SDK 7.1.0+)

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

## 4. Module Composition Patterns

### Exports Object Pattern
```javascript
exports.sayHello = function(name) {
  Ti.API.info('Hello ' + name)
}

exports.version = 1.4
```

### Constructor Pattern (module.exports)
```javascript
function Person(firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}

Person.prototype.fullName = function() {
  return this.firstName + ' ' + this.lastName
}

module.exports = Person
```

## 5. Antipatterns to Avoid

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

## 6. Security and Scope

All modules have private scope. Variables declared within the module are private unless added to `exports`.

```javascript
var _privateVar = 'secret' // Not accessible outside

exports.publicMethod = function() {
  // Can access _privateVar
  return _privateVar
}
```

## 7. Node.js Compatibility

Titanium supports Node.js module patterns and `require()` resolution. Node.js modules can often be used directly.

For detailed Node.js support information, refer to the official Titanium Node.js guide.
