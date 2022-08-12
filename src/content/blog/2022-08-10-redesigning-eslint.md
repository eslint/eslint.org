---
layout: post
title: Redesigning ESLint
teaser: "A brief insight into ESLint's recent brand refresh and website redesign."
tags:
  - brand
  - design
authors:
  - haydenbleasel
categories:
  - Storytime
---

Hi! My name's Hayden. I'm a designer and developer and, until recently, I ran a little agency called [Jellypepper](https://jellypepper.com).

We were fortunate enough to work with the ESLint team on their new brand and website. I'm a huge fan of ESLint and use it every day, even going to the effort of writing my own [600-line ESLint config](https://github.com/haydenbleasel/harmony) to use across all my React, Next.js and Expo projects.

[Nicholas](https://github.com/nzakas) originally reached out to us on Twitter to kick off the largest project the ESLint team has taken on in its nine years of existence. He wanted to create a stronger brand identity for the ESLint team and its community, and make the website more functional, easier to navigate, and more useful to everyone from new users to established users.

> Hi Hayden, I wanted to say thanks for the donation to ESLint. As it so happens, the project is looking for a bit of a rebrand (keep the logo, change everything else) and website redesign, so I was wondering if you’d be interested. It just seemed like a potentially good match.

This was a bit of a dream project for me 😅 So, needless to say, we were totally in.

## The Brand

The ESLint Brand is an interesting one - without too much official visual design, the team has managed to create a brand that is unique and widely recognized by the developer community.

### The Logo

The logomark is at the core of ESLint's brand identity and one of the most identifiable pieces. It’s a connection to their ecosystem - you can find it everywhere, from IDE marketplaces to corporate sponsorship pages across the web. It carries with it the expectation of a community of developers who are passionate about the code they write.

![ESLint Logo Animation](/assets/images/blog/2022/eslint-logo-animation.gif)

While we kept the icon (given its widespread usage in websites, IDEs, platforms and projects), we wanted to make it that little bit more refined, modern and flexible. By bringing it together our new primary typeface, Space Grotesk (more on this below), we created a new ESLint logomark. Due to its simplicity, it works in a variety of colours and spaces.

![ESLint Logo Mockup](/assets/images/blog/2022/logo-mockup.png)

### The Typeface

As a content-driven organization, typography is at the heart of the new ESLint brand. The website, docs, and blog all require typography to be readable and enjoyable. The brand leverages a purposeful set of typographic styles designed to make the content as accessible as possible for everyone.

From a technical point of view, we wanted fonts that were widely accessible and conveniently located, so could access it everywhere (particularly on other Google products such as Docs and Slides) and it fits with the free and open-source theme.

We decided to go with [Space Grotesk](https://fonts.floriankarsten.com/space-grotesk) — a fantastic, characteristic font that balances that flair with the technical geometric elements reflecting a more developer-centric side. It creates character with its idiosyncratic details that share principles with the logomark and brings life and energy to the brand by showcasing its more technical details.

![An example of the Space Grotesk font](/assets/images/blog/2022/space-grotesk.png)

Space Grotesk works hand-in-hand with its origin sister font, Space Mono. It was developed for editorial use in headline and display typography; the letterforms infuse a geometric foundation and grotesque details with qualities often found in headline typefaces of the 1960s, many of which have since been co-opted by science fiction films, television, and literature.

![An example of the Space Mono font](/assets/images/blog/2022/spacemono-satellites.gif)

### The Colors

ESLint’s color palette speaks to the brand in ways that are every bit as powerful as the copy and logo. It not only affects how the brand design looks, but can go as far as to elicit emotion and reflect the personality of the ESLint brand. Colors are the first impression a design makes, and as such, play an important role in a design’s look and feel.

While color can be subjective, it's clear that good colors can attract and convert users. Bad colors, on the other hand, can turn away users and even make designs inaccessible and unusable.

Due to the functional nature of ESLint, we chose to keep it simple with a primary, neutral and small set of secondary palettes. The new primary color palette is derived from the original logo — we use the two existing colors to create a unique primary tonal range.

![A snapshot of ESLint's color palette](/assets/images/blog/2022/eslint-colors.png)

## The Website

Next up was the redesign of the [ESLint website](https://eslint.org/). Besides maximising the visual appeal of the site, we had a few goals we wanted to achieve for each page. For example, on the homepage:

1. We wanted to include the latest and upcoming versions of ESLint in the hero section. This was a key part of the design, as it would be the first time we had a dedicated section for ESLint updates.
2. We wanted to promote sponsorship. ESLint relies on donations for ongoing maintenance and development, and we wanted to make sure that we could help accelerate the growth of the project.
3. We wanted to show ESLint in action — how it can be used in the real world, and how it can be used to make your code more readable.
4. We wanted to showcase some of the incredible stats that ESLint has amassed — as of right now, that's 9M dependents, 25.7M weekly downloads and 21K stars on GitHub.

![A mockup of the new ESLint homepage design](/assets/images/blog/2022/eslint-website-home.png)

I also wanted to introduce some animation and life into the ESLint homepage hero while giving our audience a sense of what it's like to work with ESLint.

The red underline in VS Code is synonymous with ESLint, as it is the way VS Code implements ESLint action items. Using these visual indicators, I created a small but fun interaction that gives our visitors a simplified experience.

I was particularly happy with how this idea turned out! 💡

![The ESLint homepage animation](/assets/images/blog/2022/homepage-animation.gif)

By incorporating elements of the wider brand including IDE integration, code snippets and supporter logos, we brought the brand to life. Plus, no dev site would be complete without a testimonial from Addy Osmani.

## The Docs

Next up was the mack daddy, redesigning the ESLint documentation. The docs are a central part of ESLint’s ecosystem and are the place where users find information about the project as well as the codebase.

We wanted to give it a bit of a revamp, creating a consistent information architecture (IA) across all pages, as well as making the pages easier to scan and navigate. We also added a version dropdown to view previous versions of the docs.

![A mockup of the new ESLint Docs design](/assets/images/blog/2022/eslint-docs.png)

I also published the little Carbon Ads component as a [Figma Community file](https://www.figma.com/community/file/1019502569915291740)!

## The Playground

The last part of the project was a new microsite called Playground! It's a fantastic little tool that allows you to create an ESLint configuration file with easy-to-use settings and test your code against it. Then, once you're happy with it, you can download your config file to use locally. Its also a fantastic way of allowing new users to try ESLint directly in the browser.

We started designing Playground with a few key requirements in mind — specifically we wanted to make it easy to use, and to make it easy to create and share reproducible bugs with ESLint. Users should also be able to switch between different versions of ESLint, see potential fixes to given problems and install plugins. Ultimately the team couldn’t implement all of these features, but we designed for them all the same.

There were a few tricky design challenges to overcome here — particularly around the density of information. Exposing all rules in the UI would make things visually difficult to parse, so we needed a way of adding rules to the UI without having to scroll down to the bottom of the page, then customising the value of each rule easily.

![A mockup of the new ESLint Playground app](/assets/images/blog/2022/eslint-playground.png)

## What's next?

The ESLint team are currently rolling out everything above (you're on the new website right now!).

I want to thank the ESLint team, especially Nicholas, for the opportunity to work on this project. I was also very fortunate to work with such talented and passionate people, such as [Sara](https://www.sarasoueidan.com/) and [Gavin](https://gavinbarnett.com/).

If you have any questions, comments, or feedback on the ESLint brand, please reach out to me on Twitter at [@haydenbleasel](https://twitter.com/haydenbleasel).

Happy linting, folks! ✌️
