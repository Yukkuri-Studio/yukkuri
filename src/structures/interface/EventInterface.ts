import { ClientEvents } from "discord.js-light";

export interface EventInterface {
	name: string;
	emmiter: keyof ClientEvents;
	once?: boolean | false;
	disable?: boolean | false;
}
