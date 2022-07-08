import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, CacheType } from "discord.js-light";
import Axios from "axios";
import InteractionCommand from "../../structures/interactionCommand";
import Client from "../../structures/init";
import { getMovieDetails, getTvShow } from "../../utils/movie";

const BASE_URL = "https://api.themoviedb.org/3";

class Movie extends InteractionCommand {
   client: Client;
   constructor(client: Client) {
      super(client, {
         cmd: new SlashCommandBuilder()
            .setName("movie")
            .setDescription("Search a movie from TMDB")
            .addSubcommand((sub) =>
               sub
                  .setName("search")
                  .setDescription("Search movide from TMDB.")
                  .addStringOption((opt) =>
                     opt.setName("name").setDescription("Insert the movie name.").setRequired(true)
                  )
            )
            .addSubcommand((sub) =>
               sub
                  .setName("tvshow")
                  .setDescription("Search TVShow film from TMDB.")
                  .addStringOption((opt) =>
                     opt.setName("shownames").setDescription("Insert the tvshow name.").setRequired(true)
                  )
            ),
      });
   }

   async run(interaction: CommandInteraction<CacheType>): Promise<void> {
      await interaction.deferReply();
      const opt = interaction.options.getSubcommand();

      switch (opt) {
         case "search": {
            try {
               interaction.deleteReply().catch((er) => er);
               const name = interaction.options.getString("name");
               const res = await Axios(`${BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${name}`);
               const data = res.data;
               getMovieDetails(data, interaction);
            } catch (er) {
               interaction.editReply({
                  content: er.mssage,
               });
               console.error(er);
            }
            break;
         }

         case "tvshow": {
            try {
               interaction.deleteReply().catch((er) => er);

               const showname = interaction.options.getString("showname");
               const res = await Axios(`${BASE_URL}/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${showname}`);

               const data = res.data;
               getTvShow(data, interaction);
            } catch (er) {
               interaction.editReply({
                  content: er.message,
               });
               console.error(er);
            }
            break;
         }
      }
   }
}

export default Movie;
