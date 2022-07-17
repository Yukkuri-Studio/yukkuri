import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { PermissionResolvable } from "discord.js-light";

export interface CommandInteractionType {
	enable?: boolean;
	cmd: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
	readonly required?: {
		clientPermissions?: PermissionResolvable[];
		developer?: boolean;
		cooldown?: number;
	};
}
