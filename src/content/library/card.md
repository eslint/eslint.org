---
title: Card
---

{% from 'components/card.macro.html' import card %}

The card component is used to create blog post listings.

To use the component, call the `card()` macro and provide the parameters required.

<br>
<br>
<br>

{{ card({
    title: "The post title",
    teaser: "This is a short description to demo what the card component will look like in the pattern library.",
    authorName: "Happy McPerson",
    category: "Sponsorships",
    readingTime: "5 min",
    date: "02-03-2020"
}) }}

<br>
<br>
<br>
<br>
<br>
<br>

{{ card({
    title: "This is a featured post",
    featured: "true",
    teaser: "This is a short description to demo what the card component will look like in the pattern library.",
    authorName: "The Author Name",
    category: "Sponsorships",
    readingTime: "5 min",
    date: "02-03-2020"
}) }}
