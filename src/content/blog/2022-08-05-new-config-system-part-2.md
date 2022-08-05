---
layout: post
title: "ESLint's new config system, Part 2: Introduction to flat config"
teaser: "ESLint's new config system, nicknamed flat config, is designed to be both familiar and much simpler than the original config system."
tags:
  - Configuration
  - Command Line
authors:
  - nzakas
categories:
  - API Changes
---

In [my previous post](https://eslint.org/blog/2022/08/new-config-system-part-1/), I talked about how the eslintrc config system had grown to be more complex than necessary through a series of small, incremental changes. The flat config system, on the other hand, was designed from the start to be simpler in a number of ways. We took all of the learnings from the previous six years of ESLint development to come up with a holistic approach to configuration that took the best of eslintrc and combined it with the way other JavaScript-related tools handled configuration. The result is something that hopefully feels familiar to existing ESLint users and is far more powerful than what was possible before.

**Docs:** Read more about flat config system in the [official documentation](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new).

## The goals of flat config

To set the stage for the changes in flat config, we had several goals:

1. **Logical defaults** - the way people write JavaScript has changed a lot in the past nine years, and we wanted the new config system to reflect our current reality rather than the one we lived in when ESLint was first released.
1. **One way to define configs** - we didn't want folks to have multiple ways to do the same thing any longer. There should be one way to define configs for any given project.
1. **Rules configs should remain unchanged** - we felt like the way rules were configured already worked fine, so to make it easier to transition to flat config, we didn't want to make any changes to rule configs. The same `rules` key can be used the same way in flat config.
1. **Use native loading for everything** - one of our biggest regrets about eslintrc was recreating the Node.js `require` resolution in a custom way. This was a significant source of complexity and, in hindsight, unnecessary. Going forward, we wanted to leverage the loading capabilities of the JavaScript runtime directly.
1. **Better organized top-level keys** - the number of keys at the top-level of eslintrc had grown dramatically since ESLint was released. We need to look at which keys were necessary and how they related to one another.
1. **Existing plugins should work** - the ESLint ecosystem is filled with hundreds of plugins. It was important that these plugins continued to work.
1. **Backwards compatibility should be a priority** - even though we are moving to a new config system, we didn't want to leave all of the existing ecosystem behind. In particular, we wanted to have ways for shareable configs to continue to work as closely as possible. While we knew 100% compatibility was probably unrealistic, we wanted to do our best to ensure existing shareable configs would work.

With these goals in mind, we came up with the new flat config system.

## Setting logical defaults for linting

When ESLint was first created, ECMAScript 5 was the most recent version of JavaScript and most files were written as "shared everything" scripts or CommonJS modules (for Node.js). ECMAScript 6 was on the horizon but no one knew how quickly it would be implemented or how modules (ESM) would end up being used. So ESLint's defaults were to assume all files were ECMAScript 5. We ended up with the `ecmaVersion` parser configuration to allow people to opt-in to ECMAScript 6 when they were ready.

Fast forward to 2022: ECMAScript is constantly evolving and ESM is the standard module format everyone is using. We couldn't really change the default settings of eslintrc without potentially breaking a lot of existing configurations, but we could definitely make a change with flat config.

Flat config features the following defaults:

* `ecmaVersion: "latest"` for all JavaScript files - That's right, by default all JavaScript files will be set to the latest version of ECMAScript. This mimics how JavaScript runtimes work, in that every upgrade means you are opting-in to the latest and greatest version of JavaScript. This change should mean that you probably won't have to manually set `ecmaVersion` in your config unless you want to enforce a previous version due to runtime constraints. You will still be able to set `ecmaVersion` all the way down to `3` if necessary.
* `sourceType: "module"` for all `.js` and `.mjs` files - By default, flat config assumes you are writing ESM. If not, you can always set `sourceType` back to `"script"`.
* `sourceType: "commonjs"` for `.cjs` files - We are still in a transition period where a lot of Node.js code is written in CommonJS. To support those users, we added a new `sourceType` of `"commonjs"` that configures everything correctly for that environment.
* ESLint searches for `.js`, `.mjs`, and `.cjs` files - With eslintrc, ESLint only ever searched for `.js` files when you passed a directory name on the command line, and you would need to use the `--ext` flag to define more. With flat config, all three of the most common JavaScript filename extensions are automatically searched.

We are pretty excited about these new defaults as we think this will help people onboard to ESLint faster and with less confusion.

## The new config file: `eslint.config.js`

In contrast to eslintrc, which allowed multiple config files in multiple locations, multiple config file formats, and even `package.json`-based configs, flat config has just one location for all of your project's configuration: the `eslint.config.js` file. By limiting configuration to one location and one format, we can take advantage of the JavaScript runtime's loading mechanism directly and avoid the need for custom parsing of config files.

When the ESLint CLI is used, it searches for `eslint.config.js` from the current working directory and if not found will continue the search up the directory's ancestors until the file is found or the root directory is hit. That one `eslint.config.js` file contains all of the configuration information for that run of ESLint so it dramatically reduces the disk access required as compared to eslintrc, which had to check each directory from the linted file location up to the root for any additional config files.

Additionally, using a JavaScript file allowed us to rely on users to load additional information that their config file might need. Instead of `extends` and `plugins` loading things by name, you can now just use `import` and `require` as necessary to bring in those additional resources. Here's an example of what an `eslint.config.js` file looks like:

```js
export default [
    {
        files: ["**/*.js"],
        rules: {
            "semi": "error",
            "no-unused-vars": "error"
        }  
    }
];
```

An `eslint.config.js` file returns an array of config objects. Read on to understand more about this example.

## Glob-based configs everywhere

While the `overrides` key in eslintrc was the source of a lot of complexity, one thing was very clear: people really liked being able to define configuration by glob patterns in their config file. Because we wanted to eliminate the config cascade of eslintrc, we had to use glob patterns to enable the same type of config overrides. We used the `overrides` configs as the basis for flat config.

Each config object can have optional `files` and `ignores` keys specifying [minimatch](https://npmjs.com/package/minimatch)-based glob patterns to match files. A config object only applies to a file if the filename matches a pattern in `files` (or if there is no `files` key, in which case it will match all files). The `ignores` key filters out files from the list of `files`, so you limit which files the config object applies to. For instance, maybe your test files live in the same directory as your source file and you want a config object to apply only to the source files. You could do so like this:

```js
export default [
    {
        files: ["**/*.js"],
        ignores: ["**/*.test.js"],
        rules: {
            "semi": "error",
            "no-unused-vars": "error"
        }  
    }
];
```

Here, the config object will match all JavaScript files and then filter out any files ending with `.test.js`.

What if you want to ignore files completely? You can do that by specifying a config object that has only an `ignores` key, like this:

```js
export default [
    {
        ignores: ["**/*.test.js"]
    },
    {
        files: ["**/*.js"],
        rules: {
            "semi": "error",
            "no-unused-vars": "error"
        }  
    }
];
```

With this config, all JavaScript files ending with `.test.js` will be ignored. You can think of this as the equivalent of `ignorePatterns` in eslintrc, albeit with minimatch patterns.

## Goodbye `extends`, hello flat cascade

While we wanted to get rid of the directory-based config cascade, flat config actually still has a flat cascade defined directly in your `eslint.config.js` file. Inside of the array, ESLint finds all config objects that match the file being linted and merges them together in much the same way that eslintrc did. The only real difference is the merge happens from the top of the array down to the bottom instead of using files in a directory structure. For example:

```js
export default [
    {
        files: ["**/*.js", "**/*.cjs"],
        rules: {
            "semi": "error",
            "no-unused-vars": "error"
        }  
    },
    {
        files: ["**/*.js"],
        rules: {
            "no-undef": "error",
            "semi": "warn"
        }  
    }
];
```

This config has two config objects with overlapping `files` patterns. The first config object applies to all `.js` and `.cjs` files while the second applies only to `.js` files. When linting a file ending with `.js`, ESLint combines both config objects to create the final config for the file. Because the second config sets `semi` to a severity of `"warn"`, that takes precedence over the `"error"` that was set in the first config. The last matching config always wins when there is a conflict.

What this means for shareable configs is that you can insert them directly into the array instead of using `extends`, such as:

```js
import customConfig from "eslint-config-custom";

export default [
    customConfig,
    {
        files: ["**/*.js", "**/*.cjs"],
        rules: {
            "semi": "error",
            "no-unused-vars": "error"
        }  
    },
    {
        files: ["**/*.js"],
        rules: {
            "no-undef": "error",
            "semi": "warn"
        }  
    }
];
```

Here, `customConfig` is inserted first in the array so that it becomes the base of configuration for this file. Each of the following config objects builds upon that base to create the final config for a given JavaScript file.

## Reimagined language options

ESLint has always had a strange mix of options that affected how JavaScript was interpreted. There was the top-level `globals` key that modified available global variables, and `ecmaVersion` and `sourceType` as `parserOptions`, not to mention `env` to add more globals. Perhaps the most confusing is that you had to set both `ecmaVersion` and add an environment like `es6` to enable both the syntax you wanted and ensure that the correct global variables would be available.

In flat config, we moved all keys related to JavaScript evaluation into a new top-level key called `languageOptions`.

### Setting `ecmaVersion` in flat config

The biggest change is that we moved `ecmaVersion` out of `parserOptions` and directly into `languageOptions`. This better reflects this key's new behavior, which is to enable both syntax and global variables based on the specified version of ECMAScript. For example:

```js
export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 6
        }
    }
];
```

This config has downgraded `ecmaVersion` to `6`. Doing so ensures that all of the ES6 syntax and all of the ES6 globals are available. (Any custom parsers used will still receive this value of `ecmaVersion`.)

### Setting `sourceType` in flat config

Next, we moved `sourceType` into `languageOptions`. Similar to `ecmaVersion`, this key affects not just how a file is parsed, but also how ESLint evaluates its scope structure. We kept the traditional `"module"` for ESM and `"script"` for scripts, and also added `"commonjs"`, which lets ESLint know that it should treat the file as CommonJS (which also enables CommonJS-specific globals). If you are using `ecmaVersion: 3` or `ecmaVersion: 5`, be sure to set `sourceType: script`, like this:

```js
export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 5,
            sourceType: "script"
        }
    }
];
```

### Goodbye environments, hello `globals`

Environments in eslintrc provided a known set of globals and were a constant source of confusion for users. They need to be kept up to date (especially in the case of `browser`) and that update needs to wait for ESLint releases. Plus, we had hooked some additional functionality onto environments to make it easier to work with Node.js, and in the end, we made a mess.

For flat config, we decided to remove the `env` key completely. Why? Because it's no longer needed. All of the custom functionality we hooked onto environments for use with Node.js is now covered by `sourceType: "commonjs"`, so all that was left was for environments to manage global variables. It doesn't make sense for ESLint to do this in the core, so we are handing this responsibility back to you.

Years ago, we worked with Sindre Sorhus to create the [`globals`](https://npmjs.com/package/globals) package, which extracted all of the environment information from ESLint so that it would be available to other packages. ESLint then used `globals` as the source for its environments.

With flat config, you can use the `globals` package directly, updating it whenever you want, to get all of the same functionality that environments used to provide. For example, here is how you add browser globals into your configuration:

```js
import globals from "globals";

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser,
                myCustomGlobal: "readonly"
            }
        }
    }
];
```

The `languageOptions.globals` key works the same as it did in eslintrc, only now, you can use JavaScript to dynamically insert any global variables that you want.

### Custom parsers and parser options are mostly the same

The `parser` and `parserOptions` keys have now moved into the `languageOptions` key, but they mostly work the same as in eslintrc with two specific differences:

1. You can now insert the parser object directly into the config.
1. Parsers can now be bundled with plugins and you can specify a string value for `parser` to use a parser from a plugin. (Described more in the next section.)

Here's an example using the [Babel ESLint parser](https://npmjs.com/package/@babel/eslint-parser):

```js
import babelParser from "@babel/eslint-parser";

export default [
    {
        files: ["**/*.js", "**/*.mjs"],
        languageOptions: {
            parser: babelParser
        }
    }
];
```

This configuration ensures that the Babel parser, rather than the default, will be used to parse all files ending with `.js` and `.mjs`.

You can also pass options directly to the custom parser by using the `parserOptions` key in the same way as it works in eslintrc:

```js
import babelParser from "@babel/eslint-parser";

export default [
    {
        files: ["**/*.js", "**/*.mjs"],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    babelrc: false,
                    configFile: false,
                    // your babel options
                    presets: ["@babel/preset-env"],
                }
            }
        }
    }
];
```

## More powerful and configurable plugins

The strength of ESLint is the ecosystem of plugins that individuals and companies maintain to customize their linting strategy. As such, we wanted to be sure that existing plugins continued to work without modification as well as allowing plugins to do things they were never able to do in the past.

On the surface, using a plugin in flat config looks very similar to using a plugin in eslintrc. The big difference is that eslintrc used strings whereas flat configs uses objects. Instead of specifying the name of a plugin, you import the plugin directly and place it into the `plugins` key, as in this example:

```js
import jsdoc from "eslint-plugin-jsdoc";

export default [
    {
        files: ["**/*.js"],
        plugins: {
            jsdoc
        }
        rules: {
            "jsdoc/require-description": "error",
            "jsdoc/check-values": "error"
        }  
    }
];
```

This config uses the [`eslint-plugin-jsdoc`](https://npmjs.com/package/eslint-plugin-jsdoc) plugin by importing it as a local `jsdoc` variable and then inserting it into the `plugins` key in the config. After that, the rules inside the plugin are referenced using the `jsdoc` namespace.

**Note:** Because plugins are now imported like any other JavaScript module, there's no more strict enforcement of plugin package names. You no longer need to include `eslint-plugin-` as the prefix for your package names...but we would like it if you did.

### Personalized plugin namespaces

Because the name of the plugin in your config is now decoupled from the name of the plugin package, you can choose any name you want, as in this example:

```js
import jsdoc from "eslint-plugin-jsdoc";

export default [
    {
        files: ["**/*.js"],
        plugins: {
            jsd: jsdoc
        }
        rules: {
            "jsd/require-description": "error",
            "jsd/check-values": "error"
        }  
    }
];
```

Here, the plugin is named `jsd` in the config, so the rules also use `jsd` to indicate which plugin they are coming from.

### From `--rulesdir` to runtime plugins

With eslintrc, rules needed to be loaded by the CLI directly in order to be available inside of a config file. This means either bundling custom rules in a plugin or using the `--rulesdir` flag to specify the directory from which ESLint should load custom rules. Both approaches required some extra work to set up and were a frequent cause of frustration for our users.

With flat config, you can load custom rules directly in the config file. Because plugins are now objects directly in the config, you can easily create runtime plugins that exist only in your config file, such as:

```js
import myrule from "./custom-rules/myrule.js";

export default [
    {
        files: ["**/*.js"],
        plugins: {
            custom: {
                rules: {
                    myrule
                }
            }
        }
        rules: {
            "custom/myrule": "error"
        }  
    }
];
```

Here, a custom rule is imported as `myrule` and then a runtime plugin is created named `custom` to provide that rule to the config as `custom/myrule`. 

As a result, we will be removing `--rulesdir` once the transition to flat config is complete.

### Custom parsers in plugins

One of the weird artifacts of ESLint's development is that parsers were never part of plugins. That's because custom parsers existed long before plugins did, and we never went back to make the two work well together. In flat config, we took the opportunity to fix this problem by allowing plugins to expose parsers in the same that they expose processors and rules. For example, you can now define a plugin that looks like this:

```js
export default {
    parsers: {
        parserName: {
            parse() { /*... */ }
        }
    }
}
```

This plugin exposes a parser called `parserName` under the `parsers` key. You can then use this parser in your config like this:

```js
import custom from "./custom-plugin.js";

export default [
    {
        files: ["**/*.js"],
        plugins: {
            custom
        },
        languageOptions: {
            parser: "custom/parserName"
        }
    }
];
```

This config creates a plugin namespace called `custom`. The custom parser can then be accessed using the string `"custom/parserName"`.

### Processors works in a similar way to eslintrc

The `processor` top-level key works mostly the same as in eslintrc, with the primary use case being to use a processor that is defined in a plugin, for example:

```js
import markdown from "eslint-plugin-markdown";

export default [
    {
        files: ["**/*.md"],
        plugins: {
            markdown
        },
        processor: "markdown/markdown"
    }
];
```

This configuration object specifies that there is a processor called `"markdown"` contained in the plugin named `"markdown"` and will apply the processor to all files ending with `.md`.

The one addition in flat config is that `processor` can now also be an object containing both a `preprocess()` and a `postprocess()` method.

## Organized linter options

In eslintrc, there were a couple of keys that related directly to how the linter operated, namely `noInlineConfig` and `reportUnusedDisableDirectives`. These have moved into the new `linterOptions` key but work exactly the same as in eslintrc. Here's an example:

```js
export default [
    {
        files: ["**/*.js"],
        linterOptions: {
            noInlineConfig: true,
            reportUnusedDisableDirectives: true
        }
    }
];
```

### Shared settings are exactly the same

The top-level `settings` key behaves the exact same way as in eslintrc. You can define an object with key-value pairs that should be available to all rules. Here's an example:

```js
export default [
    {
        settings: {
            sharedData: "Hello"
        }
    }
];
```

### Using predefined configs

ESLint has two predefined configs:

* `eslint:recommended` - enables the rules that ESLint recommends everyone use to avoid potential errors
* `eslint:all` - enables all of the rules shipped with ESLint

To include these predefined configs, you can insert the string values into the returned array and then make any modifications to other properties in subsequent configuration objects:

```js
export default [
    "eslint:recommended",
    {
        rules: {
            semi: ["warn", "always"]
        }
    }
];
```

Here, the `eslint:recommended` predefined configuration is applied first and then another configuration object adds the desired configuration for `semi`.

## Backwards compatibility utility

As mentioned previously, we felt like there needed to be a good amount of backwards compatibility with eslintrc in order to ease the transition. The [`@eslint/eslintrc`](https://npmjs.com/package/@eslint/eslintrc) package provides a `FlatCompat` class that makes it easy to continue using eslintrc-style shared configs and settings within a flat config file. Here's an example:

```js
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: __dirname
});

export default [

    // mimic ESLintRC-style extends
    compat.extends("standard", "example"),

    // mimic environments
    compat.env({
        es2020: true,
        node: true
    }),

    // mimic plugins
    compat.plugins("airbnb", "react"),

    // translate an entire config
    compat.config({
        plugins: ["airbnb", "react"],
        extends: "standard",
        env: {
            es2020: true,
            node: true
        },
        rules: {
            semi: "error"
        }
    })
];
```

Using the `FlatCompat` class allows you to continue using all of your existing eslintrc files while optimizing them for use with flat config. We envision this as a necessary transitional step to allow the ecosystem to slowly convert over to flat config.

## Conclusion

The team spent a long time designing flat config so that it would both feel familiar to existing users and provide new functionality that would benefit everyone. We kept things like rules, settings, and processors the same while extending things like plugins, language options, and linter options to be more uniform. We think that flat config has found a good balance between these two poles and that you will enjoy using ESLint more once the new config system is generally available. In the meantime, the compatibility utility will allow you to continue using existing shared configs.

In the next part of this blog series, you'll learn how to start using flat config today.
