import { Message, Role, Guild, CategoryChannel, OverwriteResolvable, GuildMember, TextChannel } from 'discord.js';
import * as request from 'request';
import { getRoleByName, getRoleById } from './../utils/roles';
import { IHackerDocument } from './../models/hacker';
import { ITeam, ITeamDocument } from '../models/team';
import { ROLES, DEVFOLIO_CSV, getTeamWelcomeMessages } from './../constants/constants';
import * as csvToJson from 'csvtojson';
import Hacker from '../models/hacker';
import Team from '../models/team';

interface IHackerCsvRecord {
	'Team Name': string;
	Email: string;
	College: string;
	Gender: string;
	'T-shirt size': string;
	'Last Name': string;
	'First Name': string;
	Stage: string;
}

interface IHackerCsvRecordExtended extends IHackerCsvRecord {
	discordId?: string;
}

export type TCreateTeam = {
	teamRecord: ITeamDocument;
	discordRole: Role;
};

const getTeamRoleName = (teamIndex: number, teamName: string): string => {
	return `Team ${teamIndex} - ${teamName}`;
};
const getTeamChannelName = (teamIndex: number, teamName: string, type: 'voice' | 'text' = 'text'): string => {
	if (type === 'voice') {
		return `Team ${teamIndex} ${teamName} VC`;
	}
	return `team-${teamIndex}-${teamName}`.toLowerCase().replace(' ', '-');
};

const getBaseTeamChannelPermissionOverrides = (guild: Guild): OverwriteResolvable[] => {
	return [
		{
			id: getRoleByName(guild, ROLES.EVERYONE).id,
			deny: ['VIEW_CHANNEL'],
		},
		{
			id: getRoleByName(guild, ROLES.ADMIN).id,
			allow: ['VIEW_CHANNEL'],
		},
		{
			id: getRoleByName(guild, ROLES.ORGANISER).id,
			allow: ['VIEW_CHANNEL'],
		},
		{
			id: getRoleByName(guild, ROLES.MENTOR).id,
			allow: ['VIEW_CHANNEL'],
		},
	];
};

const createTeam = async (teamName: ITeam['teamName'], guild: Guild): Promise<TCreateTeam> => {
	try {
		const teamNameRecord = await Team.findOne({ teamName });

		if (teamNameRecord) {
			const teamDiscordRole = getRoleById(guild, teamNameRecord.discordTeamRoleId);
			if (teamDiscordRole) {
				return { teamRecord: teamNameRecord, discordRole: teamDiscordRole };
			}

			const teamIndex = await Team.countDocuments({}).exec();
			return {
				teamRecord: teamNameRecord,
				discordRole: await guild.roles.create({ data: { name: getTeamRoleName(teamIndex, teamName) } }),
			};
		}

		let teamDiscordRole: Role;

		const newTeam: ITeam = {
			teamName: teamName,
			teamIndex: await Team.countDocuments({}).exec(),
			discordTeamRoleId: '',
		};

		const existingTeamRole = guild.roles.cache.filter((role) => {
			return role.name.includes(teamName);
		});

		if (existingTeamRole.size > 0) {
			teamDiscordRole = existingTeamRole.first();
		} else {
			teamDiscordRole = await guild.roles.create({
				data: { name: getTeamRoleName(newTeam.teamIndex, teamName) },
			});
		}
		newTeam.discordTeamRoleId = teamDiscordRole.id;
		const newTeamMongoRecord = await Team.create(newTeam);

		return { teamRecord: newTeamMongoRecord, discordRole: teamDiscordRole };
	} catch (error) {
		console.log('createTeamerror', error);
	}
};

const getFindingTeamsRole = async (guild: Guild): Promise<Role> => {
	const findingTeamsRole = guild.roles.cache.filter((role) => {
		return role.name.includes(ROLES.FINDING_TEAMS);
	});

	if (findingTeamsRole.size > 0) {
		return findingTeamsRole.first();
	}

	return await guild.roles.create({
		data: { name: ROLES.FINDING_TEAMS },
	});
};

const createTeamsChannel = async (guild: Guild, team: TCreateTeam): Promise<void> => {
	try {
		const teamGroupNumber = Math.floor(team.teamRecord.teamIndex / 25);
		const teamCategoryName = `Teams ${teamGroupNumber === 0 ? 1 : teamGroupNumber * 25}-${
			(teamGroupNumber + 1) * 25
		}`;
		const teamCategoryCollection = guild.channels.cache.filter((c) => c.name === teamCategoryName);
		const teamChannelPermissionOverrides: OverwriteResolvable[] = [
			...getBaseTeamChannelPermissionOverrides(guild),
			{
				id: team.discordRole.id,
				allow: 'VIEW_CHANNEL',
			},
		];

		let teamCategory: CategoryChannel = teamCategoryCollection?.first() as CategoryChannel;

		if (!teamCategory) {
			teamCategory = await guild.channels.create(teamCategoryName, { type: 'category' });
			teamCategory.overwritePermissions(getBaseTeamChannelPermissionOverrides(guild));
		}

		const teamTextChannelName = getTeamChannelName(team.teamRecord.teamIndex, team.teamRecord.teamName);
		const teamVoiceChannelName = getTeamChannelName(team.teamRecord.teamIndex, team.teamRecord.teamName, 'voice');
		let teamTextChannel = guild.channels.cache
			.filter((c) => c.name.includes(teamTextChannelName) && c.type === 'text')
			?.first();

		if (!teamTextChannel) {
			teamTextChannel = await guild.channels.create(teamTextChannelName, {
				type: 'text',
				parent: teamCategory,
			});
			teamTextChannel.overwritePermissions(teamChannelPermissionOverrides);
			(teamTextChannel as TextChannel).send(getTeamWelcomeMessages(`<@&${team.discordRole.id}>`));
		}
		let teamVoiceChannel = guild.channels.cache
			.filter((c) => c.name.includes(teamVoiceChannelName) && c.type === 'voice')
			?.first();
		if (!teamVoiceChannel) {
			teamVoiceChannel = await guild.channels.create(teamVoiceChannelName, {
				type: 'voice',
				parent: teamCategory,
			});
			teamVoiceChannel.overwritePermissions(teamChannelPermissionOverrides);
		}
	} catch (error) {
		console.log('createteamschannel', error);
	}
};

const createFindingTeamsChannel = async (guild: Guild): Promise<void> => {
	try {
		let findingTeamsCategory: CategoryChannel = guild.channels.cache
			.filter((c) => c.name === ROLES.FINDING_TEAMS && c.type === 'category')
			?.first() as CategoryChannel;

		const findingTeamsPerms: OverwriteResolvable[] = [
			{
				id: getRoleByName(guild, ROLES.FINDING_TEAMS).id,
				allow: ['VIEW_CHANNEL'],
			},
			...getBaseTeamChannelPermissionOverrides(guild),
		];

		if (!findingTeamsCategory) {
			findingTeamsCategory = await guild.channels.create(ROLES.FINDING_TEAMS, { type: 'category' });
			findingTeamsCategory.overwritePermissions(findingTeamsPerms);
		}

		if (findingTeamsCategory?.children?.size < 1) {
			findingTeamsCategory.children?.forEach(async (value) => await value.delete());

			const findingTeamsTC = await guild.channels.create(ROLES.FINDING_TEAMS, {
				type: 'text',
				parent: findingTeamsCategory,
			});
			findingTeamsTC.overwritePermissions(findingTeamsPerms);

			const findingTeamsVC = await guild.channels.create(ROLES.FINDING_TEAMS + ' VC', {
				type: 'voice',
				parent: findingTeamsCategory,
			});
			findingTeamsVC.overwritePermissions(findingTeamsPerms);
		}
	} catch (error) {
		console.log('createFindingTeamsChannel', error);
	}
};

type ThackerTeam = {
	teamName: string;
	members: IHackerCsvRecordExtended[];
};

interface IHackersTeamsIndividuals {
	individuals: IHackerCsvRecordExtended[];
	teams: ThackerTeam[];
}
interface IHackersJson {
	registered: IHackersTeamsIndividuals;
	notRegistered: IHackerCsvRecord[];
}

const getHackersFromCsv = async (
	hackersCsv: IHackerCsvRecord[],
	guild: Guild,
	devMode = false,
): Promise<IHackersJson> => {
	const hackersJson: IHackersJson = {
		registered: { teams: [], individuals: [] },
		notRegistered: [],
	};

	for (let i = 0; i <= hackersCsv.length; i++) {
		try {
			const hackerCsv: IHackerCsvRecordExtended = hackersCsv[i];
			let hackerEmailRecord: IHackerDocument;
			let hackerDiscord: GuildMember;

			if (!devMode) {
				hackerEmailRecord = await Hacker.findOne({ email: hackerCsv.Email });
				if (!hackerEmailRecord) {
					hackersJson.notRegistered.push(hackerCsv);
					continue;
				}
				if (hackerEmailRecord.processed) {
					continue;
				}
				await hackerEmailRecord.updateOne({ devfolioTeamName: hackerCsv['Team Name'], accepted: true }).exec();
				hackerCsv.discordId = hackerEmailRecord.discordId;
				hackerDiscord = guild.members.cache.get(hackerCsv.discordId);
				hackerDiscord.roles.remove(getRoleByName(guild, ROLES.HACKER_UNDER_REVIEW));
				hackerDiscord.roles.add(getRoleByName(guild, ROLES.HACKER_ACCEPTED));
			}

			if (hackerCsv['Team Name'] === DEVFOLIO_CSV.NO_TEAM) {
				await createFindingTeamsChannel(guild);
				if (!devMode) {
					hackerDiscord.roles.add(await getFindingTeamsRole(guild));
				}
				hackersJson.registered.individuals.push(hackerCsv);
			} else {
				const team = await createTeam(hackerCsv['Team Name'], guild);

				const teamIndex = hackersJson.registered?.teams?.findIndex(
					(t) => t.teamName === hackerCsv['Team Name'],
				);
				if (teamIndex >= 0) {
					hackersJson.registered.teams[teamIndex].members.push(hackerCsv);
				} else {
					await createTeamsChannel(guild, team);
					hackersJson.registered.teams.push({
						teamName: hackerCsv['Team Name'],
						members: [hackerCsv],
					});
				}
				if (!devMode) {
					hackerDiscord.roles.remove(await getFindingTeamsRole(guild));
					await hackerDiscord.roles.add(team.discordRole);
				}
			}

			if (!devMode) {
				await hackerEmailRecord.updateOne({ processed: true }).exec();
			}
		} catch (error) {}
	}
	return hackersJson;
};

export const processHackers = async (msg: Message): Promise<void> => {
	const hackersCsv: IHackerCsvRecord[] = [];

	csvToJson()
		.fromStream(request.get(msg.attachments.first().url))
		.subscribe(
			(data) => {
				hackersCsv.push(data);
			},
			(error) => console.log(error),
			async () => {
				try {
					const hackers = await getHackersFromCsv(hackersCsv, msg.guild);
					let totalTeamMembers = 0;
					hackers.registered.teams.forEach((t) => {
						totalTeamMembers = totalTeamMembers + t.members.length + 1;
					});
					msg.reply(
						`Processed ${hackers.registered.individuals.length + 1} individuals\nProcessed ${
							hackers.registered.teams.length + 1
						} teams with ${totalTeamMembers} members`,
					);
					if (hackers.notRegistered.length > 0) {
						const notRegisteredHackers = hackers.notRegistered.map((hnr) => {
							return `${hnr['First Name']} ${hnr['Last Name']} from ${hnr.College}`;
						});
						msg.reply(`Not registered hackers list\n\n${notRegisteredHackers}`);
					}
				} catch (error) {
					console.log(error);
				}
			},
		);
};
