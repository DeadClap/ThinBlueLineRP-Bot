const {EmbedBuilder} = require('@discordjs/builders');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
		const welcomeMessage = new EmbedBuilder().setTitle('Welcome to Thin Blue Line RP').addFields(
			{name: 'Member', value: member.displayName},
		);

		const {systemChannel} = member.guild;
		console.log(systemChannel.id);
		if (systemChannel) {
			systemChannel.send({embeds: [welcomeMessage]});
		} else {
			console.error('System channel not found!');
		}
	},
};
