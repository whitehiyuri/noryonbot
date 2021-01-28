import { CommandClient } from '@pikostudio/command.ts'
import { ShardingManager } from 'discord.js'

const config = require('../config.json')

declare module 'discord.js' {
  interface Client {
    config: any
  }
}

if (process.env.SHARDING_MANAGER) {
  const client = new CommandClient({
    watch: true,
    owners: 'auto',
    commandHandler: {
      prefix: config.prefix,
    },
    currentDir: __dirname,
  })

  client.config = config
  client.login(config.token)
} else {
  const manager = new ShardingManager(__filename, {
    execArgv: __filename.endsWith('.ts') ? ['-r', 'ts-node/register'] : [],
    token: config.token,
  })
  manager.spawn()
}
