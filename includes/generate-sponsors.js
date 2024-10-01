/**
 * @fileoverview
 * This script generates a markdown file containing sponsor information.
 * It fetches sponsor data from specified JSON files, formats
 * the data into HTML sections, and writes the output to a new markdown file.
 *
 * Usage:
 *   Run the script using Node.js:
 *   node tools/generate-sponsors.js
 *
 * Author: Amaresh S M
 */
"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const fs = require("node:fs").promises;
const path = require("node:path");
const { stripIndents } = require("common-tags");

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const SPONSORS_URL = path.resolve(__dirname, "../src/_data/sponsors.json");
const TECH_SPONSORS_URL = path.resolve(
	__dirname,
	"../src/_data/techsponsors.json",
);
const NEW_FILE_PATH = path.resolve(__dirname, "../sponsors/sponsors.md");

const TECH_SPONSORS_IMAGE_PATH =
	"https://raw.githubusercontent.com/eslint/eslint.org/main/src";

const HEIGHTS = {
	diamond: 160,
	platinum: 128,
	gold: 96,
	silver: 64,
	bronze: 32,
};

const SPONSOR_INTRO_TEXT = `## Sponsors

The following companies, organizations, and individuals support ESLint's ongoing maintenance and development. [Become a Sponsor](https://eslint.org/donate)
to get your logo on our READMEs and [website](https://eslint.org/sponsors).`;

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Fetches data from the specified URL and parses it as JSON.
 * @param {string} url The URL to fetch data from.
 * @returns {Object|null} The parsed data object, or null if an error occurs.
 */
async function fetchData(url) {
	try {
		const data = await fs.readFile(url, "utf8");
		return JSON.parse(data);
	} catch (err) {
		console.error("Error reading or parsing the file:", err);
		return null;
	}
}

/**
 * Fetches the latest sponsors data from the website.
 * @returns {Object|null} The sponsors data object without backers.
 */
async function fetchSponsorsData() {
	const sponsorsData = await fetchData(SPONSORS_URL);
	if (sponsorsData) {
		delete sponsorsData.backers;
	}
	return sponsorsData;
}

/**
 * Fetches the latest tech sponsors data from the website.
 * @returns {Array<Object>|null} The tech sponsors data object.
 */
async function fetchTechSponsors() {
	return fetchData(TECH_SPONSORS_URL);
}

/**
 * Formats an array of sponsors into HTML for the readme.
 * @param {Array} sponsors The array of sponsors.
 * @returns {string} The HTML for the sponsors section.
 */
function formatSponsors(sponsors) {
	const nonEmptySponsors = Object.keys(sponsors).filter(
		tier => sponsors[tier].length,
	);

	return stripIndents`
        ${nonEmptySponsors
			.map(
				tier => `<h3>${tier[0].toUpperCase()}${tier.slice(
					1,
				)} Sponsors</h3>
            <p>${sponsors[tier]
				.map(
					sponsor =>
						`<a href="${sponsor.url || "#"}"><img src="${
							sponsor.image
						}" alt="${sponsor.name}" height="${HEIGHTS[tier]}"></a>`,
				)
				.join(" ")}</p>`,
			)
			.join("")}`;
}

/**
 * Formats an array of tech sponsors into HTML for the new file.
 * @param {Array} sponsors The array of tech sponsors.
 * @returns {string} The HTML for the tech sponsors section.
 */
function formatTechSponsors(sponsors) {
	return stripIndents`
        <h3>Technology Sponsors</h3>
        Technology sponsors allow us to use their products and services for free as part of a contribution to the open source ecosystem and our work.
            <p>${sponsors
				.map(
					sponsor =>
						`<a href="${sponsor.url || "#"}"><img src="${
							TECH_SPONSORS_IMAGE_PATH + sponsor.image
						}" alt="${sponsor.name}" height="${HEIGHTS.bronze}"></a>`,
				)
				.join(" ")}</p>`;
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

/**
 * Writes data to a specified file.
 * @param {string} filePath The path to the file where data should be written.
 * @param {string|Object} data The data to write to the file. If an object is provided, it should be stringified.
 * @returns {Promise<void>} A promise that resolves when the write operation is complete.
 * @throws {Error} Will log an error if writing to the file fails.
 */
async function writeData(filePath, data) {
	try {
		await fs.writeFile(filePath, data, "utf8");
	} catch (err) {
		console.error("Error writing data:", err);
	}
}

(async () => {
	const [allSponsors, techSponsors] = await Promise.all([
		fetchSponsorsData(),
		fetchTechSponsors(),
	]);

	const newFileContent = stripIndents`
        ${SPONSOR_INTRO_TEXT}
        ${formatSponsors(allSponsors)}
        ${formatTechSponsors(techSponsors)}
    `;

	await writeData(NEW_FILE_PATH, newFileContent);
	console.log(`Sponsors information has been written to ${NEW_FILE_PATH}`);
})();
