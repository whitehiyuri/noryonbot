import { Command, Extension, Msg, Arg } from '@pikostudio/command.ts'

import { MessageEmbed, TextChannel } from 'discord.js'
import { Message } from 'discord.js'

export default class Dev extends Extension {
@Command({name: '답장', aliases: ['reply']})
reply(@Msg() msg: Message, @Arg({rest: true})query: string){
    const args = query.slice(0).split(" ")
    const config = require('../../config.json')
    let dev = [...config.dev, config.owner];
    if(!dev.includes(msg.author.id)) return msg.channel.send("오직 관리자만 사용가능합니다")
    if(!query) return msg.channel.send("입력바랍니다")
    if(!args.slice(1).join(" ")) return msg.channel.send("ID 적어주세용")
    if(!args[0]) return msg.channel.send("답장할거 말해주세요")
    
    const d = 0;
    (this.client.users.cache.get(args[0]) as unknown as TextChannel)?.send(`\`[관리자ㅣ${msg.author.tag}]\` ${args.slice(1).join(' ')}`).catch(err => msg.channel.send(`에러가 났습니다\n\`${err}\``))
    msg.channel.send("답장을 보냈습니다")
}



}