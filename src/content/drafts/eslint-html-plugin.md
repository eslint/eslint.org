---
layout: post
title: ESLint can now lint HTML using the html-eslint language plugin
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
Since then, we've seen official support added for [JSON and Markdown](https://eslint.org/blog/2024/10/eslint-json-markdown-support/), and most recently, [CSS](https://eslint.org/blog/2025/02/eslint-css-support/).
Today, I'm excited to share that [`html-eslint`](https://html-eslint.org) now provides an ESLint language plugin for linting HTML.

## Linting HTML with `html-eslint`

The [`@html-eslint/eslint-plugin`](https://www.npmjs.com/package/@html-eslint/eslint-plugin) package provides support for linting HTML code inside `.html` files. To get started, install it from npm:

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

The plugin includes a growing list of [rules](https://html-eslint.org/docs/rules) covering best practices, code style, search engine optimization (SEO), and accessibility. Have an idea for a rule? [Open an issue](https://github.com/yeonjuan/html-eslint/issues).

## HTML AST Support in Code Explorer

We're also happy to share that [Code Explorer](https://explorer.eslint.org/#eslint-explorer=IntcInN0YXRlXCI6e1widG9vbFwiOlwiYXN0XCIsXCJjb2RlXCI6e1wiamF2YXNjcmlwdFwiOlwiLyoqXFxuICogVHlwZSBvciBwYXN0ZSBzb21lIEphdmFTY3JpcHQgaGVyZSB0byBsZWFybiBtb3JlIGFib3V0XFxuICogdGhlIHN0YXRpYyBhbmFseXNpcyB0aGF0IEVTTGludCBjYW4gZG8gZm9yIHlvdS5cXG4gKiBcXG4gKiBUaGUgdGhyZWUgdGFicyBhcmU6XFxuICogXFxuICogLSBBU1QgLSBUaGUgQWJzdHJhY3QgU3ludGF4IFRyZWUgb2YgdGhlIGNvZGUsIHdoaWNoIGNhblxcbiAqICAgYmUgdXNlZnVsIHRvIHVuZGVyc3RhbmQgdGhlIHN0cnVjdHVyZSBvZiB0aGUgY29kZS4gWW91XFxuICogICBjYW4gdmlldyB0aGlzIHN0cnVjdHVyZSBhcyBKU09OIG9yIGluIGEgdHJlZSBmb3JtYXQuXFxuICogLSBTY29wZSAtIFRoZSBzY29wZSBzdHJ1Y3R1cmUgb2YgdGhlIGNvZGUsIHdoaWNoIGNhbiBiZVxcbiAqICAgdXNlZnVsIHRvIHVuZGVyc3RhbmQgaG93IHZhcmlhYmxlcyBhcmUgZGVmaW5lZCBhbmRcXG4gKiAgIHdoZXJlIHRoZXkgYXJlIHVzZWQuXFxuICogLSBDb2RlIFBhdGggLSBUaGUgY29kZSBwYXRoIHN0cnVjdHVyZSBvZiB0aGUgY29kZSwgd2hpY2hcXG4gKiAgIGNhbiBiZSB1c2VmdWwgdG8gdW5kZXJzdGFuZCBob3cgdGhlIGNvZGUgaXMgZXhlY3V0ZWQuXFxuICogXFxuICogWW91IGNhbiBjaGFuZ2UgdGhlIHdheSB0aGF0IHRoZSBKYXZhU2NyaXB0IGNvZGUgaXMgaW50ZXJwcmV0ZWRcXG4gKiBieSBjbGlja2luZyBcXFwiSmF2YVNjcmlwdFxcXCIgaW4gdGhlIGhlYWRlciBhbmQgc2VsZWN0aW5nIGRpZmZlcmVudFxcbiAqIG9wdGlvbnMuXFxuICovXFxuXFxudmFyIHggPSA1O1xcblxcbmltcG9ydCBqcyBmcm9tIFxcXCJAZXNsaW50L2pzXFxcIjtcXG5cXG5mdW5jdGlvbiBnZXRDb25maWcoKSB7XFxuICAgIHJldHVybiB7XFxuICAgICAgICBydWxlczoge1xcbiAgICAgICAgICAgIFxcXCJwcmVmZXItY29uc3RcXFwiOiBcXFwid2FyblxcXCJcXG4gICAgICAgIH1cXG4gICAgfTtcXG59XFxuXFxuZXhwb3J0IGRlZmF1bHQgW1xcbiAgICAuLi5qcy5jb25maWdzLnJlY29tbWVuZGVkLFxcbiAgICBnZXRDb25maWcoKVxcbl07XCIsXCJqc29uXCI6XCIvKipcXG4gKiBUeXBlIG9yIHBhc3RlIHNvbWUgSlNPTiBoZXJlIHRvIGxlYXJuIG1vcmUgYWJvdXRcXG4gKiB0aGUgc3RhdGljIGFuYWx5c2lzIHRoYXQgRVNMaW50IGNhbiBkbyBmb3IgeW91LlxcbiAqXFxuICogVGhlIHRhYnMgYXJlOlxcbiAqXFxuICogLSBBU1QgLSBUaGUgQWJzdHJhY3QgU3ludGF4IFRyZWUgb2YgdGhlIGNvZGUsIHdoaWNoIGNhblxcbiAqICAgYmUgdXNlZnVsIHRvIHVuZGVyc3RhbmQgdGhlIHN0cnVjdHVyZSBvZiB0aGUgY29kZS4gWW91XFxuICogICBjYW4gdmlldyB0aGlzIHN0cnVjdHVyZSBhcyBKU09OIG9yIGluIGEgdHJlZSBmb3JtYXQuXFxuICpcXG4gKiBZb3UgY2FuIGNoYW5nZSB0aGUgd2F5IHRoYXQgdGhlIEpTT04gY29kZSBpcyBpbnRlcnByZXRlZFxcbiAqIGJ5IGNsaWNraW5nIFxcXCJKU09OXFxcIiBpbiB0aGUgaGVhZGVyIGFuZCBzZWxlY3RpbmcgZGlmZmVyZW50XFxuICogb3B0aW9ucy5cXG4gKlxcbiAqIFRoaXMgZXhhbXBsZSBpcyBpbiBKU09OQyBtb2RlLCB3aGljaCBhbGxvd3MgY29tbWVudHMuXFxuICovXFxuXFxue1xcbiAgICBcXFwia2V5MVxcXCI6IFt0cnVlLCBmYWxzZSwgbnVsbF0sXFxuICAgIFxcXCJrZXkyXFxcIjoge1xcbiAgICAgICAgXFxcImtleTNcXFwiOiBbMSwgMiwgXFxcIjNcXFwiLCAxZTEwLCAxZS0zXVxcbiAgICB9XFxufVwiLFwibWFya2Rvd25cIjpcIkZvbyBcXFxcW2VzbGludFxcXFxdXFxuXFxuXCIsXCJjc3NcIjpcImEgeyBtYXJnaW46IC0tc3BhY2luZyg0KTsgfVwiLFwiaHRtbFwiOlwiPCFET0NUWVBFIGh0bWw%2BXFxuPCEtLVxcblR5cGUgb3IgcGFzdGUgc29tZSBIVE1MIGhlcmUgdG8gbGVhcm4gbW9yZSBhYm91dFxcbnRoZSBzdGF0aWMgYW5hbHlzaXMgdGhhdCBFU0xpbnQgY2FuIGRvIGZvciB5b3UuXFxuXFxuVGhlIHRhYnMgYXJlOlxcblxcbi0gQVNUIC0gVGhlIEFic3RyYWN0IFN5bnRheCBUcmVlIG9mIHRoZSBjb2RlLCB3aGljaCBjYW5cXG5iZSB1c2VmdWwgdG8gdW5kZXJzdGFuZCB0aGUgc3RydWN0dXJlIG9mIHRoZSBjb2RlLiBZb3VcXG5jYW4gdmlldyB0aGlzIHN0cnVjdHVyZSBhcyBKU09OIG9yIGluIGEgdHJlZSBmb3JtYXQuXFxuLS0%2BXFxuXFxuPGh0bWwgbGFuZz1cXFwiZW5cXFwiPlxcbiAgICA8aGVhZD5cXG4gICAgICAgIDxtZXRhIGNoYXJzZXQ9XFxcIlVURi04XFxcIj5cXG4gICAgICAgIDx0aXRsZT5IVE1MPC90aXRsZT5cXG4gICAgPC9oZWFkPlxcbiAgICA8Ym9keT5cXG4gICAgICAgIDxwPlRleHQ8L3A%2BXFxuICAgIDwvYm9keT5cXG48L2h0bWw%2BXCJ9LFwibGFuZ3VhZ2VcIjpcImh0bWxcIixcImpzT3B0aW9uc1wiOntcInBhcnNlclwiOlwiZXNwcmVlXCIsXCJzb3VyY2VUeXBlXCI6XCJtb2R1bGVcIixcImVzVmVyc2lvblwiOlwibGF0ZXN0XCIsXCJpc0pTWFwiOnRydWV9LFwianNvbk9wdGlvbnNcIjp7XCJqc29uTW9kZVwiOlwianNvbmNcIn0sXCJjc3NPcHRpb25zXCI6e1wiY3NzTW9kZVwiOlwiY3NzXCIsXCJ0b2xlcmFudFwiOmZhbHNlfSxcIm1hcmtkb3duT3B0aW9uc1wiOntcIm1hcmtkb3duTW9kZVwiOlwiY29tbW9ubWFya1wifSxcIndyYXBcIjp0cnVlLFwidmlld01vZGVzXCI6e1wiYXN0Vmlld1wiOlwidHJlZVwiLFwic2NvcGVWaWV3XCI6XCJmbGF0XCIsXCJwYXRoVmlld1wiOlwiZ3JhcGhcIn0sXCJwYXRoSW5kZXhcIjp7XCJpbmRleFwiOjAsXCJpbmRleGVzXCI6Mn0sXCJlc3F1ZXJ5U2VsZWN0b3JcIjp7XCJzZWxlY3RvclwiOlwiXCJ9fSxcInZlcnNpb25cIjowfSI%3D) now supports `html-eslint`, allowing you to view and explore the HTML AST directly in your browser. You can refer to this to implement custom rules for HTML.

## Template engine syntax support

Rather than using plain HTML, some projects use template engines like [Handlebars](https://handlebarsjs.com/), which introduce non-standard syntax such as {% raw %}`{{variable}}`{% endraw %}.

`html-eslint` is designed to offer support for custom syntax patterns used in popular template engines. This allows users to configure `html-eslint` to tolerate these syntaxes. Here's an example:

```js
import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin";

export default defineConfig([
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
]);
```

## Linting HTML code inside JavaScript template literals

In addition to standalone HTML files, `html-eslint` also supports linting HTML inside JavaScript and TypeScript template literals, such as:

```js
html`<div class="box">${content}</div>`;

// or

const code = /* html */ `<img class="image" src=${src}/>`;
```

This is especially useful when working with libraries like [Lit](https://lit.dev/), where HTML is commonly written inside tagged template literals.

To enable this, you don’t need to set a language. Just apply `html-eslint` rules to your JavaScript or TypeScript files, and the plugin will detect and lint HTML within template literals.

```js
import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin";

export default defineConfig([
    {
        files: ["**/*.js", "**/*.ts"],
        plugins: {
            html,
        },
        rules: {
            "html/require-img-alt": "error",
        },
    },
]);
```

## Conclusion

With language plugin support, `html-eslint` now works seamlessly with ESLint’s new architecture. Whether you're maintaining static HTML, building components in [Lit](https://lit.dev/) or web frameworks, or embedding HTML inside JavaScript, `html-eslint` now integrates cleanly with your ESLint configuration.

We hope you find the new HTML linting features helpful and look forward to seeing how you incorporate them into your projects. We’d love to hear your thoughts, feature suggestions, or ideas for new rules.
Thank you for your support and interest in the `html-eslint` project!
