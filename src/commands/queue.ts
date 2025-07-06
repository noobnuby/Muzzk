import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    Colors,
    ContainerBuilder,
    MessageFlags,
    SeparatorBuilder,
    SlashCommandBuilder,
    TextDisplayBuilder
} from "discord.js";
import type { Command } from "../structures/command.ts";
import { Emoji, IsNot } from "../types.ts";
import { buildVoiceStateErrorComponent } from "../utils/buildVoiceStateErrorComponent.ts";
import { isPlaying } from "../utils/isPlaying.ts";
import { Queue, type Track } from "magmastream";
import { msToTimeFormatting } from "../utils/msToMinFormatting.ts";
import { emoji } from "../utils/emoji.ts";
import { buildTextDisplay } from "../utils/buildTextDisplay.ts";

const SONGS_PER_PAGE = 10;

function buildPageComponent(
    page: number,
    totalPage: number,
    track: Queue,
    previousButtonDisable: boolean = false,
    nextButtonDisable: boolean = false
) {
    const pageStart = (page - 1) * SONGS_PER_PAGE;
    const pageEnd = pageStart + SONGS_PER_PAGE;
    const pageTrack = track.slice(pageStart, pageEnd);
    const currentTrack = track.current!
    const trackFormat = (song: Track) => `[${song.title}](${song.uri}) (${msToTimeFormatting(song.duration)}) - ${song.requester}`;

    const text = new TextDisplayBuilder().setContent(`## ${emoji(Emoji.Queue)} 대기열`)
    const nowPlaying = buildTextDisplay(`> ${emoji(Emoji.Music)} ${trackFormat(currentTrack)}`)

    const separator = new SeparatorBuilder().setDivider(true);
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId("page_previous")
            .setEmoji(emoji(Emoji.L_Arrow))
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(previousButtonDisable),
        new ButtonBuilder()
            .setCustomId("page")
            .setLabel(`${page} | ${totalPage}`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("page_next")
            .setEmoji(emoji(Emoji.R_Arrow))
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(nextButtonDisable)
    );

    return new ContainerBuilder()
        .addTextDisplayComponents(text)
        .addTextDisplayComponents(nowPlaying)
        .addTextDisplayComponents(pageTrack.map((song) =>
            new TextDisplayBuilder({
                content: `${track.indexOf(song) + 1}. ${trackFormat(song)}`
            })
        ))
        .addSeparatorComponents(separator)
        .addActionRowComponents(actionRow)
        .setAccentColor(Colors.Blurple);
}

export const queue: Command = {
    data: new SlashCommandBuilder()
        .setName("대기열")
        .setDescription("음악의 대기열을 확인해요."),
    async execute(interaction) {
        const player = interaction.client.manager.get(interaction.guild.id);
        if (interaction.channel?.type != ChannelType.GuildText) return;
        const channel = interaction.channel
        const member = interaction.guild.members.cache.get(
            interaction.user.id
        )!;


        if (!player || !isPlaying(player)) {
            interaction.reply(
                buildVoiceStateErrorComponent(IsNot.Playing)
            );
            return;
        }

        let page = {} as { [key in string]: number };
        page[interaction.id] = 1;

        const track = player.queue
        const totalSize = player.queue.size > 0 ? Math.ceil(player.queue.size / SONGS_PER_PAGE) : 1;

        if (page[interaction.id] === totalSize) {
            await interaction.reply({
                components: [buildPageComponent(1, totalSize, track, true, true)],
                flags: MessageFlags.IsComponentsV2,
                allowedMentions: {}
            });
            return;
        }

        await interaction.reply({
            components: [buildPageComponent(1, totalSize, track, true)],
            flags: MessageFlags.IsComponentsV2,
            allowedMentions: {}
        });

        const collector = channel.createMessageComponentCollector();

        collector.on("collect", async i => {
            let nextButtonDisable: boolean = false;
            let previousButtonDisable: boolean = false;

            if (!i.isButton()) return;

            if (["page_previous", "page_next"].includes(i.customId)) {
                switch (i.customId) {
                    case "page_previous":
                        if (page[interaction.id] > 1) page[interaction.id]--;
                        if (page[interaction.id] === 1) previousButtonDisable = true;
                        break;
                    case "page_next":
                        if (page[interaction.id] < totalSize) page[interaction.id]++;
                        if (page[interaction.id] === totalSize) nextButtonDisable = true;
                        break;
                }

                await i.update({
                    components: [buildPageComponent(page[interaction.id], totalSize, track, previousButtonDisable, nextButtonDisable)],
                    flags: MessageFlags.IsComponentsV2,
                    allowedMentions: {}
                })
            }
        })
    },
};
