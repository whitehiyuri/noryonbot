import { Command, Extension, Msg, Listener, Arg } from '@pikostudio/command.ts'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'

export default class Music extends Extension {
    @Command({name: '재생', aliases: ['play']})   
    
    async play(@Msg() msg: Message, @Arg({rest: true}) query: string) {
    const voiceChannel = msg.member!.voice!.channel;
        if (!msg.member?.voice?.channelID) return msg.reply('음성채널에 들어가주세여')
        if (!query) return msg.reply('명령어 사용법: 재생 <url 또는 검색어>')
        const player = this.client.music.players.get(msg.guild!.id) ?? this.client.music.create({
            guild: msg.guild!.id,
            textChannel: msg.channel.id,
            voiceChannel: msg.member.voice.channelID
        })
       
        if (!msg.member!.voice!.channel!.permissionsFor(msg.guild!.me!).has('CONNECT')) return msg.reply("음성채널에 참여할 권한이 없어서 재생할수없어여")
        if (!msg.member!.voice!.channel!.permissionsFor(msg.guild!.me!).has('SPEAK')) return msg.reply("음성채널에서 말할 권한이없어서 재생할수없어여")
        
        
        const data = await this.client.music.search(query)
        if (data.tracks[0]) {
            player.queue.add(data.tracks[0])
            player.connect()
            if (!player.playing) player.play()
            
         return msg.reply(`다음[\`${data.tracks[0].title}\`] 음악을 추가를 완료했어요`)
        }
    }
    
     @Command({name: '현재재생', aliases: ['np']})
    async np(@Msg() msg: Message) {
        const player = this.client.music.players.get(msg.guild!.id)!
        const embed = new MessageEmbed()
        .setTitle("현재 재생중")
        .setDescription(player.queue.current!.title+`\n시간: ${require('moment')(player.queue.current!.duration).format("HH시간 mm분 ss초")}`)
        .setThumbnail(player.queue.current!.displayThumbnail!('maxresdefault'))
        .setURL(player.queue.current!.uri!)
        msg.reply(embed)
        
    }
    
    @Command({name: '스킵', aliases: ['skip', 's']})
    async skip(@Msg() msg: Message) {
        const player = this.client.music.players.get(msg.guild!.id)!
              player.stop()
        msg.reply("다음 곡으로 넘겼습니다")
    }
    
    @Command({name: '중지', aliases: ['stop', 's']})
    async s(@Msg() msg: Message) {
        const player = this.client.music.players.get(msg.guild!.id)!
              player.destroy()
        msg.reply("⏹음악을 중지시켰어요\n`이 플레이어의 재생목록을 제거하고 중지를 했어요`")
    }
    
    @Command({name: "볼륨", aliases: ['volume', 'v']})
    volume(@Msg() msg: Message, @Arg({rest: true}) query: string){
        const player = this.client.music.players.get(msg.guild!.id)!
              if (!query) return msg.reply(`현재 볼륨: ${player.volume}`)
        
    player.setVolume(Number(query))
    msg.reply(`볼륨이 변경됨(${player.volume}%)\n"setVolume now ${player.volume}%."`)
    }
    
    @Command({name: '반복', aliases: ['repeat', '반복']})
    repeat(@Msg() msg: Message, @Arg({rest: true}) query: string) {    
        const player = this.client.music.players.get(msg.guild!.id)!
            
        
        if (!query) return msg.reply(`\`1. <재생목록[허용/비허용]>\n2. <곡반복[허용/비허용]>\`\n 재생목록 반복: ${player.queueRepeat? '허용': '비허용'}\n곡 반복: ${player.trackRepeat ? '허용':'비허용'}`) 
        if (query == '재생목록허용')  return msg.reply("재생목록 반복을 켜짐으로 설정합니다"), player.setQueueRepeat(true)
        if(query == '재생목록비허용')   return msg.reply("재생목록 반복을 꺼짐으로 설정합니다"), player.setQueueRepeat(false)
        if (query == '곡반복허용') return msg.reply("곡반복을 켜짐으로 설정합니다."), player.setTrackRepeat(true)
        if (query =='곡반복비허용') return msg.reply("곡반복을 꺼짐으로 설정합니다."), player.setTrackRepeat(false)

    
    }
    @Listener('ready')
    raw() {
        this.client.music.init(this.client.user!.id)
    }
    
   
}