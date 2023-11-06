---
layout: post
title: What's coming in ESLint v9.0.0
teaser: "We want to share with you the significant changes that will be coming in v9.0.0 so you can better prepare for the changes and understand why the changes are necessary."
tags:
  - major
  - breaking changes
authors:
  - nzakas
categories:
  - API Changes
---

Last month, the Technical Steering Committee (TSC) met to finalize the features for ESLint v9.0.0. This post outlines our plans for v9.0.0. You can keep up to date everything that is planned for v9.0.0 on our [project board](https://github.com/orgs/eslint/projects/4).

## Development plan

Due to the large number of breaking changes planned for v9.0.0, we have decided to develop this release in two phases:

1. **Alpha.** The alpha release will be comprised primarily of the changes we believe will cause the most disruption for existing users. Getting these changes into a release early will allow us to gather feedback to ensure things are going as planned.
2. **Beta.** The beta release will be comprised of the remaining tasks and smaller breaking changes that will have fewer impacted users.

The specific details about each phase are listed below in this post. Note that if tasks scheduled for the beta are completed in the alpha timeframe, then they will be published in the alpha release.

After the beta has been validated, we will publish one or more release candidates as we continue to fix bugs and deal with compatibility issues.

## Significant changes in v9.0.0-alpha

The following changes are planned for the alpha release and represent significant breaking changes.

### Flat config now the default and has some changes

Flat config will be the default configuration format for ESLint beginning in v9.0.0 and eslintrc will be deprecated but will still work. To continue using a eslintrc configuration file, you'll need to set the `ESLINT_USE_FLAT_CONFIG` environment variable to `false`. We announced the details in [my previous blog post](https://eslint.org/blog/2023/10/flat-config-rollout-plans/).

We will also remove the `"eslint:recommended"` and `"eslint:all"` configuration strings from flat config. In the initial version of flat config, we let you put these directly into the config array, but in v9.0.0, you'll need to use the corresponding configs from the [`@eslint/js` package](https://www.npmjs.com/package/@eslint/js).

### Dropping support for Node.js < v18.18.0, v19

As of this post, Node.js v20.x is the LTS release, and as such we are [dropping support](https://github.com/eslint/eslint/issues/17595) for all versions of Node.js prior to v18.18.0 as well as v19.x.

### Removing all formatters except `stylish`, `html`, `json`, and `json-with-meta`

In an ongoing effort to reduce the install size of ESLint, we have decided to [remove most of the formatters](https://github.com/eslint/eslint/issues/17524) from the core of ESLint. The formatters being removed are:

* `checkstyle`
* `compact`
* `jslint-xml`
* `junit`
* `tap`
* `unix`
* `visualstudio`

If you are using these formatters currently, you'll need to install the [standalone packages](https://github.com/fregante/eslint-formatters) for use with ESLint v9.0.0.

### Removing `valid-jsdoc` and `require-jsdoc` rules

Continuing with our theme of reducing ESLint's install size, we have decided to [remove the `valid-jsdoc` and `require-jsdoc` rules](https://github.com/eslint/eslint/issues/15820). These rules have been deprecated since ESLint v5.10.0 and removing them allows us to remove another dependency (`doctrine`). We recommend using the [`eslint-plugin-jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc) plugin instead.

### Removing deprecated methods on `context` and `SourceCode`

As we [announced in September](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/), we will be removing a lot of deprecated methods from `context` and replacing them with methods on `SourceCode`. Please read the above mentioned post for more details on these changes.

Additionally, we will be [removing the deprecated `SourceCode#getComments()` method](https://github.com/eslint/eslint/issues/14744).

### Updating `eslint:recommended`

The `eslint:recommended` configuration will be [updated](https://github.com/eslint/eslint/issues/17596) to include new rules that we feel are important, and to remove deprecated rules.

### Changes to how you write rules

To clean up and make rules easier to work with, we're making [two changes](https://github.com/eslint/eslint/issues/14709):

1. Function-style rules will stop working in v9.0.0. Function-style rules are rules created by exporting a function from a file rather than exporting an object with a `create()` method.
2. When a rule doesn't have `meta.schema` specified, a default schema of `[]` will be applied. This means that rules without a schema will be assumed to have no options, which in turn means that validation will fail if options are provided.

You can read more about this change in the [RFC](https://github.com/eslint/rfcs/tree/main/designs/2021-schema-object-rules).

### `--quiet` option is more performant

The `--quiet` option hides all warnings in the ESLint console. In v9.0.0, we are making a performance improvement by also not executing any rules set to `"warn"`. You can read more about this change in the [RFC](https://github.com/eslint/rfcs/tree/main/designs/2023-only-run-reporting-rules).

### Running `eslint` with no file arguments

Starting in v9.0.0, if you are using flat config and you don't pass any file arguments to the CLI, the CLI will [default to linting the current directory](https://github.com/eslint/eslint/issues/14308), which means you can type `npx eslint` and it will just work.

For eslintrc, missing file arguments will result in an error.

## Significant changes in v9.0.0-beta

The following changes are planned for the beta release and represent significant breaking changes.

### Removing `CodePath#currentSegments`

In order to move forward with the [language plugins](https://github.com/eslint/rfcs/tree/main/designs/2022-languages) work, we'll be removing `CodePath#currentSegments`. This only affects rules that are using code path analysis. You can read more in the previous [blog post](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/#codepath%23currentsegments).

### Configuration comments with just severity now only override severity

Due to a bug in the way inline configuration comments were handled, comments such as `/*eslint no-undef: warn */` would automatically remove any options set for the corresponding rule in a configuration file. In v9.0.0, these types of comments will [only change the severity of the rule](https://github.com/eslint/eslint/issues/17381) and will not affect any other options.

### New `no-new-native-nonconstructor` rule replaces `no-new-symbol`

The `no-new-symbol` rule was designed to prevent `new Symbol()` in your code, which is an error because `Symbol` isn't a constructor. There are other global functions that also don't have constructors, so we decided to [create a new rule](https://github.com/eslint/eslint/issues/17446), `no-new-native-nonconstructor`, to cover all of those cases. This new rule will be added to `eslint:recommended` and `no-new-symbol` will be deprecated.

### Changes to `RuleTester`

The `RuleTester` class will be updated to catch more problems with rules:

1. There will be a failure if [multiple suggestion fixers have the same message](https://github.com/eslint/eslint/issues/16908).
1. There will be a failure if a [suggestion contains a parsing error](https://github.com/eslint/eslint/issues/15735).
1. [Several additional assertions](https://github.com/eslint/rfcs/tree/main/designs/2021-stricter-rule-test-validation) will be added to catch invalid or buggy test cases.

## When to expect ESLint v9.0.0

We expect the first alpha release of ESLint v9.0.0 to be released in December or January, depending on the progress we make on our tasks. At that point, we will gather feedback from the community and fix any outstanding issues that make it difficult for people to upgrade. We hope to the beta release a couple of months after the alpha, and the final release a couple of months after that. Availability of all releases will be announced on this blog, on our [X account](https://twitter.com/geteslint), and on our [Mastodon account](https://fosstodon.org/@eslint), so please stay tuned!
