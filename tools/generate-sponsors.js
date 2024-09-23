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

const fs = require("node:fs");
const { stripIndents } = require("common-tags");
const got = require("got");

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const SPONSORS_URL =
	"https://raw.githubusercontent.com/eslint/eslint.org/main/src/_data/sponsors.json";
const NEW_FILE_PATH = "./sponsors.md";
const TECH_SPONSORS_URL =
	"https://raw.githubusercontent.com/eslint/eslint.org/main/src/_data/techsponsors.json";
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
 * Fetches the latest sponsors data from the website.
 * @returns {Object} The sponsors data object.
 */
async function fetchSponsorsData() {
	const data = await got(SPONSORS_URL).json();
	// remove backers from sponsors list - not shown on readme
	delete data.backers;

	return data;
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

	return stripIndents`<!--sponsorsstart-->
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
			.join("")}
    <!--sponsorsend-->`;
}

/**
 * Fetches the latest tech sponsors data from the website.
 * @returns {Array<Object>} The tech sponsors data object.
 */
async function fetchTechSponsors() {
	return got(TECH_SPONSORS_URL).json();
}

/**
 * Formats an array of tech sponsors into HTML for the new file.
 * @param {Array} sponsors The array of tech sponsors.
 * @returns {string} The HTML for the tech sponsors section.
 */
function formatTechSponsors(sponsors) {
	return stripIndents`<!--techsponsorsstart-->
        <h3>Technology Sponsors</h3>
        Technology sponsors allow us to use their products and services for free as part of a contribution to the open source ecosystem and our work.
            <p>${sponsors
				.map(
					sponsor =>
						`<a href="${sponsor.url || "#"}"><img src="${
							TECH_SPONSORS_IMAGE_PATH + sponsor.image
						}" alt="${sponsor.name}" height="${HEIGHTS.bronze}"></a>`,
				)
				.join(" ")}</p>
    <!--techsponsorsend-->`;
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

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

	fs.writeFileSync(NEW_FILE_PATH, newFileContent, "utf8");
	console.log(`Sponsors information has been written to ${NEW_FILE_PATH}`);
})();
