---
title: prefer-object-has-own - Rules
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/rules/prefer-object-has-own.md
rule_type: suggestion
---
<!-- Note: No pull requests accepted for this file. See README.md in the root directory for details. -->

# Prefer `Object.hasOwn()` over `Object.prototype.hasOwnProperty.call()` (prefer-object-has-own)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

It is very common to write code like:

```js
if (Object.prototype.hasOwnProperty.call(object, "foo")) {
  console.log("has property foo");
}
```

This is a common practice because methods on `Object.prototype` can sometimes be unavailable or redefined (see the [no-prototype-builtins](no-prototype-builtins) rule).

Introduced in ES2022, `Object.hasOwn()` is a shorter alternative to `Object.prototype.hasOwnProperty.call()`:

```js
if (Object.hasOwn(object, "foo")) {
  console.log("has property foo")
}
```

## Rule Details

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-object-has-own: "error"*/

Object.prototype.hasOwnProperty.call(obj, "a");

Object.hasOwnProperty.call(obj, "a");

({}).hasOwnProperty.call(obj, "a");

const hasProperty = Object.prototype.hasOwnProperty.call(object, property);
```

Examples of **correct** code for this rule:

```js
/*eslint prefer-object-has-own: "error"*/

Object.hasOwn(obj, "a");

const hasProperty = Object.hasOwn(object, property);
```

## When Not To Use It

This rule should not be used unless ES2022 is supported in your codebase.

## Further Reading

* [Object.hasOwn()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)

## Version

This rule was introduced in ESLint 8.5.0.

## Resources

* [Rule source](https://github.com/eslint/eslint/tree/HEAD/lib/rules/prefer-object-has-own.js)
* [Test source](https://github.com/eslint/eslint/tree/HEAD/tests/lib/rules/prefer-object-has-own.js)
* [Documentation source](https://github.com/eslint/eslint/tree/HEAD/docs/rules/prefer-object-has-own.md)
