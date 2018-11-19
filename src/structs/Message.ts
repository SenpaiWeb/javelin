import User from './User';
import Client from '../client/Client';

/**
 * Represents a message on Twitch.
 */
export default class Message {
	/**
	 * The ID of the message
	 * @type {string}
	 */
	public id = this.data.tags.id;

	/**
	 * The content of the message
	 * TODO: this needs some heavy refactoring right here
	 * @type {string}
	 */
	public content = this.data.params[2];

	/**
	 * The emotes of the message
	 * @type {Array<string>}
	 */
	private readonly _emotes = this.data.tags.emotes ? this.data.tags.emotes.split('/') : []; // tslint:disable-line

	/**
	 * The timestamp of the message
	 * @type {number}
	 */
	public timestamp = new Date(parseInt(this.data.tags['tmi-sent-ts'], 10)).getTime();

	/**
	 * The channel the message belongs to
	 * @type {Channel}
	 */
	public channel = this.client.channels.get(parseInt(this.data.tags['room-id'], 10));

	/**
	 * The user the message belongs to
	 * @type {User}
	 */
	public user = new User(this.client, this.data);

	/**
	 * @param {Client} client The client
	 * @param {Object} data The data
	 */
	public constructor(public readonly client: Client, private readonly data: any) {}

	/**
	 * The time the message was sent at
	 * @returns {Date}
	 * @readonly
	 */
	public get createdAt() {
		return new Date(this.timestamp);
	}

	public get emotes() {
		/**
		 * http://static-cdn.jtvnw.net/emoticons/v1/
		 */
		if (!this._emotes.length) return [];
		const emotes = [];
		for (const emote of this._emotes) {
			emotes.push(`http://static-cdn.jtvnw.net/emoticons/v1/${emote.split(':')[0]}/3.0`);
		}
		return emotes;
	}

	/**
	 * When concatenating a string, returns the message content instead of the object.
	 * @returns {string}
	 */
	public toString() {
		return this.content;
	}
}
