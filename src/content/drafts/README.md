# Write for the ESLint blog

Have you had an interesting experience with ESLint? Want to share it with the rest of the world? Writing a blog post for the ESLint blog helps get the word out and also contributes valuable information to the ESLint community as a whole. 

## How it works

Writing for the ESLint blog works like this:

1. You write an awesome post related to ESLint (ideas below).
1. The ESLint team helps you edit and revise the post to make it as good as it can be.
1. You get paid $300 USD for your post.
1. You give the ESLint blog exclusive rights to your content for the first 30 days. After 30 days, you are free to cross-post to other blogs so long as you use the ESLint blog post URL as the canonical URL on those cross posts.

## Topic ideas

In general, any topic that relates to ESLint is eligible. That includes:

* **Case Studies** - how you are using ESLint personally or professionally. We are particularly interested in the benefits people see from using ESLint in their everyday work.
* **Tutorials** - explaining how to do something with ESLint, such as create a custom rule, plugin, or parser, set up ESLint for a particular framework, or anything else that walks the reader through how to use ESLint.

Not sure if your idea is suitable for the ESLint blog? Stop by the [#blog](https://eslint.org/chat/blog) channel on Discord and ask the team.

## How to submit a blog post

1. Fork this repository.
1. Create a new file in the `src/content/drafts` folder. Please do not include a date in the filename. (`my-great-blog-post.md` not `2022-06-30-my-great-blog-post.md`) The ESLint team will publish your post at a later date. Please see the existing blog posts in `src/content/blog` to include the correct frontmatter in your post.
1. If you have any images, add them to `src/assets/images/blog/XXXX` where `XXXX` is the current year.
1. Run `node tools/add-author.js username`, where `username` is your GitHub username. This will put all of the information from your GitHub profile for use in the site.
1. Edit your bio in `_includes/partials/author_bios/username.md` (where `username` is your GitHub username). This file can contain Markdown to embed in the blog post.
1. Send a pull request to this repository.
  * The title of the pull request should be `"feat: blog: My great blog post"` (use your actual post title)
  * In the description, please include 2-4 sentences explaining the overall topic of the blog post.

## Frequently Asked Questions

**Do I need to write the whole blog post first?**

Yes. We can't give feedback on partial posts. If you're not sure whether or not the post is appropriate for the blog, please stop by the [#blog](https://eslint.org/chat/blog) channel on Discord and ask the team.

**How can I preview my blog post?**

When you run `npm start`, a local website will start up. Your post will be the top one on `/blog`. This preview works only locally and in the Netlify deploy preview; it will not show up on the live site until it has been scheduled.

**How will I get paid?**

You will be paid through [Open Collective](https://opencollective.org). Open Collective uses PayPal and Wise to initiate payments. We cannot make payments in any other way.

**Can I still submit a post even if I can't be paid?**

Yes. You can opt not to receive payment for a post if you are legally or otherwise unable to receive payments through Open Collective.

**Are all posts accepted?**

As long as the post is well-written and related to ESLint, we will likely accept your post.

**What if my post is rejected?**

If your post is rejected, you are still free to post it elsewhere.
