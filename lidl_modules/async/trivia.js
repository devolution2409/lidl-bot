//requiring the driver
var driver = require('../../lidl_core/MongoDriver.js');
require('console-info');
require('console-warn');
require('console-error');
require('console-success');
let util = require('../../lidl_core/util.js');
let mongoose = require('mongoose');
let client = require('../../lidl_core/client.js');
let triviaModel = require('../../lidl_core/models/trivia.js');

//let trivia = require('../../lidl_ccore/models/trivia.js');

class commandsWrapper{
	constructor(){
	}
	// needed so the commands can be reloaded
	init(){
		this.initialized  = new Promise( (resolve,reject) => {

				var promise = () => { 
				let data = {
trivia: trivia
}
resolve(data);
};


// if the connection is ready, we don't need to use the once('connected') event:			
if (driver.GetConnection().readyState === 1){ //0: disconnected 1: connected 2: connecting 3: disconnecting				
promise();
} else {
driver.GetConnection().once('connected', () =>{
		promise();			
		});
}
});
}

}

//if sender = gazatu2 && msg = trivia ended nam ||!lidl triviaCheat stop
// stop cheatt

function triviaCheat(target,obj,params,commandName){
	if (params.length && params.join(' ').trim() !== '' ){
		if (params.includes('start')){
			client.chat.on('PRIVMSG', forsenCDHandler);
		}
		if (params.includes('stop')){
			client.chat.removeListener('PRIVMSG', forsenCDHandler);
		}
	}else{
		util.sendMessage(target, "@" + obj.username + ", usage is !reload commands or !reload config");
	}



	//bot will log to stdout any messages sent even if we dont watch them


}


function trivia(target,obj,params,commandName){

	if (params.length && params.join(' ').trim() !== '' ){
		if (params[0].includes('start')){

			let regex = new RegExp (/start ([a-z]+) (\d+)/, 'gi');
			let temp = params.join(' ');
			let match = regex.exec(temp);
			let number = 50;
			let category = '';
			// if we have start category number
			if (match != null){ // && match[1] != undefined && match[2] != undefined){
				//console.log("start category number")
				category = match[1];
				number = ( match[2] <= number ) ? match[2] : number;
			} else { 
				regex = new RegExp (/start (\d+) ([a-z]+)/,'gi');
				let match = regex.exec(temp);
				// if we have start number category
				if (match != null){ //  newMatch[1] != undefined && newMatch[2] != undefined){
					//console.log("start number category");
					category = match[2];
					number = ( match[1] <= number ) ? match[1] : number;
				}else{
					// this one will match even if we have both param, we need to test for both before
					let regex = new RegExp(/start ([a-z]+)/,'i');
					match = regex.exec(temp);
					// if  [1] == undefined && [2] !== undefined => number
					if (match != null){
						console.log("only category")
						category = match[1];
					} else {
						regex = new RegExp (/start (\d+)/, 'i');
						match = regex.exec(temp);
						if (match !=null){
							console.log("only number");
							number = ( match[1] <= number ) ? match[1] : number;
						}
					} 
					// else they are either both defined or none of them is defined forsenT



				}

				}

				/*

				 */
				//let options = regexBoth.exec(params.join(' '));
				//startTrivia(target,3);
			
				console.log("category: " + category  + " number: " + number);
				startTrivia(target,number,category);
			}// end if start        

			//client.chat.on('PRIVMSG', forsenCDHandler);

			else if (params.includes('stop')){
				//	client.chat.removeListener('PRIVMSG', forsenCDHandler);
			}
			}else{
				util.sendMessage(target, "@" + obj.username + "!trivia start (category numberOfQuestions).");
			}



			//bot will log to stdout any messages sent even if we dont watch them
}

async function startTrivia(target, max){
	let timeToAnswer = 20000;
	let response;
	// Fetch X questions & response
	let query = triviaModel.find({},'-_id').lean().exec();

	query.then( (data) => { 
					//console.log(data) 	

					//shuffling the data using Fisher-Yate

		response = util.shuffle(data);
					//console.log(response);




					// Attach the listener that will listen to the answer (variable function)
					// while i < max


					// have to declare anonymous async function else we can't use AWAIT
		(async () =>{ 	
			 for (let i = 0; i < max; i++){
				await util.sleep(3000);	 
				 let promise = () => { 
					 return new Promise ( (resolve, reject) => {
						let tempC = response[i]['category:'];
						tempC = (tempC == undefined) ? response[i].category : tempC;
							 
						util.sendMessage(target,(i+1) + "/" + max + ". Category: " + response[i].category + "; "  +   response[i].question);			



						 let listener = ( (obj) => {
							 // if channel != the one running this trivia, we return
							if (obj.channel !== target){
								 return;
							 }
							if (obj.message.toLowerCase().includes(response[i].response.toLowerCase())){
									 resolve(obj);
							 };				


						 }); 
							 // register this listenerr
							 client.chat.on('PRIVMSG',listener);
							 // adding help after maxtime/2
							let helper = setTimeout( () => {
								let numberOfSpaces = response[i].response.split(' ').length-1 || 0;
								util.sendMessage(target,"Answer has: " + response[i].response.length + " characters and " + numberOfSpaces  + " spaces" );
							},  timeToAnswer/2);

							 // after 5 sec, reject the promise and unregister the listener			
							 setTimeout( () => {
									 client.chat.removeListener('PRIVMSG',listener);
									clearTimeout(helper); 
									reject();
									 }, timeToAnswer);
							 // TODO: add a thing in config for time to answer trivia
					 	});
					 } // ent let promise
						

					 await promise()
						 // user found the answer
						 .then( async (obj) => {
								 util.sendMessage(target,"@" + obj.username + " is right, the answer was: '" + response[i].response + "'");
								 //		await sleep(3000);
								 })
					 // user didn't find it PepeLaugh
					 .catch( async (error) => { 
							 util.sendMessage(target, "lol u guys suck the answer was '" + response[i].response + "'");
							 //		await sleep(3000);
							 });



					 }
					})();

					// Promise to send the question and wait for the answer??? WutFaceW
					// create listener in promise, wait for answer and destroy it? forsenE

					//	client.chat.on('PRIVMSG',listener); 
					// Send the question
					//console.log(response[0]);


					// Remove the question from the array
					// Wait for X seconds elapser, or answer
					// Repeat

					// when done, remove the listener and send the scorers

			});// end exec.then();		
		}

		function triviaLogic(){
			//??
		} 




		function forsenCDHandler(){
			console.log("benis");

		}










		module.exports = new commandsWrapper();
