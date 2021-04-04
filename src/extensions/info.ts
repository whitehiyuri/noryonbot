import { Command, Extension, Msg, Arg } from '@pikostudio/command.ts'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'

export default class Info extends Extension {

    @Command({ name: '서버정보', aliases: ['serverinfo', '서정', 'si'] })
    serverinfo(@Msg() msg: Message, @Arg({ rest: true }) query: string) {
        const embed = new MessageEmbed()
            .setTitle(`${msg.guild?.name} 서버정보`)
            .setColor("#ff5ff")
            .addField("기본 정보", [
                `ID: ${msg.guild?.id}`,
                `이름: ${msg.guild?.name}`,
            ])
            .addField("채널", [
                `텍스트채널 수: ${msg.guild?.channels.cache.filter(x => x.type == 'text').size}`,
                `음성채널 수: ${msg.guild?.channels.cache.filter(x => x.type == 'voice').size}`,
                `공지 채널 수: ${msg.guild?.channels.cache.filter(x => x.type == 'news').size}`,
                `카테고리채널 수: ${msg.guild?.channels.cache.filter(x => x.type == 'category').size}`
            ])
        .addField("유저", [
          `모든 멤버 수: ${msg.guild?.members.cache.size}`,
          `모든 유저 수: {A/S}`,
          `모든 봇 수: {A/S}`
        ])
.setThumbnail(msg.guild!.iconURL()!)
msg.channel.send(embed)
    }

    @Command({ name: '개발자', aliases: ['dev'] })
    dev(@Msg() msg: Message) {


        const embed = new MessageEmbed()
            .setTitle("개발자 정보")
            .addField("운영자", this.client.users.cache.get("616570697875193866")?.tag)
            .addField("개발자", `\`${this.client.users.cache.get('674877162557407242')?.tag}\`, \`${this.client.users.cache.get('628595345798201355')?.tag}\``)
        msg.reply(embed)

    }


    @Command({name: "프로필", aliases: ['profile']})
    profile(@Msg() msg: Message, @Arg({rest: true}) query: string) {
        const args = query.split(" ").slice(1)

       
        if(!query) {
            const embed = new MessageEmbed()
            .setTitle(`프로필`)
            .setImage(msg.author.displayAvatarURL({dynamic: true, size: 1024}))
            return msg.channel.send(embed)}

            if(query) {
                const fembed = new MessageEmbed()
                .setTitle(`${this.client.users.cache.get(`${query}`)?.username}의 프로필`)
                .setImage(`${this.client.users.cache.get(`${query}`)?.displayAvatarURL({dynamic: true, size: 1024})}`)
                 return msg.channel.send(fembed)
             }

    }
}
