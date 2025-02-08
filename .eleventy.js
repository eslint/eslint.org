"use strict";

/**
 * @fileoverview Eleventy Configuration File
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const readingTime = require("eleventy-plugin-reading-time");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginTOC = require("eleventy-plugin-nesting-toc");
const slugify = require("slugify");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const Image = require("@11ty/eleventy-img");
const path = require("node:path");
const fs = require("node:fs");
const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const { execSync } = require("node:child_process");

//-----------------------------------------------------------------------------
// Eleventy Config
//-----------------------------------------------------------------------------

module.exports = eleventyConfig => {
	// Load site-specific data
	const siteName = process.env.ESLINT_SITE_NAME || "en";

	eleventyConfig.addGlobalData("site_name", siteName);

	// Support YAML data files
	eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));

	// filter out draft posts and future posts in production only
	const CONTEXT = process.env.CONTEXT;

	if (CONTEXT && CONTEXT !== "deploy-preview") {
		eleventyConfig.ignores.add("src/content/drafts/");

		const blogDir = "src/content/blog";
		const blogFiles = fs.readdirSync(path.resolve(__dirname, blogDir));

		blogFiles.forEach(blogFile => {
			const match = /^(?<date>\d{4}-\d{2}-\d{2})-.*\.md$/u.exec(blogFile);

			if (!match) {
				return;
			}

			const date = match.groups.date;

			if (Date.parse(date) > Date.now()) {
				const ignorePattern = `${blogDir}/${blogFile}`;

				console.log(`Ignoring future blog post ${ignorePattern}`);

				eleventyConfig.ignores.add(ignorePattern);
			}
		});
	}

	// Make Nunjucks more strict
	eleventyConfig.setNunjucksEnvironmentOptions({
		throwOnUndefined: true,
	});

	/**
	 * ***************************************************************************************
	 *  Filters
	 * **************************************************************************************
	 */
	eleventyConfig.addFilter("limitTo", (arr, limit) => arr.slice(0, limit));

	eleventyConfig.addFilter("jsonify", variable => JSON.stringify(variable));

	eleventyConfig.addFilter("slugify", str => {
		if (!str) {
			return "";
		}

		return slugify(str, {
			lower: true,
			strict: true,
			remove: /["]/gu,
		});
	});

	eleventyConfig.addFilter("URIencode", str => {
		if (!str) {
			return "";
		}
		return encodeURI(str);
	});

	/* order collection by the order specified in the front matter */
	eleventyConfig.addFilter("sortByPageOrder", values =>
		values.slice().sort((a, b) => a.data.order - b.data.order),
	);

	eleventyConfig.addFilter("readableDate", dateObj => {
		// turn it into a JS Date string
		const date = new Date(dateObj);

		// pass it to luxon for formatting
		return DateTime.fromJSDate(date).toFormat("dd MMM, yyyy");
	});

	eleventyConfig.addFilter("blogPermalinkDate", dateObj => {
		// turn it into a JS Date string
		const date = new Date(dateObj);

		// pass it to luxon for formatting
		return DateTime.fromJSDate(date).toFormat("yyyy/MM");
	});

	eleventyConfig.addFilter("shortDateFromISO", isoDate =>
		DateTime.fromISO(isoDate).toFormat("d MMM"),
	);

	eleventyConfig.addFilter("shortNumber", number => {
		if (number >= 1000000) {
			return `${(number / 1000000).toFixed(1)}M`;
		}

		if (number >= 1000) {
			return `${(number / 1000).toFixed(1)}K`;
		}

		return number.toString();
	});

	eleventyConfig.addFilter("readableDateFromISO", isoDate =>
		DateTime.fromISO(isoDate).toUTC().toLocaleString(DateTime.DATE_FULL),
	);

	eleventyConfig.addFilter("dollars", value =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(value),
	);

	// parse markdown from includes, used for author bios
	// Source: https://github.com/11ty/eleventy/issues/658
	eleventyConfig.addFilter("markdown", value => {
		const markdown = markdownIt({
			html: true,
		});

		return markdown.render(value);
	});

	eleventyConfig.addFilter("concat", (value1, value2) =>
		value1.concat(value2),
	);

	eleventyConfig.addFilter("gitLastUpdated", filepath => {
		// Only check git history in production
		if (CONTEXT) {
			try {
				const date = execSync(`git log -1 --format=%cD ${filepath}`, {
					encoding: "utf-8",
				}).trim();

				if (!date) {
					return null;
				}

				return new Date(date);
			} catch {
				return null;
			}
		}

		return null;
	});

	/**
	 * ***************************************************************************************
	 *  Plugins
	 * **************************************************************************************
	 */
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	eleventyConfig.addPlugin(readingTime);
	eleventyConfig.addPlugin(syntaxHighlight, {
		alwaysWrapLineHighlights: true,
	});
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginTOC, {
		tags: ["h2", "h3", "h4"],
		wrapper: "nav", // Element to put around the root `ol`
		wrapperClass: "c-toc", // Class for the element around the root `ol`
		headingText: "", // Optional text to show in heading above the wrapper element
		headingTag: "h2", // Heading tag when showing heading above the wrapper element
	});

	// add IDs to the headers
	eleventyConfig.setLibrary(
		"md",
		markdownIt({
			html: true,
			linkify: true,
			typographer: true,
		})
			.use(markdownItAnchor, {})
			.disable("code"),
	);

	eleventyConfig.addWatchTarget("./src/assets/");
	eleventyConfig.addWatchTarget("./src/content/pages/");

	/**
	 * ***************************************************************************************
	 *  File PassThroughs
	 * **************************************************************************************
	 */

	eleventyConfig.addPassthroughCopy({
		"./src/static": "/",
	});

	eleventyConfig.addPassthroughCopy("./src/assets/");

	eleventyConfig.addPassthroughCopy({
		"./src/content/**/*.png": "/assets/images",
	});

	eleventyConfig.addPassthroughCopy({
		"./src/content/**/*.jpg": "/assets/images",
	});

	eleventyConfig.addPassthroughCopy({
		"./src/content/**/*.jpeg": "/assets/images",
	});

	eleventyConfig.addPassthroughCopy({
		"./src/content/**/*.svg": "/assets/images",
	});

	eleventyConfig.addPassthroughCopy({
		"./src/content/**/*.mp4": "/assets/videos",
	});

	eleventyConfig.addPassthroughCopy({
		"./src/content/**/*.pdf": "/assets/documents",
	});

	eleventyConfig.addPassthroughCopy({
		"./node_modules/algoliasearch/dist/algoliasearch-lite.esm.browser.js":
			"/assets/js/algoliasearch.js",
	});

	/**
	 * ***************************************************************************************
	 *  Collections
	 * **************************************************************************************
	 */

	eleventyConfig.addCollection(
		"blogposts",
		require("./src/_11ty/collections/blogposts.js"),
	);

	// blogposts unique categories
	eleventyConfig.addCollection(
		"blogCategories",
		require("./src/_11ty/collections/blogpostsCategories.js"),
	);

	// blogposts by categories
	eleventyConfig.addCollection(
		"blogpostsByCategories",
		require("./src/_11ty/collections/blogpostsByCategories.js"),
	);

	eleventyConfig.addCollection("library", collection =>
		collection
			.getFilteredByGlob("./src/content/library/**/*.md")
			.sort((a, b) => a.data.title.localeCompare(b.data.title)),
	);

	// START, eleventy-img
	function imageShortcode(
		src,
		alt,
		cls,
		sizes = "(max-width: 768px) 100vw, 50vw",
	) {
		const options = {
			widths: [600, 900, 1500],
			formats: ["webp", "jpeg"],
			urlPath: "/assets/images/",
			outputDir: "./_site/assets/images/",
			filenameFormat(id, source, width, format) {
				const extension = path.extname(source);
				const name = path.basename(source, extension);

				return `${name}-${width}w.${format}`;
			},
		};

		function getSRC() {
			if (src.indexOf("http://") === 0 || src.indexOf("https://") === 0) {
				return src;
			}

			// for convenience, you only need to use the image's name in the shortcode,
			// and this will handle appending the full path to it
			return path.join("./src/assets/images/", src);
		}

		const fullSrc = getSRC();

		// generate images
		Image(fullSrc, options); // eslint-disable-line new-cap -- Third-party code

		const imageAttributes = {
			alt,
			class: cls,
			sizes,
			loading: "lazy",
			decoding: "async",
		};

		// get metadata
		const metadata = Image.statsSync(fullSrc, options);

		return Image.generateHTML(metadata, imageAttributes);
	}
	eleventyConfig.addShortcode("image", imageShortcode);

	// END, eleventy-img

	return {
		passthroughFileCopy: true,

		markdownTemplateEngine: "njk",
		dataTemplateEngine: "njk",
		htmlTemplateEngine: "njk",

		dir: {
			input: "src",
			includes: "_includes",
			layouts: "_includes/layouts",
			data: "_data",
			output: "_site",
		},
	};
};
