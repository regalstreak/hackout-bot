import { NewsChannel, TextChannel, Message, User } from 'discord.js';
import { PREFIX, CHANNELS } from '../constants/constants';

export const removePrefix = (msgContent: string): string => {
	return msgContent.replace(PREFIX, '');
};

export const getCommand = (msgContent: string): string => {
	return msgContent.split(' ')[0].trim();
};

export const getMessage = (msgContent: string): string => {
	return msgContent.split(' ').slice(1).join(' ').trim();
};

export const isAllowedChannel = (channel: TextChannel | NewsChannel): boolean => {
	return CHANNELS.ALLOWED.filter((c) => c.id === channel.id).length > 0;
};

export const isDeletionChannel = (channel: TextChannel | NewsChannel): boolean => {
	return CHANNELS.DELETION.filter((c) => c.id === channel.id).length > 0;
};

export const isMessageByHackoutBot = (msg: Message, bot: User): boolean => {
	return msg.author.id === bot.id;
};
