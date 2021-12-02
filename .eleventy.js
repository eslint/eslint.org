const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginTOC = require('eleventy-plugin-nesting-toc');
const readingTime = require('eleventy-plugin-reading-time');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const moment = require("moment");

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
    /* order collection by the order specified in the front matter (useful for course content)
       hat tip: https://www.martinjc.com/blog/posts/2020-10-19-course-notes-with-eleventy/ */
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
        return DateTime.fromISO(ISODate).toUTC().toLocaleString(DateTime.DATE_MED);
    });

    eleventyConfig.addFilter("past", function(date) {
        var todayDate = moment();
        postDate = moment(date, "YYYY-MM-DD");
        return todayDate.isAfter(postDate);
    });
    eleventyConfig.addFilter("future", function(date) {
        var todayDate = moment();
        postDate = moment(date, "YYYY-MM-DD");
        return !todayDate.isAfter(postDate);
    });

    // squash. Source: https://github.com/philhawksworth/hawksworx.com/blob/8c96ba2541c8fd6fe6f521cdb5e17848c231636c/src/site/_filters/squash.js
    // info: https://www.hawksworx.com/blog/adding-search-to-a-jamstack-site/
    eleventyConfig.addFilter("squash", function(text) {
        var content = new String(text);

        // all lower case, please
        var content = content.toLowerCase();

        // remove all html elements and new lines
        var re = /(&lt;.*?&gt;)/gi;
        var plain = unescape(content.replace(re, ''));

        // remove duplicated words
        var words = plain.split(' ');
        var deduped = [...(new Set(words))];
        var dedupedStr = deduped.join(' ')

        // remove short and less meaningful words
        var result = dedupedStr.replace(/\b(\.|\,|the|a|an|and|am|you|I|to|if|of|off|me|my|on|in|it|is|at|as|we|do|be|has|but|was|so|no|not|or|up|for)\b/gi, '');
        //remove newlines, and punctuation
        result = result.replace(/\.|\,|\?|-|—|\n/g, '');
        //remove repeated spaces
        result = result.replace(/[ ]{2,}/g, ' ');

        return result;
    })

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
    eleventyConfig.addPlugin(pluginTOC, {
        tags: ['h2', 'h3', 'h4'],
        wrapper: 'nav', // Element to put around the root `ol`
        wrapperClass: 'c-toc', // Class for the element around the root `ol`
        headingText: '', // Optional text to show in heading above the wrapper element
        headingTag: 'h2' // Heading tag when showing heading above the wrapper element
    });
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

    eleventyConfig.addCollection("blog", function(collection) {
        return collection.getFilteredByGlob("./src/content/blog/**/*.md").filter((item) => {
            return !item.data.draft && item.date <= now;
        }).reverse();
    });

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
