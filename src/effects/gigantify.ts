import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { logger } from '../main';
import { getServer } from '../server/manage';
import { GigantifyMetadata } from '../types/gigantify-metadata';

const displayChatMessageEffectTriggers: Effects.TriggersObject = {};
displayChatMessageEffectTriggers["event"] = ["twitch:bits-powerup-gigantified-emote"];
displayChatMessageEffectTriggers["manual"] = true;

type effectParams = {
    routeKey: string;
}

export const gigantifyEmoteEffect: Firebot.EffectType<effectParams> = {
    definition: {
        id: 'thestaticmage:firebot-mage-onscreen-chat:gigantify-emote',
        name: 'Gigantify Emote in Chat Overlay',
        description: 'Gigantifies an emote on the chat overlay.',
        icon: 'fas fa-comment',
        categories: ["scripting"],
        triggers: displayChatMessageEffectTriggers
    },
    optionsTemplate: `
        <eos-container header="Effect Information">
            <div class="effect-info">
                <p>This effect gigantifies an emote in the chat overlay.</p>
                <p>It is recommended to add this effect to the "Power-up: Gigantify an Emote" event to transmit the information when someone gigantifies an emote on Twitch.</p>
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
            logger.error("Failed to get route keys.");
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
    optionsValidator: (effect: effectParams): string[] => {
        const errors: string[] = [];
        if (!effect.routeKey) {
            errors.push("Route key is required.");
        }
        return errors;
    },
    getDefaultLabel: (effect: effectParams): string => {
        return effect.routeKey;
    },
    onTriggerEvent: async (event) => {
        const { effect, trigger } = event;
        if (!effect || !effect.routeKey) {
            logger.error("Effect triggered without valid effect or route key.");
            return { success: false };
        }

        const server = getServer(effect.routeKey);
        if (!server) {
            logger.error(`No server found for route key: ${effect.routeKey}`);
            return { success: false };
        }

        // Metadata varies based on trigger type
        let username: string;
        let cheerMessage: string;
        let emoteName: string;
        if (trigger.type === 'manual') {
            const metadata = trigger.metadata;
            username = metadata.username || '';
            cheerMessage = typeof metadata.cheerMessage === 'string' ? metadata.cheerMessage : '';
            emoteName = typeof metadata.emoteName === 'string' ? metadata.emoteName : '';
        } else {
            const metadata = trigger.metadata.eventData as GigantifyMetadata;
            username = metadata.username || '';
            cheerMessage = metadata.cheerMessage || '';
            emoteName = metadata.emoteName || '';
        }

        if (!username || !cheerMessage || !emoteName) {
            logger.error(`Invalid metadata for gigantify emote effect: username or cheerMessage or emoteName is missing. ${JSON.stringify(trigger.metadata)}`);
            return { success: false };
        }

        // The emote that is gigantified is at the end of the cheerMessage.
        // For example cheerMessage = 'test thesta174Sevastopol test thesta174Mittenssleek' and emoteName = 'thesta174Mittenssleek'.
        server.gigantifyEmote(username, cheerMessage, emoteName);
        logger.debug(`Gigantify an Emote for server ${effect.routeKey}`);
        return { success: true };
    }
};
