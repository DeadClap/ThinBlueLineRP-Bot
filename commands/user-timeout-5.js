module.exports = {
    name: 'Timeout - 5 Seconds',
    data: {
        name: "Timeout - 5 Seconds",
        type: 2
    },
    async execute(interaction) {
        const target = interaction.targetMember
        const user = await interaction.client.users.fetch(target.id)
        console.log(user.id)
        console.log(user.username)
        await target.timeout(5, "test")
        await interaction.reply(`Timed out: ${user.username}`)
    },
};