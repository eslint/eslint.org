---
title: Buttons 
---

{% from 'components/button.macro.html' import button %}

There are three types of buttons: primary, secondary, and "ghost". To render the proper element, a `behavior` key is provided, which takes either a `action` or a `link` value. `link` is the default, which will render an <code>&lt;a&gt;</code> tag that looks like a button. The `action` behavior implies that it is a button _that performs an action_ and is therefore rendered as a `<button type="button">`.


{{ button({ behavior: "action", type: "primary" }) }}
        {{ button({ behavior: "action", text: "I perform an action", type: "secondary" }) }}
        {{ button({ behavior: "action", text: "I perform an action", type: "ghost" }) }}

{{ button({ type: "primary", text: "I link somewhere", url: "#" }) }}
        {{ button({ type: "secondary", text: "Secondary Button", url:"#" }) }}
        {{ button({ type: "ghost", text: "Ghost Button", url:"#" }) }}
