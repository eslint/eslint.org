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
import css from "@eslint/css";
import json from "@eslint/json";
import markdown from "@eslint/markdown";

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

function createMeta(plugin) {
	const rules = plugin.rules ?? {};
	const rulesMeta = Object.fromEntries(
		Object.entries(rules).map(([key, { meta }]) => [key, meta]),
	);

	return rulesMeta;
}

function writeJsonFile(fileName, data) {
	const OUT_PATH = path.resolve(BUILD_DIR, fileName);
	writeFileSync(OUT_PATH, JSON.stringify(data, null, 4));
}

try {
	const rulesMeta = Object.fromEntries(
		Array.from(builtinRules, ([key, { meta }]) => [key, meta]),
	);
	const cssRulesMeta = createMeta(css);
	const jsonRulesMeta = createMeta(json);
	const markdownRulesMeta = createMeta(markdown);

	mkdirSync(BUILD_DIR, { recursive: true });

	writeJsonFile("rules_meta.json", rulesMeta);
	writeJsonFile("css_rules_meta.json", cssRulesMeta);
	writeJsonFile("json_rules_meta.json", jsonRulesMeta);
	writeJsonFile("markdown_rules_meta.json", markdownRulesMeta);
} catch (error) {
	console.error(`Failed to generate rules metadata: ${error.message}`);
	process.exit(1);
}
