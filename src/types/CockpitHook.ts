interface CockpitHook<T extends {} = {}> {
	event: string,
	hook: string;
	backend: number;
	args: [string, T, boolean]
}
