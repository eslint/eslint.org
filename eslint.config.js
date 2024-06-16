"use strict";

const eslintConfigESLintBase = require("eslint-config-eslint/base");
const eslintConfigESLintCJS = require("eslint-config-eslint/cjs");
const eslintConfigESLintFormatting = require("eslint-config-eslint/formatting");
const globals = require("globals");
const reactPlugin = require("eslint-plugin-react");
const reactRecommended = require("eslint-plugin-react/configs/recommended");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const { fixupPluginRules } = require("@eslint/compat");

const playgroundFiles = "src/playground/**/*.{js,jsx}";

module.exports = [
    {
        ignores: [
            "_site/**",
            "src/assets/js/**",
            "src/_data/**",
            "src/_11ty/**"
        ]
    },

    eslintConfigESLintFormatting,

    ...eslintConfigESLintCJS.map(config => ({
        ...config,
        ignores: [playgroundFiles]
    })),
    {
        rules: {
            "n/no-extraneous-require": ["error", {
                allowModules: ["luxon"]
            }]
        },
        ignores: [playgroundFiles]
    },

    {
        files: ["tools/**/*.js"],
        rules: {
            "no-console": "off",
            "n/no-process-exit": "off"
        }
    },

    // Playground
    ...eslintConfigESLintBase.map(config => ({
        ...config,
        files: [playgroundFiles]
    })),
    {
        files: [playgroundFiles],
        plugins: {
            react: fixupPluginRules(reactPlugin),
            "jsx-a11y": fixupPluginRules(jsxA11yPlugin),
            "react-hooks": fixupPluginRules(reactHooksPlugin)
        },
        settings: {
            react: {
                version: "16.8.6"
            }
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.es2021
            }
        },
        rules: {
            ...reactRecommended.rules,
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
            "func-style": "off"
        }
    },

    // Disable rules that the codebase doesn't currently follow.
    // It might be a good idea to enable these in the future.
    {
        rules: {
            "jsdoc/require-jsdoc": "off",
            "jsdoc/require-returns": "off",
            "jsdoc/require-param-description": "off",
            "jsdoc/require-param-type": "off",
            "jsdoc/no-bad-blocks": ["error", {
                ignore: ["__PURE__"]
            }]
        }
    }
];
