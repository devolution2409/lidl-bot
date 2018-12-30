module.exports = {
echo: echo
}

let util = require('../../lidl_core/util.js');

// Function called when the "echo" command is issued:
function echo (target, context, params) {
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
			util.sendWhisper('devoluti0n',"hi again");	
		} else { // Nothing to echo
			console.log(`* Nothing to echo`);
		}
	} else if (context.command === 'WHISPER'){
		if (params.length) {
			// Join the params into a string:
			let msg = params.join(' ');
			util.sendWhisper(context.username,msg);
		}
	}
}


