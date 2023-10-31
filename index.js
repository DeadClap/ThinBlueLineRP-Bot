require('dotenv').config(); // Load environment variables from .env

const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const token = process.env.DISCORD_TOKEN; // Access the bot token from the environment variable
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID || null;

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    // Add more slash commands here
].map(command => command.toJSON());

const client = new Client({ intents: ['Guilds'] });

const rest = new REST({ version: '10' }).setToken(token);


(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.login(token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    }
    // Handle more interactions here
});
