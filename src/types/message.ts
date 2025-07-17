import { FirebotChatMessage } from "./chat-types";

export type Message = {
    id: string;
    action: 'clear' | 'delete' | 'add' | 'removed' | 'gigantify_an_emote';
    messageId?: string;
    message?: FirebotChatMessage;
    timestamp: number;
};
