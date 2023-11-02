const {SlashCommandBuilder,ActionRowBuilder} = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botpermissions')
		.setDescription('Check the bot\'s permissions in this guild'),
	async execute(interaction) {
		// Get the member (bot) object
		const member = interaction.guild.members.cache.get(interaction.client.user.id);

		if (member) {
			// Check and format the permissions
			const permissions = member.permissions.toArray();
			const formattedPermissions = permissions.map(permission => `\`${permission}\``).join(', ');

			// Respond with the bot's permissions
			await interaction.reply(`Bot permissions in this guild: ${formattedPermissions}`);
		} else {
			await interaction.reply('Unable to fetch bot information.');
		}
	},
};
