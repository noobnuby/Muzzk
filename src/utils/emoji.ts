import { Emoji } from "../types.ts";

export function emoji(emoji: Emoji): string {
    switch(emoji) {
        case Emoji.Verify: 
            return "<a:o_:1372196184076189767>";
        case Emoji.Cross:
            return "<a:x_:1372121820245004298>";
        case Emoji.L_Arrow:
            return "<:l_arrow:1375077750242676789>";
        case Emoji.R_Arrow:
            return "<:r_arrow:1375077741447090197>";
        case Emoji.Queue_Add:
            return "<:queue_add:1377249938928439307>"
        case Emoji.Music:
            return "<:music:1377251019460837428>";
        case Emoji.Queue:
            return "<:queue:1378034107967213689>";
        case Emoji.Playing:
            return "<:playing:1383462495703928883>";
        case Emoji.User:
            return "<:user:1383462473809526935>";
        case Emoji.Timer:
            return "<:timer:1383462069420036226>";
        case Emoji.Bot:
            return "<:bot:1383473342815928452>";
        case Emoji.Pong:
            return "<:pongfill:1383474456562896987>"
    }
}