---
title: Hero
---
{% from 'components/hero.macro.html' import hero %}

The hero sections typically includes:
- a title
- supporting text 
- buttons: one primary button, or a primary and a secondary button


## Usage 

```html 
<!-- import the macro -->
{% from 'components/hero.macro.html' import hero %}

<!-- use the macro -->
{ { hero({
        title: "Sponsors",
        supporting_text: "171 companies, organizations, and individuals are currently contributing $13137.84 each month to support ESLint's ongoing maintenance and development.",
        buttons: {
            primary: {
                primaryText: "Become a sponsor",
                primaryURL: "/donate/"
            }
        }
}) } }
```

## Example

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
