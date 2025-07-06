import { ChatInputCommandInteraction, Colors, ContainerBuilder, Events, MessageFlags, TextDisplayBuilder } from "discord.js";
import { Music } from "../structures/client.ts";
import { Emoji } from "../types.ts";
import { emoji } from "../utils/emoji.ts";
import { type MusicInteraction } from "../structures/command.ts";

export function interactionCreate(client: Music) {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!interaction.guild) {
                const text = new TextDisplayBuilder().setContent(`${emoji(Emoji.Cross)} 해당 채널에선 명령어를 이용하실 수 없습니다.`)
                const component = new ContainerBuilder().addTextDisplayComponents(text).setAccentColor(Colors.Red)

                return interaction.reply({
                    components: [component],
                    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
                });
            }

            if (command) {
                command.execute(
                    interaction as ChatInputCommandInteraction &
                    MusicInteraction
                );
            }
        } 
        // else if (interaction.isAutocomplete()) {
        //     const command = client.commands.get(interaction.commandName);

        //     if (command) {
        //         const focusedValue = interaction.options.getFocused();
        //         const suggest = await youtubeSuggest(focusedValue);
        //         await interaction.respond(suggest.map(choice => ({ name: choice, value: choice })));
        //     }
        // }
    });
}