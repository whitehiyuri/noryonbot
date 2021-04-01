import { Command, Extension, Msg, Listener, Arg } from '@pikostudio/command.ts'
import { TextChannel } from 'discord.js'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'

export default class Manage extends Extension {

    @Command({name: '지우기', aliases: ['clear']})
    async clear(@Msg() msg: Message, @Arg({rest: true}) query: string){
        const embed = new MessageEmbed()
        .setTitle("지우기")
        .setDescription(`${query}개 메시지를 제거합니다`)
        .setFooter("Team Alpha by 놀욘#0123", "https://cdn.discordapp.com/avatars/756849125844058172/4c232864fd92a8955f619ef1c9c62879.webp")
        if(!query) return msg.channel.send("제거할 메시지수를 적어주세요")
        if(isNaN(Number(query))) return msg.channel.send("숫자만 적어주세요")
        if(!msg.member?.permissions.has("MANAGE_MESSAGES")) return msg.reply("거기 유저분! `[ 메시지 관리 ]` 권한이 없는데 다시 확인해주실래요?")
        if(!msg.guild?.me?.permissions.has("MANAGE_MESSAGES")) return msg.reply("제가 권한이없는데요.. `[ 메시지 관리 ]` 권한이 있는지 확인을 해주세요.")
        msg.channel.send(embed).then(x=> setTimeout(()=> {x.delete()},1000))
        msg.delete()
await (msg.channel as TextChannel).bulkDelete(Number(query))      
      

        
    }


    @Command({name: '슬로우모드', aliases: ['slowmode']})
    slowmode(@Msg() msg: Message, @Arg({rest: true}) query: string) {
        if(!query) return msg.reply("적어주세요")
    if(isNaN(Number(query))) return msg.channel.send("숫자만 적어주십시오")
     const d = 0;
(msg.channel as TextChannel).setRateLimitPerUser(Number(query))
msg.channel.send(`슬로우모드를 \`${query}\`로 설정했습니다`)
    }



}