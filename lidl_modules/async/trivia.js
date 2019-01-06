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
                if (params.includes('start')){
				startTrivia(target,3);
		}        
	
		//client.chat.on('PRIVMSG', forsenCDHandler);
                
                else if (params.includes('stop')){
			client.chat.removeListener('PRIVMSG', forsenCDHandler);
                }
        }else{
                util.sendMessage(target, "@" + obj.username + ", usage is !reload commands or !reload config");
        }



	//bot will log to stdout any messages sent even if we dont watch them
}


async function startTrivia(target, max){
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
		// declaring this so the bot doesn't spam
	/*	let sleep = async  ((ms = 0) => {
			return new Promise ( r => setTimeout(r,ms));

		});
*/
		let promise = () => { 
			return new Promise ( (resolve, reject) => {
			util.sendMessage(target,response[i].question);			

			

			let listener = ( (obj) => {
				// if channel != the one running this trivia, we return
				if (obj.channel !== target){
					return;
				}
				
				
	
//				console.log (response[i].response);
				// if channel != thtis one we return

				if (obj.message.toLowerCase().includes(response[i].response.toLowerCase())){
					resolve(obj);
				};				
				

			}); 
			// register this listenerr
			client.chat.on('PRIVMSG',listener);
		
			// after 5 sec, reject the promise and unregister the listener			
			setTimeout( () => {
				client.chat.removeListener('PRIVMSG',listener);
				reject();
			 }, 10000);
// TODO: add a thing in config for time to answer trivia
			});
		}
		await promise()
			// user found the answer
			.then( (obj) => {
				util.sendMessage(target,"@" + obj.username + " is right, the answer was: '" + response[i].response + "'");
		//		await sleep(3000);
			})
			// user didn't find it PepeLaugh
			.catch( (error) => { 
				util.sendMessage(target, "lol u guys suck the answer was '" + response[i].response + "'");
		//		await sleep(3000);
			});



		}
	})();
	
	// Promise to send the question and wait for the answer??? WutFaceW
	// create listener in promise, wait for answer and destroy it? forsenE

//	client.chat.on('PRIVMSG',listener); 
	// Send the question
	console.log(response[0]);


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
/*
function fetchAnswer(channel,context,params,commandName){
	console.log("command name:" + commandName);
	console.log('params:' + params);

	let mongoose = require('mongoose');
	//	let Schema = mongoose.Schema;
	let schema = mongoose.Schema({ name: String, response: Object});	
	// model should already exist:
	let model = mongoose.model('command') ||  mongoose.model('command', schema);
	//using lean() to get plain js object	
	model.findOne({name: commandName },'-_id modOnly response').lean().exec( (err,response) => {
			if (err){
			console.log(err) 
			return;
			} else {
			let msg = "wtf? I should be able to run this command DansGame";

			let answers = [];

			// test if the command is modOnly..
			if ( (response.modOnly === '1')    && (context.tags.mod === '0' && (('#' + context.username)  !== context.channel ))) {
			msg = 'Nice try @' + context.username + ' SoBayed';
			util.sendMessage(channel,  msg);
			return;

			}

			// if the response is a string, it's ok
			// else it's an object and we need to go deeper
			if (typeof(response.response) === 'string'){
			msg = response.response;		

			} else {
				//it is an object => subcommand
				// define generic parser that pull a random fact, regardless of parameters
				let parse  = (obj) => {
					for (var k in obj){
						if (typeof(obj[k]) == 'object' && obj[k] !== null){
							// even arrays return object, we need to test for arrays of objects  before sending it to parse
							// if it is an array, we need to test if it's an array of obj or not
							// if array of obj, we need to parse them right?
							if (Array.isArray(obj[k])){
								obj[k].forEach ( (value) => { 
										if (typeof(value) == 'object'){
										parse(value);
										} else if (k !== 'alias') { // its a string, but it mustn't be 'alias'
										answers.push(value);
										}
										});	
							} else{
								parse(obj);
							}		

						}
					}								

				};


				// if we get parameter, we need to use a specific parser to find a fact
				// if the parameters were retarded, we send a random fact		
				if (params && params.join(' ') !== ''){
					//specific parser
					console.log (params)
						params.forEach( (test) => {console.log(test)});
					let  specificParse  = (obj) => {
						for (var k in obj){
							if (typeof(obj[k]) == 'object' && obj[k] !== null){
								// even arrays return object, we need to test for arrays of objects  before sending it to parse
								// if it is an array, we need to test if it's an array of obj or not
								// if array of obj, we need to parse them right?
								if (Array.isArray(obj[k])){
									obj[k].forEach ( (value) => { 
											if (typeof(value) == 'object'){
											// we need to go deeper only if the object.alias contains parameter 
											if (value.hasOwnProperty('alias')){
											console.log(value.alias);
											let temp = [];
											params.forEach( (element) => { element = temp.push(element.toLowerCase());  } );	
											//https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript
											if (value.alias.some( r => temp.indexOf(r) !== -1)){
											answers = value.res;
											}

											}

											} 
											});	
								} else{
									specificParse(obj);
								}		

							}
						}								

					};
					specificParse(response);
					// if after parsing, the answers array is empty, we need to parse normaly
					// there's probably a way to refactor this but eShrug
					if (answers.length === 0){
						parse(response);	
					}

				} else {
					//defining our parser function object	
					parse(response);
				}
				//now that the json is parsed we need to take a random element
				msg = answers[Math.floor(Math.random()*answers.length)];

			}


			// Send it back to the correct place:
			util.sendMessage(channel,  msg);


			}
	}); //end exec

} // end functio
*/
