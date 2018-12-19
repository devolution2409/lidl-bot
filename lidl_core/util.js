module.exports = {
sendMessage: sendMessage,
	     sendWhisper: sendWhisper
}

let client = require('../lidl_core/client.js');
// Helper function to send the correct type of message:
function sendMessage (target,message) {
	client.chat.say(target, message);
}


//this doesn't work forsenT
function sendWhisper(target, message){
	client.chat.whisper(target,message);	
}
