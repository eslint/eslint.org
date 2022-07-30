"use strict";

const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

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
        },
        cacheDirectory: path.resolve(__dirname, "node_modules/.cache/webpack")
    },
    resolve: {
        extensions: [".js", ".jsx"],
        mainFields: ["browser", "main", "module"]
    },
    plugins: [
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
                    {
                        loader: "style-loader"
                    },
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
