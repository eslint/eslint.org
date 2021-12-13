const slugify = require("slugify");

/**
 *
 * @param {Sring} str string to slugify
 * @returns slugified string
 */
const strToSlug = (str) => {
  const options = {
    replacement: "-",
    remove: /[&,+()$~%.'":*?<>{}]/g,
    lower: true,
  };

  return slugify(str, options);
};

/**
 * Returns array of categories for passed collection
 * @param {Array} collection
 * @returns {Array} categories
 */

module.exports = (collection) => {
  // get all used categories
  const collectionCategories = collection
    .flatMap((item) => item.data.categories)
    .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

  // dedupe
  const uniqueCategories = [...new Set(collectionCategories)];

  // format and return array of categories objects
  const categories = uniqueCategories.map((category) => {
    const postsInCategory = collection.filter((item) =>
      item.data.categories.includes(category)
    );
    return {
      title: category,
      slug: strToSlug(category),
      totalItems: postsInCategory.length,
    };
  });

  return categories;
};
