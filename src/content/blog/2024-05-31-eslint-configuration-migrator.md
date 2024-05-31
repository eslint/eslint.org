---
layout: post
title: Introducing the ESLint Configuration Migrator
teaser: "Migrating your .eslintrc file to eslint.config.js just got easier."
tags:
  - Compatibility
  - Tools
authors:
  - nzakas
categories:
  - Announcements
---

We've heard you: One of the biggest reasons ESLint users haven't upgraded to ESLint v9.x is migrating a configuration file seems difficult and complicated. Some plugins support flat config and the ESLint v9.x rule APIs and some don't. Sometimes you need to use [`FlatCompat`](https://github.com/eslint/eslintrc?tab=readme-ov-file#usage-esm) and sometimes you need to use the [compatibility utilities](https://eslint.org/blog/2024/05/eslint-compatibility-utilities/). While we cover as much as we can in the [migration guide](https://eslint.org/docs/latest/use/configure/migration-guide), it can take time to walk through your configuration and make the necessary changes.

That's why we're excited to announce the release of the [ESLint Configuration Migrator](https://npmjs.com/package/@eslint/migrate-config). This utility is designed to translate `.eslintrc.*` files into `eslint.config.js` files, including:

* 1-for-1 migration of `.eslintrc`, `.eslintrc.json`, `.eslintrc.yml`, and `.eslintrc.yaml` files.
* Reasonable migration of simple `.eslintrc.js`, `.eslintrc.cjs`, and `.eslintrc.mjs` files. (These will often need edits if you are using variables to build your config).
* Automatic inclusion of `.eslintignore` patterns into your new config file.
* Automatic use of `FlatCompat` when necessary.
* Automatic use of the compatibility utilities when necessary.

**Important:** This version of the utility does not handle anything but the simplest JavaScript configuration file (`.eslintrc.js`, `.eslintrc.cjs`, `.eslintrc.mjs`). It works by evaluating the file and then migrating the calculated configuration. As such, it will not maintain any logic inside of the file. We hope to add this capability in a future version.

## Using the configuration migrator

You can use the configuration migrator directly from npm without installing it via `npx` or similar commands. Pass the location of the `.eslintrc.*` file to convert, like this:

```shell
npx @eslint/migrate-config .eslintrc.json
# or
yarn dlx @eslint/migrate-config .eslintrc.json
# or
pnpm dlx @eslint/migrate-config .eslintrc.json
# or
bunx @eslint/migrate-config .eslintrc.json
```

By default, this command will output a `eslint.config.mjs` file. If you'd like to output a CommonJS file instead, add the `--commonjs` flag:

```shell
npx @eslint/migrate-config .eslintrc.json --commonjs
# or
yarn dlx @eslint/migrate-config .eslintrc.json --commonjs
# or
pnpm dlx @eslint/migrate-config .eslintrc.json --commonjs
# or
bunx @eslint/migrate-config .eslintrc.json --commonjs
```

## Limitations

The goal of the configuration migrator is to reduce the likelihood of running into errors when you use it for the first time, and as a result, it aggressively employs `FlatCompat` and the compatibility utilities. This means that the generated configuration file may not be optimal and you may be able to simplify it yourself.

After generating a configuration file, you should review the following:

* **Are there more recent versions of plugins?** It's possible that there's a newer version of a plugin that fully supports ESLint v9.x on its own and doesn't require any kind of compatibility work. It's always best to upgrade to the latest version of the plugins you use.
* **Do you have `.eslintrc.*` config files in other directories?** The new configuration system doesn't merge configuration files from ancestor directories. If you are using `.eslintrc.*` files to override configuration in specific directories, you'll need to move that configuration into your primary `eslint.config.*` file.
* **Were you using the `--ext` CLI flag?** If so, you'll need to [create an entry](https://github.com/eslint/rewrite/tree/main/packages/migrate-config#--ext) in your configuration file to match the file extensions you use to pass on the command line.

It's possible that the generated configuration file won't work without some modification, but it should get you very close.

## Conclusion

When we released ESLint v9.x, we thought providing the configuration migration guide would get most users through the transition to the new configuration system. Unfortunately, we didn't anticipate all of the challenges that folks would encounter along the way. We hope that the configuration migrator makes this transition a lot easier going forward. Getting every config file to work 100% after migration is impossible due to the various ways that people configure ESLint, but we think that this tool should avoid most tedious translation steps to get you up and running in ESLint v9.x faster.
