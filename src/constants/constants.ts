export const PREFIX = '!';

export const COMMANDS = {
	REGISTER: `${PREFIX}register`,
	UNREGISTER: `${PREFIX}unregister`,
	HELP: `${PREFIX}help`,
	PING: `${PREFIX}ping`,
	MEMES_START: `${PREFIX}startmemes`,
	MEMES_STOP: `${PREFIX}stopmemes`,
	PROCESS_HACKERS: `${PREFIX}processHackers`,
	PURGE_TEAM_CHANNELS: `${PREFIX}purgeTeams`,
};

type TChannel = {
	name?: string;
	id: string;
};
type TChannels = {
	REGISTRATION: TChannel[];
	DELETION: TChannel[];
	LOGGER: TChannel[];
	MEMES: TChannel[];
};

// Hackout
// export const CHANNELS: TChannels = {
// 	REGISTRATION: [
// 		{ name: 'register-hackathon', id: '765673553236066344' },
// 		{ name: 'admin-bots', id: '764942500627611709' },
// 	],
// 	DELETION: [{ name: 'register-hackathon', id: '765673553236066344' }],
// 	LOGGER: [
// 		{
// 			name: 'discord-register-logger',
// 			id: '768465256699265054',
// 		},
// 	],
// 	MEMES: [
// 		{
// 			name: 'memes',
// 			id: '764985789607575633',
// 		},
// 	],
// };

// RDS
export const CHANNELS: TChannels = {
	REGISTRATION: [{ name: 'rds-bots', id: '764467340078874639' }],
	DELETION: [{ name: 'rds-bots', id: '764467340078874639' }],
	LOGGER: [{ name: 'rds-register-logger', id: '768476901806833694' }],
	MEMES: [
		{
			name: 'rds-memes',
			id: '772218204826894337',
		},
	],
};

export const REGISTRATION_FORMAT = `\n**${COMMANDS.REGISTER} Full Name email@domain.com**`;

export const MESSAGE_DELETE_TIMEOUT = 2000;

export const HACKATHON_NAME = 'Hackout';

export const REPLIES = {
	DELETE_TIMEOUT: 5000,
	WRONG_EMAIL: `The email you entered is invalid, please try again with the following format:${REGISTRATION_FORMAT}`,
	REGISTER_ALREADY_EXISTS: `You're already registered on ${HACKATHON_NAME} Discord as:`,
	REGISTER_SUCCESS: `Thank you for registering on ${HACKATHON_NAME} Discord! Your details are:`,
	UNREGISTER_SUCCESS: `You have unregistered on ${HACKATHON_NAME} Discord with your details:`,
	UNREGISTER_FAIL: `You have not registered on ${HACKATHON_NAME} Discord, please register on Discord with the following format:${REGISTRATION_FORMAT}`,
};

// Hackout
export const ROLES = {
	EVERYONE: '@everyone',
	HACKER_UNDER_REVIEW: 'Hacker 2021 (Under Review)',
	HACKER_ACCEPTED: 'Hacker 2021',
	CONFERENCE: 'Conference 2021',
	ORGANISER: 'Organiser',
	ADMIN: 'Server Admin',
	MENTOR: 'Mentor',
	SPEAKER: 'Speaker',
	FINDING_TEAMS: 'Finding Teams',
};

export const DEVFOLIO_CSV = {
	NO_TEAM: 'N/A',
};

export const getTeamWelcomeMessages = (teamRole: string): string => {
	return `Hey ${teamRole}, welcome to ${HACKATHON_NAME}!`;
};
