const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
	name: 'Ping',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply({content: 'Pong!', ephemeral: true});
	},
};
