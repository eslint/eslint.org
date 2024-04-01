---
layout: post
title: Introducing ESLint Config Inspector
teaser: "Introducing to the ESLint Config Inspector, a visual tool to help you understand and inspect ESLint flat configuration files."
tags:
  - Config Inspector
  - Release
authors:
  - antfu
categories:
  - Announcements
---

As the [new flat config format](/blog/2023/10/flat-config-rollout-plans/) rolling out with many benefits, it makes configures easier to manage and more transparent to compose. However, it can still be non-trivial to understand what rules are enabled and disabled for which files, especially when the configurations are complex or extending from multiple sources.

To help with that situtation and improve the developer experience with flat configs even further, we are excited to introduce you the [ESLint Config Inspector](https://github.com/eslint/config-inspector) --- a visual and interactive tool helping you to understand and inspect your config file.

![Screenshot of config inspector](/assets/images/blog/2024/config-inspector-intro.png)

## Give it a Try!

[ESLint Config Inspector](https://github.com/eslint/config-inspector) is a CLI command that fires up a local web server to visualize your ESLint configuration file from you local filesystem. You can give it a try by running the following command
in the root directory that contains `eslint.config.js` file:

```bash
npx @eslint/config-inspector
```

Visit http://localhost:7777 in your browser, and you will see a visual representation of your ESLint configuration file. You can then navigate through the rules, plugins, and language configurations that are enabled or disabled in your configuration. Changes made to your local configuration file will also be reflected in automatically in the inspector.

## Features

Here are some of the key features that the ESLint Config Inspector provides:

### Config Items Overview

In the `Configs` tab, you will see a list of all flat configuration items from your ESLint configuration file. This is useful especially when you are extending external configurations or having dynamic generated configurations. This feature gives you the transparency to see how those configurations are resolved and augmented into your project.

![Screenshot of Configs Overview](/assets/images/blog/2024/config-inspector-configs.png)

### Filepath Matching

In the `Configs` tab, you can also use the search input to match with a filepath to see which rules are enabled or disabled for that specific file:

![Screenshot of Filepath Matching](/assets/images/blog/2024/config-inspector-filepath-filter.png)

You can also toggle the view to see the final merged rules for that file:

![Screenshot of Filepath Matching Merged](/assets/images/blog/2024/config-inspector-filepath-merged.png)

### Available Rules

You can go to the `Rules` tab to see all the available rules from the plugins you have installed. See how each rule is enabled or disabled in your configuration file. Or filter the rules to find the usage of deprecated rules or recommended rules that are not yet enabled, etc.

![Screenshot of Filepath Matching](/assets/images/blog/2024/config-inspector-deprecated.png)

## Conclusion

We hope that the ESLint Config Inspector will make understanding and maintaining your ESLint configurations easier and more enjoyable. We are excited to hear your feedback and suggestions on how we can improve the tool further. Please feel free to [open an issue](https://github.com/eslint/config-inspector/issues) on the GitHub repository if you have any ideas for new features or better experiences.
