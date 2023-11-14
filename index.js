require('dotenv').config(); // Load environment variables from .env

const {Client, Collection, GatewayIntentBits, Partials} = require('discord.js');
const fs = require('fs');

const token = process.env.DISCORD_TOKEN; // Access the bot token from the environment variable

const GATEWAYINTENTS = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent];
const client = new Client({intents: GATEWAYINTENTS, partials: [Partials.Message, Partials.Reaction]});

// Create a collection for events
client.events = new Collection();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	console.log(`Event: ${event.name} in ${file} passed through handler.`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}

	// Store the event in the collection
	client.events.set(file.slice(0, -3), event);
}

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.login(token);
