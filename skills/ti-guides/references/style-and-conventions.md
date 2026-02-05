# Style and conventions reference

## 1. Naming conventions

- Variables: `nounCategory` (for example, `personName`, `buttonSubmit`).
- Functions: `verbCategory` (for example, `getPersonName`, `doSync`).
- Classes/constructors: `PascalCase` (for example, `User`, `NetClient`).
- Factories: prefix with `create` (for example, `createWidget`).
- Namespaces: use capitalized words (for example, `App.UI.Widget`, `App.Network.Request`). Avoid lowercase for major namespaces (use `App.UI`, not `app.ui`).
- Hungarian notation: not supported by the Titanium SDK.

## 2. Language rules

- Semicolons: official SDK guides require semicolons, but the `ti-expert` standard omits them and lets ASI handle it.
- `this` keyword: use with care. It may not refer to the object you expect.

## 3. Formatting

- Indentation: both K&R/1TBS and Allman styles are acceptable. Consistency matters. Do not mix styles in the same project.
```javascript
// K&R/1TBS style
if (x < 10) {
  if (y > 10) {
    // do this
  }
} else {
  // do this
}
```
```javascript
// Allman style
if (x < 10)
{
  if (y > 10)
  {
    // do this
  }
}
else
{
  // do this
}
```
- Operators: add a single space around operators.
```javascript
const fullName = firstName + ' ' + lastName
```

Return statement placement:
Do not put `return` on its own line followed by an object literal. JavaScript will insert a semicolon automatically and return `undefined`.
```javascript
// Wrong
return
{
  foo: 'bar'
}

// Correct
return {
  foo: 'bar'
}
```

## 4. Control statements

Switch statements should have a single space before the opening parenthesis and a single space after the closing parenthesis. Switch content is indented with one tab; content in each case is indented one tab as well.
```javascript
switch (someTest) {
    case 1:
        break;

    case 2:
        break;

    default:
        break;
}
```

## 5. Primitive types

- Avoid using primitive type object constructors (for example, `new String()`).
- Use template literals or single-space concatenation.

## 6. Comments and documentation

- Single-line comments: required to reduce programmer error. Inline statement comments should be used at a minimum or not at all.
- JSDoc/block comments: required for documenting functions and classes.
```javascript
// Calculate position using initial
// and offset x coordinates.
const finalPos = initPosX + offsetPosX;

/**
 * @param {String} customerName Customer's full name.
 */
function getCustomer(customerName) {}
```

## 7. References

- Douglas Crockford's JavaScript Code Conventions
- Google's JavaScript Style Guide: https://google.github.io/styleguide/jsguide.html
