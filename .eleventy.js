const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const readingTime = require('eleventy-plugin-reading-time');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginTOC = require('eleventy-plugin-nesting-toc');
const slugify = require("slugify");
const markdownIt = require("markdown-it");
const markdownItAnchor = require('markdown-it-anchor');
const Image = require("@11ty/eleventy-img");
const metascraper = require('metascraper')([
    require('metascraper-image')(),
    require('metascraper-logo')(),
    require('metascraper-logo-favicon')(),
    require('metascraper-publisher')(),
    require('metascraper-title')(),
    require('metascraper-description')(),
    require('metascraper-url')()
]);
const got = require('got');
const path = require('path');

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
        const date = new Date(dateObj);
        //pass it to luxon for formatting
        return DateTime.fromJSDate(date).toFormat('dd MMM, yyyy');
    });

    eleventyConfig.addFilter("blogPermalinkDate", (dateObj) => {
        //turn it into a JS Date string
        const date = new Date(dateObj);
        //pass it to luxon for formatting
        return DateTime.fromJSDate(dateObj).toFormat('yyyy/MM');
    });

    eleventyConfig.addFilter("shortDateFromISO", isoDate => {
        return DateTime.fromISO(isoDate).toFormat('d MMM');
    });

    eleventyConfig.addFilter("shortNumber", number => {

        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + "M";
        }

        if (number >= 1000) {
            return (number / 1000).toFixed(1) + "K";
        }

        return number.toString();
    });

    eleventyConfig.addFilter("readableDateFromISO", (isoDate) => {
        return DateTime.fromISO(isoDate).toUTC().toLocaleString(DateTime.DATE_FULL);
    });

    eleventyConfig.addFilter('dollars', value => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(value);
    });

    // parse markdown from includes, used for author bios
    // Source: https://github.com/11ty/eleventy/issues/658
    eleventyConfig.addFilter('markdown', function(value) {
        let markdown = require('markdown-it')({
            html: true
        });
        return markdown.render(value);
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

    /**********************************************************************
     *  Shortcodes
     * ********************************************************************/
    eleventyConfig.addNunjucksAsyncShortcode("link", async function(link) {
        const { body: html, url } = await got(link);
        const metadata = await metascraper({ html, url });

        const encodedURL = encodeURIComponent(link);
        const the_url = (new URL(link)); // same as url
        const domain = the_url.hostname;

        return `
        <article class="resource">
            <div class="resource__image">
                <img class="resource__img" width="75" height="75" src="${metadata.logo}" alt="Avatar image for ${domain}" />
            </div>
            <div class="resource__content">
                <a href="${metadata.url}" class="resource__title"> ${metadata.title} </a><br>
                <span class="resource__domain"> ${domain}</span>
            </div>
            <svg class="c-icon resource__icon" width="13" height="12" viewBox="0 0 13 12" fill="none">
            <path d="M1.5 11L11.5 1M11.5 1H1.5M11.5 1V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </article>`;
    });


    /*****************************************************************************************
     *  File PassThroughs
     * ***************************************************************************************/

    eleventyConfig.addPassthroughCopy({
        "./src/static": "/"
    });

    eleventyConfig.addPassthroughCopy('./src/assets/');

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

    eleventyConfig.addPassthroughCopy({
        './src/content/**/*.mp4': "/assets/videos"
    });

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


    eleventyConfig.addCollection("library", function(collection) {
        return collection.getFilteredByGlob("./src/content/library/**/*.md");
    });

    // START, eleventy-img
    function imageShortcode(src, alt, cls, sizes = "(max-width: 768px) 100vw, 50vw") {
        const source = src;
        // console.log(`Generating image(s) from:  ${src}`)
        let options = {
            widths: [600, 900, 1500],
            formats: ["webp", "jpeg"],
            urlPath: "/assets/images/",
            outputDir: "./_site/assets/images/",
            filenameFormat: function(id, src, width, format, options) {
                const extension = path.extname(src)
                const name = path.basename(src, extension)
                return `${name}-${width}w.${format}`
            }
        }

        function getSRC() {
            if (source.indexOf("http://") == 0 || source.indexOf("https://") == 0) {
                return source;
            } else {
                // for convenience, you only need to use the image's name in the shortcode,
                // and this will handle appending the full path to it
                src = path.join('./src/assets/images/', source);
                return src;
            }
        }

        var fullSrc = getSRC();
        // generate images
        Image(fullSrc, options)

        let imageAttributes = {
            alt,
            class: cls,
            sizes,
            loading: "lazy",
            decoding: "async",
        }
        // get metadata
        metadata = Image.statsSync(fullSrc, options)
        return Image.generateHTML(metadata, imageAttributes)
    }
    eleventyConfig.addShortcode("image", imageShortcode)
    // END, eleventy-img


    return {
        passthroughFileCopy: true,

        markdownTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',

        dir: {
            input: "src",
            includes: "_includes",
            layouts: "_includes/layouts",
            data: "_data",
            output: "_site"
        }
    };
};
