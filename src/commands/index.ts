import type { Command } from "../structures/command.ts";
import { autoplay } from "./autoplay.ts";
import { pause } from "./pause.ts";
import { ping } from "./ping.ts";
import { play } from "./play.ts";
import { queue } from "./queue.ts";
import { resume } from "./resume.ts";
import { shuffle } from "./shuffle.ts";
import { skip } from "./skip.ts";
import { stop } from "./stop.ts";
import { volume } from "./volume.ts";

export const commands: Array<Command> = [
    ping,
    play,
    stop,
    autoplay,
    skip,
    volume,
    pause,
    resume,
    queue,
    shuffle
]

