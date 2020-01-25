import { Handler } from 'aws-lambda';
import { SLACK_WEBHOOK_URL } from '../env';
import { fetch } from '../native/request';
import { LambdaEvent } from '../types/LambdaEvent';
import { CockpitHook } from '../types/CockpitHook';
import { getErrorResponseBody, generateResponseBody } from '../utils/error';
import { buildSlackMessageFromCockpitHook } from '../utils/slack';

export const handler: Handler<LambdaEvent> = async (event, context, callback) => {
	if (!SLACK_WEBHOOK_URL) {
		return {
			statusCode: 500,
			body: getErrorResponseBody(`No webhook URL available, please check the admin panel`, context),
		};
	}

	if (event.body.length === 0) {
		return {
			statusCode: 400,
			body: getErrorResponseBody(`Invalid body detected`, context),
		};
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

		return {
			statusCode: 200,
			body: generateResponseBody(context, 'Message sent successfully', null),
		};
	} catch (err) {
		return {
			statusCode: err.code || 500,
			body: getErrorResponseBody(`${err}`, context),
		};
	}
};
