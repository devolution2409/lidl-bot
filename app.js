const tmi = require('tmi.js');

//requiring every file in the lidl_modules folder
/*const glob = require('glob');
const path = require('path');
glob.sync('./lidl_modules/*.js').forEach( function(file){
	console.log(`\nImporting ${file} module !`);
	require(path.resolve(file));
});
*/

require('./lidl_core/core.js');

/*

// Valid commands start with:
let commandPrefix = '!'
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

// These are the commands the bot knows (defined below):
let knownCommands = { echo, datguy }

function datguy (target,context){
	sendMessage(target,context,"SPAGHETI CODE LOOOOL 4HEad");
}

// Function called when the "echo" command is issued:
function echo (target, context, params) {
	// If there's something to echo:
	if (params.length) {
		// Join the params into a string:
		var msg = params.join(' ')
		// Interrupt attempted slash and dot commands:
		if (msg.charAt(0) == '/' || msg.charAt(0) == '.') {
			msg = 'Nice try...'
		}
		// Send it back to the correct place:
		sendMessage(target, context, msg)
	} else { // Nothing to echo
		console.log(`* Nothing to echo`)
	}
}


// Helper function to send the correct type of message:
function sendMessage (target, context, message) {
	if (context['message-type'] === 'whisper') {
		client.whisper(target, message)
	} else {
		client.say(target, message)
	}
}

// Create a client with our options:
let client = new tmi.client(opts)

// Register our event handlers (defined below):
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)

// Connect to Twitch:
client.connect()

// Called every time a message comes in:
function onMessageHandler (target, context, msg, self) {
	if (self) { return } // Ignore messages from the bot

	// This isn't a command since it has no prefix:
	if (msg.substr(0, 1) !== commandPrefix) {
		console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`)
		return
	}

	// Split the message into individual words:
	const parse = msg.slice(1).split(' ')
	// The command name is the first (0th) one:
	const commandName = parse[0]
	// The rest (if any) are the parameters:
	const params = parse.splice(1)

	// If the command is known, let's execute it:
	if (commandName in knownCommands) {
		// Retrieve the function by its name:
		const command = knownCommands[commandName]
		// Then call the command with parameters:
		command(target, context, params)
		console.log(`* Executed ${commandName} command for ${context.username}`)
	} else {
		console.log(`* Unknown command ${commandName} from ${context.username}`)
	}
}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler (addr, port) {
	console.log(`* Connected to ${addr}:${port}`)
	console.log(knownCommands);

}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
	console.log(`Disconnected: ${reason}`)
	process.exit(1)
}


//catching sigint to be able to close the bot with ctrl + c from docker
process.on('SIGINT', function(){
	console.log('\nStopping gracefully..');
	process.exit(0);
});

*/
