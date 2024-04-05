---
layout: post
title: Introducing ESLint Config Inspector
teaser: "Introducing the ESLint Config Inspector, a visual tool to help you understand and inspect ESLint flat configuration files."
tags:
  - Config Inspector
  - Release
authors:
  - antfu
categories:
  - Announcements
---

As of ESLint v9,0.0, the [new configuration system](/blog/2023/10/flat-config-rollout-plans/) has reached general availability, bringing with it with many benefits. Configuration files are now easier to manage and more transparent to compose. However, it can still be non-trivial to understand which rules are enabled and disabled for specific files, especially when your configuration is complex or composed from multiple sources. That's why we are excited to introduce the [ESLint Config Inspector](https://github.com/eslint/config-inspector), a visual and interactive tool to help you better understand and inspect your config file.

![Screenshot of config inspector](/assets/images/blog/2024/config-inspector-intro.png)

## Give it a Try!

[ESLint Config Inspector](https://github.com/eslint/config-inspector) is a CLI command that fires up a local web server to visualize your ESLint configuration file from your local filesystem. Give it a try:

```bash
eslint --inspect-config
```

Or you can run the config inspector without ESLint installed by running the following command in the root directory that contains `eslint.config.js` file:

```bash
npx @eslint/config-inspector
```

Visit http://localhost:7777 in your browser, and you will see a visual representation of your ESLint configuration file. You can then navigate through the rules, plugins, and language configurations that are enabled or disabled. Changes made to your local configuration file will also be reflected in automatically in the inspector.

## Features

Here are some of the key features that the ESLint Config Inspector provides:

### Config Items Overview

In the "Configs" tab, you will see a list of all configuration objects from your configuration file. This is especially useful when you are including external configurations or have dynamically generated configurations. This feature gives you the transparency to see how those configurations are resolved and augmented in your project.

![Screenshot of Configs Overview](/assets/images/blog/2024/config-inspector-configs.png)

### Filepath Matching

In the "Configs" tab, you can enter a file path to see which rules are enabled or disabled for that specific file:

![Screenshot of Filepath Matching](/assets/images/blog/2024/config-inspector-filepath-filter.png)

You can also toggle the view to see the final merged rules for that file:

![Screenshot of Filepath Matching Merged](/assets/images/blog/2024/config-inspector-filepath-merged.png)

### Available Rules

Go to the "Rules" tab to see all the available rules from the plugins you have installed. Each rule displays if it is enabled or disabled in your configuration file. You can also filter rules to find the usage of deprecated rules or recommended rules that are not yet enabled.

![Screenshot of Filepath Matching](/assets/images/blog/2024/config-inspector-deprecated.png)

## Conclusion

We hope that the ESLint Config Inspector will make understanding and maintaining your ESLint configurations easier and more enjoyable. We are excited to hear your feedback and suggestions on how we can improve the tool further. Please feel free to [open an issue](https://github.com/eslint/config-inspector/issues) to share your thoughts.
