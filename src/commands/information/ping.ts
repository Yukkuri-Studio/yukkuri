import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, CacheType, MessageEmbed } from "discord.js-light";
import Client from "../../structures/init";
import InteractionCommand from "../../structures/interactionCommand";

class Ping extends InteractionCommand {
	client: Client;
	constructor(client: Client) {
		super(client, {
			cmd: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
		});
	}

	async run(interaction: CommandInteraction<CacheType>): Promise<void> {
		await interaction.deferReply();
		const responseTime = Date.now() - interaction.createdTimestamp;
		const embed = new MessageEmbed()
			.setColor("ORANGE")
			.setDescription([`Latency: ${responseTime}ms`, `Web Socket: ${this.client.ws.ping}ms`].join("\n"));

		interaction.editReply({
			embeds: [embed],
		});
	}
}

export default Ping;
