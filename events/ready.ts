import { Client, Events } from "discord.js";
import type { ClientEvent } from "../types.ts";
import { fetchData } from "../helpers/fetch_data.ts";
import { alert } from "../helpers/alert.ts";

let alreadyWarned: Array<string> = [];

async function execute(client: Client) {
    setInterval(cooldownWarns, 1 * 60 * 1000, client)
    await cooldownWarns(client);
}

async function cooldownWarns(client: Client) {
    const data = await fetchData();

    const timers = {
        "rescue": data.secretInfo.cooldowns.rescue,
        "card pull": data.secretInfo.cooldowns.cardPull,
        "seedling plant": data.secretInfo.garden.nextPlant
    }

    for (const [timerName, timestamp] of Object.entries(timers)) {
        if (Date.now() > timestamp && !(alreadyWarned.includes(timerName))) {
            alreadyWarned.push(timerName)

            await alert(client, `your ${timerName} cooldown is over!`)
        }

        if (Date.now() < timestamp && alreadyWarned.includes(timerName)) {
            alreadyWarned = alreadyWarned.filter(x => x !== timerName);
        }
    }
}

export const eventData: ClientEvent = {
    name: Events.ClientReady,
    execute,
    once: false,
}