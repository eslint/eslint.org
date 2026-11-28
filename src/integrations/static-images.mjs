/**
 * @fileoverview Astro integration that publishes `src/assets/images` at
 * `/assets/images`.
 *
 * The images stay in `src/assets/images` so that they can be optimized by
 * `astro:assets` when imported, but blog posts, social sharing previews, and
 * other websites also link to them directly using their original URLs, so
 * unmodified copies need to be available as well.
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import fs from "node:fs/promises";

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const SOURCE_DIR = "src/assets/images";
const URL_PREFIX = "/assets/images/";

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

export default function staticImages() {
	let root;

	return {
		name: "eslint-static-images",
		hooks: {
			"astro:config:done"({ config }) {
				root = config.root;
			},

			// in development, let Vite serve the files from the source directory
			"astro:server:setup"({ server }) {
				server.middlewares.use((req, res, next) => {
					if (req.url.startsWith(URL_PREFIX)) {
						req.url = `/${SOURCE_DIR}/${req.url.slice(URL_PREFIX.length)}`;
					}
					next();
				});
			},

			// in production, copy the files into the output directory
			async "astro:build:done"({ dir, logger }) {
				await fs.cp(
					new URL(SOURCE_DIR, root),
					new URL(URL_PREFIX.slice(1), dir),
					{ recursive: true },
				);
				logger.info(`Copied ${SOURCE_DIR} to ${URL_PREFIX}`);
			},
		},
	};
}
