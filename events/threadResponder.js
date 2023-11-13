// Import the EmbedBuilder class from the '@discordjs/builders' library
const {EmbedBuilder} = require('@discordjs/builders');

// Define a constant for the emoji used to indicate a resolved thread
const resolveEmoji = '✅';

// Export a module with an object containing a 'name' property and an 'execute' asynchronous function
module.exports = {
	name: 'threadCreate',

	// The 'execute' function is called when a thread is created
	async execute(thread, fresh, client) {
		// Check if the thread is fresh and has a parent
		if (fresh && thread.parent) {
			// Check if the thread is in the 'help-desk' category
			if (thread.parent.name === 'help-desk') {
				// Retrieve available tags from the parent category
				const availableTags = thread.parent.availableTags || [];

				// Fetch the latest message in the thread
				const messages = await thread.messages.fetch({limit: 1});
				const firstMessage = messages.first();

				// Add a reaction to the first message
				firstMessage.react('✅');

				// Define tag names for 'Bug', 'Issue', and 'Resolved'
				const bugTagName = 'Bug';
				const issueTagName = 'Issue';
				const resolvedTagName = 'Resolved';

				// Retrieve tag IDs based on tag names
				const bugTagId = availableTags.find(tag => tag.name === bugTagName)?.id;
				const issueTagId = availableTags.find(tag => tag.name === issueTagName)?.id;
				const resolvedTagId = availableTags.find(tag => tag.name === resolvedTagName)?.id;

				// Retrieve applied tag IDs from the thread
				const appliedTagIds = thread.appliedTags || [];

				// Check if the 'Resolved' tag is present
				const hasResolvedTag = appliedTagIds.includes(resolvedTagId);

				// If the 'Resolved' tag is present, lock the thread
				if (hasResolvedTag) {
					// Lock the thread
					thread.setLocked(true)
						.catch(error => console.error('Error locking thread:', error));
				} else {
					// Check if either 'Bug' or 'Issue' tags are present
					const hasBugTag = appliedTagIds.includes(bugTagId);
					const hasIssueTag = appliedTagIds.includes(issueTagId);

					// If either 'Bug' or 'Issue' tags are present and 'Resolved' tag is not present, send a reply
					if ((hasBugTag || hasIssueTag) && !hasResolvedTag) {
						// Add a reaction to the first message
						firstMessage.react('❓');

						// Send a reply with an embedded message
						const threadEmbed = new EmbedBuilder()
							.setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL()})
							.addFields(
								{name: 'Also affected?', value: 'If you are affected with this issue or bug please react with :question:'},
								{name: 'Resolved?', value: `React with ${resolveEmoji}`},
							);

						// Send the reply to the thread
						thread.send({content: `${thread.guild.roles.cache.filter(r => r.name === 'Tech Troubleshooter (Technical Support)').first()}`, embeds: [threadEmbed]})
							.catch(error => console.error('Error sending reply:', error));
					}
				}
			}
		}
	},
};
