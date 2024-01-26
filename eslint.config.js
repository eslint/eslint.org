"use strict";

const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");
const globals = require("globals");
const jsdoc = require("eslint-plugin-jsdoc");
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
            "node_modules/**",
            "_site/**",
            "src/assets/js/**",
            "src/_data/**",
            "src/_11ty/**"
        ]
    },
    {
        files: ["**/*.js"],
        plugins: {
            jsdoc
        },
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        rules: {
            ...js.configs.recommended.rules,

            // Disable eslint-plugin-node rules from eslint-config-eslint
            "no-process-exit": "off",
            "func-style": "off",
            "node/no-deprecated-api": "off",
            "node/no-extraneous-require": "off",
            "node/no-missing-require": "off",
            "node/no-unpublished-bin": "off",
            "node/no-unpublished-require": "off",
            "node/no-unsupported-features/es-builtins": "off",
            "node/no-unsupported-features/es-syntax": "off",
            "node/no-unsupported-features/node-builtins": "off",
            "node/process-exit-as-throw": "off",
            "node/shebang": "off",
            "node/no-extraneous-import": "off",
            "node/no-missing-import": "off",
            "node/no-unpublished-import": "off",

            // Disable rules that the codebase doesn't currently follow.
            "jsdoc/require-jsdoc": "off",
            "jsdoc/require-returns": "off",
            "jsdoc/require-param-description": "off",
            "jsdoc/require-param-type": "off"
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
            "react-hooks/exhaustive-deps": "warn"
        }
    }
];
