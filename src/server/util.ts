import { logger } from '../main';
import * as express from "express";

export function httpLogger(req: express.Request, message: string) {
    const serverPort = req.socket.localPort;
    logger.info(`[${serverPort}] ${req.method} ${req.originalUrl} - ${message}`);
}
