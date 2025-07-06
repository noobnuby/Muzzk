import { ManagerEventTypes } from "magmastream";
import { Music } from "../structures/client.ts";
import { messageData } from "./trackStart.ts";

export function playerDestroy(client: Music) {
    client.manager.on(ManagerEventTypes.PlayerDestroy, (player) => {
        if (!messageData.has(player)) return;
        const message = messageData.get(player);

        if (message && message.deletable) {
            message.delete();
        }
    }) 
}