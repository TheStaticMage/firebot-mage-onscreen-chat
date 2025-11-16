import type { Request, Response } from "express";
import { firebot, IntegrationConstants, logger, params } from '../main';
import { Message } from '../types/message';
import { ChatServerPayload, PollPayload } from "../types/payloads";

// These need to stay as 'require' to allow the embedded static files to be used
// when the script is run in Firebot.
const chatJs = require("../../static/chat.js");
const chatCss = require("../../static/chat.css");
const indexHtml = require("../../static/index.html");

const messageCleanupInterval = 1000 * 120; // milliseconds
const messageTtl = 1000 * 60 * 30; // milliseconds
const pollInterval = 200; // milliseconds

export class ServerInstance {
    private isRegistered = false;
    private messageCleaner: NodeJS.Timeout | null = null;
    private messages = new Map<string, Message>();
    private pollTimeout: Record<string, NodeJS.Timeout> = {};
    private serverKey: string;

    constructor(key: string) {
        this.serverKey = key;
    }

    isRunning(): boolean {
        return this.isRegistered;
    }

    start(): void {
        if (this.isRegistered) {
            this.log(`Routes for ${this.serverKey} are already registered.`);
            return;
        }

        const { httpServer } = firebot.modules;
        const prefix = `${IntegrationConstants.IntegrationId}/${this.serverKey}`;

        httpServer.registerCustomRoute(prefix, "/poll.json", "GET", async (req, res) => {
            this.handlePoll(req, res);
        });

        httpServer.registerCustomRoute(prefix, "/chat.js", "GET", async (req, res) => {
            this.getStaticFile(req.path, res);
        });

        httpServer.registerCustomRoute(prefix, "/chat.css", "GET", async (req, res) => {
            this.getStaticFile(req.path, res);
        });

        httpServer.registerCustomRoute(prefix, "/index.html", "GET", async (req, res) => {
            this.getStaticFile(req.path, res);
        });

        httpServer.registerCustomRoute(prefix, "/", "GET", async (req, res) => {
            res.redirect(`${req.originalUrl.replace(/\/$/, '')}/index.html`);
        });

        this.messageCleaner = setInterval(() => {
            this.cleanOldMessages();
        }, messageCleanupInterval);
    }

    stop(): void {
        if (!this.isRegistered) {
            this.log(`Routes for server ${this.serverKey} are not registered.`);
            return;
        }

        for (const key in this.pollTimeout) {
            if (Object.prototype.hasOwnProperty.call(this.pollTimeout, key)) {
                clearTimeout(this.pollTimeout[key]);
            }
        }
        this.pollTimeout = {};

        if (this.messageCleaner) {
            clearInterval(this.messageCleaner);
            this.messageCleaner = null;
        }

        const { httpServer } = firebot.modules;
        const prefix = `${IntegrationConstants.IntegrationId}/${this.serverKey}`;
        httpServer.unregisterCustomRoute(prefix, "/poll.json", "GET");
        httpServer.unregisterCustomRoute(prefix, "/chat.js", "GET");
        httpServer.unregisterCustomRoute(prefix, "/chat.css", "GET");
        httpServer.unregisterCustomRoute(prefix, "/index.html", "GET");
        httpServer.unregisterCustomRoute(prefix, "", "GET");

        this.isRegistered = false;
    }

    log(message: string): void {
        logger.info(`[${this.serverKey}] ${message}`);
    }

    postMessage(payload: ChatServerPayload): void {
        if (!payload.message.id) {
            throw new Error('Message ID must be set when posting a message.');
        }

        const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidv4Regex.test(payload.message.id)) {
            throw new Error('Invalid message: "id" does not contain a valid UUIDv4');
        }

        const messageId = payload.message.id;
        const msg: Message = {
            id: messageId,
            action: 'add',
            messageId: messageId,
            message: payload.message,
            timestamp: payload.timestamp || Date.now()
        };

        this.messages.set(messageId, msg);

        this.log(`Received message ID: ${msg.id}: total messages: ${this.messages.size}`);
    }

    clearMessages(): void {
        this.messages.clear();

        const eventId = crypto.randomUUID();
        const msg: Message = {
            id: eventId,
            action: 'clear',
            timestamp: Date.now()
        };
        this.messages.set(eventId, msg);

        this.log('All messages cleared');
    }

    deleteMessage(messageId: string): void {
        if (!messageId) {
            this.log('Invalid request: "messageId" is required');
            return;
        }

        if (!this.messages.has(messageId)) {
            this.log(`Message ID ${messageId} not found for deletion.`);
            return;
        }

        const eventId = crypto.randomUUID();
        const msg: Message = {
            id: eventId,
            action: 'delete',
            messageId: messageId,
            timestamp: Date.now()
        };
        this.messages.set(eventId, msg);

        // We keep this in case the polling is from this message, but mark it as
        // removed so it will not ever show up.
        const originalMsg = this.messages.get(messageId);
        if (originalMsg) {
            originalMsg.action = 'removed';
        }

        this.log(`Deleted message ID: ${messageId}`);
    }

    deleteMessagesByUser(username: string): void {
        if (!username) {
            throw new Error('Invalid request: "username" is required');
        }

        const messageIdsToDelete = Array.from(this.messages.entries())
            .filter(([, msg]) => msg.action === 'add' && msg.message?.username === username)
            .map(([id]) => id);

        if (messageIdsToDelete.length === 0) {
            this.log(`No messages found for user: ${username}`);
            return;
        }

        for (const messageId of messageIdsToDelete) {
            const eventId = crypto.randomUUID();
            const msg: Message = {
                id: eventId,
                action: 'delete',
                messageId: messageId,
                timestamp: Date.now()
            };
            this.messages.set(eventId, msg);

            // Mark the original message as removed
            const originalMsg = this.messages.get(messageId);
            if (originalMsg) {
                originalMsg.action = 'removed';
            }
        }

        this.log(`Deleted messages for user: ${username}`);
    }

    getMessages(after = ''): Message[] {
        if (after === '') {
            return Array.from(this.messages.values());
        }

        const messageIndex = Array.from(this.messages.keys()).indexOf(after);
        if (messageIndex === -1) {
            this.log(`Message ID ${after} not found, returning all messages`);
            return Array.from(this.messages.values());
        }

        return Array.from(this.messages.values()).slice(messageIndex + 1);
    }

    private cleanOldMessages(): void {
        const now = Date.now();
        const keysToDelete = Array.from(this.messages.entries()).filter(([, msg]) => {
            return msg.timestamp < now - messageTtl;
        });
        if (keysToDelete.length === 0) {
            return;
        }

        for (const [id] of keysToDelete) {
            this.messages.delete(id);
        }
        this.log(`Cleaned up ${keysToDelete.length} old messages. Remaining messages: ${this.messages.size}`);
    }

    private getStaticFile(path: string, res: Response): void {
        const { fs } = firebot.modules;
        if (params && params.staticPath && fs.existsSync(params.staticPath)) {
            const fileName = path.split('/').pop() || path;
            const fileExtension = fileName.split('.').pop();
            const tryFiles = [`${this.serverKey}.${fileExtension}`, fileName];
            for (const file of tryFiles) {
                try {
                    const filePath = `${params.staticPath}/${file}`;
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    switch (fileExtension) {
                        case 'js':
                            res.setHeader('Content-Type', 'application/javascript');
                            break;
                        case 'css':
                            res.setHeader('Content-Type', 'text/css');
                            break;
                        case 'html':
                            res.setHeader('Content-Type', 'text/html');
                            break;
                        default:
                            res.status(404).send('Not found');
                            return;
                    }
                    res.send(fileContent);
                    return;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (_: any) {
                    // No need to log here, just try the next file
                }
            }
        }

        // Fallback to built-in static files
        const filename = path.split('/').pop() || path;
        switch (filename) {
            case 'chat.js':
                res.setHeader('Content-Type', 'application/javascript');
                res.send(chatJs);
                return;
            case 'chat.css':
                res.setHeader('Content-Type', 'text/css');
                res.send(chatCss);
                return;
            case 'index.html':
            case '':
                res.setHeader('Content-Type', 'text/html');
                res.send(indexHtml);
                return;
            default:
                logger.warn(`Static file not found: ${path}`);
                res.status(404).send('Not found');
        }
    }

    private handlePoll(req: Request, res: Response): void {
        const token = req.query.token as string;

        // Respond when we have new instructions
        function doPoll(that: ServerInstance, uuid = ''): void {
            if (uuid) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete (that.pollTimeout[uuid]);
            }

            let result: Message[] = [];

            if (token === undefined || token === '') {
                result.push(...that.getMessages());
            } else if (token !== '-' && !that.messages.has(token)) {
                result.push(...that.getMessages());
            } else if (that.messages.has(token)) {
                result.push(...that.getMessages(token));
            }

            const lastMessageId = result.length > 0 ? result[result.length - 1].id : '-';
            result = result.filter(msg => msg.action !== 'removed');

            if (result.length > 0) {
                that.requestLogger(req, `Returning ${result.length} messages since token: ${token}`);
                const response: PollPayload = {
                    messages: result,
                    token: lastMessageId,
                    enableGigantifiedEmotes: params.enableGigantifiedEmotes !== false
                };
                res.json(response);
            } else {
                const newUuid = crypto.randomUUID();
                that.pollTimeout[newUuid] = setTimeout(() => {
                    doPoll(that, newUuid);
                }, pollInterval);
            }
        }

        doPoll(this);
    }

    private requestLogger(req: Request, message: string): void {
        this.log(`${req.method} ${req.originalUrl} - ${message}`);
    }
}
