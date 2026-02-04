import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://eslint.org",
	output: "static",
	outDir: "./_site",
	publicDir: "./public",
	srcDir: "./src",
	trailingSlash: "always",
	build: {
		format: "directory",
		assets: "assets",
	},
	i18n: {
		defaultLocale: "en",
		locales: ["en", "es", "de", "fr", "hi", "ja", "pt-br", "zh-hans"],
		routing: {
			prefixDefaultLocale: true,
			redirectToDefaultLocale: true,
		},
	},
	integrations: [sitemap()],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					api: "modern-compiler",
				},
			},
		},
	},
	// Disable content collections auto-detection for legacy directories
	legacy: {
		collections: true,
	},
});
