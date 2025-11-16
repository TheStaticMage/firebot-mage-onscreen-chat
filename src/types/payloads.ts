import { FirebotChatMessage } from "./chat-types";
import { Message } from "./message";

export interface ChatServerPayload {
    message: FirebotChatMessage;
    timestamp: number; // Timestamp in milliseconds
};

export interface PollPayload {
    messages: Message[];
    token: string;
    enableGigantifiedEmotes?: boolean;
}
