import { TextDisplayBuilder } from "discord.js";

export function buildTextDisplay(...args: string[]): TextDisplayBuilder[] {
    return args.map((arg) => new TextDisplayBuilder({ content: arg }))
}