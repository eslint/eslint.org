---
layout: post
title: ESLint now officially supports linting of JSON and Markdown
teaser: "Taking our first steps towards providing a language-agnostic platform for source code linting."
tags:
  - Open Source
  - Linting
  - Parsing
authors:
  - nzakas
categories:
  - Announcements
---

Back in July we [announced](/blog/2024/07/whats-coming-next-for-eslint/) our
plan for ESLint going forward. Part of that announcement discussed transitioning
ESLint to be a more general-purpose linter that is capable of linting any
language. A lot of the core functionality of ESLint (finding files, parsing
then, reporting problems) is generic, and so we've spent the past few months
extracting the JavaScript-specific parts of the core. We're now happy to share
that this work has paid by allowing ESLint to now lint both JSON and Markdown!

## JSON linting with `@eslint/json`

JSON linting is accomplished using the
[`@eslint/json`](https://npmjs.com/package/@eslint/json) plugin, which is an
officially supported language plugin. The plugin provides parsing for JSON,
JSONC (JSON with comments), and JSON5. To use the plugin, install it from npm:

```shell
npm install @eslint/json -D
```

Then update your configuration file:

```js
import json from "@eslint/json";

export default [
    {
        plugins: {
            json,
        },
    },

    // lint JSON files
    {
        files: ["**/*.json"],
        language: "json/json",
        rules: {
            "json/no-duplicate-keys": "error",
        },
    },
];
```

There are several rules built-in to the plugin, and we're looking for more suggestions. Have an idea for a rule? [Open an issue](https://github.com/eslint/json/issues).

For more information on configuring JSON linting, please check out the [README](https://npmjs.com/package/@eslint/json).

## Markdown linting with `@eslint/markdown`

Markdown linting is accomplished using the
[`@eslint/markdown`](https://npmjs.com/package/@eslint/markdown) plugin, which is the next generation of the [`eslint-plugin-markdown`](https://npmjs.com/package/eslint-plugin-markdown) plugin that only contained a processor. This new officially supported language plugin features parsing and rules for CommonMark and GitHub-Flavored Markdown. To use the plugin, install it from npm:

```shell
npm install @eslint/markdown -D
```

Then update your configuration file:

```js
// eslint.config.js
import markdown from "@eslint/markdown";

export default [
    {
        files: ["**/*.md"],
        plugins: {
            markdown
        },
        language: "markdown/commonmark",
        rules: {
            "markdown/no-html": "error"
        }
    }    
];
```

Similar to the JSON plugin, there are several rules built-in to the plugin, and we're looking for more suggestions. Have an idea for a rule? [Open an issue](https://github.com/eslint/markdown/issues).

For more information on configuring Markdown linting, please check out the [README](https://npmjs.com/package/@eslint/markdown).

## Creating custom rules and using Code Explorer

Both `@eslint/json` and `@eslint/markdown` parse source code into an AST and then traverse the AST to run rules, just like ESLint does with JavaScript. That means you can write custom rules for JSON and Markdown just like you can for JavaScript. The primary difference is in the AST format. JSON uses the [Momoa AST](https://github.com/humanwhocodes/momoa/) while Markdown uses [mdast](https://github.com/syntax-tree/mdast). Because there aren't a lot of resources out there to help you inspect alternate AST formats, we're happy to announce the launch of the [Code Explorer](https://explorer.eslint.org).

[![ESLint Code Explorer](/assets/images/blog/2024/code-explorer.png)](https://explorer.eslint.org)

Code Explorer allows you to view and explore the AST of different languages to help in creating custom rules. For JSON and Markdown, you'll get an expandable view of the AST, while JavaScript allows you to see not just the AST but also the scope and code path information that ESLint generates as it parses your code. Going forward, we'll continue to update Code Explorer with new languages and capabilities designed to help you create custom rules.

And the best part? Code Explorer is [open source](https://github.com/eslint/code-explorer), so you can help us make it even better.

## Write your own language plugin

ESLint languages are designed in such a way that they can be included in any plugin using a new `languages` key. The `@eslint/json` and `@eslint/markdown` plugins are intended not only to provide JSON and Markdown linting, respectively, but also as examples of how to create your own languages. You can check out the [languages documentation](https://eslint.org/docs/latest/extend/languages) for an overview of how you can create your own language.

## Conclusion

Linting languages other than JavaScript has been on the ESLint roadmap for a while, so it's exciting to reach this milestone. Our long-term goal is to ensure that ESLint can lint any kind of file you might use in a web project, whether that be with officially supported language plugins or with community-written plugins. With JavaScript, JSON, and Markdown, we're already well on our way towards achieving that goal.

As a reminder, ESLint is an independent open source project maintained by a group of volunteers in their spare time. If you enjoy using ESLint, please talk to your company about [sponsoring the project](/donate).
