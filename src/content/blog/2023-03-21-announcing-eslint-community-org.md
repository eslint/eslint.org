---
layout: post
title: Announcing the ESLint Community GitHub organization
teaser: >-
  The ESLint Community GitHub organization is a place for important ecosystem
  projects to get the attention and support they deserve.
tags:
  - eslint-community
  - Updates
authors:
  - MichaelDeBoey
categories:
  - Announcements
---

In our
[2022 year in review](https://eslint.org/blog/2023/01/eslint-2022-year-review),
we briefly mentioned a couple of project kickoffs, and we're excited to now
announce the official
[`eslint-community` GitHub organization](https://github.com/eslint-community).

The strength of ESLint is in its ecosystem, and we continue to investigate
different ways of further supporting that community. We began by
[donating to community projects](https://eslint.org/blog/2022/02/paying-contributors-sponsoring-projects/#supporting-the-community),
to ensure that high-value projects were receiving the funds they needed to
continue with ongoing maintenance and development. Our next step is to create
the `eslint-community` GitHub organization as a home for high-value projects in
the ESLint ecosystem.

## About the organization

As you can read in the
["`eslint-community` GitHub organization" RFC](https://github.com/eslint/rfcs/tree/main/designs/2022-community-eslint-org),
the goal of this new organization is to have a place where community members can
help ensure widely depended upon ESLint-related packages live and never fall out
of maintenance.  
The Community Core team (which currently consists of
[`@aladdin-add`](https://github.com/aladdin-add),
[`@ota-meshi`](https://github.com/ota-meshi),
[`@voxpelli`](https://github.com/voxpelli) and myself
[`@MichaelDeBoey`](https://github.com/MichaelDeBoey)) and all package
maintainers will make sure these packages stay up-to-date with newer ESLint
releases, and they don't hold the wider community back by depending on a single
person's GitHub or npm account.

### Organization projects

You might have noticed that some of your most beloved ESLint-related packages
have already been moved over to or been forked by the new `eslint-community`
organization. A full list of the current projects include:

* [`eslint-formatter-codeframe`](https://github.com/eslint-community/eslint-formatter-codeframe)
  and
  [`eslint-formatter-table`](https://github.com/eslint-community/eslint-formatter-table)  
  We took these over from [@fregante](https://github.com/fregante)
* [`eslint-plugin-eslint-plugin`](https://github.com/eslint-community/eslint-plugin-eslint-plugin)  
  [@aladdin-add](https://github.com/aladdin-add),
  [@bmish](https://github.com/bmish) and
  [@not-an-aardvark](https://github.com/not-an-aardvark) transferred this repo
  to the new `eslint-community` organization, but they're still maintaining it
* [`eslint-plugin-promise`](https://github.com/eslint-community/eslint-plugin-promise)  
  We took this one over from [@xjamundx](https://github.com/xjamundx)
* [`eslint-plugin-security`](https://github.com/eslint-community/eslint-plugin-security)  
  We took this one over from the
  [@nodesecurity](https://github.com/nodesecurity) team, but
  [@nzakas](https://github.com/nzakas) is still maintaining it
* [`eslint-utils`](https://github.com/eslint-community/eslint-utils) and
  [`regexpp`](https://github.com/eslint-community/regexpp)  
  We created a fork from [@mysticatea](https://github.com/mysticatea)'s repos
  and published them under the
  [`@eslint-community` npm organization](https://npmjs.com/org/eslint-community).

We also intend to fork, bring up to date, and publish the following packages
originally authored by [@mysticatea](https://github.com/mysticatea) as well:

* [`eslint-plugin-es`](https://github.com/mysticatea/eslint-plugin-es)  
  We'll work on getting all
  [`eslint-plugin-es-x`](https://github.com/eslint-community/eslint-plugin-es-x)
  features merged as well
* [`eslint-plugin-eslint-comments`](https://github.com/mysticatea/eslint-plugin-eslint-comments)
* [`eslint-plugin-node`](https://github.com/mysticatea/eslint-plugin-node)  
  We'll work on getting all
  [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n)
  features merged as well

Of course, we don't want to stop there.

## Submitting projects for the organization

If you think your project would be a good fit for the new `eslint-community`
organization, or you're depending on a project that's currently unmaintained and
want to have the community to adopt it, you can contact the Community Core team
on [the official ESLint Discord](https://eslint.org/chat/eslint-community).

Keep in mind that we'll only be able to accept projects that adhere to the
following criteria:

* Is it a package that is ESLint-related?  
  Mostly this will be ESLint plugins, but (unmaintained) dependencies of such
  packages, closely related packages, or packages split from the main ESLint
  repo (like
  [`eslint-formatter-codeframe`](https://github.com/eslint-community/eslint-formatter-codeframe)
  or
  [`eslint-formatter-table`](https://github.com/eslint-community/eslint-formatter-table))
  or used by the main repo (like
  [`eslint-utils`](https://github.com/mysticatea/eslint-utils) and
  [`regexpp`](https://github.com/mysticatea/regexpp)) could go in the
  `eslint-community` GitHub organization as well.

  We won't be accepting shareable configs as these are typically very
  opinionated and are easy to extend when necessary.

* Is it widely depended upon throughout the ESLint community?  
  We don't have a real number in mind here, but the packages we currently
  maintain (or that we're planning to maintain) almost all have at least 3M
  downloads/week.

These criteria aren't written in stone, but are the guidelines we're beginning
with to determine whether to accept a project into the organization.

## Conclusion

We hope that this new `eslint-community` organization will help us further
support the awesome ESLint ecosystem and ensure that the community can continue
to rely on these high-value, widely depended upon projects for years to come. Ensuring that the ESLint ecosystem remains vibrant and without stagnation is a key goal of the project as a whole, and we believe the `eslint-community` organization will only increase the confidence of ESLint users when relying on community-maintained projects.

If you have any questions about the `eslint-community` organization, feel free to ask them on
[the official ESLint Discord](https://eslint.org/chat/eslint-community).
