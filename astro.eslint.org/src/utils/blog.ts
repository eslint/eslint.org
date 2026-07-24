import type { CollectionEntry } from "astro:content";
import { slugify } from "./slugify";

export type BlogPostEntry = CollectionEntry<"blog">;
type BlogCategory = {
  title: string;
  slug: string;
};

export const formatBlogDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);

export const getPostDate = (post: BlogPostEntry) => {
  const [date = ""] = post.id.match(/\d{4}-\d{2}-\d{2}/) ?? [];

  return new Date(`${date}T00:00:00.000Z`);
};

export const getPostSlug = (post: BlogPostEntry) =>
  post.id.replace(/^\d{4}-\d{2}-\d{2}-/, "");

export const sortBlogPosts = (posts: BlogPostEntry[]) =>
  posts.toSorted(
    (a, b) =>
      getPostDate(b).getTime() - getPostDate(a).getTime() ||
      getPostSlug(b).localeCompare(getPostSlug(a)),
  );

export const getBlogCategories = (posts: BlogPostEntry[]) => {
  const categoryMap = new Map<string, BlogCategory>();

  for (const post of posts) {
    for (const category of post.data.categories) {
      const slug = slugify(category);

      if (!categoryMap.has(slug)) {
        categoryMap.set(slug, { title: category, slug });
      }
    }
  }

  return [...categoryMap.values()].sort((a, b) => a.title.localeCompare(b.title));
};
