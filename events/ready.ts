import { Client, Events } from "discord.js";
import type { ClientEvent } from "../types.ts";

async function execute(client: Client) {
    
}

export const eventData: ClientEvent = {
    name: Events.ClientReady,
    execute,
    once: false,
}