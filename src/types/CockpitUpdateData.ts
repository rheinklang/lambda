import { excerpt } from '../utils/format';

export interface CockpitUpdateData {
	_mby: string;
	_by: string;
	_modified: number;
	_created: number;
	_id: string;
	moderation?: string;
}

export const INTERNAL_COCKPIT_FIELDS = ['_mby', '_by', '_modified', '_created', '_id', 'moderation'];

export const filterCockpitInternal = <T extends Record<string, any>>(payload: T): T => {
	return Object.keys(payload)
		.filter((key) => INTERNAL_COCKPIT_FIELDS.indexOf(key) === -1)
		.reduce(
			(prev, curr) => ({
				...prev,
				[curr]: payload[curr],
			}),
			{} as T
		);
};

export const createBlocksFromUpdateData = <T extends Record<string, any>>(payload: T): T => {
	const realPayload = filterCockpitInternal(payload);

	return Object.keys(realPayload).reduce((prev, curr) => {
		let contents = payload[curr];

		if (typeof contents === 'boolean') {
			contents = contents ? 'Yes' : 'No';
		} else if (typeof contents === 'number') {
			// number is fine
		} else if (Array.isArray(contents)) {
			contents = contents.join(', ');
		} else if (typeof contents !== 'string') {
			contents = '[Strukturierte Daten]';
		} else {
			contents = excerpt(contents, 100);
		}

		return {
			...prev,
			[curr]: contents,
		};
	}, {} as T);
};
