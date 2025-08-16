import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { logger } from '../main';
import { getServer } from '../server/manage';
import { FirebotChatMessageEventMetadata } from '../types/chat-message';
import { FirebotChatMessage } from '../types/chat-types';
import { ChatServerPayload } from '../types/payloads';

const displayChatMessageEffectTriggers: Effects.TriggersObject = {};
displayChatMessageEffectTriggers["command"] = true;
displayChatMessageEffectTriggers["event"] = ["twitch:chat-message"];
displayChatMessageEffectTriggers["manual"] = true;

type displayChatMessageEffectParams = {
    routeKey: string;
}

export const displayChatMessageEffect: Firebot.EffectType<displayChatMessageEffectParams> = {
    definition: {
        id: 'thestaticmage:firebot-mage-onscreen-chat:display-chat-message',
        name: 'Display Message in Chat Overlay',
        description: 'Displays a chat message on the chat overlay.',
        icon: 'fas fa-comment',
        categories: ["scripting"],
        triggers: displayChatMessageEffectTriggers
    },
    optionsTemplate: `
        <eos-container header="Effect Information">
            <div class="effect-info">
                <p>This effect transmits a chat message to the chat overlay server.</p>
                <p>It is recommended to add this effect to the "Chat Message" event so that it sends the chat message to the overlay server when a new message is received on Twitch.</p>
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
    optionsValidator: (effect: displayChatMessageEffectParams): string[] => {
        const errors: string[] = [];
        if (!effect.routeKey) {
            errors.push("Route key is required.");
        }
        return errors;
    },
    getDefaultLabel: (effect: displayChatMessageEffectParams): string => {
        return effect.routeKey;
    },
    onTriggerEvent: async (event) => {
        const { effect, trigger } = event;
        if (!effect || !effect.routeKey) {
            logger.error("Transmit chat message effect triggered without valid effect or route key.");
            return { success: false };
        }

        const server = getServer(effect.routeKey);
        if (!server) {
            logger.error(`No server found for route key: ${effect.routeKey}`);
            return { success: false };
        }

        // Metadata varies based on trigger type
        let message: FirebotChatMessage;

        if (trigger.type === 'command' || trigger.type === 'manual') {
            const metadata = trigger.metadata as FirebotChatMessageEventMetadata;
            message = metadata.chatMessage;
        } else {
            const metadata = trigger.metadata.eventData as FirebotChatMessageEventMetadata;
            message = metadata.chatMessage;
        }

        const data: ChatServerPayload = {
            message: message,
            timestamp: Date.now()
        };

        server.postMessage(data);
        logger.debug(`Transmit Chat Message: Successfully sent message to server for route key ${effect.routeKey}`);
        return { success: true };
    }
};
