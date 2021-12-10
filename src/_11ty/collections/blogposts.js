const {
    DateTime
} = require("luxon");

module.exports = (collection) => {

    let now = new Date();

  return collection.getFilteredByGlob("./src/content/blog/*.md").filter((item) => {
            return !item.data.draft && item.date <= now;
        }).reverse();
};
