const {EmbedBuilder} = require('@discordjs/builders');
const {ContextMenuCommandBuilder, ApplicationCommandType} = require('discord.js');

const commandName = 'MQ: User Info'; // Command name

module.exports = {
	name: commandName, // Command name
	data: new ContextMenuCommandBuilder()
		.setName(commandName)
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		// This function is the main code executed when the command is invoked.

		const target = interaction.targetMember; // Get the targeted user (member)
		const roleName = 'Staff Team';
		try {
			// Fetch the member (bot) object based on the target user's ID
			const member = await interaction.guild.members.fetch(target.id);

			if (member) {
				// Check and format the permissions of the target user
				const permissions = member.permissions.toArray();
				const formattedPermissions = permissions.map(permission => `\`${permission}\``).join(', ');
				const isStaff = member.roles.cache.some(role => role.name === roleName);
				const highestRole = member.roles.highest;
				// Respond with the target user's permissions
				const embed1 = new EmbedBuilder()
					.setTitle(`${target.user.username} ${target.user.bot ? ' - BOT' : ''}`)
					.addFields(
						{name: 'ID', value: target.id, inline: true},
						{name: 'Staff Member', value: isStaff ? 'Yes' : 'No', inline: true},
						{name: 'Top Role', value: highestRole.name, inline: true},
						{name: 'Permissions', value: formattedPermissions},
					).setThumbnail(member.user.displayAvatarURL());
				await interaction.reply({embeds: [embed1], ephemeral: true});
			} else {
				// Handle the case where the bot is unable to fetch information about the target user
				await interaction.reply({content: 'Unable to fetch user information.', ephemeral: true});
			}
		} catch (error) {
			// Handle any errors that occur during the fetch operation
			interaction.client.emit('log', 'error', 'bleh', 'Error fetching user information:', error);
			await interaction.reply({content: 'An error occurred while fetching user information.', ephemeral: true});
		}
	},
};

