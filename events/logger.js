module.exports = {
	name: 'log',
	async execute(level, type, message) {
		if (level === 'error') {
			console.error(`[${level.toUpperCase()}] ${message}`);
		} else if (level === 'debug') {
			if (process.env.environment !== 'PROD') {
				console.log(`[${level.toUpperCase()}] ${message}`);
			}
		} else {
			console.log(`[${level.toUpperCase()}] ${message}`);
		}
	},
};
