---
title: AI usage policy
description: How contributors can and can't use AI tools when writing for moderation.fyi or working on the website.
updatedAt: 2026-10-13
---

moderation.fyi exists to share what moderators have learnt from doing the job. That only works if the words come from people who have done it. This page explains where AI tools are welcome and where they aren't.

## The short version

- **Website code:** AI tools are fine. You're responsible for what you submit.
- **Guides, templates and articles:** write them yourself. Tools that check or tidy your own writing, such as spellcheckers and grammar checkers, are fine.
- **If you're unsure,** say what you used in your pull request and we'll talk it through.

## Writing content

Everything published under `content/`, including guides, templates, articles and author bios, must be written by you. Don't submit text that an AI tool has drafted, rewritten or expanded, even if you've edited it afterwards.

We ask this because:

- moderators come here for advice from people who have actually handled the situation
- AI tools state things confidently that are wrong, and bad advice about safety, harassment or the law can hurt people
- a guide is only as trustworthy as the person who stands behind it, and every page carries its author's name

### What's fine

These tools help you say what you mean without changing what you say:

- spellcheckers and grammar checkers, including the ones built into your browser, word processor or phone
- proofreading tools that flag mistakes for you to fix, such as Grammarly or LanguageTool, as long as you accept or reject each suggestion yourself rather than letting them rewrite whole sentences or paragraphs
- dictionaries, thesauruses and readability checkers
- translating your own writing into English if English isn't your first language, as long as you say so in your pull request so a reviewer can check it reads naturally
- dictation and speech-to-text, where the words are still yours

### What isn't

- asking an AI tool to write, draft, outline, expand, summarise or "improve" a guide, template, article or bio
- pasting in AI-written examples, scenarios, rule wording or message templates
- using AI tools as a source of facts. If you used one to help you find something, check it against a real source and cite that source instead.
- AI-generated images, including author avatars

Talking an idea through with an AI tool before you start writing is up to you, but the structure, the examples and the words on the page need to be your own.

## Working on the website

AI coding assistants are welcome for the website's code, configuration and tests. If you use one:

- read and understand every line you submit, and be ready to explain it in review
- make sure it builds, lints and type-checks (`bun run lint`, `bun run typecheck`, `bun run build`)
- mention in your pull request that you used one, and roughly how. This helps reviewers know what to look at closely.
- don't open large pull requests that you haven't checked yourself

## Reviews and enforcement

These rules apply to maintainers too. Maintainers may use AI tools to help review a pull request, for example to point out mistakes or unclear passages, but only alongside reading the content themselves. An AI tool never decides on its own whether a contribution is accepted.

We don't run AI-detection tools. They're unreliable and get things wrong, especially for people writing in a second language.

If a reviewer thinks a content contribution may have been written with AI, they'll ask you about it. If it was, we'll ask you to rewrite it in your own words or we'll close the pull request. Repeatedly submitting AI-written content may mean we stop accepting your contributions.

## Changes

We'll update this policy as the tools change. The date at the bottom of this page shows when it last changed.
