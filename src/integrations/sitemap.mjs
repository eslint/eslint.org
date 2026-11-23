/**
 * @fileoverview Configures `@astrojs/sitemap`, which generates
 * `sitemap-index.xml` and `sitemap-0.xml` for the site being built.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import fs from "node:fs";
import astroSitemap from "@astrojs/sitemap";
import matter from "gray-matter";

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const BLOG_DIR = new URL("../content/blog/", import.meta.url);
const DATED_FILENAME = /^(?<date>\d{4}-\d{2}-\d{2})-(?<slug>.+)\.md$/u;

// later pages of paginated lists (`/blog/page/2/`) and the "not found" pages
// of translations (`/ja/404/`) aren't listed
const UNLISTED_PAGE = /\/\d+\/$/u;

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Finds when each blog post was published. Like the blog itself, the date
 * comes from the front matter when it has one and from the filename otherwise.
 * @returns {Map<string, Date>} The publish dates, keyed by the path of the
 *      post such as `/blog/2026/01/some-post/`.
 */
function getPostDates() {
	const dates = new Map();

	for (const filename of fs.readdirSync(BLOG_DIR)) {
		const match = DATED_FILENAME.exec(filename);

		if (!match) {
			continue;
		}

		const { data: frontmatter } = matter(
			fs.readFileSync(new URL(filename, BLOG_DIR), "utf8"),
		);
		const date = new Date(frontmatter.date ?? match.groups.date);
		const month = String(date.getUTCMonth() + 1).padStart(2, "0");

		dates.set(
			`/blog/${date.getUTCFullYear()}/${month}/${match.groups.slug}/`,
			date,
		);
	}

	return dates;
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Creates the integration.
 * @param {Object} site The site data of the default locale.
 * @returns {import("astro").AstroIntegration} The integration.
 */
export default function sitemap(site) {
	const postDates = getPostDates();

	return astroSitemap({
		// the documentation site that is proxied at /docs/latest has its own
		customSitemaps: site.locals.docs_latest
			? [`https://${site.hostname}/docs/latest/sitemap.xml`]
			: [],
		filter: page => !UNLISTED_PAGE.test(new URL(page).pathname),
		changefreq: "monthly",
		lastmod: new Date(),
		serialize(item) {
			const published = postDates.get(new URL(item.url).pathname);

			return published
				? { ...item, lastmod: published.toISOString() }
				: item;
		},
	});
}
