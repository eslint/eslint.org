---
layout: main.html
permalink: /branding/
eleventyExcludeFromCollections: true
hook: "branding-page"
---

{%- from 'components/swatch.macro.html' import swatch %}

<section class="section hero">
    <div class="content-container grid">
        <div class="span-1-7 content-container">
            <h1 class="section-title">Branding</h1>
            <p class="section-supporting-text">
                How to use our logo
            </p>
        </div>
        <div class="span-11-12">
                {% include "partials/carbon-ad.html" %}
        </div>
    </div>
</section>

<section class="section">
    <div class="content-container grid">
        <div class="span-1-6">
            <h2 class="section-title h3">Name</h2>
            <p class="">
                ESLint must be written with a capital E, S and L when used, as “ES” stands for ECMAScript and “L” being the start of the world “Lint”.
            </p>
        </div>
    </div>
    <div class="content-container grid">
        <div class="span-1-6">
            <h2 class="section-title h3">Logo</h2>
            <p class="">
                The ESLint logo can be placed on various backgrounds, provided it has enough vertical and horizontal padding.
            </p>
            <p>
                Double the size of the inner hexagon created by the gap to get an idea how much space the logo should have between the logo and wordmark, as well as around the logo itself.
            </p>
            <p>
                Our logo is versatile - you can use it on various brand colours, making use of opacity on non-white backgrounds to emulate the lighter colour.
                The ESLint logomark can also be used in isolation, without the ESLint wordmark though where possible, using both is preferred
            </p>
            <div class="eslint-actions">
                <a download href="../../assets/images/logo/eslint-logo-color.svg" class="c-btn c-btn--secondary">Download SVG</a>
                <a download href="../../assets/images/logo/eslint-logo-color.png" class="c-btn c-btn--secondary">Download PNG</a>
            </div>
        </div>
        <div class="span-8-12">
            {% include 'partials/branding-logo.html' %}
        </div>
    </div>
    <div class="content-container grid">
        <div class="span-1-6">
            <h2 class="section-title h3">Color Palette</h2>
            <p class="">
                ESLint’s colour palette can speak to our brand in ways that are every bit as powerful as copy and logos. They not only affect how our design looks, but can go as far as to elicit emotion and reflect the personality of the ESLint brand.
            </p>
            <p>
                The primary "brand" color is used across all interactive elements such as buttons, links, inputs, etc. It is derived from our logo. We use the two existing colours to create a unique primary tonal range.
            </p>
        </div>
        <div class="span-8-12">
            <div class="brand__palette">
                {% include 'partials/brand-swatches.html' %}
            </div>
        </div>
    </div>
</section>
