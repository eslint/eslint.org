---
layout: post
title: html-eslint now supports ESLint language plugin
teaser: "Bringing HTML linting to ESLint’s new language-agnostic system."
tags:
  - Open Source
  - Linting
  - Parsing
authors:
  - yeonjuan
categories:
  - Announcements
---

In 2024, [ESLint announced](/blog/2024/07/whats-coming-next-for-eslint/) its plan to become a language-agnostic linter that is capable of linting languages other than JavaScript.
Since then, we've seen official support added for JSON, Markdown, and most recently, CSS.
Today, I'm excited to share that [html-eslint](https://html-eslint.org) now supports ESLint's language plugin for HTML.

## HTML linting with `html-eslint`

The [`@html-eslint/eslint-plugin`](https://www.npmjs.com/package/@html-eslint/eslint-plugin) plugin provides support for linting HTML code inside `.html` files. You can now configure HTML linting using ESLint's flat config and language plugin system. To get started, install it from npm:

```bash
npm install -D @html-eslint/eslint-plugin
```

Then update your configuration file:

```js
import html from "@html-eslint/eslint-plugin";

export default [
    // lint html files
    {
        files: ["**/*.html"],
        plugins: {
            html,
        },
        language: "html/html",
        rules: {
            "html/no-duplicate-class": "error",
        }
    }
]
```

The plugin includes a growing list of rules covering best practices, code styles, SEO and accessibility in HTML. You can find the list of supported rules [here](https://html-eslint.org/docs/rules).

Have an idea for a rule? [Open an issue](https://github.com/yeonjuan/html-eslint/issues).

## Template engine syntax support

Rather than using plain HTML, some projects use template engines like Handlebars, which introduce non-standard syntax such as {% raw %}`{{variable}}`{% endraw %}.

`html-eslint` is designed to offer support for custom syntax patterns used in popular template engines. This will allow users to configure html-eslint to tolerate these syntaxes.

```js
import html from "@html-eslint/eslint-plugin";

export default [
    // lint html files
    {
        files: ["**/*.html"],
        plugins: {
            html,
        },
        language: "html/html",
        languageOptions: {
            // This tells the parser to treat {% raw %}{{ ... }}{% endraw %} as template syntax,
            // so it won’t try to parse contents inside as regular HTML
            templateEngineSyntax: {
                {% raw %}"{{": "}}"{% endraw %},
            },
        },
        rules: {
            "html/require-img-alt": "error"
        }
    }
]
```

## Linting HTML code inside JavaScript Template Literal

In addition to standalone HTML files, `html-eslint` also supports linting HTML inside JavaScript and TypeScript template literals, such as:

```js
html`<div class="box">${content}</div>`;

// or

const code = /* html */ `<img class="image" src=${src}/>`;
```

This is especially useful when working with libraries like [Lit](https://lit.dev/), where HTML is commonly written inside tagged template literals.

To enable this, you don’t need to set a language. Just apply `html-eslint` rules to your JavaScript or TypeScript files, and the plugin will detect and lint HTML within template literals.

```js
import html from "@html-eslint/eslint-plugin";

export default [
    {
        files: ["**/*.js", "**/*.ts"],
        plugins: {
            html,
        },
        rules: {
            "html/require-img-alt": "error",
        },
    },
];
```

## Conclusion

With language plugin support, `html-eslint` now works seamlessly with ESLint’s new architecture. Whether you're maintaining static HTML, building components in [Lit](https://lit.dev/) or web frameworks, or embedding HTML inside JavaScript, `html-eslint` now integrates cleanly with your ESLint configuration.

We hope you find the new HTML linting features helpful and look forward to seeing how you incorporate them into your projects. We’d love to hear your thoughts, feature suggestions, or ideas for new rules.
Thank you for your support and interest in the `html-eslint` project!
