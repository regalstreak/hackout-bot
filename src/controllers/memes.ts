import { REPLIES } from './../constants/constants';
import { Message, Collection, MessageEmbed, MessageReaction, MessageCollector } from 'discord.js';
import { deleteMessage } from '../utils/message';

let collector: MessageCollector = null;

const getUpvoteReaction = (message: Message): MessageReaction => {
	return message.reactions.cache.filter((r) => r.emoji.name === '🔺').first();
};

const generateMemeLeaderboardEmbed = (
	leadersMemes: Message[],
	totalParticipation: number,
	firstMessageUrl: string,
	memesStartDate: Date,
): MessageEmbed => {
	const memeLeaderboardEmbed = new MessageEmbed()
		.setTitle(`Memes leaderboard for ${memesStartDate.toDateString()}`)
		.setURL(firstMessageUrl)
		.setColor(1925102)
		.setFooter(`Total Participation - ${totalParticipation}`)
		.setTimestamp(Date.now());

	leadersMemes.forEach((leaderMeme, index) => {
		const upVotes = getUpvoteReaction(leaderMeme)?.count;
		memeLeaderboardEmbed.addField(
			`#${index + 1}`,
			`${leaderMeme.author} for [this meme](${leaderMeme.url})\n\`Score: ${upVotes}\``,
		);
	});

	return memeLeaderboardEmbed;
};

const generateStartMemesEmbed = (memesStartDate: Date): MessageEmbed => {
	return new MessageEmbed().setTitle(`Starting memes for today!`).setColor(1925102).setTimestamp(memesStartDate);
};

export const stopListeningForMemes = async (msg: Message): Promise<void> => {
	if (collector) {
		collector.stop();
		const stopMemes = msg.reply('Stopped memes!');
		deleteMessage(await stopMemes, REPLIES.DELETE_TIMEOUT, true);
		return;
	}
	console.log('Collector is null');
};

export const startListeningForMemes = async (msg: Message): Promise<void> => {
	const memesStartDate: Date = new Date();
	collector = null;
	collector = msg.channel.createMessageCollector(
		(collectorMessage: Message) => {
			return collectorMessage.attachments.size > 0;
		},
		{ time: 24 * 60 * 60 * 1000 },
	);
	msg.channel.send(generateStartMemesEmbed(memesStartDate));
	console.log('Started collecting memes');

	collector.on('collect', async (collectedMessage: Message) => {
		try {
			await collectedMessage.react('🔺');
		} catch (error) {}
	});

	collector.on('end', (collectedMessages: Collection<string, Message>) => {
		if (collectedMessages.size > 0) {
			const sortedCollectedMessages = collectedMessages.sort((a, b) => {
				const bReactionCount = getUpvoteReaction(b)?.count;
				const aReactionCount = getUpvoteReaction(a)?.count;
				return bReactionCount - aReactionCount;
			});
			const top3 = sortedCollectedMessages.array().slice(0, 3);
			const leadersEmbed = generateMemeLeaderboardEmbed(
				top3,
				sortedCollectedMessages.size,
				collectedMessages.first().url,
				memesStartDate,
			);
			msg.channel.send(leadersEmbed);
		}
		console.log('Finished collecting memes');
	});
};
