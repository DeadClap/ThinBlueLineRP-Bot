module.exports = {
	name: 'threadUpdate',
	async execute(oldThread, newThread) {
		// Check if the thread is in the 'help-desk' category
		if (newThread.parent && newThread.parent.name === 'help-desk') {
			// Replace 'Resolved' with the actual name of your tag
			const resolvedTagName = 'Resolved';

			// Get the ID of the 'Resolved' tag from the available tags of the parent category
			const resolvedTagId = newThread.parent.availableTags.find(tag => tag.name === resolvedTagName)?.id;

			// Get the applied tag IDs from the new and old threads
			const oldAppliedTagIds = oldThread.appliedTags.map(tag => tag);
			const newAppliedTagIds = newThread.appliedTags.map(tag => tag);

			// Check if the 'Resolved' tag was added or removed from the post
			const resolvedTagAdded = !oldAppliedTagIds.includes(resolvedTagId) && newAppliedTagIds.includes(resolvedTagId);
			const resolvedTagRemoved = oldAppliedTagIds.includes(resolvedTagId) && !newAppliedTagIds.includes(resolvedTagId);

			// If the 'Resolved' tag was added, lock the thread and send a message
			if (resolvedTagAdded) {
				try {
					await newThread.setLocked(true);
					await newThread.send('This thread has been marked as resolved. It is now locked.');
				} catch (error) {
					console.error('Error locking thread or sending message:', error);
				}
			}

			// If the 'Resolved' tag was removed, unlock the thread and send a message
			if (resolvedTagRemoved) {
				try {
					await newThread.setLocked(false);
					await newThread.send('This thread has been marked as unresolved. It is now unlocked.');
				} catch (error) {
					console.error('Error unlocking thread or sending message:', error);
				}
			}
		}
	},
};

