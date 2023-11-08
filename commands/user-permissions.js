const {ContextMenuCommandBuilder, ApplicationCommandType} = require('discord.js');

const commandName = 'MQ: User Perms'; // Command name

module.exports = {
	name: commandName, // Command name
	data: new ContextMenuCommandBuilder()
		.setName(commandName)
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		// This function is the main code executed when the command is invoked.

		const target = interaction.targetMember; // Get the targeted user (member)

		try {
			// Fetch the member (bot) object based on the target user's ID
			const member = await interaction.guild.members.fetch(target.id);

			if (member) {
				// Check and format the permissions of the target user
				const permissions = member.permissions.toArray();
				const formattedPermissions = permissions.map(permission => `\`${permission}\``).join(', ');

				// Respond with the target user's permissions
				await interaction.reply({content: `User permissions in this guild: ${formattedPermissions}`, ephemeral: true});
			} else {
				// Handle the case where the bot is unable to fetch information about the target user
				await interaction.reply({content: 'Unable to fetch user information.', ephemeral: true});
			}
		} catch (error) {
			// Handle any errors that occur during the fetch operation
			console.error('Error fetching user information:', error);
			await interaction.reply({content: 'An error occurred while fetching user information.', ephemeral: true});
		}
	},
};

