import { CommandClient } from '@pikostudio/command.ts'

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

client.login(config.token)
