# Gigantified Emotes

## Introduction

The Mage Onscreen Chat supports "gigantified emotes" which is a power-up that viewers in a Twitch channel can redeem with bits.

## Firebot version

This requires functionality that is only available in Firebot 5.65 and higher.

You will need to use a [Firebot nightly build](https://github.com/crowbartools/firebot-nightly) until Firebot 5.65 is officially released.

## Configuration

No additional configuration is required!

Gigantified emotes are automatically detected and displayed when the chat message arrives. The overlay reads the `isGigantified` property directly from the chat message, which Firebot sets automatically when a viewer uses the "Gigantify an Emote" power-up.

The last emote in the message will be displayed at 72×72 pixels instead of the standard 28×28 pixels.

:bulb: You can redeem "Gigantify an Emote" on your own channel for free to test this.

:bulb: If you don't want Gigantified emotes, there is an option under Settings &gt; Scripts &gt; Manage Startup Scripts &gt; On-Screen Chat Overlay &gt; Edit to turn this off.
