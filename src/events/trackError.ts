import { ManagerEventTypes } from "magmastream";
import { Music } from "../structures/client.ts";
import { Config } from "../config.ts";
import { Colors, ContainerBuilder, MessageFlags, TextDisplayBuilder } from "discord.js";
import { emoji } from "../utils/emoji.ts";
import { Emoji } from "../types.ts";
import { buildTextDisplay } from "../utils/buildTextDisplay.ts";

export function nodeEror(client:Music) {
    client.manager.on(ManagerEventTypes.TrackError, async (player, track,payload)=> {
        player.set("trackError", true);
        const owner = client.users.cache.get(Config.owner);
        if (!player.textChannelId) return;
        const channel = client.channels.cache.get(player.textChannelId)
        if (owner) {
            const ownerDmChannel = await owner.createDM();
            ownerDmChannel.send(`${emoji(Emoji.Cross)} ${player.node.options.identifier}에서 에러가 발생했어요 : ${payload.exception?.message}`);
        }
        console.error(`❌ ${player.node.options.identifier}에서 에러가 발생했어요`, payload.exception?.message); 
    
        player.node.destroy();
        if (channel && channel.isSendable()) {
            const text = buildTextDisplay(`${emoji(Emoji.Cross)} **노래를 불러오는 중 에러가 발생했어요**`, "명령어를 다시 입력해주세요")
            const component = new ContainerBuilder().addTextDisplayComponents(text).setAccentColor(Colors.Red)
            channel.send({
                components : [component],
                flags : MessageFlags.IsComponentsV2
            })
        }
    })
}