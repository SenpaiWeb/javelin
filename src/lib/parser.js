// TODO: One day comment all of this so anyone even knows whats going on here
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
	let space = 0;

	if (data.charCodeAt(0) === 64) {
		space = data.indexOf(' ');
		if (space === -1) return null;

		const rawTags = data.slice(1, space).split(';');
		for (const tag of rawTags) {
			const pair = tag.split('=');
			message.tags[pair[0]] = pair[1] || '';
		}
		pos = space + 1;
	}
	while (data.charCodeAt(pos) === 32) pos++;

	if (data.charCodeAt(0) === 58) {
		space = data.indexOf(' ', pos);
		if (space === -1) return null;

		message.prefix = data.slice(pos + 1, space);
		pos = space + 1;

		while (data.charCodeAt(pos) === 32) pos++;
	}
	space = data.indexOf(' ', pos);

	if (space === -1) {
		if (data.length > pos) {
			message.command = data.slice(pos);
			return message;
		}

		return null;
	}
	message.command = data.slice(pos, space);
	pos = space + 1;

	while (data.charCodeAt(pos) === 32) pos++;
	while (pos < data.length) {
		space = data.indexOf(' ', pos);
		if (data.charCodeAt(pos) === 58) {
			message.params.push(data.slice(pos + 1));
			break;
		}
		if (space !== -1) {
			message.params.push(data.slice(pos, space));
			pos = space + 1;
			while (data.charCodeAt(pos) === 32) pos++;
			continue;
		}
		if (space === -1) {
			message.params.push(data.slice(pos));
			break;
		}
	}

	return message;
}

module.exports = parse;
