import { Music } from "../structures/client.ts";
import { ManagerEventTypes } from "magmastream";

export function socketClosed(client: Music) {
    client.manager.on(ManagerEventTypes.SocketClosed, () => {
        const players = client.manager.players;

        players.forEach((player) => 
            player.destroy()
        );
    })
}