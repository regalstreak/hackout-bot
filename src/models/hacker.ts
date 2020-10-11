import { Schema, Document, model } from 'mongoose';

export interface IHacker {
	email: string;
	discordId: string;
	discordUserName: string;
	discordFullName: string;

	discordRole?: string;
	accepted?: boolean;

	devfolioFirstName?: string;
	devfolioLastName?: string;
	devfolioTShirtSize?: string;
	devfolioGender?: string;
	devfolioCollege?: string;
	devfolioTeamName?: string;
}

export interface IHackerDocument extends IHacker, Document {}

const HackerSchema: Schema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		discordId: {
			type: String,
			required: true,
			unique: true,
		},
		discordUserName: {
			type: String,
			required: true,
		},
		discordFullName: {
			type: String,
			required: true,
		},
		discordRole: String,

		accepted: Boolean,
		devfolioFirstName: String,
		devfolioLastName: String,
		devfolioTShirtSize: String,
		devfolioGender: String,
		devfolioCollege: String,
		devfolioTeamName: String,
	},
	{
		collection: 'hackers',
	},
);

export default model<IHackerDocument>('Hacker', HackerSchema);
