function eslintSource(eslint, config) {
    return view => {
        const { state } = view;
        const messages = eslint.verify(state.doc.toString(), config);

        return messages.map(message => {
            const startLine = state.doc.line(message.line);
            const from = startLine.from + message.column - 1;

            let to = from;

            if (message.endLine && message.endColumn) {
                const endLine = state.doc.line(message.endLine);
                to = endLine.from + message.endColumn - 1;
            } else {
                to = Math.min(from + 1, state.doc.length);
            }

            const diagnostic = {
                from,
                to,
                message: message.message,
                source: message.ruleId
                    ? `eslint:${message.ruleId}`
                    : "eslint",
                severity: message.severity === 1 ? "warning" : "error",
            };

            if (message.fix) {
                const { range, text } = message.fix;

                diagnostic.actions = [
                    {
                        name: "fix",
                        apply(editorView) {
                            editorView.dispatch({
                                changes: {
                                    from: range[0],
                                    to: range[1],
                                    insert: text,
                                },
                                scrollIntoView: true,
                            });
                        },
                    },
                ];
            }

            return diagnostic;
        });
    };
}

export { eslintSource };