import { Handler } from "aws-lambda";
import { LambdaEvent } from "../types/LambdaEvent";
import { COCKPIT_URL, FESTIVAL_URL } from '../env';
import { fetch, FetchMethod } from "../native/request";
import { createResponse } from "../utils/net";

let lastCheck = 0;
let lastCheckResult = {
	cockpit: false,
	festival: false
}

const CHECK_THRESHOLD = 600;

export const checkHealthOf = (host: string, port = 80) => fetch<void>({
	host,
	port,
	method: FetchMethod.GET,
	path: '/'
});

export const handler: Handler<LambdaEvent> = async (_event, context) => {
	if (lastCheck && ((lastCheck + CHECK_THRESHOLD) < Date.now())) {
		// do not check if interval not exceeded
		return createResponse(context, 200, lastCheckResult);
	}

	lastCheck = Date.now();
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

	lastCheckResult = {
		cockpit: isCockpitUp,
		festival: isFestivalUp
	};

	return createResponse(context, 200, lastCheckResult);
}
