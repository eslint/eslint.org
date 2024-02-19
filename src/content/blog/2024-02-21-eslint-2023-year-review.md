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

While there are [a lot of changes in v9.0.0](https://eslint.org/blog/2023/11/whats-coming-in-eslint-9.0.0/), the biggest change is making flat config the default configuration system. The old (eslintrc) configuration is still available via an environment variable, and we published the [rollout plan](https://eslint.org/blog/2023/10/flat-config-rollout-plans/) outlining how the transition will occur from v8x through to v10.x.

Just before the end of the year, we [released ESLint v9.0.0-alpha.0](https://eslint.org/blog/2023/12/eslint-v9.0.0-alpha.0-released/). We anticipate a final v9.0.0 release in the spring of 2024.

## Other changes

* [Deprecation of formatting rules](https://eslint.org/blog/2023/10/deprecating-formatting-rules/) - in a significant shift from ESLint's roots, we decided to officially deprecate formatting rules
* [Changes to rule API](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/) - for those who write their own rules, we announced important changes to the rule API that will prepare ESLint for our next step: [language plugins](https://github.com/eslint/rfcs/blob/main/designs/2022-languages/README.md).

## Updates to support latest ECMAScript features

The team spends much of the year anticipating new ECMAScript features and updating ESLint accordingly. 2023 was an outlier in that most of the changes weren't syntax-related, and so there wasn't a lot of additional work. The most significant syntax change, [hashbang comments](https://github.com/tc39/proposal-hashbang), is something that ESLint already handled to support Node.js.

## Income review

During 2023, ESLint received $179,601.53 USD from all of our income sources. You can see the breakdown of our income sources in the following table.

| **Source** | **Amount** |
|-----------|-------------|
| Open Collective | $117,336.30 |
| Tidelift | $30,077.84 |
| GitHub Sponsors | $25,190.89 |
| Carbon Ads | $6,380.89 |
| Thanks.dev | $524.61 |
| Stackaid.us | $91.00 |
| **Total** | **$179,601.53** |

As usual, most of our donations came through Open Collective. Tidelift (slight up from 2022) surpassed GitHub Sponsors donations (slightly down from 2022) in 2023. Notably, our website ad revenue dropped roughly 50% from 2022, following an overall softening of the display ad business. We'll be looking at options to improve our website ad revenue in 2024.

The newer sponsoring options, Thanks.dev and Stackaid.us, didn't provide much income but are both interesting ideas that we'll keep participating in.

We are grateful to the companies and individuals who generously donated to support ESLint. We know that there has been a lot of turbulence in the tech industry in the past year, and we really appreciate everyone who still decided to sponsor ESLint.

## Expenses review

In 2023, we spent $152,168.13 USD on the ESLint project as a whole. This includes regular maintenance and development as well as other costs related to the project. See the table below for an overview.

| **Category** | **Amount** |
|-----------|-------------|
| Maintenance and Development | $66,910.37 |
| TSC Stipend (Tidelift) | $30,077.84 |
| Triage and Support | $10,307.78 |
| Ecosystem/Dependencies | $24,100.00 |
| Community Management | $15,599.84 |
| Health Insurance | $13,447.41 |
| Open Source Collective Fee | $8,960.38 |
| Technical Writing | $8,155.00 |
| Contributor Pool | $4,500.00 |
| Google Workspace | $187.35 |
| **Total** | **$182,245.97** |

Our overall expenses increased from $155,054.09 USD in 2022 as we increased our donations to other open source projects, hired a part-time technical writer, and took on the cost of health insurance.

As a reminder, the Contributor Pool is money we award for contributions to people who are not on the ESLint team as a way to thank them for making impactful contributions to the project. Community Management refers to the ongoing work required to manage the ESLint Community GitHub organization.

## Supporting our dependencies and ecosystem

In 2023, the ESLint project donated $24,100.00 USD to ecosystem projects and our dependencies (listed in the previous table as "Ecosystem/Dependencies"). This is part of our ongoing commitment to supporting projects that are important to ESLint.

| **Project** | **Donations** |
|-----------|-------------|
| typescript-eslint | $11,800.00 |
| debug | $1,800.00 |
| eslint-plugin-import | $1,800.00 |
| jsx-eslint | $1,800.00 |
| lint-staged | $1,800.00 |
| Rollup | $1,800.00 |
| Sindre Sorhus | $1,800.00 |
| Ajv | $1,500.00 |
| **Total** | **$24,100.00** |

## Looking forward to 2024

Once v9.0.0 is released, we'll be in a good spot to finish work on language plugins and then move on to the [complete rewrite](https://github.com/eslint/eslint/discussions/16557) we talked about in 2023. It's hard to believe ESLint is heading into its 11th year, and we're making the preparations to ensure the project will continue to be useful to the JavaScript community for the next decade.

We know that ESLint is an important part of your toolchain and we appreciate your ongoing support as our team of volunteers moves the project forward.
