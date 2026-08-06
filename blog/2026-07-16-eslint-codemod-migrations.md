---
layout: post
title: Automating ESLint migrations with Codemod
teaser: "ESLint and Codemod are partnering to deliver official codemods for ESLint migrations."
tags:
  - Migration
  - Codemods
  - Tools
authors:
  - alexbit-codemod
categories:
  - Announcements
---

We are excited to announce a partnership between ESLint and [Codemod](https://codemod.com) to create a better migration experience for ESLint users, starting with the ESLint v8 to v9 and v9 to v10 migrations. All official ESLint codemods live in [eslint/codemods](https://github.com/eslint/codemods) and on the [Codemod Registry](https://codemod.link/eslint). Community members are encouraged to open issues for missing codemods or contribute new ones through pull requests. Once reviewed and merged by maintainers, codemods are automatically published to the Codemod Registry through GitHub Actions.

## What is Codemod?

Codemod is an open source platform for building, sharing, and running automated code migrations at scale. It is an [OpenJS Foundation](https://openjsf.org) partner, and its tooling has been adopted by projects such as React, Node.js, Express, React Router, Nuxt.js, pnpm, Webpack, MSW, i18next, and more.

Its platform includes JSSG (JS ast-grep), a codemod runtime and workflow engine that supports multi-step transformations and combines deterministic, compiler-aware transformations with AI-powered steps to deliver the right balance of reliability, efficiency, and flexibility. The source code for the Codemod CLI and engine is available on [GitHub](https://github.com/codemod/codemod).

Key features of Codemod include:

* Workspace-wide semantic analysis
* Cross-file refactors
* Multi-language support
* Repository-scale performance
* A simple, agent-friendly API
* Built-in AST inspection through MCP
* Secure sandboxed execution
* Metrics and codebase mining
* Native support for multi-file transformations

Check out the [Codemod docs](https://docs.codemod.com) to learn more about JSSG (JS ast-grep), Codemod's open source toolkit for building codemods, and explore its features.

## ESLint v8 to v9 migration

For v8 to v9 migration, we've released two codemods: one to help upgrade ESLint config, and another for custom rules.

### Migrating configuration with `@eslint/v8-to-v9-config`

```shell
npx codemod @eslint/v8-to-v9-config
```

Unlike the original [ESLint Configuration Migrator](https://npmjs.com/package/@eslint/migrate-config), this codemod runs as a workspace migration. It can:

* Extract `eslintConfig` from `package.json` and generate `eslint.config.mjs`
* Clean up duplicate `/* eslint */` comments and invalid `/* exported */` comments in source files
* Remove deprecated `require-jsdoc` and `valid-jsdoc` rule references from inline comments
* Migrate those JSDoc rules to [`eslint-plugin-jsdoc`](https://www.npmjs.com/package/eslint-plugin-jsdoc) using `jsdoc({ config: "flat/recommended", ... })`
* Add a `// TODO: Migrate settings manually` comment when custom settings need review
* Handle several ESLint v9 rule option changes, including `no-unused-vars`, `no-useless-computed-key`, `no-sequences`, `no-constructor-return`, `camelcase`, and `no-restricted-imports`
* Convert `env` to `languageOptions.globals` using the [`globals`](https://www.npmjs.com/package/globals) package
* Map `excludedFiles` to per-config `ignores`
* Move `noInlineConfig` and `reportUnusedDisableDirectives` to `linterOptions`
* Import parser packages and plugins
* Use `defineConfig` and `globalIgnores` from [`@eslint/config-helpers`](https://www.npmjs.com/package/@eslint/config-helpers)
* Merge ignore patterns from both `.eslintignore` and `.gitignore`

For JavaScript config files, the codemod works from the AST and can resolve simple bindings such as `const` values, identifiers, and spreads. More advanced logic, such as functions, conditionals, and dynamic `require()` calls, still needs manual review. The workflow also supports options such as `--target`, `eslintConfigCustomName`, and `codeFormattingCommandEnabled`, and prompts you to install required packages after it runs.

The codemod does not migrate `--ext` CLI usage, so you still need to [create a config entry](https://github.com/eslint/rewrite/tree/main/packages/migrate-config#--ext) for the file extensions you previously passed on the command line. Learn more on [`@eslint/v8-to-v9-config`'s registry page](https://app.codemod.com/registry/@eslint/v8-to-v9-config) and in the [configuration migration guide](/docs/latest/use/configure/migration-guide).

### Migrating custom rules with `@eslint/v8-to-v9-custom-rules`

```shell
npx codemod @eslint/v8-to-v9-custom-rules
```

**Important:** Run this codemod only in directories containing ESLint rule files. It may incorrectly transform other JavaScript files that export functions.

The codemod supports CommonJS (`module.exports = function (context) { ... }`), ES Modules (`export default function (context) { ... }`), indirect exports (`function rule() {}` and `module.exports = rule`), higher-order wrappers such as `wrapRule(function (context) { ... })`, and rules created with `@typescript-eslint/utils` `RuleCreator`.

It performs a comprehensive migration of custom ESLint rules from v8 to v9, including:

* **Removed `context` methods** — migrates calls to `sourceCode` equivalents (for example, `context.getSource()` → `sourceCode.getText()`), including methods that moved with different signatures such as `getScope()`, `getAncestors()`, `getDeclaredVariables()`, and `markVariableAsUsed()`
* **`context` methods becoming properties** — migrates `getSourceCode()`, `getFilename()`, `getPhysicalFilename()`, and `getCwd()` to their property equivalents with compatibility fallbacks
* **Removed `context.getComments()`** — converts node-specific calls to `getCommentsBefore` / `getCommentsInside` / `getCommentsAfter(node)`
* **Removed `CodePath#currentSegments`** — adds code path tracking logic (verify the result matches your rule's needs)
* **Function-style rules are no longer supported** — converts to the object format with `meta` and `create`

The codemod also moves `module.exports.schema` into `meta`, converts old-style `context.report(node, message)` calls to object format, detects fixable rules, and adds `fixable: "code"` to `meta`.

It does **not** cover `context.parserOptions` and `context.parserPath`, because those properties are not removed until ESLint v10.0.0. Prefer `context.languageOptions` (and `context.languageOptions.parser` when you need the parser) instead.

Not every change can be fully automated. After running the codemod:

1. **Review TODO comments.** Search for `TODO` in your migrated files. If a rule uses `context.options`, the codemod may leave a placeholder like `schema: [] // TODO: Define schema - this rule uses context.options` that you need to replace with a valid JSON schema.
2. **Review comment method changes.** `getCommentsBefore()`, `getCommentsInside()`, and `getCommentsAfter()` require a `node` argument, and no-argument `context.getComments()` calls should use `sourceCode.getAllComments()`.
3. **Review skipped higher-order wrappers.** If a wrapper passes configuration as the second argument (for example, `wrapRule(rule, config)`), confirm whether any manual migration is needed.
4. **Test your custom rules** by running your rule test suite (for example, `npm test`).

Learn more on [`@eslint/v8-to-v9-custom-rules`'s registry page](https://app.codemod.com/registry/@eslint/v8-to-v9-custom-rules). For the full list of API changes and how to adopt them manually, see the [ESLint v9 migration guide](/docs/latest/use/migrate-to-9.0.0) and the [blog post for v9 custom rules](/blog/2023/09/preparing-custom-rules-eslint-v9/).

## ESLint v9 to v10 migration

Upgrade your ESLint project from v9 to v10 with the following codemod:

```shell
npx codemod @eslint/v9-to-v10
```

This recipe includes four individual codemods, each of which can also be run independently:

* `@eslint/v9-to-v10-config`: Remove legacy env vars and CLI flags
* `@eslint/v9-to-v10-custom-rules`: Replace removed context and SourceCode methods
* `@eslint/v9-to-v10-ruletester`: Cleanup RuleTester test cases
* `@eslint/v9-to-v10-linter-api`: Fix Linter/ESLint API usage

Check out [Codemod Registry](https://codemod.link/eslint) to learn more about this recipe and its codemods. For more details about what's new in v10 and how to adopt the new features, refer to the [official ESLint upgrade guide](/docs/latest/use/migrate-to-10.0.0).

## Conclusion

Upgrading across major ESLint versions has often meant carefully translating configs, custom rules, and related APIs by hand. With this partnership, official Codemod workflows give you a faster starting point for the v8 to v9 and v9 to v10 migrations, while still leaving room for the manual review steps that complex projects need.

You can try the codemods today through the [Codemod Registry](https://codemod.link/eslint), and find the source in [eslint/codemods](https://github.com/eslint/codemods). If you run into a gap, open an issue or contribute a new codemod. For questions about the migrations themselves, see the [v9](/docs/latest/use/migrate-to-9.0.0) and [v10](/docs/latest/use/migrate-to-10.0.0) upgrade guides, or stop by [Discord](https://eslint.org/chat) to talk with the team.
