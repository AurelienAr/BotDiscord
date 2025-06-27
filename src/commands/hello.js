// src/commands/hello.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Répond un joli bonjour à l’utilisateur'),
  async execute(interaction) {
    await interaction.reply(`Hello, ${interaction.user.username} !`);
  },
};
