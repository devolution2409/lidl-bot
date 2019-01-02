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
		this.getConfig();
		this.state = 0; // 0: not ready 1: ready 2: error
	}
	// needed so the commands can be reloaded
	getConfig(){
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
		this.promise  = new Promise( (resolve,reject) => {
				var promise = () => { 
				model.find({},'-_id').lean().exec( (err,data) => {
						if (err){
						this.state = 2; // error
						reject(err);
						console.error(err);
						process.exit(3);		
						}else{
							data.forEach( (thing) =>{
								//console.log(Object.keys(thing));
								if (thing.hasOwnProperty('botAdmins')){
								//	console.log('HANDSUP');
									// performances monkaS :point_right: :chart_with_upwards_trend:
									Array.prototype.push.apply(this.botAdmins, thing['botAdmins']);
								//	console.log(this.botAdmins);
								}
								if (thing.hasOwnProperty('channel')){
								//	Array.prototype.push.apply(this.channels, thing['channel']);
									this.channels.push(thing['channel']);
								//	console.log(this.channels);
								}
								
							});
							this.state = 1;
							resolve();
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
