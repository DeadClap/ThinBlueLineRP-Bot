const {ContextMenuCommandBuilder} = require('@discordjs/builders');
const {ApplicationCommandType, PermissionFlagsBits} = require('discord.js');

// Define the command name
const commandName = 'MA: Hate Speech';

// Export the command module
module.exports = {
	// Name of the command
	name: commandName,

	// Define command properties
	data: new ContextMenuCommandBuilder()
		.setName(commandName) // Set the command name
		.setType(ApplicationCommandType.User) // Set the command type to interact with a user
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), // Set default member permissions

	// Execute function called when the command is invoked
	async execute(interaction) {
		// Get the targeted member
		const target = interaction.targetMember;

		// Fetch the user associated with the targeted member
		const user = await interaction.client.users.fetch(target.id);

		// Fetch the user who initiated the command
		const sender = await interaction.client.users.fetch(interaction.member.user.id);

		// Perform a timeout action on the target user
		await target.timeout(30 * 60 * 1000, `${sender.username} - Mod Action: Hate Speech`);

		// Respond with an ephemeral message indicating the timeout action
		await interaction.reply({content: `Timed out: ${user.username}`, ephemeral: true});
	},
};
