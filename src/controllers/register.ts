import { getRoleByName } from './../utils/roles';
import Hacker, { IHacker, IHackerDocument } from './../models/hacker';
import { REPLIES, ROLES } from '../constants/constants';
import { Message } from 'discord.js';
import extractEmail from 'extract-email-address';
import { getMessage } from '../utils/message';

type TCreateHacker = {
	record: IHackerDocument;
	alreadyExists: boolean;
};

const createHackerIfNotExists = async (hacker: IHacker): Promise<TCreateHacker> => {
	try {
		const discordIdRecord = await Hacker.findOne({ discordId: hacker.discordId });
		const discordEmailRecord = await Hacker.findOne({ email: hacker.email });
		const record = discordIdRecord || discordEmailRecord;

		if (record) {
			return { record: record, alreadyExists: true };
		} else {
			return { record: await Hacker.create(hacker), alreadyExists: false };
		}
	} catch (error) {
		console.log(error);
	}
};

const formatCreatedReply = (reply: string, name: string, email: string): string => {
	return `${reply} \n**Name**: ${name}\n**Email**: ${email}`;
};

const register = async (msg: Message): Promise<void> => {
	const message = getMessage(msg.content);
	try {
		const email: string = extractEmail(message)[0].email;
		const name: string = message.replace(email, '').trim();
		console.log('REGISTER: ' + msg.author.id, msg.author.username);

		try {
			const createdHacker = await createHackerIfNotExists({
				email,
				discordFullName: name,
				discordId: msg.author.id,
				discordUserName: msg.author.username,
			});

			if (!!createdHacker.alreadyExists) {
				const alreadyRegisteredReply = await msg.reply(
					formatCreatedReply(
						REPLIES.REGISTER_ALREADY_EXISTS,
						createdHacker.record.discordFullName,
						createdHacker.record.email,
					),
				);
				alreadyRegisteredReply.delete({ timeout: REPLIES.DELETE_TIMEOUT });
			} else {
				const registerSuccessReply = await msg.reply(
					formatCreatedReply(
						REPLIES.REGISTER_SUCCESS,
						createdHacker.record.discordFullName,
						createdHacker.record.email,
					),
				);
				registerSuccessReply.delete({ timeout: REPLIES.DELETE_TIMEOUT });
				msg.member.setNickname(name);

				msg.member.roles.add(getRoleByName(msg, ROLES.HACKER_UNDER_REVIEW));
			}
		} catch (error) {
			console.log('Something wrong in database');
		}
	} catch (error) {
		console.log(error);
		const wrongEmailReply = await msg.reply(REPLIES.WRONG_EMAIL);
		wrongEmailReply.delete({ timeout: REPLIES.DELETE_TIMEOUT });
	}

	msg.delete();
};

export default register;
