import { Schema, Document, model } from 'mongoose';

export interface IHacker {
	email: string;
	discordId: string;
	discordUserName: string;
	discordFullName: string;

	accepted?: boolean;
	processed?: boolean;

	devfolioFirstName?: string;
	devfolioLastName?: string;
	devfolioTShirtSize?: string;
	devfolioGender?: string;
	devfolioCollege?: string;
	devfolioTeamName?: string;
}

export interface IHackerDocument extends IHacker, Document {}

export const getHackerSchema = ({ collection }: { collection: string }): Schema => {
	return new Schema(
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

			accepted: {
				type: Boolean,
				default: false,
			},

			processed: {
				type: Boolean,
				default: false
			},

			devfolioFirstName: String,
			devfolioLastName: String,
			devfolioTShirtSize: String,
			devfolioGender: String,
			devfolioCollege: String,
			devfolioTeamName: String,
		},
		{
			collection,
		},
	);
};

export default model<IHackerDocument>(
	'Hacker',
	getHackerSchema({
		collection: 'hackers',
	}),
);
