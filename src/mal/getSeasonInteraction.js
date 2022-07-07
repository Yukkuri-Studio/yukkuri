const Mal = require('mal-scraper')
const getAnimeName = require('./getAnimeName')

module.exports = {
  async awaitSeasonInteraction (msg, member) {
    const i = await msg
      .awaitMessageComponent({
        filter: (m) => m.member.id === member.id,
        max: 1,
        time: 6e4
      })
      .catch((er) => er)

    if (i instanceof Error) return
    await i.deferReply().catch((er) => er)
    i.deleteReply()

    try {
      // eslint-disable-next-line
      switch (i.customId) {
        case 'tv-select': {
          const value = i.values[0]
          const res = await Mal.getInfoFromName(value)

          const animes = await getAnimeName.awaitModelAnime(value)

          msg.edit({
            embeds: [animes.embed],
            content: `${res.title}`,
            components: [animes.row]
          })
          break
        }
      }
    } catch (er) {
      i.reply({
        content:
          'There is something was wrong, please contact my developer at my support server',
        ephemeral: true
      })
      console.error(er)
    }
  }
}
