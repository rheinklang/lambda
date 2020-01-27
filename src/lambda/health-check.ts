import { Handler } from "aws-lambda";
import { LambdaEvent } from "../types/LambdaEvent";
import { COCKPIT_URL, FESTIVAL_URL } from '../env';
import { fetch } from "../native/request";
import { createResponse } from "../utils/net";

export const handler: Handler<LambdaEvent> = async (_event, context) => {
	let isCockpitUp = false;

	try {
		await fetch<void>({
			host: COCKPIT_URL,
			path: ''
		});
		isCockpitUp = true;
	} catch (err) {
		console.log(`Health check for ${COCKPIT_URL} failed: ${err}`);
	}

	let isFestivalUp = false;

	try {
		await fetch<void>({
			host: FESTIVAL_URL,
			path: ''
		});
		isFestivalUp = true;
	} catch (err) {
		console.log(`Health check for ${FESTIVAL_URL} failed: ${err}`);
	}

	return createResponse(context, 200, {
		cockpit: isCockpitUp,
		festival: isFestivalUp
	});
}
