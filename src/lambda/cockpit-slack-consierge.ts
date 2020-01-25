import { Handler } from 'aws-lambda';

export const handler: Handler = (event, context, callback) => {
	console.log(event, context, callback);

	callback(null, {
		statusCode: 200,
		body: JSON.stringify({
			hello: 'world!',
		}),
	});
};
