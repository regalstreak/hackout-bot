import { Schema, Document, model } from 'mongoose';

export interface ITeam {
	teamName: string;
	teamIndex?: number;
	discordTeamRoleId?: string;
}

export interface ITeamDocument extends ITeam, Document {}

export const getTeamSchema = ({ collection }: { collection: string }): Schema => {
	return new Schema(
		{
			teamName: {
				type: String,
				required: true,
				unique: true,
			},
			teamIndex: {
				type: Number,
				required: true,
				unique: true,
			},
			discordTeamRoleId: {
				type: String,
				required: true,
				unique: true,
			},
		},
		{
			collection,
		},
	);
};

export default model<ITeamDocument>(
	'Team',
	getTeamSchema({
		collection: 'teams',
	}),
);
