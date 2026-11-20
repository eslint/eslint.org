import { useImperativeHandle, useMemo, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript, esLint } from "@codemirror/lang-javascript";
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
}) {
	const editorRef = useRef(null);

	const extensions = useMemo(
		() => [
			linter(esLint(eslintInstance, eslintOptions), { delay: 0 }),
			javascript({
				typescript: true,
				jsx: Boolean(
					eslintOptions.languageOptions.parserOptions.ecmaFeatures
						.jsx,
				),
			}),
			foldGutterExtension,
			ESLintPlaygroundTheme,
			ESLintPlaygroundHighlightStyle,
		],
		[eslintOptions, eslintInstance],
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
