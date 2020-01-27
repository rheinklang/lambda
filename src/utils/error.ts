import { Context } from 'aws-lambda';
import { generateResponseBody } from './net';

export const getErrorResponseBody = (message: string, context: Context) =>
	// TODO: What should we generate exactly at this point? Stacktraces? Code?
	generateResponseBody(context, null, message);
