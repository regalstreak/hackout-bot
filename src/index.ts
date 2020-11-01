import { isOrganiser } from './utils/roles';
import { startListeningForMemes, stopListeningForMemes } from './controllers/memes';
import register from './controllers/register';
import {
	getCommand,
	isRegistrationChannel,
	isDeletionChannel,
	isMessageByHackoutBot,
	isMemeChannel,
} from './utils/message';
import 'dotenv/config.js';
import { Client as DiscordClient, Message, TextChannel, NewsChannel } from 'discord.js';
import { COMMANDS } from './constants/constants';
import { connect as mongooseConnect, connection as mongooseConnection } from 'mongoose';
import unregister from './controllers/unregister';
import ping from './controllers/ping';
import defaultController from './controllers/default';

const discordClient = new DiscordClient();

mongooseConnect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongooseConnection.once('open', () => {
	console.log('Connected to MongoDB successfully');
});
mongooseConnection.on('error', () => {
	console.log('Error connecting to database');
});

discordClient.on('ready', () => {
	console.log(`Logged in as ${discordClient.user.tag}`);
});

discordClient.on('message', (msg: Message) => {
	const isItself = isMessageByHackoutBot(msg, discordClient.user);

	if (isItself) {
		return;
	}

	if (isMemeChannel(msg.channel as TextChannel | NewsChannel) && isOrganiser(msg)) {
		const command: string = getCommand(msg.content);
		switch (command) {
			case COMMANDS.MEMES_START:
				startListeningForMemes(msg);
				break;
			case COMMANDS.MEMES_STOP:
				stopListeningForMemes();
				break;
			default:
				break;
		}
		return;
	}

	if (isRegistrationChannel(msg.channel as TextChannel | NewsChannel)) {
		if (!isItself && msg.author.bot && isDeletionChannel(msg.channel as TextChannel | NewsChannel)) {
			msg.delete();
			return;
		}

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
			case COMMANDS.PING: {
				ping(msg);
				break;
			}
			default: {
				defaultController(msg, discordClient.user);
				break;
			}
		}
	}
});

discordClient.login(process.env.DISCORD_BOT_TOKEN);
