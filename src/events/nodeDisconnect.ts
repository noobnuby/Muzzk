import { Music } from "../structures/client.ts";
import { ManagerEventTypes, Node } from "magmastream";

export function nodeDisconnect(client: Music) {
    client.manager.on(ManagerEventTypes.NodeDisconnect, (node: Node) => {
        console.log(
            `💥 ${node.options.identifier} 노드에 연결이 끊어졌습니다.`
        );
    });
}
