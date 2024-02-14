"use strict";

const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");
const eslintConfigESLintCJS = require("eslint-config-eslint/cjs");
const globals = require("globals");
const reactPlugin = require("eslint-plugin-react");
const reactRecommended = require("eslint-plugin-react/configs/recommended");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const reactHooksPlugin = require("eslint-plugin-react-hooks");

const compat = new FlatCompat({
    baseDirectory: __dirname
});

const [jsxA11yRecommended] = compat.extends("plugin:jsx-a11y/recommended");

module.exports = [
    {
        ignores: [
            "_site/**",
            "src/assets/js/**",
            "src/_data/**",
            "src/_11ty/**"
        ]
    },
    ...eslintConfigESLintCJS,
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        rules: {
            ...js.configs.recommended.rules,

            // Disable rules that the codebase doesn't currently follow.
            "jsdoc/require-jsdoc": "off",
            "jsdoc/require-returns": "off",
            "jsdoc/require-param-description": "off",
            "jsdoc/require-param-type": "off",
            "jsdoc/no-bad-blocks": ["error", {
                ignore: ["__PURE__"]
            }],
            "n/no-extraneous-require": ["error", {
                allowModules: ["luxon"]
            }]
        }
    },
    {
        files: ["tools/**/*.js"],
        rules: {
            "no-console": "off",
            "n/no-process-exit": "off"
        }
    },
    {
        files: ["src/playground/**/*.{js,jsx}"],
        plugins: {
            react: reactPlugin,
            "jsx-a11y": jsxA11yPlugin,
            "react-hooks": reactHooksPlugin
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
            ...jsxA11yRecommended.rules,
            "react/jsx-no-useless-fragment": "error",
            "react/jsx-no-target-blank": "error",

            // Disable rules that the codebase doesn't currently follow.
            // It might be a good idea to enable these in the future.
            "jsx-a11y/no-onchange": "off",
            "react/prop-types": "off",
            "jsdoc/require-jsdoc": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // Disable eslint-plugin-node rules from eslint-config-eslint
            "no-process-exit": "off",
            "func-style": "off",
            "n/no-deprecated-api": "off",
            "n/no-extraneous-require": "off",
            "n/no-missing-require": "off",
            "n/no-unpublished-bin": "off",
            "n/no-unpublished-require": "off",
            "n/no-unsupported-features/es-builtins": "off",
            "n/no-unsupported-features/es-syntax": "off",
            "n/no-unsupported-features/node-builtins": "off",
            "n/process-exit-as-throw": "off",
            "n/shebang": "off",
            "n/no-extraneous-import": "off",
            "n/no-missing-import": "off",
            "n/no-unpublished-import": "off"
        }
    }
];
