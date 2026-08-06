import { getCollection } from "astro:content";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { getPostDate, getPostUrl, sortBlogPosts } from "~/utils/blog";

const parser = new MarkdownIt();

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const absoluteUrlAttributes = (html: string, baseUrl: URL) =>
  html.replace(/\b(href|src)="([^"]+)"/gu, (match, attribute, value) => {
    if (/^(?:data|javascript|mailto|tel):/u.test(value)) {
      return match;
    }

    return `${attribute}="${new URL(value, baseUrl)}"`;
  });

export async function GET(context: { site: URL }) {
  const posts = sortBlogPosts(await getCollection("blog")).slice(0, 10);
  const entries = posts.map((post) => {
      const postUrl = new URL(getPostUrl(post), context.site);
      const content = sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      });
      const updated = getPostDate(post).toISOString();

      return `  <entry>
    <title>${escapeXml(post.data.title)}</title>
    <link href="${postUrl.href}"/>
    <updated>${updated}</updated>
    <id>${postUrl.href}</id>
    <content type="html">${escapeXml(absoluteUrlAttributes(content, postUrl))}</content>
  </entry>`;
    });

  const siteUrl = new URL("/", context.site).href;
  const feedUrl = new URL("/feed.xml", context.site).href;
  const updated = posts[0] ? getPostDate(posts[0]).toISOString() : new Date(0).toISOString();
  const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>ESLint Blog</title>
  <subtitle>feed description</subtitle>
  <link href="${feedUrl}" rel="self"/>
  <link href="${siteUrl}"/>
  <updated>${updated}</updated>
  <id>${siteUrl}</id>
  <author>
    <name>ESLint</name>
    <email></email>
  </author>
${entries.join("\n")}
</feed>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
