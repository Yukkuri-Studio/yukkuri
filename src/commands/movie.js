const { SlashCommandBuilder } = require('@discordjs/builders')
const Axios = require('axios')
const tmdb = require('../tmdb/getMovie')
const BASE_URL = 'https://api.themoviedb.org/3'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('movie')
    .setDescription('Get movie details from TMDB.')
    .addSubcommand((sub) =>
      sub
        .setName('search')
        .setDescription('Search movide from TMDB.')
        .addStringOption((opt) =>
          opt.setName('name')
            .setDescription('Insert the movie name.')
            .setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('tvshow')
        .setDescription('Search TVShow film from TMDB.')
        .addStringOption((opt) =>
          opt.setName('shownames')
            .setDescription('Insert the tvshow name.')
            .setRequired(true))),
  async execute (i) {
    const opt = i.options.getSubcommand()

    switch (opt) {
      case 'search': {
        try {
          await i.deferReply().catch((er) => er)
          i.deleteReply()
          const name = i.options.getString('name')
          const res = await Axios(
            `${BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${name}`
          )
          const data = res.data

          tmdb.getMovieDetails(data, i)
        } catch (er) {
          i.reply({
            content:
              'There is something was wrong when fetching movie data\nFeel free to contact my developer at my support server.',
            ephemeral: true
          })
          console.error(er.stack)
        }
        break
      }
      case 'tvshow': {
        try {
          await i.deferReply().catch(er => er)
          i.deleteReply()

          const showname = i.options.getString('showname')
          const res = await Axios(`${BASE_URL}/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${showname}`)

          const data = res.data
          tmdb.getTvShow(data, i)
        } catch (er) {
          i.reply({ content: er.message, ephemeral: true })
          console.error(er.stack)
        }
        break
      }
    }
  }
}
