import { ManagerEventTypes, PlayerStateEventTypes, type Track } from "magmastream";
import { Music } from "../structures/client.ts";
import { queue } from "../commands/play.ts";

type QueueChangeEvent = {
    changeType: "add" | "remove" | "clear" | "shuffle" | "roundRobin" | "userBlock" | "autoPlayAdd",
    tracks? : Track[]
}


export function playerStateUpdate(client: Music) {
    client.manager.on(ManagerEventTypes.PlayerStateUpdate, (oldPlayer, newPlayer, changeType) => {
        if (changeType.changeType === PlayerStateEventTypes.QueueChange && (changeType.details as QueueChangeEvent).changeType === "autoPlayAdd") {
            if (queue.has(newPlayer)) {
                queue.get(newPlayer)!.push((changeType.details as QueueChangeEvent).tracks![0])
            }
        }
    })
}