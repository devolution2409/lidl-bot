require('console-info');
require('console-warn');
require('console-success');
require('console-error');

// declaring know commands objects
//let knownCommands = {}
let syncCommands = {};
let asyncCommands = {};

// won't show in help
let hiddenSyncCommands = {};

//declaring an array containing the users cooling down
let usersCD = []; // forsenCD

// Valid commands start with:
let commandPrefix = '!';

//we need to fetch the config
//let config = require('./config.js');
let botAdmins = [];
let channels = [];

//fetching the client
let client = require('./client.js');
const glob = require('glob');
const path = require('path');
// is client connected here?
// We use promise to only execute the following if client is connected
client.chat.connect().then(function(){
		//if we managed to connect to twitch, we try to connec to to mongo
		// OR we only load the modules that  dont need mongo Thonk


		// getting the async commands 
		reloadAsyncCommands();		


		//adding help command:
		syncCommands['help'] =  showAvailableCommands;		
		//adding reload command:
		hiddenSyncCommands['reload'] = reload;
		//adding sudokuu
		hiddenSyncCommands['sudoku'] = reboot;
		// state 1 = config is fetched, 0 it's not yet fetched
		


		//bot will log to stdout any messages sent even if we dont watch them
		client.chat.on('PRIVMSG', onMessageHandler);
		// we can always specialize that later if needed
		// anyway, the obj.command var will contain WHISPER or PRIVMSG
		client.chat.on('WHISPER',  onMessageHandler);


		//fetching config, including bot admins and channels:
		reloadConfig();

	
});

function onMessageHandler(obj){
	let util = require('./util.js');
	if (obj.isSelf) { return } // Ignore messages from the bot	
	// get the msg
	const msg = obj.message;

	// This isn't a command since it has no prefix:
	if (msg.substr(0, 1) !== commandPrefix) {
		return;
	}	
	// if the user is still in cooldown, we return
	if (usersCD.indexOf(obj.username) !== -1){
		// we send a PM
		return;
	}


	// get the channel
	const chan = obj.channel;
	// Split the message into individual words:
	const parse = msg.slice(1).split(' ');

	// The command name is the first (0th) one:
	const commandName = parse[0];
	// The rest (if any) are the parameters:
	const params = parse.splice(1);

	let command;

	if (commandName in syncCommands) {
		command = syncCommands[commandName];
	} else if (commandName in asyncCommands) {
		command = asyncCommands[commandName];
	} else if (commandName in hiddenSyncCommands){
		if (botAdmins.includes(obj.username)){
			command = hiddenSyncCommands[commandName];
		} else {
			console.warn(`* Ignored command ${commandName} from ${obj.username}: not a sudoer`);
			util.sendMessage(chan, obj.username + " is not in the sudoers file. This incident will be reported forsenSheffy");
			return;
		}
	}


	if (command != null){ // null == undefined ppHop

		// Then call the command with parameters:
		console.info(`* Executing ${commandName} command for ${obj.username}`);
		command(chan, obj, params,commandName);
		console.success(`* Executed ${commandName} command for ${obj.username}`);
		// Add the user to the usersCD array, only if not mod tho
		if ( obj.tags.mod === '0' && (('#' + obj.username)  !== obj.channel)){
			usersCD.push(obj.username);
			setTimeout( ()  => { 
					let temp = usersCD.filter( (value,index,arr) => { return value !== obj.username    }  );
					usersCD = temp;
			
				 }, process.env.BOT_COMMANDS_COOLDOWN || 10000  ); 
		}

	} else {
		console.warn(`* Unknown command ${commandName} from ${obj.username}`);
	}
}


function showAvailableCommands(target,obj,params,commandName){
	let util = require('./util.js');

	let msg = "Cooldown per user: " + (process.env.BOT_COMMANDS_COOLDOWN/1000 || 10000/1000)   + " seconds. Available commands are: "
	for (var command in syncCommands){
		msg = msg + "!" + command + " ";
	}
	for (var command in asyncCommands){
		msg = msg + "!" + command + " ";

	}	
	util.sendMessage(target,  msg);


}
function reloadSyncCommands(target,obj,params,commandName){
	//invalidating previously stored commands
	syncCommands = {};
	//requiring every file in the lidl_modules folder
	console.info('[LIDLBot] \t Importing SYNC modules:');
	//glob workdir is the workdir from docker, so . i think FeelsWeirdMan
	glob.sync('./lidl_modules/sync/*.js').forEach( function(file){
	   	var module = require(path.resolve(file));	
	   	console.info(`[LIDLBot]\tImporting SYNC module ${file} !`);
		// else it's a regular module
		for (var funcName in module){
			syncCommands[funcName] = module[funcName];
			console.success(`[LIDLBot]\t\tSuccessfully registered ${funcName} command !`);
		}
						
		console.success(`[LIDLBot]\tSuccessfully imported ${file} module !`);
						
	});
}


function reloadAsyncCommands(target,obj,params,commandName){
		asyncCommands = {};
		let util = require('./util.js');
		let driver = require('./MongoDriver.js');
		console.info('[LIDLBot] \t Importing ASYNC modules:');
		glob.sync('./lidl_modules/async/*.js').forEach( function(file){
						// need to invalidate cache afterwards, else it will just import the same cached variables

					   	var module = require(path.resolve(file));
						// if this module is a class (probably an ASYNC one) 
						// and has an initialized property, and it is a promise:
					        module.init();	
						if (module.initialized !== undefined && Promise.resolve(module.initialized) == module.initialized){
					   		console.info(`[LIDLBot]\tImporting ASYNC module  ${file} !`);
								
						
							module.initialized.then( (data) => {
								for (var funcName in data){
									asyncCommands[funcName] = data[funcName];
									console.success(`[LIDLBot]\t\tSuccessfully registered ${funcName} command !`);
								} 
							});
							module.initialized.catch( (err) => { console.log (err)});
							
	
						} 
						
						console.success(`[LIDLBot]\tSuccessfully imported ${file} module !`);
						
		});



}

function reload(target,obj,params,commandName){
	let util = require('./util.js');
	if (params.length && params.join(' ').trim() !== '' ){
                if (params.includes('commands')){
			reloadSyncCommands();
                        reloadAsyncCommands();
                }
		if (params.includes('config')){
                        reloadConfig();
                }
        }else{
		util.sendMessage(target, "@" + obj.username + ", usage is !reload commands or !reload config");
	}
}


function reboot(target,obj,params,commandsName){
	let util = require ('./util.js');
	let msg = "Committing sudoku.. docker will reboot me BlessRNG";
	util.sendMessage(target,msg);
	setTimeout( ()=> {process.exit(2)}, 1000);
}

function reloadConfig(target,obj,params,commandName){
	console.warn('[LIDLBot]\tReloading config..');
	//unvalidating previous config:
	botAdmins = [];
	channels = [];

	let module = require('./config.js');
	module.GetConfig();
	// if the module.config object  is a promise we are good to go
	if (module.config !== undefined && Promise.resolve(module.config) == module.config){
			module.config.then( (data) => {
				botAdmins = data.botAdmins;
				channels = data.channels;	
				// we need to re-joins the channels, they might have changed
				joinChannels();	
				console.success('[LIDLBot]\tDone reloading config..');			
			}); // end then() 
			
			// no need for catch block because config.js will process.exit on error	
	}			
	

}

function joinChannels(){
	channels.forEach( (channel) => {
		if (channel.hasOwnProperty('name')){
			client.chat.join(channel['name']);
		}	
	});
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
