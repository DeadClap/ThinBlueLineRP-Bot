module.exports = {
	name: 'threadCreate',
	async execute(thread, fresh) {
		// Check if the thread is fresh and has a parent
		if (fresh && thread.parent) {
			// Check if the thread is in the 'help-desk' category
			if (thread.parent.name === 'help-desk') {
				// Retrieve available tags from the parent category
				const availableTags = thread.parent.availableTags || [];

				// Replace 'Bug' and 'Issue' with the actual names of your tags
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
						// Send a reply
						thread.send({content: 'If you are affected with this issue or bug please react with :question:'})
							.catch(error => console.error('Error sending reply:', error));
					}
				}
			}
		}
	},
};

