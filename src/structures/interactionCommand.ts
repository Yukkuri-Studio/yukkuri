import { CommandInteraction } from "discord.js-light";
import YukkuriClient from "./client";
import { CommandInteractionType } from "./interface/CommandInteraction";

class InteractionCommand {
	data: CommandInteractionType;
	client: YukkuriClient;

	constructor(client: YukkuriClient, data: CommandInteractionType) {
		this.client = client;
		this.data = data;
	}

	async load(interaction: CommandInteraction) {
		const res = await this.run(interaction).catch((er: Error) => er);

		if (res instanceof Error) return this.onError(interaction, res);
	}

	async onError(interaction: CommandInteraction, error: Error) {
		console.error(`Error whiel running command ${this.data.cmd.name}`, error);
		interaction.reply({
			content: "There is something was wrong while running this command",
			ephemeral: true,
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async run(interaction: CommandInteraction) {
		throw new Error("Error while running command.");
	}
}

export default InteractionCommand;
