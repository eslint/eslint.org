/**
 * @fileoverview Generates rules_meta.json for the Playground.
 * @author Pixel998
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { builtinRules } from "eslint/use-at-your-own-risk";

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

// eslint-disable-next-line no-underscore-dangle -- Conventional
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = path.resolve(__dirname, "../build");
const OUT_PATH = path.resolve(BUILD_DIR, "rules_meta.json");

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

try {
	const rulesMeta = Object.fromEntries(
		Array.from(builtinRules, ([key, { meta }]) => [key, meta]),
	);

	mkdirSync(BUILD_DIR, { recursive: true });
	writeFileSync(OUT_PATH, JSON.stringify(rulesMeta, null, 4));
} catch (error) {
	console.error(`Failed to generate rules_meta.json: ${error.message}`);
	process.exit(1);
}
