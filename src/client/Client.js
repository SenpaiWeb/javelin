const EventEmitter = require('events');
const WebSocket = require('./websocket/WebSocket');

/**
 * The client.
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {
	/**
	 * @param {ClientOptions} [options] Options for the client
	 */
	constructor(options = {}) {
		super();
		this.options = options;

		/**
		 * The WebSocket manager for this client
		 * @type {WebSocket}
		 * @private
		 */
		this.ws = new WebSocket(this, options);
	}

	/**
	 * Joins a Twitch channel.
	 * @param {string} channel The channel to join
	 * @returns {void}
	 */
	joinChannel(channel) {
		if (!channel) return;
		this.ws.send(`JOIN #${channel}`);
		this.emit('debug', `Joined channel #${channel}`);
	}

	/**
	 * Leaves a Twitch channel.
	 * @param {string} channel The channel to leave
	 * @returns {void}
	 */
	leaveChannel(channel) {
		if (!channel) return;
		this.ws.send(`PART #${channel}`);
		this.emit('debug', `Left channel #${channel}`);
	}

	/**
	 * Logs the client in and establishes a websocket connection to twitch.
	 * @returns {void}
	 */
	login() {
		this.ws.connect();
	}

	/**
	 * Logs the client out and terminates the websocket connection to twitch.
	 * @returns {void}
	 */
	destroy() {
		this.ws.close();
	}
}

module.exports = Client;

/**
 * Emitted for debugging purposes.
 * @event Client#debug
 * @param {string} info The debug info
 */

/**
 * Emitted whenever an error is encountered.
 * @event Client#error
 * @param {Error} error The error
 */

/**
 * Emitted whenever the clients disconnects.
 * @event Client#disconnect
 * @param {Error} error The error
 */

/**
 * Emitted for every message received.
 * @event Client#message
 * @param {Object} message The message
 */
