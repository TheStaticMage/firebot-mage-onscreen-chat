# Mage's Firebot On-Screen Chat Display

## Introduction

This is a customizable on-screen chat display for your Twitch chat messages via [Firebot](https://firebot.app).

Features:

- Integrates via OBS browser source
- Control which chat messages are sent to the display
- Display badges
- Display user profile images
- Deleting messages in chat removes them from the display
- Banning / timing-out a user clears their messages
- Clearing chat clears the display
- Supports gigantified emotes ([Firebot 5.65+ only](/doc/gigantified-emotes.md))
- Supports multiple instances with separate message content
- Supports Kick.com messages ([with my Kick integration](https://github.com/TheStaticMage/firebot-mage-kick-integration))

Customizable:

- Turn profile image display on or off by role
- Colors, bold, italic, etc., on usernames and messages by role
- For advanced users, full access to CSS style sheet
- For really advanced users, full access to underlying Javascript

## Documentation

- [Installation and Configuration](/doc/installation.md) (**Start Here**)
  - [Installation: Script](/doc/installation.md#installation-script)
  - [Configuration: OBS](/doc/installation.md#configuration-obs)
  - [Configuration: Firebot](/doc/installation.md#configuration-firebot)
- [Upgrading](/doc/upgrading.md)
- [Display Customization](/doc/display-customization.md)
- Advanced Topics
  - [Gigantified Emote Support](/doc/gigantified-emotes.md)
  - [Route Keys](/doc/route-keys.md)
  - [Avoiding Browser Source Refreshes](/doc/browser-source-refreshes.md)

## Support

The best way to get help is in this project's thread on Discord. Join [The Static Discord](https://discord.gg/EJ6EvS2qJb) and then visit the `#firebot-mage-onscreen-chat` channel there.

- Please do not DM me on Discord.
- Please do not ask for help in my chat when I am live streaming on any platform.

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/TheStaticMage/firebot-mage-onscreen-chat/issues).

## Contributing

Contributions are welcome via [Pull Requests](https://github.com/TheStaticMage/firebot-mage-onscreen-chat/pulls). I _strongly suggest_ that you contact me before making significant changes, because I'd feel really bad if you spent a lot of time working on something that is not consistent with my vision for the project. Please refer to the [Contribution Guidelines](/.github/contributing.md) for specifics.

## License

This plugin is released under the [GNU General Public License version 3](/LICENSE). That makes it free to use whether your stream is monetized or not.

If you use this on your stream, I would appreciate a shout-out. (Appreciated, but not required.)

- <https://www.twitch.tv/thestaticmage>
- <https://kick.com/thestaticmage>
- <https://youtube.com/@thestaticmagerisk>

## FAQ

### Does Twitch allow me to display chat on stream?

_**Important**: The answer provided is my personal interpretation of Twitch's Terms of Service. It may not be complete, up to date, or accurate. You should always verify details directly with Twitch's official documentation and make your own informed decisions._

The answer to this question has always been "yes" for Twitch chat.

In the past, Twitch prohibited streamers from displaying chat messages from other platforms on their Twitch streams. However, in February 2026, the Twitch CEO [stated that they would not be taking enforcement action for displaying chat from other platforms](https://www.twitch.tv/videos/2706691276?t=00h42m33s). If you're using my [Firebot Kick Integration](https://github.com/TheStaticMage/firebot-mage-kick-integration) or [YouTube Integration](https://github.com/TheStaticMage/firebot-mage-youtube-integration), this should make it safe to add those chat messages to your display as well.

### How is this different from the on-screen chat widget being built into Firebot 5.66?

The developers added a chat widget that's integrated in Firebot 5.66 itself, without a plugin. My chat overlay was created before they added it to the program, so I suggest that you just choose the one that works best for you.
