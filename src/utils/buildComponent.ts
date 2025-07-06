import { Colors, ContainerBuilder, type InteractionReplyOptions, MessageFlags, TextDisplayBuilder } from "discord.js";
import { Emoji } from "../types.ts";
import { emoji } from "./emoji.ts";

export function buildSuccessComponent(content: string): InteractionReplyOptions & { withResponse: true } {
    const text = new TextDisplayBuilder().setContent(emoji(Emoji.Verify) + " " + content);
    const component = new ContainerBuilder().addTextDisplayComponents(text).setAccentColor(Colors.Green);

    return {
        components: [component],
        flags: [MessageFlags.IsComponentsV2],
        withResponse: true
    }
}

export function buildFailComponent(content: string): InteractionReplyOptions & { withResponse: true } {
    const text = new TextDisplayBuilder().setContent(emoji(Emoji.Cross) + " " + content)
    const component = new ContainerBuilder().addTextDisplayComponents(text).setAccentColor(Colors.Red);

    return {
        components: [component],
        flags: [MessageFlags.IsComponentsV2,MessageFlags.Ephemeral],
        withResponse: true
    }
}