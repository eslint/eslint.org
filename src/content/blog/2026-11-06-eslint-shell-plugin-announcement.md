---
layout: post
title: ESLint now officially supports linting of shell scripts
teaser: "Taking another step towards providing a language-agnostic platform for source code linting."
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
plan to make ESLint a more general-purpose linter capable of linting any
language. Since then, we've added official support for JSON, Markdown, and CSS.
Today, we're happy to add shell scripts to that list with the introduction of
the `@eslint/shell` plugin.

## Shell linting with `@eslint/shell`

The [`@eslint/shell`](https://npmjs.com/package/@eslint/shell) plugin is an
officially supported language plugin for ESLint. It provides parsing for shell
scripts, a set of rules inspired by [ShellCheck](https://www.shellcheck.net),
and a recommended configuration. To use it, install it from npm:

```shell
npm install @eslint/shell -D
```

Then add the recommended configuration to your `eslint.config.js`:

```js
import { defineConfig } from "eslint/config";
import shell from "@eslint/shell";

export default defineConfig([
    {
        plugins: { shell },
        extends: ["shell/recommended"],
    },
]);
```

The recommended configuration uses Bash and enables rules that catch common
problems, such as unquoted expansions, unused variables, and unsafe `read`
usage. You can also configure the plugin manually and choose a shell dialect:

```js
import { defineConfig } from "eslint/config";
import shell from "@eslint/shell";

export default defineConfig([
    {
        files: ["**/*.sh"],
        plugins: { shell },
        language: "shell/posix",
        rules: {
            "shell/no-backticks": "error",
            "shell/no-unquoted-expansions": "error",
        },
    },
]);
```

The plugin supports Bash, POSIX `sh`, and MirBSD Korn shell (mksh). Its rules
cover issues such as legacy command substitutions, iterating over `ls` output,
unquoted expansions, and variables in `printf` format strings. For the complete
list of rules and configuration options, see the
[README](https://npmjs.com/package/@eslint/shell).

Have an idea for a rule? [Open an issue](https://github.com/eslint/shell/issues).

## Creating custom rules

The `@eslint/shell` plugin parses shell scripts into an ESTree-style syntax
tree, which ESLint rules can traverse just as they do for JavaScript. This
means you can write custom rules to enforce the conventions that matter to
your project. The parser is built on
[`mvdan-sh`](https://github.com/mvdan/sh), the parser used by `shfmt`.
You can explore the shell syntax tree in the
[ESLint Code Explorer](https://explorer.eslint.org).

## Conclusion

Shell scripts are an important part of many projects, from build and release
automation to local development tools. With `@eslint/shell`, you can lint
shell scripts alongside the rest of your code using ESLint's configuration
system and familiar rule APIs.

With the addition of shell support, ESLint continues to grow into a versatile
tool capable of linting many kinds of source files. We hope this plugin helps
you find issues in your scripts and makes it easier to maintain consistent
quality across your projects.

As a reminder, ESLint is an independent open source project maintained by a
group of volunteers in their spare time. If you enjoy using ESLint, please
talk to your company about [sponsoring the project](/donate).
