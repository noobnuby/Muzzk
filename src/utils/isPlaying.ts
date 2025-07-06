import { Player } from "magmastream";

export function isPlaying(player: Player) { 
    if (!player.playing && !player.paused) {
        return false;
    }
    return true;
}