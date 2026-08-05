import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPostDate, getPostUrl, sortBlogPosts } from "~/utils/blog";

export async function GET(context: { site: URL }) {
  const posts = sortBlogPosts(await getCollection("blog")).slice(0, 10);

  return rss({
    title: "ESLint Blog",
    description: "The latest news and updates from ESLint.",
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.teaser,
      pubDate: getPostDate(post),
      link: getPostUrl(post),
    })),
  });
}
