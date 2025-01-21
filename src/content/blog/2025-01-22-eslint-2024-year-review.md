---
layout: post
title: ESLint's 2024 year in review
teaser: "2024 saw the release of ESLint v9.0.0 and the introduction of language plugins."
tags:
  - Updates
  - Features
  - Releases
authors:
  - nzakas
categories:
  - Storytime
---

The plan for 2024 was to release the final version of ESLint v9.0.0 and then start working on language plugins that allow ESLint to officially lint non-JavaScript languages. We spent the year working on these and delivered them all, along with some helpful tools, by the end of 2024.

## Release of ESLint v9.0.0 and the new configuration system

ESLint v9.0.0 was [released in April](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/) with the new configuration system enabled by default. This being our first major release [since 2021](https://eslint.org/blog/2021/10/eslint-v8.0.0-released/), we experienced a difficult first few months as we fielded bugs and complaints related not just to the new configuration system, but the other [changes in v9.0.0](https://eslint.org/blog/2023/11/whats-coming-in-eslint-9.0.0/). We spent the first half of the year updating documentation, creating a [configuration migration tool](https://eslint.org/blog/2024/05/eslint-configuration-migrator/) to ease the transition, and the [Config Inspector](https://eslint.org/blog/2024/04/eslint-config-inspector/) to help people debug their new configuration files.

Towards the last quarter of 2024, things had started to settle and we went back to work on improving the configuration system to address some of the common issues users reported.

## Release of the language plugins API

Part of the move to the new configuration system was with an eye towards making ESLint language-agnostic through the creation of [language plugins](https://eslint.org/blog/2024/07/whats-coming-next-for-eslint/#language-plugins). This involved a lot of core work to move the JavaScript-specific functionality into its own classes, which in turn allowed us to swap in similar classes for other languages.

In the end, we released official language plugins for [Markdown](https://github.com/eslint/markdown) and [JSON](https://github.com/eslint/json), as well as a prototype for [CSS](https://github.com/eslint/css). All language plugins allow you to create and distribute your own rules that run against the language-specific ASTs. To facilitate the creation of these custom rules, we also introduced the [Code Explorer](https://explorer.eslint.org).

## Updates to support the latest ECMAScript features

As with most years, the team spends a lot of time monitoring the JavaScript standardization process to ensure ESLint is updated to support new syntax as quickly as possible. In 2024 we added support for the following new JavaScript features:

* [ES2025 Regex duplicate named capture groups](https://github.com/tc39/proposal-duplicate-named-capturing-groups)
* [ES2025 Regex modifiers](https://github.com/tc39/proposal-regexp-modifiers)
* [ES2025 Import attributes](https://github.com/tc39/proposal-import-attributes)

These features involved changes not just to parsing but also to rules that work with regular expressions and modules.

## Financials review

The next few sections dig into the project financials. All of this information is gathered from the Open Collective transaction list with the exception of Tidelift payments (which are retrieved from Tidelift directly). Because transactions come in all throughout the course of a day, we decided to consider transactions beginning on January 1, 2024 at midnight UTC and ending on December 31, 2024 at 11:59 UTC as our fiscal 2024.

### Income review

![2024 Income Sources - Summarized in following table](/assets/images/blog/2025/2024-income-sources.svg)

During 2024, ESLint received $187,964.30 USD from all of our income sources. You can see the breakdown of our income sources in the following table.

| **Source**         | **Amount**    | **2023 Amount** | **Gain/Loss %** |
|--------------------|---------------|-----------------|-----------------|
| Open Collective    | $122,996.60   | $118,381.30     | +3.90%          |
| GitHub Sponsors    | $35,928.93    | $25,190.89      | +42.63%         |
| Tidelift           | $18,449.16    | $30,077.84      | -38.68%         |
| Website Ads        | $6,345.54     | $6,380.89       | -0.55%          |
| Thanks.dev         | $4,234.09     | $524.61         | +707.09%        |
| Threadless         | $9.98         | $0.00           | +100%           |
| Stackaid.us        | $0.00         | $91.00          | -100%           |
| **Total**          | **$187,964.30** | **$180,646.53** | **+4.05%**      |

As usual, most of our donations came through Open Collective. We are grateful that we saw an increase in donations through Open Collective, GitHub Sponsors, and Thanks.dev as compared to 2023. Our website ad revenue stayed mostly flat as we switched from Carbon Ads to Ethical Ads to increase ad revenue. Overall website advertising is still a lot softer than it was prior to 2023, so we are happy to at least have stayed in the same range.

An unwelcome surprise during the year was the steep dropoff in Tidelift payments. We were informed early in 2024 that Tidelift was recalculating payments we'd be receiving and so our monthly payment ended up cut in half for the remaining months.

This highlights just how important sponsorships are for projects like ESLint, as a company like Tidelift can change their payout calculations and dramatically impact the health of projects.

### Top sponsors

In 2024, we received generous donations from many companies, led by Automattic ($24,000), Meta ($20,000), and Airbnb ($18,000). Those companies donating $1,000 or more totaled $149,027.59 USD, representing 79% of our total income.

| **Sponsor**                    | **2024 Donation Total** |
|--------------------------------|-------------------------|
| Automattic                     | $24,000.00              |
| Meta Open Source               | $20,000.00              |
| Airbnb                         | $18,000.00              |
| trunk.io                       | $7,000.00               |
| Salesforce                     | $7,000.00               |
| Liftoff                        | $6,000.00               |
| Chrome Frameworks Fund         | $6,000.00               |
| Workleap                       | $6,000.00               |
| American Express               | $6,000.00               |
| JetBrains                      | $5,500.00               |
| EthicalAds                     | $5,491.08               |
| THANKS.DEV                     | $4,234.09               |
| Cybozu                         | $4,200.00               |
| Canva                          | $3,000.00               |
| Sanity                         | $2,400.00               |
| Icons8                         | $2,400.00               |
| Discord                        | $2,400.00               |
| Anagram Solver                 | $2,400.00               |
| Nx                             | $2,400.00               |
| HeroCoders                     | $2,400.00               |
| SERP Triumph                   | $2,000.00               |
| Principal Financial Group      | $1,800.00               |
| (redacted)                     | $1,741.94               |
| Nextbase Starter Kit           | $1,612.48               |
| Ignition                       | $1,600.00               |
| Notion                         | $1,400.00               |
| Bitwarden                      | $1,048.00               |
| Siemens                        | $1,000.00               |

**Note:** The redacted sponsor name is from an account that was of questionable origin and was eventually blocked by GitHub. However, the money did end up in our account so we are including it in the table for transparency.

### Expenses review

![2024 Expenses - Summarized in following table](/assets/images/blog/2025/2024-expenses.svg)

In 2024, we spent $247,669.54 USD on the ESLint project as a whole. This includes regular maintenance and development as well as other costs related to the project. This is in comparison to the $187,964.30 of income for a **net loss of -$59,705.24**. See the table below for an overview.


| **Category**                | **2024 Amount**  | **2023 Amount** | **Gain/Loss %** |
|-----------------------------|------------------|-----------------|-----------------|
| Maintenance and Development | $147,273.43      | $66,910.37      | +120.12%        |
| TSC Stipend (Tidelift)      | $18,449.16       | $30,077.84      | -38.68%         |
| Triage and Support          | $3,985.50        | $10,307.78      | -61.33%         |
| Technical Writing           | $0.00            | $8,155.00       | -100.00%        |
| Contributor Pool            | $14,100.30       | $4,500.00       | +213.34%        |
| Payment Processor Fees      | $3,808.97        | $2,854.51       | +33.45%         |
| Health Insurance            | $12,698.40       | $13,447.41      | -5.57%          |
| Open Source Collective Fee  | $11,696.69       | $9,206.88       | +27.04%         |
| Ecosystem/Dependencies      | $16,100.00       | $24,400.00      | -33.99%         |
| Community Management        | $9,825.03        | $15,599.84      | -37.04%         |
| Google Workspace            | $182.06          | $187.35         | -2.82%          |
| Code Explorer               | $7,200.00        | $0.00           | +100%           |
| Config Inspector            | $2,350.00        | $0.00           | +100%           |
| **Total**                   | **$247,669.54**  | **$185,646.98** | **+33.39%**     |


2024 was a record year for ESLint in many ways. The amount of work completed was due to a large number of contributions not only from the team but also from outside contributors. Our maintenance and development costs soared this year as a result, as did our Contributor Pool costs, which is what we pay outside contributors for significant contributions to ESLint. We had additional help triaging issues and PRs, which also contributed to the increase in costs.

How were we able to make up the difference between income and expenses? The ESLint team has long had a belief in building up at least a year of reserves so that any abrupt disruption of income wouldn't disrupt the project immediately. Prior to 2023, we were mostly focusing on bug fixes, stability, and keeping up with changes to the JavaScript language. During that time, costs were relatively low and so we spent less than we received in order to build up our reserves. Starting in 2023, we started significantly overhauling the ESLint project, and a result, that was the first year we spent slightly more than we took in. 2024 accelerated those changes as more contributions led to higher costs.

### Supporting our dependencies and ecosystem

ESLint is committed to the financial health of our dependencies and the ESLint ecosystem as a whole. As part of that commitment, we donate to projects that we depend on as well as important ESLint-related projects. (This is listed as "Ecosystem/Dependencies" in the previous table.) The following table shows the projects to which we donated in 2024.

| **Project**           | **Donations** |
|-----------------------|---------------|
| Ajv                   | $1,800.00    |
| debug                 | $1,800.00    |
| eslint-plugin-import  | $1,800.00    |
| jsx-eslint            | $1,800.00    |
| lint-staged           | $1,800.00    |
| Rollup                | $1,800.00    |
| Sindre Sorhus         | $1,800.00    |
| typescript-eslint     | $1,800.00    |
| WebdriverIO           | $1,100.00    |
| Eleventy              | $600.00      |
| **Total**       | **$16,100.00** |

## Looking forward to 2025

Now that ESLint v9.0.0 and language plugins are released, we feel that ESLint is on a solid foundation for the foreseeable future. We'll continue iterating on the new configuration system, as we explore ways to make it more intuitive and easier to use. Our next big step is a [rewrite of the core](https://eslint.org/blog/2024/07/whats-coming-next-for-eslint/#core-rewrite), which aims to break apart our existing API into smaller pieces that are easier to mix and match. This will allow ESLint to be more flexible in terms of plugin capabilities as well as supporting multiple different runtimes.

2024 was an exciting and challenging year for ESLint, with some of the most dramatic changes in the project's history. We appreciate all of the feedback you shared with us over the year and your patience as we worked through the changes in this major release.

We're also grateful to our sponsors not just in 2024, but also in the preceding years, which allowed us to absorb a nearly $60,000 deficit in our ongoing costs. We hope that all we've accomplished in 2024 shows that every dollar of sponsorship money is being spent to benefit ESLint, its users, and the entire ESLint ecosystem.
