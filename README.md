# Javelin <img src="https://i.imgur.com/CtLBWyl.png" align="right">
> A simple yet powerful Twitch IRC/WebSocket wrapper.

I'll get into filling this out later, gotta stay tuned for now.

# Example

While the library is still heavily work-in-progress you can already somewhat create a bot with it.

```js
const { Client } = require('javelin');
const client = new Client({
	oauth: process.env.OAUTH,
	username: 'your_bots_username',
	channels: [
		'#array',
		'#of',
		'#channels',
		'#to',
		'#join'
	]
});

client.on('debug', console.log);
client.on('warn', console.log);
client.on('ready', console.log);
client.on('channel_join', console.log);
client.on('channel_leave', console.log);
client.on('user_join', console.log);
client.on('user_leave', console.log);
client.on('message', message => {
	if (message.content === '!ping') {
		message.channel.send(`Hi, ${message.user}!`);
	}
});

client.login();
```

## Author

**Javelin** © [iCrawl](https://github.com/iCrawl).  
Authored and maintained by iCrawl.

> GitHub [@iCrawl](https://github.com/iCrawl)
