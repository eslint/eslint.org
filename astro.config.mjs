import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
	site: "https://eslint.org",
	srcDir: "src",
	outDir: "dist",
	output: "static",
	trailingSlash: "always",

	integrations: [react()],

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
	},
});
