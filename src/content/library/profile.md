---
title: Profile
---

{% from 'components/profile.macro.html' import member, contributor, post_author %}

There are three variations of a profile component on the site.

{{ member({
    name: "Name LastName",
    handle: "myHandle",
    bio: "This is a short bio",
    twitter: "twitter",
    github: "github"
}) }}

{{ contributor({
    name: "Name LastName",
    handle: "myHandle"
}) }}

{{ post_author({
    name: "Name LastName",
    title: "Creator of a popular framework",
    handle: "myHandle",
    bio:  "This is a longer biography which would typically go at the bottom of a blog post. It is included as a markdown partial, providing more flexibility for the type of content that does in it."
}) }}
