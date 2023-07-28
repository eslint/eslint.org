---
layout: post
title: "ESLint's new config system, Part 3: Developer preview"
teaser: "While the new config system isn't yet incorporated into the CLI, it is available via API for developers to test."
tags:
  - Configuration
  - Command Line
authors:
  - nzakas
categories:
  - API Changes
---

In my [previous post](https://eslint.org/blog/2022/08/new-config-system-part-2/), I explained the fundamental concepts of using the new "flat" config system. The new config system isn't yet tied into the CLI while we do more internal testing, but we did want to give the ESLint community a chance to experiment with flat config while we work on incorporating it into the CLI. So ESLint v8.21.0 incorporates several ways to try out flat config as we work on it. Please keep in mind that everything mentioned in this post is experimental and we would love your feedback as you try it out.

## Using flat config with the `Linter` class

If you are currently using `Linter` from the `eslint` package, you can enable flat config by setting `configType: "flat"` as an option on the constructor. Here's an example:

```js
const linter = new Linter({ configType: "flat" });

const messages = linter.verify("new Map()", {
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    },
    rules: {
        "no-undef": "error"
    }
}, "filename.js");
```

When you pass `configType: "flat"` as an option, `Linter` expects that any configuration objects that are passed to `verify()` will be in flat config format. In this example, the second argument to `verify()` is a flat config object (you can pass either a single object or an array of objects). Any call to `verify()` will assume that the text being linted is a JavaScript file whose filename ends with `.js`, but it's always a good idea to pass in an explicit filename as the third argument.

While this base case works the same regardless of which config system you're using, there are some important differences:

* `defineRule()`, `defineRules()`, and `defineParser()` now throw errors. Runtime plugins (discussed in my previous post) make these methods obsolete.
* `getRules()` also throws an error. This method would return different data depending on when it was called, so it can't be used with flat config.

## Using flat config with the `ESLint` class

While implementing flat config we discovered that it would be too difficult to create an option to switch between config systems like we did for `Linter`. Instead, we created a `FlatESLint` class that encapsulates all of the existing functionality in `ESLint` but uses flat config instead of eslintrc. The `FlatESLint` class is intended only as a preview of functionality; once we switch over to flat config permanently, the current `ESLint` class will be deleted and `FlatESLint` will be renamed to `ESLint`.

For now, you can access `FlatESLint` through the `use-at-your-own-risk` entrypoint, like this:

```js
// ESM
import pkg from "eslint/use-at-your-own-risk";
const { FlatESLint } = pkg;

// CommonJS
const { FlatESLint } = require("eslint/use-at-your-own-risk");
```

After that, you can use `FlatESLint` in the same way as `ESLint`, such as:

```js
const eslint = new FlatESLint({
    cwd: originalDir,
    overrideConfigFile: "other.config.js"
});
const results = await eslint.lintText("foo");
```

As with `Linter`, there are a few differences between `FlatESLint` and `ESLint` worth pointing out:

1. Caching is not yet implemented in `FlatESLint`, so `cache: true` throws an error.
1. The `useEslintrc` option has been removed. If you want to avoid automatic loading of `eslint.config.js` without specifying an alternate config file, set `overrideConfigFile: true`.
1. The `envs` option has been removed.
1. The `resolvePluginsRelativeTo` option has been removed.
1. The `rulePaths` option has been removed. Custom rules must be added directly by config.

## Testing rules with flat config and the `RuleTester` class

Similar to the `ESLint` class, there was no easy way to provide an option to switch between eslintrc and flat config, so we created a separate `FlatRuleTester` class. Also similar to `ESLint`, the `FlatRuleTester` class is temporary and will eventually be renamed `RuleTester` once we have switched completely over to flat config. You can access `FlatRuleTester` like this:

```js
// ESM
import pkg from "eslint/use-at-your-own-risk";
const { FlatRuleTester } = pkg;

// CommonJS
const { FlatRuleTester } = require("eslint/use-at-your-own-risk");
```

Any place where you could specify an eslintrc config in `RuleTester` needs to be a flat config in `FlatRuleTester`. Here are some examples:

```js
const ruleTester = new FlatRuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});

ruleTester.setDefaultConfig({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});
```

In individual tests, you can use `languageOptions` directly in each test:

```js
ruleTester.run("my-rule", rule, {
    valid: [
        {
            code: "var test = 'foo'",
            languageOptions: {
                sourceType: "script"
            }
        },
        {
            code: "var test2 = 'bar'",
            languageOptions: {
                globals: { test: true }
            }
        }
    ],
    invalid: [
        {
            code: "bar",
            languageOptions: {
                sourceType: "script"
            },
            errors: 1
        }
    ]
});
```

Some things to keep in mind when using `FlatRuleTester`:

1. The default `ecmaVersion` is now `"latest"`, so if you aren't specifying `ecmaVersion` in your tests, there may be an incompatibility because eslintrc's default `ecmaVersion` was `5`.
1. The default `sourceType` is now `"module"`, so if you aren't specifying `sourceType` in your tests, there may be an incompatibility because eslintrc's default `sourceType` was `"script"`. This shows up mostly when dealing with variables in the global scope.

## Conclusion

We think that the new config system will be a great experience for ESLint users, but in order for that to happen, we have to make sure that the ESLint ecosystem is ready for these changes. That's why we've put together this developer preview to let all of our plugin, custom rule, parser, and shareable config authors get an early look at how their packages will work in the new config system. This is your opportunity to give us your feedback and help work through any incompatibilities or problems with flat config.

Please try out flat config with your packages and let us know how it goes by [starting a discussion](https://github.com/eslint/eslint/discussions/new) or stopping by the [Discord #developers channel](https://eslint.org/chat/developers) if you have questions or [opening an issue](https://github.com/eslint/eslint/issues/new) if you discover a problem.

We appreciate your help and feedback!
