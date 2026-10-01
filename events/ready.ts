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

    const timers: { [key: string]: number } = {
        "rescue": data.secretInfo.cooldowns.rescue,
        "card pull": data.secretInfo.cooldowns.cardPull,
        "seedling plant": data.secretInfo.garden.nextPlant
    }

    for (const [timerName, timestamp] of Object.entries(timers)) {
        if (timerStamps[timerName] === timestamp) continue;

        timerStamps[timerName] = timestamp;
        setTimeout(async () => {
            if (timerName === "rescue") {
                const newData = await fetchData();
                if (newData.autoRescues > 0 || newData.secretInfo?.cooldowns?.rescue > Date.now()) return;
            }

            alert(client, `your ${timerName} cooldown is over!`)
        }, Math.max(timestamp - Date.now(), 1))

        if (timerName === "rescue" && data.equippedLeader === "Wyvern" && Date.now() < timestamp) {
            setTimeout(async () => {
                const newData = await fetchData();
                if (newData.equippedLeader !== "Wyvern" || newData.autoRescues > 0 || newData.secretInfo?.cooldowns?.rescue > Date.now()) return;

                alert(client, `prepare to rescue an animal <t:${Math.floor(Date.now() / 1000)}:R>!`)
            }, Math.max(timestamp - Date.now() - 15000, 1))
        }
    }
}

export const eventData: ClientEvent = {
    name: Events.ClientReady,
    execute,
    once: false,
}