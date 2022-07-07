const { MessageSelectMenu, MessageActionRow } = require('discord.js')
const getMdnInteraction = require('./getMdnInteraction')
module.exports = {
  async awaitMdn (res, i) {
    const result = res.slice(0, 10)
    const menu = []

    for (const op of result) {
      menu.push({
        label: `${op.title}`,
        value: op.slug,
        description: `Get detail information about "${op.title}"`
      })
    }

    const select = new MessageSelectMenu()
      .setCustomId('mdn-select')
      .addOptions(menu)

    const row = new MessageActionRow().addComponents([select])

    try {
      const msg = await i.channel.send({
        content: 'Choice your document at this menus',
        components: [row]
      })

      getMdnInteraction.awaitMdnInteraction(msg, res, i.member)
    } catch (er) {
      i.reply({
        content:
          "There is something was wrong when fetching the data, maybe the title is to loong, so i can't display it\nIf this is a bug, feel free to contact my developer at my support server.",
        ephemeral: true
      })
      console.log(er.stack)
    }
  }
}
