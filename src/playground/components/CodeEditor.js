import React, { useImperativeHandle, useMemo, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript, esLint } from "@codemirror/lang-javascript";
import { linter } from "../utils/codemirror-linter-extension";
import {
	ESLintPlaygroundTheme,
	ESLintPlaygroundHighlightStyle,
} from "../utils/codemirror-theme";
import "../scss/editor.scss";

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

			// Set the cursor selection to the position
			editorView.dispatch({
				selection: { anchor: pos },
				scrollIntoView: true,
			});

			const linePos = editorView.coordsAtPos(state.doc.line(line).from);

			// Calculate to try to center the line in the editor
			if (linePos) {
				const editorRect = editorView.dom.getBoundingClientRect();
				const offset =
					linePos.top - editorRect.top - editorRect.height / 2;
				editorView.scrollDOM.scrollTop += offset;
			}

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
		/>
	);
}
