//requiring the driver
var driver = require('./MongoDriver.js');
require('console-info');
require('console-warn');
require('console-error');
require('console-success');
let util = require('./util.js');
let mongoose = require('mongoose');

class commandsWrapper{
	constructor(){
		this.botAdmins = [];
		this.channels = [];
		//this.GetConfig();
		this.blacklistedCommands = [];
	}
	// needed so the commands can be reloaded
	GetConfig(){
		let schema = mongoose.Schema({
				"botAdmins": Object,
				"channel": Object},{collection:'config'});
/*					{
						"enabled": Boolean,
						"name": String,
						"userTimeout": Number,
						"botTimeout": Number,
						"blacklistedCommands": [String]
						}
					]
				});	
*/

//		let schema = mongoose.Schema({channels : Object },{collection: 'options'});



		let model
			try {
				model = mongoose.model('config');

			} catch (error){
				model = mongoose.model('config',schema);
			}
		this.config  = new Promise( (resolve,reject) => {
				var promise = () => { 
				model.find({},'-_id').lean().exec( (err,data) => {
						if (err){
						reject(err);
						console.error(err);
						process.exit(3);		
						}else{
							data.forEach( (thing) =>{
								//console.log(Object.keys(thing));
								if (thing.hasOwnProperty('botAdmins')){
									Array.prototype.push.apply(this.botAdmins, thing['botAdmins']);
								}
								if (thing.hasOwnProperty('channel')){
									this.channels.push(thing['channel']);
									// if hasownpropertyblacklistedcommands ?

									this.blacklistedCommands[thing['channel'].name] = thing['channel'].blacklistedCommands; 
								}
								
							});
							let config = {
								botAdmins: this.botAdmins,
								channels: this.channels,
								blacklistedCommands: this.blacklistedCommands
							};
							resolve(config);
						}
	
						});
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
module.exports = new commandsWrapper();
