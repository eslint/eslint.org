---
layout: post
title: Introducing ESLint Compatibility Utilities
teaser: "Do you rely on a plugin that doesn't yet work with ESLint v9? This package will help."
tags:
  - Compatibility
  - Tools
authors:
  - nzakas
categories:
  - Announcements
---

The release of ESLint v9.0.0 brought with it the rollout of the [new configuration system](/blog/2023/10/flat-config-rollout-plans/), but also a series of changes to the [rules API](/blog/2023/09/preparing-custom-rules-eslint-v9/). These changes are necessary in order to prepare ESLint for implementing [language plugins](https://github.com/eslint/rfcs/blob/main/designs/2022-languages/README.md), which will give ESLint the ability to natively lint languages other than JavaScript. As a result, plugin authors needed to update their rules to work with v9.0.0, and unfortunately, that means some of the plugins you rely on may not have been updated yet. That's why we're releasing the compatibility utilities.

## How to know if the compatibility utilities will help

These utilities may help if you encounter any of the following errors while running ESLint:

```shell
TypeError: context.getScope is not a function
TypeError: context.getAncestors is not a function
TypeError: context.markVariableAsUsed is not a function
TypeError: context.getDeclaredVariables is not a function
```

These errors mean that the plugin rules have not been updated to the latest ESLint rule API.

## Using the compatibility utilities

First, install the [`@eslint/compat`](https://npmjs.com/package/@eslint/compat) package using npm or any npm-compatible CLI:

```shell
npm install @eslint/compat -D
# or
yarn add @eslint/compat -D
# or
pnpm install @eslint/compat -D
# or
bun install @eslint/compat -D
```

Then, use the `fixupPluginRules()` function in your `eslint.config.js` file to wrap the plugin in a compatibility layer:

```js
// eslint.config.js
import { fixupPluginRules } from "@eslint/compat";
import example from "eslint-plugin-example";

export default [
    {
        plugins: {
            example: fixupPluginRules(example)
        }
    },

    // other config
];
```

After that, the plugin should work as expected.

## Fixing an imported configuration

If you are importing a flat-style configuration from another package that references plugins, you can use the `fixupConfigRules()` function to wrap all of the plugins found, like this:

```js
// eslint.config.js
import { fixupConfigRules } from "@eslint/compat";
import recommended from "eslint-plugin-example/configs/recommended.js";

export default [

    ...fixupConfigRules(recommended)

    // other config
];
```

The `fixupConfigRules()` function accepts both a single object and an array of objects to easily update any configuration you're using.

## Using with `FlatCompat`

If you are using `FlatCompat` from the [`@eslint/eslintrc`](https://npmjs.com/package/@eslint/eslintrc) package, you may not be able to access each of the plugins that are referenced inside of an eslintrc-style configuration. In that case, you can use the `fixupConfigRules()` function to wrap all plugins, as in this example:

```js
// eslint.config.js
import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";

const flatCompat = new FlatCompat();

export default [

    ...fixupConfigRules(
        flatCompat.extends("my-config")
    )

    // other config
];
```

While this example shows how to use `fixupConfigRules()` with the `extends()` method, any method on `FlatCompat` works.

## Conclusion

One of the benefits of the new configuration system is that it allows us the ability to patch plugins and configs that haven't yet been updated by their maintainers. We know it can be frustrating to migrate to ESLint v9.0.0 and have your configuration not work, and that's why we're committed to providing packages like `@eslint/eslintrc` and `@eslint/compat` to help aid the transition.
