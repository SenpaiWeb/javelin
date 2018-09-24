/**
 * Represents a user on Twitch.
 */
class User {
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
		 * The ID of the user
		 * @type {number}
		 */
		this.id = parseInt(data.tags['user-id'], 10);

		/**
		 * The username of the user
		 * @type {string}
		 */
		this.username = data.command.match(/!(.*?)@/)[1];

		/**
		 * The display name of the user (case-sensitive)
		 * @type {string}
		 */
		this.displayName = data.tags['display-name'];

		/**
		 * The color of the user
		 * @type {string}
		 */
		this.color = data.tags.color;

		/**
		 * The badges of the user
		 * @type {Array<string>}
		 */
		this.badges = data.tags.badges ? data.tags.badges.split(',') : [];

		/**
		 * Whether this user is a Twitch admin
		 * @type {boolean}
		 */
		this.admin = this.badges.includes('admin');

		/**
		 * Whether this user is a broadcaster
		 * @type {boolean}
		 */
		this.broadcaster = this.badges.includes('broadcaster');

		/**
		 * Whether this user is a global moderator
		 * @type {boolean}
		 */
		this.globalMod = this.badges.includes('global_mod');

		/**
		 * Whether this user is a moderator
		 * @type {boolean}
		 */
		this.moderator = this.badges.includes('moderator') || Boolean(parseInt(data.tags.mod, 10));

		/**
		 * Whether this user is a subscriber
		 * @type {boolean}
		 */
		this.subscriber = this.badges.includes('subscriber') || Boolean(parseInt(data.tags.subscriber, 10));

		/**
		 * Whether this user is Twitch staff
		 * @type {boolean}
		 */
		this.staff = this.badges.includes('staff');

		/**
		 * Whether this user has Twitch Turbo
		 * @type {boolean}
		 */
		this.turbo = this.badges.includes('turbo') || Boolean(parseInt(data.tags.turbo, 10));

		/**
		 * Whether this user has Amazon Prime
		 * @type {boolean}
		 */
		this.prime = this.badges.includes('premium');

		/* eslint-enable prefer-destructuring */
	}

	/**
	 * When concatenating a string, returns the username instead of the object.
	 * @returns {string}
	 */
	toString() {
		return `@${this.displayName || this.username}`;
	}
}

module.exports = User;
