import { CommandInteraction } from "discord.js-light";
import Event from "../../structures/event";
import Client from "../../structures/init";

class InteractionCommandResponse extends Event {
   client: Client;
   constructor(client: Client) {
      super(client, {
         name: "Interaction Command Responnse",
         emmiter: "interactionCreate",
      });
   }

   async run(i: CommandInteraction) {
      if (!i.isCommand()) return;

      const command = this.client.commandInteraction[i.commandName];

      if (!command) return;

      try {
         if (command.data.enable === false) {
            return i.reply({
               content: "Sorry, but this commands is disabled by the developer due some bugs",
               ephemeral: true,
            });
         }
         command.run(i);
      } catch (er) {
         i.reply({
            content: "There is somethign was while running this command",
            ephemeral: true,
         });
         console.error(er.stack);
      }
   }
}

export default InteractionCommandResponse;
