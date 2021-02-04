import { CommandClient } from '@pikostudio/command.ts'
import Dokdo from 'dokdo'
import {Manager} from 'erela.js'
import {TextChannel} from 'discord.js'

const config = require('../config.json')
//const { Manager } = require("erela.js");
declare module 'discord.js' {
  interface Client {
    config: any
      music: Manager
  }
}



const client = new CommandClient({
  watch: true,
  owners: config.owner,
  commandHandler: {
    prefix: config.prefix,
  },
  currentDir: __dirname,
})

process.send =
  process.send ||
  function () {
    return false
  }

client.config = config
client.loadExtensions('extensions/general')
client.loadExtensions('extensions/music')
client.loadExtensions('extensions/manage')
client.music = new Manager({
  // Pass an array of node. Note: You do not need to pass any if you are using the default values (ones shown below).
  nodes: [
    // If you pass a object like so the "host" property is required
    {
      host: "localhost", // Optional if Lavalink is local
      port: 2333, // Optional if Lavalink is set to default
      password: "youshallnotpass", // Optional if Lavalink is set to default
    }],
      send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
      }
})
.on("nodeConnect", node => console.log(`Node ${node.options.identifier} connected`))
  .on("nodeError", (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))
  .on("trackStart", (player, track) => {
    (client.channels.cache.get(player.textChannel!) as TextChannel)?.send(`<a:yes:753994796363939881>재생을 시작합니다: ${track.title}`);
  })
  .on("queueEnd", (player) => {
    (client.channels.cache.get(player.textChannel!) as TextChannel)?.send("음악이 종료되었어요!");

    player.destroy();
  });

client.on('raw', payload => client.music.updateVoiceState(payload))
    

client.once('ready', () => {
  const dokdo = new Dokdo(client, {
    noPerm: (msg) => msg.reply('권한 없음 ㅅㄱ'),
    prefix: config.prefix,
      owners: [...config.dev, config.owner]
  })
 console.log("ONLINE!")
  client.on('message', (msg) => dokdo.run(msg))
})

client.login(config.token)
