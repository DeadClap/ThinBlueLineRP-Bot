module.exports = {
	name: 'Mod Action: Hate Speech',
	data: {
		name: 'Mod Action: Hate Speech',
		type: 2,
	},
	async execute(interaction) {
		const target = interaction.targetMember;
		const user = await interaction.client.users.fetch(target.id);
		const sender = await interaction.client.users.fetch(interaction.member.user.id);
		console.log(user.id);
		console.log(user.username);
		await target.timeout(1800, `${sender.username} - Mod Action: Hate Speech`);
		await interaction.reply(`Timed out: ${user.username}`);
	},
};
