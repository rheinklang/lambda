import { Handler } from "aws-lambda";
import { LambdaEvent } from "../types/LambdaEvent";
import { COCKPIT_URL, FESTIVAL_URL } from '../env';
import { fetch, FetchMethod } from "../native/request";
import { createResponse } from "../utils/net";

export const checkHealthOf = (host: string, port = 80) => fetch<void>({
	host,
	port,
	method: FetchMethod.GET,
	path: '/'
});

export const handler: Handler<LambdaEvent> = async (_event, context) => {
	let isCockpitUp = false;

	try {
		await checkHealthOf(COCKPIT_URL);
		isCockpitUp = true;
	} catch (err) {
		console.log(`Health check for ${COCKPIT_URL} failed: ${err}`);
	}

	let isFestivalUp = false;

	try {
		await checkHealthOf(FESTIVAL_URL);
		isFestivalUp = true;
	} catch (err) {
		console.log(`Health check for ${FESTIVAL_URL} failed: ${err}`);
	}

	return createResponse(context, 200, {
		cockpit: isCockpitUp,
		festival: isFestivalUp
	});
}
