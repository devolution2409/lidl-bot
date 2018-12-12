
const tmi = require('tmi.js');

// Define configuration options:
let opts = {
	identity: {
		username: process.env.BOT_USERNAME,
		password: 'oauth:' +  process.env.OAUTH_TOKEN 
	},
	channels: [
		"devoluti0n"
	]
}

module.exports = new tmi.client(opts);
