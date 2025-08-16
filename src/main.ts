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

export const IntegrationConstants = {
    IntegrationId: 'mage-onscreen-chat',
    IntegrationName: 'On-Screen Chat Overlay',
    IntegrationVersion: scriptVersion,
    DefaultServerKey: 'default'
};

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
                default: IntegrationConstants.DefaultServerKey,
                title: 'Route Keys',
                description: 'List of route keys to use for the chat overlay server.',
                tip: 'This is for advanced users only. Most users can leave this blank. Separate multiple route keys with spaces or commas.',
                showBottomHr: true
            },
            staticPath: {
                type: 'filepath',
                default: '',
                title: 'Customized Files Directory Path',
                fileOptions: {
                    directoryOnly: true,
                    filters: [],
                    title: 'Select Customized Files Directory',
                    buttonLabel: 'Choose'
                },
                description: 'You can place static files (HTML/CSS/JS) in this directory to override the built-in ones.',
                tip: 'This is used to customize the display of the overlay. Select the directory containing your custom HTML/CSS/JS files. If you are not using custom files, leave this blank.'
            }
        };
    },
    parametersUpdated: (p: Params) => {
        stopAllServers();
        params = p;
        startAllServers(getRouteKeys(params.routeKeys));
    },
    run: (runRequest: RunRequest<Params>) => {
        firebot = runRequest;
        logger = runRequest.modules.logger;
        params = runRequest.parameters;

        const { effectManager } = firebot.modules;
        effectManager.registerEffect(clearChatEffect);
        effectManager.registerEffect(deleteByUserEffect);
        effectManager.registerEffect(deleteChatMessageEffect);
        effectManager.registerEffect(displayChatMessageEffect);
        effectManager.registerEffect(gigantifyEmoteEffect);

        const routeKeys = getRouteKeys(params.routeKeys);
        startAllServers(routeKeys);

        const { frontendCommunicator } = firebot.modules;
        frontendCommunicator.on('thestaticmage:firebot-mage-onscreen-chat:getRouteKeys', () => {
            return routeKeys;
        });
    },
    stop: () => {
        logger.info("Stopping On-Screen Chat Overlay script.");
        stopAllServers();
    }
};

function getRouteKeys(rk: string): string[] {
    const routeKeys = rk.split(/[\s,\\/]+/);
    routeKeys.push(IntegrationConstants.DefaultServerKey);
    const uniqueRouteKeys = Array.from(new Set(routeKeys.filter(k => k.trim() !== '')));
    return uniqueRouteKeys;
}

export default script;
