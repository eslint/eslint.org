import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
	site: "https://eslint.org",
	srcDir: "src",
	publicDir: "public",
	outDir: "dist",
	output: "static",
	trailingSlash: "always",

	integrations: [react(), sitemap()],

	markdown: {
		shikiConfig: {
			theme: "github-dark",
		},
		remarkPlugins: [],
		rehypePlugins: [],
	},

	vite: {
		resolve: {
			alias: {
				"@data": "/src/data",
				"@components": "/src/components",
				"@layouts": "/src/layouts",
				"@assets": "/src/assets",
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					silenceDeprecations: ["legacy-js-api"],
				},
			},
		},
		// Allow serving files from src/assets during dev
		server: {
			fs: {
				allow: [".."],
			},
		},
	},

	// Build-time config: copy assets
	build: {
		assets: "assets",
	},
});
