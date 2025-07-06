import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../structures/command.ts";
import { isInVoiceChannel } from "../utils/isInVoiceChannel.ts";
import { isSameVoiceChannel } from "../utils/isSameVoiceChannel.ts";
import { isPlaying } from "../utils/isPlaying.ts";
import { buildVoiceStateErrorComponent } from "../utils/buildVoiceStateErrorComponent.ts";
import { IsNot } from "../types.ts";
import { buildSuccessComponent } from "../utils/buildComponent.ts";

export const autoplay: Command = {
    data: new SlashCommandBuilder()
        .setName("자동재생")
        .setDescription("음악 자동 재생 여부를 설정합니다."),
    async execute(interaction) {
        const client = interaction.client;
        const player = client.manager.get(interaction.guild.id);
        const member = interaction.guild.members.cache.get(interaction.user.id)!;

        if (!player || !isPlaying(player)) {
            interaction.reply(buildVoiceStateErrorComponent(IsNot.Playing))
            return;
        }

        if (!isInVoiceChannel(member)) {
            interaction.reply(buildVoiceStateErrorComponent(IsNot.InVoice));
            return;
        }

        if (!isSameVoiceChannel(member, player)) {
            interaction.reply(buildVoiceStateErrorComponent(IsNot.SameVoiceChannel));
            return;
        }

        player.setAutoplay(!player.isAutoplay, client.user);
        await interaction.reply(buildSuccessComponent(`자동 재생을 ${player.isAutoplay ? "활성화" : "비활성화"}했어요.`));
    },
};
