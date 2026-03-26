import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const siteName =
	(typeof import.meta.env !== "undefined" && import.meta.env.ESLINT_SITE_NAME) ||
	process.env.ESLINT_SITE_NAME ||
	"en";

const sitePath = path.resolve(__dirname, "..", "_data", "sites", `${siteName}.yml`);
const siteData = yaml.load(fs.readFileSync(sitePath, "utf8"));

export default siteData;
