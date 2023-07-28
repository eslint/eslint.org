const {
    DateTime
} = require("luxon");

module.exports = (collection) => {

    let now = new Date();
    const CONTEXT = process.env.CONTEXT;
    const showFuturePostsAndDrafts = !CONTEXT || CONTEXT === "deploy-preview";

    // for local development and deploy previews, show drafts
    const drafts = showFuturePostsAndDrafts
        ? collection.getFilteredByGlob("./src/content/drafts/*.md")
            .filter(item => !item.inputPath.includes("README.md"))
        : [];

    return drafts.concat(collection.getFilteredByGlob("./src/content/blog/*.md").filter((item) => {
        return showFuturePostsAndDrafts || (!item.data.draft && item.date <= now);
    }).reverse());
};
