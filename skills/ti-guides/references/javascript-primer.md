# JavaScript Development Primer

Essential JavaScript concepts, resources, and best practices for Titanium development.

1. [JavaScript Overview](#javascript-overview)
2. [Learning Resources](#learning-resources)
3. [Best Practices](#best-practices)
4. [Common Patterns](#common-patterns)

---

## JavaScript Overview

JavaScript is the language of Titanium. It's a powerful, lightweight, dynamic object-oriented programming language.

**Why JavaScript for Titanium?**
- One of the most widely deployed languages (every web browser)
- Large community of developers
- Dynamic typing with duck typing
- Functional programming support
- Convenient object literal notation
- Closures for encapsulation
- Small learning curve

**JavaScript in Titanium:**
- No DOM manipulation (that's web-specific)
- Access to native APIs via Titanium namespace
- ECMAScript 5/6 compliant
- Same JavaScript you use in web, but targeting mobile apps

---

## Learning Resources

### Online Courses

- **[Codecademy](https://www.codecademy.com/learn/introduction-to-javascript)** - Interactive JavaScript tutorials
- **[Stanford CS101](http://www.stanford.edu/class/cs101/)** - Uses JavaScript, lecture notes and projects available
- **[edX](https://www.edx.org/learn/javascript)** - Free courses from top universities

### Online Books & References

- **[Eloquent JavaScript](https://eloquentjavascript.net/)** - Excellent learning resource (free online, or buy the book)
- **[MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)** - Comprehensive JavaScript documentation
- **[Douglas Crockford's Resources](http://javascript.crockford.com/)** - From the creator of JSON and JSLint
- **[JavaScript in 10 Minutes](https://github.com/spencertipping/js-in-ten-minutes)** - Dense advanced guide
- **[Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)** - Code style guidelines
- **[Learning Advanced JavaScript](http://ejohn.org/apps/learn/)** - By John Resig (jQuery creator)

### Print Books (Recommended)

- **JavaScript: The Good Parts** (Douglas Crockford) - ESSENTIAL
- **JavaScript: The Definitive Guide** (David Flanagan) - Complete reference
- **JavaScript Patterns** (Stoyan Stefanov) - Design patterns
- **Eloquent JavaScript** (Marijn Haverbeke) - Also available free online

---

## Best Practices

### Don't Pollute the Global Scope

**BAD:** Everything in global scope
```javascript
const key = 'value';
const foo = 'bar';

function helper() {
    // help out
}

function info(msg) {
    helper(msg);
    Ti.API.info(msg);
}
```

**GOOD:** Single namespace
```javascript
const myapp = {};  // Only ONE global variable

myapp.key = 'value';

myapp.dosomething = (foo) => {
    // do something
};

// Self-closing function for private members
(() => {
    function helper() {
        // Private - not accessible globally
    }

    myapp.info = (msg) => {
        helper(msg);
        Ti.API.info(msg);
    };
})();

myapp.info('Hello World');
```

### Use Strict Equality

**BAD:** `==` converts types
```javascript
const testme = '1';
if (testme == 1) {
    // Executes! '1' is converted to integer
}
```

**GOOD:** `===` checks both type and value
```javascript
const testme = '1';
if (testme === 1) {
    // Does NOT execute
}
```

### Efficient Loops

**BAD:** Checks array.length every iteration
```javascript
const names = ['Jeff', 'Nolan', 'Marshall', 'Don'];
for (let i = 0; i < names.length; i++) {
    process(names[i]);
}
```

**GOOD:** Cache length
```javascript
const names = ['Jeff', 'Nolan', 'Marshall', 'Don'];
for (let i = 0, j = names.length; i < j; i++) {
    process(names[i]);
}
```

This is especially important when working with Titanium proxy objects (representing native OS structures), where checking length on each iteration has additional overhead.

**Even better:** ES6 `for...of`
```javascript
for (const name of names) {
    process(name);
}
```

### Use var/let/const Correctly

```javascript
// ES5: Use var (function-scoped)
var x = 10;

// ES6+: Use let and const (block-scoped)
let y = 20;        // Can be reassigned
const z = 30;       // Cannot be reassigned
```

---

## Common Patterns

### Ternary Operator

Compact conditional assignment. Value after `?` is assigned if the condition is true; value after `:` if false.

```javascript
// Instead of this:
let xyz;
if (somecondition === somevalue) {
    xyz = 'abc';
} else {
    xyz = '123';
}

// Use this:
const xyz = (somecondition === somevalue) ? 'abc' : '123';
```

### Multiple Variable Declarations

Use commas instead of multiple `var` statements:

```javascript
// Instead of this:
const foo = true;
const me = 'awesome';
const great = 42;

// Use this:
const foo = true,
    me = 'awesome',
    great = 42;
```

### Self-Calling Functions (IIFE)

Encapsulate private variables and functions:

**Ambiguous (not recommended):**
```javascript
const myValue = (() => {
    return someValue;
})();  // Looks like assigning function, not result
```

**Clear (recommended):**
```javascript
const myValue = (() => {
    // Private variables here
    const privateVar = 'secret';

    return someValue;
})();  // Clearly returns result, not function
```

### CommonJS Modules

Use `require()` for modular code:

**myModule.js:**
```javascript
// Private
const privateData = 'secret';

function privateHelper() {
    // Private function
}

// Public API
exports.publicMethod = () => {
    privateHelper();
    return privateData;
};
```

**app.js:**
```javascript
const myModule = require('myModule');
myModule.publicMethod();
```

---

## ES6+ Features in Titanium

Titanium supports modern JavaScript (ES6/ES7+). Use these features:

**Arrow Functions:**
```javascript
// Old
const self = this;
someArray.forEach(function(item) {
    self.process(item);
});

// New (arrow function preserves 'this')
someArray.forEach((item) => {
    this.process(item);
});
```

**Template Literals:**
```javascript
// Old
const message = 'Hello ' + name + ', you have ' + count + ' messages';

// New
const message = `Hello ${name}, you have ${count} messages`;
```

**Destructuring:**
```javascript
// Old
const width = e.source.size.width;
const height = e.source.size.height;

// New
const {width, height} = e.source.size;
```

**Spread Operator:**
```javascript
// Old
const arr = [1, 2, 3];
const arr2 = arr.concat([4, 5]);

// New
var arr2 = [...arr, 4, 5];
```

**Classes:**
```javascript
class Person {
    constructor(name) {
        this.name = name;
    }

    greet() {
        return `Hello, I'm ${this.name}`;
    }
}
```

---

## Gotchas to Avoid

### Variable Hoisting

**Problem:** Variables are hoisted to function scope
```javascript
function test() {
    console.log(myVar);  // undefined (not error!)
    var myVar = 'value';
}
```

**Solution:** Declare variables at top of function
```javascript
function test() {
    let myVar;  // Declare first
    console.log(myVar);
    myVar = 'value';
}
```

### Global Variable Accidents

**Problem:** Forgetting `var` creates global variable
```javascript
function test() {
    myVar = 'value';  // Creates GLOBAL variable!
}
```

**Solution:** Always use `var`, `let`, or `const`
```javascript
function test() {
    const myVar = 'value';  // Local variable
}
```

### The `this` Context

**Problem:** `this` changes in different contexts
```javascript
const obj = {
    value: 42,
    getValue: function() {
        setTimeout(function() {
            console.log(this.value);  // undefined!
        }, 100);
    }
};
```

**Solution 1:** Store `this`
```javascript
const obj = {
    value: 42,
    getValue: function() {
        const self = this;
        setTimeout(function() {
            console.log(self.value);  // Works!
        }, 100);
    }
};
```

**Solution 2:** Arrow function (ES6)
```javascript
const obj = {
    value: 42,
    getValue() {
        setTimeout(() => {
            console.log(this.value);  // Works!
        }, 100);
    }
};
```

### Semicolon Insertion

JavaScript automatically inserts semicolons, but can cause bugs:

**Dangerous:**
```javascript
return
{
    name: 'Test'
};
// Returns undefined!
```

**Safe:**
```javascript
return {
    name: 'Test'
};
// Or put opening brace on same line
return { name: 'Test' };
```

---

## Resources

- **Alloy Framework:** See `alloy-guides` skill
- **CommonJS Modules:** See `commonjs-advanced.md`
- **Coding Best Practices:** See `coding-best-practices.md`
- **Style Guide:** See `style-and-conventions.md`
