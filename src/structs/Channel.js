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
		this.id = parseInt(data.match(/room-id=(.*?);/)[1], 10);

		/**
		 * The name of the channel
		 * @type {string}
		 */
		this.name = data.match(/[\s\S]*#(.*?) /)[1];

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
