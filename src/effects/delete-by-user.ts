import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { logger } from '../main';
import { getServer } from '../server/manage';
import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';

const deleteByUserEffectTriggers: Effects.TriggersObject = {};
deleteByUserEffectTriggers["event"] = ["twitch:banned", "twitch:timeout"];

type deleteByUserEffectParams = {
    routeKey: string;
}

export const deleteByUserEffect: Firebot.EffectType<deleteByUserEffectParams> = {
    definition: {
        id: 'thestaticmage:firebot-mage-onscreen-chat:delete-by-user',
        name: 'Delete Messages by User in Chat Overlay',
        description: 'Deletes all chat messages from a specific user in the chat overlay.',
        icon: 'fas fa-user-slash',
        categories: ["scripting"],
        triggers: deleteByUserEffectTriggers
    },
    optionsTemplate: `
        <eos-container header="Effect Information">
            <div class="effect-info">
                <p>This effect deletes all chat messages from a specific user in the chat overlay.</p>
                <p>It is recommended to add this effect to the "Viewer Banned" and "Viewer Timeout" events so that it removes the user's messages from the overlay when they are deleted on Twitch.</p>
            </div>
        </eos-container>
        <eos-container header="Route Key">
            <p class="muted">Which route key should this effect apply to?</p>
            <dropdown-select options="routeKeys" selected="effect.routeKey"></dropdown-select>
        </eos-container>
    `,
    optionsController: ($scope, backendCommunicator: any) => {
        const routeKeys: string[] = backendCommunicator.fireEventSync('thestaticmage:firebot-mage-onscreen-chat:getRouteKeys');
        if (!routeKeys) {
            logger.error("Failed to get route keys for clear chat effect options.");
            return;
        }
        $scope.routeKeys = routeKeys.reduce<Record<string, string>>((acc, key) => {
            acc[key] = key;
            return acc;
        }, {});
        if (!$scope.effect.routeKey) {
            $scope.effect.routeKey = 'default';
        }
    },
    optionsValidator: (effect: deleteByUserEffectParams): string[] => {
        const errors: string[] = [];
        if (!effect.routeKey) {
            errors.push("Route key is required.");
        }
        return errors;
    },
    getDefaultLabel: (effect: deleteByUserEffectParams): string => {
        return effect.routeKey;
    },
    onTriggerEvent: async (event) => {
        const { effect, trigger } = event;

        if (!effect || !effect.routeKey) {
            logger.error("Delete By User Effect: No effect or route key provided.");
            return { success: false };
        }

        const server = getServer(effect.routeKey);
        if (!server) {
            logger.error(`No server found for route key: ${effect.routeKey}`);
            return { success: false };
        }

        // This is a subset of the event data for banned or timeout events
        type bannedOrTimeoutEventData = {
            username: string;
        };

        const eventData = trigger.metadata.eventData as bannedOrTimeoutEventData;
        if (!eventData || !eventData.username) {
            logger.error(`Delete By User Effect: No username provided in event data. Event data: ${JSON.stringify(trigger.metadata.eventData)}`);
            return { success: false };
        }

        const username = eventData.username;
        server.deleteMessagesByUser(username);
        server.log(`Deleted messages for user ${username} on server ${effect.routeKey}`);
        return { success: true };
    }
};
