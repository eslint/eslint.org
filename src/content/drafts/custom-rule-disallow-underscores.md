
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

This blog post describes how to create a custom ESLint rule that disallows using an underscore when declaring a variable name. For example, `myVariable` or `myvariable` is valid, but `my_variable` is disallowed.

These are the steps we'll cover:

* [Writing the Rule](#writing-the-rule)
* [Testing the Rule](#testing-the-rule)
* [Distributing the Rule in a Plugin](#distributing-the-rule-in-a-plugin)
* [Referencing the Rule in your ESLint Configuration](#referencing-the-rule-in-your-eslint-configuration)

## Designing the Rule

Before you write any code, it's important to think about what problem you're trying to solve. 

For our example, we want to ensure that variable names adhere to a specific format that disallows underscores. Therefore, when we design the rule, we want to first detect the presence of an underscore in the variable name and then trigger a message if one is found.

Before you write a rule, always check to see if someone else has already solved your problem. Here are some links to help you find existing rules:

* [Official ESLint rules](https://eslint.org/docs/rules/)
* [awesome-eslint](https://github.com/dustinspecker/awesome-eslint) – A collection of ESLint presets, configs, plugins, and rules.

For the purpose of this post, we'll assume that no one else has already created this rule.

ESLint stores all the tokens it finds during code analysis in an Abstract Syntax Tree (AST). Therefore, our rule needs to traverse the AST, and for each variable node, run a function to detect underscore characters in its name.

The following shows an example AST for the variable declaration: `var a = 1 + 1`:

```json
{ 
    type: "VariableDeclaration", 
    declarations: [
        { 
            type: "VariableDeclarator", 
            id: { 
                type: "Identifier", 
                name: "a" 
            }, 
            init: { 
                type: "BinaryExpression", 
                left: { 
                    type: "Literal", 
                    value: 1, 
                    raw: "1" 
                }, 
                operator: "+", 
                right: { 
                    type: "Literal", 
                    value: 1, 
                    raw: "1" 
                } 
            }
        }
    ]
    , kind: "var" 
}
```

Our custom rule will cycle through all nodes with the `id `'s `type` field set to `Identifier`. The rule will then test its `name` subfield value for the presence of an underscore.

Now that we've outlined what our rule does, we need to choose a rule name. A rule name should be descriptive and provide an indication of what the rule does. Following the [ESLint rule naming conventions](https://eslint.org/docs/latest/developer-guide/working-with-rules#rule-naming-conventions), we'll start our rule name with `no-`, which is the convention used for rules which disallow something (in this case, underscores). Therefore the name we'll use for our custom rule is `no-underscores-in-variables`.

## Writing the Rule

Now that we have our rule name and what the rule needs to perform, let's implement it.

This post uses a JavaScript ESLint configuration file and Yarn, therefore our project will require the following installations:

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- ESLint (including initial configuration). See [Getting Started with ESlint](https://eslint.org/docs/latest/user-guide/getting-started) for more information.

Begin by creating a folder for the rule inside your project folder. Let's name the folder `eslint-plugin-no-underscores-in-variables`.

Craete an `index.js` file in your rule folder, with the following code:

```js
module.exports = {
};
```

This enables us to define our rule as a module export, which we'll put in an npm package later on.

Now all we need to do is write the rule. A rule is defined as a module export by specifying its `meta` values and `create` callback. ESLint will invoke this callback on each node it finds in the AST. 

Below is a basic implementation of our `no-underscores-in-variables` rule:

```js
module.exports = {
      meta: {
          messages: {
              avoidName: "Avoid using variables with underscores."
          }
      },
      create(context) {
        return {
          Identifier(node) {
            if (node.name.includes("_")) {
              context.report({
                node,
                messageId: "Variable names must not contain underscores",
                data: {
                  name: node.name,
                }
              });
            }
          }
        }
      }
};
```

In this example, the rule's error message is specified with the `avoidName` value, and the rule's callback takes the current `node` provided by ESLint and accesses its `name` field (i.e. the name of the variable). 

The `includes()` string method checks if `name` contains underscores. If it does, a message is passed into the `context.report()` method, which reports the rule problem, and handles the message display.

Our rule is now ready to test.

## Testing the Rule

To test our rule, start by createing a `spec.js` file for our test script. 

In general, test files should have the same as the source file. For our example, we'll create a file `no-underscores-in-variables.spec.js` and place it in the `eslint-plugin-no-underscores-in-variables/tests/lib` folder. 

ESLint provides a utility class for testing called `RuleTester`. To use it, simply set up some `requires` for both `RuleTester` and the rule you created above, then invoke the class's `run()` method.

```js
"use strict";

const RuleTester = require("eslint").RuleTester;
const rule = require('../../index');

var ruleTester = new RuleTester();
ruleTester.run("no-underscores-in-variables", rule, {
  valid: [
      {
          code: "valid-name;",
      },
      {
          code: "validname;",
      }
  ],

  invalid: [
      {
          code: "invalid_name;",
          errors: [{ message: "Unexpected invalid variable." }]
      }
  ]
});
```

`ruleTester.run()` takes in three parameters: 

* Name of the rule
* Rule object
* Object with valid and invalid code examples

After you run this code using the command `node eslint-plugin-no-underscores-in-variables/tests/lib/no-underscores-in-variables.spec.js`, the output should look similar to the following:

```
...
        throw err;
        ^

TypeError: context.report() called with a messageId of 'Variable names must not contain underscores' which is not present in the 'messages' config: {
  "avoidName": "Avoid using variables with underscores."
}

...

    at NodeEventGenerator.enterNode (/path/to/project/node_modules/eslint/lib/linter/node-event-generator.js:340:14) {
  ruleId: 'no-underscores-in-variables',
  currentNode: <ref *1> Node {
    type: 'Identifier',
    loc: SourceLocation {
      start: Position { line: 1, column: 0 },
      end: Position { line: 1, column: 12 }
    },
    range: [ 0, 12 ],
    name: 'invalid_name',
    parent: <ref *2> Node {
      type: 'ExpressionStatement',
      loc: SourceLocation {
        start: Position { line: 1, column: 0 },
        end: Position { line: 1, column: 13 }
      },
      range: [ 0, 13 ],
      expression: [Circular *1],
      
      ...
      
    }
  }
}

...

```

From the output you can see the rule flagged the invalid variable `invalid_name`. Our rule is works!

Now that we've validated that the rule, let's package it as a plugin.

## Distributing the Rule in a Plugin

Distributing the rule in a plugin allows it to be shared and reused by others.

To create a plugin, you can create an npm module with the `pluginname` (e.g. `test`) and `pluginscope` (e.g. `testscope`) in one of the following formats:

 * `eslint-plugin-pluginname` (e.g. `eslint-plugin-test`)
 * `@pluginscope/eslint-plugin-pluginname` (e.g. `@testscope/eslint-plugin-test`)
 * `@pluginscope/eslint-plugin` (e.g. `@testscope/eslint-plugin`)

For our purposes, we'll use the first format.

**Note:** You can use a [generator](https://www.npmjs.com/package/generator-eslint) if you don't want to create the plugin manually.

Create a `package.json` file in your `eslint-plugin-no-underscores-in-variables` rule folder with the following:

```json
{
  "name": "eslint-plugin-no-underscores-in-variables",
  "version": "1.0.0",
  "main": "index.js"
}
```

The `package.json` file references the rule file `index.js` we created earlier. The `eslint-plugin-no-underscores-in-variables` folder now contains the entire plugin to distrubute your rule.

## Referencing the Rule in your ESLint Configuration

Now that our rule is packaged, we can use it to lint some code.

Open your projects `package.json` file and add your plugin as a dependency value under `devDependencies `:

```js
{
  "name": "eslint-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "eslint": "^8.23.0",
    "eslint-plugin-no-underscores-in-variables": "file:./eslint-plugin-no-underscores-in-variables"
  },
  
  ...
  
}
```

The dependency specifies the name of the plugin and the path to the rule's plugin files.

Now we need to install the plugin. Navigate to your project's root folder and install the plugin using Yarn:

```
yarn add --dev file:./eslint-plugin-no-underscores-in-variables
```

The `file:./plugin-folder-pluginname` syntax enables you to install a package that's on your local file system.

In your project folder, check the `node_modules` directory for the `eslint-plugin-no-underscores-in-variables` directory that contains the `index.js` and `package.json` files for your rule.

Finally, add the plugin and rule to the project's `.eslintrc.js` file:

**Note:** The `.eslintrc.js` file is a hidden file, which you may need to unhide.

```js
module.exports = {

    ...

    "plugins": ["my-project"],
    "rules": {
      "eslint-plugin-no-underscores-in-variables/no-underscores-in-variables": 1
    }

    ...
};
```

Ensure you replace `my-project` with the name of your project and you're now ready to lint your project code with your custom rule!