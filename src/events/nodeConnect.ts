import { ManagerEventTypes } from "magmastream";
import { Music } from "../structures/client.ts";

export function nodeConnect(client: Music) {
    client.manager.on(ManagerEventTypes.NodeConnect, (node) => {
        console.log(`✅ ${node.options.identifier} 노드에 연결되었습니다.`);
    });
}
