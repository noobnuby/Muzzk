import { SlashCommandBuilder } from "discord.js";
import { type Command } from "../structures/command.ts";
import { isInVoiceChannel } from "../utils/isInVoiceChannel.ts";
import { isSameVoiceChannel } from "../utils/isSameVoiceChannel.ts";
import { isPlaying } from "../utils/isPlaying.ts";
import { buildVoiceStateErrorComponent } from "../utils/buildVoiceStateErrorComponent.ts";
import { IsNot } from "../types.ts";
import { buildSuccessComponent } from "../utils/buildComponent.ts";

export const stop: Command = {
    data: new SlashCommandBuilder()
        .setName("정지")
        .setDescription(
            "음악 재생을 중단하고, 봇을 음성 채널에서 퇴장시킵니다."
        ),
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

        await player.destroy(true);

        interaction.reply(buildSuccessComponent("음악을 정지했어요."));
    },
};
