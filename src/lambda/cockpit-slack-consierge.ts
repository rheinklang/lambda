import { Handler } from 'aws-lambda';
import { SLACK_WEBHOOK_URL } from '../env';

export const handler: Handler = (event, context, callback) => {
	console.log('Event: ', event)
	console.log('Context: ', context)

	callback(null, {
		statusCode: 200,
		body: JSON.stringify({
			hello: 'world!',
			webhookURLDefined: SLACK_WEBHOOK_URL ? true : false
		}),
	});
};
