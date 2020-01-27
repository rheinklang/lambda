import { generateResponseBody } from './error';
import { Context } from 'aws-lambda';

export const createResponse = (context: Context, code: number, message?: string | Record<any, any>, error?: string) => {
	if (error) {
		console.log(`An error occured: ${error} (at ${context.functionName} – ${context.identity})`);
	}

	if (typeof message !== 'string') {
		message = JSON.stringify(message);
	}

	return {
		statusCode: code,
		body: generateResponseBody(context, message, error),
	};
};
