import { Handler } from "aws-lambda";
import { LambdaEvent } from "../types/LambdaEvent";
import { COCKPIT_URL, FESTIVAL_SITE } from '../env';
import { fetch } from "../native/request";

export const handler: Handler<LambdaEvent> = async () => {
	let isCockpitUp = false;

	try {
		await fetch<void>({
			host: COCKPIT_URL,
			path: ''
		});
		isCockpitUp = true;
	} catch (err) {
		console.log(`Health check failed: ${err}`);
	}

	let isFestivalUp = false;

	try {
		await fetch<void>({
			host: FESTIVAL_SITE,
			path: ''
		});
		isFestivalUp = true;
	} catch (err) {
		console.log(`Health check failed: ${err}`);
	}

	return {
		cockpit: isCockpitUp,
		festival: isFestivalUp
	};
}
