---
title: Card
---

{% from 'components/card.macro.html' import card %}

The card component is used to create blog post listings. To use the component, call the `card()` macro and provide the parameters required:
* title
* teaser text
* author name
* category
* reading time
* date

## Usage

```html
<!-- import the macro -->
{ % from 'components/card.macro.html' import card % }

<!-- use the macro -->
{ { card({
    title: "The post title",
    teaser: "This is a short description to demo what the card component will look like in the pattern library.",
    authorName: "Happy McPerson",
    category: "Sponsorships",
    readingTime: "5 min",
    date: "02-03-2020",
    url: "/component-library/card"
}) } }
```

## Example: Default card

{{ card({
    title: "The post title",
    teaser: "This is a short description to demo what the card component will look like in the pattern library.",
    authorName: "Happy McPerson",
    category: "Sponsorships",
    readingTime: "5 min",
    date: "02-03-2020",
    url: "/component-library/card"
}) }}

## Example: Featured (post) card

{{ card({
    title: "This is a featured post",
    featured: "true",
    teaser: "This is a short description to demo what the card component will look like in the pattern library.",
    authorName: "The Author Name",
    category: "Sponsorships",
    readingTime: "5 min",
    date: "02-03-2020",
    url: "/component-library/card"
}) }}
