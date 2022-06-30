const {
    DateTime
} = require("luxon");

module.exports = (collection) => {

    let now = new Date();
    const CONTEXT = process.env.CONTEXT;

    // for local development and deploy previews, show drafts
    const drafts = !CONTEXT || CONTEXT === "deploy-preview"
        ? collection.getFilteredByGlob("./src/content/drafts/*.md")
            .filter(item => !item.inputPath.includes("README.md"))
        : [];

    return drafts.concat(collection.getFilteredByGlob("./src/content/blog/*.md").filter((item) => {
        return !item.data.draft && item.date <= now;
    }).reverse());
};
