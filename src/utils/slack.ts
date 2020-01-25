import { CockpitHook } from '../types/CockpitHook';
import { createBlocksFromUpdateData } from '../types/CockpitUpdateData';
import { convertUnixTimestampToReadableDate } from './date';

export interface SlackField {
	type: 'text' | 'mrkdwn';
	text: string;
}

export interface SlackBlock {
	type: 'section';
	text?: SlackField;
	fields?: SlackField[];
}

export interface SlackContext {
	type: 'context';
	elements: SlackField[];
}

export interface SlackMessageBody {
	blocks: Array<SlackBlock | SlackContext>;
	thread_ts?: string;
	/**
	 * @deprecated
	 */
	attachments?: any[];
	mrkdwn?: boolean;
}

export const buildCodeMarkdown = (content: string): string => {
	return ['```', content, '```'].join('');
};

export const buildFields = (fields: Record<string, any>, map: (value: any) => string = (v) => v): SlackField[] => {
	return Object.keys(fields)
		.reduce(
			(prev, curr) => [
				...prev,
				fields[curr]
					? {
							type: 'mrkdwn',
							text: `*${curr}*\n${map(fields[curr])}`,
					  }
					: null,
			],
			[]
		)
		.filter(Boolean) as SlackField[];
};

export const buildTextBlock = (message: string): SlackBlock => {
	return {
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: message,
		},
	};
};

export const buildContextBlock = (message: string): SlackContext => {
	return {
		type: 'context',
		elements: [
			{
				type: 'mrkdwn',
				text: message,
			},
		],
	};
};

export const buildSlackMessageFromCockpitHook = (payload: CockpitHook): SlackMessageBody => {
	const { args, event, hook, backend } = payload;
	const [location, data, flag] = args;
	const { _modified } = data;

	const readableUpdate = createBlocksFromUpdateData(data);
	const modifiedAt = convertUnixTimestampToReadableDate(_modified);

	const intro = `Cockpit CMS – $${hook}`;
	const headline = `Detected *${event}* on *${location}* at backend ${backend}, triggered at ${modifiedAt} (${flag})`;

	return {
		blocks: [
			// initial intro text block
			buildTextBlock(`${intro}\n${headline}`),
			{
				type: 'section',
				fields: buildFields(readableUpdate),
			},
			buildContextBlock('This is an auto-generated message, do not reply.'),
		],
	};
};
