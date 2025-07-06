import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../structures/command.ts";
import { buildSuccessComponent } from "../utils/buildComponent.ts";
import { buildVoiceStateErrorComponent } from "../utils/buildVoiceStateErrorComponent.ts";
import { IsNot } from "../types.ts";
import { isPlaying } from "../utils/isPlaying.ts";
import { isInVoiceChannel } from "../utils/isInVoiceChannel.ts";
import { isSameVoiceChannel } from "../utils/isSameVoiceChannel.ts";

const choice = [
    {
        name: "랜덤",
        value: "shuffle"
    },
    {
        name: "역순",
        value: "reverse"
    },
    {
        name: "순차",
        value: "roundrobin"
    }
]

export const shuffle: Command = {
    data: new SlashCommandBuilder()
        .setName("셔플")
        .setDescription("현재 대기열을 섞습니다.")
        .addStringOption((option) =>
            option
                .setName("모드")
                .setDescription("셔플 모드를 설정해주세요.")
                .addChoices(choice)
        ),
    async execute(interaction) {
        const member = interaction.guild.members.cache.get(
            interaction.user.id
        )!;
        const player = interaction.client.manager.get(interaction.guild.id);

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

        const mode = (interaction.options.getString("모드") ?? "shuffle") as "shuffle" | "reverse" | "roundrobin"
        let modeName: string;
        switch (mode) {
            case "shuffle":
                player.queue.shuffle();
                modeName = "랜덤"
                break;
            case "reverse":
                player.queue.reverse();
                modeName = "역순"
                break;
            case "roundrobin":
                player.queue.roundRobinShuffle()
                modeName = "순차적"
                break;
        }

        await interaction.reply(buildSuccessComponent(`대기열을 ${modeName}으로 섞었어요.`));
    },
};
