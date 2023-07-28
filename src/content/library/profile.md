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
    bio: "This is a member's biography. An example of a member is a team member on the team page.",
    twitter: "twitterUsername",
    github: "githubUsername"
}) } }

{ { contributor({
    name: "Contributor Name",
    handle: "myHandle"
}) } }

{ { post_author({
    name: "Nicholas Zakas",
    title: "Creator of a popular framework",
    handle: "nzakas",
    twitter: "twitterHandle",
    github: "githubHandle"
}) } }
```

## Examples

{{ contributor({
    name: "Name LastName",
    handle: "username"
}) }}

<br>
<br>
<br>

{{ member({
    name: "Name LastName",
    handle: "username",
    bio: "This is a short bio",
    twitter: "twitter",
    github: "github"
}) }}

<br>
<br>
<br>

{{ post_author({
    name: "Nicholas Zakas",
    title: "Creator of a popular framework",
    handle: "nzakas",
    twitter: "nzakas",
    github: "nzakas"
}) }}
