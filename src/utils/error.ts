import { Context } from 'aws-lambda';
import { BUILD_ID, COMMIT_REF } from '../env';

export const generateResponseBody = (context: Context, message?: string, error?: string) =>
	JSON.stringify({
		message,
		error,
		id: context.awsRequestId,
		remain: context.getRemainingTimeInMillis(),
		build: BUILD_ID,
		ref: COMMIT_REF,
	});

export const getErrorResponseBody = (message: string, context: Context) => generateResponseBody(context, null, message);
