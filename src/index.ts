import register from './controllers/register';
import { getCommand, isAllowedChannel, isDeletionChannel } from './utils/message';
import 'dotenv/config.js';
import { Client as DiscordClient, Message, TextChannel, NewsChannel } from 'discord.js';
import { COMMANDS } from './constants/message';
import { connect as mongooseConnect, connection as mongooseConnection } from 'mongoose';
import unregister from './controllers/unregister';

const discordClient = new DiscordClient();

mongooseConnect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongooseConnection.once('open', () => {
	console.log('Connected to MongoDB successfully');
});
mongooseConnection.on('error', () => {
	console.log('error connecting to database');
});

discordClient.on('ready', () => {
	console.log(`Logged in as ${discordClient.user.tag}`);
});

discordClient.on('message', (msg: Message) => {
	if (msg.author.bot) return;

	if (isAllowedChannel(msg.channel as TextChannel | NewsChannel)) {
		const messageContent: string = msg.content;
		const command: string = getCommand(messageContent);

		switch (command) {
			case COMMANDS.REGISTER: {
				register(msg);
				break;
			}
			case COMMANDS.UNREGISTER: {
				unregister(msg);
				break;
			}
			case COMMANDS.HELP: {
				break;
			}
			default: {
				if (isDeletionChannel(msg.channel as TextChannel | NewsChannel)) {
					msg.delete();
				}
				break;
			}
		}
	}
});

discordClient.login(process.env.DISCORD_BOT_TOKEN);
