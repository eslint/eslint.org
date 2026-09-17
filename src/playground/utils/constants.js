export const ECMA_FEATURES = ["jsx", "globalReturn", "impliedStrict"];

export const ECMA_VERSIONS = [
	"3",
	"5",
	"2015",
	"2016",
	"2017",
	"2018",
	"2019",
	"2020",
	"2021",
	"2022",
	"2023",
	"2024",
	"2025",
	"2026",
	"latest",
];

export const SOURCE_TYPES = ["script", "module", "commonjs"];

export const CONFIG_FORMATS = ["CommonJS", "ESM"];

export const CSS_LANGUAGES_TYPES = ["css"];

export const MARKDOWN_LANGUAGES_TYPES = ["gfm", "commonmark"];

export const JSON_LANGUAGE_TYPE = ["json", "jsonc", "json5"];

export const FRONTMATTER_TYPES = ["yaml", "toml", "json"];

export const DEFAULT_TEXTS = {
	javascript: '/* eslint prefer-const: "error" */\nlet a = "b";',
	typescript: '/* eslint prefer-const: "error" */\nlet a:string = "b";',
	css: '/* eslint css/no-empty-blocks: "error" */\na {}',
	markdown: '<!-- eslint markdown/no-empty-links: "error" -->\n[ESLint]()',
	json: '/* eslint json/no-empty-keys: "error" */\n{\n  "": "value"\n}',
};

export const LANGUAGE_META = {
	javascript: {
		pluginName: null,
		plugin: false,
		parser: null,
		languageId: null,
	},
	typescript: {
		pluginName: null,
		plugin: false,
		parser: "@typescript-eslint/parser",
		languageId: null,
	},
	css: {
		pluginName: "css",
		plugin: true,
		parser: null,
		languageId: "css/css",
	},
	json: {
		pluginName: "json",
		plugin: true,
		parser: null,
		languageId: "json/jsonc",
	},
	markdown: {
		pluginName: "markdown",
		plugin: true,
		parser: null,
		languageId: "markdown/gfm",
	},
};

export const CODE_FENCE_LANGUAGE_TAGS = {
	javascript: "js",
	typescript: "ts",
	css: "css",
	markdown: "md",
	json: "jsonc",
};

// GitHub Issue Reporting constants
export const GITHUB_ISSUE_URL = "https://github.com/eslint/eslint/issues/new";

export const MAX_URL_LENGTH = 8148;

export const CLIPBOARD_FALLBACK_MESSAGE =
	"<!-- The configuration and code have been saved to clipboard. Please paste them here 👇🏻 -->";

export const REPRO_URL_FALLBACK_MESSAGE =
	"<!-- The link to the minimal reproducible example has been copied in What did you do? field above. -->";

export const LINT_OUTPUT_FALLBACK_MESSAGE =
	"<!-- The lint output for what actually happened has been copied in What did you do? field above. -->";
