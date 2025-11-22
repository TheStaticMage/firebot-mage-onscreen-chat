# Installation and Configuration

## Version Compatibility

| Plugin Version | Minimum Firebot Version |
| --- | --- |
| 1.1.0+ | 5.65 |
| 1.0.1 | 5.64 |

## Installation: Plugin

1. Enable custom scripts in Firebot (Settings > Scripts) if you have not already done so.
2. From the latest [Release](https://github.com/TheStaticMage/firebot-mage-onscreen-chat/releases), download `firebot-mage-onscreen-chat-<version>.js` into your Firebot scripts directory (File > Open Data Folder, then select the "scripts" directory).
3. Go to Settings > Scripts > Manage Startup Scripts > Add New Script and add the `firebot-mage-onscreen-chat-<version>.js` script.
4. Restart Firebot. (The plugin will _not_ be loaded until you actually restart Firebot.)

## Configuration: OBS

1. Add a Browser Source to the scene where you want to display the chat.

    - Uncheck the "Local file" checkbox
    - Set the URL to `http://localhost:7472/integrations/mage-onscreen-chat/default`
    - Set the width and height of the Browser Source (choose reasonable values; you can change them later)
    - UN-check the "Shutdown source when not visible" checkbox
    - UN-check the "Refresh browser when scene becomes active" checkbox
    - Select "No access to OBS" for the page permissions

2. Position the browser source where you would like the credits to be displayed.

:bulb: If you are going to display your chat on multiple OBS scenes, I suggest using the "nested scenes" technique, rather than adding a browser source to all of your scenes. Here's a helpful video: [OBS Tutorial - NESTED SCENES Are A Game Changer by CGamer76](https://www.youtube.com/watch?v=2zRo2NqUAUs).

## Configuration: Firebot

You can either create events manually, or you can just import them all via a Firebot setup.

### Import default events from Firebot setup

This Firebot setup will create an Event Set called **Chat Overlay Events** with the recommend default events for the Chat Overlay. This includes all of the events listed under [Create events manually](#create-events-manually) below.

To obtain and install the setup:

1. Download [`default-events.firebotsetup`](/doc/default-events.firebotsetup) and save it to a place where you can easily find it.

2. In Firebot, go to **File** &gt; **Import Firebot Setup...**

3. Select the file you just downloaded and click **Import Setup**.

### Create events manually

Add any or all of the following events to suit your needs:

1. Trigger on: **Chat Message (Twitch)**

    Effects:

    1. **Display Message in Chat Overlay** (mage-onscreen-chat)

        Route Key: `default`

2. Trigger on: **Chat Message Deleted (Twitch)**

    Effects:

    1. **Delete Message in Chat Overlay**

        Route Key: `default`

3. Trigger on: **Chat Cleared (Twitch)**

    Effects:

    1. **Clear Messages in Chat Overlay**

        Route Key: `default`

4. Trigger on: **Viewer Banned (Twitch)**

    Effects:

    1. **Delete Messages by User in Chat Overlay**

        Route Key: `default`

5. Trigger on: **Viewer Timeout (Twitch)**

    Effects:

    1. **Delete Messages by User in Chat Overlay**

        Route Key: `default`
