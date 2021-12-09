const getCollectionCategories = require("../libs/getCollectionCategories.js");

module.exports = (collection) => {
  // target collection
  const blogposts = collection.getFilteredByGlob(
    "./src/content/blog/*.md"
  ).reverse();
  // unique categories from target collection
  return getCollectionCategories(blogposts);
};
