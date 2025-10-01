---
layout: post
title: What's coming in ESLint v10.0.0
teaser: "We want to share with you the significant changes that will be coming in v10.0.0 so you can better prepare for the changes and understand why the changes are necessary."
tags:
  - major
  - breaking changes
authors:
  - nzakas
categories:
  - API Changes
---

The Technical Steering Committee (TSC) has finalized the features for ESLint v10.0.0. This post outlines our plans for v10.0.0. You can keep up to date with everything that is planned for v10.0.0 on our [project board](https://github.com/orgs/eslint/projects/6).

## Development plan

Similar to v9.0.0, we will develop v10.0.0 in phases to ensure stability and gather community feedback:

1. **Alpha.** The alpha release will include the most significant breaking changes that we expect will cause the most disruption for existing users. This early release will help us gather feedback and validate our approach.
2. **Beta.** The beta release will include the remaining features and smaller breaking changes that will impact fewer users.

After the beta has been validated through community testing, we will publish one or more release candidates as we continue to fix bugs and address compatibility issues.

## Significant changes in v10.0.0-alpha

The following changes are planned for the alpha release and represent significant breaking changes.

### Dropping support for Node.js < v20.19.0

Following our Node.js version support policy for major releases, ESLint v10.0.0 will [require Node.js v20.19.0 or later](https://github.com/eslint/eslint/issues/19969). The new supported versions will be:

* Node.js v20.19.0 and above (Maintenance LTS)
* Node.js v22.13.0 and above (Active LTS)
* Node.js v24 and above (Current)

This change aligns with Node.js's release schedule as of 2025, where:

* Node.js v18 reached end-of-life in April 2025
* Node.js v20 is in Maintenance LTS until April 2026
* Node.js v22 became Active LTS in October 2024

The updated Node.js requirements will enable ESLint to leverage newer JavaScript features, including native support for `require(esm)` (available since Node.js v20.19.0), and improved performance characteristics of modern Node.js versions.

### Removal of eslintrc functionality

In ESLint v9.0.0, we deprecated the old eslintrc config system while leaving the functionality available for backwards compatibility. In v10.0.0, we are [removing the eslintrc config system](https://eslint.org/blog/2023/10/flat-config-rollout-plans/#eslintrc-removed-in-eslint-v10.0.0) completely. Specifically, this means:

1. The `ESLINT_USE_FLAT_CONFIG` environment variable is no longer honored.
1. The CLI no longer supports eslintrc-specific arguments (`--no-eslintrc`, `--env`, `--resolve-plugins-relative-to`, `--rulesdir`, `--ignore-path`).
1. `.eslintrc.*` and `.eslintignore` files will no longer be honored.
1. The `shouldUseFlatConfig()` method will always return `true`.
1. The `loadESLint()` function now always returns the `ESLint` class.
1. The `Linter` constructor `configType` argument can only be `"flat"` and will throw an error if `"eslintrc"` is passed.
1. The following `Linter` eslintrc-specific methods are removed:
    * `defineParser()`
    * `defineRule()`
    * `defineRules()`
    * `getRules()`
1. The following changes to the `/use-at-your-own-risk` entrypoint:
    * `LegacyESLint` is removed
    * `FileEnumerator` is removed
    * `shouldUseFlatConfig()` method will always return `true`

### Updating `eslint:recommended` configuration

The `eslint:recommended` configuration will be [updated for v10.0.0](https://github.com/eslint/eslint/issues/19966) to include new rules that help catch common programming errors and improve code quality.

### Removing support for jiti < 2.2.0

ESLint v10.0.0 will [drop support for jiti versions prior to 2.2.0](https://github.com/eslint/eslint/issues/19765) when loading TypeScript configuration files due to known issues that can cause compatibility problems when configurations load certain plugins (as documented in [issue #19413](https://github.com/eslint/eslint/issues/19413))

### Updates to `Program` AST node range coverage

ESLint v10.0.0 will include a significant change to how the `Program` AST node's range is calculated, [updating it to span the entire source text](https://github.com/eslint/js/issues/648).

Currently, the `Program` node's range excludes leading and trailing comments/whitespace, which creates some unintuitive scenarios:

```javascript
// Leading comment
const x = 1;
// Trailing comment
```

* **Current:** `Program` range covers only `const x = 1;` (excludes comments)
* **New:** `Program` range covers the entire file from start to finish

### Removing deprecated rule context members

ESLint v10.0.0 will [remove several deprecated members from the rule context object](https://github.com/eslint/eslint/pull/20086) that have been deprecated since ESLint v9.0.0.

The following deprecated context members will no longer be available:

* **`context.getCwd()`** - Use `context.cwd` instead
* **`context.getFilename()`** - Use `context.filename` instead
* **`context.getPhysicalFilename()`** - Use `context.physicalFilename` instead
* **`context.getSourceCode()`** - Use `context.sourceCode` instead
* **`context.parserOptions`** - Use `context.languageOptions` or `context.languageOptions.parserOptions` instead
* **`context.parserPath`** - No replacement


### New configuration file lookup algorithm

The `v10_config_lookup_from_file` flag, which changes configuration lookup to start from the file being linted rather than the current working directory, will [become the default](https://github.com/eslint/eslint/issues/19967) in v10.0.0.

This change ensures that ESLint configuration discovery works more intuitively, especially in monorepo setups or when linting files in different directories.

## Significant changes in v10.0.0-beta

The following changes are planned for the beta release.

### Enabling JSX reference tracking

ESLint v10.0.0 will [enable JSX reference tracking](https://github.com/eslint/eslint/issues/19495), allowing ESLint to properly understand JSX element references in scope analysis.

Currently, ESLint doesn't track JSX references, which creates issues with scope analysis. For example:

```javascript
import { Card } from "./card.jsx";

export function createCard(name) {
    return <Card name={name} />;
}
```

In this code, ESLint doesn't recognize that `<Card>` is a reference to the imported `Card` component. This change brings ESLint's JSX handling in line with developer expectations and improves the overall linting experience for modern JavaScript applications using JSX.

### Removal of deprecated `SourceCode` methods

ESLint v10.0.0 will [remove several deprecated SourceCode methods](https://github.com/eslint/eslint/issues/20113) that have been marked for removal since ESLint v5.10.0.

The following deprecated `SourceCode` methods will be removed:

* **`getTokenOrCommentBefore()`** - Replace with `getTokenBefore()` using the `{ includeComments: true }` option
* **`getTokenOrCommentAfter()`** - Replace with `getTokenAfter()` using the `{ includeComments: true }` option
* **`isSpaceBetweenTokens()`** - Replace with `isSpaceBetween()`
* **`getJSDocComment()`** - This functionality will be moved to AST utilities

These methods have been deprecated for multiple major versions and are primarily used by deprecated formatting rules and internal ESLint utilities. Custom rules using these methods will need to be updated to use their modern replacements. The [`@eslint/compat`](https://npmjs.com/package/@eslint/compat) package will provide compatibility patches to help with the transition.

## When to expect ESLint v10.0.0

We expect the first alpha release of ESLint v10.0.0 to be available in November 2025, with the beta following shortly thereafter. The final v10.0.0 release is targeted for January 2026, though the exact timeline will depend on community feedback and testing results.

All releases will be announced on this blog, our [X account](https://twitter.com/geteslint), our [Bluesky account](https://bsky.app/profile/eslint.org) and our [Mastodon account](https://fosstodon.org/@eslint). We encourage users to test the alpha and beta releases to help ensure a smooth transition to v10.0.0.

Stay tuned for more detailed information about specific changes as we approach each release milestone.
