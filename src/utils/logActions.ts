import { ColorResolvable, Message, MessageEmbed, TextChannel, User } from 'discord.js';
import { CHANNELS } from '../constants/constants';
import Hacker from '../models/hacker';

export const getHackersCount = async (): Promise<number> => {
	return await Hacker.countDocuments({}).exec();
};

type TlogAction = 'registered' | 'unregistered';

const generateLoggerEmbed = async (
	author: User,
	action: TlogAction,
	email: string,
	name: string,
	color: ColorResolvable
): Promise<MessageEmbed> => {
	return new MessageEmbed()
		.setAuthor(author.tag, author.displayAvatarURL())
		.setDescription(`**${author} ${action} on Discord!**`)
		.setColor(color)
		.addField('Email', email, true)
		.addField('Name', name, true)
		.setFooter(`Total Count - ${await getHackersCount()}`)
		.setTimestamp(Date.now());
};

// eslint-disable-next-line
export const sendLogToChannel = async (msg: Message, hacker: any, action: TlogAction): Promise<void> => {
	if (action === 'registered') {
		CHANNELS.LOGGER.forEach(async (channel) => {
			const logInChannel = msg.guild.channels.cache.get(channel.id) as TextChannel;
			logInChannel.send(
				await generateLoggerEmbed(msg.author, action, hacker.record.email, hacker.record.discordFullName, 4437377),
			);
		});
	} else {
		let name = 'undefined';
		let email = 'undefined';
		if (hacker.deletedRecord) {
			name = hacker.deletedRecord.discordFullName;
			email = hacker.deletedRecord.email;
		}
		CHANNELS.LOGGER.forEach(async (channel) => {
			const logInChannel = msg.guild.channels.cache.get(channel.id) as TextChannel;
			logInChannel.send(await generateLoggerEmbed(msg.author, action, email, name, 16736630));
		});
	}
};
