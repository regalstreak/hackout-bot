export const PREFIX = '!';

export const COMMANDS = {
	REGISTER: `${PREFIX}register`,
	UNREGISTER: `${PREFIX}unregister`,
	HELP: `${PREFIX}help`,
};

export const CHANNELS = {
	ALLOWED: ['bots'],
	DELETION: ['bots'],
};

export const REGISTRATION_FORMAT = `\n**${COMMANDS.REGISTER} Full Name email@domain.com**`;

export const MESSAGE_DELETE_TIMEOUT = 2000;

export const REPLIES = {
	DELETE_TIMEOUT: 5000,
	WRONG_EMAIL: `The email you entered is invalid, please try again with the following format:${REGISTRATION_FORMAT}`,
	REGISTER_ALREADY_EXISTS: "You're already registered on Hackout Discord as:",
	REGISTER_SUCCESS: 'Thank you for registering on Hackout Discord! Your details are:',
	UNREGISTER_SUCCESS: 'You have unregistered on Hackout Discord with your details:',
	UNREGISTER_FAIL: `You have not registered on Hackout Discord, please register on Discord with the following format:${REGISTRATION_FORMAT}`,
};
