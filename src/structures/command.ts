import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, type SlashCommandOptionsOnlyBuilder } from "discord.js";
import { Music } from "./client.ts";


export type MusicInteraction = {
    guild: Guild, 
    client: Music
}

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute(interaction: ChatInputCommandInteraction & MusicInteraction): Promise<void>;
}