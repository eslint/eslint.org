import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { history } from "@codemirror/history";
import { bracketMatching } from "@codemirror/matchbrackets";
import { javascript, esLint } from "@codemirror/lang-javascript";
import { linter } from "../utils/codemirror-linter-extension";
import { ESLintPlaygroundTheme, ESLintPlaygroundHighlightStyle } from "../utils/codemirror-theme";
import { Linter as ESLint } from "../node_modules/eslint/lib/linter/";
import "../scss/editor.scss";

export default function CodeEditor({ codeValue, onUpdate, eslintOptions }) {
    return (
        <CodeMirror
            value={codeValue}
            minWidth="100%"
            height="100%"
            extensions={
                [
                    history(),
                    bracketMatching(),
                    linter(esLint(new ESLint(), eslintOptions), { delay: 0 }),
                    javascript(),
                    ESLintPlaygroundTheme,
                    ESLintPlaygroundHighlightStyle
                ]
            }
            onChange={value => {
                onUpdate(value);
            }}
        />
    );
}
