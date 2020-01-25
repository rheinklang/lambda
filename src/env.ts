const env = process.env || {};

const parseEnv = <T extends any = null>(field: string | undefined, fallback: T = null): string | T => {
	const value = process.env[field];

	if (!value || value.length === 0) {
		return fallback;
	}

	return value;
}

export const SLACK_WEBHOOK_URL = parseEnv('SLACK_WEBHOOK_URL');
