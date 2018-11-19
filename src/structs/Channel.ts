import Client from '../client/Client';

/**
 * Represents a channel on Twitch.
 */
export default class Channel {
	/**
	 * The ID of the channel
	 * @type {number}
	 */
	public id = parseInt(this.data.tags['room-id'], 10);

	/**
	 * The name of the channel
	 * @type {string}
	 */
	public name = this.data.params[1];

	/**
	 * Whether the channel is in emote only mode
	 * @type {boolean}
	 */
	public emoteOnly = Boolean(parseInt(this.data.tags['emote-only'], 10));

	/**
	 * The duration the channel is in followers only mode (-1 being inactive)
	 * @type {number}
	 */
	public followersOnly = parseInt(this.data.tags['followers-only'], 10);

	/**
	 * Whether the channel is in r9k mode
	 * @type {boolean}
	 */
	public r9k = Boolean(parseInt(this.data.tags.r9k, 10));

	/**
	 * Whether the channel has rituals active
	 * @type {boolean}
	 */
	public rituals = Boolean(parseInt(this.data.tags.rituals, 10));

	/**
	 * The duration the channel is in slow mode (0 being inactive)
	 * @type {number}
	 */
	public slowMode = parseInt(this.data.tags.slow, 10);

	/**
	 * Whether the channel is in sub only mode
	 * @type {boolean}
	 */
	public subsOnly = Boolean(parseInt(this.data.tags['subs-only'], 10));

	/**
	 * @param {Client} client The client
	 * @param {Object} data The data
	 */
	public constructor(public readonly client: Client, private readonly data: any) {}

	/**
	 * Sends a message to the channel.
	 * @param {string} message The message to send
	 * @returns {void}
	 */
	public send(message: string) {
		this.client.ws.send(`PRIVMSG ${this.name} :${message}`);
	}

	/**
	 * Leaves the channel.
	 * @returns {void}
	 */
	public leave() {
		this.client.ws.send(`PART ${this.name}`);
	}

	/**
	 * When concatenating a string, returns the channel name instead of the object.
	 * @returns {string}
	 */
	public toString() {
		return `${this.name}`;
	}
}
