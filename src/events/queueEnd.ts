import { ManagerEventTypes, Player } from "magmastream";
import { Music } from "../structures/client.ts";
import { queue } from "../commands/play.ts";

export function queueEnd(client: Music) {
    client.manager.on(ManagerEventTypes.QueueEnd, (player: Player) => {
        player.destroy();
        queue.delete(player);
    })
}