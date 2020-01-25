import { Handler } from 'aws-lambda';
import fetch from 'node-fetch';
import { SLACK_WEBHOOK_URL } from '../env';
import { LambdaEvent } from '../types/LambdaEvent';
import { CockpitHook } from '../types/CockpitHook';
import { getErrorResponseBody, generateResponseBody } from '../utils/error';
import { SlackMessageBody, buildTextBlock, buildContextBlock, buildFields } from '../utils/slack';
import { convertUnixTimestampToReadableDate } from '../utils/date';
import { createBlocksFromUpdateData } from '../types/CockpitUpdateData';

const buildSlackMessage = (payload: CockpitHook): SlackMessageBody => {
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
				fields: buildFields(readableUpdate)
			},
			buildContextBlock('This is an auto-generated message, do not reply.')
		]
	}
}

export const handler: Handler<LambdaEvent> = async (event, context, callback) => {
	console.log('Event: ', event)
	console.log('Context: ', context)

	if (!SLACK_WEBHOOK_URL) {
		return {
			statusCode: 500,
			body: getErrorResponseBody(`No webhook URL available, please check the admin panel`, context)
		};
	}

	if (event.body.length === 0) {
		return {
			statusCode: 400,
			body: getErrorResponseBody(`Invalid body detected`, context)
		}
	}

	try {
		const payload: CockpitHook = JSON.parse(event.body);
		const slackMessage = buildSlackMessage(payload);

		await fetch(SLACK_WEBHOOK_URL, {
			method: 'POST	',
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(slackMessage)
		});

		return {
			statusCode: 200,
			body: generateResponseBody(context, 'Message sent successfully', null)
		}

	} catch (err) {
		return {
			statusCode: err.code || 500,
			body: getErrorResponseBody(`${err}`, context)
		}
	}

};
