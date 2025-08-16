# Route Keys

## Introduction

It is possible to create multiple instances of the chat overlay. On my stream, I have one instance with all messages (including commands, trivia answers, and bot responses) and I have another instance that is "clean" (filters out commands, trivia answers, and bot responses). These have separate URLs, so on one scene I can have the "clean" display, and on another I can have the normal display.

The "route key" simply defines the route in the URL that you provide to OBS. The default route key (named `default`) is accessible at `http://localhost:7472/integrations/mage-onscreen-chat/default`. If you were to create a route key called `my-awesome-key`, then that chat overlay would be accessible at `http://localhost:7472/integrations/mage-onscreen-chat/my-awesome-key`.

## Setting up Route Keys

The plugin ships with one pre-configured route key called `default` that you can't delete.

If you decide to add additional route keys:

1. Go to Settings &gt; Scripts &gt; Manage Startup Scripts and find On-Screen Chat Overlay. Click the Edit button.

2. Type additional route key(s) in the "Route Keys" box, separated by spaces. Good route keys use alphanumeric characters and dashes.

3. Save the settings.

Now configure your browser source in OBS. If you created a route key called `my-awesome-key`, then that chat overlay would be accessible at `http://localhost:7472/integrations/mage-onscreen-chat/my-awesome-key`.

Finally, set up events, just like during [installation](/doc/installation.md#create-events-manually). Be sure to select your route key for each effect.

## Ideas

- To filter out commands: Add a filter to the **Chat Message** event: **Message Text** doesn't start with **!**
- To filter out the bot: Add a filter to the **Chat Message** event: **Viewer's Roles** doesn't include **Stream Bot**
