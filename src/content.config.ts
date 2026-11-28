/**
 * @fileoverview Content collections for the site.
 *
 * - `sites` contains the translated text and settings for each language.
 * - `blog` and `library` are authored content.
 * - Everything else is data in `src/data` that is kept up-to-date by the
 *   scripts in `tools/` (run daily by the "Data Fetch" GitHub workflow), so
 *   those files must keep the format that the scripts write.
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { blogLoader } from "./lib/blog-loader";

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const person = z.looseObject({
	username: z.string(),
	name: z.string().nullish(),
	title: z.string().nullish(),
	website: z.string().nullish(),
	avatar_url: z.string().nullish(),
	bio: z.string().nullish(),
	twitter_username: z.string().nullish(),
	github_username: z.string().nullish(),
	mastodon_url: z.string().nullish(),
	bluesky_url: z.string().nullish(),
	location: z.string().nullish(),
});

const sponsor = z.looseObject({
	name: z.string().nullish(),
	url: z.string().nullish(),
	image: z.string().nullish(),
	monthlyDonation: z.number(),
	totalDonations: z.union([z.number(), z.string()]).optional(),
	source: z.string().optional(),
	tier: z.string().nullish(),
});

/**
 * Creates a parser for a JSON file containing one object, so that the object
 * becomes the only entry (with the given ID) in a collection.
 */
function single(id: string) {
	return (text: string) => ({ [id]: JSON.parse(text) });
}

/**
 * Parses a JSON file containing an object whose values are arrays, so that
 * each array becomes an entry: `{ a: [] }` becomes `[{ id: "a", items: [] }]`.
 */
function groups(text: string) {
	return Object.entries(JSON.parse(text))
		.filter(([, value]) => Array.isArray(value))
		.map(([id, items]) => ({ id, items }));
}

//-----------------------------------------------------------------------------
// Translations
//-----------------------------------------------------------------------------

const sites = defineCollection({
	loader: glob({ pattern: "*.yml", base: "./src/i18n" }),
	schema: z.looseObject({
		language: z.object({
			code: z.string(),
			flag: z.string(),
			name: z.string(),
			title: z.string(),
		}),
		locale: z.string(),

		// required for English; for other languages, only the old domain to redirect
		hostname: z.string().optional(),
	}),
});

//-----------------------------------------------------------------------------
// Authored Content
//-----------------------------------------------------------------------------

const blog = defineCollection({
	loader: blogLoader(),
	schema: z.object({
		title: z.string(),
		teaser: z.string().optional(),
		image: z.string().optional(),
		authors: z.array(z.string()),
		categories: z.array(z.string()).min(1),
		tags: z.array(z.string()).optional(),
		featured: z.union([z.boolean(), z.string()]).optional(),
		original: z
			.object({
				url: z.string(),
				date: z.coerce.date(),
				site: z.object({ name: z.string(), url: z.string() }),
			})
			.optional(),

		// calculated by the loader
		slug: z.string(),
		date: z.date(),
		draft: z.boolean(),
		readingTime: z.string(),
		filename: z.string(),
	}),
});

const library = defineCollection({
	loader: glob({ pattern: "*.mdx", base: "./src/content/library" }),
	schema: z.object({
		title: z.string(),
	}),
});

//-----------------------------------------------------------------------------
// Fetched Data
//-----------------------------------------------------------------------------

// tools/fetch-team-data.js and tools/add-author.js
const authors = defineCollection({
	loader: file("src/data/all_authors.json"),
	schema: person,
});

// tools/fetch-team-data.js
const team = defineCollection({
	loader: file("src/data/team.json", { parser: groups }),
	schema: z.object({ items: z.array(person) }),
});

// tools/fetch-sponsors.js
const sponsors = defineCollection({
	loader: file("src/data/sponsors.json", { parser: groups }),
	schema: z.object({ items: z.array(sponsor) }),
});

const sponsorTotals = defineCollection({
	loader: file("src/data/sponsors.json", {
		parser: text => ({ totals: JSON.parse(text).totals }),
	}),
	schema: z.object({
		annualDonations: z.number(),
		monthlyDonations: z.number(),
		sponsorCount: z.number(),
	}),
});

const donations = defineCollection({
	loader: file("src/data/donations.json"),
	schema: z.looseObject({
		name: z.string().nullish(),
		url: z.string().nullish(),
		image: z.string().nullish(),
		amount: z.number(),
		date: z.string(),
		source: z.string().optional(),
	}),
});

// tools/fetch-stats.js
const stats = defineCollection({
	loader: file("src/data/stats.json", { parser: single("stats") }),
	schema: z.object({
		latestVersion: z.string(),
		latestVersionDate: z.string(),
		currentVersion: z.string(),
		currentVersionDate: z.string(),
		currentVersionIsPrerelease: z.boolean(),
		stars: z.number(),
		lastCommitDate: z.string(),
		projectDependents: z.number(),
		weeklyDownloads: z.number(),
		nextVersion: z.string(),
		nextVersionDate: z.string(),
	}),
});

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

export const collections = {
	sites,
	blog,
	library,
	authors,
	team,
	sponsors,
	sponsorTotals,
	donations,
	stats,
};
