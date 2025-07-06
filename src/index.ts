import { Config } from "./config.ts";
import { Music } from "./structures/client.ts";
import { events } from "./events/index.ts";

const client = new Music();

events.forEach((event) => event(client))

client.login(Config.token);
