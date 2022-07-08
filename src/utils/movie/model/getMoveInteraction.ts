import { GuildMember, Message, MessageEmbed } from "discord.js-light";

const awaitMovieInteraction = async (msg: Message, data, member: GuildMember) => {
   const i = await msg.channel
      .awaitMessageComponent({
         filter: (m) => m.member.id === member.id,
         time: 6e4,
      })
      .catch((er) => er);

   if (i instanceof Error) return;

   await i.deferReply().catch((er) => er);
   i.deleteReply();

   try {
      // eslint-disable-next-line
    switch (i.customId) {
         case "movie-select": {
            const value = i.values[0];
            const res = data.results.find((m) => m.title === value);

            const embed = new MessageEmbed()
               .setColor("ORANGE")
               .setThumbnail(
                  `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${res.poster_path}` ||
                     i.client.displayAvatarURL()
               )
               .setDescription(res.overview || "No Description")
               .addFields([
                  {
                     name: "Details",
                     value: [
                        `**Original Language:** ${res.original_language}`,
                        `**Popularity:** ${res.popularity}`,
                        `**Release Date:** ${res.release_date}`,
                        `**Vote Average:** ${res.vote_average}`,
                        `**Vote Count:** ${res.vote_count}`,
                     ].join("\n"),
                  },
               ]);

            msg.edit({ content: value, embeds: [embed], components: [] });
            break;
         }
      }
   } catch (er) {
      i.reply({
         content:
            "There is something was wrong when getting the movie data\nFeel free to contact my delveoper at my support server.",
         ephemeral: true,
      });
      console.error(er.stack);
   }
};

const awaitTvInteraction = async (msg: Message, data, member: GuildMember) => {
   const i = await msg.channel
      .awaitMessageComponent({ filter: (m) => m.member.id === member.id, time: 6e4 })
      .catch((er) => er);

   if (i instanceof Error) return;

   await i.deferReply().catch((er) => er);
   i.deleteReply();

   try {
      switch (i.customId) {
         case "tvshow-select": {
            const value = i.values[0];
            const res = data.results.find((t) => t.name === value);

            const embed = new MessageEmbed()
               .setColor("ORANGE")
               .setThumbnail(
                  `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${res.poster_path}` ||
                     i.client.displayAvatarURL()
               )
               .setDescription(res.overview || "No Description")
               .addFields([
                  {
                     name: "Details",
                     value: [
                        `**Original Language:** ${res.original_language}`,
                        `**Popularity:** ${res.popularity}`,
                        `**Release Date:** ${res.release_date}`,
                        `**Vote Average:** ${res.vote_average}`,
                        `**Vote Count:** ${res.vote_count}`,
                     ].join("\n"),
                  },
               ]);

            msg.edit({ content: value, embeds: [embed], components: [] });
            break;
         }
      }
   } catch (er) {
      i.reply({
         content:
            "There is something was wrong when getting the movie data\nFeel free to contact my delveoper at my support server.",
         ephemeral: true,
      });
      console.error(er.stack);
   }
};

export { awaitMovieInteraction, awaitTvInteraction };
