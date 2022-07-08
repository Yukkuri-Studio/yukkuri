import { CommandInteraction, GuildMember, MessageActionRow, MessageSelectMenu } from "discord.js-light";
import { awaitMovieInteraction, awaitTvInteraction } from "./getMoveInteraction";

const getMovieDetails = async (data, i: CommandInteraction) => {
   const res = data.results.slice(0, 5);

   if (!res.length) {
      return i.channel.send({
         content: "Sorry, There is no result for movie that you want to search",
      });
   }
   const select = [];

   for (const data of res) {
      select.push({
         label: data.title,
         value: data.title,
         description: `Get information about "${data.title}"`,
      });
   }

   const menu = new MessageSelectMenu().setCustomId("movie-select").addOptions(select);

   const row = new MessageActionRow().addComponents([menu]);

   const msg = await i.channel.send({
      content: "Choice the movie from menu bellow",
      components: [row],
   });
   awaitMovieInteraction(msg, data, i.member as GuildMember);
};

const getTvShow = async (data, i: CommandInteraction) => {
   const res = data.results.slice(0, 10);

   if (!res.length) {
      return i.channel.send({
         content: "Sorry, There is no result for movie that you want to search",
      });
   }

   const select = [];
   for (const data of res) {
      select.push({
         label: `${data.name}`,
         value: data.name,
         description: `Information about "${data.name}"`,
      });
   }

   const menu = new MessageSelectMenu().setCustomId("tvshow-select").addOptions(select);

   const row = new MessageActionRow().addComponents([menu]);

   const msg = await i.channel.send({
      content: "Choice the movie from menu bellow",
      components: [row],
   });
   awaitTvInteraction(msg, data, i.member as GuildMember);
};
export { getMovieDetails, getTvShow };
