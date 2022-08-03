---
layout: post
title: "ESLint's new config system, Part 1: Background"
teaser: "ESLint's config system started out fairly simple back in 2013. Since that time it has grown more complex and it's time for a change."
tags:
  - Configuration
  - Command Line
authors:
  - nzakas
categories:
  - API Changes
---

When ESLint was first released in 2013, the config system was fairly simple. You could define the rules you wanted to enable or disable in a `.eslintrc` file. When a file was linted, ESLint would first look in the same directory as that file for a `.eslintrc` file and then continue up the directory hierarchy until reaching the root, merging configurations from all the `.eslintrc` files found along the way. This system, which we called the configuration cascade, allowed you to easily override rules for particular directories, something that JSHint wasn't capable of doing. You could also add more configuration in the `eslintConfig` key inside of `package.json`.

Over the years, however, the config system grew into an unwieldy mess. That's why in 2019 I proposed creating a new config system to make it easier to configure ESLint in a world where JavaScript projects are growing increasingly complex. A significant portion of the new config system has been merged into the main branch, and so it's time to start learning about how you will configure ESLint in the future. But in order to do that, it's helpful to take a look back and see how we got into the current state of things.

## Incremental changes leading to maximum complexity

Looking back at how the current config system (called the eslintrc system) evolved, every step made logical sense for where we were at the time. ESLint has always operated on an incremental approach to development where we look at ways to improve what we already have instead of throwing things away to start over. The eslintrc system was no different.

### The `extends` key

The first significant change to eslintrc was with the introduction of the `extends` key. The `extends` key, borrowed lovingly from JSHint, allowed users to import another configuration and then augment it, for example:

```json
{
  "extends": ["./other-config.json"],
  "rules": {
    "semi": "warn"
  }
}
```

So assuming `./other-config.json` had some configuration data, you could import that and then add your own `rules` settings on top of it. This turned out to a great step forward for ESLint for a number of reasons.

First, `extends` actually preceded the idea of shareable configs that could be distributed via npm. It was during the implementation of `extends` that we realized shareable configs were possible. The files specified in `extends` were loaded via the Node.js `require()` function, so anything Node.js could load through that function could also work as a config to extend from.

Second, `extends` allowed us to implement `eslint:recommended`, the set of rules that we felt were important for everyone to enable. Originally ESLint has several rules enabled by default, but that became a burden for users. So we switched to having all rules off by default, which also was confusing for new users who didn't see any rules. Adding `eslint:recommended` allowed us to make it explicit that you were including a bunch of rules we recommended but you could remove them if you didn't want to.

In hindsight, if we had thought things through a little more, we would have removed the configuration cascade at this point. Introducing `extends` enabled a lot of the same use cases as the cascade, and keeping both turned out to be a mess that we would spend years trying to fix.

### Personal configs

The next layer of complexity was added when people requested that we add the ability to have a personal config file at `~/.eslintrc`. So we added an additional check: if we didn't find a config file in the ancestry of the file location, then we would automatically look for a personal config file.

### Multiple config file formats

As part of a refactor, we discovered that it would be trivial to allow different config file formats. Instead of forcing everyone to use a nonstandard `.eslintrc` file, we could formalize the JSON format as `.eslintrc.json` and also add support for YAML (`.eslintrc.yml` or `.eslintrc.yaml`) and JavaScript (`.eslintrc.js`). For backwards compatibility we continued to support `.eslintrc` because it was a trivial amount of code to keep around.

This also turned out, in hindsight, to not be a great idea. Adding a JavaScript config file format created an incompatibility between it and the non-JS formats: any JavaScript object could be passed into the config and available in rules. Because we didn't properly validate the config to exactly match the non-JS formats, we ended up with some rules requiring regular expression objects to be passed in to be properly configured. While this could work in the JS config file format, the rules could not be properly configured in non-JS config files. Unfortunately, because plugin rules depended on this functionality, we couldn't go back and fix it without breaking things.

### Shareable configs and dependencies

Perhaps the biggest problem we faced early on was when npm decided to [stop installing peer dependencies in v3](https://github.com/npm/npm/issues/6565#issuecomment-74971689). Prior to this point, we had recommended that shareable configs include any plugins they depended on as peer dependencies rather than regular dependencies. This was a quirk of the way that `extends` was implemented: using `require()`.

Because shareable configs were data-only and couldn't directly reference Node.js dependencies, `require()` would not automatically load direct dependencies into the path for ESLint to resolve them. Peer dependencies, on the other hand, worked perfectly by just using `require()` because those were installed in a location where the normal package lookup worked.

When npm v3 stopped installing peer dependencies by default, all of the shared configs relying on this behavior stopped working correctly. There is a [long-running issue](https://github.com/eslint/eslint/issues/3458) requesting that shareable configs be allowed to use dependencies directly, but the architecture of eslintrc just didn't allow for it. We would have essentially had to recreate the entire `require()` functionality inside of ESLint to work around the way shareable configs were designed. We recommended that shareable configs create a post-install script to install their peer dependencies instead. Not ideal by any stretch of the imagination.

We added the `--resolve-plugins-relative-to` command line option to try and help with this problem, but it wasn't enough. The most popular requests for help in our [Discord #help channel](https://eslint.org/chat/help) have to do with improper resolution of plugins from config files.

npm eventually changed back to installing peer dependencies by default in v7, but by that point the damage on the ESLint ecosystem had been done.

### The `root` key

As time went on, the config cascade continued to cause problems for users. Most frequently, people wouldn't realize that they had a config file in an ancestor directory of the project they were working on. This would create confusion because they would be getting ESLint settings that they seemingly hadn't configured.

To help with this problem we introduced the `root` property for configuration files. When `root: true` is specified in a config, the search for further config files doesn't proceed to ancestor directories. This stopped a bit of the confusion and we ended up automatically including `root: true` in configs that ESLint generated via the old `--init` command to help users start off with the least amount of confusion.

### The `overrides` key

ESLint continued to receive requests for more powerful ways to configure their projects. More specifically, there were requests to provide [glob-based configs](https://github.com/eslint/eslint/issues/3611) from within existing config files. This led to the creation of an `overrides` key that would let you further modify configurations for a specific subset of files that ESLint was linting. Here's an example:

```json
{
  "rules": {
    "quotes": ["error", "double"]
  },

  "overrides": [
    {
      "files": ["bin/*.js", "lib/*.js"],
      "excludedFiles": "*.test.js",
      "rules": {
        "quotes": ["error", "single"]
      }
    }
  ]
}
```

In this case, the JavaScript files in `bin` and `lib` prefer single quotes instead of the double quotes preferred everywhere else.

The `overrides` key with glob-based configuration turned out to be a much better way of accomplishing what the configuration cascade was attempting to do. Once again, in hindsight, this would have been the perfect time to try and remove the cascade...but we didn't. And the complexity didn't stop there.

### Adding `extends` to `overrides`

The last step of eslintrc development was to add the `extends` key to `overrides` configurations, allowing users to inject additional config data into a glob-based config object, like this:

```json
{
  "rules": {
    "quotes": ["error", "double"]
  },

  "overrides": [
    {
      "files": ["bin/*.js", "lib/*.js"],
      "excludedFiles": "*.test.js",
      "extends": ["eslint:recommended"],
      "rules": {
        "quotes": ["error", "single"]
      }
    }
  ]
}
```

This addition also introduced a lot of additional complexity because we had to figure out how to merge glob patterns between two different configs. The end result was that `extends` inside of an `overrides` config would use an AND operator to merge `files` and `excludedFiles`. If you're not sure what exactly that means, you're not alone. It's confusing even to us.

## The need for simplification

Around the new year of 2019, I was getting more concerned about the complexity of the eslintrc system. We were getting more and more questions about obscure error messages related to loading config files that couldn't find other config files or plugins. Additionally, the team was collectively becoming afraid of touching anything to do with the config system. No one really understood all of the different permutations around calculating the final config for any given file. We had fallen into the trap that may software projects do: we kept adding new features without taking a a step back to look at the problem (and solution) holistically. This had led to an almost unmaintainable part of our codebase.

It was at this time that I did a thought experiment: what would the config system look like if I started from scratch, today, knowing everything that I now know about ESLint? What followed was the most contentious [RFC proposal](https://github.com/eslint/rfcs/pull/9) in the history of ESLint. At the time, the team was almost evenly split between those who wanted to throw away eslintrc and start from scratch and those who felt that eslintrc could be saved with more iterations. Ultimately, after 18 months of revisions and debate, we decided that it was time to embark on an entirely new config system built with today's reality in mind.

## The path forward

It's now 2022 and we finally have the first implementation of the new config system released in [v8.21.0](https://eslint.org/blog/2022/08/eslint-v8.21.0-released/). The new system, which we've nicknamed "flat config," is designed to feel familiar to existing ESLint users while dramatically simplifying the process of setting up a config file. Flat config isn't available through the CLI yet as we continue to work on bugs and gathering feedback, but it is available to developers who use the API directly. I'll be discussing the design of flat config in part 2 of this series.
