import { Events } from "discord.js";
import { Music } from "../structures/client.ts";
import { commands } from "../commands/index.ts";

export function clientCreate(client: Music) {
    client.once(Events.ClientReady, (bot) => {
        console.log(`✅ ${bot.user.tag}에 연결되었습니다`);
        commands.forEach((command) => {
            client.commands.set(command.data.name, command);
        });
        if (client.application)
            client.application.commands.set(
                commands.map((command) => command.data.toJSON())
            );

        if (client.user) client.manager.init(client.user.id);
    });
}
