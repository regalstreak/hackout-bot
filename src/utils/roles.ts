import { ROLES } from './../constants/constants';
import { Role, Message } from 'discord.js';

export const getRoleByName = (msg: Message, roleName: string): Role => {
	return msg.guild.roles.cache.find((r) => r.name === roleName);
};

export const isOrganiser = (msg: Message): boolean => {
	const organiserRole = getRoleByName(msg, ROLES.ORGANISER).id;
	return msg.member.roles.cache.has(organiserRole);
};
