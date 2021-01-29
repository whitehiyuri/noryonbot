import { Command, Extension, Msg } from '@pikostudio/command.ts'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'

export default class Music extends Extension {
 @Command({name: '재생', aliases: ['play']})   
play(@Msg() msg: Message) {
    msg.reply("아니아니 아직 제작중이라구요!!")
}
}