import { sendLogToChannel } from './../utils/logActions';
import { ROLES } from './../constants/constants';
import { getRoleByName } from './../utils/roles';
import Hacker, { IHacker, IHackerDocument } from './../models/hacker';
import { REPLIES, MESSAGE_DELETE_TIMEOUT } from '../constants/constants';
import { Message } from 'discord.js';
import UnregisteredHacker from '../models/unregisteredHacker';
import { deleteMessage } from '../utils/message';

type TDeleteHacker = {
	deletedRecord?: IHackerDocument;
	deleted: boolean;
};

const deleteHackerIfExists = async (discordId: IHacker['discordId']): Promise<TDeleteHacker> => {
	try {
		const discordIdRecord = await Hacker.findOne({ discordId });

		if (discordIdRecord) {
			try {
				await UnregisteredHacker.create(discordIdRecord.toObject());
			} catch (error) {
				console.log(error);
				console.log('Unable to copy unregistered hacker');
			}
			const deletedRecord = await discordIdRecord.deleteOne();
			return { deletedRecord, deleted: true };
		} else {
			return { deleted: false };
		}
	} catch (error) {
		console.log(error);
	}
};

const formatDeletedReply = (reply: string, name: string, email: string): string => {
	return `${reply} \n**Name**: ${name}\n**Email**: ${email}`;
};

const unregister = async (msg: Message): Promise<void> => {
	try {
		console.log('UNREGISTER: ' + msg.author.id, msg.author.username);

		try {
			const deletedHacker = await deleteHackerIfExists(msg.author.id);

			if (!!deletedHacker.deleted) {
				const unregisterSuccessReply = await msg.reply(
					formatDeletedReply(
						REPLIES.UNREGISTER_SUCCESS,
						deletedHacker.deletedRecord.discordFullName,
						deletedHacker.deletedRecord.email,
					),
				);
				deleteMessage(unregisterSuccessReply);
				msg.member.roles.remove(getRoleByName(msg, ROLES.HACKER_UNDER_REVIEW));

				await sendLogToChannel(msg, deletedHacker, 'unregistered');
			} else {
				const unregisterFailedReply = await msg.reply(REPLIES.UNREGISTER_FAIL);
				deleteMessage(unregisterFailedReply);
			}
		} catch (error) {
			console.log('Something wrong in database');
		}
	} catch (error) {
		console.log(error);
		const unregisterErrorReply = await msg.reply(REPLIES.UNREGISTER_FAIL);
		deleteMessage(unregisterErrorReply);
	}

	deleteMessage(msg, MESSAGE_DELETE_TIMEOUT);
};

export default unregister;
