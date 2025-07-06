import { ManagerEventTypes, Player, type Track } from "magmastream";
import { Music } from "../structures/client.ts";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Colors,
    ContainerBuilder,
    Message,
    MessageFlags,
    SectionBuilder,
    SeparatorBuilder,
    TextDisplayBuilder,
    ThumbnailBuilder,
} from "discord.js";
import { buildTextDisplay } from "../utils/buildTextDisplay.ts";
import { msToTimeFormatting } from "../utils/msToMinFormatting.ts";
import { Emoji, Repeat } from "../types.ts";
import { queue } from "../commands/play.ts";
import { emoji } from "../utils/emoji.ts";

function buildCurrentSongComponent(
    song: Track,
    paused: boolean,
    repeat: Repeat,
    previousButtonDisable: boolean,
) {
    const text = new TextDisplayBuilder().setContent(`## ${emoji(Emoji.Playing)} 재생중`);
    const nowPlaying = buildTextDisplay(
        `[${song?.title}](${song.uri})`,
        `${emoji(Emoji.Timer)} 곡 길이 : ${msToTimeFormatting(song.duration)}\n${emoji(Emoji.User)} 요청자 : ${song.requester}`,
    );
    const thumbnail = new ThumbnailBuilder().setURL(song.artworkUrl);

    const separator = new SeparatorBuilder().setDivider(true);
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId("pause")
            .setEmoji(paused ? "▶️" : "⏸️")
            .setStyle(paused ? ButtonStyle.Primary : ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("previous")
            .setEmoji("⏮️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(previousButtonDisable),
        new ButtonBuilder()
            .setCustomId("stop")
            .setEmoji("⏹️")
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId("next")
            .setEmoji("⏭️")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("repeat")
            .setEmoji((repeat === Repeat.One) ?  "🔂" : "🔁")
            .setStyle((repeat === Repeat.One || repeat === Repeat.Queue) ? ButtonStyle.Primary : ButtonStyle.Secondary)
    );

    const section = new SectionBuilder()
        .addTextDisplayComponents(text)
        .addTextDisplayComponents(nowPlaying)
        .setThumbnailAccessory(thumbnail)

    return new ContainerBuilder()
        .addSectionComponents(section)
        .addSeparatorComponents(separator)
        .addActionRowComponents(actionRow)
        .setAccentColor(Colors.Blurple);
}

export const messageData = new Map<Player, Message>();

export function trackStart(client: Music) {
    client.manager.on(ManagerEventTypes.TrackStart, async (player) => {
        if (!player.textChannelId) return;
        const channel = client.channels.cache.get(player.textChannelId);
        const repeatState = () => {
            if(player.trackRepeat) return Repeat.One;
            else if(player.queueRepeat) return Repeat.Queue;
            else return Repeat.Off
        }

        if (messageData.has(player) && messageData.get(player) && messageData.get(player)!.deletable)
            messageData.get(player)!.delete();

        if (channel && channel.isSendable()) {
            const message = await channel.send({
                components: [
                    buildCurrentSongComponent(
                        player.queue.current!,
                        player.paused,
                        repeatState(),
                        !queue.get(player)![queue.get(player)!.indexOf(player.queue.current as Track) - 1]
                    ),
                ],
                flags: MessageFlags.IsComponentsV2,
                allowedMentions: {}
            });

            messageData.set(player, message);

            const collector = message.createMessageComponentCollector();

            collector.on("collect", async (interaction) => {

                if (["pause", "previous", "stop", "next", "repeat"].includes(interaction.customId)) {
                    switch (interaction.customId) {
                        case "pause":
                            player.pause(!player.paused);
                            break;
                        case "previous":
                            const previousTrack = queue.get(player)![queue.get(player)!.indexOf(player.queue.current!) - 1];
                            player.queue.unshift(previousTrack, player.queue.current!);
                            player.stop();
                            break;
                        case "stop":
                            player.destroy();
                            break;
                        case "next":
                            player.stop();
                            break;
                        case "repeat":
                            if(repeatState() === Repeat.Off) {
                                player.setTrackRepeat(true);
                            } else if(repeatState() === Repeat.One) {
                                player.setTrackRepeat(false);
                                player.setQueueRepeat(true);
                            } else if(repeatState() === Repeat.Queue) {
                                player.setQueueRepeat(false);
                                player.setTrackRepeat(false);
                            }
                            break;
                    }

                    await interaction.update({
                        components: [
                            buildCurrentSongComponent(
                                player.queue.current!,
                                player.paused,
                                repeatState(),
                                !queue.get(player)![queue.get(player)!.indexOf(player.queue.current as Track) - 1]
                            ),
                        ],
                        flags: MessageFlags.IsComponentsV2,
                        allowedMentions: {}
                    });
                }
            });
        }
    });
}
