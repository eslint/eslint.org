---
layout: post
title: ESLint use at Cesium through years of a changing ecosystem
teaser: "Insights into using ESLint for a large open-source 3D geospatial engine."
authors:
  - sanjeetsuhag
categories:
  - Case Studies
tags:
  - Guest Post
  - Rules
---

## Background

[CesiumJS](https://cesium.com/platform/cesiumjs/) is an open source JavaScript library for 3D geospatial visualization. Cesium’s roots are in aerospace with our first use case being accurate visualization of satellites and spacecraft. Now with more than 4,000,000 downloads and 9000 stars on GitHub, CesiumJS has a large community of users and contributors. Users from all over the world have used CesiumJS for a variety of different applications, from mapping and data analysis to [building interactive simulations for satellites](https://cesium.com/blog/2022/08/11/sedaro-satellite-visualizes-spacecraft-digital-twins-cesiumjs/), [event planning](https://cesium.com/blog/2022/07/27/oneplan-and-cesium-delivering-geospatial-for-events/), [open source intelligence](https://cesium.com/blog/2022/03/08/cesium-story-depicts-damage-in-ukraine/) and even for building [flight simulators](https://cesium.com/blog/2021/12/06/geofs-is-a-flight-simulator-that-showcases-global-satellite/).

## Switching to ESLint

As an open source project with frequent external contributions, it is important that we have clear and consistent coding conventions along with automated ways of enforcing them. Development started in 2011, and the first version of Cesium was released in 2014. As new browser APIs and standards have emerged, ensuring that CesiumJS stays compatible with modern use cases has been very important to us.

Initially, CesiumJS utilized JSHint for static analysis, since it was the standard at the time. In 2017, we switched over to ESLint since it was better at keeping pace with the rapid nature of ECMAScript standards development. It enabled enforcement of style rules through linting and applying automatic fixes for a lot of those rules. Perhaps most important of all was the ability to create extensible configurations that fit our own coding standards and extend configurations made by others in the community. In this post, I will explain how we, the maintainers of CesiumJS, use ESLint for ensuring code quality, enforcing consistency, and reducing developer burden in adhering to our code style and standards across our open source and private projects.


## How we use ESLint

The earlier in the development process a developer is able to catch and fix an issue, the less expensive it is to fix it. This “shifting left” strategy is a key priority for us and that is why we incorporate linting into the developer workflow so that developers are informed of common potential issues in their code as they write it or before they commit it. First, Visual Studio Code is the IDE of choice at Cesium, so we include the official ESLint VS Code extension in .vscode/extensions.json so that users are prompted to install the extension when they clone the repository and open it in VS Code. 

![VSCode ESLint extension](/assets/images/blog/2022/eslint-vscode.png)

Second, we use the [husky](https://github.com/typicode/husky) package to install pre-commit hooks to ensure that the lint command is run every time code is committed to the repository. We also run the lint script as part of our CI step. These tools are replicated for all our repositories to ensure a consistent and efficient experience in development and in review. Maintaining consistency in the code and the tools reduces the burden on developers working on different projects and makes it easier to onramp developers on new projects.

At Cesium, we maintain two [open source shareable ESLint configurations](https://github.com/CesiumGS/eslint-config-cesium): one for Node projects and another for browser environments. Often, both configurations are used in the same repository as there is often server/script code to accompany the client/web code. Our configurations rely heavily on the default ESLint recommended ruleset. Since we use Prettier for code formatting in all our projects, we also add the Prettier ruleset to ensure that there are no conflicts between the linter and the formatter. Projects often also end up extending the base source configuration to create a testing configuration for the Jasmine environment.

Up until 2022, CesiumJS had been locked to ECMAScript 2009, primarily due to browser constraints imposed by supporting Internet Explorer. We used [eslint-plugin-es](https://eslint-plugin-es.mysticatea.dev/) to restrict or allow specific language features. Once we dropped support for Internet Explorer, we were free to upgrade to a more modern version of ECMAScript. We set our version to ECMAScript 2020, and through ESLint the process was mostly automated thanks to the fix command. There were a lot of benefits that were instantly apparent to us; to name a couple of examples, GLSL shader strings were much easier to read because of the string template syntax and let and const made the code a lot more readable through clearer scoping and enforcing immutable references where needed.

Our current ESLint configuration allows users to use all modern features available up to ES2020. But since CesiumJS is a 3D engine, it’s important that developers balance the convenience of ES6+ code syntax with its performance impact. In areas of the code that are run enough times to make a significant impact, such as per-frame rendering loop code, a simple for loop may be better than an Array.forEach. We don’t impose blanket rules on situations like this since the nuance is difficult to automate. Instead we document the best practices in our [coding guide](https://github.com/CesiumGS/cesium/blob/main/Documentation/Contributors/CodingGuide/README.md#linting) and  have developers and reviewers measure the impact of such choices on a case-by-case basis.

## Conclusion

In conclusion, ESLint is an extremely important part of our development process. It’s a tool that helps us maintain a very large code base that is well-tested, stable, performant and has a strong coding style. It also helps us attract contributors and enables us to be confident in the code we ourselves write and review. If you’re interested in learning more about Cesium, head over to our [blog](https://cesium.com/blog) for more information.