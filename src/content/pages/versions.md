---
layout: main.html
title: Versions
permalink: /versions/
hook: "versions-page"
---

<div class="section hero">
    <div class="content-container">
        <div>
            <h1 class="section-title h2" id="versions-label">ESLint Versions</h1>
            <p class="section-supporting-text">
                Choose the documentation version
            </p>
        </div>
    </div>
</div>

<section class="versions-section section">
    <div class="content-container">
        <nav aria-labelledby="versions-label">
            {% include 'partials/versions-list.html' %}
        </nav>
    </div>
</section>
