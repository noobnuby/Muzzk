import { GuildMember, type VoiceBasedChannel } from 'discord.js';

type Voice = {
    voice : {
        channel : VoiceBasedChannel
    }
}

export function isInVoiceChannel(member: GuildMember): member is GuildMember & Voice {
    if (!member.voice.channel) {
        return false;
    }
    return true;
}
