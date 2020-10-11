import { Role, Message } from 'discord.js';

export const getRoleByName = (msg: Message, roleName: string): Role => {
	return msg.guild.roles.cache.find((r) => r.name === roleName);
};
