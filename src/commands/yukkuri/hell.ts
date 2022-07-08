import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord-api-types/v9";
import { CommandInteraction, CacheType, GuildMember } from "discord.js-light";
import Client from "../../structures/init";
import InteractionCommand from "../../structures/interactionCommand";

class Hell extends InteractionCommand {
   client: Client;
   constructor(client: Client) {
      super(client, {
         cmd: new SlashCommandBuilder()
            .setName("hell")
            .setDescription("Send member to the hell 👹")
            .addUserOption((opt) => opt.setName("user").setDescription("Tag user").setRequired(true))
            .addBooleanOption((opt) =>
               opt
                  .setName("choices")
                  .setDescription("(True) To send the user to hell, (False) To remove the user from hell")
                  .setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
      });
   }

   async run(interaction: CommandInteraction<CacheType>): Promise<void> {
      await interaction.deferReply();
      if (!interaction.memberPermissions.has(["MANAGE_GUILD"])) {
         interaction.editReply({
            content: "You have no permissions to run this command",
         });
         return;
      }

      if (interaction.guild.id !== "993681829796266018") {
         interaction.editReply({
            content: "Sorry, but this command is only available for **Yukkuri - Pelan Pelan Aja**",
         });
         return;
      }

      const role = interaction.guild.roles.cache.get("994104071097171968");
      const user = interaction.options.getUser("user");
      const member = interaction.guild.members.cache.get(user.id) as GuildMember;
      const opt = interaction.options.getBoolean("choices");

      if (opt) {
         member.roles.add(role);
         interaction.editReply(`${user} Has been send to the hell!`);
         return;
      }

      member.roles.remove(role);
      interaction.editReply(`${user} Has been removed from the hell!`);
      return;
   }
}

export default Hell;
