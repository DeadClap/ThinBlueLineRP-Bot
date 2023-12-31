module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (!interaction.isCommand()) {
			return;
		}

		const {commandName} = interaction;
		const command = client.commands.get(commandName);

		if (!command) {
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			client.emit('log', 'error', 'bleh', error);
			await interaction.reply({content: 'There was an error while executing this command.', ephemeral: true});
		}
	},
};
