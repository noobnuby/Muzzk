import { Events } from "discord.js";
import { Music } from "../structures/client.ts";

export function raw(client: Music) {
    client.on(Events.Raw, (data) => {
        client.manager.updateVoiceState(data);
    });
}