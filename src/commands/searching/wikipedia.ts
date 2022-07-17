import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, CacheType, MessageEmbed } from "discord.js-light";
import InteractionCommand from "../../structures/interactionCommand";
import Client from "../../structures/init";
import wikipedia, { eventTypes } from "wikipedia";

class Wikipedia extends InteractionCommand {
	client: Client;
	constructor(client: Client) {
		super(client, {
			cmd: new SlashCommandBuilder()
				.setName("wikipedia")
				.setDescription("Search anything from WikiPedia")
				.addSubcommand((sub) =>
					sub
						.setName("search")
						.setDescription("Search anything from WikiPedia")
						.addStringOption((opt) =>
							opt.setName("value").setDescription("Insert the something you want to searcgh").setRequired(true)
						)
						.addStringOption((opt) =>
							opt.setName("language").setDescription("Set language searching for WikiPedia")
						)
						.addBooleanOption((opt) =>
							opt
								.setName("autosuggest")
								.setDescription(
									"Suggest a page title which is reccomened by wikipedia for given search string*"
								)
						)
				)
				.addSubcommand((sub) =>
					sub
						.setName("thisday")
						.setDescription("Returns the events that happened on a day")
						.addStringOption((opt) =>
							opt.setName("type").setDescription("Any one of the valid event types. By default, 'all'.")
						)
						.addStringOption((opt) =>
							opt.setName("month").setDescription("The month to search for. Takes current month by default.")
						)
						.addStringOption((opt) =>
							opt.setName("day").setDescription("The day to search for. Takes current day by default.")
						)
				),
		});
	}

	async run(interaction: CommandInteraction<CacheType>): Promise<void> {
		await interaction.deferReply().catch((er) => er);
		const opt = interaction.options.getSubcommand();

		switch (opt) {
			case "search": {
				try {
					const value = interaction.options.getString("value");
					const lang = interaction.options.getString("language") || "en";
					const autosuggest = interaction.options.getBoolean("autosuggest") || false;
					wikipedia.setLang(lang);
					const page = await wikipedia.page(value, { autoSuggest: autosuggest });
					const summary = await page.summary();

					const embed = new MessageEmbed()
						.setColor("ORANGE")
						.setThumbnail(summary.thumbnail.source)
						.setTitle(summary.title)
						.setURL(summary.content_urls.desktop.page)
						.setDescription(summary.extract)
						.setTimestamp()
						.setFooter({ text: summary.wikibase_item });

					interaction.editReply({
						embeds: [embed],
						content: `📖 **WikiPedia** | <${summary.content_urls.desktop.page}>`,
					});
				} catch (err) {
					if (err instanceof Error) {
						interaction.deleteReply().catch((er) => er);
						interaction.followUp({ content: err.message, ephemeral: true });
						console.log(err.stack);
					}
				}
				break;
			}

			case "thisday": {
				try {
					const monthNumber = new Date().getMonth();
					const dayNumber = new Date().getDate();
					const type = (interaction.options.getString("type") as eventTypes) || "all";
					const month = interaction.options.getString("month") || `${monthNumber}`;
					const day = interaction.options.getString("day") || `${dayNumber}`;

					const thisday = await wikipedia.onThisDay({ type, month, day });
					console.log(thisday);
				} catch (err) {
					if (err instanceof Error) {
						interaction.deleteReply().catch((er) => er);
						interaction.reply({ content: err.message, ephemeral: true });
						console.log(err.stack);
					}
				}
			}
		}
	}
}

export default Wikipedia;
