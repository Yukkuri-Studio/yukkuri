import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, CacheType, MessageEmbed, DynamicImageFormat } from "discord.js-light";
import moment from "moment";
import InteractionCommand from "../../structures/interactionCommand";
import Client from "../../structures/init";

const flags = {
	DISCORD_EMPLOYEE: "Discord Employee",
	DISCORD_PARTNER: "Discord Partner",
	BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1)",
	BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2)",
	HYPESQUAD_EVENTS: "HypeSquad Events",
	HOUSE_BRAVERY: "House of Bravery",
	HOUSE_BRILLIANCE: "House of Brilliance",
	HOUSE_BALANCE: "House of Balance",
	EARLY_SUPPORTER: "Early Supporter",
	TEAM_USER: "Team User",
	SYSTEM: "System",
	VERIFIED_BOT: "Verified Bot",
	VERIFIED_DEVELOPER: "Verified Bot Developer",
};

class User extends InteractionCommand {
	client: Client;
	constructor(client: Client) {
		super(client, {
			cmd: new SlashCommandBuilder()
				.setName("user")
				.setDescription("Get userinfo from discord users.")
				.addSubcommand((sub) =>
					sub
						.setName("info")
						.setDescription("Get discord user info")
						.addUserOption((opt) => opt.setName("tag").setDescription("Tag someone to get their userinfo."))
				)
				.addSubcommand((sub) =>
					sub
						.setName("avatar")
						.setDescription("Get discord user avatar")
						.addUserOption((opt) => opt.setName("user").setDescription("Tag someone to get their avatar."))
				)
				.addSubcommand((sub) =>
					sub
						.setName("roles")
						.setDescription("Get discord user roles")
						.addUserOption((opt) => opt.setName("tag").setDescription("Tag someone to get thier roles data."))
				),
		});
	}

	async run(interaction: CommandInteraction<CacheType>): Promise<void> {
		await interaction.deferReply();
		const opt = interaction.options.getSubcommand();

		switch (opt) {
			case "info": {
				try {
					const user = interaction.options.getUser("tag") || interaction.member.user;
					const member = interaction.guild.members.cache.get(user.id);
					const roles = member.roles.cache
						.sort((a, b) => b.position - a.position)
						.map((role) => role.toString())
						.slice(0, -1);
					const userFlags = member.user.flags.toArray();

					const embed = new MessageEmbed()
						.setColor("ORANGE")
						.setThumbnail(
							member.user.avatarURL({
								dynamic: true,
							})
						)
						.setAuthor({
							name: `${member.user.username}'s Information`,
						})
						.addField(
							"Detail Information",
							[
								`**❯ Username:** ${member.user.username}`,
								`**❯ Discriminator:** ${member.user.discriminator}`,
								`**❯ ID:** ${member.id}`,
								`**❯ Flags:** ${userFlags.length ? userFlags.map((flag) => flags[flag]).join(", ") : "None"}`,
								`**❯ Time Created:** ${moment(member.user.createdTimestamp).format("LT")} ${moment(
									member.user.createdTimestamp
								).format("LL")} ${moment(member.user.createdTimestamp).fromNow()}`,
								`**❯ Status:** ${member.presence ? member.presence.status : "No Game Detected."}`,
								"\u200b",
							].join("\n")
						)
						.addField(
							"Server Information",
							[
								`**❯ Highest Role:** ${
									member.roles.highest.id === interaction.guild.id ? "None" : member.roles.highest.name
								}`,
								`**❯ Join To This Server At:** ${moment(member.joinedAt).format("LL LTS")}`,
								`**❯ Roles [${roles.length}]:** ${
									roles.length < 10 ? roles.join(", ") : roles.length > 10 ? trimArray(roles) : "None"
								}`,
								"\u200b",
							].join("\n")
						);

					interaction.editReply({
						embeds: [embed],
					});
				} catch (er) {
					interaction.editReply({
						content: er.message,
					});
					console.error(er);
				}
				break;
			}

			case "avatar": {
				const user = interaction.options.getUser("user") || interaction.member.user;
				const member = interaction.guild.members.cache.get(user.id);
				const format = ["png", "jpg", "jpeg", "webp"];
				if (member.avatar && user.avatar.startsWith("a_")) format.push("gif");
				const embed = new MessageEmbed()
					.setAuthor({
						name: `Avatar's ${member.user.tag}`,
						iconURL: member.user.avatarURL(),
					})
					.setColor("ORANGE")
					.setDescription(
						format
							.map(
								(x) =>
									`[**${x.toUpperCase()}**](${member.user.displayAvatarURL({
										format: x as DynamicImageFormat,
										size: 4096,
									})})`
							)
							.join(" | ")
					)
					.setImage(
						member.user.avatarURL({
							dynamic: true,
							size: 4096,
						})
					);

				interaction.editReply({
					embeds: [embed],
				});
				break;
			}

			case "roles": {
				const user = interaction.options.getUser("tag") || interaction.member.user;
				const member = interaction.guild.members.cache.get(user.id);

				const roles = member.roles.cache
					.sort((a, b) => b.position - a.position)
					.map((role) => role.toString())
					.slice(0, -1);

				const embed = new MessageEmbed()
					.setColor("ORANGE")
					.setTitle(`${member.user.username}'s Roles Info`)
					.setDescription(
						[
							`**❯ Roles [${roles.length}]:** ${
								roles.length < 10 ? roles.join(", ") : roles.length >= 10 ? trimArray(roles) : "None"
							}`,
						].join("\n")
					);

				interaction.editReply({
					embeds: [embed],
				});
				break;
			}
		}
	}
}

export default User;

const trimArray = (arr: string[], maxLen = 10) => {
	if (arr.length > maxLen) {
		const len = arr.length - maxLen;
		arr = arr.slice(0, maxLen);
		arr.push(`${len} more...`);
	}
	return arr;
};
