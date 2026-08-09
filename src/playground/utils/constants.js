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

// GitHub Issue Reporting constants
export const GITHUB_ISSUE_URL = "https://github.com/eslint/eslint/issues/new";

export const MAX_URL_LENGTH = 8148;

export const CLIPBOARD_FALLBACK_MESSAGE =
	"<!-- The configuration and code have been saved to clipboard. Please paste them here 👇🏻 -->";

export const REPRO_URL_FALLBACK_MESSAGE =
	"<!-- The link to the minimal reproducible example has been copied in What did you do? field above. -->";

export const LINT_OUTPUT_FALLBACK_MESSAGE =
	"<!-- The lint output for what actually happened has been copied in What did you do? field above. -->";

// Constants for styles

export const customStyles = {
	singleValue: styles => ({
		...styles,
		color: "var(--body-text-color)",
	}),
	control: styles => ({
		...styles,
		backgroundColor: "var(--body-background-color)",
		border: "1px solid var(--border-color)",
		color: "var(--body-text-color)",
		padding: 0,
		":hover": {
			...styles[":hover"],
			borderColor: "var(--color-primary-700)",
		},
		":focus": {
			borderColor: "var(--color-primary-700)",
		},
		":active": {
			borderColor: "var(--color-primary-700)",
		},
	}),
	option: (styles, state) => ({
		...styles,
		backgroundColor: state.isFocused
			? "var(--color-primary-700)"
			: "var(--body-background-color)",
		color: state.isFocused ? "white" : "var(--body-text-color)",
		cursor: "pointer",
		border: "1px solid var(--border-color)",
		borderBottom: "none",
		":hover": {
			...styles[":hover"],
			backgroundColor: "var(--color-primary-700)",
			color: "white",
		},
		":active": {
			...styles[":active"],
			backgroundColor: "var(--color-primary-700)",
		},
	}),
	input: styles => ({
		...styles,
		color: "var(--body-text-color)",
		caretShape: "underscore",
	}),
	indicatorsContainer: styles => ({
		...styles,
		cursor: "pointer",
	}),
	indicatorSeparator: styles => ({
		...styles,
		cursor: "auto",
	}),
	multiValue: styles => ({
		...styles,
		color: "var(--body-text-color)",
		backgroundColor: "var(--lighter-background-color)",
		border: "1px solid var(--border-color)",
	}),
	multiValueLabel: styles => ({
		...styles,
		color: "var(--headings-color)",
		backgroundColor: "var(--lighter-background-color)",
	}),
	multiValueRemove: styles => ({
		...styles,
		color: "var(--headings-color)",
		cursor: "pointer",
		backgroundColor: "var(--lighter-background-color)",
	}),
	noOptionsMessage: styles => ({
		...styles,
		backgroundColor: "var(--body-background-color)",
		border: "1px solid var(--border-color)",
		borderBottom: "none",
	}),
	menuList: styles => ({
		...styles,
		padding: 0,
		borderBottom: "1px solid var(--border-color)",
	}),
};

export const customTheme = theme => ({
	...theme,
	colors: {
		...theme.colors,
		primary25: "var(--color-primary-500)",
		primary: "var(--color-primary-700)",
	},
});
