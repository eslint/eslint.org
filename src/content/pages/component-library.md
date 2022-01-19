---
layout: main.html
permalink: /component-library/
tags: ['nav']
---


{%- from 'components/alert.macro.html' import warning, tip, important %}
{%- from 'components/person.macro.html' import member, contributor %}
{%- from 'components/card.macro.html' import card %}
{%- from 'components/rule-categories.macro.html' import ruleCategories, extends, fix, suggestions %}
{%- from 'components/rule.macro.html' import rule %}
{%- from 'components/related-rules.macro.html' import related_rules %}
{%- from 'components/buttony-link.macro.html' import buttonyLink %}
{%- from 'components/hero.html' import hero %}


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


<div class="content-container">
    {{ buttonyLink({ type: "primary", text: "Primary Button", url:"#" }) }}
    {{ buttonyLink({ type: "secondary", text: "Secondary Button", url:"#" }) }}
    {{ buttonyLink({ type: "ghost", text: "Ghost Button", url:"#" }) }}
</div>

<div class="content-container">
    {% include 'components/code-tabs.html' %}
</div>

<div class="content-container">
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

<div class="content-container">
    {{ ruleCategories({
        extends: true,
        fix: true,
        suggestions: true
    }) }}

    <br>
    <br>

    {{ extends() }}
    {{ fix() }}
    {{ suggestions() }}
</div>

<div class="content-container">
    {{ rule({
        name: "getter-return",
        url: "#",
        deprecated: true,
        description: 'Enforce `return` statements in getters.',
        categories: {
            extends: true,
            fix: true,
            suggestions: false
        }
    }) }}

    {{ rule({
        name: "getter-return",
        url: "#",
        deprecated: false,
        description: 'Enforce `return` statements in getters.',
        categories: {
            extends: true,
            fix: false,
            suggestions: false
        }
    }) }}
</div>

<div class="content-container">
    {{ related_rules({
        items: [
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

<div class="content-container">
    {% include 'partials/branding-logo.html' %}
</div>

<div class="content-container">
    {% include 'components/language-switcher.html' %}
</div>

<div class="content-container">
    {% include 'components/version-switcher.html' %}
</div>

<div class="content-container">
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

<div class="content-container">
    {{ card({
        title: "Just a post",
        teaser: "This is a short description to demo what the card component will look like in the pattern library.",
        authorName: "Happy McPerson",
        category: "Sponsorships",
        readingTime: "5 min",
        date: "02-03-2020"
    }) }}
</div>


<script src="{{ '/assets/js/tabs.js' | url }}"></script>
