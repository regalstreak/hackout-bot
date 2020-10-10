import { REPLIES } from './../constants/message';
import { Message } from 'discord.js';
import extractEmail from 'extract-email-address';
import { getMessage } from '../utils/message';

const register = (msg: Message): null => {
	console.count('testingregister');
	const message = getMessage(msg.content);
	try {
		const email: string = extractEmail(message)[0].email;
		const name: string = message.replace(email, '').trim();
		console.log(name);
	} catch (error) {
		// email not found
		console.log(error);
		msg.reply(REPLIES.WRONG_EMAIL);
	}

	msg.delete();

	// store in mongo
	return null;
};

export default register;
