import { GuildMember } from "discord.js";
import { Player } from "magmastream";

export function isSameVoiceChannel(member: GuildMember, player: Player) {
    if (player && player.voiceChannelId !== member.voice.channel?.id) {
        return false;
    }
    return true;
}
