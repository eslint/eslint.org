
---
layout: post
title: Create a custom rule to disallow underscores
teaser: "This blog post explains how to create an ESLint custom rule that disallows underscores in variable names."
tags:
  - Custom Rules
authors:
  - KICKdesigns
categories:
  - Tutorials
---


This blog post describes how to create a custom rule that disallows using an underscore when declaring a variable name. For example, `my-variable` or `myvariable` is valid, but `my_variable` is disallowed.

To create a custom rule you'll need to:

1. Ensure you complete the [Prerequisites](#prerequisites).
2. [Create the Plugin](#create-the-plugin).
3. [Create the Custom Rule](#Create-the-custom-rule).

## Prerequisites

Ensure you complete the following before you proceed:

- Install [Node.js](https://nodejs.org/en/).
- Install [yarn](https://classic.yarnpkg.com/en/docs/install).
- Install and configure ESLint. See [Getting Started with ESlint](https://eslint.org/docs/latest/user-guide/getting-started) for more information.

**Note:** This walkthrough uses a JavaScript ESLint configuration file and yarn.

## Create the Plugin

To create a plugin, you must create an npm module with the `pluginname` (e.g. `test`) and `pluginscope` (e.g. `testscope`) in one of the following formats:

 * `eslint-plugin-pluginname` (e.g. `eslint-plugin-test`)
 * `@pluginscope/eslint-plugin-pluginname` (e.g. `@testscope/eslint-plugin-test`)
 * `@pluginscope/eslint-plugin` (e.g. `@testscope/eslint-plugin`)

This walkthrough will show how to create a plugin using the first format.

**Note:** You can use a [generator](https://www.npmjs.com/package/generator-eslint) if you don't want to create the plugin manually.

To create a plugin:

1. Create a plugin folder inside your project folder called `eslint-plugin-test`.
2. In your plugin folder, create `package.json` file with the following:

  ```
  {
    "name": "eslint-plugin-test",
    "version": "1.0.0",
    "main": "index.js"
  }
  ```

2. In your plugin folder, create `index.js` files with the following:

  ```
  module.exports = {
       rules: {}
  };
  ```

  This file will contain all the plugin rules.

Now that the plugin is created, proceed to [Create the Custom Rule](#Create-the-custom-rule).

## Create the Custom Rule

Follow the steps below to create the custom rule to disallow the use of underscores when declaring a variable name:

1. Add the custom rule `no-underscores-in-variables` to the `index.js` file:

  ```
  module.exports = {
    rules: {
      "no-underscores-in-variables": {
          create: function(context) {
              return {
                CatchClause(node) {
                    if (node.id.name.includes("_")) {
                        context.report(node, 'Variable names must not contain underscores');
                    }
                }
              };
          }
      }
    }
  };
  ```

2. In the project root, add the plugin as a dependency using `yarn`:

  ```yarn add --dev file:./eslint-plugin-test```

  The `file:./plugin-folder-pluginname` syntax enables you to install a package that is on your local file system.

3. In your project folder, check the `node_modules` directory to ensure there's an `eslint-plugin-test` directory that contains the `index.js` and `package.json` files.

4. Add the plugin and rule in the `.eslintrc.js` file:

  ```
  module.exports = {

      ...

      "plugins": ["my-project"],
      "rules": {
        "test/no-underscores-in-variables": 1
      }

      ...

  };
  ```

  Ensure you replace `my-project` with the name of your project.

  **Note:** The `.eslintrc.js` file is a hidden file, which you may need to unhide.

You have now created a custom rule!
