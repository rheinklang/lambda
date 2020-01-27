import { Handler } from 'aws-lambda';
import { parse } from 'querystring';
import { SLACK_WEBHOOK_URL } from '../env';
import { fetch, FetchMethod } from '../native/request';
import { LambdaEvent } from '../types/LambdaEvent';
import { CockpitHook } from '../types/CockpitHook';
import { buildSlackMessageFromCockpitHook } from '../utils/slack';
import { createResponse } from '../utils/net';

const defaultSlackMessage: CockpitHook<any> = {
	event: 'unknown',
	hook: 'unknown',
	backend: -1,
	args: ['unknown', {}, false]
}

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
		const dataSet = parse(event.body) || {};
		console.log('DataSet:', dataSet);
		const selectedData = Object.keys(dataSet)[0] || '{}';
		const payload: CockpitHook = JSON.parse(selectedData);

		console.log('Payload:', payload);

		const slackMessage = buildSlackMessageFromCockpitHook({
			...defaultSlackMessage,
			...payload
		});

		console.log('Slack message:', slackMessage);

		const response = await fetch(`https://hooks.slack.com/${SLACK_WEBHOOK_URL}`, {
			method: FetchMethod.POST,
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(slackMessage)
		});

		const data = await response.json();

		return createResponse(context, 200, {
			sent: true,
			response: data
		});

	} catch (err) {
		return createResponse(context, 500, null, `${err}`);
	}
};
