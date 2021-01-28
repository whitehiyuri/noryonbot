import { CommandClient } from '@pikostudio/command.ts'
import Dokdo from 'dokdo'

const config = require('../config.json')

declare module 'discord.js' {
  interface Client {
    config: any
  }
}

const client = new CommandClient({
  watch: true,
  owners: 'auto',
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

client.once('ready', () => {
  const dokdo = new Dokdo(client, {
    noPerm: (msg) => msg.reply('권한 없음 ㅅㄱ'),
    prefix: config.prefix,
  })
  client.on('message', (msg) => dokdo.run(msg))
})

client.login(config.token)
