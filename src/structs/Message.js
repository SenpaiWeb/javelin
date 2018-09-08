const User = require('./User');

/**
 * Represents a message on Twitch.
 */
class Message {
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
		 * The ID of the message
		 * @type {string}
		 */
		this.id = data.match(/id=(.*?);/)[1];

		/**
		 * The content of the message
		 * TODO: this needs some heavy refactoring right here
		 * @type {string}
		 */
		this.content = data.replace(/emotes=(.*?);/, '').replace(/@.*?:.*?:/, '').replace(/\u0001ACTION\s(.*?)\u0001/, '$1').replace(/\r\n|\n|\r/g, '');

		/**
		 * The emotes of the message
		 * @type {Array<string>}
		 */
		this._emotes = data.match(/emotes=(.*?);/)[1] ? data.match(/emotes=(.*?);/)[1].split('/') : [];

		/**
		 * The timestamp of the message
		 * @type {number}
		 */
		this.timestamp = new Date(parseInt(data.match(/tmi-sent-ts=(.*?);/)[1], 10)).getTime();

		/**
		 * The channel the message belongs to
		 * @type {Channel}
		 */
		this.channel = this.client.channels.get(parseInt(data.match(/room-id=(.*?);/)[1], 10));

		/**
		 * The user the message belongs to
		 * @type {User}
		 */
		this.user = new User(client, data);

		/* eslint-enable prefer-destructuring */
	}

	/**
	 * The time the message was sent at
	 * @returns {Date}
	 * @readonly
	 */
	get createdAt() {
		return new Date(this.timestamp);
	}

	get emotes() {
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
	toString() {
		return this.content;
	}
}

module.exports = Message;
