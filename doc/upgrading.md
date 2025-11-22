# Upgrading

## Version Compatibility

| Plugin Version | Minimum Firebot Version |
| --- | --- |
| 1.1.0+ | 5.65 |
| 1.0.1 | 5.64 |

## Versioning Philosophy

- A **patch release** changes the last number (e.g. `0.0.3` -> `0.0.4`). These releases may fix bugs or add features, but your existing setup should continue to work just fine.
- A **minor release** changes the middle number (e.g. `0.0.4` -> `0.1.0`). These releases typically make considerable changes but are generally backward-compatible. Your existing setup should continue to work.
- A **major release** changes the first number (e.g. `0.1.5` -> `1.0.0`). These releases correspond to a major milestone and may contain breaking changes.

## Upgrade Procedure

1. From the latest [Release](https://github.com/TheStaticMage/firebot-mage-onscreen-chat/releases), download `firebot-mage-onscreen-chat-<version>.js`.
2. Place the new `firebot-mage-onscreen-chat-<version>.js` into your Firebot scripts directory (File > Open Data Folder, then select the "scripts" directory).
3. Go to Settings > Scripts > Manage Startup Scripts, find the plugin in the list, click Edit next to it, select the new `firebot-mage-onscreen-chat-<version>.js` file, and click Save.
4. Restart Firebot.

Optional: Delete any older versions of this plugin from your Firebot scripts directory to keep it clean.

## Upgrade Notes

### From 1.0.0 or 1.0.1 -> 1.1.0+

:fire: Version 1.1.0 and higher require Firebot 5.65 or later. If you are running Firebot 5.64, stay on version 1.0.1.

### From 0.0.1 -> 1.0.0

_Oh, ye brave soul, who tried a `0.0.x` version of software!_

The URL is now "namespaced" to this plugin. You will need to change your URL in OBS.

Old: `http://localhost:7472/integrations/<your-route-key>/index.html`
New: `http://localhost:7472/integrations/mage-onscreen-chat/<your-route-key>/index.html`
