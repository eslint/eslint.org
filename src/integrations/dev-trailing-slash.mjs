/**
 * @fileoverview Vite plugin that makes the dev server redirect page URLs
 * without a trailing slash to the same URL with one, the way Netlify does for
 * the published site. Without it those URLs are a 404 in development because
 * of `trailingSlash: "always"`.
 */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

// requests for Vite and Astro internals, which are never pages
const INTERNAL_PATH = /^\/(?:@|_|node_modules\/|src\/)/u;

// requests for files, such as `/feed.xml`
const FILE_PATH = /\.\w+$/u;

/**
 * Redirects requests for pages to the URL that ends with a slash.
 * @param {import("node:http").IncomingMessage} req The request.
 * @param {import("node:http").ServerResponse} res The response.
 * @param {Function} next Passes the request to the next middleware.
 * @returns {void}
 */
function redirectToTrailingSlash(req, res, next) {
	const [path, query] = (req.url ?? "/").split("?");

	if (
		path.endsWith("/") ||
		FILE_PATH.test(path) ||
		INTERNAL_PATH.test(path)
	) {
		next();
		return;
	}

	res.writeHead(302, {
		Location: `${path}/${query ? `?${query}` : ""}`,
	});
	res.end();
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Creates the plugin.
 * @returns {import("vite").Plugin} The plugin.
 */
export default function devTrailingSlash() {
	return {
		name: "eslint-dev-trailing-slash",
		apply: "serve",
		configureServer(server) {
			/*
			 * Astro puts the middleware that rejects these URLs at the front
			 * of the stack once the server is configured, so this one has to
			 * be put in front of it afterwards.
			 */
			return () => {
				server.middlewares.stack.unshift({
					route: "",
					handle: redirectToTrailingSlash,
				});
			};
		},
	};
}
