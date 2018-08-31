require('dotenv').config();
const { Client } = require('../src/index');
const client = new Client({ oauth: process.env.OAUTH, username: 'hieibot', channels: ['justcrawl', 'ice_poseidon'] });

//client.on('debug', console.log);
client.on('ready', console.log);
client.on('message', message => {
	console.log(message);
	if (message.content === '!ping') {
		message.channel.send(`Hi, ${message.user}!`);
	} else if (message.content === '!channel') {
		message.channel.send(message.channel.toString());
	}
});

client.login();
