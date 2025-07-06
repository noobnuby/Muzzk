import {
    Colors,
    ContainerBuilder,
    MessageFlags,
    SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../structures/command.ts";
import { buildTextDisplay } from "../utils/buildTextDisplay.ts";
import { Emoji } from "../types.ts";
import { emoji } from "../utils/emoji.ts";

export const ping: Command = {
    data: new SlashCommandBuilder().setName("핑").setDescription("pong!"),
    async execute(interaction) {
        const latency = Date.now() - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        const component = new ContainerBuilder()
            .addTextDisplayComponents(
                buildTextDisplay(
                    `${emoji(Emoji.Pong)} **퐁**`,
                    `${emoji(Emoji.Bot)} 봇 레이턴시 : ${latency}ms`,
                    `${emoji(Emoji.Timer)} API 레이턴시 : ${apiLatency}ms`
                )
            )
            .setAccentColor(Colors.Blurple);

        await interaction.reply({
            components: [component],
            flags: MessageFlags.IsComponentsV2,
        });
    },
};
