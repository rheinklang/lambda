import { generateResponseBody } from './error';
import { Context } from 'aws-lambda';

export const createResponse = (context: Context, code: number, message?: string, error?: string) => {
	if (error) {
		console.log(`An error occured: ${error} (at ${context.functionName} – ${context.identity})`);
	}

	return {
		statusCode: code,
		body: generateResponseBody(context, message, error),
	};
};
