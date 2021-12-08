const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const readingTime = require('eleventy-plugin-reading-time');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const slugify = require("slugify");


const {
    DateTime
} = require("luxon");

module.exports = function(eleventyConfig) {
    let now = new Date();

    /*****************************************************************************************
     *  Filters
     * ***************************************************************************************/
    eleventyConfig.addFilter("limitTo", function(arr, limit) {
        return arr.slice(0, limit);
    } );

    eleventyConfig.addFilter('jsonify', function(variable) {
        return JSON.stringify(variable);
    });

    eleventyConfig.addFilter('slugify', function(str) {
        if (!str) {
            return;
        }

        return slugify(str, {
            lower: true,
            strict: true,
            remove: /["]/g,
        });
    });
    /* order collection by the order specified in the front matter */
    eleventyConfig.addFilter("sortByPageOrder", function(values) {
        return values.slice().sort((a, b) => a.data.order - b.data.order);
    });

    eleventyConfig.addFilter("readableDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toFormat('dd MMM, yyyy');
    });

    eleventyConfig.addFilter("blogPermalinkDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toFormat('yyyy/MM');
    });

    eleventyConfig.addFilter("readableDateFromISO", (ISODate) => {
        return DateTime.fromISO(ISODate).toUTC().toLocaleString(DateTime.DATE_FULL);
    });

    eleventyConfig.addFilter('dollars', value => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(value);
    });

    /*****************************************************************************************
     *  Plugins
     * ***************************************************************************************/
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(readingTime);
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(pluginRss);
    // add IDs to the headers
    const markdownIt = require('markdown-it');
    const markdownItAnchor = require('markdown-it-anchor');
    eleventyConfig.setLibrary("md",
        markdownIt({
            html: true,
            linkify: true,
            typographer: true,
        }).use(markdownItAnchor, {})
    );


    eleventyConfig.addWatchTarget("./src/assets/");

    /*****************************************************************************************
     *  File PassThroughs
     * ***************************************************************************************/
    // take everything in the static/ directory and copy it to the root of your build directory (e.g. static/favicon.svg to _site/favicon.svg).
    eleventyConfig.addPassthroughCopy({
        "./src/static": "/"
    });
    // copy all assets
    eleventyConfig.addPassthroughCopy('./src/assets/');
    // copy all images inside individual post folders into the _site/assets/images folder
    eleventyConfig.addPassthroughCopy({
        './src/content/**/*.png': "/assets/images"
    });
    eleventyConfig.addPassthroughCopy({
        './src/content/**/*.jpg': "/assets/images"
    });
    eleventyConfig.addPassthroughCopy({
        './src/content/**/*.jpeg': "/assets/images"
    });
    eleventyConfig.addPassthroughCopy({
        './src/content/**/*.svg': "/assets/images"
    });
    // copy all videos inside individual post folders into a _site/assets/videos folder
    eleventyConfig.addPassthroughCopy({
        './src/content/**/*.mp4': "/assets/videos"
    });
    // copy all documents inside individual post folders into the _site/assets/documents folder
    eleventyConfig.addPassthroughCopy({
        './src/content/**/*.pdf': "/assets/documents"
    });


    /*****************************************************************************************
     *  Collections
     * ***************************************************************************************/

    eleventyConfig.addCollection(
        "blogposts",
        require("./src/_11ty/collections/blogposts.js")
    );

    // blogposts unique categories
    eleventyConfig.addCollection(
        "blogCategories",
        require("./src/_11ty/collections/blogpostsCategories.js")
    );

    // blogposts by categories
    eleventyConfig.addCollection(
        "blogpostsByCategories",
        require("./src/_11ty/collections/blogpostsByCategories.js")
    );

    /*****************************************************************************************
     *  Shortcodes
     * ***************************************************************************************/



    return {
        // When a passthrough file is modified, rebuild the pages:
        passthroughFileCopy: true,

        // tell Eleventy that markdown files, data files and HTML files should be processed by Nunjucks. That means that we can now use .html files instead of having to use .njk files
        markdownTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',

        // Set custom directories for input, output, includes, and data
        // These are the defaults. You'll need to restart your dev server for any changes in this file to take effect.
        dir: {
            input: "src",
            includes: "_includes",
            layouts: "_includes/layouts",
            data: "_data",
            output: "_site"
        }
    };
};
