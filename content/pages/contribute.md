---
title: Contribute
description: moderation.fyi is built by moderators, for moderators. Here's how you can help.
---

Every guide, template and article on moderation.fyi is written by volunteers. If you've learnt something the hard way, sharing it could save another moderator a lot of stress.

## Ways to help

::card-group
  :::card{title="Suggest a topic" to="https://github.com/MattA-Official/moderation-fyi/issues/new" target="_blank"}
  Tell us what you'd like to see covered. Even a one-line idea helps.
  :::

  :::card{title="Improve existing content" to="https://github.com/MattA-Official/moderation-fyi" target="_blank"}
  Every page has a **Suggest an edit** link at the bottom. Fix a typo, add an example or bring something up to date.
  :::

  :::card{title="Write something new" to="#writing-content"}
  Share a guide, a template or an article based on your own experience.
  :::

  :::card{title="Improve the website" to="https://github.com/MattA-Official/moderation-fyi" target="_blank"}
  The site is built with Nuxt. Bug reports, accessibility fixes and feature ideas are all welcome.
  :::
::

## Writing content

All content lives in the `content/` folder of the [GitHub repository](https://github.com/MattA-Official/moderation-fyi) as Markdown files.

::steps{level="3"}
### Fork the repository

Create your own copy of the repository on GitHub, or edit a file directly in the browser using the **Suggest an edit** link.

### Add your file

Create a new Markdown file in the right folder:

| Type     | Folder               | Use it for                                     |
| -------- | -------------------- | ---------------------------------------------- |
| Guide    | `content/guides/`    | Step-by-step, practical instructions           |
| Template | `content/templates/` | Ready-to-use text that moderators can adapt    |
| Article  | `content/articles/`  | Case studies, opinion and longer-form writing  |

The examples already in each folder show every supported front matter field.

### Add yourself as an author

Create a Markdown file in `content/authors/` (for example `your-name.md`) with your name and a one-line description, then list the file name, without `.md`, in the `authors` field of your content. You can add an avatar too; without one, we show your initials.

You then have two options:

- **A bio page on moderation.fyi.** Write a short bio below the front matter and it appears at `/authors/your-name`, along with everything you've written here.
- **A link to your own site or profile.** Set `link` to its address instead, and your name will link there. You won't get a bio page.

Write your bio in the third person ("Sam has moderated…") and keep it to three or four short paragraphs. Good bios cover:

- what you moderate, on which platforms, and for how long
- what you know most about, or what your team is known for
- why you write for moderation.fyi, or what you tend to write about
- optionally, one line about life outside moderation

You can also add your pronouns, the year you started moderating, the platforms you moderate on and a few "Elsewhere" links. `sam-okafor.md` shows every field in use.

### Open a pull request

Open a pull request against the `dev` branch. A maintainer will review it, suggest any changes and merge it.
::

## Style guide

Write mod-to-mod: a peer with more experience, not a guru or a trainer.

- Lead with what to do. Explain why afterwards, if at all.
- Use plain British English and small words: "stop", not "cease".
- Keep paragraphs to two to four sentences, and use headings rather than bold phrases to signpost.
- Be specific. Real examples and exact wording beat general advice.
- Cite factual claims, and hedge honestly: "on Discord specifically", "most servers this size".
- Never include identifying details of real users or communities without permission.

::note
By contributing, you agree that your contribution will be published under the licence shown on the content (CC BY-NC-SA 4.0 unless stated otherwise).
::
