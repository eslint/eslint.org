/**
 * @fileoverview Content loader for blog posts.
 *
 * Blog posts live in `src/content/blog` and are named
 * `YYYY-MM-DD-slug.md`. Drafts live in `src/content/drafts` without a date in
 * the filename. Posts are rendered with markdown-it so their markup is
 * identical to what the site has always published.
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Loader, LoaderContext } from "astro/loaders";
import matter from "gray-matter";
import { blogMarkdown } from "./markdown.mjs";
import { readingTime } from "./format";

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const BLOG_DIR = "src/content/blog";
const DRAFTS_DIR = "src/content/drafts";
const DATED_FILENAME = /^(?<date>\d{4}-\d{2}-\d{2})-(?<slug>.+)\.md$/u;

/*
 * Drafts and scheduled (future-dated) posts are shown in local development
 * and in Netlify deploy previews, but not in production builds.
 */
const CONTEXT = process.env.CONTEXT;
const showDrafts = !CONTEXT || CONTEXT === "deploy-preview";

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Nunjucks used to process posts before Markdown did, so some posts wrap
 * template-like text in raw tags. The tags are no longer necessary.
 */
function stripRawTags(text: string): string {
	return text.replace(/\{%-?\s*(?:end)?raw\s*-?%\}/gu, "");
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

export function blogLoader(): Loader {
	return {
		name: "eslint-blog-loader",

		async load(context: LoaderContext) {
			const { config, store, parseData, generateDigest, logger, watcher } =
				context;
			const root = fileURLToPath(config.root);
			const blogDir = path.resolve(root, BLOG_DIR);
			const draftsDir = path.resolve(root, DRAFTS_DIR);

			/**
			 * Loads one post into the store, or removes it if it shouldn't be published.
			 */
			async function syncFile(filePath: string): Promise<void> {
				const filename = path.basename(filePath);
				const isDraft = path.dirname(filePath) === draftsDir;
				const match = DATED_FILENAME.exec(filename);
				const slug = match?.groups?.slug ?? path.basename(filename, ".md");
				const id = isDraft ? `drafts/${slug}` : filename.slice(0, -3);

				if (!filename.endsWith(".md") || filename === "README.md") {
					return;
				}

				let source;

				try {
					source = await fs.readFile(filePath, "utf8");
				} catch {
					store.delete(id);
					return;
				}

				const { data: frontmatter, content } = matter(source);
				let date: Date;

				if (frontmatter.date) {
					date = new Date(frontmatter.date);
				} else if (match?.groups) {
					date = new Date(match.groups.date);
				} else {
					date = (await fs.stat(filePath)).birthtime;
				}

				if (!showDrafts) {
					if (isDraft || frontmatter.draft) {
						store.delete(id);
						return;
					}

					if (match?.groups && Date.parse(match.groups.date) > Date.now()) {
						logger.info(`Ignoring future blog post ${filename}`);
						store.delete(id);
						return;
					}
				}

				const html = blogMarkdown.render(stripRawTags(content));
				const data = await parseData({
					id,
					data: {
						...frontmatter,
						slug,
						date,
						draft: isDraft || Boolean(frontmatter.draft),
						readingTime: readingTime(html),
						filename,
					},
					filePath,
				});

				store.set({
					id,
					data,
					body: content,
					filePath: path.relative(root, filePath).replaceAll("\\", "/"),
					digest: generateDigest(source),
					rendered: { html },
				});
			}

			/**
			 * Finds all of the Markdown files in a directory.
			 */
			async function findFiles(dir: string): Promise<string[]> {
				try {
					return (await fs.readdir(dir))
						.filter(filename => filename.endsWith(".md"))
						.map(filename => path.join(dir, filename));
				} catch {
					return [];
				}
			}

			store.clear();

			const files = [
				...(await findFiles(blogDir)),
				...(showDrafts ? await findFiles(draftsDir) : []),
			];

			await Promise.all(files.map(syncFile));

			// keep posts up-to-date while the dev server is running
			if (watcher) {
				// changes to a file are applied in order so that a slow load
				// can never overwrite the result of a later change or deletion
				const pending = new Map<string, Promise<void>>();
				const onChange = (filePath: string) => {
					const dir = path.dirname(filePath);

					if (dir === blogDir || dir === draftsDir) {
						pending.set(
							filePath,
							(pending.get(filePath) ?? Promise.resolve())
								.then(() => syncFile(filePath))
								.catch(error => logger.error(String(error))),
						);
					}
				};

				watcher.add([blogDir, draftsDir]);
				watcher.on("add", onChange);
				watcher.on("change", onChange);
				watcher.on("unlink", onChange);
			}
		},
	};
}
