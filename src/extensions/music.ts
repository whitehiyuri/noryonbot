import { Command, Extension, Msg, Listener, Arg } from '@pikostudio/command.ts'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'

export default class Music extends Extension {
    @Command({ name: '재생', aliases: ['play'] })
    async play(@Msg() msg: Message, @Arg({ rest: true }) query: string) {
        if (!msg.member?.voice?.channelID) return msg.reply('음성채널에 들어가주세여')
        if (!query) return msg.reply('명령어 사용법: 재생 <url 또는 검색어>')
        const player = this.client.music.players.get(msg.guild!.id) ?? this.client.music.create({
            guild: msg.guild!.id,
            textChannel: msg.channel.id,
            voiceChannel: msg.member.voice.channelID
        })

        if (!msg.member!.voice?.channel?.permissionsFor?.(msg.guild!.me!)?.has('CONNECT')) return msg.reply("음성채널에 참여할 권한이 없어서 재생할수없어여")
        if (!msg.member!.voice?.channel?.permissionsFor?.(msg.guild!.me!)?.has('SPEAK')) return msg.reply("음성채널에서 말할 권한이없어서 재생할수없어여")


        const data = await this.client.music.search(query)
        if (data.tracks[0]) {
            player.queue.add(data.tracks[0])
            player.connect()
            if (!player.playing) player.play()

            return msg.reply(`다음[\`${data.tracks[0].title}\`] 음악을 추가를 완료했어요`)
        }
    }

    @Command({ name: '현재재생', aliases: ['np'] })
    async np(@Msg() msg: Message) {
        const player = this.client.music.players.get(msg.guild!.id)!
        if (!player.playing) return msg.channel.send("죄송합니다만.. 음악을 틀고 하셨나요?")
        const moment = require("moment");
        require("moment-duration-format");
      const duration = moment.duration(player.queue.current!.duration).format("`D[일] H[시간] m[분] s[초]`");
        
        const embed = new MessageEmbed()
            .setTitle("현재 재생중")
            .setDescription(`\`\`\`${player.queue.current!.title}\`\`\`` + `\n시간: ${duration}`)
            .setThumbnail(player.queue.current!.displayThumbnail!('maxresdefault'))
            .setURL(player.queue.current!.uri!)
        msg.reply(embed)

    }

    @Command({ name: '스킵', aliases: ['skip', 's'] })
    async skip(@Msg() msg: Message) {
        if (!msg.member?.voice?.channelID) return msg.reply('음성채널에 들어가주세여')
        
        const player = this.client.music.players.get(msg.guild!.id)!
        if (!player.playing) return msg.channel.send("죄송합니다만.. 음악을 틀고 하셨나요?")
        
        player.stop()
        msg.reply("다음 곡으로 넘겼습니다")
    }

    @Command({ name: '중지', aliases: ['stop', 's'] })
    async s(@Msg() msg: Message) {
        const player = this.client.music.players.get(msg.guild!.id)!
        if (!player.playing) return msg.channel.send("죄송합니다만.. 음악을 틀고 하셨나요?")
        if (!msg.member?.voice?.channelID) return msg.reply('음성채널에 들어가주세여')
        player.destroy()
        msg.reply("⏹음악을 중지시켰어요\n`이 플레이어의 재생목록을 제거하고 중지를 했어요`")
    }

    @Command({ name: "볼륨", aliases: ['volume', 'v'] })
    volume(@Msg() msg: Message, @Arg({ rest: true }) query: string) {
        const player = this.client.music.players.get(msg.guild!.id)!
        if (!player.playing) return msg.channel.send("죄송합니다만.. 음악을 틀고 하셨나요?")
        if (!msg.member?.voice?.channelID) return msg.reply('음성채널에 들어가주세여')
       
        if (!query) return msg.reply(`현재 볼륨: ${player.volume}`)

        player.setVolume(Number(query))
        msg.reply(`볼륨이 변경됨(${player.volume}%)\n"setVolume now ${player.volume}%."`)
    }

    @Command({ name: '반복', aliases: ['repeat', '반복'] })
    repeat(@Msg() msg: Message, @Arg({ rest: true }) query: string) {
        const player = this.client.music.players.get(msg.guild!.id)!
        if (!player.playing) return msg.channel.send("죄송합니다만.. 음악을 틀고 하셨나요?")
        if (!msg.member?.voice?.channelID) return msg.reply('음성채널에 들어가주세여')
        if (!query) return msg.reply(`\`1. 재생목록(허용/비허용)\n2. 곡반복(허용/비허용)\n3. 끄기 - 반복모드를 끕니다\`\n 재생목록 반복: ${player.queueRepeat ? '허용' : '비허용'}\n곡 반복: ${player.trackRepeat ? '허용' : '비허용'}`)
        if (query == '재생목록허용') return msg.reply("재생목록 반복을 켜짐으로 설정합니다"), player.setQueueRepeat(true)
        if (query == '재생목록비허용') return msg.reply("재생목록 반복을 꺼짐으로 설정합니다"), player.setQueueRepeat(false)
        if (query == '곡반복허용') return msg.reply("곡반복을 켜짐으로 설정합니다."), player.setTrackRepeat(true)
        if (query == '곡반복비허용') return msg.reply("곡반복을 꺼짐으로 설정합니다."), player.setTrackRepeat(false)
        if (query == '끄기') return msg.reply(`모든 반복모드를 꺼짐으로 설정합니다.\n\n**재생목록 상태**\n재생목록 반복: ${player.queueRepeat ? '허용' : '비허용'}\n곡 반복: ${player.trackRepeat ? '허용' : '비허용'}`), player.setTrackRepeat(false), player.setQueueRepeat(false)
        }

        @Command({name: '재생목록', aliases: ['queue', 'q']})
        async queue(@Msg() msg: Message) {
            const player = this.client.music.players.get(msg.guild!.id)!
            if (!player.playing) return msg.channel.send("죄송합니다만.. 음악을 틀고 하셨나요?")
            
                  msg.channel.send(`\`\`\`\n${player.queue.map((x, i)=> 1+i++ + `. ` + x.title + "[ " + x.requester + " ]").join("\n")} \`\`\` \n\`${player.queue.current!.title}\`를 재생중..`)
        }
        
        @Command({name: '일시정지', aliases: ['pause']})
        pause(@Msg() msg: Message) {
            if (!msg.member?.voice?.channelID) return msg.reply('음성채널에 들어가주세여')
            const player = this.client.music.players.get(msg.guild!.id)!
            //if (!player) return msg.channel.send("죄송합니다만.. 음악을 틀고 하셨나요?")
            player.pause(true)
                  msg.channel.send(`일시정지 되었습니다`)
            
        }
        
        @Command({name: '재개', aliases: ['resume']})
        resume(@Msg() msg: Message) {
            if (!msg.member?.voice?.channelID) return msg.reply('음성채널에 들어가주세여')
        const player = this.client.music.players.get(msg.guild!.id)!
        if (!player.playing) return msg.channel.send("죄송합니다만.. 음악을 틀고 하셨나요?")
        player.pause(false)
              msg.channel.send("음악이 재개되었습니다")
        
        }

        @Command({name: '제거', aliases: ['remove']})
    remove(@Msg() msg: Message, @Arg({rest: true}) query: string) {
        if (!msg.member?.voice?.channelID) return msg.reply('음성채널에 들어가주세여')
        const player =this.client.music.players.get(msg.guild!.id)!
        if (!player.playing) return msg.channel.send("죄송합니다만.. 음악을 틀고 하셨나요?")
    
    if(!query) return msg.reply("적어주시죠")
    if(isNaN(Number(query))) return msg.reply("숫자만 적어줘요")
    const args = msg.content.split(" ").slice(1)
    if(Number(args[0]) < 0) return msg.channel.send("0 이하인 숫자는 제거못하십니다")
    msg.channel.send(`${query}번을 제거했습나다`), player.queue.remove(Number(query))
}
    
        @Listener('ready')
    raw() {
        this.client.music.init(this.client.user!.id)
    }


}
