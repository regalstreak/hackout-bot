import register from './controllers/register';
import { getCommand, isAllowedChannel } from './utils/message';
import 'dotenv/config.js';
import { Client, Message, TextChannel, NewsChannel } from 'discord.js';
import { PREFIX, COMMANDS } from './constants/message';

const client = new Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg: Message) => {
	const messageContent: string = msg.content;

	if (messageContent.startsWith(PREFIX) && isAllowedChannel(msg.channel as TextChannel | NewsChannel)) {
		const command: string = getCommand(messageContent);

		switch (command) {
			case COMMANDS.REGISTER: {
				register(msg);
				break;
			}
			default:
				break;
		}
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
