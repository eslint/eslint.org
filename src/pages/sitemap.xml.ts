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
import {
	DEFAULT_LOCALE,
	getLanguages,
	getSite,
	localizeUrl,
} from "../lib/site";

interface SitemapPage {
	url: string;
	lastmod: Date;

	/** Whether the page is translated into the other languages. */
	multilingual?: boolean;
}

export const GET: APIRoute = async ({ currentLocale }) => {
	const site = await getSite(currentLocale);
	const now = new Date();
	const posts = await getPosts();
	const library = await getCollection("library");
	const languages = await getLanguages();

	const pages: SitemapPage[] = [
		...posts
			.toReversed()
			.map(post => ({ url: getPostUrl(post), lastmod: post.data.date })),
		{ url: "/", lastmod: now, multilingual: true },
		{ url: "/blog/", lastmod: now },
		...getCategories(await getPublishedPosts()).map(category => ({
			url: `/blog/category/${category.slug}/`,
			lastmod: now,
		})),
		{ url: "/branding/", lastmod: now, multilingual: true },
		{ url: "/component-library/", lastmod: now },
		...library.map(entry => ({
			url: `/component-library/${entry.id}/`,
			lastmod: now,
		})),
		{ url: "/donate/", lastmod: now, multilingual: true },
		{ url: "/languages/", lastmod: now, multilingual: true },
		{ url: "/play/", lastmod: now },
		{ url: "/sponsors/", lastmod: now, multilingual: true },
		{ url: "/team/", lastmod: now, multilingual: true },
		{ url: "/version-support/", lastmod: now },
	];

	// translated pages are listed once for each language
	const urls = pages
		.flatMap(page => [
			page,
			...(page.multilingual
				? languages
						.filter(language => language.locale !== DEFAULT_LOCALE)
						.map(language => ({
							...page,
							url: localizeUrl(page.url, language.locale),
						}))
				: []),
		])
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
