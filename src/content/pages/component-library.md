---
layout: components.html
permalink: /component-library/index.html
hook: "component-library"
---

{% from 'components/_component.njk' import component %}


{% from 'components/related-rules.macro.html' import related_rules %}
{% from 'components/profile.macro.html' import member, contributor, post_author %}

{% from 'components/alert.macro.html' import warning, tip, important %}
{% from 'components/rule-categories.macro.html' import ruleCategories, recommended, fixable, hasSuggestions %}
{% from 'components/rule.macro.html' import rule %}


<div class="content-container grid">
    <div class="span-1-6">
        <h2>Link Card View</h2>
        Links can be rendered as cards by using the `link` shortcode. The only required parameter is the URL you wish to scrape for metadata.
    </div>
    <div class="span-7-12">
        {% link "https://developer.mozilla.org/en-US/docs/Web/JavaScript" %}
        {% link "https://github.com/microlinkhq/metascraper" %}
        {% link "https://blog.izs.me/2010/12/an-open-letter-to-javascript-leaders-regarding/" %}
        {% link "https://humanwhocodes.com/blog/2021/12/making-open-source-project-sponsor-ready-accepting-sponsorships/" %}
    </div>
</div>

<div class="content-container grid">
    <div class="span-7-12">{% include 'components/code-tabs.html' %}</div>
</div>


<div class="content-container grid">
    <div class="span-7-12">
        {{ warning({
            text: "This rule was removed in version 7.1.2.",
            url: "/"
        }) }}
        {{ tip({
            text: "This rule is deprecated and will be removed in future versions.",
            url: "/"
        }) }}
        {{ important({
            text: "Remember to share your changes with the team.",
            url: "/"
        }) }}
    </div>
</div>

<div class="content-container grid">
    <div class="span-7-12">
        {{ ruleCategories({
            recommended: true,
            fixable: true,
            hasSuggestions: true
        }) }}
        <br>
        <br>
        {{ recommended() }}
        {{ fixable() }}
        {{ hasSuggestions() }}
    </div>
</div>

<div class="content-container grid">
    <div class="span-7-12">
        {{ rule({
            name: "getter-return",
            url: "#",
            deprecated: true,
            description: 'Enforce `return` statements in getters.',
            categories: {
                recommended: true,
                fixable: true,
                hasSuggestions: false
            }
        }) }}
        {{ rule({
            name: "getter-return",
            url: "#",
            deprecated: false,
            description: 'Enforce `return` statements in getters.',
            categories: {
                recommended: true,
                fixable: false,
                hasSuggestions: false
            }
        }) }}
    </div>
</div>

<div class="content-container grid">
    <div class="span-7-12">
        {{ related_rules({
            rules: [
                {
                    url: "#",
                    rule_name: "no-extra-semi"
                },
                {
                    url: "#",
                    rule_name: "no-unexpected-multiline"
                },
                {
                    url: "#",
                    rule_name: "semi-spacing"
                }
            ]
        }) }}
    </div>
</div>

<div class="content-container grid">
    <div class="span-7-12">{% include 'partials/branding-logo.html' %}</div>
</div>

<div class="content-container grid">
    <div class="span-7-12">{% include 'components/language-switcher.html' %}</div>
</div>

<div class="content-container grid">
    <div class="span-7-12">{% include 'components/version-switcher.html' %}</div>
</div>
