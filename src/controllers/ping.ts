import { REPLIES } from './../constants/constants';
import { Message } from 'discord.js';

const ping = async (msg: Message): Promise<void> => {
	try {
		const pingReply = await msg.reply('Alive');
		pingReply.delete({ timeout: REPLIES.DELETE_TIMEOUT });
	} catch (error) {
		console.log(error);
	}
};

export default ping;
