/**
 * @fileoverview Vite plugin that makes it possible to bundle ESLint and the
 * TypeScript parser for the browser so that they can run in the playground.
 *
 * - Node.js built-in modules such as `node:path` and `util` are replaced with
 *   the browser versions from `node-stdlib-browser`.
 * - Packages that ESLint loads with `require()` but that would otherwise be
 *   resolved to their ES module builds are replaced with their CommonJS builds.
 *
 * This is only done for code that runs in the browser. The code that
 * generates the site still uses the real modules.
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import stdLibBrowser from "node-stdlib-browser";

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const replacements = {
	...stdLibBrowser,

	// the ES module build has a default export, which breaks `require("esquery")`
	esquery: "esquery/dist/esquery.min.js",
};

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Creates the plugin that replaces the modules.
 * @returns {import("vite").Plugin} The plugin.
 */
function createResolver() {
	return {
		name: "eslint-in-browser:resolve",

		async resolveId(source, importer, options) {
			if (!Object.hasOwn(replacements, source) || !replacements[source]) {
				return null;
			}

			return this.resolve(replacements[source], importer, {
				...options,
				skipSelf: true,
			});
		},
	};
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Creates the plugin.
 * @returns {import("vite").Plugin} The plugin.
 */
export default function eslintInBrowser() {
	return {
		...createResolver(),
		name: "eslint-in-browser",
		enforce: "pre",

		applyToEnvironment(environment) {
			return environment.name === "client";
		},

		// the dev server bundles dependencies separately, so it needs the plugin too
		configEnvironment(name) {
			if (name !== "client") {
				return null;
			}

			return {
				optimizeDeps: {
					rolldownOptions: {
						plugins: [createResolver()],
					},
				},
			};
		},
	};
}
