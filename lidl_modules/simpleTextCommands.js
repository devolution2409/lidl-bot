//requiring the driver
var driver = require('../lidl_core/MongoDriver.js');
require('console-info');
require('console-warn');
require('console-error');
require('console-success');



let knownCommands = [];
driver.GetConnection().once('connected', function(){
		let mongoose = require('mongoose');
		//	let Schema = mongoose.Schema;
		const commandSchema = mongoose.Schema({ name: String, response: Object});	

		const commandModel = mongoose.model('commands', commandSchema)


		// selecting only the command name, but unfortunately we also fetch the unique id, look into that later
		// using lean() do get it as plain json object and not mongoose document object
		commandModel.find({},'name').lean().exec( function(err,commands){
				console.log("TRihard: ")
				//	console.log(docs);
				commands.forEach(function(thing) {
						console.log(thing.name);
						knownCommands.push(thing.name);			
						});

				});	
});

	


//console.log(cursor);

/*
   let collection = driver.collection



   module.exports = {
test: test
}

let util = require('../lidl_core/util.js');

// Function called when the "echo" command is issued:
function test (target, context, params) {
if (context.command === 'PRIVMSG'){
// If there's something to echo:
if (params.length) {
// Join the params into a string:
let msg = params.join(' ');
// Interrupt attempted slash and dot commands:
if (msg.charAt(0) == '/' || msg.charAt(0) == '.' || ( context.tags.mod === '0' && (('#' + context.username)  !== context.channel ))) {
msg = 'Nice try @' + context.username + ' SoBayed';
}
// Send it back to the correct place:
util.sendMessage(target,  msg);
} else { // Nothing to echo
console.log(`* Nothing to echo`);
}
}
}


*/
module.exports = { 
	listOfCommands: knownCommands

}

