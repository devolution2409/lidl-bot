'use strict'
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
			console.log(i);
		}
	}else{
		messages.push(message);
	}

	// send the first one immediately
	//client.chat.say(target, messages[0] );
	/*for (i = 1; i < messages.length; i++){
		console.log("gnééé:"  +   messages[i]);
		setTimeout( () => { client.chat.say(target, messages[i] ) }, i*500);
	}*/

	i = 0;
	messages.forEach( (element) => {
		setTimeout(() => {client.chat.say(target, element)},i * 500)
		i++;
	});
	
}


//this doesn't work forsenT
function sendWhisper(target, message){
	client.chat.whisper(target,message);	
}
