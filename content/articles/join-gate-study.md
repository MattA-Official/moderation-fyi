---
title: Does a ten-minute join gate stop raids? Twelve weeks of data from one Discord server
description: We made new members wait ten minutes before they could post, then counted what happened to raids, spam and genuine newcomers.
authors:
  - sam-okafor
badge:
  label: Study
date: 2026-09-22T00:00:00.000Z
tags:
  - discord
  - raids
  - onboarding
---

::note
This is an example article by a fictional author. The server and every figure in it are made up, to show what a study on moderation.fyi looks like.
::

## Summary

For twelve weeks, new members of our server had to wait ten minutes after joining before they could send messages. We compared those weeks with the twelve weeks before.

- Raid incidents fell from 14 to 3.
- Messages removed as spam in a member's first hour fell by 71%.
- The share of new members who ever posted fell slightly, from 38% to 35%.
- Mod actions per week fell by about a third, most of it in the evening, when raids usually hit.

Our take: for a server our size, the trade-off was clearly worth it. The three per cent of newcomers we may have lost is real, though, and we cover what we did about it below.

## Background

The server has about 60,000 members and gets 400 to 900 joins a day, with spikes when the game updates. Before the change, we relied on Discord's verification level (verified email) plus a bot that kicked accounts under 24 hours old.

Raids were our biggest problem. We define a raid as ten or more accounts joining within five minutes and posting rule-breaking content. They were rare but exhausting: each one took two or three mods around half an hour to clean up.

## What we changed

On 2 June we turned on Discord's built-in rule that members must wait ten minutes before they can talk, and left everything else as it was. We announced it in our welcome channel and in the rules, so newcomers knew why they couldn't post yet.

## How we measured it

We compared the twelve weeks before the change (10 March to 1 June) with the twelve weeks after (2 June to 24 August). We used:

- **Raid incidents**, from our incident log, using the definition above.
- **Early spam removals**, counted from our bot's logs: messages deleted as spam within an hour of the author joining.
- **Newcomer participation**: the share of members who joined in each period and sent at least one message within 30 days.
- **Mod actions per week**: bans, kicks, timeouts and deletions from the audit log.

## Results

| Measure                           | Before | After | Change |
| --------------------------------- | -----: | ----: | -----: |
| Joins                             | 51,240 | 49,870 |   −3% |
| Raid incidents                    |     14 |      3 |  −79% |
| Early spam removals               |  2,310 |   670 |  −71% |
| Newcomers who posted in 30 days   |    38% |   35% | −3 pts |
| Mod actions per week (average)    |    412 |   276 |  −33% |

All three raids after the change came from accounts that had joined in advance and waited out the timer. That told us the gate filters out the opportunistic raids, not the planned ones.

## What surprised us

We expected the drop in raids. We didn't expect the change in tone in our general channel. With fewer drive-by spam bursts, regulars stopped responding to every newcomer with suspicion, and several mods mentioned it unprompted.

The dip in newcomer participation was concentrated in people who joined during live events. They came to ask one quick question, couldn't, and left.

## Limitations

This is one server, over one summer, with no control group. The game had a quieter update schedule after June, which may account for some of the fall in joins. Our raid definition is our own, and other teams draw the line differently.

## What we'd tell other teams

1. If raids are your main problem, try a short join gate before anything more complicated. It's free and takes a minute to set up.
2. Tell newcomers about the wait before they hit it. We added a line to our welcome message and the participation gap narrowed slightly in the last four weeks.
3. Keep a simple incident log. Without ours, we'd have had opinions about this change, not numbers.
4. Don't rely on the gate alone for planned raids. Accounts that wait the timer out still need your usual tools.
