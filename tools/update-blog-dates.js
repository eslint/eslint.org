"use strict";

/**
 * @fileoverview
 * Updates blogDates.json with last modified dates for blog posts.
 * Processes staged blog files by default. Run with --init to process all files
 * and initialize the dates file.
 */

const fs = require("node:fs/promises");
const path = require("node:path");
const { execSync } = require("node:child_process");

const BLOG_DIR = path.resolve(__dirname, "../src/content/blog");
const DATES_FILE = path.resolve(__dirname, "../src/_data/blogDates.json");

/**
 * Checks if a file exists at the given path.
 * @param {string} filePath The path to check for file existence.
 * @returns {Promise<boolean>} True if the file exists, false otherwise.
 */
async function fileExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

/**
 * Retrieves all blog post files from the blog directory.
 * @returns {Promise<string[]>} Array of absolute paths to all .md files in the blog directory.
 */
async function getAllBlogFiles() {
	const files = await fs.readdir(BLOG_DIR);
	return files
		.filter(file => file.endsWith(".md"))
		.map(file => path.resolve(BLOG_DIR, file));
}

/**
 * Gets the list of staged blog post files from git.
 * @returns {Promise<string[]>} Array of absolute paths to staged .md files in the blog directory.
 */
async function getStagedBlogFiles() {
	const stagedFiles = execSync(
		"git diff --staged --name-only --diff-filter=ACMRT",
	)
		.toString()
		.trim()
		.split("\n");

	return stagedFiles
		.filter(
			file =>
				file.startsWith("src/content/blog/") && file.endsWith(".md"),
		)
		.map(file => path.resolve(process.cwd(), file));
}

/**
 * Loads and parses the existing blog dates from blogDates.json.
 * @returns {Promise<Object>} Object containing blog post dates.
 * @throws {Error} If the file cannot be parsed.
 */
async function loadExistingDates() {
	try {
		return JSON.parse(await fs.readFile(DATES_FILE, "utf8"));
	} catch (error) {
		throw new Error(`Failed to parse ${DATES_FILE}: ${error.message}`);
	}
}

/**
 * Gets the last git commit date for a specific file.
 * @param {string} filePath The path to the file to check.
 * @returns {Date} The last commit date for the file, or current date if no git history.
 * @throws {Error} If git command fails.
 */
function getGitLastUpdated(filePath) {
	try {
		const date = execSync(`git log -1 --format=%cI "${filePath}"`)
			.toString()
			.trim();
		return date ? new Date(date) : new Date();
	} catch (error) {
		throw new Error(
			`Could not get git date for ${filePath}: ${error.message}`,
		);
	}
}

(async () => {
	try {
		const isInitialization = process.argv.includes("--init");

		if (!(await fileExists(DATES_FILE))) {
			if (!isInitialization) {
				throw new Error(
					`blogDates.json not found at ${DATES_FILE}\n` +
						"Run with --init to initialize dates file.",
				);
			}
			console.log("Initializing new dates file...");
		}

		const filesToProcess = isInitialization
			? await getAllBlogFiles()
			: await getStagedBlogFiles();

		if (filesToProcess.length === 0) {
			return;
		}

		const datesData = isInitialization ? {} : await loadExistingDates();

		for (const file of filesToProcess) {
			const isStaged = !isInitialization;
			const lastUpdated = isStaged ? new Date() : getGitLastUpdated(file);
			const relativePath = path.relative(BLOG_DIR, file);
			datesData[relativePath] = lastUpdated.toISOString();
		}

		await fs.writeFile(DATES_FILE, JSON.stringify(datesData, null, 4));

		console.log(`Updated ${filesToProcess.length} post dates`);
	} catch (error) {
		console.error("Error:", error.message);
		process.exit(1);
	}
})();
