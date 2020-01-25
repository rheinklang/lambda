const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export const convertUnixTimestampToReadableDate = (timestamp: number) => {
	if (typeof timestamp !== 'number') {
		return 'Unknown';
	}

	// Create a new JavaScript Date object based on the timestamp
	// multiplied by 1000 so that the argument is in milliseconds, not seconds.
	const date = new Date(timestamp * 1000);

	// Hours part from the timestamp
	const hours = date.getHours() + 1; // +1 because of our timezone (Zurich)
	// Minutes part from the timestamp
	const minutes = `0${date.getMinutes()}`;
	// Seconds part from the timestamp
	const seconds = `0${date.getSeconds()}`;
	// Get full date in "<week-day>, <day>. <month> <year>"
	const localDate = date.toLocaleDateString('de-DE', options);

	return `$${localDate} – ${hours}:${minutes}:${seconds}`;
}
