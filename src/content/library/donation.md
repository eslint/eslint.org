---
title: Donation
---
{%- from 'components/donation.macro.html' import donationItem %}

A donation is rendered using the `donationItem()` macro imported from `components/donation.macro.html`. The macro takes parameters:
* image (of entity that donated)
* name (of entity that donated)
* donation amount
* donation date

Typically, the data for the donation is pulled from a data file and the values are set and passed to the macro. You can find an example of that in the [Sponsors page](/sponsors/).

## Usage

```html
<!-- import the macro -->
{%- from 'components/donation.macro.html' import donationItem %}

<!-- use the macro -->
{ { donationItem({
    image: "https://images.opencollective.com/chrome/dc55bd4/logo.png",
    name: "Google Chrome",
    amount: 100000,
    date: "2020-10-10"
}) } }
```

## Example

{{ donationItem({
    image: "https://images.opencollective.com/chrome/dc55bd4/logo.png",
    name: "Google Chrome",
    amount: 100000,
    date: "2020-10-10"
}) }}
