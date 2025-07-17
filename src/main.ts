import { Firebot, RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { ParametersConfig } from '@crowbartools/firebot-custom-scripts-types/types/modules/firebot-parameters';
import { Logger } from '@crowbartools/firebot-custom-scripts-types/types/modules/logger';
import { clearChatEffect } from './effects/clear';
import { deleteChatMessageEffect } from './effects/delete';
import { deleteByUserEffect } from './effects/delete-by-user';
import { displayChatMessageEffect } from './effects/display';
import { startAllServers, stopAllServers } from './server/manage';
import { Params } from './types/params';
import { gigantifyEmoteEffect } from './effects/gigantify';

export let firebot: RunRequest<Params>;
export let logger: Logger;
export let params: Params;

const scriptVersion = '0.0.1';

const script: Firebot.CustomScript<Params> = {
    getScriptManifest: () => {
        return {
            name: 'On-Screen Chat Overlay',
            description: 'An on-screen chat overlay powered by Firebot.',
            author: 'The Static Mage',
            version: scriptVersion,
            startupOnly: true,
            firebotVersion: '5'
        };
    },
    getDefaultParameters: (): ParametersConfig<Params> => {
        return {
            routeKeys: {
                type: 'string',
                default: 'mage-onscreen-chat',
                title: 'Route Keys',
                description: 'List of route keys to use for the chat overlay server. These will be used to form the URLs for the chat overlay.',
                tip: 'Specify multiple route keys separated by spaces or commas.'
            },
            staticPath: {
                type: 'filepath',
                default: '',
                title: 'Static Directory Path',
                fileOptions: {
                    directoryOnly: true,
                    filters: [],
                    title: 'Select Static Directory',
                    buttonLabel: 'Select Directory'
                },
                description: 'You can place static files (HTML/CSS/JS) in this directory to override the built-in ones.',
                tip: 'This can be used to serve custom HTML/CSS/JS files for the overlay.'
            }
        };
    },
    parametersUpdated: (p: Params) => {
        stopAllServers();
        params = p;
        startAllServers(params.routeKeys.split(/[\s,]+/));
    },
    run: (runRequest: RunRequest<Params>) => {
        firebot = runRequest;
        logger = runRequest.modules.logger;
        params = runRequest.parameters;

        const { effectManager } = firebot.modules;
        if (!effectManager) {
            logger.error("Effect Manager is not available. Please ensure the Firebot Mage Onscreen Chat script is properly installed.");
            return;
        }

        effectManager.registerEffect(clearChatEffect);
        effectManager.registerEffect(deleteByUserEffect);
        effectManager.registerEffect(deleteChatMessageEffect);
        effectManager.registerEffect(displayChatMessageEffect);
        effectManager.registerEffect(gigantifyEmoteEffect);

        startAllServers(params.routeKeys.split(/[\s,]+/));

        const { frontendCommunicator } = firebot.modules;
        frontendCommunicator.on('thestaticmage:firebot-mage-onscreen-chat:getRouteKeys', () => {
            return params.routeKeys.split(/[\s,]+/);
        });
    },
    stop: () => {
        logger.info("Stopping On-Screen Chat Overlay script.");
        stopAllServers();
    }
};

export default script;
