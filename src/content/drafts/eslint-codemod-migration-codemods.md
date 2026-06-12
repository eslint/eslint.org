---
layout: post
title: ESLint partners with Codemod on official migration codemods
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

We are excited to announce a partnership between ESLint and [Codemod](https://codemod.com), an [OpenJS Foundation](https://openjsf.org) partner, to create a better migration experience for ESLint users, starting with the ESLint v8 to v9 and v9 to v10 migrations. All official ESLint codemods can be found in the [eslint/codemods](https://github.com/eslint/codemods) repo, and through the [Codemod Registry](https://codemod.link/eslint).

## ESLint v8 to v9 migration

For v8 to v9 migration, we've released two codemods: one to help upgrade ESLint config, and another for the custom rules:

```shell
npx codemod @eslint/v8-to-v9-config
```

This codemod automatically migrates ESLint v8 configuration files to ESLint v9 flat config format, updating config structure, rule schemas, plugins, ignores, and deprecated JSDoc rules while preserving existing behavior as much as possible. learn more [here](https://app.codemod.com/registry/@eslint/v8-to-v9-config).

```shell
npx codemod @eslint/v8-to-v9-custom-rules
```

This codemod migrates custom ESLint rules from v8 to v9 by converting function-style rules to the new object format and updating deprecated rule APIs to their ESLint v9-compatible equivalents. Learn more [here](https://app.codemod.com/registry/@eslint/v8-to-v9-custom-rules).

For more details about what's new in v9 and how to adopt the new features, refer to the [official ESLint upgrade guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0), and the [blog post for v9 custom rules](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/).

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

### About Codemod

Codemod is an open source platform for building, sharing, and running automated code migrations at scale. Its platform includes JSSG, a codemod runtime and workflow engine that supports multi-step transformations and combines deterministic, compiler-aware transformations with AI-powered steps to deliver the right balance of reliability, efficiency, and flexibility.

Codemod is an OpenJS Foundation partner, and its tooling has been adopted by projects such as React, Node.js, Express, React Router, Nuxt.js, pnpm, Webpack, MSW, i18next, and many other open source projects. The source code for the Codemod CLI and engine is available on [GitHub](https://github.com/codemod-com/codemod).

The ESLint codemods will live in [eslint/codemods](https://github.com/eslint/codemods). Community members are encouraged to open issues for missing codemods or contribute new ones through pull requests. Once reviewed and merged by maintainers, codemods are automatically published to the Codemod Registry through GitHub Actions.

### Key features of the Codemod open source toolkit

* Workspace-wide semantic analysis
* Cross-file refactors
* Multi-language support
* Repository-scale performance
* A simple, agent-friendly API
* Built-in AST inspection through MCP
* Secure sandboxed execution
* Metrics and codebase mining
* Native support for multi-file transformations

Check out [Codemod docs](https://docs.codemod.com) to learn more about JSSG and its features.
