/**
 * @fileoverview The RSS feed of the most recent blog posts.
 */

import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getPosts, getPostUrl } from "../lib/blog";

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const metadata = {
	title: "ESLint Blog",
	description: "feed description",
	url: "https://eslint.org/",
	feedUrl: "https://eslint.org/feed.xml",
};

const MAX_ENTRIES = 10;

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Feed readers show posts outside of the site, so URLs in posts must be absolute.
 */
function htmlToAbsoluteUrls(html: string, base: string): string {
	return html.replace(
		/\b(href|src)=(?:"([^"]*)"|'([^']*)')/gu,
		(match, attribute, doubleQuoted, singleQuoted) => {
			try {
				const url = new URL(doubleQuoted ?? singleQuoted, base).href;

				return `${attribute}="${url}"`;
			} catch {
				return match;
			}
		},
	);
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

export const GET: APIRoute = async () => {
	const posts = await getPosts();

	return rss({
		title: metadata.title,
		description: metadata.description,
		site: metadata.url,
		xmlns: { atom: "http://www.w3.org/2005/Atom" },
		customData: `<atom:link href="${metadata.feedUrl}" rel="self" type="application/rss+xml"/>`,
		items: posts.slice(0, MAX_ENTRIES).map(post => {
			const url = new URL(getPostUrl(post), metadata.url).href;

			return {
				title: post.data.title,
				link: url,
				pubDate: post.data.date,
				content: htmlToAbsoluteUrls(post.rendered?.html ?? "", url),
			};
		}),
	});
};
