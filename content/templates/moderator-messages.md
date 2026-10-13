---
title: Moderator messages
description: "Ready-to-send messages for a warning, a timeout and a ban, so every member hears the same thing whichever mod is on shift."
authors:
  - moderation-team
publishedAt: 2026-10-13
topics:
  - rules
  - appeals
category: forms
templateType: message
platforms:
  - discord
downloadable: true
license: cc-by-nc-sa
customization:
  difficulty: easy
  estimatedTime: 10 minutes
---

Send these as direct messages when you act on a member. Click a highlighted word to fill in the details of the case, and keep the tone calm: the message is a record as much as a notice.

## Warnings

Use this for a first, minor breach. Name the rule so the member can read it for themselves.

::template-snippet{title="Warning"}
Hi {name}, this is a warning from the {server} mod team for breaking rule {number}: {rule}.

{What happened, in one sentence.}

Please have a read of the rules in #rules. If you think we've got this wrong, reply here and a different mod will take a look.
::

## Timeouts and bans

Say how long a timeout lasts, and always tell a banned member how to appeal.

::template-snippet{title="Timeout"}
Hi {name}, you've been timed out for {length} for breaking rule {number}: {rule}.

{What happened, in one sentence.}

You'll be able to chat again once the timeout ends. If you think we've got this wrong, reply here and a different mod will take a look.
::

::template-snippet{title="Ban"}
Hi {name}, you've been banned from {server} for breaking rule {number}: {rule}.

{What happened, in one sentence.}

You can appeal at {appeal link}. Appeals are read by a mod who wasn't involved, usually within {time}.
::
