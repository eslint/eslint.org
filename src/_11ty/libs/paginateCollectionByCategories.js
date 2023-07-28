const lodash = require("lodash");

/**
 * Returns a chunked array of objects representing
 * categories with posts in each object
 * @param {Array} collection the collection to use
 * @param {Array} collectionCategories the unique categories in that collection
 * @param {Number} itemsPerPage the number of items you want per page
 * @returns {Array} - array of objects
 *
 * Returned data structure:
 *
 * - itemsPerPage is 2
 * - there are 2 items in the travel category
 * - there are 3 items in the code category
 *
 * [
 *   {
 *     title: "travel",
 *     slug: "travel"
 *     currentPage: 1,
 *     totalItems: 2,
 *     totalPages: 1,
 *     items: [{ Object }, { Object }]
 *     slugs: {
 *       all: [Array],
 *       first: travel,
 *       last: travel,
 *       next: null,
 *       previous: null,
 *     }
 *   },
 *   {
 *     title: "code",
 *     slug: "code"
 *     currentPage: 1,
 *     totalItems: 3,
 *     totalPages: 2,
 *     items: [{ Object }, { Object }]
 *     slugs: {
 *       all: [Array],
 *       first: code,
 *       last: code/2,
 *       next: code/2,
 *       previous: null,
 *     }
 *   },
 *   {
 *     title: "code",
 *     slug: "code/2"
 *     currentPage: 2,
 *     totalItems: 3,
 *     totalPages: 2,
 *     items: [{ Object }],
 *     slugs: {
 *       all: [Array],
 *       first: code,
 *       last: code/2,
 *       next: null,
 *       previous: code,
 *     }
 *   }
 * ]
 */
module.exports = (collection, collectionCategories, itemsPerPage) => {
  // create empty array
  const paginatedCollectionByCategories = [];

  // walk unique categories
  collectionCategories.forEach((category) => {
    // get posts in category
    const postsInCategory = collection.filter((item) =>
      item.data.categories.includes(category.title)
    );

    // chunk posts in category to create pages
    const chunkedCollection = lodash.chunk(postsInCategory, itemsPerPage);

    // create array of slugs
    const slugs = [];
    for (let i = 1; i <= chunkedCollection.length; i++) {
      let slug = `${category.slug}/${i}`;
      if (i === 1) {
        slug = category.slug;
      }

      slugs.push(slug);
    }

    // add formatted objects to empty array
    chunkedCollection.forEach((items, index) => {
      paginatedCollectionByCategories.push({
        title: category.title,
        slug: slugs[index],
        currentPage: index + 1,
        totalItems: postsInCategory.length,
        totalPages: Math.ceil(postsInCategory.length / itemsPerPage),
        items: items,
        hrefs: {
          all: slugs,
          first: slugs[0],
          last: slugs[slugs.length - 1],
          next: slugs[index + 1] ?? null,
          previous: slugs[index - 1] ?? null,
        },
      });
    });
  });

  // return array of objects
  return paginatedCollectionByCategories;
};
