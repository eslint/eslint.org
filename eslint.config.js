"use strict";

const { defineConfig } = require("eslint/config");
const eslintConfigESLintBase = require("eslint-config-eslint/base");
const eslintConfigESLintCJS = require("eslint-config-eslint/cjs");
const globals = require("globals");
const reactPlugin = require("eslint-plugin-react");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const reactHooksPlugin = require("eslint-plugin-react-hooks");

const playgroundFiles = "src/playground/**/*.{js,jsx}";

module.exports = defineConfig([
	{
		ignores: [
			"_site/**",
			"src/assets/js/**",
			"src/_data/**",
			"src/_11ty/**",
		],
	},

	{
		ignores: [playgroundFiles],
		extends: [eslintConfigESLintCJS],
		rules: {
			"n/no-extraneous-require": [
				"error",
				{
					allowModules: ["luxon"],
				},
			],
		},
	},

	{
		files: ["tools/**/*.js"],
		rules: {
			"no-console": "off",
			"n/no-process-exit": "off",
		},
	},

	// Playground
	{
		files: [playgroundFiles],
		extends: [eslintConfigESLintBase],
		plugins: {
			react: reactPlugin,
			"jsx-a11y": jsxA11yPlugin,
			"react-hooks": reactHooksPlugin,
		},
		settings: {
			react: {
				version: "19.1.0",
			},
		},
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.es2021,
			},
		},
		rules: {
			...reactPlugin.configs.flat.recommended.rules,
			...jsxA11yPlugin.configs.recommended.rules,
			"react/jsx-no-useless-fragment": "error",
			"react/jsx-no-target-blank": "error",

			// Disable rules that the codebase doesn't currently follow.
			// It might be a good idea to enable these in the future.
			"jsx-a11y/no-onchange": "off",
			"react/prop-types": "off",
			"jsdoc/require-jsdoc": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			"react-hooks/react-compiler": "error",
			"func-style": "off",
		},
	},

	// Disable rules that the codebase doesn't currently follow.
	// It might be a good idea to enable these in the future.
	{
		rules: {
			"jsdoc/require-jsdoc": "off",
			"jsdoc/require-returns": "off",
			"jsdoc/require-param-description": "off",
			"jsdoc/require-param-type": "off",
			"jsdoc/no-bad-blocks": [
				"error",
				{
					ignore: ["__PURE__"],
				},
			],
		},
	},
	{
		files: [".eleventy.js"],
		rules: {
			"no-console": "off",
		},
	},
]);
