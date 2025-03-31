"use strict";

const path = require("node:path");
const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

/**
 * webpack configuration
 * @param {Record<string, any>} env
 * @param {Record<string, any>} argv
 * @returns {import("webpack").Configuration}
 * a valid webpack configuration for development and production mode
 */
module.exports = (env, { mode }) => ({
	entry: {
		playground: path.resolve(__dirname, "src/playground/index.js"),
	},
	output: {
		filename: "[name].js",
		path:
			mode === "development"
				? path.resolve(__dirname, "src/assets/js")
				: path.resolve(__dirname, "_site/assets/js"),
	},
	cache: {
		type: "filesystem",
		buildDependencies: {
			config: [__filename],
		},
	},
	resolve: {
		extensions: [".js", ".jsx"],
		mainFields: ["browser", "main", "module"],
		fallback: {
			fs: false,
			process: require.resolve("process/browser"),
		}
	},
	plugins: [
		new webpack.NormalModuleReplacementPlugin(/^node:/u, resource => {
			resource.request = resource.request.replace(/^node:/u, "");
		}),
		new NodePolyfillPlugin(),
		new webpack.DefinePlugin({
			"process.versions": JSON.stringify({ node: "16.0.0" }),
		}),
	],
	...(mode === "development" ? { devtool: "source-map" } : {}),
	module: {
		rules: [
			{
				test: /\.jsx?$/u,
				loader: "babel-loader",
				include: path.resolve(__dirname, "src/playground"),
				exclude: /node_modules/u,
				options: {
					configFile: path.resolve(__dirname, ".babelrc"),
				},
			},
			{
				test: /\.[s]css$/u,
				use: [
					{
						loader: "style-loader",
					},
					{
						loader: "css-loader",
					},
					{
						loader: "sass-loader",
					},
				],
			},
		],
	},
	stats: "normal",
});
