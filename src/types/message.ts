import { FirebotChatMessage } from "./chat-types";

export type Message = {
    id: string;
    action: 'clear' | 'delete' | 'add' | 'removed';
    messageId?: string;
    message?: FirebotChatMessage;
    timestamp: number;
};
