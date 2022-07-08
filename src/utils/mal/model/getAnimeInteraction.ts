import { GuildMember, Message } from "discord.js-light";
import Mal from "mal-scraper";
import { awaitModelAnime } from "./getAnime";

const awaitRefrenseInteraction = async (msg: Message, member: GuildMember) => {
   const i = await msg
      .awaitMessageComponent({
         filter: (m) => m.member.user.id === member.id,
         time: 6e4,
      })
      .catch((er) => er);

   if (i instanceof Error) return;
   await i.deferReply().catch((er) => er);
   i.deleteReply();

   try {
      switch (i.customId) {
         case "refrense-select": {
            const value = i.values[0];

            const animes = await awaitModelAnime(value);

            msg.edit({
               embeds: [animes.embed],
               components: [animes.row],
               content: `Anime ${animes.res.title}`,
            });
            break;
         }
      }
   } catch (er) {
      i.reply({
         content: "There is something was wrong, please contact my developer at my support server",
         ephemeral: true,
      });
      console.error(er);
   }
};

const awaitSeasonInteraction = async (msg: Message, member: GuildMember) => {
   const i = await msg
      .awaitMessageComponent({
         filter: (m) => m.member.user.id === member.id,
         time: 6e4,
      })
      .catch((er) => er);
   console.log(i);
   if (i instanceof Error) return;
   await i.deferReply().catch((er) => er);
   i.deleteReply();

   try {
      // eslint-disable-next-line
    switch (i.customId) {
         case "tv-select": {
            const value = i.values[0];
            const res = await Mal.getInfoFromName(value);

            const animes = await awaitModelAnime(value);

            msg.edit({
               embeds: [animes.embed],
               content: `${res.title}`,
               components: [animes.row],
            });
            break;
         }
      }
   } catch (er) {
      i.reply({
         content: "There is something was wrong, please contact my developer at my support server",
         ephemeral: true,
      });
      console.error(er);
   }
};

export { awaitSeasonInteraction, awaitRefrenseInteraction };
