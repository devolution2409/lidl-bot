require('console-info');
require('console-warn');
require('console-success');
require('console-error');

// declaring know commands objects
let knownCommands = {}
// Valid commands start with:
let commandPrefix = '!'

//fetching the client
let client = require('./client.js');

// is client connected here?
// We use promise to only execute the following if client is connected
client.chat.connect().then(function(){
		//if we managed to connect to twitch, we try to connec to to mongo
		// OR we only load the modules that  dont need mongo Thonk

		// we managed to connnect both to twich AND to the mongoDB:
		// we can load the modules
		//requiring every file in the lidl_modules folder
		const glob = require('glob');
		const path = require('path');
		glob.sync('./lidl_modules/*.js').forEach( function(file){
					   	var module = require(path.resolve(file));
						
						// if this module is a class (probably an ASYNC one) 
						// and has an initialized property, and it is a promise:
						if (module.initialized !== undefined && Promise.resolve(module.initialized) == module.initialized){
					   		console.info(`[LIDLBot]\tImporting ASYNC module: ${file} !`);
								
						
							module.initialized.then( (data) => {
								for (var funcName in data){
									knownCommands[funcName] = data[funcName];
									console.success(`[LIDLBot]\t\tSuccessfully registered ${funcName} command !`);
								} 
							})
							
	
						}else{ 
					   	console.info(`[LIDLBot]\tImporting SYNC module ${file} !`);
						// else it's a regular module
							for (var funcName in module){
								knownCommands[funcName] = module[funcName];
								console.success(`[LIDLBot]\t\tSuccessfully registered ${funcName} command !`);
							}
						
						}
						console.success(`[LIDLBot]\tSuccessfully imported ${file} module !`);
						
		});

		

		//bot will log to stdout any messages sent even if we dont watch them
		client.chat.join('devoluti0n');

		client.chat.on('PRIVMSG', onMessageHandler);
		// we can always specialize that later if needed
		// anyway, the obj.command var will contain WHISPER or PRIVMSG
		client.chat.on('WHISPER',  onMessageHandler);


});

function onMessageHandler(obj){
	if (obj.isSelf) { return } // Ignore messages from the bot	
	// get the msg
	const msg = obj.message;

	// This isn't a command since it has no prefix:
	if (msg.substr(0, 1) !== commandPrefix) {
		return
	}	


	// get the channel
	const chan = obj.channel;
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
		console.info(`* Executing ${commandName} command for ${obj.username}`)

		command(chan, obj, params,commandName);
		console.success(`* Executed ${commandName} command for ${obj.username}`)
	} else {
		console.warn(`* Unknown command ${commandName} from ${obj.username}`)
	}
}

/*dd





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

 */
