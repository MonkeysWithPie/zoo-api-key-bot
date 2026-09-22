import { Client, Events } from "discord.js";
import type { ClientEvent } from "../types.ts";
import { fetchData } from "../helpers/fetch_data.ts";
import { alert } from "../helpers/alert.ts";

const timerStamps: { [key: string]: number } = {};

async function execute(client: Client) {
    setInterval(cooldownWarns, 10 * 60 * 1000, client)
    await cooldownWarns(client);
}

async function cooldownWarns(client: Client) {
    const data = await fetchData();
    if (!data.secretInfo) {
        console.warn("data fetch failed!", data)
    }

    const timers = {
        "rescue": data.secretInfo.cooldowns.rescue,
        "card pull": data.secretInfo.cooldowns.cardPull,
        "seedling plant": data.secretInfo.garden.nextPlant
    }

    for (const [timerName, timestamp] of Object.entries(timers)) {
        if (timerStamps[timerName] === timestamp) continue;

        timerStamps[timerName] = timestamp;
        setTimeout(() => {
            alert(client, `your ${timerName} cooldown is over!`)
        }, Math.max(timestamp - Date.now(), 1))
    }
}

export const eventData: ClientEvent = {
    name: Events.ClientReady,
    execute,
    once: false,
}