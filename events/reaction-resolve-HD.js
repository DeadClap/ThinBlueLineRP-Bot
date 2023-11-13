const {ActionRowBuilder, ButtonBuilder, EmbedBuilder} = require('@discordjs/builders');
const {PermissionsBitField, ButtonStyle, Colors} = require('discord.js');

module.exports = {
	name: 'messageReactionAdd',
	async execute(reaction, user) {
		if (user.bot) {
			return;
		}

		if (isHelpDeskThread(reaction.message)) {
			console.log('We are in the HD');

			if (reaction.emoji.name === '✅') {
				console.log('Resolve check received.');
				if (canManageThread(user, reaction.message)) {
					console.log('User can resolve.');
					updateThreadLockStatus(reaction.message, user);
					await reaction.users.remove(user);
				} else {
					sendEphemeralMessage(user, 'You do not have permission to update resolve status on this thread.', getThreadLink(reaction.message));
					await reaction.users.remove(user);
				}
			}
		}
	},
};

function isHelpDeskThread(message) {
	let value = false;
	if (message.channel) {
		if (message.channel.parent.name === 'help-desk') {
			value = true;
		}
	}

	return value;
}

function canManageThread(user, message) {
	const isOp = user.id === message.channel.ownerId;

	// Check permissions in the specific channel
	const channelPermissions = message.channel.parent.permissionsFor(user);
	const hasManageThreadsPermission = channelPermissions.has(PermissionsBitField.Flags.ManageThreads);

	return isOp || hasManageThreadsPermission;
}

async function updateThreadLockStatus(message, user) {
	const newLockStatus = !message.channel.locked;

	const lockEmbed = new EmbedBuilder()
		.setAuthor({name: user.username, iconURL: user.displayAvatarURL()})
		.setColor(newLockStatus ? Colors.DarkRed : Colors.DarkGreen)
		.setDescription(`This thread has been marked as ${newLockStatus ? 'resolved' : 'unresolved'}. It is now ${newLockStatus ? 'locked' : 'unlocked'}.`);

	await message.channel.send({embeds: [lockEmbed]});

	await message.channel.setLocked(newLockStatus);
}

async function sendEphemeralMessage(user, content, link) {
	try {
		const messageOptions = {
			content,
			ephemeral: true,
		};

		if (link) {
			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setLabel('Go to Thread')
					.setStyle(ButtonStyle.Link)
					.setURL(link),
			);

			messageOptions.components = [row];
		}

		await user.send(messageOptions);
	} catch (error) {
		console.error('Error sending ephemeral message:', error);
	}
}

function getThreadLink(message) {
	// Assuming your Discord.js version supports these properties
	const guildId = message.guild.id;
	const channelId = message.channel.id;
	const messageId = message.id;

	return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}

