# Gigantified Emotes

## Introduction

The Mage Onscreen Chat supports "gigantified emotes" which is a power-up that viewers in a Twitch channel can redeem with bits.

## Firebot version

This requires functionality that is only available in Firebot 5.65 and higher.

You will need to use a [Firebot nightly build](https://github.com/crowbartools/firebot-nightly) until Firebot 5.65 is officially released.

## Configuration

1. Under Events, click **New Event**.
2. Select _Power-up: Gigantify an Emote (Twitch)_.

   Note: If you don't see _Power-up: Gigantify an Emote (Twitch)_ as a choice, then you must not have read the previous section. Double-check your Firebot version!

3. Add a new effect as follows:

    - Type: _Gigantify Emote_
    - Route Key: `default` (or another route key if you know what you're doing)

:bulb: You can redeem "Gigantify an Emote" on your own channel for free to test this.
