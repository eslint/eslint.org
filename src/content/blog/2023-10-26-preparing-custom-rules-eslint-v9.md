---
layout: post
title: "Deprecation of formatting rules"
teaser: "The next minor release of ESLint will deprecate core formatting rules. We recommend you use a source code formatter instead."
tags:
  - Rules
  - Formatting
authors:
  - nzakas
categories:
  - Announcements
---

In ESLint v8.53.0, scheduled to be released on Friday, November 3, 2023, we will formally deprecate our formatting rules. Formatting rules are those rules that simply enforce code conventions around spacing, semicolons, string formats, etc. For a variety of reasons, which are discussed in this post, this is the right decision for ESLint going forward. However, to understand how we got here, it's helpful to look backward for a moment.

## Background

When ESLint was initially released in 2013, the JavaScript ecosystem was embroiled in a debate about whether or not source code formatting should be part of a linter. [JSLint](https://jslint.com), the original JavaScript linter, heavily encoded its author's formatting preferences into the tool. Those preferences were carried over and loosened a bit in JSLint's successor, [JSHint](https://jshint.com), but by 2013, JSHint had announced that it was [deprecating its formatting rules](https://jshint.com/blog/jshint-3-plans/) and would be removing them in the next major release. While the options were never removed, they still [show this warning](https://jshint.com/docs/options/#camelcase):

> **Warning** This option has been deprecated and will be removed in the next major release of JSHint.
>
> JSHint is limiting its scope to issues of code correctness. If you would like to enforce rules relating to code style, check out the JSCS project.

The [JSCS](https://jscs-dev.github.io/) project was born to cater to the growing desire of JavaScript developers to format their code in more specific ways. Appearing in the same year as ESLint, there was a bit of a experimentation period as people tried using different combinations of JSHint, JSCS, and ESLint to achieve their linting and formatting needs.

Early on, I thought the only way for ESLint to reasonably compete with JSHint was to ensure that all available JSHint rules had ESLint equivalents. While the strength of ESLint was (and still is) in creating custom rules, I didn't think ESLint would get much adoption if everyone had to recreate the JSHint rules for themselves. My initial plan was to make a couple dozen core rules and then leave the rest to be implemented as plugins.

As time went on, ESLint received more and more requests to add formatting and stylistic rules to the core. Many of the requests mentioned that they didn't want to use two tools (ESLint and JSCS) on their code and if ESLint could do everything that JSCS did, they could drop JSCS and just use ESLint. And so, now that ESLint had a team, we focused on getting feature parity to support this use case. Eventually, we did such a good job that JSCS usage dropped and we [merged JSCS into ESLint](https://eslint.org/blog/2016/04/welcoming-jscs-to-eslint/).

What we didn't know at the time was that JSHint had the right idea, and although ESLint had become the dominant linter (and source code formatter) for JavaScript, we had also signed up for a lot of work.

## JavaScript's explosion and the maintenance burden

In the ensuing years, and especially spurred on by ECMAScript 6 and the growth of React, the way people were writing JavaScript was changing drammatically. Increasingly popular style guides like [Airbnb](https://airbnb.io/javascript/) and [Standard](https://standardjs.com) encouraged JavaScript developers to get more specific about how their code was written. As a result, ESLint was inundanted with requests for exceptions and options on formatting rules. Over the last ten years, we've seen all manner of bizarre styles accompanied by requests to enforce them in ESLint core rules. And every time new syntax is introduced, we get a flurry of requests to update existing rules and implement new rules.

As we approached 300 rules in the core, we tried to reduce the maintenance burden by [freezing stylistic rules](https://eslint.org/blog/2020/05/changes-to-rules-policies/) so that we were no longer chasing down corner cases to support everyone's personal preferences. That helped somewhat, but not enough.

* **Rule clashes.** People expect that core rules will play nice with each other, meaning that no two rules should flag the same problem nor will any two core rules give conflicting advice. While that was easy when there were less than 30 core rules, with 300 rules it became difficult, if not impossible, to achieve.
* **Unrealistic expectations.** With a large core of formatting rules, users expected that every possible style guide should be achievable just with core rules and without involving plugins. This put more pressure on the team to continue adding options, which also increased the size of the core.
* **Effort vs. value misalignment.** The maintenance burden of continuously adding new options and exceptions to support everyone's style guides was falling on the ESLint team whereas the value was being extracted by a small number of users.
* **Opportunity cost.** The more time we had to spend maintaining formatting rules, the less time we had to spend on things that are beneficial to large numbers of our users.
* **Lack of interest.** While ESLint benefits from outside contributions, those contributors are just not interested to chasing down corner cases of spacing. The ESLint team, itself, prioritized these rules much lower than any other work, which often left issues open for extended periods of time.
* **Consistency issues.** Because ESLint's rules are designed to be atomic and not to have access to other rules, we would run into issues where it wasn't possible to correctly fix an error because the information was in another rule. For example, if an autofix needs to add a new line of code, it would need to know how the file is indented in order to apply the correct fix. However, the `indent` rule controls indenting for ESLint, which meant that other rules needed to apply fixes without indentation and then trust that the `indent` rule would fix the indentation on a subsequent pass.

All of these problems continued to grow as ESLint got older, and we're finally at a point where we just cannot keep up with them.

## The deprecated rules

The following list contains all of the rules that will be deprecated in v8.53.0:

* [`array-bracket-newline`](https://eslint.org/docs/latest/rules/array-bracket-newline)
* [`array-bracket-spacing`](https://eslint.org/docs/latest/rules/array-bracket-spacing)
* [`array-element-newline`](https://eslint.org/docs/latest/rules/array-element-newline)
* [`arrow-parens`](https://eslint.org/docs/latest/rules/arrow-parens)
* [`arrow-spacing`](https://eslint.org/docs/latest/rules/arrow-spacing)
* [`block-spacing`](https://eslint.org/docs/latest/rules/block-spacing)
* [`brace-style`](https://eslint.org/docs/latest/rules/brace-style)
* [`comma-dangle`](https://eslint.org/docs/latest/rules/comma-dangle)
* [`comma-spacing`](https://eslint.org/docs/latest/rules/comma-spacing)
* [`comma-style`](https://eslint.org/docs/latest/rules/comma-style)
* [`computed-property-spacing`](https://eslint.org/docs/latest/rules/computed-property-spacing)
* [`dot-location`](https://eslint.org/docs/latest/rules/dot-location)
* [`eol-last`](https://eslint.org/docs/latest/rules/eol-last)
* [`func-call-spacing`](https://eslint.org/docs/latest/rules/func-call-spacing)
* [`function-call-argument-newline`](https://eslint.org/docs/latest/rules/function-call-argument-newline)
* [`function-paren-newline`](https://eslint.org/docs/latest/rules/function-paren-newline)
* [`generator-star-spacing`](https://eslint.org/docs/latest/rules/generator-star-spacing)
* [`implicit-arrow-linebreak`](https://eslint.org/docs/latest/rules/implicit-arrow-linebreak)
* [`indent`](https://eslint.org/docs/latest/rules/indent)
* [`jsx-quotes`](https://eslint.org/docs/latest/rules/jsx-quotes)
* [`key-spacing`](https://eslint.org/docs/latest/rules/key-spacing)
* [`keyword-spacing`](https://eslint.org/docs/latest/rules/keyword-spacing)
* [`linebreak-style`](https://eslint.org/docs/latest/rules/linebreak-style)
* [`lines-between-class-members`](https://eslint.org/docs/latest/rules/lines-between-class-members)
* [`lines-around-comment`](https://eslint.org/docs/latest/rules/lines-around-comment)
* [`max-len`](https://eslint.org/docs/latest/rules/max-len)
* [`max-statements-per-line`](https://eslint.org/docs/latest/rules/max-statements-per-line)
* [`multiline-ternary`](https://eslint.org/docs/latest/rules/multiline-ternary)
* [`new-parens`](https://eslint.org/docs/latest/rules/new-parens)
* [`newline-per-chained-call`](https://eslint.org/docs/latest/rules/newline-per-chained-call)
* [`no-confusing-arrow`](https://eslint.org/docs/latest/rules/no-confusing-arrow)
* [`no-extra-parens`](https://eslint.org/docs/latest/rules/no-extra-parens)
* [`no-extra-semi`](https://eslint.org/docs/latest/rules/no-extra-semi)
* [`no-floating-decimal`](https://eslint.org/docs/latest/rules/no-floating-decimal)
* [`no-mixed-operators`](https://eslint.org/docs/latest/rules/no-mixed-operators)
* [`no-mixed-spaces-and-tabs`](https://eslint.org/docs/latest/rules/no-mixed-spaces-and-tabs)
* [`no-multi-spaces`](https://eslint.org/docs/latest/rules/no-multi-spaces)
* [`no-multiple-empty-lines`](https://eslint.org/docs/latest/rules/no-multiple-empty-lines)
* [`no-tabs`](https://eslint.org/docs/latest/rules/no-tabs)
* [`no-trailing-spaces`](https://eslint.org/docs/latest/rules/no-trailing-spaces)
* [`no-whitespace-before-property`](https://eslint.org/docs/latest/rules/no-whitespace-before-property)
* [`nonblock-statement-body-position`](https://eslint.org/docs/latest/rules/nonblock-statement-body-position)
* [`object-curly-newline`](https://eslint.org/docs/latest/rules/object-curly-newline)
* [`object-curly-spacing`](https://eslint.org/docs/latest/rules/object-curly-spacing)
* [`object-property-newline`](https://eslint.org/docs/latest/rules/object-property-newline)
* [`one-var-declaration-per-line`](https://eslint.org/docs/latest/rules/one-var-declaration-per-line)
* [`operator-linebreak`](https://eslint.org/docs/latest/rules/operator-linebreak)
* [`padded-blocks`](https://eslint.org/docs/latest/rules/padded-blocks)
* [`padding-line-between-statements`](https://eslint.org/docs/latest/rules/padding-line-between-statements)
* [`quote-props`](https://eslint.org/docs/latest/rules/quote-props)
* [`quotes`](https://eslint.org/docs/latest/rules/quotes)
* [`rest-spread-spacing`](https://eslint.org/docs/latest/rules/rest-spread-spacing)
* [`semi`](https://eslint.org/docs/latest/rules/semi)
* [`semi-spacing`](https://eslint.org/docs/latest/rules/semi-spacing)
* [`semi-style`](https://eslint.org/docs/latest/rules/semi-style)
* [`space-before-blocks`](https://eslint.org/docs/latest/rules/space-before-blocks)
* [`space-before-function-paren`](https://eslint.org/docs/latest/rules/space-before-function-paren)
* [`space-in-parens`](https://eslint.org/docs/latest/rules/space-in-parens)
* [`space-infix-ops`](https://eslint.org/docs/latest/rules/space-infix-ops)
* [`space-unary-ops`](https://eslint.org/docs/latest/rules/space-unary-ops)
* [`spaced-comment`](https://eslint.org/docs/latest/rules/spaced-comment)
* [`switch-colon-spacing`](https://eslint.org/docs/latest/rules/switch-colon-spacing)
* [`template-curly-spacing`](https://eslint.org/docs/latest/rules/template-curly-spacing)
* [`template-tag-spacing`](https://eslint.org/docs/latest/rules/template-tag-spacing)
* [`wrap-iife`](https://eslint.org/docs/latest/rules/wrap-iife)
* [`wrap-regex`](https://eslint.org/docs/latest/rules/wrap-regex)
* [`yield-star-spacing`](https://eslint.org/docs/latest/rules/yield-star-spacing)

All of these rules will be deprecated as of the next release, but will not be removed until at least ESLint v10.0.0 (if not later). You can continue to use them although you may see deprecation warnings in the ESLint CLI.

## What you should do instead

We recommend using a source code formatter instead of ESLint for formatting your code. Source code formatters are built to understand the entire file and apply consistent formatting throughout. While you might not have as much control over exceptions as with ESLint, the tradeoff is the simplicity and speed you'll get vs. configuring ESLint with dozens of individual rules. There are two formatters that we recommend:

* [Prettier](https://prettier.io) - a JavaScript-based formatter with support for formatting a large number of languages
* [dprint](https://dprint.dev) - a Rust-based formatter with support for a smaller set of languages

If the idea of using a dedicated source code formatter doesn't appeal to you, you can also use [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js) for JavaScript or [`@stylistic/eslint-plugin-ts`](https://eslint.style/packages/ts) for TypeScript. These packages contain the deprecated formatting rules from the ESLint core and [`typescript-eslint`](https://typescript-eslint.io), respectively. The packages are maintained by [Anthony Fu](https://github.com/antfu), who has decided to continue maintaining these rules going forward. If you'd like to continue using the rules mentioned in this post, then we recommend switching to these packages.

## Conclusion

We know that a lot of people rely on ESLint for code quality and formatting purposes, and as such, we don't take significant decisions like this lightly. Unfortunately, the way we've been doing things just won't scale much further and we needed to make this change. The ubiquity and popularity of dedicated source code formatters made this decision somewhat easier, as was Anthony Fu volunteering to maintain the rules as a separate package. We hope that one of the available options mentioned in this post will ensure that people can continue formatting their source code in their preferred way.
