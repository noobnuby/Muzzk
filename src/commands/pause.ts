import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../structures/command.ts";
import { isInVoiceChannel } from "../utils/isInVoiceChannel.ts";
import { isSameVoiceChannel } from "../utils/isSameVoiceChannel.ts";
import { isPlaying } from "../utils/isPlaying.ts";
import { buildVoiceStateErrorComponent } from "../utils/buildVoiceStateErrorComponent.ts";
import { IsNot } from "../types.ts";
import { buildFailComponent, buildSuccessComponent } from "../utils/buildComponent.ts";

export const pause: Command = {
    data: new SlashCommandBuilder()
        .setName("일시정지")
        .setDescription("음악을 일시 정지합니다."),
    async execute(interaction) {
        const player = interaction.client.manager.get(interaction.guild.id);
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

        if (player.paused) {
            interaction.reply(buildFailComponent("이미 음악이 일시 정지 상태에요."))
            return;
        }
        player.pause(true);

        await interaction.reply(buildSuccessComponent("음악을 일시 정지했어요."));
    },
};
