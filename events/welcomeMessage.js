const {EmbedBuilder} = require('@discordjs/builders');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member, client) {
		const welcomeMessage = new EmbedBuilder().setTitle('Welcome to Thin Blue Line RP').addFields(
			{name: 'Member', value: member.displayName},
		).setThumbnail(member.user.displayAvatarURL());

		const {systemChannel} = member.guild;
		console.log(systemChannel.id);
		if (systemChannel) {
			systemChannel.send({embeds: [welcomeMessage]});
		} else {
			client.emit('log', 'error', 'bleh', 'System channel not found!');
		}
	},
};
