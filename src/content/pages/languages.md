---
layout: main.html
title: Languages
permalink: /languages/
hook: "languages-page"
---

{%- from 'components/hero.html' import hero %}


{{ hero({
    title: "Languages",
    supporting_text: "Choose your language"
}) }}

<section class="languages-section section">
    <div class="content-container">
        <nav aria-labelledby="languages-label">
            {% include 'partials/languages-list.html' %}
        </nav>
    </div>
</section>
