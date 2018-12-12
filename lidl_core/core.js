// declaring know commands objects
let knownCommands = {}
//requiring every file in the lidl_modules folder
const glob = require('glob');
const path = require('path');
glob.sync('./lidl_modules/*.js').forEach( function(file){
	console.log(`\nImporting ${file} module !`);
	var LUL = require(path.resolve(file));
	//it works PagChomp
	for (var funcName in LUL){
		knownCommands[funcName] = LUL[funcName];

	}
});

// Valid commands start with:
let commandPrefix = '!'

//fetching the client
let client = require('./client.js');

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
		console.log(`* Executing ${commandName} command for ${context.username}`)

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
