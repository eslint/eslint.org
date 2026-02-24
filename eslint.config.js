"use strict";

const { defineConfig, globalIgnores } = require("eslint/config");
const eslintConfigESLint = require("eslint-config-eslint");
const eslintConfigESLintBase = require("eslint-config-eslint/base");
const eslintConfigESLintCJS = require("eslint-config-eslint/cjs");
const globals = require("globals");
const reactPlugin = require("eslint-plugin-react");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const html = require("@html-eslint/eslint-plugin");
const playgroundFiles = "src/playground/**/*.{js,jsx}";
const htmlFiles = "**/*.html";

module.exports = defineConfig([
	globalIgnores([
		"_site/**",
		"src/assets/js/**",
		"src/_data/**",
		"src/_11ty/**",
		"src/playground/build/**",
	]),

	{
		ignores: [playgroundFiles, htmlFiles],
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
		ignores: ["src/playground/scripts/**/*.js", htmlFiles],
		extends: [
			eslintConfigESLintBase,
			reactPlugin.configs.flat.recommended,
			reactPlugin.configs.flat["jsx-runtime"],
			jsxA11yPlugin.flatConfigs.recommended,
			reactHooksPlugin.configs.flat.recommended,
		],
		settings: {
			react: {
				version: "detect",
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
	{
		files: ["src/playground/scripts/**/*.js"],
		ignores: [htmlFiles],
		extends: [eslintConfigESLint],
		rules: {
			"no-console": "off",
			"n/no-process-exit": "off",
		},
	},

	// Disable rules that the codebase doesn't currently follow.
	// It might be a good idea to enable these in the future.
	{
		ignores: [htmlFiles],
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
		ignores: [htmlFiles],
		rules: {
			"no-console": "off",
		},
	},
	{
		files: ["**/*.html"],
		plugins: {
			html,
		},
		language: "html/html",
		languageOptions: {
			templateEngineSyntax: [
				{ open: "{{", close: "}}" },
				{ open: "{%", close: "%}" },
				{ open: "{#", close: "#}", isComment: true },
			],
		},
		rules: {
			"html/no-duplicate-class": "error",
			"html/no-duplicate-attrs": "error",
			"html/class-spacing": "error",
		},
	},
]);
