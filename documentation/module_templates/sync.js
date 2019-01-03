/*
 * sync modules are module that doesn't require any database interaction
 * They are hardcoded modules, and will require a !reboot of the bot if you want to change them.
 *
 *
 * sync modules belong in lidl_modules/sync/
 *
 * 
 *
 * They are sourced by the bot during startup, and can't be resourced afterwards
 * core.js will look for any function in module.exports 
 *
 *
 */

module.exports = {
	nameOfTheCommandInTwitch: function1,
	nameOfTheOtherCommandInTwitch: function2,
// so on and so forth
}

// Commands are called this way by core.js:
// command(chan, obj, params,commandName);


function1(chan,obj,params,commandName){
	// chan is the channel the command is ran on
	// obj 
	// params are the parameters the command is run with for instance !fact uganda, uganda is the parameter
	// commandname is the name of the command, in the case you need it (simpleTextCommand.js uses it)

}

function2(...){

}


