export const excerpt = (text: string, limit = 200) => {
	if (text.length > limit) {
		//trim the string to the maximum length
		let trimmedString = text.substr(0, limit);
		// re-trim if we are in the middle of a word and
		trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));

		return trimmedString;
	}

	return text;
};
