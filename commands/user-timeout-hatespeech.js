const {ContextMenuCommandBuilder} = require('@discordjs/builders');
const {ApplicationCommandType} = require('discord.js');

module.exports = {
	name: 'MA: Hate Speech',
	data: new ContextMenuCommandBuilder()
		.setName('MA: Hate Speech')
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		const target = interaction.targetMember;
		const user = await interaction.client.users.fetch(target.id);
		const sender = await interaction.client.users.fetch(interaction.member.user.id);
		console.log(user.id);
		console.log(user.username);
		if (interaction.memberPermissions.has('ModerateMembers', true)) {
			await target.timeout(30 * 60 * 1000, `${sender.username} - Mod Action: Hate Speech`);
			await interaction.reply({content: `Timed out: ${user.username}`, ephemeral: true});
		} else {
			await interaction.reply({content: 'Insufficient Permissions.', ephemeral: true});
		}
	},
};
