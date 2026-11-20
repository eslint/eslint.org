/**
 * @fileoverview The Markdown renderers used for blog posts and author bios.
 *
 * Blog posts are rendered with markdown-it (rather than Astro's built-in
 * Markdown support) so that the generated markup, heading IDs, and syntax
 * highlighting of the hundreds of existing posts stay exactly the same.
 */

/*
 * The line number plugin is modified from
 * https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/lineNumbers.ts
 *
 * MIT License
 *
 * Copyright (c) 2019-present, Yuxi (Evan) You
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/** @typedef {import("markdown-it").default} MarkdownIt */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

// code blocks in these languages are plain text, so there's nothing to highlight
const PLAIN_TEXT_LANGUAGES = new Set(["text", "txt", "plain", "plaintext"]);

/**
 * Highlights the code in a code block.
 * @param {MarkdownIt} md markdown-it
 * @param {string} str code
 * @param {string} lang code language
 * @returns {string} highlighted result wrapped in pre
 */
function highlight(md, str, lang) {
	let result;

	if (lang && !PLAIN_TEXT_LANGUAGES.has(lang)) {
		try {
			loadLanguages([lang]);
			result = Prism.highlight(str, Prism.languages[lang], lang);
		} catch (err) {
			// eslint-disable-next-line no-console -- Reports languages Prism doesn't support
			console.log(lang, err);

			// we still want to wrap the result later
			result = md.utils.escapeHtml(str);
		}
	} else {
		result = md.utils.escapeHtml(str);
	}

	return `<pre class="language-${lang}"><code>${result}</code></pre>`;
}

/**
 * Adds line numbers to code blocks.
 * @param {MarkdownIt} md markdown-it
 * @returns {void}
 */
function lineNumberPlugin(md) {
	const fence = md.renderer.rules.fence;

	md.renderer.rules.fence = (...args) => {
		const [tokens, idx] = args;
		const lang = tokens[idx].info.trim();
		const rawCode = fence(...args);
		const code = rawCode.slice(
			rawCode.indexOf("<code>"),
			rawCode.indexOf("</code>"),
		);
		const lines = code.split("\n");
		const lineNumbersCode = [...Array(lines.length - 1)]
			.map(
				(line, index) =>
					`<span class="line-number">${index + 1}</span><br>`,
			)
			.join("");

		const lineNumbersWrapperCode = `<div class="line-numbers-wrapper" aria-hidden="true">${lineNumbersCode}</div>`;

		const finalCode = rawCode
			.replace(/<\/pre>\n/u, `${lineNumbersWrapperCode}</pre>`)
			.replace(/"(language-\S*?)"/u, '"$1 line-numbers-mode"')
			.replace(/<code>/u, `<code class="language-${lang}">`);

		return finalCode;
	};
}

/**
 * Wraps code blocks in a container and adds a copy button.
 * @param {MarkdownIt} md markdown-it
 * @returns {void}
 */
function preWrapperPlugin(md) {
	const defaultFenceRenderer = md.renderer.rules.fence;

	md.renderer.rules.fence = (...args) => `
<div class="code-wrapper">
    ${defaultFenceRenderer(...args)}
    <button class="copy-btn" aria-labelledby="copy-button-label">
        <span hidden id="copy-button-label">Copy code to clipboard</span>
        <svg width="20" height="20" viewBox="0 0 20 20" role="img" aria-label="copy" fill="none" focusable="false">
            <path d="M4.16667 12.5H3.33333C2.89131 12.5 2.46738 12.3244 2.15482 12.0118C1.84226 11.6993 1.66667 11.2754 1.66667 10.8333V3.33332C1.66667 2.8913 1.84226 2.46737 2.15482 2.15481C2.46738 1.84225 2.89131 1.66666 3.33333 1.66666H10.8333C11.2754 1.66666 11.6993 1.84225 12.0118 2.15481C12.3244 2.46737 12.5 2.8913 12.5 3.33332V4.16666M9.16667 7.49999H16.6667C17.5871 7.49999 18.3333 8.24618 18.3333 9.16666V16.6667C18.3333 17.5871 17.5871 18.3333 16.6667 18.3333H9.16667C8.24619 18.3333 7.5 17.5871 7.5 16.6667V9.16666C7.5 8.24618 8.24619 7.49999 9.16667 7.49999Z" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    </button>
</div>
`;
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * The Markdown renderer used for blog posts.
 */
export const blogMarkdown = markdownIt({
	html: true,
	linkify: true,
	typographer: true,
	highlight: (str, lang) => highlight(blogMarkdown, str, lang),
})
	.use(markdownItAnchor, {})
	.use(preWrapperPlugin, {})
	.use(lineNumberPlugin)
	.disable("code");

/**
 * The Markdown renderer used for small snippets, such as author bios.
 */
export const snippetMarkdown = markdownIt({
	html: true,
});
