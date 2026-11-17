/**
 * @fileoverview The sitemap.
 */

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
	getCategories,
	getPosts,
	getPostUrl,
	getPublishedPosts,
} from "../lib/blog";
import { getSite } from "../lib/site";

interface SitemapPage {
	url: string;
	lastmod: Date;

	/** Whether the page exists on the sites for other languages. */
	multilingual?: boolean;
}

export const GET: APIRoute = async ({ currentLocale }) => {
	const site = await getSite(currentLocale);
	const now = new Date();
	const posts = await getPosts();
	const library = await getCollection("library");

	const pages: SitemapPage[] = [
		...posts
			.toReversed()
			.map(post => ({ url: getPostUrl(post), lastmod: post.data.date })),
		{ url: "/blog/", lastmod: now },
		...getCategories(await getPublishedPosts()).map(category => ({
			url: `/blog/category/${category.slug}/`,
			lastmod: now,
		})),
		{ url: "/component-library/", lastmod: now },
		...library.map(entry => ({
			url: `/component-library/${entry.id}/`,
			lastmod: now,
		})),
		{ url: "/donate/", lastmod: now, multilingual: true },
		{ url: "/languages/", lastmod: now, multilingual: true },
		{ url: "/play/", lastmod: now },
		{ url: "/team/", lastmod: now, multilingual: true },
		{ url: "/version-support/", lastmod: now },
	];

	// translated sites only list the pages that have been translated
	const urls = pages
		.filter(page => site.language.code === "en" || page.multilingual)
		.map(
			page => `    <url>
        <loc>https://${site.hostname}${page.url}</loc>
        <lastmod>${page.lastmod.toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
    </url>`,
		);

	const xml = `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

	return new Response(xml, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
