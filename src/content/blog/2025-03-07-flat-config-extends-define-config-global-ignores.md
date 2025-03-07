---
layout: post
title: Evolving flat config with extends
teaser: "Your eslint.config.js files can now use extends to simplify your configuration."
tags:
  - Configuration
  - Flat Config
  - extends
authors:
  - nzakas
categories:
  - Announcements
---

When [ESLint v9.0.0 was released](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/) in April 2024, we enabled the new configuration system by default. We knew that there would be a period of challenges as the ecosystem switched over. In the ensuing months, we reviewed feedback and released [compatibility utilities](/blog/2024/05/eslint-compatibility-utilities/) and the [configuration migrator](/blog/2024/05/eslint-configuration-migrator/) to help ease some of the transitional pain. Slowly, we started to see people migrating to the new configuration system and so we waited for more feedback. We weren't sure at that point whether the complaints were more related to the transition or to the configuration system format itself.

Towards the end of 2024, we were consistently hearing the same three pieces of feedback:

1. Use with TypeScript was clunky
2. It was difficult and frustrating to extend other configurations
3. Global ignores are confusing

With these three pieces of feedback in mind, we went back to the drawing board to see how we could evolve the new configuration system.

## Introducing `defineConfig()` for ESLint

One of our recent projects was to bundle type definitions with the `eslint` package. We started with the types from `@types/eslint` for maximum compatibility and then evolved the types from there. We also enabled [`eslint.config.ts` files](https://eslint.org/docs/latest/use/configure/configuration-files#typescript-configuration-files) by default to allow type-safe configuration files. The question still remained: how can we easily allow users to apply the correct types to their configurations? The answer was to do what other tools like [Rollup](https://rollupjs.org/command-line-interface/#config-intellisense), [Astro](https://docs.astro.build/en/guides/configuring-astro/#the-astro-config-file), [Vite](https://vite.dev/config/#config-intellisense), [Nuxt](https://nuxt.com/docs/getting-started/configuration) did: create a `defineConfig()` function.

The `defineConfig()` function is exported for the `eslint/config` entrypoint and can be used like this:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["src/**/*.js"],
        rules: {
            semi: "error"
        }
    }
]);
```

You get type safety through the type definitions for `defineConfig()`, making it easier to ensure the correctness of your configuration using TypeScript.

The `defineConfig()` function also automatically flattens all of its arguments, meaning you can nest objects and arrays:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig(
    {
        files: ["src/**/*.js"],
        rules: {
            semi: "error"
        }
    },
    [
        {
            files: ["tests/**/*.js"],
            languageOptions: {
                globals: {
                    it: true,
                    describe: true
                }
            }
        },
        {
            files: ["bin/*.js"],
            rules: {
                "no-console": "off"
            }
        }
    ]
);
```

This flattening behavior is designed to eliminate some of the confusion we heard around the use of the spread operator (`...`) with the new configuration system. With `defineConfig()`, you never need to use the spread operator (unless you really want to!).

## Bringing back `extends`

The original theory of flat config was that `extends` was just an abstraction over a one-dimensional array of configuration objects, and was therefore not needed if we gave people access to that one-dimensional array. While many enjoyed the freedom to mix and match configurations using JavaScript, it turned out to that a lot of users also found extending other configurations frustrating. One pointed criticism is that they never how to extend another configuration because some were objects, some were arrays, and not all plugins exposed their flat configs the same way. Here's an example:

```js
import js from "@eslint/js";
import tailwind from "eslint-plugin-tailwindcss";
import reactPlugin from "eslint-plugin-react";
import eslintPluginImportX from "eslint-plugin-import-x";

export default [
    js.configs.recommended,
    ...tailwind.configs["flat/recommended"],
    ...reactPlugin.configs.flat.recommended,
    eslintPluginImportX.flatConfigs.recommended,
];
```

In this example, we have four different ways to access and merge configs from other plugins. While we had given a lot of power to ESLint users, it also left a wild west in the ecosystem where plugins were all doing different things.

This problem was amplified when trying to apply a configuration to just a subset of files. Doing so required a lot of extra syntax that wasn't always clear:

```js
// eslint.config.js
import exampleConfigs from "eslint-config-example";

export default [

    // apply an array config to a subset of files
    ...exampleConfigs.map(config => ({
        ...config,
        files: ["**/src/safe/*.js"]
    })),

    // your modifications
    {
        rules: {
            "no-unused-vars": "warn"
        }
    }
];
```

This approach was difficult for JavaScript beginners to understand and frustrating for experienced developers who had to figure out how to apply this technique to large configuration files.

Ultimately, we realized that the best way to solve this set of problems was to reintroduce `extends`. The `defineConfig()` function allows you to specify an `extends` array in any object, and that array can contain objects, arrays, or strings (for plugin configs that follow the [recommended approach](https://eslint.org/docs/latest/extend/plugins#configs-in-plugins)). This allows you to rewrite your configuration file in a more consistent way:

```js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tailwind from "eslint-plugin-tailwindcss";
import reactPlugin from "eslint-plugin-react";
import eslintPluginImportX from "eslint-plugin-import-x";
import exampleConfigs from "eslint-config-example";

export default defineConfig(
    {
        files: ["**/*.js"],
        plugins: {
            js,
            tailwind
        },
        extends: [
            "js/recommended",  // load from js.configs.recommended
            "tailwind/flat/recommended", // load from tailwind.configs['flat/recommended']
            reactPlugin.configs.flat.recommended,
            eslintPluginImportX.flatConfigs.recommended,
        ]
    },

    // apply an array config to a subset of files
    {
        files: ["**/src/safe/*.js"]
        extends: [exampleConfigs]
    },

    // your modifications
    {
        rules: {
            "no-unused-vars": "warn"
        }
    }
);
```

This approach allows you to worry less about whether a configuration you want to extend is an object or an array, and also makes it clearer which configurations apply to which files.

## Introducing the `globalIgnores()` helper

Another piece of feedback we received is that the behavior of the `ignores` key is confusing. In some cases it acts as a global ignores (like an ignore file -- completely ignoring everything it matches) while other times it acts like "excludes". Here are some examples:

```js
export default [

    // global ignores
    {
        ignores: ["dist", "build"]
    },

    // local ignores - match everything BUT tests/*.js
    {
        ignores: ["tests/*.js"],
        rules: {
            "no-console": "error"
        }
    }
];
```

When `ignores` is in an object by itself, then it acts as global ignores; when there is something else in the object, then it acts as local ignores. It proved to be difficult to make changes to this behavior without breaking a lot of existing configurations, so we opted to add a new `globalIgnores()` helper function to make the behavior explicit:

```js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([

    // global ignores
    globalIgnores(["dist", "build"]),

    // local ignores - match everything BUT tests/*.js
    {
        ignores: ["tests/*.js"],
        rules: {
            "no-console": "error"
        }
    }
]);
```

## Support for older ESLint versions

We realize that there are a lot of users on older versions of ESLint who may not be able to upgrade immediately to get the benefits of `defineConfig()` and `globalIgnores()`, and that's why we've also published these helper functions in a separate [`@eslint/config-helpers`](https://npmjs.com/package/@eslint/config-helpers) package. This package can be used with any ESLint version that supports flat config. Just make sure to import `defineConfig()` and `globalIgnores()` from `@eslint/config-helpers` instead of `eslint/config` and you can enjoy the same functionality.

## Conclusion

The evolution of ESLint's flat config system represents our commitment to continuously improving the developer experience based on real-world feedback. By introducing `defineConfig()`, we've made it easier to write type-safe configurations while also simplifying the way nested configurations are handled. The reintroduction of `extends` brings back a familiar and powerful way to compose configurations, addressing one of the most common pain points reported by our users. With the addition of the `globalIgnores()` helper, we've clarified one of the most confusing aspects of the configuration system by making global ignore patterns more explicit. Together, these changes create a more intuitive and user-friendly configuration experience that maintains the power and flexibility of the flat config system. For teams not yet ready to upgrade to the latest version of ESLint, we've ensured these improvements are available through the separate `@eslint/config-helpers` package. As we continue to evolve ESLint, we remain committed to balancing innovation with practicality, always keeping our users' needs at the forefront of our development decisions. We encourage you to try these new features and share your feedback with us through our [GitHub discussions](https://github.com/eslint/eslint/discussions) or [Discord server](https://eslint.org/chat).
