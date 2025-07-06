import { Client, Collection, GatewayIntentBits } from "discord.js";
import type { NodeOptions, Payload } from "magmastream";
import { Manager, SearchPlatform, UseNodeOptions } from "magmastream";
import { Config } from "../config.ts";
import type { Command } from "./command.ts";

export class Music extends Client {
    public readonly manager: Manager;
    public readonly commands: Collection<string, Command>;

    constructor() {
        super(
            {
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildVoiceStates,
                    GatewayIntentBits.MessageContent,
                ]
            }
        );

        this.manager = new Manager({
            autoPlay: true,
            defaultSearchPlatform: SearchPlatform.YouTube,
            autoPlaySearchPlatform: SearchPlatform.Spotify,
            useNode: UseNodeOptions.LeastLoad,
            nodes: Config.nodes as NodeOptions[],
            send: async (id: string, payload: Payload) => {
                const guild = this.guilds.cache.get(id);
                if (guild) await guild.shard.send(payload);
            },
        });

        this.commands = new Collection();
    }
}
