import {
    ContainerBuilder,
    MessageFlags,
    SectionBuilder,
    SlashCommandBuilder,
    TextChannel,
    ThumbnailBuilder,
} from "discord.js";
import type { Command } from "../structures/command.ts";
import { LoadTypes, Player, StateTypes, type Track } from "magmastream";
import { isInVoiceChannel } from "../utils/isInVoiceChannel.ts";
import { isSameVoiceChannel } from "../utils/isSameVoiceChannel.ts";
import { isPlaying } from "../utils/isPlaying.ts";
import { buildVoiceStateErrorComponent } from "../utils/buildVoiceStateErrorComponent.ts";
import { Emoji, IsNot } from "../types.ts";
import getColors from "get-image-colors";
import { isNodeConnect } from "../utils/isNodeConnect.ts";
import { buildFailComponent } from "../utils/buildComponent.ts";
import { buildTextDisplay } from "../utils/buildTextDisplay.ts";
import { emoji } from "../utils/emoji.ts";

export const queue = new Map<Player,Track[]>();

export const play: Command = {
    data: new SlashCommandBuilder()
        .setName("재생")
        .setDescription("음악을 재생합니다.")
        .addStringOption((option) =>
            option
                .setName("검색어")
                .setDescription("검색할 음악이나 URL을 입력해 주세요.")
                .setRequired(true)
            //.setAutocomplete(true)
        ),
    async execute(interaction) {
        const client = interaction.client;
        const guild = interaction.guild;
        const member = guild.members.cache.get(interaction.user.id)!;
        const query = interaction.options.getString("검색어");
        let player = client.manager.get(guild.id);

        if (!isNodeConnect(client)) {
            interaction.reply(
                buildFailComponent(
                    "현재 봇과 Node의 연결이 끊어져 있는 상태입니다."
                )
            );
            return;
        }

        if (!isInVoiceChannel(member)) {
            interaction.reply(buildVoiceStateErrorComponent(IsNot.InVoice));
            return;
        }
        if (player && !isSameVoiceChannel(member, player)) {
            interaction.reply(
                buildVoiceStateErrorComponent(IsNot.SameVoiceChannel)
            );
            return;
        }

        const res = await client.manager.search(query!, member.user);

        if (
            res.loadType == LoadTypes.Empty ||
            res.loadType === LoadTypes.Error
        ) {
            await interaction.reply(buildFailComponent("검색 결과가 없어요."));
            return;
        }

        try {
            player = client.manager.create({
                guildId: guild.id,
                voiceChannelId: member.voice.channel.id,
                textChannelId: (interaction.channel as TextChannel).id,
                selfDeafen: true,
                volume: 100,
            });

            if (player.state !== StateTypes.Connected) player.connect();
        } catch (e) {
            await interaction.reply(buildFailComponent(`플레이어를 만드는 동안 오류가 발생했습니다. ${e}`));
            return;
        }

        const tracks = queue.get(player) ?? [];

        switch (res.loadType) {
            case LoadTypes.Track:
            case LoadTypes.Search:
                const track = res.tracks[0];
                player.queue.add(track);

                queue.set(player, [...tracks, track]);

                if (!isPlaying(player) && !player.queue.size)
                    await player.play();

                const text = buildTextDisplay(
                    `${emoji(Emoji.Queue_Add)} **음악을 대기열에 추가했어요.**`,
                    `[${track.title}](${track.uri})`
                );
                const thumbnail = new ThumbnailBuilder().setURL(
                    track.artworkUrl
                );

                const color = await getColors(track.artworkUrl);

                const section = new SectionBuilder()
                    .setThumbnailAccessory(thumbnail)
                    .addTextDisplayComponents(text);
                const component = new ContainerBuilder()
                    .setAccentColor(color[0].rgb())
                    .addSectionComponents(section);

                await interaction.reply({
                    components: [component],
                    flags: MessageFlags.IsComponentsV2,
                });

                break;
            case LoadTypes.Playlist:
                if (!res.playlist) return;
                res.tracks = res.playlist.tracks;
                player.queue.add(res.tracks);

                queue.set(player, [...tracks, ...res.tracks]);

                if (
                    !isPlaying(player) &&
                    !player.paused &&
                    player.queue.size === res.tracks.length
                )
                    await player.play();

                const playlistText = buildTextDisplay(
                    `${emoji(Emoji.Queue_Add)} **음악 ${res.tracks.length + 1}곡을 대기열에 추가했어요.**`,
                    `[${res.playlist.name}](${query})`
                );

                const playlistThumbnail = new ThumbnailBuilder().setURL(
                    player.queue.current!.artworkUrl
                    // res.playlist.tracks[0].artworkUrl
                );

                const playlistColor = await getColors(
                    player.queue.current!.artworkUrl
                    // res.playlist.tracks[0].artworkUrl
                );

                const playlistSection = new SectionBuilder()
                    .setThumbnailAccessory(playlistThumbnail)
                    .addTextDisplayComponents(playlistText);
                const playlistComponent = new ContainerBuilder()
                    .setAccentColor(playlistColor[0].rgb())
                    .addSectionComponents(playlistSection);

                await interaction.reply({
                    components: [playlistComponent],
                    flags: MessageFlags.IsComponentsV2,
                });

                break;
        }
    },
};
