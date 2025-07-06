import { Node } from "magmastream";
import { Music } from "../structures/client.ts";

export function isNodeConnect(client: Music) {
    const connectNodes = (node: Node) => node.connected

    if (client.manager.nodes.every(connectNodes)) {
        return true
    }

    return false
}