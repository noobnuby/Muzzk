import { createEnum } from "./utils/createEnum.ts";

export type ValueOf<T> = T[keyof T];

export const IsNot = createEnum("InVoice","Playing","SameVoiceChannel");
export type IsNot = ValueOf<typeof IsNot>;

export const Emoji = createEnum("Verify","Cross","L_Arrow","R_Arrow","Queue_Add","Music","Queue","Playing","User","Timer","Bot","Pong");
export type Emoji = ValueOf<typeof Emoji>;

export const EventSource = createEnum("Discord","Magmastream");
export type EventSource = ValueOf<typeof EventSource>;

export const Repeat = createEnum("Off", "One", "Queue")
export type Repeat = ValueOf<typeof Repeat>;