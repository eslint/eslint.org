---
layout: post
title: "Differences between linting and type checking"
teaser: "Linters such as ESLint and type checkers such as TypeScript catch different areas of code defects — and are best used in conjunction with each other."
authors:
  - joshuakgoldberg
categories:
  - Storytime
tags:
  - Linting
---

If you're a JavaScript developer today, you're probably using ESLint and/or TypeScript to assist development.
Those two tools are common examples of their kind of tooling: ESLint is a common *linter*, whereas TypeScript is a common *type checker*.

Linters and type checkers are two kinds of tools that both analyze code and report on detected issues.
They may seem similar at first.
They both fall under the category of *static analysis*.
However, the two kinds of tools detect very different issues and are useful in different ways.

## What is static analysis?

Static analysis is the inspection of source code without executing it.
This differs from *dynamic analysis*, in which source code is inspected while it is executed.
As such, dynamic analysis brings with it the inherent danger of executing malicious code or creating side effects while static analysis is safe to execute regardless of the source code.

Static analysis can be immensely helpful for improving code readability, reliability, and overall quality.
Many developers rely on static analysis to enforce consistent code formatting and style, to ensure code is well-documented, and to catch likely bugs.
Because static analysis runs on source code, it can suggest improvements in editors, as code is written.

We'll focus in this blog post on ESLint and TypeScript:

* **ESLint**: executes individually configurable checks known as "lint rules"
* **TypeScript**: collects all files into a full understanding of the project

ESLint and TypeScript use some of the same forms of analysis to detect defects in code.
They both analyze how scopes and variables are created and used in code, and can catch issues such as referencing a variable that doesn't exist.
We'll explore the different ways the two use information from analyzing your code.

## Digging deeper into linting vs. type checking

Type checkers make sure the *intent* behind values in code matches the *usage* of those values.
They check that code is "type-safe": values are used according to how their types are described as being allowed.

For example, TypeScript would report a type error on the following `logUppercase(9001)` call, because `logUppercase` is declared as receiving a `string` rather than a `number`:

```ts
function logUppercase(text: string) {
    console.log(text.toUpperCase());
}

logUppercase(9001);
//           ~~~~
// Argument of type 'number' is not assignable to parameter of type 'string'.
```

Compiled languages such as Java and Rust perform type checking as part of their compilation step.
Because JavaScript is an interpreted language, TypeScript is run separately.

TypeScript generally does not attempt to look for defects that are only likely to occur.
It generally only looks for uses of code that are certainly wrong.

Nor does the type checking in TypeScript enforce subjective opinions that might change between projects.
TypeScript won't detect likely mistakes that work within those types.

Linters, on the other hand, primarily target likely defects and can also be used to enforce subjective opinions.
ESLint and other linters catch issues that may or may not be type-safe but are potential sources of bugs.
Many developers rely on linters to make sure their code follows framework and language best practices.

For example, developers sometimes leave out the `break` or `return` at the end of a `switch` statement's `case`.
Doing so is type-safe and permitted by JavaScript and TypeScript.
In practice, this is almost always a mistake that allows the next `case` statement to run accidentally.
ESLint's [`no-fallthrough`](https://eslint.org/docs/latest/rules/no-fallthrough) can catch that likely mistake:

```ts
function logFruit(value: "apple" | "banana" | "cherry") {
    switch (value) {
        case "apple":
            console.log("🍏");
            break;

        case "banana":
            console.log("🍌");

        // eslint(no-fallthrough):
        // Expected a 'break' statement before 'case'.

        case "cherry":
            console.log("🍒");
            break;
    }
}

// Logs:
// 🍌
// 🍒
logFruit("banana");
```

Another way of looking at the differences between ESLint and TypeScript is that TypeScript enforces what you *can* do, whereas ESLint enforces what you *should* do.

### Granular Extensibility

Another difference between ESLint and TypeScript is how flexibly their areas of responsibility can be configured.

TypeScript is configured by a set list of compiler options on a project level.
Its [`tsconfig.json` ("TSConfig") files](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) allow for compiler options that change type checking for all files in the project.
Those compiler options are set by TypeScript and generally change large swathes of type checking behavior.

ESLint, on the other hand, runs with a configurable set of lint rules.
Each lint rule can be granularly configured.
If you don't like a particular lint rule, you can always turn it off for a line, set of files, or your entire project.

ESLint can also be augmented by **plugins** that add new lint rules.
Plugin-specific lint rules extend the breadth of code checks that ESLint configurations can pick and choose from.

For example, this ESLint configuration enables the recommended rules from [`eslint-plugin-jsx-a11y`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y), a plugin that adds checks for accessibility in projects using JSX libraries such as Solid.js and React:

```js title="eslint.config.js"
import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y"

export default [
    js.configs.recommended,
    jsxA11y.flatConfigs.recommended,
    // ...
];
```

A project using the JSX accessibility rules would then be told if their code violates common accessibility guidelines.
For example, rendering a native `<img>` tag without descriptive text would receive a report from [`jsx-a11y/alt-text`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/alt-text.md):

```tsx
const MyComponent = () => <img src="source.webp" />;
//                        ~~~~~~~~~~~~~~~~~~~~~~~~~
// eslint(jsx-a11y/alt-text):
// img elements must have an alt prop, either with meaningful text, or an empty string for decorative images.
```

By adding in rules from plugins, ESLint configurations can be tailored to the specific best practices and common issues to the frameworks a project is built with.

### Areas of Overlap

ESLint and TypeScript operate differently and specialize in different areas of code defects.
Some code defects straddle the line between "best practices" and "type safety", and so can be caught by both linting and type checking.
Those defects can often be caught by both ESLint and TypeScript.

To make the most of both tools, we recommend:

* In your ESLint configuration file, use the [ESLint `js.configs.recommended` config](https://eslint.org/docs/latest/use/getting-started#configuration), at least the [`tseslint.configs.recommended` configuration from typescript-eslint](https://typescript-eslint.io/getting-started/typed-linting), and any community plugins relevant to your project's libraries and frameworks
* In your TypeScript configuration file, enable [`strict` mode](https://www.typescriptlang.org/tsconfig/#strict) to catch as many type safety issues as possible

typescript-eslint's recommended preset configs disable core ESLint rules that are not helpful with TypeScript.
The configs leave on any core ESLint rules that are useful alongside type checking.

#### Unused Locals and Parameters

The only TypeScript compiler options we recommend keeping off when using linting are those that enable checking for unused variables:

* [`noUnusedLocals`](https://www.typescriptlang.org/tsconfig/#noUnusedLocals): which reports on unused declared local variables
* [`noUnusedParameters`](https://www.typescriptlang.org/tsconfig/#noUnusedParameters): which reports on unused function parameters

Those compiler options are useful when not using a linter.
However, they aren't configurable the way lint rules are, and so can't be configured to higher or lower strictness levels per a project's preferences.
The compiler options are hardcoded to always ignore any variable whose name begins with `_`.

As an example, the following `registerCallback` function declares two parameters for its callbacks -`id` and `message`- but the developer using it only needed `message`.
TypeScript's `noUnusedParameters` compiler option would not flag the unused parameter `_`:

```ts
type Callback = (id: string, message: string) => void;

declare function registerCallback(callback: Callback): void;

// We only want to log message, not id
registerCallback((_, message) => console.log(message));
```

Unused variables in JavaScript can also be caught by ESLint's [`no-unused-vars`](https://eslint.org/docs/latest/rules/no-unused-vars) rule; when in TypeScript code, the [`@typescript-eslint/no-unused-vars`](https://typescript-eslint.io/rules/no-unused-vars) is preferred instead.
The lint rules by default also ignore variables whose name begins with `_`.
They additionally ignore parameters that come before any parameter that is itself used.

Some projects prefer to never allow unused parameters regardless of name or position.
These stricter preferences help prevent API designs that lead developers to create many unused parameters.

A more strict ESLint configuration would be able to report on the `_` parameter:

```ts
/* eslint @typescript-eslint/no-unused-vars: ["error", { "args": "all", "argsIgnorePattern": "" }] */

type Callback = (id: string, message: string) => void;

declare function registerCallback(callback: Callback): void;

// We only want to log message, not id
registerCallback((_, message) => console.log(message));
//                ~
// eslint(@typescript-eslint/no-unused-vars):
// '_' is declared but never used.
```

That extra level of configurability provided by the `no-unused-vars` rules can allow them to act as more granularly configurable versions of their equivalent TypeScript compiler options.

> 💡 See [`no-unused-binary-expressions`: From code review nit to ecosystem improvements](/blog/2024/10/code-review-nit-to-ecosystem-improvements) for more areas of code checking with partial overlap between linting and type checking.

## Is a ESLint Still Useful With TypeScript?

**Yes.**

If you are using TypeScript, it is still very useful to use ESLint.
In fact, ESLint and TypeScript are at their most powerful when used in conjunction with each other.

### ESLint, With Type Information

Traditional lint rules run on a single file at a time and have no knowledge of other files in the project.
They can't make decisions on files based on the contents of other files.

However, if your project is set up using TypeScript, you can opt into "type checked" lint rules: rules that can pull in type information.
In doing so, type checked lint rules can make decisions based on other files.

For example, [`@typescript-eslint/no-for-in-array`](https://typescript-eslint.io/rules/no-for-in-array) is able to detect `for...in` loops over values that are array types, even if the values come from other files.
TypeScript would not report a type error for a `for...in` loop over an array because doing so is technically type-safe and might be what a developer intended.
A linter, however, could be configured to notice that the developer probably made a mistake and meant to use a `for...of` loop instead:

```ts
// declare function getArrayOfNames(): string[];
import { getArrayOfNames } from "./my-names";

for (const name in getArrayOfNames()) {
    // eslint(@typescript-eslint/no-for-in-array):
    // For-in loops over arrays skips holes, returns indices as strings,
    // and may visit the prototype chain or other enumerable properties.
    // Use a more robust iteration method such as for-of or array.forEach instead.
    console.log(name);
}
```

Augmenting ESLint with information from TypeScript makes for a more powerful set of lint rules.
See [Typed Linting: The Most Powerful TypeScript Linting Ever](https://typescript-eslint.io/blog/typed-linting) for more details on typed linting with typescript-eslint.

### TypeScript, With Linting

TypeScript adds extra complexity to JavaScript.
That complexity is often worth it, but any added complexity brings with it the potential for misuse.
Linters are useful for stopping developers from making TypeScript-specific blunders in code.

For example, TypeScript's `{}` ("empty object") type is often misused by developers new to TypeScript.
It visually looks like it should mean any `object`, but actually means any non-`null`, non-`undefined` value --- including primitives such as `number`s and `string`s.
[`@typescript-eslint/no-empty-object-type`](https://typescript-eslint.io/rules/no-empty-object-type) catches uses of the `{}` type that likely meant `object` or `unknown` instead:

```ts
export function logObjectEntries(value: {}) {
    //                                  ~~
    // eslint(@typescript-eslint/no-empty-object-type):
    // The `{}` ("empty object") type allows any non-nullish value, including literals like `0` and `""`.
    // - If that's what you want, disable this lint rule with an inline comment or configure the 'allowObjectTypes' rule option.
    // - If you want a type meaning "any object", you probably want `object` instead.
    // - If you want a type meaning "any value", you probably want `unknown` instead.
    console.log(Object.entries(value));
}

logObjectEntries(0); // No type error!
```

Enforcing language-specific best practices with ESLint helps developers learn about and correctly use TypeScript.

## Conclusion

Linters such as ESLint and type checkers such as TypeScript are both valuable assets for developers.
The two catch different areas of code defects and come with different philosophies around configurability and extensibility.

* TypeScripts checks that code is "type-safe": enforcing what you *can* write
* ESLint checks that code adheres to best practices and is consistent: enforcing what you *should* write

Put together, the two tools help projects write code with fewer bugs and more consistency.
We recommend that any project that uses TypeScript additionally uses ESLint.