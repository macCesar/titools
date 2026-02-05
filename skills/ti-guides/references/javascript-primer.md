# JavaScript development primer

Essential JavaScript concepts, resources, and best practices for Titanium development.

## JavaScript overview

JavaScript is the language of Titanium. It is lightweight and dynamic, with object-oriented and functional features.

Why JavaScript for Titanium?
- Widely deployed (every web browser)
- Large community
- Dynamic typing with duck typing
- Functional programming support
- Convenient object literal notation
- Closures for encapsulation
- Small learning curve

JavaScript in Titanium:
- No DOM manipulation (that is web-specific)
- Access to native APIs via the Titanium namespace
- ECMAScript 5/6 compliant
- Same JavaScript you use on the web, but targeting mobile apps

---

## Learning resources

### Online courses

- Codecademy: https://www.codecademy.com/learn/introduction-to-javascript
- Stanford CS101: http://www.stanford.edu/class/cs101/
- edX: https://www.edx.org/learn/javascript

### Online books and references

- Eloquent JavaScript: https://eloquentjavascript.net/
- MDN JavaScript Guide: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- Douglas Crockford's resources: http://javascript.crockford.com/
- JavaScript in 10 Minutes: https://github.com/spencertipping/js-in-ten-minutes
- Google JavaScript Style Guide: https://google.github.io/styleguide/jsguide.html
- Learning Advanced JavaScript: http://ejohn.org/apps/learn/

### Print books (recommended)

- JavaScript: The Good Parts (Douglas Crockford)
- JavaScript: The Definitive Guide (David Flanagan)
- JavaScript Patterns (Stoyan Stefanov)
- Eloquent JavaScript (Marijn Haverbeke)

---

## Best practices

### Do not pollute the global scope

Bad: everything in global scope
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

Good: single namespace
```javascript
const myapp = {};  // Only one global variable

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

### Use strict equality

Bad: `==` converts types
```javascript
const testme = '1';
if (testme == 1) {
    // Executes! '1' is converted to integer
}
```

Good: `===` checks both type and value
```javascript
const testme = '1';
if (testme === 1) {
    // Does NOT execute
}
```

### Efficient loops

Bad: checks `array.length` every iteration
```javascript
const names = ['Jeff', 'Nolan', 'Marshall', 'Don'];
for (let i = 0; i < names.length; i++) {
    process(names[i]);
}
```

Good: cache length
```javascript
const names = ['Jeff', 'Nolan', 'Marshall', 'Don'];
for (let i = 0, j = names.length; i < j; i++) {
    process(names[i]);
}
```

This is especially important with Titanium proxy objects, where checking length on each iteration has extra overhead.

Even better: ES6 `for...of`
```javascript
for (const name of names) {
    process(name);
}
```

### Use var/let/const correctly

```javascript
// ES5: use var (function-scoped)
var x = 10;

// ES6+: use let and const (block-scoped)
let y = 20;        // Can be reassigned
const z = 30;       // Cannot be reassigned
```

---

## Common patterns

### Ternary operator

Compact conditional assignment. Value after `?` is used if the condition is true; value after `:` if false.

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

### Multiple variable declarations

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

### Self-calling functions (IIFE)

Encapsulate private variables and functions:

Ambiguous (not recommended):
```javascript
const myValue = (() => {
    return someValue;
})();  // Looks like assigning function, not result
```

Clear (recommended):
```javascript
const myValue = (() => {
    // Private variables here
    const privateVar = 'secret';

    return someValue;
})();  // Clearly returns result, not function
```

### CommonJS modules

Use `require()` for modular code:

myModule.js:
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

app.js:
```javascript
const myModule = require('myModule');
myModule.publicMethod();
```

---

## ES6+ features in Titanium

Titanium supports modern JavaScript (ES6/ES7+). Use these features.

Arrow functions:
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

Template literals:
```javascript
// Old
const message = 'Hello ' + name + ', you have ' + count + ' messages';

// New
const message = `Hello ${name}, you have ${count} messages`;
```

Destructuring:
```javascript
// Old
const width = e.source.size.width;
const height = e.source.size.height;

// New
const {width, height} = e.source.size;
```

Spread operator:
```javascript
// Old
const arr = [1, 2, 3];
const arr2 = arr.concat([4, 5]);

// New
const arr2 = [...arr, 4, 5];
```

Classes:
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

## Gotchas to avoid

### Variable hoisting

Problem: variables are hoisted to function scope.
```javascript
function test() {
    console.log(myVar);  // undefined (not error)
    var myVar = 'value';
}
```

Solution: declare variables at the top of the function.
```javascript
function test() {
    let myVar;  // Declare first
    console.log(myVar);
    myVar = 'value';
}
```

### Global variable accidents

Problem: forgetting `var` creates a global variable.
```javascript
function test() {
    myVar = 'value';  // Creates a global variable
}
```

Solution: always use `var`, `let`, or `const`.
```javascript
function test() {
    const myVar = 'value';
}
```

### The `this` context

Problem: `this` changes in different contexts.
```javascript
const obj = {
    value: 42,
    getValue: function() {
        setTimeout(function() {
            console.log(this.value);  // undefined
        }, 100);
    }
};
```

Solution 1: store `this`.
```javascript
const obj = {
    value: 42,
    getValue: function() {
        const self = this;
        setTimeout(function() {
            console.log(self.value);  // Works
        }, 100);
    }
};
```

Solution 2: arrow function (ES6).
```javascript
const obj = {
    value: 42,
    getValue() {
        setTimeout(() => {
            console.log(this.value);  // Works
        }, 100);
    }
};
```

### Semicolon insertion

JavaScript automatically inserts semicolons and can cause bugs.

Dangerous:
```javascript
return
{
    name: 'Test'
};
// Returns undefined
```

Safe:
```javascript
return {
    name: 'Test'
};
```
