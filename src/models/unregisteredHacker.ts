import { model } from 'mongoose';
import { IHackerDocument, getHackerSchema } from './hacker';

export default model<IHackerDocument>(
	'UnregisteredHacker',
	getHackerSchema({
		collection: 'unregisteredHackers',
	}),
);
