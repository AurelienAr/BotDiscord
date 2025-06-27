// src/index.js
require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs   = require('fs');
const path = require('path');

// 1) Crée le client Discord avec l’intent Guilds (nécessaire pour les slash-commands)
const client = new Client({
  intents: [ GatewayIntentBits.Guilds ]
});

// 2) Charge tes commandes dans client.commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// 3) Quand le bot est prêt
client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// 4) Écoute les interactions (slash commands)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ Erreur interne.', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ Erreur interne.', ephemeral: true });
    }
  }
});

// 5) Démarre la connexion
client.login(process.env.BOT_TOKEN);
