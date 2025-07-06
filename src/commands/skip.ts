import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../structures/command.ts";
import { isPlaying } from "../utils/isPlaying.ts";
import { isInVoiceChannel } from "../utils/isInVoiceChannel.ts";
import { isSameVoiceChannel } from "../utils/isSameVoiceChannel.ts";
import { buildVoiceStateErrorComponent } from "../utils/buildVoiceStateErrorComponent.ts";
import { IsNot } from "../types.ts";
import { buildSuccessComponent } from "../utils/buildComponent.ts";

export const skip: Command = {
    data: new SlashCommandBuilder()
        .setName("스킵")
        .setDescription("현재 재생중인 음악을 스킵합니다.")
        .addIntegerOption((option) =>
            option
                .setName("개수")
                .setDescription("스킵할 곡의 개수를 입력해주세요.")
                .setMinValue(1)
        ), //TODO : 플리 스킵
    async execute(interaction) {
        const player = interaction.client.manager.get(interaction.guild.id);
        const member = interaction.guild.members.cache.get(interaction.user.id)!;

        if (!player || !isPlaying(player)) {
            interaction.reply(buildVoiceStateErrorComponent(IsNot.Playing));
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

        const value = interaction.options.getInteger("개수") ?? 1

        player.stop(value);
        await interaction.reply(buildSuccessComponent("노래를 스킵했어요."));
    },
};
