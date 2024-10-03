module.exports = collection => {
	let now = new Date();
	const CONTEXT = process.env.CONTEXT;
	const showDrafts = !CONTEXT || CONTEXT === "deploy-preview";

	// for local development and deploy previews, show drafts
	const drafts = showDrafts
		? collection
				.getFilteredByGlob("./src/content/drafts/*.md")
				.filter(item => !item.inputPath.includes("README.md"))
		: [];

	return drafts.concat(
		collection
			.getFilteredByGlob("./src/content/blog/*.md")
			.filter(item => {
				return showDrafts || !item.data.draft;
			})
			.reverse(),
	);
};
