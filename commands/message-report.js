const {ActionRowBuilder, TextInputBuilder, ModalBuilder, EmbedBuilder, ContextMenuCommandBuilder} = require('@discordjs/builders');
const {TextInputStyle, ApplicationCommandType, Colors} = require('discord.js');
const commandName = 'Report Message';
module.exports = {
	name: commandName,
	data: new ContextMenuCommandBuilder()
		.setName(commandName)
		.setType(ApplicationCommandType.Message),
	async execute(interaction) {
		const {targetMessage} = interaction;
		const reportChannelID = '1171178751065866332'; // Replace with your desired report channel ID

		// Create a modal to collect the reason for reporting the message
		const modal = new ModalBuilder()
			.setCustomId('reason-modal')
			.setTitle('Report Reason');

		// Create a text input field for the reason
		const reasonInput = new TextInputBuilder()
			.setCustomId('reason-input')
			.setLabel('Reason for reporting this message?')
			.setStyle(TextInputStyle.Short);

		// Create an action row and add the reason input to it
		const actionRow = new ActionRowBuilder()
			.addComponents(reasonInput);

		// Add the action row to the modal
		modal.addComponents(actionRow);

		// Create an embed for the report message
		const report = new EmbedBuilder()
			.setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
			.setTitle('Message Report');

		// Show the modal to the user
		interaction.showModal(modal);

		// Define a filter for handling modal responses
		const filter = interaction => interaction.customId === 'reason-modal';

		try {
			// Wait for the user to respond to the modal
			const modalResponse = await interaction.awaitModalSubmit({filter, time: 15000});

			if (modalResponse && modalResponse.fields && modalResponse.fields.getField('reason-input').value) {
				const reason = modalResponse.fields.getField('reason-input').value;

				// Process the user's response from the modal
				// Send the response to a report channel or take any other action
				const reportChannel = interaction.guild.channels.cache.get(reportChannelID);
				if (reportChannel && reportChannel.isTextBased()) {
					report.addFields(
						{name: 'Channel', value: `<#${interaction.channel.id}>`, inline: true},
						{name: 'Author', value: `<@${targetMessage.author.id}>`, inline: true},
						{name: 'Content', value: `${targetMessage.content} - [Jump to](${targetMessage.url})`},
						{name: 'Reason of Report', value: reason},
					).setColor(Colors.DarkOrange);
					reportChannel.send({embeds: [report]});
				}

				// Provide feedback to the user
				await modalResponse.reply({content: 'Message reported successfully.', ephemeral: true});
			} else {
				// Handle cases where response data is missing or invalid
				await interaction.followUp({content: 'Response data is missing or invalid.', ephemeral: true});
			}
		} catch (error) {
			// Handle errors during modal submission
			console.error('Error handling modal submission:', error);
			await interaction.followUp({content: 'Modal Expired. Please press cancel and try again.', ephemeral: true});
		}
	},
};
