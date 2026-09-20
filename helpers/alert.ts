import { EmbedBuilder, type Client } from "discord.js";

export async function alert(client: Client, message: string) {
    const userId = process.env.USER_ID as string
    const user = await client.users.fetch(userId)

    const embed = new EmbedBuilder()
        .setColor("#54ff4f")
        .setDescription(message)
    
    if (!user) {
        console.warn("user not found!")
        return;
    }
    await user.send({ embeds: [embed] })
}