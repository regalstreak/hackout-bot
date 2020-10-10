import { NewsChannel, TextChannel } from 'discord.js';
import { PREFIX, CHANNELS } from './../constants/message';

const removePrefix = (msgContent: string): string => {
	return msgContent.replace(PREFIX, '');
};

export const getCommand = (msgContent: string): string => {
	return removePrefix(msgContent).split(' ')[0];
};

export const getMessage = (msgContent: string): string => {
	return removePrefix(msgContent).split(' ').slice(1).join(' ');
};

export const isAllowedChannel = (channel: TextChannel | NewsChannel): boolean => {
	return CHANNELS.ALLOWED.indexOf(channel.name) > -1;
};
