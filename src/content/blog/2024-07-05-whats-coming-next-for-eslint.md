---
layout: post
title: What's coming next for ESLint
teaser: "The new configuration system is just the beginning of significant changes coming to ESLint."
tags:
  - Languages
  - Tools
  - Architecture
authors:
  - nzakas
categories:
  - Announcements
---

When we [released ESLint v9.0.0](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/) in April, it was the first major release in over 18 months and formally introduced the [new](https://eslint.org/blog/2022/08/new-config-system-part-1/) [configuration](https://eslint.org/blog/2022/08/new-config-system-part-2/) [system](https://eslint.org/blog/2022/08/new-config-system-part-3/). ESLint v9.0.0 also made some [rule API changes](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/) to prepare the core for what's coming next. After the release, we spent a lot of time [creating compatibility utilities](https://eslint.org/blog/2024/05/eslint-compatibility-utilities/), a [configuration migration tool](https://eslint.org/blog/2024/05/eslint-configuration-migrator/), and a [rule API transform utility](https://github.com/eslint/eslint-transforms) to help the ecosystem move to ESLint v9.0.0. All of that work was necessary for us to move on to the next significant changes coming to ESLint.

## Language plugins

[Two years ago](https://github.com/eslint/eslint/issues/15562), the TSC decided that it was time to open up ESLint to make it possible to lint languages other than JavaScript. Practically speaking, there are a lot of things that the ESLint core does that are not specific to JavaScript: the finding and reading of files, the loading of file-specific configuration, collecting rule violations, outputting results to the console, and so on. Further, we kept finding plugins that were linting other languages (like [GraphQL](https://the-guild.dev/graphql/eslint/docs) and [HTML](https://html-eslint.org/)) from within ESLint, passing a different AST through the same logic that JavaScript was using. That's inefficient and error-prone, and there had to be a better way.

In 2023, the [language plugins RFC](https://github.com/eslint/rfcs/blob/main/designs/2022-languages/README.md) was formally approved. In order to implement this RFC, however, we needed to officially ship the new configuration and to make some rule API changes. The rule API changes, in particular, were necessary to separate what the ESLint core was doing and what a language plugin would provide to custom rules. Once those two changes were available, we started the laborious task of refactoring the ESLint core to extract the JavaScript-specific parts from the language-agnostic parts.

Here's what to expect going forward (with no specific timetable as everything is dependent upon contributor availability):

* **`@eslint/js`** - We will slowly move all of the JavaScript-related functionality into the `@eslint/js` package, including rules and documentation. We will reuse the existing [Espree repo](https://github.com/eslint/espree/issues/609) and convert it into a monorepo containing Espree, `eslint-scope`, `eslint-visitor-keys`, and all of the core JavaScript rules. This will allow us to deal with everything JavaScript-related in a single repo.
* **`@eslint/json`** - Our first language plugin will allow ESLint to lint JSON files natively. This plugin will contain the parsing logic and all of the related rules and documentation. Similar to `@eslint/json`, this will allow us to have a single repo to focus on JSON linting, further moving any language-specific functionality away from the core.
* **`@eslint/markdown`** - [`eslint-plugin-markdown`](https://github.com/eslint/eslint-plugin-markdown) will be renamed to `@eslint/markdown` to better align with the other packages. We'll add the ability to lint Markdown and Markdown-specific rules.

The current plan is to have these three official ESLint language plugins with the hopes that they serve as examples for the ecosystem to develop more language plugins.

With language-specific functionality extracted into separate repositories, that leaves us with the task of rewriting the core completely.

## Core rewrite

The architecture of the code in the ESLint repository hasn't changed considerably since ESLint was first created 11 years ago. As a result, there is a lot of technical debt that has accumulated and prevents us from making some of the changes we'd like to make. Some of the problems we currently face:

* **Synchronous core logic.** The `Linter` class is completely synchronous, meaning we can't support asynchronous rules or asynchronous parsing, two feature requests we receive frequently. We'd need to either add a second class that works asynchronously or add alternate methods to `Linter` that worked asynchronously. Both options looked like significant work, effectively rewriting huge parts of the core.
* **Limited API.** The public API is limited because ESLint, at the start, was never intended to be used as an API. The initial `linter` object was meant only to enable a browser demo. It was later replaced by the `Linter` class, and even later, an `ESLint` class to fully mimic the command line interface. When we want to expose new functionality, it needs to exist one of these two similar-sounding APIs, and unfortunately, the main decision point is whether or not the API needs to be available in the browser. If so, then it needs to be in `Linter`, otherwise it needs to be in `ESLint`. This is both confusing and not sustainable in the long term.
* **Lack of type checking.** We've had the desire to add type checking into the repository to help catch potential problems, but attempts to do this in the past required a lot of work and coordination. Eventually, we came to the conclusion that it wasn't worth the effort.
* **Stuck in CommonJS.** Similar to the type checking situation, while there is a desire to convert the codebase into ESM, the amount of work it would take to do so is prohibitive. We'd spend a lot of time on the conversion just to end up with an equivalent feature set.

After thinking through the options of continually to incrementally change the existing core or starting from scratch, we [decided](https://github.com/eslint/rewrite/blob/main/decisions/001-rewrite-core.md) that it was time to start from scratch. While we firmly believe that a complete rewrite represents a significant risk, after 11 years, we can honestly say that we got the most out of the initial architecture.

Going forward, here's what you can expect:

* **A new repository.** The [`eslint/rewrite`](https://github.com/eslint/rewrite) repository is the new home for our language-agnostic work. It's a monorepo where we'll manage all of the packages that directly relate to the core in some way.
* **Modern packages.** Every package in `eslint/rewrite` will be up to modern standards, publishing ESM entrypoints along with type definitions. When possible, we'll also publish CommonJS entrypoints. All packages are published with provenance to both npm and JSR (when applicable).
* **A runtime-agnostic core.** The `@eslint/core` package will contain a runtime-agnostic API for ESLint along with type definitions for the core. We will build this package up slowly over time as we design the new API, extracting pieces of functionality out of the `eslint` package. With more JavaScript runtimes emerging each year, we feel that a runtime-agnostic core is becoming more important.
* **A composeable API.** Instead of bundling all functionality into one or two classes, the new API will be composeable, with many purpose-built classes designed to be used together. Class will follow the single-responsibility principle, making it easier to make changes and customize ESLint inside of integrations.
* **A new CLI.** We'll be rewriting the CLI from scratch in the `@eslint/node` package. We'll start with the most common use cases and reevaluate each flag to make sure it still makes sense for a language-agnostic core. Using a different package name allows us to experiment with the new CLI without disrupting the use of the `eslint` package. This package will also export additional Node.js-specific APIs.
* **Parallel development.** We will continue to maintain `eslint` and the rewrite in parallel so that we aren't sacrificing the existing package for something completely new. The goal is for the `eslint` package to slowly become smaller and make use of the APIs contained in `@eslint/core` so we are limiting duplication as much as possible.

## Conclusion

We are very excited for this future direction of ESLint as we think this represents the next logical step in ESLint's evolution. Turning ESLint into a language-agnostic linter that anyone can write plugins for will simplify development by reducing the number of linting tools and editor extensions any one project needs. Further, rewriting our core into a more composeable API allows easier and more customizable integrations, along with owning our own type definitions to ensure compatibility with the APIs.

ESLint has made it through 11 years with its current architecture, and we hope that these changes will get us through the next 11 years.
