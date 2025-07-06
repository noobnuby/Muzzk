import { clientCreate } from "./clientReady.ts";
import { interactionCreate } from "./interactionCreate.ts";
import { nodeConnect } from "./nodeConnect.ts";
import { nodeDisconnect } from "./nodeDisconnect.ts";
import { nodeEror } from "./trackError.ts";
import { playerDestroy } from "./playerDestroy.ts";
import { queueEnd } from "./queueEnd.ts";
import { raw } from "./raw.ts";
import { trackStart } from "./trackStart.ts";
import { voiceStateUpdate } from "./voiceStateUpdate.ts";
import { playerStateUpdate } from "./playerStateUpdate.ts";

export const events = [
    interactionCreate,
    clientCreate,
    raw,
    nodeConnect,
    nodeDisconnect,
    queueEnd,
    voiceStateUpdate,
    trackStart,
    playerDestroy,
    nodeEror,
    playerStateUpdate
]

