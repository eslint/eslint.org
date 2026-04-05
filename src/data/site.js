import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

// Use process.cwd() as the base to avoid issues during Astro builds
// where import.meta.url might point to a bundled location
const rootDir = process.cwd();

const siteName =
	process.env.ESLINT_SITE_NAME || "en";

const sitePath = path.resolve(rootDir, "src", "_data", "sites", `${siteName}.yml`);
const siteData = yaml.load(fs.readFileSync(sitePath, "utf8"));

export default siteData;
