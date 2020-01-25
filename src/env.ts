const env = process.env || {};

const parseEnv = <T extends any = null>(field: string | undefined, fallback: T = null): string | T => {
	const value = process.env[field];

	if (!value || value.length === 0) {
		return fallback;
	}

	return value;
};

export const SLACK_WEBHOOK_URL = parseEnv('SLACK_WEBHOOK_URL');

/** @see https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables */
export const BUILD_ID = parseEnv('BUILD_ID');

/** @see https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables */
export const CONTEXT = parseEnv('CONTEXT');

/** @see https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables */
export const REPOSITORY_URL = parseEnv('REPOSITORY_URL');

/** @see https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables */
export const COMMIT_REF = parseEnv('COMMIT_REF');
