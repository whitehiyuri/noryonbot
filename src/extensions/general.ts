import { Command, Extension, Msg, Arg } from '@pikostudio/command.ts'

import { MessageEmbed, TextChannel } from 'discord.js'
import { Message } from 'discord.js'

export default class General extends Extension {
  @Command({ name: '도움말', aliases: ['','help'] })
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
      embed.setFooter(this.client.music.players.size+"개의 음성(들)이 연결되어있습니다.")
embed.setColor("GREEN")
    }
    return msg.reply(embed)
  }

  @Command({ name: '핑', aliases: ['ping'] })
  ping(@Msg() msg: Message) {
    const dt = new Date(msg.createdTimestamp);
    //const m = this.client.channels.cache.get('733958435091251254')?.send("ping up!")
    const embed = new MessageEmbed()
      .setTitle("핑")
      .setDescription(`**🏓웹소켓:** \`${this.client.ws.ping}ms\``)
      .setThumbnail("https://cdn.discordapp.com/attachments/692682565353734174/777507000233754644/ping.png")

    msg.channel.send(embed)
  }

  @Command({ name: '초대', aliases: ['invite'] })
  invite(@Msg() msg: Message) {
    const embed = new MessageEmbed()
      .setTitle(`놀욘을 초대하기`)
      .setThumbnail("https://cdn.discordapp.com/attachments/820186973624074240/820489633330102291/50c3a9d4033c2b50.png")
      .setDescription(`[🛠관리 권한으로 초대하기](https://discord.com/api/oauth2/authorize?client_id=817059354742095892&permissions=8&scope=bot)\n[💎추천 권한으로 초대하기](https://discord.com/api/oauth2/authorize?client_id=817059354742095892&permissions=3434560&scope=bot)\n[❎추천하지않는 권한으로 초대하기](https://discord.com/api/oauth2/authorize?client_id=817059354742095892&scope=bot)\n----------------------------------------------------------\n:tools: 관리를 원할때 자극히 추천\n[ 관리를 위해서라면 초대를 하시면 됩니다 ]\n:gem: 개발자가 추천하는 초대 권한\n[ 테러당할수있으니 이권한으로 초대 바래요 ]\n:negative_squared_cross_mark: 추천하지않는 권한입니다\n[ 권한이없으면 음성채널 들어갈수없을 뿐더러 메시지 관리도 불가능해집니다 ]`)
    .setColor("#ff67ff")
    msg.reply(embed)
  }

  @Command({ name: '서포트', aliases: ['support'] })
  support(@Msg() msg: Message) {
    const embed = new MessageEmbed()
      .setTitle("서포트")
      .setDescription("[Team Alpha(공식 팀 서포트)](https://alphakr.xyz/discord)\n[(제2 팀 서포트)Team Leo™](https://discord.gg/n2KUDk7)\n[놀욘봇 공식 커뮤니티](https://discord.gg/hkvxkt4W2C)")
      .setFooter(msg.author.tag, msg.author.displayAvatarURL())
    msg.channel.send(embed)
  }

  @Command({ name: '말', aliases: ['say'] })
  async say(@Msg() msg: Message, @Arg({ rest: true }) query: string) {
    const config = require("../../config.json")
    const args = msg.content.split(" ").slice(1)

    msg.channel.send(new MessageEmbed().setTitle(args[0]).setDescription(args.slice(1).join(' ')).setFooter(msg.author.tag, msg.author.displayAvatarURL()))
  }
  @Command({ name: '건의', aliases: ['r'] })
  r(@Msg() msg: Message, @Arg({ rest: true }) query: string) {
    const args = msg.content.split(" ").slice(1)
    const config = require("../../config.json")
    if (!query) return msg.channel.send("건의 내용을적어주세요")
    const embed = new MessageEmbed()
      .setTitle('📦 건의(택배)가 왔습니다.')
      .setDescription(`n!답장 ${msg.author.id} <TEXT>`)
      .addField("내용", args.join(" "))
      .setColor("#ff56f")
      .setFooter(msg.author.tag, msg.author.displayAvatarURL())

    msg.channel.send("건의를 전송하였습니다")
    const d = 0;
    (this.client.channels.cache.get("816982707074105386") as unknown as TextChannel)?.send("<@616570697875193866>",embed)
  }
    
    @Command({name: '업타임',aliases: ['uptime']})
uptime(@Msg() msg: Message) {
  const moment = require("moment");
  require("moment-duration-format");
  
const duration = moment.duration(this.client.uptime).format("현재동안`D[일] H[시간] m[분] s[초]`동안 켜져있었습니다");
  

msg.channel.send(new MessageEmbed().setTitle("업타임").setDescription(`봇이 ${duration}`).setThumbnail("https://cdn.discordapp.com/attachments/733958435091251254/826403382713253918/8d43f4bb2e851cbe.png"))
}

}
