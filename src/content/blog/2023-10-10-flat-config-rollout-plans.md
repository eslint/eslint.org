---
layout: post
title: "Flat config rollout plans"
teaser: "We have been working on the new configuration system for several years. Here's how we plan to roll it out."
tags:
  - Configuration
  - API
authors:
  - nzakas
categories:
  - API Changes
---

It may seem hard to believe, but the [RFC for ESLint's new configuration system](https://github.com/eslint/rfcs/tree/main/designs/2019-config-simplification), nicknamed flat config, was first written in 2019. It took until 2022 ([v8.21.0](https://eslint.org/blog/2022/08/eslint-v8.21.0-released/)) for us to release an experimental, opt-in version of flat config. Since then, we've been making changes and improvements based on feedback from the community. The plan was always to allow the current configuration system, nicknamed eslintrc, to exist alongside flat config for a period of time to allow a smooth transition for ESLint users. With flat config now feature complete, we are happy to share the rollout plan.

## Flat config by default in ESLint v9.0.0

When ESLint v9.0.0 is released, either the end of this year or beginning of next year, flat config will be the default configuration system and we will deprecate, but not remove, eslintrc. New features will be added only for flat config, so we encourage everyone to move off of eslintrc as quickly as possible to take advantage of everything v9.0.0 will offer.

What this change means for you depends on how you use ESLint, and if you have any questions or concerns, please stop by our [Discord](https://eslint.org/chat) to discuss with the team.

**For CLI users**, this means a few things:

* The ESLint CLI will search for `eslint.config.js` by default instead of a `.eslintrc.*` file.
* If an `eslint.config.js` file is not found, the CLI will consider this an error and won't run.
* If you want to use eslintrc, you'll need to set the `ESLINT_USE_FLAT_CONFIG` environment variable to `false`. When you do this, you'll get a deprecation warning in the console.

**For rule developers**, the `RuleTester` class will be equivalent to the current `FlatRuleTester` class. If you are passing any parser-related options to your rule tests, you'll need to update those to comply with the flat config format for those options.

You should also make sure that your rules aren't using `context.parserOptions` and `context.parserPath`. Instead, you should be using `context.languageOptions` and `context.languageOptions.parser`, which also work when ESLint is run in eslintrc mode. See our [previous post](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/) for more information.

**For plugin developers**, you should be updating your exported configs and shareable configs to use flat config format. The rest of your plugin, including rules and processors, don't require any changes.

**For API users**, you'll need to decide whether or not you want to support both configuration systems in the short term. The API in v9.0.0 will change in the following ways:

* The `ESLint` class will now be equivalent to the `FlatESLint` class in v8.x. With the exception of a few options, this should mostly be a transparent change.
* The `LegacyESLint` class will still be provided to allow access to the eslintrc functionality, but we will not be updating this class in v9.x. All new features will be implemented only for flat config-based APIs.
* The `FlatESLint` class will still be provided to avoid unnecessarily breaking existing implementations, but we encourage you to switch over to `ESLint` as soon as possible.
* The `shouldUseFlatConfig()` method will return `true` unless the `ESLINT_USE_FLAT_CONFIG` environment variable is `false`.
* The `Linter` class will switch to flat config mode by default, but you'll still be able to set it to use eslintrc by specifying the `configType` option in the constructor to be `"eslintrc"`, such as:

    ```js
    const linter = new Linter({ configType: "eslintrc" });
    ```

## eslintrc removed in ESLint v10.0.0

When ESLint v10.0.0 is released (end of 2024 or early 2025 in all likelihood), the eslintrc configuration system will be completely removed.

**For CLI users**, this means a few things:

* The ESLint CLI will search for `eslint.config.js` instead of a `.eslintrc.*` file.
* If an `eslint.config.js` file is not found, the CLI will consider this an error and won't run.
* The `ESLINT_USE_FLAT_CONFIG` environment variable will no longer be honored but won't throw an error.
* CLI options that were specific to eslintrc config files will be removed.

**For rule developers**, the `context.parserPath` and `context.parserOptions` properties will be removed.

**For plugin developers**, there are no additional concerns in v10.0.0.

**For API users**, you'll need to stop using the classes from the `/use-at-your-own-risk` entrypoint. The API in v10.0.0 will change in the following ways:

* The `ESLint` class will now be the only way to interact with the core.
* The `LegacyESLint` class will be removed.
* The `FlatESLint` class will be removed.
* The `shouldUseFlatConfig()` method will always return `true`.
* The `Linter` class `configType` constructor option will be invalid and throw an error.

## Conclusion

We've come a long way in the development of our new configuration system and we still have a long way to go. This is an intentionally slow rollout to make sure that everyone can comfortably update their config files with as little disruption as possible. Shifting an entire ecosystem over to a new API is a responsibility we take seriously, and we hope that is evident in the phased rollout plan. You can continue to follow our progress by watching [the implementation issue](https://github.com/eslint/eslint/issues/13481). If you need help with, or have questions about, any of what was discussed in this post, please [start a discussion](https://github.com/eslint/eslint/discussions/new) or stop by [Discord](https://eslint.org/chat) to talk with the team.
