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
	type: 'context',
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
}

export const buildFields = (fields: Record<string, any>, map: (value: any) => string = v => v): SlackField[] => {
	return Object.keys(fields).reduce((prev, curr) => ([
		...prev,
		fields[curr]
			? {
				type: 'mrkdwn',
				text: `*${curr}*\n${map(fields[curr])}`
			}
			: null
	]), []).filter(Boolean) as SlackField[];
}

export const buildTextBlock = (message: string): SlackBlock => {
	return {
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: message
		}
	};
}

export const buildContextBlock = (message: string): SlackContext => {
	return {
		type: 'context',
		elements: [
			{
				type: 'mrkdwn',
				text: message
			}
		]
	};
}
