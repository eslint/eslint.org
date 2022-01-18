const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const readingTime = require('eleventy-plugin-reading-time');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginTOC = require('eleventy-plugin-nesting-toc');
const slugify = require("slugify");
const markdownIt = require("markdown-it");
const markdownItAnchor = require('markdown-it-anchor');
const Image = require("@11ty/eleventy-img");
const fetch = require("node-fetch");


// const metascraper = require('metascraper')([
//   require('metascraper-image')(),
//   require('metascraper-logo')(),
//   require('metascraper-publisher')(),
//   require('metascraper-title')(),
//   require('metascraper-url')()
// ])

// const got = require('got');

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
    });

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

    eleventyConfig.addFilter('URIencode', function(str) {
        if (!str) {
            return;
        }
        return encodeURI(str);
    });

    /* order collection by the order specified in the front matter */
    eleventyConfig.addFilter("sortByPageOrder", function(values) {
        return values.slice().sort((a, b) => a.data.order - b.data.order);
    });

    eleventyConfig.addFilter("readableDate", (dateObj) => {
        //turn it into a JS Date string
        date = new Date(dateObj);
        //pass it to luxon for formatting
        return DateTime.fromJSDate(date).toFormat('dd MMM, yyyy');
    });

    eleventyConfig.addFilter("blogPermalinkDate", (dateObj) => {
        //turn it into a JS Date string
        date = new Date(dateObj);
        //pass it to luxon for formatting
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
    eleventyConfig.addPlugin(syntaxHighlight, {
        alwaysWrapLineHighlights: true,
    });
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

    eleventyConfig.setLibrary("md",
        markdownIt({
            html: true,
            linkify: true,
            typographer: true,

        }).use(markdownItAnchor, {}).disable('code')
    );


    eleventyConfig.addWatchTarget("./src/assets/");

    /*****************************************************************************************
     *  Shortcodes
     * ***************************************************************************************/

    eleventyConfig.addNunjucksShortcode("resource", function(url) {
        const encodedURL = encodeURIComponent(url);
        const the_url = (new URL(url)); // same as url
        const domain = the_url.hostname;
        const encodedDomain = encodeURIComponent(domain);
        // const stripped_domain = domain.replace('www.','');
        const avatar = `https://v1.indieweb-avatar.11ty.dev/${encodedURL}`;
        const img = `<img class="resource__img" style="object-fit: cover;" src="${avatar}" width="75" height="75" lazyload="true" alt="Avatar image for ${ domain } " decoding="async"/>`;

        // const getTitle = (url) => {
        // return fetch(url)
        //     .then((response) => response.text())
        //     .then((html) => {
        //     const doc = new DOMParser().parseFromString(html, "text/html");
        //     const title = doc.querySelectorAll('title')[0];
        //     return title.innerText;
        //     });
        // };

        // const title = getTitle(url);

        return `
        <article class="resource">${ img }
            <div class="resource__content">
                <a href="${url}" class="resource__title"> title here </a><br>
                <span class="resource__domain"> ${ domain }</span>
            </div>
            <svg class="c-icon resource__icon" width="13" height="12" viewBox="0 0 13 12" fill="none">
            <path d="M1.5 11L11.5 1M11.5 1H1.5M11.5 1V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </article>`;

        // return img;
    });

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

    eleventyConfig.addCollection("docs", function(collection) {
        return collection.getFilteredByGlob("./src/content/docs/**/**/*.md");
    });


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
