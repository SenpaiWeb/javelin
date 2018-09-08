const WS = require('ws');
const Channel = require('../../structs/Channel');
const Message = require('../../structs/Message');

// TODO: remove this dirty hack
Map.prototype.find = function(fn) {
	for (const [key, val] of this) {
		if (fn(val, key, this)) return val;
	}
	return undefined;
}

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
	 * TODO: Refactor `CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands`
	 */
	onOpen() {
		this.client.emit('debug', 'Connecting');
		this.ws.send(`CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands`);
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
		if (packet.data.includes('msg_channel_suspended')) {
			this.client.emit('warn', packet.data.match(/[\s\S]*#(.*?) /)[1], packet.data.replace(/@.*?:.*?:/, ''));
		}
		if (packet.data.includes('ROOMSTATE')) {
			const channel = new Channel(this.client, packet.data);
			this.client.channels.set(channel.id, channel);
			this.client.emit('channel_join', channel);
		}
		if (packet.data.includes('PART')) {
			const REGEX = new RegExp(`${this.client.options.username}.*#(.*)`);
			if (!REGEX.test(packet.data)) return;
			const channel = this.client.channels.find(c => c.name === packet.data.match(REGEX)[1].toLowerCase());
			this.client.emit('channel_leave', 'test', channel, packet.data.match(REGEX)[1].toLowerCase());
			this.client.channels.delete(channel.id);
		}
		if (packet.data.includes('PRIVMSG')) {
			this.client.emit('message', new Message(this.client, packet.data));
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
