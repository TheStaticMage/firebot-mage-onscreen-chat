import { FirebotChatMessage } from "./chat-types";

// Based on
// https://github.com/crowbartools/Firebot/blob/master/src/backend/events/twitch-events/chat-message.ts
export type FirebotChatMessageEventMetadata = {
    username: string,
    userId: string,
    userDisplayName: string,
    twitchUserRoles: string[],
    messageText: string,
    messageId: string,
    chatMessage: FirebotChatMessage
};
