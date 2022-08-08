---
layout: post
title: Interesting bugs caught by no-constant-binary-expression 
teaser: "A new rule that catches a surprisingly wide variety of logic bugs."
authors:
  - captbaritone
categories:
  - Case Studies
tags:
  - Guest Post
  - Rules
---

In [ESLint v8.14.0](https://eslint.org/blog/2022/04/eslint-v8.14.0-released) I contributed a new core rule called [no-constant-binary-expression](https://eslint.org/docs/rules/no-constant-binary-expression) which has surprised me with the wide variety of subtle and interesting bugs it has been able to detect.

In this post I’ll explain what the rule does and share some examples of real bugs it has detected in popular open source projects such as Material UI, Webpack, VS Code, and Firefox as well as a few interesting bugs that it found internally at Meta. I hope these examples will convince you to try enabling the rule in the projects you work on!

## What does `no-constant-binary-expression` do?

The rule checks for comparisons (`==`, `!==`, etc) where the outcome cannot vary at runtime, and logical expressions (`&&`, `??`, `||`) which will either _always_ or _never_ short-circuit.

For example:

* `+x == null` will always be false, because `+` will coerce `x` into a number, and a number is never nullish.
* `{ ...foo } || DEFAULT` will never return `DEFAULT` because objects are always truthy.

Both of these are examples of expressions that _look_ like they can affect the way the program evaluates, but in reality, do not.

This rule originally started as just an attempt to detect unnecessary null checks. However, as I worked on it, I realized useless null checks were just a special case of a broader category: useless code. Eventually it clicked for me: developers don't intend to write useless code, and code that does not match the developer's intent is by definition a bug. Therefore, any useless code you can detect is a bug.

This realization was confirmed for me when I ran the first version of the rule against our code base at Meta, and it detected a wide variety of subtle and interesting bugs which had made it through code review.

## Real world bugs found with `no-constant-binary-expressions`

In this section I’ll share a number of types of bugs that this rule can catch. Each includes at least one concrete example detected in a popular open source project. My choice to include real examples here is not to shame anyone or any project, but to drive home the fact that these are errors that any team can easily make.

### Confusing operator precedence

The most common class of bug the rule finds is places where developers misunderstood the precedence of operators, particularly unary operators like `!`, `+` and `typeof`.

```javascript
if (!whitelist.has(specifier.imported.name) == null) {
  return;
}
```

_From [Material UI](https://github.com/mui/material-ui/blob/60f02a7a6b48092eedd2c25b15a7f643168a001f/packages/mui-codemod/src/v5.0.0/top-level-imports.js#L73:L73) (also: VS Code [1](https://github.com/captbaritone/vscode/blob/ab86e0229d6b4d0cb49cfd6747c92cafcd2bd4af/src/vs/workbench/contrib/timeline/browser/timelinePane.ts#L64), [2](https://github.com/captbaritone/vscode/blob/ab86e0229d6b4d0cb49cfd6747c92cafcd2bd4af/src/vs/workbench/contrib/terminal/browser/terminalProfileResolverService.ts#L456:L456), [Webpack](https://github.com/webpack/webpack/blob/3ad4fcac25a976277f2d9cceb37bc81602e96b13/lib/ExportsInfo.js#L468:L468), [Mozilla](https://phabricator.services.mozilla.com/D145655))_

### Confusing `??` and `||` precedence

When trying to define default values, people get confused with expressions like `a === b ?? c` and assume it will be parsed as `a === (b ?? c)`. When in actuality it will be parsed as `(a === b) ?? c`.

```javascript
shouldShowWelcome() {
  return this.viewModel?.welcomeExperience === WelcomeExperience.ForWorkspace ?? true;
}
```

_From [VS Code](https://github.com/captbaritone/vscode/blob/ab86e0229d6b4d0cb49cfd6747c92cafcd2bd4af/src/vs/workbench/contrib/testing/browser/testingExplorerView.ts#L118:L118)_

_Aside: Observing how frequently developers get confused by operator precedence inspired me to experiment with [a VS Code extension](https://jordaneldredge.com/blog/a-vs-code-extension-to-combat-js-precedence-confusion/) to visually clarify how precedence gets interpreted._

### Expecting objects to be compared by value

Developers coming from other languages where structures are compared by value, rather than by reference, can easily fall into the trap of thinking they can do things like test if an object is empty by comparing with a newly created empty object. Or course in JavaScript, objects are compared by reference, and no value can ever be equal to a newly constructed object literal.

In this example, `hasData` will always be set to true because `data` can never be referentially equal to a newly created object.

```javascript
hasData = hasData || data !== {};
```

_From [Firefox](https://hg.mozilla.org/try/rev/0fe5678fb8b71f4eb26f0a153c52d0be45fc5ac1#l3.34) (also: [Firefox](https://hg.mozilla.org/try/rev/0fe5678fb8b71f4eb26f0a153c52d0be45fc5ac1#l1.13))_

### Expecting empty objects to be `false` or `null`

Another common categrory of JavaScript error is expecting empty objects to be nullish or falsy. This is likely an easy mistake to make for folks coming from a language like Python where empty lists and dictionaries are falsy.

```javascript
const newConfigValue = { ...configProfiles } ?? {};
```

_From [VS Code](https://github.com/captbaritone/vscode/blob/ab86e0229d6b4d0cb49cfd6747c92cafcd2bd4af/src/vs/workbench/contrib/terminal/browser/terminalProfileQuickpick.ts#L126:L126) (also: VS Code [1](https://github.com/captbaritone/vscode/blob/ab86e0229d6b4d0cb49cfd6747c92cafcd2bd4af/src/vs/platform/terminal/node/ptyService.ts#L369:L369), [2](https://github.com/captbaritone/vscode/blob/ab86e0229d6b4d0cb49cfd6747c92cafcd2bd4af/src/vs/workbench/contrib/terminal/browser/terminalProfileResolverService.ts#L484:L484))_

### Is it `>=` or `=>`?

I’ve only seen this particular typo once, but I wanted to include it because it’s a great example of the unexpected types of bugs this rule can catch.

Here, the developer meant to test if a value was greater than or equal to zero (`>= 0`), but accidentally reversed the order of the characters and created an arrow function that returned `0 && startWidth <= 1`!

```javascript
assert(startWidth => 0 && startWidth <= 1);
```

_From [Mozilla](https://phabricator.services.mozilla.com/rMOZILLACENTRAL925b8d1ad45f80faee052492b3b43f5120052405)_

### Other errors caught by `no-constant-binary-expression`

The above five categories of errors are not exhaustive. When I originally ran the first version of this rule on our (very) large monorepo at Meta, it found over 500 issues. While many fell into the categories outlined above, there was also a long-tail of other interesting bugs. Some highlights include:

* Thinking `||` allows for set operations: `states.includes('VALID' || 'IN_PROGRESS')`
* Thinking primitive functions pass through nulls: `Number(x) == null`
* Not knowing primitive [constructors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/Number) return boxed primitives: `new Number(x) === 10`

I never would have set out to lint for these specific issues individually, but by simply trying to identify anything “useless” we were able to find and correct them.

## Conclusion

As you've now seen `no-constant-binary-expression` is capable of detecting a variety of different types of bugs. The rule accomplishes this not because it's programmed to look for those specific issues, but because all those bugs have one thing in common: they manifest as useless code. Because developers generally don't intend to write useless code, detecting useless code generally results in detecting bugs.

If you’ve found these examples compelling, please consider enabling [no-constant-binary-expression](https://eslint.org/docs/rules/no-constant-binary-expression) in your ESLint config:

```javascript
// eslintrc
module.exports = {
  rules: {
    // Requires eslint >= v8.14.0
    "no-constant-binary-expression": "error"
  }
}
```

If you do, and it finds bugs, I’d love to [hear about them](https://twitter.com/captbaritone)!

*Thanks to [Brad Zacher](https://twitter.com/bradzacher) for the original observation which inspired this work and the suggestion to propose it as a new core rule. And thanks to [Milos Djermanovic](https://github.com/mdjermanovic) for significant contributions during code review.*
