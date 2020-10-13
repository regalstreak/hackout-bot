import { MESSAGE_DELETE_TIMEOUT } from './../constants/constants';
import { Message } from 'discord.js';
import { deleteMessage } from '../utils/message';

const ping = async (msg: Message): Promise<void> => {
	try {
		const pingReply = await msg.reply('Alive');
		deleteMessage(pingReply);
		deleteMessage(msg, MESSAGE_DELETE_TIMEOUT);
	} catch (error) {
		console.log(error);
	}
};

export default ping;
