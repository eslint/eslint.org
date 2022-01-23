---
layout: main.html
permalink: /component-library/
hook: "component-library"
---

{% from 'components/hero.html' import hero %}
{% from 'components/related-rules.macro.html' import related_rules %}
{% from 'components/person.macro.html' import member, contributor, author %}
{% from 'components/button.macro.html' import button %}
{% from 'components/alert.macro.html' import warning, tip, important %}
{% from 'components/rule-categories.macro.html' import ruleCategories, recommended, fixable, hasSuggestions %}
{% from 'components/rule.macro.html' import rule %}
{% from 'components/card.macro.html' import card %}

<div class="content-container grid">
    <div class="span-7-12">
        {{ member({
                name: "Name LastName",
                handle: "myHandle",
                bio: "This is a short bio",
                twitter: "twitter",
                github: "github"
        }) }}
    </div>
    <div class="span-7-12">
        {{ contributor({
                name: "Name LastName",
                handle: "myHandle"
        }) }}
    </div>
    <div class="span-7-12">
        {{ author({
                name: "Name LastName",
                title: "Creator of a popular framework",
                handle: "myHandle",
                bio:  "This is a longer biography which would typically go at the bottom of a blog post. It is included as a markdown partial, providing more flexibility for the type of content that does in it."
        }) }}
    </div>
</div>

<div class="content-container">
    {{ hero({
        title: "Sponsors",
        supporting_text: "171 companies, organizations, and individuals are currently contributing $13137.84 each month to support ESLint's ongoing maintenance and development.",
        buttons: {
            primary: {
                primaryText: "Become a sponsor",
                primaryURL: "/donate/"
            }
        }
    }) }}
</div>

<div class="content-container grid">
    <div class="span-7-12">
        {{ button({ behavior: "action", type: "primary" }) }}
        {{ button({ behavior: "action", text: "I perform an action", type: "secondary" }) }}
        {{ button({ behavior: "action", text: "I perform an action", type: "ghost" }) }}
    </div>
    <div class="span-7-12">
        {{ button({ type: "primary", text: "I link somewhere", url: "#" }) }}
        {{ button({ type: "secondary", text: "Secondary Button", url:"#" }) }}
        {{ button({ type: "ghost", text: "Ghost Button", url:"#" }) }}
    </div>
</div>

<div class="content-container grid">
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
    <div class="span-7-12">{% include 'components/accordion.html' %}</div>
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

<div class="content-container grid">
    <div class="span-1-6">
        <h2>Card</h2>
    </div>
    <div class="span-7-12">
        {{ card({
            title: "Just a post",
            teaser: "This is a short description to demo what the card component will look like in the pattern library.",
            authorName: "Happy McPerson",
            category: "Sponsorships",
            readingTime: "5 min",
            date: "02-03-2020"
        }) }}
    </div>
    <div class="span-1-12">
        {{ card({
            title: "This is a featured post",
            featured: "true",
            teaser: "This is a short description to demo what the card component will look like in the pattern library.",
            authorName: "Happy McPerson",
            category: "Sponsorships",
            readingTime: "5 min",
            date: "02-03-2020"
        }) }}
    </div>
</div>
