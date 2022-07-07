const { SlashCommandBuilder } = require('@discordjs/builders')
const axios = require('axios')

const Docs = require('discord.js-docs')
const getMdn = require('../docs/getMdn')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('docs')
    .setDescription('Get documentation')
    .addSubcommand((sub) =>
      sub
        .setName('discordjs')
        .setDescription('Get information about Discord.js documentation')
        .addStringOption((opt) =>
          opt
            .setName('djsname')
            .setDescription('Name of the djs module')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('mdn')
        .setDescription('Get information about MDN documentation')
        .addStringOption((opt) =>
          opt
            .setName('mdnname')
            .setDescription('Name of the mdn module')
            .setRequired(true)
        )
    ),

  async execute (i) {
    const opt = i.options.getSubcommand()

    if (opt === 'discordjs') {
      const branch = 'stable'
      const max = 1024

      const replaceDisco = (str) =>
        str
          .replace(/docs\/docs\/disco/g, `docs/discord,js/${branch}`)
          .replace(/\(disco\)/g, '')

      const sty = i.options.getString('djsname')
      const doc = await Docs.fetch(branch)
      const result = await doc.resolveEmbed(sty)

      if (!result || !doc || (!result && !doc)) {
        return i.channel.send('Could not find the document.')
      }

      const string = replaceDisco(JSON.stringify(result))
      const embed = JSON.parse(string)

      embed.author.url = `https://discord.js.org/#/docs/discord.js/${branch}/general/welcome`
      embed.color = 'ORANGE'

      const extra =
        '\nGitHub: ' +
        // eslint-disable-next-line prefer-regex-literals
        new RegExp(
          /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\\/]))?/g
        )
          .exec(embed.description)[0]
          .split(')')[0]

      for (const field of embed.fields || []) {
        if (field.value.length >= max) {
          field.value = field.value.slice(0, max)
          const split = field.value.split(' ')
          let joined = split.join(' ')

          while (joined.length >= max - extra.length) {
            split.pop()
            joined = split.join(' ')
          }

          field.value = joined + extra
        }
      }

      i.reply({ embeds: [embed] })
    }
    if (opt === 'mdn') {
      try {
        await i.deferReply().catch(er => er)
        i.deleteReply()
        const query = i.options.getString('mdnname')
        const base = 'https://developer.mozilla.org'
        const uri = `${base}/api/v1/search?q=${encodeURIComponent(
          query
        )}&local=en-US`

        const documents = (await axios(uri)).data.documents

        getMdn.awaitMdn(documents, i)
      } catch (error) {
        i.reply({ content: error.message, ephemeral: true })
        console.error(error.stack)
      }
    }
  }
}
