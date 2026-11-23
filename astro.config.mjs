/**
 * @fileoverview Astro configuration file
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import fs from "node:fs";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { load as loadYaml } from "js-yaml";
import devTrailingSlash from "./src/integrations/dev-trailing-slash.mjs";
import netlifyRedirects from "./src/integrations/netlify-redirects.mjs";
import sitemap from "./src/integrations/sitemap.mjs";
import staticImages from "./src/integrations/static-images.mjs";
import eslintInBrowser from "./src/integrations/eslint-in-browser.mjs";
import eslintRulesMeta from "./src/integrations/eslint-rules-meta.mjs";

//-----------------------------------------------------------------------------
// Site Data
//-----------------------------------------------------------------------------

/*
 * The text for each language lives in `src/i18n/<locale>.yml`. English is
 * published at the root of the site and every other language is published
 * under its language code, such as `/ja/`. The site file for English also
 * contains the settings for the whole site.
 * The default locale must match `DEFAULT_LOCALE` in `src/lib/site.ts`.
 */
const defaultLocale = "en";
const i18nDir = new URL("./src/i18n/", import.meta.url);
const sites = Object.fromEntries(
	fs
		.readdirSync(i18nDir)
		.filter(filename => filename.endsWith(".yml"))
		.map(filename => [
			filename.slice(0, -4),
			loadYaml(fs.readFileSync(new URL(filename, i18nDir), "utf8")),
		]),
);
const site = sites[defaultLocale];
const translations = Object.entries(sites)
	.filter(([locale]) => locale !== defaultLocale)
	.map(([locale, { hostname }]) => ({ locale, hostname }));

//-----------------------------------------------------------------------------
// Config
//-----------------------------------------------------------------------------

export default defineConfig({
	site: `https://${site.hostname}`,
	output: "static",

	// every page is published as a directory, so its URL ends with a slash
	trailingSlash: "always",

	// keep the generated markup readable and whitespace-faithful
	compressHTML: false,
	image: {
		// sponsor logos are measured at build time so their space can be reserved
		domains: ["images.opencollective.com", "avatars.githubusercontent.com"],
	},

	i18n: {
		locales: Object.keys(sites),
		defaultLocale,
		routing: {
			prefixDefaultLocale: false,
		},
	},

	server: {
		port: 2022,
	},

	integrations: [
		react({ compiler: true }),
		mdx(),
		staticImages(),
		sitemap(site),
		netlifyRedirects(site, translations),
	],

	markdown: {
		// the site ships its own Prism theme in syntax-highlighter.scss
		syntaxHighlight: "prism",
	},

	vite: {
		plugins: [eslintRulesMeta(), eslintInBrowser(), devTrailingSlash()],
		css: {
			preprocessorOptions: {
				scss: {
					quietDeps: true,
				},
			},
		},
	},
});
