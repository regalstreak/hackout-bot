import { processHackers } from './controllers/processHackers';
import { purgeTeams } from './controllers/purgeTeams';
import { isMessageAuthorRoleByName } from './utils/roles';
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
import { COMMANDS, ROLES } from './constants/constants';
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
	console.log(`\n\n-----------------------------`);
	console.log(`Logged in as ${discordClient.user.tag}`);
	console.log(`-----------------------------\n\n`);
});

discordClient.on('message', (msg: Message) => {
	const isItself = isMessageByHackoutBot(msg, discordClient.user);

	if (isItself) {
		return;
	}

	if (isMemeChannel(msg.channel as TextChannel | NewsChannel) && isMessageAuthorRoleByName(ROLES.ORGANISER, msg)) {
		const command: string = getCommand(msg.content);
		switch (command) {
			case COMMANDS.MEMES_START:
				startListeningForMemes(msg);
				break;
			case COMMANDS.MEMES_STOP:
				stopListeningForMemes(msg);
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
			case COMMANDS.PROCESS_HACKERS: {
				if (isMessageAuthorRoleByName(ROLES.ADMIN, msg)) {
					processHackers(msg);
				}
				break;
			}
			case COMMANDS.PURGE_TEAM_CHANNELS: {
				if (isMessageAuthorRoleByName(ROLES.ADMIN, msg)) {
					purgeTeams(msg);
				}
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
