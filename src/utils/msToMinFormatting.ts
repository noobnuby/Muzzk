export function msToTimeFormatting(duration: number): string {
    const msToSec = Math.floor(duration / 1000);
    const hour = Math.floor(msToSec / 3600);
    const min = Math.floor((msToSec % 3600) / 60);
    const sec = msToSec %  60;

    return hour > 0 ? `${hour}:${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}` : `${min}:${String(sec).padStart(2,"0")}`
}