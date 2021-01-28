import { Command, Extension, Msg } from '@pikostudio/command.ts'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'

export default class General extends Extension {
  @Command({ name: '도움말', aliases: ['help'] })
  help(@Msg() msg: Message) {
    const modules = this.client.extensions
    const categories = modules.map((r) => ({
      commands: r.commands,
      name: r.constructor.name,
    }))
    const embed = new MessageEmbed()
    embed.setTitle('도움말')
    for (const category of categories) {
      embed.addField(
        category.name,
        category.commands
          .map((i) => i.name)
          .map((r) => `\`${r}\``)
          .join(', ') || '명령어 없음',
      )
    }
    return msg.reply(embed)
  }
}
