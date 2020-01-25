/**
 * Will be compiled at build time on the netlify server itself
 */

export const SLACK_WEBHOOK_URL = '${SLACK_WEBHOOK_URL}';
export const BUILD_ID = '${BUILD_ID}';
export const CONTEXT = '${CONTEXT}';
export const REPOSITORY_URL = '${REPOSITORY_URL}';
export const COMMIT_REF = '${COMMIT_REF}';
export const BUILD_TIMESTAMP = '${new Date().toISOString()}';
