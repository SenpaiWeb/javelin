/**
 * Represents a channel on Twitch.
 */
class Channel {
	/**
	 * @param {Client} client The client
	 * @param {Object} data The data
	 */
	constructor(client, data) {
		/* eslint-disable prefer-destructuring */

		/**
		 * The client that instantiated this Websocket manager
		 * @type {Client}
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The ID of the channel
		 * @type {number}
		 */
		this.id = parseInt(data.tags['room-id'], 10);

		/**
		 * The name of the channel
		 * @type {string}
		 */
		this.name = data.params[1];

		/**
		 * Whether the channel is in emote only mode
		 * @type {boolean}
		 */
		this.emoteOnly = Boolean(parseInt(data.tags['emote-only'], 10));

		/**
		 * The duration the channel is in followers only mode (-1 being inactive)
		 * @type {number}
		 */
		this.followersOnly = parseInt(data.tags['followers-only'], 10);

		/**
		 * Whether the channel is in r9k mode
		 * @type {boolean}
		 */
		this.r9k = Boolean(parseInt(data.tags.r9k, 10));

		/**
		 * Whether the channel has rituals active
		 * @type {boolean}
		 */
		this.rituals = Boolean(parseInt(data.tags.rituals, 10));

		/**
		 * The duration the channel is in slow mode (0 being inactive)
		 * @type {number}
		 */
		this.slowMode = parseInt(data.tags.slow, 10);

		/**
		 * Whether the channel is in sub only mode
		 * @type {boolean}
		 */
		this.subsOnly = Boolean(parseInt(data.tags['subs-only'], 10));

		/* eslint-enable prefer-destructuring */
	}

	/**
	 * Sends a message to the channel.
	 * @param {string} message The message to send
	 * @returns {void}
	 */
	send(message) {
		this.client.ws.send(`PRIVMSG #${this.name} :${message}`);
	}

	/**
	 * Leaves the channel.
	 * @returns {void}
	 */
	leave() {
		this.client.ws.send(`PART #${this.name}`);
	}

	/**
	 * When concatenating a string, returns the channel name instead of the object.
	 * @returns {string}
	 */
	toString() {
		return `#${this.name}`;
	}
}

module.exports = Channel;
