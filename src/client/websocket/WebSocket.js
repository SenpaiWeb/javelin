const WS = require('ws');
const Message = require('../../structs/Message');

/**
 * The WebSocket Manager.
 */
class WebSocket {
	/**
	 * @param {Client} client The client
	 * @param {Object} options The options
	 */
	constructor(client, options) {
		this.options = options;

		/**
		 * The client that instantiated this Websocket manager
		 * @type {Client}
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The WebSocket connection of this manager
		 * @type {?WebSocketConnection}
		 */
		this.ws = null;
	}

	/**
	 * Connects the client to the WebSocket.
	 * @returns {void}
	 */
	connect() {
		this.ws = new WS('wss://irc-ws.chat.twitch.tv:443');
		this.ws.onopen = this.onOpen.bind(this);
		this.ws.onerror = this.onError.bind(this);
		this.ws.onclose = this.onClose.bind(this);
		this.ws.onmessage = this.onMessage.bind(this);
	}

	/**
	 * TODO: Implement `CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands`
	 */
	onOpen() {
		this.client.emit('debug', 'Connecting');
		this.ws.send(`PASS ${this.options.oauth}`);
		this.ws.send(`NICK ${this.options.username}`);
		for (const channel of this.options.channels) {
			this.ws.send(`JOIN #${channel}`);
		}
	}

	onError(error) {
		this.client.emit('error', error);
	}

	onClose(close) {
		this.client.emit('disconnect', close);
	}

	/**
	 * TODO: finish all of this eventually
	 */
	onMessage(packet) {
		this.client.emit('debug', packet.data);
		if (packet.data.includes('001')) {
			this.client.emit('ready', 'Ready! Woop!');
		}
		if (packet.data.includes('PRIVMSG')) {
			this.client.emit('message', new Message(this, packet.data));
		}
		if (packet.data.includes('PING')) {
			this.ws.send('PONG :tmi.twitch.tv');
			this.client.emit('debug', 'Received ping, responded with pong!');
		}
	}

	/**
	 * Sends a packet to the currently connected WebSocket
	 * @param  {Object} packet The packet
	 * @returns {void}
	 */
	send(packet) {
		this.ws.send(packet);
	}

	/**
	 * Closes the Websocket connection.
	 * @return {void}
	 */
	close() {
		this.ws.close();
		this.ws = null;
	}
}

module.exports = WebSocket;
