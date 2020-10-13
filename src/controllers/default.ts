import { deleteMessage, isMessageByHackoutBot } from './../utils/message';
import { REPLIES, MESSAGE_DELETE_TIMEOUT } from './../constants/constants';
import { Message, TextChannel, NewsChannel, User } from 'discord.js';
import { isDeletionChannel } from '../utils/message';

const defaultController = async (msg: Message, bot: User): Promise<void> => {
	try {
		const isMessageMentionBot = msg.mentions.has(bot);
		if (isMessageMentionBot) {
			const reply = await msg.reply(REPLIES.WRONG_EMAIL);
			deleteMessage(reply);
			deleteMessage(msg, MESSAGE_DELETE_TIMEOUT);
		} else if (
			isDeletionChannel(msg.channel as TextChannel | NewsChannel) &&
			!isMessageByHackoutBot(msg, bot) &&
			!isMessageMentionBot
		) {
			msg.delete();
		}
	} catch (error) {
		console.log(error);
	}
};

export default defaultController;
