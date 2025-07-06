import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../structures/command.ts";
import { isInVoiceChannel } from "../utils/isInVoiceChannel.ts";
import { isSameVoiceChannel } from "../utils/isSameVoiceChannel.ts";
import { IsNot } from "../types.ts";
import {
    buildFailComponent,
    buildSuccessComponent,
} from "../utils/buildComponent.ts";
import { buildVoiceStateErrorComponent } from "../utils/buildVoiceStateErrorComponent.ts";
import { isPlaying } from "../utils/isPlaying.ts";

export const resume: Command = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("일시 정지된 음악을 재생합니다."),
    async execute(interaction) {
        const player = interaction.client.manager.get(interaction.guild.id);
        const member = interaction.guild.members.cache.get(interaction.user.id)!;

        if (!player || !isPlaying(player)) {
            interaction.reply(
                buildVoiceStateErrorComponent(IsNot.Playing)
            );
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

        if (player && player.paused)
            await player.pause(false);
        else {
            interaction.reply(
                buildFailComponent("현재 음악이 정지 상태가 아니에요.")
            );
            return;
        }

        await interaction.reply(
            buildSuccessComponent("음악을 다시 재생합니다.")
        );
    },
};
