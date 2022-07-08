import { Client, Intents, Options } from "discord.js-light";
import Loader from "../utils/loader";
import Event from "./event";
import InteractionCommand from "./interactionCommand";

class YukkuriClient extends Client {
   develoers: string[];
   loader: Loader;
   commandInteraction: Record<string, InteractionCommand>;
   event: Record<string, Event>;

   constructor() {
      super({
         intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS],
         makeCache: Options.cacheEverything(),
      });
   }

   async init() {
      this.login();
   }
}

export default YukkuriClient;
