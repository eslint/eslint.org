"use strict";

module.exports = {
	extends: ["stylelint-config-standard-scss"],
	rules: {
		"alpha-value-notation": "number",
		"at-rule-empty-line-before": null,
		"color-function-notation": "legacy",
		"color-hex-case": null,
		"custom-property-empty-line-before": null,
		"custom-property-pattern": null,
		"declaration-block-no-duplicate-properties": [
			true,
			{
				ignore: ["consecutive-duplicates-with-different-values"]
			}
		],
		"declaration-block-no-redundant-longhand-properties": null,
		"declaration-block-no-shorthand-property-overrides": null,
		"hue-degree-notation": "number",
		indentation: null,
		"declaration-colon-newline-after": null,
		"selector-descendant-combinator-no-non-space": null,
		"selector-combinator-space-before": null,
		"value-list-comma-newline-after": null,
		"max-line-length": null,
		"scss/operator-no-newline-after": null,
		"no-descending-specificity": null,
		"number-leading-zero": null,
		"number-no-trailing-zeros": null,
		"property-no-unknown": null,
		"property-no-vendor-prefix": null,
		"selector-class-pattern": null,
		"value-keyword-case": null
	}
};
