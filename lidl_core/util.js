module.exports = {
sendMessage: sendMessage,
	     sendWhisper: sendWhisper
}

let client = require('../lidl_core/client.js');
// Helper function to send the correct type of message:
function sendMessage (target,message) {
	// twitch seems to cut message that are over 500 chars:
	
	let timesToCut = (message.length / 500);
	let messages = [];
	if (timesToCut > 0){
		console.log("gachipls:" + timesToCut);
		for (var i = 0; i < Math.floor(timesToCut) + 1 ; i++){
			messages.push( message.substr(i*500, i*500+500) );		
		}
	}else{
		messages.push(message);
	}

	
	i = 0;
	messages.forEach ( (element) => {
		setTimeout( () => { client.chat.say(target, element) }, i + 500);
		i++;
		console.log("gneee");
	});
}


//this doesn't work forsenT
function sendWhisper(target, message){
	client.chat.whisper(target,message);	
}
