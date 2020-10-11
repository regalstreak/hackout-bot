export const PREFIX = '';

export const COMMANDS = {
	REGISTER: 'r',
};

export const CHANNELS = {
	ALLOWED: ['bots'],
};

export const REPLIES = {
	TIMEOUT: 5000,
	WRONG_EMAIL: `The email you entered is invalid, please try again with the following format:\n**${PREFIX}${COMMANDS.REGISTER} Full Name email@domain.com**`,
	ALREADY_EXISTS: "You're already registered on Hackout Discord as:",
	REGISTER_SUCCESS: 'Thank you for registering on Hackout Discord! Your details are:',
};
