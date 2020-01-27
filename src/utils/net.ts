import { Context } from 'aws-lambda';
import { NetMessage } from '../types';
import { BUILD_ID, COMMIT_REF } from '../env';

export const createResponse = (context: Context, code: number, message?: NetMessage, error?: string) => {
	if (error) {
		console.log(`An error occured: ${error} (at ${context.functionName} – ${context.identity})`);
	}

	return {
		statusCode: code,
		body: generateResponseBody(context, message, error),
	};
};

export const generateResponseBody = (context: Context, message?: NetMessage, error?: string) =>
	JSON.stringify({
		data: message,
		error,
		id: context.awsRequestId,
		remain: context.getRemainingTimeInMillis(),
		build: BUILD_ID,
		ref: COMMIT_REF,
	});
