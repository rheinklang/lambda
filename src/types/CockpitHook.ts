import { CockpitUpdateData } from './CockpitUpdateData';

export interface CockpitHook<T extends Record<string, any> = {}> {
	event: string,
	hook: string;
	backend: number;
	args: [string, CockpitUpdateData & T, boolean]
}
