// src/deploy-commands.js
require('dotenv').config();
const { REST }   = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs   = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  // Si tu utilises SlashCommandBuilder(), fais : commands.push(command.data.toJSON());
  commands.push(command.data.toJSON ? command.data.toJSON() : command.data);
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    const appId = process.env.APP_ID;
    let route, scope;
    if (process.env.GUILD_ID) {
      route = Routes.applicationGuildCommands(appId, process.env.GUILD_ID);
      scope = 'en guild (dev)';
    } else {
      route = Routes.applicationCommands(appId);
      scope = 'global (prod)';
    }

    console.log(`🔄 Enregistrement des commandes ${scope}…`);
    await rest.put(route, { body: commands });
    console.log(`✅ Commandes enregistrées ${scope}.`);
  } catch (error) {
    console.error(error);
  }
})();
