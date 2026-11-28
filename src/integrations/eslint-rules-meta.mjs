/**
 * @fileoverview Vite plugin that exposes the metadata of ESLint's built-in
 * rules to the playground as the `virtual:eslint-rules-meta` module.
 * @author Pixel998
 */

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const MODULE_ID = "virtual:eslint-rules-meta";
const RESOLVED_MODULE_ID = `\0${MODULE_ID}`;

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

export default function eslintRulesMeta() {
	return {
		name: "eslint-rules-meta",

		resolveId(id) {
			return id === MODULE_ID ? RESOLVED_MODULE_ID : void 0;
		},

		async load(id) {
			if (id !== RESOLVED_MODULE_ID) {
				return void 0;
			}

			const { builtinRules } =
				await import("eslint/use-at-your-own-risk");
			const rulesMeta = Object.fromEntries(
				Array.from(builtinRules, ([key, { meta }]) => [key, meta]),
			);

			return `export default ${JSON.stringify(rulesMeta)};`;
		},
	};
}
