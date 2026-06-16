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

**Update:** ESLint has introduced a new codemod workflow for migrating ESLint v8 configuration to ESLint v9 flat config. You can run it with:

```shell
npx codemod @eslint/v8-to-v9-config
```

Unlike the original configuration migrator described below, this codemod runs as a workspace migration. It can extract `eslintConfig` from `package.json`, generate `eslint.config.mjs`, clean up duplicate `/* eslint */` comments and invalid `/* exported */` comments in source files, and remove deprecated `require-jsdoc` and `valid-jsdoc` rule references from inline comments. It also migrates those JSDoc rules to `eslint-plugin-jsdoc` using `jsdoc({ config: "flat/recommended", ... })`, and adds a `// TODO: Migrate settings manually` comment when custom settings need review.

The codemod handles several ESLint v9 rule option changes, including `no-unused-vars`, `no-useless-computed-key`, `no-sequences`, `no-constructor-return`, `camelcase`, and `no-restricted-imports`. It also converts `env` to `languageOptions.globals` using the `globals` package, maps `excludedFiles` to per-config `ignores`, moves `noInlineConfig` and `reportUnusedDisableDirectives` to `linterOptions`, imports parser packages and plugins, uses `defineConfig` and `globalIgnores` from `@eslint/config-helpers`, and merges ignore patterns from both `.eslintignore` and `.gitignore`.

For JavaScript config files, the codemod works from the AST and can resolve simple bindings such as `const` values, identifiers, and spreads. More advanced logic, such as functions, conditionals, and dynamic `require()` calls, still needs manual review. The workflow also supports options such as `--target`, `eslintConfigCustomName`, and `codeFormattingCommandEnabled`, and prompts you to install required packages after it runs. The codemod does not migrate `--ext` CLI usage, so keep the manual step described in [Limitations](#limitations). Learn more in the [eslint/codemods](https://github.com/eslint/codemods) repository and on the [Codemod Registry](https://app.codemod.com/registry/@eslint/v8-to-v9-config).

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
* **Were you using the `--ext` CLI flag?** If so, you'll need to [create an entry](https://github.com/eslint/rewrite/tree/main/packages/migrate-config#--ext) in your configuration file to match the file extensions you use to pass on the command line. The `@eslint/v8-to-v9-config` codemod doesn't migrate this CLI flag, either.

It's possible that the generated configuration file won't work without some modification, but it should get you very close.

## Conclusion

When we released ESLint v9.x, we thought providing the configuration migration guide would get most users through the transition to the new configuration system. Unfortunately, we didn't anticipate all of the challenges that folks would encounter along the way. We hope that the configuration migrator makes this transition a lot easier going forward. Getting every config file to work 100% after migration is impossible due to the various ways that people configure ESLint, but we think that this tool should avoid most tedious translation steps to get you up and running in ESLint v9.x faster.
