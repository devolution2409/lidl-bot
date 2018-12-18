// file that will export the twitch client
// so it can be used like this:
// let client = require('lidl_core/client.js')
// and then you can do stuff
const TwitchJS  = require('twitch-js').default;

// Define configuration options:
let opts = {
		username: process.env.BOT_USERNAME,
		token:  process.env.OAUTH_TOKEN, 
		onAuthenticationFailure: function(){
			console.log("Can't connect to IRC !");
			process.exit(2);
	// try to refresh the token here (check the dock from twitch-js-docs/blob/master/docs/authentication.md
		},

};

// Accepting both token with and without oauth:
if (opts.token.substr(0,6) !== 'oauth:'){
	opts.token = 'oauth:' + opts.token;
}






const {api,chat,chatConstant} = new TwitchJS(opts);

// Testing if credentials are provided:
if (opts.username === undefined || opts.token === undefined){
	console.log("Error: authentication credentials weren't found. Please set the environnement variable correctly.");
	process.exit(1);
}
console.log("attempting to connect with: " + opts.token);
chat.connect().then(function(){
	console.info("Connection successful !");

})

module.exports = {
	api: api,
	chat: chat,
	chatConstant: chatConstant
}
