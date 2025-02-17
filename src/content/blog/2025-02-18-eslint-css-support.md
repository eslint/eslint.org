---
layout: post
title: ESLint now officially supports linting of JSON and Markdown
teaser: "Taking our next step towards providing a language-agnostic platform for source code linting."
tags:
  - Open Source
  - Linting
  - Parsing
authors:
  - nzakas
categories:
  - Announcements
---

Back in July of 2024 we [announced](/blog/2024/07/whats-coming-next-for-eslint/) our
plan to make ESLint a more general-purpose linter that is capable of linting any
language. In October 2024, we [announced](/blog/2024/10/eslint-json-markdown-support/)
linting support for JSON and Markdown, delivering on that vision. Today, we're excited
to add to the list of supported languages with the introduction of CSS support.

## CSS linting with `@eslint/css`

CSS linting is accomplished using the
[`@eslint/css`](https://npmjs.com/package/@eslint/css) plugin, which is an
officially supported language plugin. The plugin provides parsing through the
excellent [CSSTree](https://github.com/csstree/csstree) project along with rules
for CSS. To use the plugin, install it from npm:

```shell
npm install @eslint/css -D
```

Then update your configuration file:

```js
import css from "@eslint/css";

export default [
    // lint css files
    {
        files: ["**/*.css"],
        plugins: {
            css,
        },
        language: "css/css",
        rules: {
            "css/no-duplicate-imports": "error",
        },
    },
];
```

There are several rules built-in to the plugin:

* `no-duplicate-imports` - Disallow duplicate `@import` rules
* `no-empty-blocks` - Disallow empty blocks
* `no-invalid-at-rules` - Disallow invalid at-rules (validates at-rules)
* `no-invalid-properties` - Disallow invalid properties (validates rules)
* `require-baseline` - Enforce the use of [baseline](https://web.dev/baseline) features
* `use-layers` - Enforce the use of `@layer`

We feel that validation and enforcing [baseline](https://web.dev/baseline) features are the minimum that a linter needs to support in 2025, and so we spent a lot of time making the `no-invalid-at-rules`, `no-invalid-properties`, and `require-baseline` rules as comprehensive as possible.

Have an idea for a rule? [Open an issue](https://github.com/eslint/css/issues).

For more information on configuring CSS linting, please check out the [README](https://npmjs.com/package/@eslint/css).

## Tolerant parsing support

By default, CSS linting parses the code as strictly as possible, highlighting all errors that it finds along the way. However, CSS parsing in the browser has built-in error recovery and can make sense of CSS with some syntax errors. If you want to lint your CSS using the same error recovery algorithm as the browser, you can do so by enabling tolerant parsing:

```js
import css from "@eslint/css";

export default [
    {
        files: ["**/*.css"],
        plugins: {
            css,
        },
        language: "css/css",
        languageOptions: {
            tolerant: true,
        },
        rules: {
            "css/no-empty-blocks": "error",
        },
    },
];
```

When running tolerant mode, the CSS parser only reports unrecoverable syntax errors.

## Custom syntax support

The `customSyntax` option is an object that uses the [CSSTree format](https://github.com/csstree/csstree/blob/master/data/patch.json) for defining custom syntax, which allows you to specify at-rules, properties, and some types. For example, suppose you'd like to define a custom at-rule that looks like this:

```css
@my-at-rule "hello world!";
```

You can configure that syntax as follows:

```js
import css from "@eslint/css";

export default [
    {
        files: ["**/*.css"],
        plugins: {
            css,
        },
        language: "css/css",
        languageOptions: {
            customSyntax: {
                atrules: {
                    "my-at-rule": {
                        prelude: "<string>",
                    },
                },
            },
        },
        rules: {
            "css/no-empty-blocks": "error",
        },
    },
];
```

If you're using [Tailwind](https://tailwindcss.com), you can configure most of the custom syntax using the builtin `tailwindSyntax` object, like this:

```js
import css from "@eslint/css";
import { tailwindSyntax } from "@eslint/css/syntax";

export default [
    {
        files: ["**/*.css"],
        plugins: {
            css,
        },
        language: "css/css",
        languageOptions: {
            customSyntax: tailwindSyntax,
        },
        rules: {
            "css/no-empty-blocks": "error",
        },
    },
];
```

**Note:** The Tailwind syntax doesn't currently provide for the `theme()` function. This is a limitation of CSSTree that we hope will be resolved soon.

## Creating custom rules and using Code Explorer

As with `@eslint/json` and `@eslint/markdown`, `@eslint/css` allows the creation of custom rules. Using the [CSSTree AST format](https://github.com/csstree/csstree/blob/master/docs/ast.md), you can create your own rules in the same way you would for JavaScript. [Code Explorer](https://explorer.eslint.org) now supports CSS parsing and is a great resource to get started creating your own rules.

## Conclusion

With the addition of CSS support, ESLint continues to evolve into a versatile tool capable of linting a wide range of languages. This new capability allows developers to maintain consistent code quality across their entire codebase, including stylesheets. The `@eslint/css` plugin leverages the robust CSSTree project to provide accurate and comprehensive linting rules for CSS. By enforcing best practices and catching common errors, it helps developers write cleaner and more maintainable CSS code.

The introduction of tolerant parsing and custom syntax support further enhances the flexibility of ESLint, making it adaptable to various coding styles and project requirements. Whether you're working with standard CSS or using a framework like Tailwind, ESLint can be configured to meet your needs. The ability to create custom rules also empowers developers to enforce their own coding standards and practices.

We hope you find the new CSS linting capabilities useful and look forward to seeing how you integrate them into your projects. Thank you for your continued support and contributions to the ESLint community. Together, we can build a better, more reliable tool for developers everywhere.

As a reminder, ESLint is an independent open source project maintained by a group of volunteers in their spare time. If you enjoy using ESLint, please talk to your company about [sponsoring the project](/donate).
