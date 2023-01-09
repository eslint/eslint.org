---
layout: post
title: ESLint's 2022 year in review
teaser: "2022 was a productive year for the ESLint project with improvements in all facets of the project."
tags:
  - Updates
  - Features
  - Releases
authors:
  - nzakas
categories:
  - Storytime
---

In February 2022, we shared our [plan for 2022](https://eslint.org/blog/2022/02/paying-contributors-sponsoring-projects/), including how the ESLint project as a whole would be spending its sponsorship money for the betterment of the project. In this post, I'll share what we achieved during the year.

## Website redesign

The most recognizable change to the project was undoubtedly the website redesign. The new website was [officially launched](https://twitter.com/geteslint/status/1540032964087623681) on June 23 and was immediately met with widespread positive reviews. The designer, Hayden Bleasel, [shared his approach](https://eslint.org/blog/2022/08/redesigning-eslint/) for the redesign in a guest post on the newly redesigned website.

We also launched several international language sites, including [Chinese](https://zh-hans.eslint.org), [Spanish](https://es.eslint.org), [German](https://de.eslint.org), [Japanese](https://ja.eslint.org), [Brazilian Portuguese](https://pt-br.eslint.org), [French](https://fr.eslint.org), and [Hindi](https://hi.eslint.org).

The website launch excited a lot of people to the point where we started getting contributions just for the website. As a result, we created a new [website team](https://eslint.org/team) to focus on keeping the new website up-to-date and continuing to make improvements.

This effort cost nearly $60,000 and would not have been possible without the support of our sponsors.

## Preview release of the new configuration system

We had been working on the design of a new configuration system for several years, and in 2022, users finally got to see the new system. In August, we released the first preview of the new configuration system through a series of blog posts:

1. [Part 1](https://eslint.org/blog/2022/08/new-config-system-part-1/) explains why we needed a new configuration system and the problems with the current system.
2. [Part 2](https://eslint.org/blog/2022/08/new-config-system-part-2/) explains the new configuration system and the thinking that went into its design.
3. [Part 3](https://eslint.org/blog/2022/08/new-config-system-part-3/) explains how to use the developer preview of the configuration system.

Since we published that third post, the new configuration system is almost complete and is available for use by end users ([see the docs](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new) for more).

We anticipate the final release of the new configuration system in 2023 along with a transition period where both the new and old configuration systems can be used before the old is eventually removed.

## Updates to support ES2022

As we do each year, the ESLint team stays on top of the latest ECMAScript versions to make sure ESLint continues to support the more recent JavaScript syntax and features. This year, we added support for:

1. [Top-level await](https://github.com/tc39/proposal-top-level-await)
1. [Class fields](https://github.com/tc39/proposal-class-fields)
1. [Ergonomic brand checks for private fields](https://github.com/tc39/proposal-private-fields-in-in)
1. [Class static initialization blocks](https://github.com/tc39/proposal-class-static-block)
1. [RegExp Match Indices](https://github.com/tc39/proposal-regexp-match-indices)

You can enable these in your configuration by setting `ecmaVersion: 2022` or `ecmaVersion: "latest"`.

## Project kickoffs

In addition to our normal maintenance and development, we also kicked off a couple of additional projects:

1. **Documentation Refresh** - we hired a technical writer to start reviewing, organizing, and rewriting our documentation. We have never had a documentation-focused project and we felt like 2022 was the right time to start this project given the funds we had available. We anticipate this project to continue until mid-2023.
2. **ESLint Community** - the strength of ESLint is in its ecosystem and we had been searching for a way to better organize that ecosystem. As a result, we created the [`eslint-community`](https://github.com/eslint-community) GitHub organization as a home for high-value projects in the ESLint ecosystem. We intend this to be a place for projects related to ESLint to live and thrive so that they never fall out of maintenance. We are still working through the details on this and you can expect a follow-up blog post soon.

## Income review

During 2022, ESLint received $197,345.27 USD from all of our income sources. You can see the breakdown of our income sources in the following table.

| **Source** | **Amount** |
|-----------|-------------|
| Open Collective | $127,741.96 |
| GitHub Sponsors | $26,606.61 |
| Tidelift | $29,088.00 |
| Carbon Ads | $13,831.16 |
| Stackaid.us | $77.54 |
| **Total** | **$197,345.27** |

As usual, most of our donations came through Open Collective followed by GitHub Sponsors. Our Tidelift agreement also provided a good amount of income as did the ad on our website.

We are extremely grateful for the generous donations from companies and individuals that allow the project to continue development.

## Expenses review

In 2022, we spent $140,704.09 USD on the ESLint project as a whole. This includes regular maintenance and development as well as other costs related to the project. See the table below for an overview.

| **Category** | **Amount** |
|-----------|-------------|
| Maintenance and Development | $97,516.23 |
| Contributor Pool | $7,900.00 |
| Website Redesign | $7,167.52 |
| Guest Blog Posts | $600.00 |
| Community Logo Design | $2,700.00 |
| Documentation Project | $4,147.50 |
| Tech Writer Application Time | $1,500.00 |
| Open Source Collective Fee | $12,172.84 |
| Community Management | $7,000.00 |
| **Total** | **$140,704.09** |

As a reminder, the Contributor Pool is money we award for contributions to people who are not on the ESLint team as a way to thank them for making impactful contributions to the project. Community Management refers to the ongoing work required to manage the ESLint Community.

## Supporting our dependencies and ecosystem

In 2022, the ESLint project donated $14,350.00 USD to ecosystem projects and our dependencies. This is part of our ongoing commitment to supporting projects that are important to ESLint.

| **Project** | **Donations** |
|-----------|-------------|
| lint-staged | $2,450.00 |
| Ajv | $1,700.00 |
| debug | $1,700.00 |
| eslint-plugin-import | $1,700.00 |
| jsx-eslint | $1,700.00 |
| Sindre Sorhus | $1,700.00 |
| typescript-eslint | $1,700.00 |
| Rollup | $900.00 |
| Eleventy | $800.00 |
| **Total** | **$14,350.00** |

## Looking forward to 2023

While ESLint had a fantastic 2022, we are looking forward to an even better 2023. With the ESLint Community and documentation projects running, we expect to make the ESLint ecosystem even stronger. We are also planning to start on a [complete rewrite](https://github.com/eslint/eslint/discussions/16557) from the ground up to make sure that ESLint is ready for the next ten years of JavaScript development. This process will likely take place in small, incremental steps as we think through how JavaScript development has changed and will continue to evolve in the future.

We are excited about the future of ESLint and we appreciate your ongoing support.
