import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../structures/command.ts";
import { isInVoiceChannel } from "../utils/isInVoiceChannel.ts";
import { isSameVoiceChannel } from "../utils/isSameVoiceChannel.ts";
import { isPlaying } from "../utils/isPlaying.ts";
import { josa, numberToHangul } from "es-hangul";
import { buildVoiceStateErrorComponent } from "../utils/buildVoiceStateErrorComponent.ts";
import { IsNot } from "../types.ts";
import { buildSuccessComponent } from "../utils/buildComponent.ts";

export const volume: Command = {
    data: new SlashCommandBuilder()
        .setName("볼륨")
        .setDescription("음악의 볼륨을 조절합니다.")
        .addIntegerOption((option) =>
            option
                .setName("볼륨")
                .setDescription("0 ~ 100사이의 값을 입력해 주세요.")
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
        ),
    async execute(interaction) {
        const value = interaction.options.getInteger("볼륨");
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


        player.setVolume(value!);

        await interaction.reply(buildSuccessComponent(`볼륨을 ${value!}${josa.pick(numberToHangul(value!), "으로/로")} 설정했어요.`));
    },
};
