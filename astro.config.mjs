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
import netlifyRedirects from "./src/integrations/netlify-redirects.mjs";
import staticImages from "./src/integrations/static-images.mjs";
import eslintInBrowser from "./src/integrations/eslint-in-browser.mjs";
import eslintRulesMeta from "./src/integrations/eslint-rules-meta.mjs";

//-----------------------------------------------------------------------------
// Site Data
//-----------------------------------------------------------------------------

/*
 * Each language is deployed as its own site on its own domain, so the locale
 * being built is always the default locale and is never prefixed in URLs.
 * The translated text for each locale lives in `src/i18n/<locale>.yml`.
 */
const locale = process.env.ESLINT_SITE_NAME || "en";
const site = loadYaml(
	fs.readFileSync(
		new URL(`./src/i18n/${locale}.yml`, import.meta.url),
		"utf8",
	),
);

//-----------------------------------------------------------------------------
// Config
//-----------------------------------------------------------------------------

export default defineConfig({
	site: `https://${site.hostname}`,
	output: "static",

	// keep the generated markup readable and whitespace-faithful
	compressHTML: false,

	i18n: {
		locales: [locale],
		defaultLocale: locale,
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
		netlifyRedirects(site),
	],

	markdown: {
		// the site ships its own Prism theme in syntax-highlighter.scss
		syntaxHighlight: "prism",
	},

	vite: {
		plugins: [eslintRulesMeta(), eslintInBrowser()],
		css: {
			preprocessorOptions: {
				scss: {
					quietDeps: true,
				},
			},
		},
	},
});
