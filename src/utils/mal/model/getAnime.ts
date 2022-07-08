import {
   CommandInteraction,
   GuildMember,
   MessageActionRow,
   MessageButton,
   MessageEmbed,
   MessageSelectMenu,
} from "discord.js-light";
import { awaitRefrenseInteraction, awaitSeasonInteraction } from "./getAnimeInteraction";
import Mal from "mal-scraper";

const MalSeason = async (res, i: CommandInteraction) => {
   const result = res.slice(0, 10);
   const menus = [];

   for (const data of result) {
      menus.push({
         label: data.title,
         value: data.title,
         description: `Information About "${data.title.length ? data.title.substring(0, 20) + "..." : data.title}"`,
      });
   }

   const select = new MessageSelectMenu().setCustomId("tv-select").addOptions(menus);

   const row = new MessageActionRow().addComponents([select]);

   try {
      const msg = await i.channel.send({
         content: "Choice your anime at this menus",
         components: [row],
      });

      awaitSeasonInteraction(msg, i.member as GuildMember);
   } catch (er) {
      i.reply({
         content:
            "There is something was wrong when fetching the data, maybe the title is to loong, so i can't display it\nIf this is a bug, feel free to contact my developer at my support server.",
         ephemeral: true,
      });
      console.log(er.stack);
   }
};

const awaitModelAnime = async (name: string) => {
   const res = await Mal.getInfoFromName(name);
   const trailer = new MessageButton()
      .setLabel(`Trailer ${res.title.length ? res.title.substring(0, 70) + "..." : res.title}`)
      .setStyle("LINK")
      .setEmoji("🎬")
      .setURL(res.trailer || res.url);

   const row = new MessageActionRow().addComponents([trailer]);

   const embed = new MessageEmbed()
      .setColor("ORANGE")
      .setTitle(res.title)
      .setURL(res.url)
      .setThumbnail(res.picture)
      .setDescription(res.synopsis.length ? res.synopsis.substring(0, 500) + "..." : res.synopsis)
      .addFields([
         {
            name: "Title",
            value: [
               `**Original:** ${res.title}`,
               `**English:** ${res.englishTitle}`,
               `**Japanese:** ${res.japaneseTitle}`,
            ].join("\n"),
            inline: true,
         },
         {
            name: "Episode",
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
            name: "Producers",
            value: [res.producers.map((p) => p).join(", ")].join(""),
            inline: true,
         },
         {
            name: "Ratings",
            value: [
               `**Scores:** ${res.score}`,
               `**Rating:** ${res.rating}`,
               `**Genres:** ${res.genres.map((g) => g).join(", ")}`,
               `**Ranked:** ${res.ranked}`,
               `**Fav:** ${res.favorites}`,
               `**Popularity:** ${res.popularity}`,
            ].join("\n"),
         },
      ]);

   return {
      row,
      embed,
      res,
   };
};

const MalRefrense = async (res, i: CommandInteraction) => {
   const result = res.slice(0, 10);
   const menu = [];

   for (const op of result) {
      menu.push({
         label: `${op.anime.substring(0, 70)}...`,
         value: op.anime,
         description: `Information About "${op.anime}"`,
      });
   }

   const select = new MessageSelectMenu().setCustomId("refrense-select").addOptions(menu);

   const row = new MessageActionRow().addComponents([select]);

   try {
      const msg = await i.channel.send({
         content: "Choice your anime at this menus",
         components: [row],
      });

      awaitRefrenseInteraction(msg, i.member as GuildMember);
   } catch (er) {
      i.reply({
         content:
            "There is something was wrong when fetching the data, maybe the title is to loong, so i can't display it\nIf this is a bug, feel free to contact my developer at my support server.",
         ephemeral: true,
      });
      console.log(er.stack);
   }
};

export { awaitModelAnime, awaitRefrenseInteraction, awaitSeasonInteraction, MalRefrense, MalSeason };
