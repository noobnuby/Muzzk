import { IsNot } from "../types.ts";
import { buildFailComponent } from "./buildComponent.ts";

export function buildVoiceStateErrorComponent(state: IsNot) {
    switch (state) {
        case IsNot.InVoice:
            return buildFailComponent("음성 채널에 접속해주세요.");
        case IsNot.Playing:
            return buildFailComponent("현재 재생중인 음악이 없어요.");
        case IsNot.SameVoiceChannel:
            return buildFailComponent("같은 음성 채널에 있지 않아요.");
    }
}
