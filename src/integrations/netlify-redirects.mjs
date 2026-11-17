/**
 * @fileoverview Astro integration that generates the Netlify `_redirects`
 * file for the site being built.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import fs from "node:fs/promises";

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Creates the contents of the `_redirects` file.
 * @param {Object} site The site data of the default locale.
 * @param {Array<{locale: string, hostname: string}>} translations The
 *      other locales and the domains they used to be hosted on.
 * @returns {string} The contents of the file.
 */
function createRedirects(site, translations) {
	const { locals } = site;
	const lines = [
		"# Netlify Redirect Rules",
		"# https://www.netlify.com/docs/redirects/",
		"",
	];

	for (const redirect of site.redirects ?? []) {
		lines.push(
			`${redirect.from}                 ${redirect.to} ${redirect.status}`,
		);
	}

	lines.push(
		"",
		"# Translations used to be separate sites on their own domains",
	);

	for (const { locale, hostname } of translations) {
		lines.push(
			`https://${hostname}/*                 https://${site.hostname}/${locale}/:splat 301!`,
		);
	}

	lines.push(
		"",
		"# Pages that aren't translated only exist in English",
		"# (these only apply when the translated page doesn't exist)",
	);

	for (const { locale } of translations) {
		lines.push(`/${locale}/*                 /:splat 302`);
	}

	lines.push(`
# External Redirects
/cla                                https://cla.js.foundation/eslint/eslint 302!
/conduct                            https://code-of-conduct.openjsf.org/ 302!
/chat/tsc-meetings                  https://discord.gg/3brqTzJ 302!
/chat/help                          https://discord.gg/Qj7tQuW6mB 302!
/chat/blog                          https://discord.gg/GrFKqSDkQ9 302!
/chat/developers                    https://discord.gg/JUhFAjbY6w 302!
/chat/eslint-community              https://discord.gg/B5T3PFZCtC 302!
/chat                               https://discord.gg/8szcydm 302!

# Internal Redirects
/demo/*                             /play/:splat 302!
`);

	if (locals.docs_latest) {
		lines.push(`
# Old-Style Docs to New-Style Docs
/docs/rules/*                       /docs/latest/rules/:splat 301!
/docs/user-guide/*                  /docs/latest/user-guide/:splat 301!
/docs/maintainer-guide/*            /docs/latest/maintainer-guide/:splat 301!
/docs/developer-guide/*             /docs/latest/developer-guide/:splat 301!

# Flat config redirects
/docs/latest/use/configure/configuration-files-new           /docs/latest/use/configure/configuration-files 302!

# Redirects for the ESLint IA Refactor (https://github.com/eslint/rfcs/pull/97)
/docs/latest/user-guide/                                     /docs/latest/use/ 301!
/docs/latest/user-guide/core-concepts                        /docs/latest/use/core-concepts 301!
/docs/latest/user-guide/configuring/                         /docs/latest/use/configure/ 301!
/docs/latest/user-guide/configuring/configuration-files-new  /docs/latest/use/configure/configuration-files-new 301!
/docs/latest/user-guide/configuring/configuration-files      /docs/latest/use/configure/configuration-files 301!
/docs/latest/user-guide/configuring/language-options         /docs/latest/use/configure/language-options 301!
/docs/latest/user-guide/configuring/rules                    /docs/latest/use/configure/rules 301!
/docs/latest/user-guide/configuring/plugins                  /docs/latest/use/configure/plugins 301!
/docs/latest/user-guide/configuring/ignoring-code            /docs/latest/use/configure/ignore 301!
/docs/latest/user-guide/command-line-interface               /docs/latest/use/command-line-interface 301!
/docs/latest/user-guide/formatters/                          /docs/latest/use/formatters/ 301!
/docs/latest/user-guide/integrations                         /docs/latest/use/integrations 301!
/docs/latest/user-guide/migrating-to-8.0.0                   /docs/latest/use/migrate-to-8.0.0 301!
/docs/latest/developer-guide/architecture/                   /docs/latest/contribute/architecture/ 301!
/docs/latest/developer-guide/source-code                     /docs/latest/contribute/development-environment 301!
/docs/latest/contribute/source-code                          /docs/latest/contribute/development-environment 301!
/docs/latest/developer-guide/development-environment         /docs/latest/contribute/development-environment 301!
/docs/latest/developer-guide/unit-tests                      /docs/latest/contribute/tests 301!
/docs/latest/developer-guide/working-with-rules              /docs/latest/extend/custom-rules 301!
/docs/latest/developer-guide/working-with-plugins            /docs/latest/extend/plugins 301!
/docs/latest/developer-guide/working-with-custom-formatters  /docs/latest/extend/custom-formatters 301!
/docs/latest/developer-guide/working-with-custom-parsers     /docs/latest/extend/custom-parsers 301!
/docs/latest/developer-guide/working-with-rules-deprecated   /docs/latest/extend/custom-rules-deprecated 301!
/docs/latest/developer-guide/code-path-analysis              /docs/latest/extend/code-path-analysis 301!
/docs/latest/developer-guide/scope-manager-interface         /docs/latest/extend/scope-manager-interface 301!
/docs/latest/developer-guide/selectors                       /docs/latest/extend/selectors 301!
/docs/latest/developer-guide/shareable-configs               /docs/latest/extend/shareable-configs 301!
/docs/latest/developer-guide/nodejs-api                      /docs/latest/integrate/nodejs-api 301!
/docs/latest/developer-guide/code-conventions                /docs/latest/contribute/code-conventions 301!
/docs/latest/developer-guide/package-json-conventions        /docs/latest/contribute/package-json-conventions 301!
/docs/latest/developer-guide/contributing/                   /docs/latest/contribute/ 301!
/docs/latest/developer-guide/contributing/reporting-bugs     /docs/latest/contribute/report-bugs 301!
/docs/latest/developer-guide/contributing/new-rules          /docs/latest/contribute/propose-new-rule 301!
/docs/latest/developer-guide/contributing/rule-changes       /docs/latest/contribute/propose-rule-change 301!
/docs/latest/developer-guide/contributing/changes            /docs/latest/contribute/request-change 301!
/docs/latest/developer-guide/contributing/working-on-issues  /docs/latest/contribute/work-on-issue 301!
/docs/latest/developer-guide/contributing/pull-requests      /docs/latest/contribute/pull-requests 301!
/docs/latest/maintainer-guide/                               /docs/latest/maintain/ 301!
/docs/latest/maintainer-guide/issues                         /docs/latest/maintain/manage-issues 301!
/docs/latest/maintainer-guide/pullrequests                   /docs/latest/maintain/review-pull-requests 301!
/docs/latest/maintainer-guide/releases                       /docs/latest/maintain/manage-releases 301!
/docs/latest/maintainer-guide/working-groups                 /docs/latest/maintain/working-groups   301!
/docs/latest/maintainer-guide/governance                     /docs/latest/contribute/governance 301!
/docs/latest/user-guide/configuring/*                        /docs/latest/use/configure/:splat 301!
/docs/latest/user-guide/*                                    /docs/latest/use/:splat 301!
/docs/latest/developer-guide/*                               /docs/latest/extend/:splat 301!
/docs/latest/maintainer-guide/*                              /docs/latest/maintain/:splat 301!

# Regular Docs
/docs/latest/*                      https://${locals.docs_latest}/:splat 200!
/docs/                              /docs/latest/ 301!
`);
	} else {
		lines.push(`
# Redirect docs back to English site
/docs/*                             https://eslint.org/docs/:splat 302!
`);
	}

	lines.push(`
# Docs checked into main branch but not released
/docs/head/*                        ${
		locals.docs_head
			? `https://${locals.docs_head}/:splat 200!`
			: "https://eslint.org/docs/head/:splat 302!"
	}

# Docs for the latest v8.x
/docs/v8.x/*                        ${
		locals.docs_v8
			? `https://${locals.docs_v8}/:splat 200!`
			: "https://eslint.org/docs/v8.x/:splat 302!"
	}

# Docs for the latest v9.x
/docs/v9.x/*                        ${
		locals.docs_v9
			? `https://${locals.docs_v9}/:splat 200!`
			: "https://eslint.org/docs/v9.x/:splat 302!"
	}

# Docs for the latest v10.x
# Redirect to latest docs while v10.x is the latest release
/docs/v10.x/*                        https://eslint.org/docs/latest/:splat 302!

# Docs for the current prerelease
# As there is currently no active prerelease, redirect to latest docs
/docs/next/*                        https://eslint.org/docs/latest/:splat 302!
`);

	if (locals.blog === false) {
		lines.push(`
# Redirect blog back to English site
/blog/*                             https://eslint.org/blog/:splat 302!
`);
	}

	if (locals.version_support === false) {
		lines.push(`
# Redirect version support page back to English site
/version-support/                 https://eslint.org/version-support/ 302!
`);
	}

	return lines.join("\n");
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Creates the integration.
 * @param {Object} site The site data of the default locale.
 * @param {Array<{locale: string, hostname: string}>} translations The
 *      other locales and the domains they used to be hosted on.
 * @returns {import("astro").AstroIntegration} The integration.
 */
export default function netlifyRedirects(site, translations) {
	return {
		name: "eslint-netlify-redirects",
		hooks: {
			async "astro:build:done"({ dir, logger }) {
				await fs.writeFile(
					new URL("_redirects", dir),
					createRedirects(site, translations),
					"utf8",
				);
				logger.info("Generated _redirects");
			},
		},
	};
}
