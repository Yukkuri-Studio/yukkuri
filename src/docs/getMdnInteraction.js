const { MessageEmbed } = require('discord.js')
module.exports = {
  async awaitMdnInteraction (msg, data, member) {
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
      switch (i.customId) {
        case 'mdn-select': {
          const value = i.values[0]

          const documents = data.find((d) => d.slug === value)
          console.log(documents)
          const embed = new MessageEmbed()
            .setAuthor({
              name: 'MDN Documentation',
              iconURL:
              'https://avatars.githubusercontent.com/u/7565578?s=200&v=4'
            })
            .setColor('ORANGE')
            .setTitle(documents.title)
            .setURL(`https://developer.mozilla.org/${documents.mdn_url}`)
            .setDescription(documents.summary)
            .addFields([
              {
                name: 'Hightlight',
                value: documents.highlight.body.join('\n')
              },
              {
                name: 'Details',
                value: [
                  `**Title:** ${documents.title}`,
                  `**Popularity**: ${documents.popularity}`,
                  `**Score:** ${documents.score}`
                ].join('\n')
              }
            ])

          msg.edit({ content: `Document for **${documents.title}**`, embeds: [embed], components: [] })
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
