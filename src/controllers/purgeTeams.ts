import { Message } from 'discord.js';
import Team from '../models/team';

export const purgeTeams = async (msg: Message): Promise<void> => {
	msg.guild.channels.cache.forEach(async (value) => {
		if (
			(value.name.startsWith('team-') && value.type === 'text') ||
			(value.name.startsWith('Team') && value.name.endsWith('VC') && value.type === 'voice') ||
			(value.name.startsWith('Teams') && value.type === 'category') ||
			value.name === 'finding-teams' ||
			value.name === 'Finding Teams VC' ||
			(value.name === 'Finding Teams' && value.type === 'category')
		) {
			try {
				await value.delete();
			} catch (error) {
				// Do nothing
			}
		}
	});

	msg.guild.roles.cache.forEach(async (v) => {
		if (v.name.startsWith('Team')) {
			await v.delete();
		}
	});

	await Team.collection.drop();
};
