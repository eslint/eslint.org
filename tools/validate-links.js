"use strict";

const path = require("node:path");
const TapRender = require("@munter/tap-render");
const spot = require("tap-spot");
const hyperlink = require("hyperlink");

const tapRenderInstance = new TapRender();

tapRenderInstance.pipe(spot()).pipe(process.stdout);

const skipPatterns = [
	"https://",
	"fragment-redirect",
	path.normalize("dist/sponsors"),
	"/docs",
];

function skipFilter(report) {
	return Object.values(report).some(value =>
		skipPatterns.some(pattern => String(value).includes(pattern)),
	);
}

(async () => {
	try {
		await hyperlink(
			{
				inputUrls: ["../dist/index.html"],
				root: path.resolve(__dirname, "../dist"),
				canonicalRoot: "https://eslint.org/",
				recursive: true,
				internalOnly: true,
				pretty: true,
				concurrency: 25,
				skipFilter,
			},
			tapRenderInstance,
		);
	} catch (err) {
		console.log(err.stack);
		process.exit(1);
	}
	const results = tapRenderInstance.close();

	process.exit(results.fail ? 1 : 0);
})();
