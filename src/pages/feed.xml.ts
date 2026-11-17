/**
 * @fileoverview The Atom feed of the most recent blog posts.
 */

import type { APIRoute } from "astro";
import { getPosts, getPostUrl } from "../lib/blog";

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const metadata = {
	title: "ESLint Blog",
	subtitle: "feed description",
	url: "https://eslint.org/",
	feedUrl: "https://eslint.org/feed.xml",
	author: {
		name: "ESLint",
		email: "",
	},
};

const MAX_ENTRIES = 10;

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

function escapeXml(text: string): string {
	return text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

/**
 * Formats a date as RFC 3339, such as "2026-01-05T00:00:00Z".
 */
function dateToRfc3339(date: Date): string {
	return date.toISOString().replace(/\.\d{3}Z$/u, "Z");
}

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
	const newest = Math.max(...posts.map(post => post.data.date.getTime()));
	const entries = posts.slice(0, MAX_ENTRIES).map(post => {
		const url = new URL(getPostUrl(post), metadata.url).href;

		return `
  <entry>
    <title>${escapeXml(post.data.title)}</title>
    <link href="${url}"/>
    <updated>${dateToRfc3339(post.data.date)}</updated>
    <id>${url}</id>
    <content type="html">${escapeXml(htmlToAbsoluteUrls(post.rendered?.html ?? "", url))}</content>
  </entry>`;
	});

	const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${metadata.title}</title>
  <subtitle>${metadata.subtitle}</subtitle>
  <link href="${metadata.feedUrl}" rel="self"/>
  <link href="${metadata.url}"/>
  <updated>${dateToRfc3339(new Date(newest))}</updated>
  <id>${metadata.url}</id>
  <author>
    <name>${metadata.author.name}</name>
    <email>${metadata.author.email}</email>
  </author>${entries.join("")}
</feed>
`;

	return new Response(feed, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
