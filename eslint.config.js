"use strict";

const { defineConfig, globalIgnores } = require("eslint/config");
const eslintConfigESLint = require("eslint-config-eslint");
const eslintConfigESLintBase = require("eslint-config-eslint/base");
const eslintConfigESLintCJS = require("eslint-config-eslint/cjs");
const globals = require("globals");
const reactPlugin = require("eslint-plugin-react");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const { version: reactVersion } = require("react/package.json");

const playgroundFiles = "src/components/playground/**/*.{js,jsx}";
const esmFiles = "**/*.mjs";

module.exports = defineConfig([
	globalIgnores([
		"dist/**",
		".astro/**",
		"public/assets/js/**",
		"src/scripts/**",
		"src/data/**",
	]),

	{
		ignores: [playgroundFiles, esmFiles],
		extends: [eslintConfigESLintCJS],
	},

	{
		files: ["tools/**/*.js"],
		rules: {
			"no-console": "off",
			"n/no-process-exit": "off",
		},
	},

	// Astro configuration and integrations
	{
		files: [esmFiles],
		extends: [eslintConfigESLint],
		languageOptions: {
			globals: globals.node,
		},
	},

	// Playground
	{
		files: [playgroundFiles],
		extends: [
			eslintConfigESLintBase,
			reactPlugin.configs.flat.recommended,
			reactPlugin.configs.flat["jsx-runtime"],
			jsxA11yPlugin.flatConfigs.recommended,
			reactHooksPlugin.configs.flat.recommended,
		],
		settings: {
			react: {
				// "detect" uses an API that was removed in ESLint v10
				version: reactVersion,
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
			"react/jsx-no-useless-fragment": "error",

			// Disable rules that the codebase doesn't currently follow.
			// It might be a good idea to enable these in the future.
			"react/prop-types": "off",
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
]);
