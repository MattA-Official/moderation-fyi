---
title: Contribute
description: moderation.fyi is built by moderators, for moderators. Here's how you can help.
---

Every guide, template and article on moderation.fyi is written by volunteers. If you've learnt something the hard way, sharing it could save another moderator a lot of stress.

## Ways to help

::card-group
  :::card{title="Suggest a topic" icon="i-lucide-lightbulb" to="https://github.com/MattA-Official/moderation-fyi/issues/new" target="_blank"}
  Tell us what you'd like to see covered. Even a one-line idea helps.
  :::

  :::card{title="Improve existing content" icon="i-lucide-pencil" to="https://github.com/MattA-Official/moderation-fyi" target="_blank"}
  Every page has a **Suggest an edit** link at the bottom. Fix a typo, add an example or bring something up to date.
  :::

  :::card{title="Write something new" icon="i-lucide-file-plus" to="#writing-content"}
  Share a guide, a template or an article based on your own experience.
  :::

  :::card{title="Improve the website" icon="i-lucide-code" to="https://github.com/MattA-Official/moderation-fyi" target="_blank"}
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

Create a YAML file in `content/authors/` (for example `your-name.yml`) with your name, a short description and an avatar, then list the file name in the `authors` field of your content.

### Open a pull request

Open a pull request against the `dev` branch. A maintainer will review it, suggest any changes and merge it.
::

## Style guide

- **Write for a busy volunteer.** Lead with what to do, then explain why.
- **Use plain British English.** Avoid jargon, or explain it the first time you use it.
- **Be specific.** Real examples, exact wording and screenshots beat general advice.
- **Stay platform-agnostic where you can.** Call out platform-specific steps clearly.
- **Be respectful.** Never include identifying details of real users or communities without permission.

::note
By contributing, you agree that your contribution will be published under the licence shown on the content (CC BY-NC-SA 4.0 unless stated otherwise).
::
