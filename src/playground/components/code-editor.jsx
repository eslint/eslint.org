import { useImperativeHandle, useMemo, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript, esLint } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";
import { foldGutter } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { linter } from "../utils/codemirror-linter-extension";
import {
	ESLintPlaygroundTheme,
	ESLintPlaygroundHighlightStyle,
} from "../utils/codemirror-theme";
import "../scss/editor.scss";

const foldGutterExtension = foldGutter({
	closedText: "▸",
	openText: "▾",
});

const basicSetup = {
	foldGutter: false,
};

export default function CodeEditor({
	codeValue,
	onUpdate,
	eslintOptions,
	eslintInstance,
	ref,
	selectedLanguage,
}) {
	const editorRef = useRef(null);

	const languageExtension = useMemo(() => {
		switch (selectedLanguage) {
			case "javascript":
				return javascript({
					jsx: Boolean(
						eslintOptions.languageOptions.parserOptions.ecmaFeatures
							.jsx,
					),
				});
			case "typescript":
				return javascript({
					typescript: true,
					jsx: Boolean(
						eslintOptions.languageOptions.parserOptions.ecmaFeatures
							.jsx,
					),
				});
			case "css":
				return css();
			case "markdown":
				return markdown();
			case "json":
				return json();
			default:
				return javascript({
					typescript: true,
					jsx: Boolean(
						eslintOptions.languageOptions.parserOptions.ecmaFeatures
							.jsx,
					),
				});
		}
	}, [selectedLanguage, eslintOptions]);

	const extensions = useMemo(
		() => [
			linter(esLint(eslintInstance, eslintOptions), { delay: 0 }),
			languageExtension,
			foldGutterExtension,
			ESLintPlaygroundTheme,
			ESLintPlaygroundHighlightStyle,
		],
		[eslintOptions, eslintInstance, languageExtension],
	);

	useImperativeHandle(ref, () => ({
		scrollToPosition(line, col) {
			const editorView = editorRef.current.view;
			const { state } = editorView;
			const pos = state.doc.line(line).from + col;

			editorView.dispatch({
				selection: { anchor: pos },
				effects: EditorView.scrollIntoView(pos, { y: "center" }),
			});

			editorView.focus();
		},
	}));

	return (
		<CodeMirror
			value={codeValue}
			minWidth="100%"
			height="100%"
			ref={editorRef}
			extensions={extensions}
			onChange={value => {
				onUpdate(value);
			}}
			basicSetup={basicSetup}
		/>
	);
}
