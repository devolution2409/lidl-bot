module.exports = {
	echo: echo
}

let util = require('../lidl_core/util.js');

// Function called when the "echo" command is issued:
function echo (target, context, params) {
        // If there's something to echo:
        if (params.length) {
                // Join the params into a string:
                var msg = params.join(' ')
                // Interrupt attempted slash and dot commands:
                if (msg.charAt(0) == '/' || msg.charAt(0) == '.' || context.username !== process.env.ROOT_TWITCH_USERNAME) {
                        msg = 'Nice try @' + context.username + ' SoBayed'
                }
                // Send it back to the correct place:
                util.sendMessage(target, context, msg);
        } else { // Nothing to echo
                console.log(`* Nothing to echo`);
        }
}


