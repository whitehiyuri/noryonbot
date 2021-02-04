import { Command, Extension, Msg, Listener, Arg } from '@pikostudio/command.ts'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'

export default class Manage extends Extension {

    @Command({name: '지우기', aliases: ['clear']})
    clear(@Msg() msg: Message, @Arg({rest: true}) query: string){
        const embed = new MessageEmbed()
        .setTitle("지우기")
        .setDescription("다음으로 적은 메시지 수를 잠시후 제거합니다")
        .setFooter("Team Alpha by 놀욘#0123", "https://cdn.discordapp.com/avatars/756849125844058172/4c232864fd92a8955f619ef1c9c62879.webp")
        msg.channel.send('제작중이며, 지금은 사용하실수없습니다')
        
    }

}