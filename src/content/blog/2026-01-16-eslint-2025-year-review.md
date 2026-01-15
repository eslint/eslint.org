---
layout: post
title: ESLint's 2025 year in review
teaser: "2025 saw the expansion of ESLint to CSS and HTML, the introduction of multithreaded linting, and the first steps toward v10.0.0."
tags:
  - Updates
  - Year in Review
  - Releases
authors:
  - nzakas
categories:
  - Storytime
---

The plan for 2025 was to build upon the foundation of language plugins introduced in 2024 and to start the long-awaited core rewrite. We spent the year expanding our official language support to include CSS and HTML, introducing significant performance improvements through multithreaded linting, and preparing for the next major version, ESLint v10.0.0.

## Expanding language support: CSS and HTML

![ESLint logo on the projector screen at Google I/O](/assets/images/blog/2026/2025-eslint-google-io.png)

Following the release of JSON and Markdown support in 2024, we continued our mission to make ESLint a truly language-agnostic linter. In February, we released [official CSS support](https://eslint.org/blog/2025/02/eslint-css-support/) via the `@eslint/css` plugin, allowing users to lint their stylesheets with the same familiar configuration system.

In May, we were excited to announce that `html-eslint` had [joined the ESLint ecosystem](https://eslint.org/blog/2025/05/eslint-html-plugin/) as a language plugin, bringing robust HTML linting to the project. These additions mean that ESLint can now officially be used to lint the "big three" of the web: JavaScript, CSS, and HTML.

ESLint's new CSS and HTML support were highlighted in [three](https://www.youtube.com/live/GjvgtwSOCao?feature=shared&t=2319) [different](https://youtu.be/o2wkYzu5u50?feature=shared&t=545) [talks](https://youtu.be/beYbnNT_02U?feature=shared&t=1231) at Google I/O as well on the [Chrome blog](https://developer.chrome.com/blog/web-at-io25).

## ESLint continues to grow

[![2025 Downloads - Summarized below](/assets/images/blog/2026/2025-npm-downloads.svg)](https://www.npm-stat.com/charts.html?package=eslint&from=2025-01-01&to=2025-12-31)

ESLint's usage continued its relentless climb in 2025. We started the year with 42,717,190 weekly npm downloads and ended with a staggering 70,713,031 weekly downloads—a 65% increase in just twelve months. By the end of the year, ESLint had reached 2,964,923,725 total downloads for 2025 alone, a testament to the critical role it plays in the modern web development ecosystem.

![2025 Release Line Downloads - Summarized below](/assets/images/blog/2026/2025-release-line-downloads.svg)

Downloads for the v9.x release line continue to grow as the ecosystem upgrades from v8.x. By the end of 2025 and beginning of 2026, weekly downloads for the v9.x release line topped 36 million, more than half of our weekly downloads. The v8.x release line is still popular with over 26 million weekly downloads.

## Integrating with AI

As AI became an integral part of the development workflow in 2025, we worked to ensure that ESLint remains a key part of that experience. In November, GitHub announced that [ESLint is now integrated with Copilot code review](https://github.blog/changelog/2025-11-20-linter-integration-with-copilot-code-review-now-in-public-preview/) in public preview. This integration allows Copilot to surface ESLint violations directly during the code review process, helping developers catch issues before they are merged.

We also embraced the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) by releasing the [`@eslint/mcp`](https://www.npmjs.com/package/@eslint/mcp) package. This MCP server allows AI models, such as those used in VS Code's Copilot, to interact directly with ESLint. By providing the AI with direct access to linting results and the ability to run ESLint on demand, we're helping these tools provide more accurate and context-aware suggestions for your codebase.

## Performance and Workflow Improvements

One of the most significant technical achievements of 2025 was the introduction of [multithreaded linting](https://eslint.org/blog/2025/08/multithread-linting/) in v9.34.0. This feature, which had been in discussion for over a decade, allows ESLint to utilize multiple CPU cores to lint files in parallel. Large projects have seen performance improvements ranging from 30% to over 300%, depending on the hardware and project structure.

We also introduced [bulk suppressions](https://eslint.org/blog/2025/04/introducing-bulk-suppressions/) in April. This feature allows teams to adopt stricter linting rules incrementally by marking existing violations for later fixing without cluttering the source code with comments. It has become a key tool for large-scale migrations and maintaining code quality in professional environments.

## Updates to support the latest ECMAScript features

Keeping pace with the JavaScript language remains a core priority. In 2025, we added support for the following new JavaScript features:

* [ES2026 Explicit Resource Management](https://eslint.org/blog/2025/06/13/eslint-v9.29.0-released/) (`using` declarations)
* [ES2025 Regex modifiers](https://github.com/tc39/proposal-regexp-modifiers) (completed rollout)
* [ES2025 Global variables](https://eslint.org/blog/2025/06/13/eslint-v9.29.0-released/) (`Float16Array` and `Iterator`)

These updates ensure that ESLint remains an up-to-date tool for modern JavaScript development.

## The Road to ESLint v10.0.0

The end of 2025 was focused on the next major milestone: [ESLint v10.0.0](https://eslint.org/blog/2025/10/whats-coming-in-eslint-10.0.0/). This release represents a significant cleanup of the project, including:

* **Dropping support for Node.js < 20.19.0**, allowing us to take advantage of modern Node.js features like native ESM support in `require()`.
* **Full removal of the legacy eslintrc configuration system**, finalizing the transition to flat config that began years ago.
* **Improving JSX reference tracking**, making scope analysis more accurate for modern React and SolidJS applications.

We released the first alpha in November, followed by a beta in December, and we are currently in the release candidate phase as we head into 2026.

## Financials review

The next few sections dig into the project financials. All of this information is gathered from the Open Collective transaction list with the exception of Tidelift payments (which are retrieved from Tidelift directly). Our fiscal 2025 runs from January 1, 2025 at midnight UTC to December 31, 2025 at 11:59 p.m. UTC.

### Income review

![2025 Income Sources - Summarized in following table](/assets/images/blog/2026/2025-income-sources.svg)

During 2025, ESLint received $204,451.97 USD from all of our income sources. You can see the breakdown of our income sources in the following table.

| **Source**         | **2025 Amount**    | **2024 Amount** | **Gain/Loss %** |
|--------------------|---------------|-----------------|-----------------|
| Open Collective    | $142,814.72   | $122,996.60     | +16.11%         |
| GitHub Sponsors    | $40,702.15    | $35,928.93      | +13.29%         |
| Tidelift           | $15,500.00    | $18,449.16      | -15.99%         |
| Website Ads        | $3,718.35     | $6,345.54       | -41.40%         |
| Thanks.dev         | $1,461.74     | $4,234.09       | -65.48%         |
| Open JS Foundation | $255.01       | $0.00           | +100.00%        |
| Threadless         | $0.00         | $9.98           | -100.00%        |
| **Total**          | **$204,451.97** | **$187,964.30** | **+8.77%**      |

We are pleased to see continued growth in our primary sponsorship channels via Open Collective and GitHub Sponsors. However, we saw a continued decline in Tidelift revenue and a significant drop in website ad revenue as we moved entirely to Ethical Ads.

Thanks.dev revenue actually *increased* to $11,337.61. This is a clerical issue because we forgot to cash out before the end of 2025 so $9,875.87 was received after the transaction deadline for our financials. Because we didn't use this money to pay for expenses in 2025, we didn't include it in the table.

### Top sponsors

In 2025, we received generous donations from many companies, led by Automattic and Airbnb ($24,000 each), Meta Open Source ($20,000), and AG Grid ($20,000).

| **Sponsor**                    | **2025 Donation Total** |
|--------------------------------|-------------------------|
| Automattic                     | $24,000.00              |
| Airbnb                         | $24,000.00              |
| Meta Open Source               | $20,000.00              |
| AG Grid                        | $20,000.00              |
| Shopify                        | $13,000.00              |
| trunk.io                       | $11,000.00              |
| Qlty Software                  | $11,000.00              |
| Liftoff                        | $6,000.00               |
| StackBlitz                     | $5,680.65               |
| American Express               | $5,500.00               |
| Vite                           | $5,500.00               |
| EthicalAds                     | $3,718.35               |
| Cybozu                         | $3,000.00               |
| Nx                             | $2,400.00               |
| HeroCoders                     | $2,400.00               |
| GitBook                        | $2,400.00               |
| Discord                        | $2,400.00               |
| Mercedes-Benz Group            | $2,200.00               |
| Icons8                         | $2,200.00               |
| LambdaTest                     | $2,078.57               |

### Expenses review

![2025 Expenses - Summarized in following table](/assets/images/blog/2026/2025-expenses.svg)

In 2025, we spent $262,150.09 USD on the ESLint project as a whole vs. $204,451.97 of income for a **net loss of -$57,698.12**. This is slightly better than our $59,705.24 loss in 2024, but it still reflects our active investment of our reserves into the project's future.

| **Category**                | **2025 Amount**  | **2024 Amount** | **Gain/Loss %** |
|-----------------------------|------------------|-----------------|-----------------|
| Maintenance and Development | $170,966.29      | $147,273.43     | +16.09%         |
| TSC Stipend (Tidelift)      | $15,500.00       | $18,449.16      | -15.99%         |
| Triage and Support          | $450.00          | $3,985.50       | -88.71%         |
| Contributor Pool            | $24,679.72       | $14,100.30      | +75.03%         |
| Payment Processor Fees      | $4,540.18        | $3,808.97       | +19.20%         |
| Health Insurance            | $13,642.32       | $12,698.40      | +7.43%          |
| Open Source Collective Fee  | $13,824.32       | $11,696.69      | +18.19%         |
| Ecosystem/Dependencies      | $16,500.00       | $16,100.00      | +2.48%          |
| Community Management        | $950.00          | $9,825.03       | -90.33%         |
| Google Workspace            | $252.26          | $182.06         | +38.56%         |
| Equipment                   | $145.00          | $0.00           | +100.00%        |
| Guest Blog Posts            | $300.00          | $0.00           | +100.00%        |
| Config Inspector            | $400.00          | $2,350.00       | -82.98%         |
| Code Explorer               | $0.00            | $7,200.00       | -100.00%        |
| **Total**                   | **$262,150.09**  | **$247,669.54** | **+5.85%**      |

Our Maintenance and Development costs continued to rise as we welcome four new team members, tackled the core rewrite and the preparation for v10.0.0. We also significantly increased our investment in the Contributor Pool, which compensates outside contributors for high-impact work. We were able to offset some of these increases with lower costs for triage and community management compared to 2024.

### Supporting our dependencies and ecosystem

As part of our commitment to the financial health of the JavaScript ecosystem, we continued to donate to the projects we depend on. In 2025, we increased our total donations to $16,500.00.

| **Project**           | **Donations** |
|-----------------------|---------------|
| Ajv                   | $1,800.00    |
| debug                 | $1,800.00    |
| eslint-plugin-import  | $1,800.00    |
| lint-staged           | $1,800.00    |
| Rollup                | $1,800.00    |
| Sindre Sorhus         | $1,800.00    |
| typescript-eslint     | $1,800.00    |
| jsx-eslint            | $1,500.00    |
| Eleventy              | $1,200.00    |
| CSSTree               | $900.00      |
| WebdriverIO           | $300.00      |
| **Total**             | **$16,500.00** |

## Looking forward to 2026

With ESLint v10.0.0 just around the corner, 2026 is shaping up to be another landmark year. Once v10.0.0 is stable, our primary focus will shift towards:

1. **Completing the Core Rewrite:** Moving the remainder of the legacy core logic into the new language-agnostic architecture and making the core asynchronous.
2. **Expanding Language Plugins:** Further improving CSS, JSON, and Markdown support, and exploring official plugins for other common web formats.
3. **Performance Optimization:** Continuing to refine multithreaded linting and looking for further opportunities to reduce linting times.
4. **Cross-file Linting:** Allow ESLint to follow dependencies through the files that it's linting for more accurate results.

We are incredibly grateful to our community and sponsors for their continued support. Your contributions allow us to maintain ESLint as a high-quality, free, and open-source tool for millions of developers. We look forward to another year of growing and improving together!
