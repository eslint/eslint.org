---
title: Profile
---

{% from 'components/profile.macro.html' import member, contributor, post_author %}

There are three variations of a profile component on the site: the member, the contributor, and the post author.

The parameters required for each are shown in the following example:

```html 
<!-- first import the profile macro -->
{ % from 'components/profile.macro.html' import member, contributor, post_author % }

<!-- then use a macro -->
{ { member({
    name: "Name LastName",
    handle: "myHandle",
    bio: "This is a member's biography. An example of a member is a team member on the team page.",
    twitter: "twitter",
    github: "github"
}) } }

{ { contributor({
    name: "Contributor Name",
    handle: "myHandle"
}) } }

{ { post_author({
    name: "Name LastName",
    title: "Creator of a popular framework",
    handle: "myHandle",
    bio:  "This is a longer biography which would typically go at the bottom of a blog post. It is included as a markdown partial, providing more flexibility for the type of content that does in it."
}) } }
```

## Examples 

{{ contributor({
    name: "Name LastName",
    handle: "myHandle"
}) }}

<br>
<br>
<br>

{{ member({
    name: "Name LastName",
    handle: "myHandle",
    bio: "This is a short bio",
    twitter: "twitter",
    github: "github"
}) }}

<br>
<br>
<br>

{{ post_author({
    name: "Author Name",
    title: "Creator of a popular framework",
    handle: "myHandle",
    bio:  "This is a longer biography which would typically go at the bottom of a blog post. It is included as a markdown partial, providing more flexibility for the type of content that does in it."
}) }}
