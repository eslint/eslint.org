"use strict";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

/** @type {import("webpack").Configuration} */
module.exports = {
    entry: {
        playground: path.resolve(__dirname, "src/playground/index.js")
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "_site/assets/js")
    },
    cache: {
        type: "filesystem",
        buildDependencies: {
            config: [__filename]
        }
    },
    resolve: {
        extensions: [".js", ".jsx"],
        mainFields: ["browser", "main", "module"]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new NodePolyfillPlugin()
    ],
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.jsx?$/u,
                loader: "babel-loader",
                include: path.resolve(__dirname, "src/playground"),
                exclude: /node_modules/u,
                options: {
                    configFile: path.resolve(__dirname, ".babelrc")
                }
            },
            {
                test: /\.[s]css$/u,
                use: [
                    "postcss-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            }
        ]
    },
    stats: "normal"
};
