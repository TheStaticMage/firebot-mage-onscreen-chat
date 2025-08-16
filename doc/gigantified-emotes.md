# Gigantified Emotes

## Introduction

The Mage Onscreen Chat supports "gigantified emotes" which is a power-up that viewers in a Twitch channel can redeem with bits.

## Firebot development version

This requires functionality that is not built in to the released version of Firebot yet. However, the code is written, and it is just awaiting the project owners to merge it into the development branch, and then to release a new version of Firebot containing it. The Mage Onscreen Chat program supports this event as implemented in the current code contribution.

**This setup is for advanced users who know how to manipulate git branches and run a development version of Firebot. If you are not a highly technical user who has probably done some development on Firebot itself, this is not for you, and you will just have to wait for the project owners to incorporate this feature into the released version of Firebot.**

Instructions:

1. Check out the `v5` branch of Firebot (<https://github.com/crowbartools/firebot>)
2. Apply the changes from [PR #3209](https://github.com/crowbartools/Firebot/pull/3209) to your local branch
3. Start up Firebot in development mode from your branch

## Configuration

1. Under Events, click **New Event**.
2. Select _Power-up: Gigantify an Emote (Twitch)_.

   Note: If you don't see _Power-up: Gigantify an Emote (Twitch)_ as a choice, then you must not have read the previous section ([Firebot development version](#firebot-development-version))...

3. Add a new effect as follows:

    - Type: _Gigantify Emote_
    - Route Key: `default` (or another route key if you know what you're doing)

:bulb: You can redeem "Gigantify an Emote" on your own channel for free to test this.
