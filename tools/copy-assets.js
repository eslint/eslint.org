/**
 * @fileoverview Copies src/assets to public/assets for Astro builds.
 * This replaces Eleventy's passthrough copy behavior.
 */

"use strict";

const fs = require("node:fs");
const path = require("node:path");

const srcDir = path.resolve(__dirname, "../src/assets");
const destDir = path.resolve(__dirname, "../public/assets");

/**
 * Recursively copies a directory.
 * @param {string} src Source directory path.
 * @param {string} dest Destination directory path.
 * @returns {void}
 */
function copyDir(src, dest) {
	fs.mkdirSync(dest, { recursive: true });

	const entries = fs.readdirSync(src, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);

		if (entry.isDirectory()) {
			// Skip scss directory - it's source, not output
			if (entry.name === "scss") {
				continue;
			}

			copyDir(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

// Also copy algoliasearch to assets/js
const algoliaSrc = path.resolve(
	__dirname,
	"../node_modules/algoliasearch/dist/algoliasearch-lite.esm.browser.js",
);
const algoliaDestDir = path.resolve(destDir, "js");

console.log("Copying assets to public/assets...");
copyDir(srcDir, destDir);

if (fs.existsSync(algoliaSrc)) {
	fs.mkdirSync(algoliaDestDir, { recursive: true });
	fs.copyFileSync(algoliaSrc, path.join(algoliaDestDir, "algoliasearch.js"));
	console.log("Copied algoliasearch to public/assets/js/");
}

console.log("Done copying assets.");
