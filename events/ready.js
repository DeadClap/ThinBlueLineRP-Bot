const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const {CLIENT_ID, DISCORD_TOKEN, GUILD_ID} = process.env // Relative path to your config file
const fs = require('fs');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        const commands = [];
        // const gcommands = [];
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            if (typeof command.data == "object"){
                commands.push(command.data);
            } else {
                commands.push(command.data.toJSON());
            }
        }

        const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

        (async () => {
            try {
                console.log('Started applying slash commands to Discord.');
                // await rest.put(Routes.applicationCommands(CLIENT_ID), {
                //     body: gcommands,
                // })
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
                    body: commands,
                });

                console.log('Successfully applied slash commands to Discord.');
            } catch (error) {
                console.error(error);
            }
        })();

        console.log(`Logged in as ${client.user.tag}`)
    }
}
