function parse(data) {
	data = data.replace(/\r\n|\n|\r/g, '');
	const message = {
		raw: data,
		tags: {},
		prefix: null,
		command: null,
		params: []
	};

	let pos = 0;
	let spacePos = 0;

	// Discards whitespace until the next character isn't.
	const skipSpaces = () => {
		while (data[pos] === ' ') pos++;
	};

	// Updates the position based on whitespace position to ensure that spacePos < pos after skipping whitespace.
	const updatePosition = () => {
		pos = spacePos + 1;
	}

	skipSpaces();
	// Parses tags which are in the form '@' <tags> <space>
	// where <tags> are in the form <key> '=' <value>, delimited by ';'.
	if (data[pos] === '@') {
		spacePos = data.indexOf(' ');
		if (spacePos === -1) return null;
		const rawTags = data.slice(pos + 1, spacePos).split(';');
		for (const tag of rawTags) {
			const [key, value = ''] = tag.split('=');
			message.tags[key] = value || '';
		}

		updatePosition();
	}

	skipSpaces();
	// Parses the prefix which is in the form ':' <prefix> <space>.
	if (data[pos] === ':') {
		spacePos = data.indexOf(' ', pos);
		if (spacePos === -1) return null;
		message.prefix = data.slice(pos + 1, spacePos);
		updatePosition();
		skipSpaces();
	}

	spacePos = data.indexOf(' ', pos);
	// Parses a command with no parameters.
	if (spacePos === -1) {
		// Make sure there is still text, i.e. there is a command.
		if (data.length > pos) {
			message.command = data.slice(pos);
			return message;
		}

		return null;
	}

	// Parses a command with parameters.
	// This is in the form <command> <space> <params> where <params> are space delimited values and
	// the parameter beginning with ':' would take the rest of the input string.
	message.command = data.slice(pos, spacePos);
	updatePosition();
	skipSpaces();
	while (pos < data.length) {
		spacePos = data.indexOf(' ', pos);
		// When on the ':' parameter.
		if (data[pos] === ':') {
			message.params.push(data.slice(pos + 1));
			break;
		}

		// When on the last parameter.
		if (spacePos === -1) {
			message.params.push(data.slice(pos));
			break;
		}

		if (spacePos !== -1) {
			message.params.push(data.slice(pos, spacePos));
			updatePosition();
			skipSpaces();
			continue;
		}
	}

	return message;
}

module.exports = parse;
