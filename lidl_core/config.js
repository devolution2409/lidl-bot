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
		this.channelsCooldowns = [];
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
										
									// array is basically blacklistedCommands[pajlada] = ['blabla', 'otthercommannd'];
									this.blacklistedCommands[thing['channel'].name] = thing['channel'].blacklistedCommands; 
									// array is channelsCooldown[pajlada] = 4500
									this.channelsCooldowns[thing['channel'].name] = { 
										channel: thing['channel'].botCooldown || process.env.BOT_COMMANDS_CHANNEL_DEFAULT_COOLDOWN,
										user: thing['channel'].userCooldown || process.env.BOT_COMMANDS_USER_DEFAULT_COOLDOWN
									}

								}
								
							});
							let config = {
								botAdmins: this.botAdmins,
								channels: this.channels,
								blacklistedCommands: this.blacklistedCommands,
								cooldowns: this.channelsCooldown					
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
