import glob from "glob";
import { dirname, join } from "path";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v9";
import Event from "../structures/event";
import Client from "../structures/init";
import InteractionCommand from "../structures/interactionCommand";
import { REST } from "@discordjs/rest";

class Loader {
	client: Client;
	constructor(client: Client) {
		this.client = client;
	}

	async getPath() {
		return dirname(require.main.filename);
	}

	async loadCommand() {
		const folderPath = join(__dirname, "..", "commands", "**", "*.js");

		const CommandInteractionData: RESTPostAPIApplicationCommandsJSONBody[] = [];

		glob(folderPath, async (error, files) => {
			if (error) throw error;

			this.client.commandInteraction = {};
			delete require.cache[`${this.getPath}/structures/interactionCommand.js`];
			let i = 0;
			for (let l = files.length; i < l; i++) {
				const filePath = files[i];

				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const commandFile = require(filePath).default;
				const commandSlash: InteractionCommand = new commandFile(this.client);

				this.client.commandInteraction[commandSlash.data.cmd.name] = commandSlash;
				CommandInteractionData.push(commandSlash.data.cmd.toJSON());

				delete require.cache[require.resolve(files[i])];
			}
			console.log(`Loaded "${i}" (/) commands.`);

			const rest = new REST({
				version: "9",
			}).setToken(process.env.DISCORD_TOKEN);

			const guildId = process.env.DISCORD_GUILD_DEV as string;
			const clientId = process.env.DISCORD_CLIENT_ID as string;
			const isProd = process.env.NODE_ENV === "production";
			const isDelete = process.env.NODE_ENV === "commandremove";

			if (isProd) {
				console.log("Started refreshing production application (/) commands.");
				await rest.put(Routes.applicationCommands(clientId), {
					body: CommandInteractionData,
				});
				console.log("Successfully reloaded production application (/) commands.");
				return;
			}

			if (isDelete) {
				const guildCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));

				console.log("Started deleting development application (/) commands.");
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				for (const command of guildCommands as any) {
					const deleteURL = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
					await rest.delete(`/${deleteURL}`);
				}
				console.log("Successfully deleting development application (/) commands.");
				return;
			}

			const { applicationGuildCommands } = Routes;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const guildCommands = (await rest.get(Routes.applicationGuildCommands(clientId, guildId))) as any;

			console.log("Started refreshing development application (/) commands.");
			for (const command of guildCommands) {
				const deleteURL = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
				await rest.delete(`/${deleteURL}`);
			}

			await rest.put(applicationGuildCommands(clientId, guildId), {
				body: CommandInteractionData,
			});

			console.log("Successfully reloaded development application (/) commands.");
		});
	}

	async loadEvent() {
		const folderPath = join(__dirname, "..", "events", "**", "*.js");

		glob(folderPath, (err, files) => {
			if (err) throw err;

			if (!files.length) {
				console.error("Cannot find any event files");
			}

			this.client.event = {};
			delete require[`${this.getPath}/structures/event.js`];
			let i = 0;
			for (let l = files.length; i < l; i++) {
				const filePath = files[i];

				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const eventFile = require(filePath).default;
				const event: Event = new eventFile(this.client);

				this.client.event[event.data.name] = event;
				this.client.on(event.data.emmiter, event.run.bind(event));
			}
			console.log(`Loaded "${i}" events.`);
		});
	}

	async getFiles(path: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			glob(path, (er, files) => {
				if (er) return reject(er);
				resolve(files);
			});
		});
	}
}

export default Loader;
