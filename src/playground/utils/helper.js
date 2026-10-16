function getRuleDocumentationUrl(ruleName) {
    if (!ruleName) {
        return null;
    }

    if (ruleName.includes("/")) {
        const [pluginName, pluginRuleId] = ruleName.split("/");

        return `https://github.com/eslint/${pluginName}/blob/main/docs/rules/${pluginRuleId}.md`;
    }

    return `https://eslint.org/docs/latest/rules/${ruleName}`;
}

export { getRuleDocumentationUrl };