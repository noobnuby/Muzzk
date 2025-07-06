import { Events, GuildMember } from 'discord.js';
import { Music } from "../structures/client.ts";

export function voiceStateUpdate(client: Music) {
    client.on(Events.VoiceStateUpdate, (oldState) => { 
        const channel = oldState.channel;
        const player = client.manager.get(oldState.guild.id);
        
        const isBot = (member: GuildMember) => member.user.bot;

        if(player && channel?.members.every(isBot)) {
            player.destroy();
        }
    })
}
