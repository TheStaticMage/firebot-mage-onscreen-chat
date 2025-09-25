import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { logger } from '../main';
import { getServer } from '../server/manage';

const clearChatEffectTriggers: Effects.TriggersObject = {};
clearChatEffectTriggers["event"] = [
    "mage-kick-integration:chat-cleared",
    "twitch:chat-cleared"
];

type clearChatEffectParams = {
    routeKey: string;
}

export const clearChatEffect: Firebot.EffectType<clearChatEffectParams> = {
    definition: {
        id: 'thestaticmage:firebot-mage-onscreen-chat:clear-chat',
        name: 'Clear Messages in Chat Overlay',
        description: 'Clears all chat messages in the chat overlay.',
        icon: 'fas fa-trash',
        categories: ["scripting"],
        triggers: clearChatEffectTriggers
    },
    optionsTemplate: `
        <eos-container header="Effect Information">
            <div class="effect-info">
                <p>This effect clears all chat messages in the chat overlay.</p>
                <p>It is recommended to add this effect to the "Chat Cleared" event so that it clears the chat overlay when the chat is cleared on Twitch.</p>
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
    optionsValidator: (effect: clearChatEffectParams): string[] => {
        const errors: string[] = [];
        if (!effect.routeKey) {
            errors.push("Route key is required.");
        }
        return errors;
    },
    getDefaultLabel: (effect: clearChatEffectParams): string => {
        return effect.routeKey;
    },
    onTriggerEvent: async (event) => {
        const { effect } = event;
        if (!effect || !effect.routeKey) {
            logger.error("Clear chat effect triggered without valid effect or route key.");
            return { success: false };
        }

        const server = getServer(effect.routeKey);
        if (!server) {
            logger.error(`No server found for route key: ${effect.routeKey}`);
            return { success: false };
        }

        server.clearMessages();
        server.log(`Cleared all messages for route key: ${effect.routeKey}`);

        return { success: true };
    }
};
