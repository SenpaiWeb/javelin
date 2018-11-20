import * as EventEmitter from 'events';
import WebSocket from './websocket/WebSocket.js';
import Channel from '../structs/Channel';
import Message from '../structs/Message.js';
import User from '../structs/User.js';

interface ClientOptions {
	oauth: string;
	username: string;
	channels: string[];
}

/**
 * The client.
 * @extends {EventEmitter}
 */
export default class Client extends EventEmitter {
	/**
	 * The WebSocket manager for this client
	 * @type {WebSocket}
	 */
	public readonly ws = new WebSocket(this, this.options);

	/**
	 * The channels collection
	 * @type {Map<number, Channel>}
	 */
	public channels: Map<number, Channel> = new Map();

	/**
	 * @param {ClientOptions} [options] Options for the client
	 */
	public constructor(public readonly options: ClientOptions) {
		super();
	}

	/**
	 * Joins a Twitch channel.
	 * @param {string} channel The channel to join
	 * @returns {void}
	 */
	public joinChannel(channel: string) {
		if (!channel) return;
		this.ws.send(`JOIN ${channel}`);
		this.emit('debug', `Joined channel ${channel}`);
	}

	/**
	 * Leaves a Twitch channel.
	 * @param {string} channel The channel to leave
	 * @returns {void}
	 */
	public leaveChannel(channel: string) {
		if (!channel) return;
		this.ws.send(`PART ${channel}`);
		this.emit('debug', `Left channel ${channel}`);
	}

	/**
	 * Logs the client in and establishes a websocket connection to twitch.
	 * @returns {void}
	 */
	public login() {
		this.ws.connect();
	}

	/**
	 * Logs the client out and terminates the websocket connection to twitch.
	 * @returns {void}
	 */
	public destroy() {
		this.ws.close();
	}

	public on(event: 'debug' | 'warn', listener: (info: string) => void): this;
	public on(event: 'error' | 'disconnect', listener: (error: Error) => void): this;
	public on(event: 'message', listener: (message: Message) => void): this;
	public on(event: 'channel_join' | 'channel_leave', listener: (channel: Channel) => void): this;
	public on(event: 'user_join' | 'user_leave', listener: (user: User, channel: Channel) => void): this;
	public on(event: string, listener: (...args: any[]) => void): this {
		return super.on(event, listener);
	}
}

/**
 * Emitted for debugging purposes.
 * @event Client#debug
 * @param {string} info The debug info
 */

/**
 * Emitted for warnings.
 * @event Client#warn
 * @param {string} info The warning
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
 * @param {Message} message The message
 */

/**
 * Emitted when the bot joins a channel.
 * @event Client#channel_join
 * @param {Channel} channel The channel
 */

/**
 * Emitted when the bot leaves a channel.
 * @event Client#channel_leave
 * @param {Channel} channel The channel
 */

/**
 * Emitted when a user leaves a channel.
 * @event Client#user_join
 * @param {string} user The user
 * @param {string} channel The channel
 */

/**
 * Emitted when a user leaves a channel.
 * @event Client#user_leave
 * @param {string} user The user
 * @param {string} channel The channel
 */
