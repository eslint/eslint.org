import { defineCollection, z } from "astro:content";
import { glob } from "astro:content";

const blogSchema = z.object({
	title: z.string(),
	teaser: z.string().optional(),
	tags: z.array(z.string()).optional(),
	authors: z.array(z.string()).optional(),
	author: z.string().optional(),
	categories: z.array(z.string()).optional(),
	image: z.string().optional(),
	featured: z.string().optional(),
	draft: z.boolean().optional(),
});

const blog = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "src/content/blog" }),
	schema: blogSchema,
});

const drafts = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "src/content/drafts" }),
	schema: blogSchema,
});

const library = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "src/content/library" }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		order: z.number().optional(),
		layout: z.string().optional(),
	}),
});

export const collections = { blog, drafts, library };
