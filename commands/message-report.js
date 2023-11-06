const {ActionRowBuilder, TextInputBuilder, ModalBuilder, EmbedBuilder} = require('@discordjs/builders');
const {TextInputStyle} = require('discord.js');

module.exports = {
	name: 'Report Message',
	data: {
		name: 'Report Message',
		type: 3,
	},
	async execute(interaction) {
		const {targetMessage} = interaction;
		const reportChannelID = '1171178751065866332';

		const modal = new ModalBuilder()
			.setCustomId('reason-modal')
			.setTitle('Report Reason');

		const reasonInput = new TextInputBuilder()
			.setCustomId('reason-input')
			.setLabel('Reason for reporting this message?')
			.setStyle(TextInputStyle.Short);

		const actionRow = new ActionRowBuilder()
			.addComponents(reasonInput);

		modal.addComponents(actionRow);

		const report = new EmbedBuilder()
			.setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
			.setTitle('Message Report');

		// Show the modal
		interaction.showModal(modal);

		const filter = interaction => interaction.customId === 'reason-modal';

		try {
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
					);
					reportChannel.send({embeds: [report]});
				}

				await modalResponse.reply({content: 'Message reported successfully.', ephemeral: true});
			} else {
				await interaction.followUp({content: 'Response data is missing or invalid.', ephemeral: true});
			}
		} catch (error) {
			console.error('Error handling modal submission:', error);
		}
	},
};
