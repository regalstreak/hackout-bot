import { Role, Message, Guild } from 'discord.js';

export const getRoleByName = (guild: Guild, roleName: string): Role => {
	return guild.roles.cache.find((r) => r.name === roleName);
};

export const isMessageAuthorRoleByName = (roleName: string, msg: Message): boolean => {
	const role = getRoleByName(msg.guild, roleName).id;
	return msg.member.roles.cache.has(role);
};

export const getRoleById = (guild: Guild, roleId: string): Role => {
	return guild.roles.cache.get(roleId);
};
