module.exports = {
	name: 'MQ: User Perms',
	data: {
		name: 'MQ: User Perms',
		type: 2,
	},
	async execute(interaction) {
		const target = interaction.targetMember;
		// Get the member (bot) object
		const member = await interaction.guild.members.fetch(target.id);

		if (member) {
			// Check and format the permissions
			const permissions = member.permissions.toArray();
			const formattedPermissions = permissions.map(permission => `\`${permission}\``).join(', ');

			// Respond with the bot's permissions
			await interaction.reply({content: `User permissions in this guild: ${formattedPermissions}`, ephemeral: true});
		} else {
			await interaction.reply({content: 'Unable to fetch bot information.', ephemeral: true});
		}
	},
};
