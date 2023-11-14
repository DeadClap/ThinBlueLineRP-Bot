const {SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');
const {Colors} = require('discord.js');
const vm = require('vm');

const commandName = 'eval';

module.exports = {
	name: commandName,
	data: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription('Evaluate JavaScript code')
		.addStringOption(option =>
			option.setName('code')
				.setDescription('The code to evaluate')
				.setRequired(true),
		)
		.addBooleanOption(option =>
			option.setName('async')
				.setDescription('Whether the code is asynchronous')
				.setRequired(false),
		),
	async execute(interaction) {
		// Fetch the bot's application information
		const application = await interaction.client.application.fetch();
		const team = application.owner.members;

		// Check if the user invoking the command is the application owner or a team member
		const isOwnerOrTeamMember = interaction.user.id === application.owner.id
            || team?.some(member => member.user.id === interaction.user.id);

		if (!isOwnerOrTeamMember) {
			return interaction.reply({content: 'You do not have permission to use this command.', ephemeral: true});
		}

		// Get the code and async option from the interaction options
		const code = interaction.options.getString('code');
		const isAsync = interaction.options.getBoolean('async') || false;

		try {
			// Wrap the provided code in an async function if the user specifies 'async'
			const asyncFunctionCode = isAsync ? `(async () => { ${code} })();` : code;

			// Use the vm module to execute the provided code in a sandbox
			const {client} = interaction;
			const context = {
				interaction,
				console,
				require,
				client, // You can include other variables if needed
			};
			const result = isAsync ? await vm.runInNewContext(asyncFunctionCode, context) : vm.runInNewContext(asyncFunctionCode, context);

			// Create an embed for the result
			const resultEmbed = new EmbedBuilder()
				.setTitle('Eval Result')
				.setDescription(`\`\`\`${result}\`\`\``)
				.addFields(
					{name: 'Input', value: `\`\`\`${code}\`\`\``, inline: false},
				)
				.setColor(Colors.Green);

			// Respond with the result embed
			await interaction.reply({embeds: [resultEmbed], ephemeral: true});
		} catch (error) {
			// Create an embed for the error
			const errorEmbed = new EmbedBuilder()
				.setTitle('Eval Error')
				.setDescription(`\`\`\`${error}\`\`\``)
				.addFields(
					{name: 'Input', value: `\`\`\`${code}\`\`\``, inline: false},
				)
				.setColor(Colors.Red);

			// Respond with the error embed
			await interaction.reply({embeds: [errorEmbed], ephemeral: true});
		}
	},
};
