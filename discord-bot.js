const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require("./config.json");
const { bot_token, channel_id } = config;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.once('ready', () => {
    console.log('Ready!');});
client.on('messageCreate', message => {
    if (message.author.bot || message.channel.id !== config.channel_id) return;
    if (message.content === '!ping') {
        message.reply('!pong');
    }
    else if (message.content === '!help') {
      return message.reply(`Available Command List:
  • !help (shows all command list)
  • !online (shows total online player)
  • !giverole <role> <GrowID> (give role to player)`)
    }
    else if (message.content === '!online') {
      const file = path.join(__dirname, 'online.txt');
      try {
        let data = fs.readFileSync(file, 'utf-8');
        return message.reply(`Total Online Player: ${data}`);
      } catch (error) { 
        message.reply(error); 
      }
    }
    else if (message.content.startsWith('!giverole')) {
      let a_ = message.content.split(' ');
      if (a_.length !== 3) return message.reply('Usage: !giverole <role name> <GrowID>');
      const filePath = path.join(__dirname, `database/players/${a_[2]}_.json`);
      try {
        let data = fs.readFileSync(filePath, 'utf-8');
        let jsondata = JSON.parse(data);
        jsondata[a_[1]] = true;
        fs.writeFileSync(filePath, JSON.stringify(jsondata, null, 2));
        return message.reply(`Success given role to ${a_[2]}`);
      } catch (error) { message.reply(error); }
    }
    else message.reply('Unknown Command, try use !help for shows all available command list');
});
client.login(config.bot_token);