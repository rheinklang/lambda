import { Handler } from 'aws-lambda';
import { SLACK_WEBHOOK_URL } from '../env';
import { fetch } from '../native/request';
import { LambdaEvent } from '../types/LambdaEvent';
import { CockpitHook } from '../types/CockpitHook';
import { getErrorResponseBody, generateResponseBody } from '../utils/error';
import { buildSlackMessageFromCockpitHook } from '../utils/slack';
import { createResponse } from '../utils/net';

export const handler: Handler<LambdaEvent> = async (event, context, callback) => {
	if (!SLACK_WEBHOOK_URL) {
		return createResponse(context, 500, null, `No webhook URL available, please check the admin panel`);
	}

	if (event.body.length === 0) {
		return createResponse(context, 400, null, `Invalid body detected`);
	}

	try {
		const payload: CockpitHook = JSON.parse(event.body);
		const slackMessage = buildSlackMessageFromCockpitHook(payload);

		await fetch<unknown>({
			method: 'POST	',
			hostname: 'hooks.slack.com',
			path: SLACK_WEBHOOK_URL,
			headers: {
				'content-type': 'application/json'
			}
		}, JSON.stringify(slackMessage));

		return createResponse(context, 200, 'Message sent successfully');

	} catch (err) {
		return createResponse(context, 500, null, `${err}`);
	}
};
