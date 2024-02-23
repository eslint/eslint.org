---
layout: post
title: ESLint's 2023 year in review
teaser: "2023 saw the much-anticipated release of our new configuration system and more."
tags:
  - Updates
  - Features
  - Releases
authors:
  - nzakas
categories:
  - Storytime
---

The plan for 2023 centered around our first major release [since 2021](https://eslint.org/blog/2021/10/eslint-v8.0.0-released/), ESLint v9.0.0. Most of the year was spent preparing for the release, building out the new configuration system (flat config) and communicating the impact to the ecosystem throughout the year.

## Release of ESLint v9.0.0 and the new configuration system

While there are [a lot of changes in v9.0.0](https://eslint.org/blog/2023/11/whats-coming-in-eslint-9.0.0/), the biggest change is making flat config the default configuration system. The old (eslintrc) configuration is still available via an environment variable, and we published the [rollout plan](https://eslint.org/blog/2023/10/flat-config-rollout-plans/) outlining how the transition will occur from v8.x through to v10.x.

Just before the end of the year, we [released ESLint v9.0.0-alpha.0](https://eslint.org/blog/2023/12/eslint-v9.0.0-alpha.0-released/). We anticipate a final v9.0.0 release in the spring of 2024.

## Other changes

* [Deprecation of formatting rules](https://eslint.org/blog/2023/10/deprecating-formatting-rules/) - in a significant shift from ESLint's roots, we decided to officially deprecate formatting rules
* [Changes to rule API](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/) - for those who write their own rules, we announced important changes to the rule API that will prepare ESLint for our next step: [language plugins](https://github.com/eslint/rfcs/blob/main/designs/2022-languages/README.md).

## Updates to support the latest ECMAScript features

The team spends much of the year anticipating new ECMAScript features and updating ESLint accordingly. 2023 was an outlier in that most of the changes weren't syntax-related, and so there wasn't a lot of additional work. The most significant syntax change, [hashbang comments](https://github.com/tc39/proposal-hashbang), is something that ESLint already handled to support Node.js.

## Financials review

The next few sections dig into the project financials. All of this information is gathered from the Open Collective transaction list with the exception of Tidelift payments (which are retrieved from Tidelift directly). Because transactions come in all throughout the course of a day, we decided to consider transactions beginning on January 1, 2023 at midnight UTC and ending on December 31, 2023 at 11:59 UTC as our fiscal 2023.

### Income review

During 2023, ESLint received $180,646.53 USD from all of our income sources. You can see the breakdown of our income sources in the following table.

| **Source** | **Amount** |
|-----------|-------------|
| Open Collective | $118,381.30 |
| GitHub Sponsors | $25,190.89 |
| Tidelift | $30,077.84 |
| Carbon Ads | $6,380.89 |
| Thanks.dev | $524.61 |
| Stackaid.us | $91.00 |
| **Total** | **$180,646.53** |

As usual, most of our donations came through Open Collective. Notably, our website ad revenue dropped roughly 50% from 2022, following an overall softening of the display ad business. We'll be looking at options to improve our website ad revenue in 2024.

The newer sponsoring options, Thanks.dev and Stackaid.us, didn't provide much income but are both interesting ideas that we'll keep participating in.

We are grateful to the companies and individuals who generously donated to support ESLint. We know that there has been a lot of turbulence in the tech industry in the past year, and we really appreciate everyone who still decided to sponsor ESLint.

### Top sponsors

While we are grateful to all of our sponsors, both large and small, we feel especially grateful to those who donated $1,000 USD or more during 2023. These folks totaled $109,576 USD during 2023, representing 60% of our total income.

| **Sponsor** | **2023 Donation Total** |
|-------------|-------------------------|
| Chrome Frameworks Fund | $24,000.00 |
| Automattic | $24,000.00 |
| Salesforce | $12,000.00 |
| Airbnb | $12,000.00 |
| Indeed | $10,000.00 |
| Liftoff | $6,000.00 |
| Cybozu | $4,976.00 |
| Sentry | $4,624.00 |
| American Express | $4,467.74 |
| RIDI | $4,000.00 |
| ThemeIsle | $2,400.00 |
| Icons8 | $2,400.00 |
| Discord | $2,400.00 |
| Anagram Solver | $2,400.00 |
| Ignition | $2,400.00 |
| HeroCoders | $2,400.00 |
| Transloadit | $2,309.68 |
| Nx (by Nrwl) | $1,800.00 |
| QuickBooks Tool hub | $1,600.00 |
| Yannick Croissant | $1,200.00 |

### Expenses review

In 2023, we spent $185,646.98 USD on the ESLint project as a whole. This includes regular maintenance and development as well as other costs related to the project. See the table below for an overview.

| **Category** | **Amount** |
|-----------|-------------|
| Maintenance and Development | -$66,910.37 |
| TSC Stipend (Tidelift) | -$30,077.84 |
| Triage and Support | -$10,307.78 |
| Technical Writing | -$8,155.00 |
| Contributor Pool | -$4,500.00 |
| Health Insurance | -$13,447.41 |
| Open Source Collective Fee | -$9,206.88 |
| Ecosystem/Dependencies | -$24,400.00 |
| Community Management | -$15,599.84 |
| Payment Processor Fee | -$2,854.51 |
| Google Workspace | -$187.35 |
| **Total** | **-$185,646.98** |

As a reminder, the Contributor Pool is money we award for contributions to people who are not on the ESLint team as a way to thank them for making impactful contributions to the project. Community Management refers to the ongoing work required to manage the ESLint Community GitHub organization.

You may notice that our expenses exceeded our income in 2023. Thankfully, we keep a large reserve fund so we can handle any unexpected expenses and to hedge against loss of sponsorships.

### Supporting our dependencies and ecosystem

In 2023, the ESLint project donated $24,400.00 USD to ecosystem projects and our dependencies (listed in the previous table as "Ecosystem/Dependencies"). This is part of our ongoing commitment to supporting projects that are important to ESLint.

| **Project** | **Donations** |
|-----------|-------------|
| typescript-eslint | -$11,800.00 |
| Ajv | -$1,800.00 |
| debug | -$1,800.00 |
| eslint-plugin-import | -$1,800.00 |
| jsx-eslint | -$1,800.00 |
| lint-staged | -$1,800.00 |
| Rollup | -$1,800.00 |
| Sindre Sorhus | -$1,800.00 |
| **Total** | **-$24,400.00** |

## Looking forward to 2024

Once v9.0.0 is released, we'll be in a good spot to finish work on language plugins and then move on to the [complete rewrite](https://github.com/eslint/eslint/discussions/16557) we talked about in 2023. It's hard to believe ESLint is heading into its 11th year, and we're making the preparations to ensure the project will continue to be useful to the JavaScript community for the next decade.

We know that ESLint is an important part of your toolchain and we appreciate your ongoing support as our team of volunteers moves the project forward.
