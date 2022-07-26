import { EditorView } from "@codemirror/view";
import { HighlightStyle, tags } from "@codemirror/highlight";

export const ESLintPlaygroundTheme = EditorView.theme({
    ".cm-tooltip": {
        backgroundColor: "transparent",
        border: "none"
    },
    ".cm-scroller": {
        backgroundColor: "var(--body-background-color)",
        minWidth: "100%",
        border: "1px solid var(--body-text-color)",
        fontVariantLigatures: "none",
        fontFamily: "var(--mono-font), Consolas, Monaco, \"Andale Mono\", \"Ubuntu Mono\", monospace",
        fontSize: "1em",
        color: "var(--body-text-color)"
    },
    ".cm-gutter": {
        paddingRight: "1px",
        backgroundColor: "var(--body-background-color)"
    },
    ".cm-activeLine, .cm-activeLineGutter": {
        backgroundColor: "var(--body-background-color)"
    },
    ".cm-content": {
        caretColor: "var(--link-color)"
    },
    "&.cm-focused .cm-matchingBracket": {
        backgroundColor: "var(--editor-bracket-match-background-color)",
        color: "var(--editor-bracket-match-color)",
        outline: "1px solid var(--editor-bracket-match-outline-color)"
    },
    "&.cm-focused .cm-nonmatchingBracket": {
        backgroundColor: "var(--editor-bracket-no-match-background-color)",
        color: "var(--editor-bracket-no-match-color)",
        outline: "1px solid var(--editor-bracket-no-match-outline-color)"
    },
    ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "var(--link-color)"
    },
    ".cm-gutters": {
        borderRight: "1px solid var(--body-text-color)"
    },
    ".cm-gutterElement": {
        color: "var(--body-text-color)"
    },
    ".cm-tooltip-autocomplete": {
        backgroundColor: "var(--color-neutral-800)",
        color: "#fff"
    },
    ".cm-completionIcon": {
        width: "1.2rem"
    }
}, { dark: true });

// The highlighting style for code in the ESLint playground theme.
export const ESLintPlaygroundHighlightStyle = HighlightStyle.define([
    {
        tag: tags.string,
        color: "var(--editor-string-color)"
    },
    {
        tag: tags.keyword,
        color: "var(--editor-keyword-color)",
        fontWeight: "bold"
    },
    {
        tag: [tags.lineComment, tags.blockComment],
        color: "var(--editor-comment-color)"
    },
    {
        tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName],
        color: "var(--editor-name-color)"
    },
    {
        tag: tags.strong,
        fontWeight: "bold"
    },
    {
        tag: tags.emphasis,
        fontStyle: "italic"
    },
    {
        tag: tags.strikethrough,
        textDecoration: "line-through"
    },
    {
        tag: tags.heading,
        fontWeight: "bold",
        color: "var(--headings-color)"
    }
]);

export const ESLintPlayground = [ESLintPlaygroundTheme, ESLintPlaygroundHighlightStyle];
