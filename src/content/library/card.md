---
title: Card
---

{% from 'components/card.macro.html' import card %}

The card component is used to create blog post listings.

To use the component, call the `card()` macro and provide the parameters required.

{{ card({
    title: "Just a post",
    teaser: "This is a short description to demo what the card component will look like in the pattern library.",
    authorName: "Happy McPerson",
    category: "Sponsorships",
    readingTime: "5 min",
    date: "02-03-2020"
}) }}

<br>
<br>
<br>

{{ card({
    title: "This is a featured post that requires more horizontal space",
    featured: "true",
    teaser: "This is a short description to demo what the card component will look like in the pattern library.",
    authorName: "The Author Name",
    category: "Sponsorships",
    readingTime: "5 min",
    date: "02-03-2020"
}) }}
