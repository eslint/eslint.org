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
                exclude: [
                    path.resolve(__dirname, "node_modules"),
                    path.resolve(__dirname, "src/playground/node_modules/lodash")
                ],
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
    stats: "errors-only"
};
