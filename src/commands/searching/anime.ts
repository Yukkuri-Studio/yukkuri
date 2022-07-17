import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, CacheType, MessageButton, MessageActionRow, MessageEmbed } from "discord.js-light";
import Mal, { Seasons, Types } from "mal-scraper";
import Client from "../../structures/init";
import InteractionCommand from "../../structures/interactionCommand";
import { MalRefrense, MalSeason } from "../../utils/mal";

class Anime extends InteractionCommand {
	client: Client;
	constructor(client: Client) {
		super(client, {
			cmd: new SlashCommandBuilder()
				.setName("anime")
				.setDescription("Search your fav anime achording from MAl")
				.addSubcommand((sub) =>
					sub
						.setName("search")
						.setDescription("Search anime on MAL")
						.addStringOption((opt) =>
							opt.setName("name").setDescription("Anime name you want to search").setRequired(true)
						)
				)
				.addSubcommand((sub) =>
					sub
						.setName("season")
						.setDescription("Get anime season")
						.addNumberOption((opt) => opt.setName("year").setDescription("Anime year season").setRequired(true))
						.addStringOption((opt) =>
							opt
								.setName("season")
								.setDescription("Anime season, choice here")
								.addChoices(
									{
										name: "spring",
										value: "spring",
									},
									{
										name: "summer",
										value: "summer",
									},
									{
										name: "fall",
										value: "fall",
									},
									{
										name: "winter",
										value: "winter",
									}
								)
								.setRequired(true)
						)
						.addStringOption((opt) =>
							opt.setName("type").setDescription("Anime season type, default is TV").addChoices(
								{
									name: "TV",
									value: "TV",
								},
								{
									name: "TVNews",
									value: "TVNews",
								},
								{
									name: "TVCon",
									value: "TVCon",
								},
								{
									name: "ONAs",
									value: "ONAs",
								},
								{
									name: "OVAs",
									value: "OVAs",
								},
								{
									name: "Specials",
									value: "Specials",
								},
								{
									name: "Movies",
									value: "Movies",
								}
							)
						)
				)
				.addSubcommand((sub) =>
					sub
						.setName("reference")
						.setDescription("Get recommand anime")
						.addStringOption((opt) =>
							opt.setName("reference").setDescription("Anime reference name or id from MAL").setRequired(true)
						)
				),
		});
	}

	async run(interaction: CommandInteraction<CacheType>): Promise<void> {
		await interaction.deferReply();
		const opt = interaction.options.getSubcommand();

		switch (opt) {
			case "search": {
				const name = interaction.options.getString("name");
				const res = await Mal.getInfoFromName(name);

				const chara = res.characters.map((c) => `[**${c.name}**](${c.link}) [${c.role}]`).join("\n");
				const trailer = new MessageButton()
					.setLabel(`Trailer ${res.title.length ? `${res.title.substring(0, 70)}...` : res.title}`)
					.setStyle("LINK")
					.setEmoji("🎬")
					.setURL(res.trailer || res.url);

				const row = new MessageActionRow().addComponents([trailer]);

				const embed = new MessageEmbed()
					.setColor("ORANGE")
					.setTitle(res.title)
					.setURL(res.url)
					.setThumbnail(res.picture)
					.setDescription(res.synopsis.length ? `${res.synopsis.substring(0, 500)}...` : res.synopsis)
					.addFields([
						{
							name: "📜 Title",
							value: [
								`**Original:** ${res.title}`,
								`**English:** ${res.englishTitle}`,
								`**Japanese:** ${res.japaneseTitle}`,
							].join("\n"),
							inline: true,
						},
						{
							name: "🎬 Episode",
							value: [
								`**Total Episode:** ${res.episodes}`,
								`**Type:** ${res.type}`,
								`**Aired:** ${res.aired}`,
								`**Premiered:** ${res.premiered}`,
								`**Broadcast:** ${res.broadcast}`,
								`**Studio:** ${res.studios}`,
								`**Status:** ${res.status}`,
							].join("\n"),
							inline: true,
						},
						{
							name: "🎥 Producers",
							value: [res.producers.map((p) => p).join(", ")].join(""),
							inline: true,
						},
						{
							name: "⭐ Ratings",
							value: [
								`**Scores:** ${res.score}`,
								`**Rating:** ${res.rating}`,
								`**Genres:** ${res.genres.map((g) => g).join(", ")}`,
								`**Ranked:** ${res.ranked}`,
								`**Fav:** ${res.favorites}`,
								`**Popularity:** ${res.popularity}`,
							].join("\n"),
							inline: true,
						},
						{
							name: "🎭 Chara",
							value: [chara].join("\n"),
							inline: true,
						},
					]);

				interaction.editReply({
					embeds: [embed],
					components: [row],
				});
				break;
			}

			case "season": {
				await interaction.deferReply().catch((er) => er);
				interaction.deleteReply();
				const seasonList = ["spring", "fall", "summer", "winter"];
				const typeList = ["TV", "TVNews", "TVCon", "ONAs", "OVAs", "Specials", "Movies"];
				const year = interaction.options.getNumber("year");
				const season = interaction.options.getString("season") as Seasons;
				const type = (interaction.options.getString("type") as Types) || "TV";

				if (!seasonList.includes(season)) {
					return interaction.reply({
						content: "The season is doesn't exist",
						ephemeral: true,
					});
				}

				if (!typeList.includes(type)) {
					return interaction.reply({
						content: "The season type is doesn't exist",
						ephemeral: true,
					});
				}

				try {
					const res = await Mal.getSeason(year, season, type);
					MalSeason(res, interaction);
				} catch (er) {
					interaction.reply({
						content: er.message,
						ephemeral: true,
					});
					console.error(er.stack);
				}
				break;
			}

			case "reference": {
				const names = interaction.options.getString("reference");

				try {
					interaction.deleteReply().catch((er) => er);
					const res = await Mal.getRecommendationsList(names);
					MalRefrense(res, interaction);
				} catch (er) {
					interaction.reply({
						content: er.message,
						ephemeral: true,
					});
					console.error(er);
				}
				break;
			}
		}
	}
}

export default Anime;
