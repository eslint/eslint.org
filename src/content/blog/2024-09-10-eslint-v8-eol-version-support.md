---
layout: post
title: Version support policy and ESLint v8.x end of life
teaser: "ESLint v8.x end of life is October 5, 2024. We have partnered with HeroDevs to provide support after that."
tags:
  - Open Source
  - End of Life
  - Version Support
authors:
  - nzakas
categories:
  - Announcements
---

For ESLint's entire 11 year existence, we've only maintained one major release line at a time. This was both for practical reasons (limited team bandwidth) and technical reasons (our infrastructure was built to assume just one branch). Unfortunately, we haven't been good at communicating our version support policy, which has led to confusion and frustration when we do a major release.

## Adopting a formal version support policy

The Technical Steering Committee has adopted a formal [version support policy](/version-support) that explains our approach to supporting major release lines. In general, a major release line may be in one of the following statuses:

* **Current** - Receives active maintenance and development from the ESLint team. A release line is considered current when prerelease work begins.
* **Maintenance** - Receives critical bug fixes, including security issues, and compatibility fixes to ensure interoperability between major release lines. There is no backporting of other fixes or features from the current release line. A release line falls into maintenance status once work begins on the next major release and stays there until six months after the general availability of the current release line.
* **End of Life (EOL)** - When a release line falls out of maintenance mode it receives no further updates from the ESLint team.

Read the [full version support policy](/version-support) for more details.

## Commercial support from HeroDevs after EOL

Because we realize not everyone can upgrade to a new major release within six months, [we've partnered with HeroDevs](https://www.herodevs.com/blog-posts/herodevs-partners-with-eslint-to-launch-eslint-nes-for-legacy-javascript-support) to provide commercial support for EOL release lines. HeroDevs provides drop-in replacements for EOL ESLint packages that keeps your experience seamless.

Additionally, HeroDevs provides never-ending support for these drop-in replacements, meaning that they'll continue to receive critical security fixes.

## ESLint v8.x end of life is October 5, 2024

Following our policy, that puts the end of life for ESLint v8.x at October 5, 2024. After that point, the ESLint team will no longer make changes or publish releases in the v8.x release line. If you need  support for v8.x after EOL, please contact [HeroDevs][herodevs].

## Conclusion

We hope by adopting a formal version support policy that we're eliminating the confusion we've traditionally had around major releases. We tried to balance the needs of our users with the limitations the team has around availability. ESLint is maintained by a team of volunteers who work in their spare time, and maintaining multiple release lines on our own for an extended period of time is just not possible. That said, we recognize that users need some time to upgrade, and we want to make that as smooth as possible.

By partnering with HeroDevs, we also hope that we've made it easier for those who need to stay on an EOL version to get the support that they need.

We're grateful for the feedback from the community around the v9.0.0 release, and for the help of our friends at HeroDevs who provided guidance around creating our version support policy.

[herodevs]: https://www.herodevs.com/support/eslint-nes?utm_source=ESLintWebsite&utm_medium=ESLintWebsite&utm_campaign=ESLintNES&utm_id=ESLintNES
