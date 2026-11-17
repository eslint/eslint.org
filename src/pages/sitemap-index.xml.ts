/**
 * @fileoverview The sitemap index, which combines the sitemap of this site
 * with the sitemap of the documentation site that is proxied at /docs/latest.
 */

import type { APIRoute } from "astro";
import { getSite } from "../lib/site";

export const GET: APIRoute = async ({ currentLocale }) => {
	const site = await getSite(currentLocale);
	const sitemaps = ["/sitemap.xml"];

	if (site.locals.docs_latest) {
		sitemaps.push("/docs/latest/sitemap.xml");
	}

	const xml = `<?xml version="1.0" encoding="utf-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
	.map(
		path => `    <sitemap>
        <loc>https://${site.hostname}${path}</loc>
    </sitemap>`,
	)
	.join("\n")}
</sitemapindex>
`;

	return new Response(xml, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
