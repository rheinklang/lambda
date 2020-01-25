import { Handler } from 'aws-lambda';

export const handler: Handler = (event, context, callback) => {
	console.log('Event: ', event)
	console.log('Context: ', context)

	callback(null, {
		statusCode: 200,
		body: JSON.stringify({
			hello: 'world!',
		}),
	});
};
