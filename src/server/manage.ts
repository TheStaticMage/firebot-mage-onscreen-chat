import { ServerInstance } from "./instance";

export const servers: Record<string, ServerInstance> = {};

export function startAllServers(routeKeys: string[]): void {
    routeKeys.forEach((routeKey) => {
        if (!servers[routeKey]) {
            servers[routeKey] = new ServerInstance(routeKey);
        }
        if (servers[routeKey].isRunning()) {
            servers[routeKey].log(`Server on route key ${routeKey} is already running.`);
            return;
        }
        servers[routeKey].log(`Starting server on route key ${routeKey}...`);
        servers[routeKey].start();
    });
}

export function stopAllServers(): void {
    Object.values(servers).forEach((server) => {
        if (!server.isRunning()) {
            return;
        }
        server.log(`Stopping server...`);
        server.stop();
    });
}

export function getServer(routeKey: string): ServerInstance | null {
    return servers[routeKey] || null;
}
