const {SlashCommandBuilder} = require('@discordjs/builders');
const commandName = 'ping';
module.exports = {
	name: commandName, // Command name
	data: new SlashCommandBuilder()
		.setName(commandName) // Slash command name
		.setDescription('Replies with Pong!'), // Command description
	async execute(interaction) {
		// This function is the main code executed when the command is invoked.

		// Respond with 'Pong!' to the user, and make the response ephemeral (visible only to the user who invoked the command).
		await interaction.reply({content: 'Pong!', ephemeral: true});
	},
};
