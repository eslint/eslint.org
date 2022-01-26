---
layout: doc.html
title: Docs
permalink: /docs/
---

{%- from 'components/rule-categories.macro.html' import ruleCategories, recommended, fixable, hasSuggestions %}
{%- from 'components/rule.macro.html' import rule %}
{%- from 'components/related-rules.macro.html' import related_rules %}
# Docs

Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, rerum suscipit sint laborum autem alias esse? Corrupti quidem numquam, atque in fugiat fuga ut, deserunt placeat maxime sapiente debitis voluptates?


Correct usage: 

<div data-correct-code>

```js
function() {
    const another = [];
}
```

</div>

Incorrect usage:

<div data-incorrect-code>

```js
function() {
    const something = {};
}
```

</div>
## heading 2
Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus eius assumenda tenetur, impedit cumque dolore ipsam debitis quas iure enim qui culpa nisi vero, accusantium, optio et adipisci nihil quia!

{% include 'components/code-tabs.html' %}

### heading 3
Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium voluptate veritatis eveniet eos tempora quidem totam error. Earum dicta, officia rem cumque autem distinctio fugiat, dolorum nemo, laboriosam cum nobis!

## heading 2

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit dolore natus fugit consequuntur enim voluptas sapiente! Totam rerum delectus vel obcaecati. Enim error reprehenderit autem dolore ipsum, earum aliquid accusantium.


## Related rules 

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

## Further Resources

{% link "https://developer.mozilla.org/en-US/docs/Web/JavaScript" %}

{% link "https://github.com/microlinkhq/metascraper" %}

{% link "https://blog.izs.me/2010/12/an-open-letter-to-javascript-leaders-regarding/" %}

{% link "https://humanwhocodes.com/blog/2021/12/making-open-source-project-sponsor-ready-accepting-sponsorships/" %}
