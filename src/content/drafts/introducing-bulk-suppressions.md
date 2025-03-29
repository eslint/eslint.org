---
layout: post
title: Introducing bulk suppressions
teaser: "How to enable stricter linting incrementally"
tags:
  - Suppressions
  - Command Line
authors:
  - softius
categories:
  - Announcements
---

At some point, every development team faces the same challenge: you want to enable a new ESLint rule to improve code quality, but your existing codebase already contains numerous violations. When the rule isn't auto-fixable, the path to enabling it as an error can be challenging.

Today, we're excited to introduce ESLint's new violation suppression system, designed to make adopting stricter linting rules more manageable. Let's explore how it works and how it can help your team enhance code quality incrementally.

## Why bulk suppressions?

When enabling a rule in an established project, teams typically choose between fixing all violations upfront, using warnings instead of errors, disabling rules in specific files, or adding inline disable comments. Each approach has merit, but none provides an ideal balance between enforcing standards for new code while addressing existing violations over time.

ESLint's new suppression system offers a more flexible approach by:

1. Recording existing violations in a separate file
2. Enforcing the rule as an error for all new code
3. Suppressing recorded violations, allowing you to address existing violations at your own pace

This approach prioritizes preventing new violations while providing a clear path to incrementally improve existing code.

## Getting started

Once you've configured a new rule as `"error"` in your ESLint configuration, you can bulk suppress existing violations using the command line. You can choose to suppress all violations or specific rules.

```
# Suppress all violations
eslint --suppress-all

# Suppress specific rules
eslint --suppress-rule <rule-name>
```

When you execute any of the above commands, ESLint will create a file called `eslint-suppressions.json` in the project root. This file contains the number of violations for each rule and file. The suppressions file is structured as follows:

```json
{
  "src/file1.js": {
    "no-undef": {
        "count": 1
    }
  },
  "src/file2.js": {
    "no-unused-expressions": {
        "count": 2
    }
  }
}
```

ESLint will suppress all `"error"` violations for the specified rules in subsequent runs and will not treat them as errors. However, if more violations are found for the same rule in the same file, ESLint will still report **all** of them in the output. For example, if a file originally had 2 suppressed errors but now has 5, ESLint will display all 5 errors.

This approach is intentional and helps avoid confusion. Since suppressions are tracked per file and rule—not per specific line or code change—there’s no reliable way to determine whether the new violations were introduced recently or already existed. Rather than trying to guess which violations to hide, ESLint chooses to show the full picture.

Please note that it's recommended to combine the above commands with the `--fix` flag to fix any violations that can be automatically resolved.

### Changing the suppressions file location

By default, ESLint creates the suppressions file as `eslint-suppressions.json` in the project root. You can use the `--suppressions-location` option to specify a different location for the suppressions file. This is useful if you want to store the suppressions in a specific directory.

Please note when using a custom suppressions location, you must provide the `--suppressions-location` option for every ESLint command, not just when creating the suppressions file.

```
eslint --suppressions-location suppressions.json
```

### Managing suppressions over time

After enabling suppressions, it is recommended to commit the suppressions file to your repository. This ensures all team members have the same suppressions active when running ESLint.

As you fix suppressed violations over time, the suppressions file will become outdated. When this happens, ESLint will notify you:

> There are suppressions left that do not occur anymore. Consider re-running the command with `--prune-suppressions`.

Pruning is a crucial maintenance step mainly because it helps keep your suppressions file clean and relevant. It ensures that the suppressions file only contains entries for violations that still exist in your codebase. To update your suppressions file, you can use the `--prune-suppressions` flag. This will remove any entries for violations that no longer exist in your codebase.

### Conclusion

ESLint’s new suppression system enhances your ability to adopt stricter linting incrementally. The current implementation provides everything needed to start benefiting right away, while it integrates seamlessly with ESLint's existing architecture:

* It's completely transparent when not in use
* It works alongside other features like `--fix` and `--cache`
* It only affects error reporting
* Suppressed violations are tracked in a separate property (`LintResult#suppressedMessages`) for tools that might need this information

You can start using bulk suppressions by updating to the latest version of ESLint. We'd love to hear your feedback and experiences as you adopt this feature in your projects!
