const getCollectionCategories = require("../libs/getCollectionCategories.js");
const paginateCollectionByCategories = require("../libs/paginateCollectionByCategories");

module.exports = function (collection) {
  // number of items per page
  const itemsPerPage = 2;
  // target collection
  const blogposts = collection.getFilteredByGlob(
    "./src/content/blog/*.md"
  ).reverse();
  // unique categories in target collection
  const blogpostsCategories = getCollectionCategories(blogposts);
  // paginated collection by categories
  return paginateCollectionByCategories(
    blogposts,
    blogpostsCategories,
    itemsPerPage
  );
};
