import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { logger } from '../main';
import { getServer } from '../server/manage';

const deleteChatMessageEffectTriggers: Effects.TriggersObject = {};
deleteChatMessageEffectTriggers["event"] = ["twitch:chat-message-deleted"];

type chatMessageDeletedMetadata = {
    username: string;
    messageText: string;
    messageId: string;
}

type deleteChatMessageEffectParams = {
    routeKey: string;
}

export const deleteChatMessageEffect: Firebot.EffectType<deleteChatMessageEffectParams> = {
    definition: {
        id: 'thestaticmage:firebot-mage-onscreen-chat:delete-chat-message',
        name: 'Delete Chat Message in Chat Overlay',
        description: 'Deletes a specific chat message in the chat overlay.',
        icon: 'fas fa-trash-alt',
        categories: ["scripting"],
        triggers: deleteChatMessageEffectTriggers
    },
    optionsTemplate: `
        <eos-container header="Effect Information">
            <div class="effect-info">
                <p>This effect deletes a specific chat message in the chat overlay.</p>
                <p>It is recommended to add this effect to the "Chat Message Deleted" event so that it removes the chat message from the overlay when it is deleted on Twitch.</p>
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
    },
    optionsValidator: (effect: deleteChatMessageEffectParams): string[] => {
        const errors: string[] = [];
        if (!effect.routeKey) {
            errors.push("Route key is required.");
        }
        return errors;
    },
    getDefaultLabel: (effect: deleteChatMessageEffectParams): string => {
        return effect.routeKey;
    },
    onTriggerEvent: async (event) => {
        const { effect, trigger } = event;
        if (!effect || !effect.routeKey) {
            logger.error("Delete chat message effect triggered without valid effect or route key.");
            return { success: false };
        }

        const server = getServer(effect.routeKey);
        if (!server) {
            logger.error(`No server found for route key: ${effect.routeKey}`);
            return { success: false };
        }

        const eventData = trigger.metadata.eventData as chatMessageDeletedMetadata;
        if (!eventData || !eventData.messageId) {
            logger.error(`Delete Chat Message in Overlay: No message ID provided in event data. Event data: ${JSON.stringify(trigger.metadata.eventData)}`);
            return { success: false };
        }

        server.deleteMessage(eventData.messageId);
        server.log(`Deleted message ID: ${eventData.messageId} for route key: ${effect.routeKey}`);
        return { success: true };
    }
};
