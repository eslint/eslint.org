---
layout: post
title: "no-unused-binary-expressions: From code review nit to ecosystem improvements"
teaser: "Reflecting on the power of lint rules"
authors:
  - captbaritone
categories:
  - Case Studies
tags:
  - Guest Post
  - Rules
---
Four years ago, while doing a code review at work, I was surprised that [Flow](https://flow.org/) had not warned about a null check that had become unnecessary. This month [TypeScript 5.6](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/#disallowed-nullish-and-truthy-checks1) released with validation rules that disallows nullish and truthy checks which uncovered nearly 100 existing bugs in the top 800 TypeScript repos on GitHub.

The two events are connected, because that moment in code review four years ago led me to write [the `no-unused-binary-expressions` rule](https://eslint.org/blog/2022/07/interesting-bugs-caught-by-no-constant-binary-expression/) which helped inspire the TypeScript features.

Given the protracted timeline and the many intermediate steps I thought it would be interesting to reflect on what led to this observation in code review snowballing into what I feel is a significant impact to a large number of developers, and why I think the snowball could continue to grow.

To answer these questions, it helps to review the timeline of events.

## Timeline

* **May 2020:** I was reviewing a pull request at work that made a nullable value non-nullable. I noticed that the author had left behind an `if` condition that handled the now impossible case where the value was `null`. I started to wonder why Flow hadn’t automatically pointed that out.
* **May 2020:** I posted to an internal group asking the Flow team about it. The answer was that Flow, like TypeScript, is not sound. For example `arr[x]` is typed as non-nullable but might actually be undefined at runtime. Flow had implemented these checks in the past, but they caused major issues by telling people their null checks were safe to remove when they were not, so they removed the checks. [Brad Zacher](https://zacher.com.au/) happened to see the post and chimed in with an observation that a syntactic approach, rather than a type based one, could be safe even if it was less powerful.
* **August 2020:** I implemented the syntactic validation approach as an internal ESLint rule and realized it generalized beyond null checks to all constant comparisons. I ran it in Meta’s mono-repo and found it identified several hundred existing bugs.
* **October 2020:** Brad Zacher suggested I propose it as a new core rule in ESLint. [I did](https://github.com/eslint/eslint/issues/13752), and they [liked the idea](https://github.com/eslint/eslint/issues/13752#issuecomment-729125654).
* **November 2021 - April 2022:** I [rewrote the rule for open source](https://github.com/eslint/eslint/pull/15296), which took a surprising amount of effort due to different positions on things like JSX and style.
* **July 2022:** I decided to write a blog post about the new rule. The ESLint team was redoing their site at the time and looking for more blog content, so they asked if I wanted to write the [post on the official blog](https://eslint.org/blog/2022/07/interesting-bugs-caught-by-no-constant-binary-expression/).
* **November 2023:** The blog post made the [front page of Hacker News](https://news.ycombinator.com/item?id=38196644). The post was likely shared by someone who read a [tweet](https://twitter.com/captbaritone/status/1722290945633443973) I posted sharing that it was going to be enabled by default in `eslint:recommended` beginning with ESLint v9.0.0.
* **April 2024:** The rule finally ships as enabled by default in [ESLint v9.0.0](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/). This change had to wait for a new major version because enabling a new rule in `eslint:recommended` is a breaking change.
* **July 2024:** The TypeScript team, looking to expand upon the idea of checking for a specific type of constant condition, found the blog post and code. They expanded the set of validations they perform to include most of the checks the ESLint rule performs. They found similar results. [94 real errors in the top 800 TS repos](https://github.com/microsoft/TypeScript/pull/59217#issuecomment-2221372781). The success of the ESLint rule gave them confidence to enable the check by default in `tsc`.
* Sept. 2024: The validation ships in [TypeScript 5.6](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/#disallowed-nullish-and-truthy-checks1).

## Reflections

Upon reflection, there were a number of key factors that contributed to this small observation in code review helping spur a meaningful ecosystem wide improvement:

* Meta’s internal culture empowered me, a random engineer, to have a direct conversation with members of the Flow team. That conversation happened in a venue where Brad Zacher, an ESLint expert, could happen upon it and chime in.
* Meta’s monorepo gave me direct access to a massive codebase which let me easily run early drafts of the rule to assess how impactful the validation would be on a vast amount of real code.
* Meta’s culture of autonomy gave me the freedom to take on a side quest of writing this rule despite it not being part of my team’s responsibility.
* ESLint’s pluggable architecture empowered me to write my own rule and easily deploy it across the whole company without needing to convince any gate keepers.
* The ESLint team’s openness to, and active support of, a new contributor adding a new core rule despite a [2020 policy](https://eslint.org/docs/latest/contribute/propose-new-rule) of only accepting new rules if they relate to new language features.
* Active communication about the work initiated by me, and amplified by the ESLint team, in the form of a blog post and Tweets. These allowed the TypeScript team to connect the dots between a more specific request they got about disallowing `if (/regex/)`, and the broader idea of detecting constant conditions.
* My having a somewhat obsessive personality that wasn’t satisfied with just pointing out a useless null check in code review. Instead, I saw that a fundamental solution to that class of problem was possible, and I wasn’t satisfied until that solution was enabled not just for me, my team, or my company, but for the broader ecosystem.

## What’s Next

It’s taken four years for the ripple of Brad’s initial observation on that internal post to reach this point, but I think the ideas here have the potential to resonate even further:

* TypeScript and Flow could internally track types which they happen to know are sound, and opportunistically report errors based on that data, allowing checks like this to be performed in many many more cases.
* Other unsound languages which previously avoided reporting unnecessary checks for the same reason Flow did could use this same approach to catch logic errors.
* More broadly, dead code elimination is a well understood area of compiler design with many codified techniques and approaches. However, they are nearly always applied as optimizations in the compiler backend. I suspect many of these same dead code elimination techniques could be brought to the front-end of the compiler and used to detect and report bugs.

## Conclusion

Solving problems fundamentally requires the combined insights of many people, the persistence of stubborn individuals, active communication, a community that learns from each other, and often a lot of patience. But if you can make it happen, fundamental solutions scale really well. They apply broadly, can be adapted into other tools and domains, and improve the state of the world not just for developers but to the users those developers serve.

---

Thanks to [Brad Zacher](https://zacher.com.au/) for his initial key observation and ongoing encouragement, to [Nicholas C. Zakas](https://humanwhocodes.com/) and [Milos Djermanovic](https://github.com/mdjermanovic) for significant contributions to the rule during code review, and to [Ryan Cavanaugh](https://twitter.com/SeaRyanC) for bringing these same types of validation to the TypeScript ecosystem.