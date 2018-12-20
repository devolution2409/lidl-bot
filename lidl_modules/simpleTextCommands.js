//requiring the driver
var driver = require('../lidl_core/MongoDriver.js');
require('console-info');
require('console-warn');
require('console-error');
require('console-success');

driver.GetConnection().once('connected', function(){
//	let mongoose = require('mongoose');
//	let Schema = mongoose.Schema;
	
	//switchin to use the lidlbot db if it's not being used
	if (driver.GetConnection().name !== process.env.MONGO_DB_NAME){
		console.info('Switching to: ' + process.env.MONGO_DB_NAME + ' database');	
		driver.connection = driver.connection.useDb(process.env.MONGO_DB_NAME);
	}
	
	console.log('----------------- vi should be in the right database now');
	const cursor = driver.GetConnection().collection('commands').find({});
	//console.log(cursor);
});

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




/*
module.exports{
	function:,
	listOfCommands:

}
*/
