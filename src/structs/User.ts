import Client from '../client/Client';

/**
 * Represents a user on Twitch.
 */
export default class User {
	/**
	 * The ID of the user
	 * @type {number}
	 */
	public id = parseInt(this.data.tags['user-id'], 10);

	/**
	 * The username of the user
	 * @type {string}
	 */
	public username = this.data.command.match(/!(.*?)@/)[1];

	/**
	 * The display name of the user (case-sensitive)
	 * @type {string}
	 */
	public displayName = this.data.tags['display-name'];

	/**
	 * The color of the user
	 * @type {string}
	 */
	public color = this.data.tags.color;

	/**
	 * The badges of the user
	 * @type {Array<string>}
	 */
	public badges = this.data.tags.badges ? this.data.tags.badges.split(',') : [];

	/**
	 * Whether this user is a Twitch admin
	 * @type {boolean}
	 */
	public admin = this.badges.includes('admin');

	/**
	 * Whether this user is a broadcaster
	 * @type {boolean}
	 */
	public broadcaster = this.badges.includes('broadcaster');

	/**
	 * Whether this user is a global moderator
	 * @type {boolean}
	 */
	public globalMod = this.badges.includes('global_mod');

	/**
	 * Whether this user is a moderator
	 * @type {boolean}
	 */
	public moderator = this.badges.includes('moderator') || Boolean(parseInt(this.data.tags.mod, 10));

	/**
	 * Whether this user is a subscriber
	 * @type {boolean}
	 */
	public subscriber = this.badges.includes('subscriber') || Boolean(parseInt(this.data.tags.subscriber, 10));

	/**
	 * Whether this user is Twitch staff
	 * @type {boolean}
	 */
	public staff = this.badges.includes('staff');

	/**
	 * Whether this user has Twitch Turbo
	 * @type {boolean}
	 */
	public turbo = this.badges.includes('turbo') || Boolean(parseInt(this.data.tags.turbo, 10));

	/**
	 * Whether this user has Amazon Prime
	 * @type {boolean}
	 */
	public prime = this.badges.includes('premium');

	/**
	 * @param {Client} client The client
	 * @param {Object} data The data
	 */
	public constructor(public readonly client: Client, private readonly data: any) {}

	/**
	 * When concatenating a string, returns the username instead of the object.
	 * @returns {string}
	 */
	public toString() {
		return `@${this.displayName || this.username}`;
	}
}
