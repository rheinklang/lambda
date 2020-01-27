import { Handler } from 'aws-lambda';
import { parse } from 'querystring';
import { SLACK_WEBHOOK_URL } from '../env';
import { fetch, FetchMethod } from '../native/request';
import { LambdaEvent } from '../types/LambdaEvent';
import { CockpitHook } from '../types/CockpitHook';
import { buildSlackMessageFromCockpitHook } from '../utils/slack';
import { createResponse } from '../utils/net';

export const handler: Handler<LambdaEvent> = async (event, context) => {
	if ((event as any).httpMethod !== FetchMethod.POST) {
		return createResponse(context, 405, null, 'Method not allowed');
	}

	if (!SLACK_WEBHOOK_URL) {
		return createResponse(context, 500, null, `No webhook URL available, please check the admin panel`);
	}

	if (event.body.length === 0) {
		return createResponse(context, 400, null, `Invalid body detected`);
	}

	try {
		const dataSet = parse(event.body);
		const selectedData = Object.keys(dataSet)[0];
		const result = JSON.parse(selectedData);

		console.log('Query parsed: %s \n', result);

		console.log(`Incoming payload of type "${typeof event.body}":\n\n${event.body}\n\n\n`);
		const payload: CockpitHook = JSON.parse(`${event.body}` || '{}') || {
			event: 'unknown',
			hook: 'unknown',
			backend: -1,
			args: ['unknown', {}, -1]
		};
		const slackMessage = buildSlackMessageFromCockpitHook(payload);
		const response = await fetch<unknown>({
			method: FetchMethod.POST,
			hostname: 'hooks.slack.com',
			path: SLACK_WEBHOOK_URL,
			headers: {
				'content-type': 'application/json'
			}
		}, JSON.stringify(slackMessage));

		console.log('Slack sent:\n', JSON.stringify(response, null, 2));

		return createResponse(context, 200, {
			sent: true,
			response
		});

	} catch (err) {
		return createResponse(context, 500, null, `${err}`);
	}
};
