/**
 * @fileoverview Helpers for working with blog posts.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { getCollection, type CollectionEntry } from "astro:content";
import blogDates from "../data/blog-dates.json";
import type { Author } from "./data";
import { blogPermalinkDate, categorySlug } from "./format";
import { snippetMarkdown } from "./markdown.mjs";

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------

export type Post = CollectionEntry<"blog">;

export interface Category {
	title: string;
	slug: string;
	totalItems: number;
}

export interface CategoryPage {
	title: string;
	slug: string;
	currentPage: number;
	totalItems: number;
	totalPages: number;
	items: Post[];
	hrefs: {
		all: string[];
		first: string;
		last: string;
		next: string | null;
		previous: string | null;
	};
}

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

export const POSTS_PER_PAGE = 9;
export const POSTS_PER_CATEGORY_PAGE = 8;

// last modified dates are only shown for posts published after this date
const LAST_UPDATED_CUTOFF = new Date("2022-08-01");

const authorBios = import.meta.glob<string>("../content/author-bios/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
});

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Sorts posts from oldest to newest.
 */
function compareByDate(a: Post, b: Post): number {
	return (
		a.data.date.getTime() - b.data.date.getTime() ||
		(a.data.filename < b.data.filename ? -1 : 1)
	);
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Retrieves the published blog posts, newest first.
 */
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getCollection(
		"blog",
		({ id }) => !id.startsWith("drafts/"),
	);

	return posts.sort(compareByDate).reverse();
}

/**
 * Retrieves all blog posts, newest first. Drafts, when they are included in
 * the build, are placed before all other posts so they are easy to find.
 */
export async function getPosts(): Promise<Post[]> {
	const drafts = await getCollection("blog", ({ id }) =>
		id.startsWith("drafts/"),
	);

	return [...drafts.sort(compareByDate), ...(await getPublishedPosts())];
}

/**
 * Determines the URL of a blog post.
 */
export function getPostUrl(post: Post): string {
	return `/blog/${blogPermalinkDate(post.data.date)}/${post.data.slug}/`;
}

/**
 * Determines when a post was last updated, as recorded in
 * `src/data/blog-dates.json` by `tools/update-blog-dates.js`.
 */
export function getLastUpdated(post: Post): Date {
	const { date, filename } = post.data;
	const isoDate = (blogDates as Record<string, string>)[filename];
	const publishDate = new Date(filename.slice(0, 10));

	if (!isoDate || !(publishDate > LAST_UPDATED_CUTOFF)) {
		return date;
	}

	const lastUpdated = new Date(isoDate);

	return lastUpdated < date ? date : lastUpdated;
}

/**
 * Renders the bio of a blog post author. Bios are Markdown files in
 * `src/content/author-bios` that are named after the author's username.
 */
export function getAuthorBio(username: string): string {
	const bio = authorBios[`../content/author-bios/${username}.md`];

	return bio ? snippetMarkdown.render(bio) : "";
}

/**
 * Creates the properties for a `<Card>` from a blog post.
 */
export function getCardProps(post: Post, authors: Record<string, Author>) {
	const author = authors[post.data.authors[0]];

	return {
		authorImage: author?.avatar_url,
		authorName: author?.name,
		featured: post.data.featured,
		url: getPostUrl(post),
		image: post.data.image,
		category: post.data.categories[0],
		title: post.data.title,
		readingTime: post.data.readingTime,
		teaser: post.data.teaser,
		date: post.data.date,
	};
}

/**
 * Finds the unique categories of the given posts, in alphabetical order.
 */
export function getCategories(posts: Post[]): Category[] {
	const titles = posts
		.flatMap(post => post.data.categories)
		.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

	return [...new Set(titles)].map(title => ({
		title,
		slug: categorySlug(title),
		totalItems: posts.filter(post => post.data.categories.includes(title))
			.length,
	}));
}

/**
 * Splits the posts of each category into pages. The first page of a category
 * has the slug of the category (`release-notes`) and the following pages add
 * the page number (`release-notes/2`).
 */
export function paginateByCategory(
	posts: Post[],
	itemsPerPage = POSTS_PER_CATEGORY_PAGE,
): CategoryPage[] {
	return getCategories(posts).flatMap(category => {
		const postsInCategory = posts.filter(post =>
			post.data.categories.includes(category.title),
		);
		const totalPages = Math.ceil(postsInCategory.length / itemsPerPage);
		const slugs = Array.from({ length: totalPages }, (_, index) =>
			index === 0 ? category.slug : `${category.slug}/${index + 1}`,
		);

		return slugs.map((slug, index) => ({
			title: category.title,
			slug,
			currentPage: index + 1,
			totalItems: postsInCategory.length,
			totalPages,
			items: postsInCategory.slice(
				index * itemsPerPage,
				(index + 1) * itemsPerPage,
			),
			hrefs: {
				all: slugs,
				first: slugs[0],
				last: slugs.at(-1)!,
				next: slugs[index + 1] ?? null,
				previous: slugs[index - 1] ?? null,
			},
		}));
	});
}
