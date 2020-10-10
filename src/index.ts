import 'dotenv/config.js';
import { Client } from 'discord.js';

const client = new Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
	if (msg.content === 'ping') {
		msg.reply('pong');
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
