//requiring the driver
var driver = require('../lidl_core/MongoDriver.js');
require('console-info');
require('console-warn');
require('console-error');
require('console-success');
let util = require('../lidl_core/util.js');

class commandsWrapper{
	constructor(){

		this.initialized  = new Promise( (resolve,reject) => {
				//		let that = this; // have to do else the nested promises eventually lose context pajaC
				driver.GetConnection().once('connected', () =>{
						let mongoose = require('mongoose');
						//	let Schema = mongoose.Schema;
						const commandSchema = mongoose.Schema({ name: String, response: Object});	
						const commandModel = mongoose.model('command', commandSchema)

						// selecting only the command name, but unfortunately we also fetch the unique id, look into that later
						// using lean() do get it as plain json object and not mongoose document object
						commandModel.find({},'name').lean().exec( (err,command) => {
								if (err){
								reject(err);

								}else{
								let data  = {};									

								command.forEach(function(thing) {
										data[thing.name] = simpleCommand;
										});

								resolve(data);
								}
								//		module.exports.commands = knownCommands;
								})
				});
		});
	}

}
module.exports = new commandsWrapper();

function simpleCommand(channel,context,params,commandName){
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

} // end function
