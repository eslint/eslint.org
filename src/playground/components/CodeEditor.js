import React, { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { history } from "@codemirror/history";
import { bracketMatching } from "@codemirror/matchbrackets";
import { javascript, esLint } from "@codemirror/lang-javascript";
import { linter } from "../utils/codemirror-linter-extension";
import { ESLintPlaygroundTheme, ESLintPlaygroundHighlightStyle } from "../utils/codemirror-theme";
import "../scss/editor.scss";

export default function CodeEditor({ codeValue, onUpdate, eslintOptions, eslintInstance }) {
    const extensions = useMemo(() => [
        history(),
        bracketMatching(),
        linter(esLint(eslintInstance, eslintOptions), { delay: 0 }),
        javascript(),
        ESLintPlaygroundTheme,
        ESLintPlaygroundHighlightStyle
    ], [eslintOptions, eslintInstance]);

    return (
        <CodeMirror
            value={codeValue}
            minWidth="100%"
            height="100%"
            extensions={
                extensions
            }
            onChange={value => {
                onUpdate(value);
            }}
        />
    );
}
