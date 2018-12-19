require('console-error');
require('console-info');
require('console-success');

var mongoose=require('mongoose');

let username = process.env.MONGO_DB_USER;
let password = process.env.MONGO_DB_PASSWORD;
let host = process.env.MONGO_DB_HOST;
let dbname = process.env.MONGO_DB_NAME;
let url = 'mongodb://' + username + ':' + password + '@' + host + ':27017' ;///admin';


let options = { 
useNewUrlParser: true,

};

let connection = mongoose.connection;

let attempts = 0;


// Function to connect, and force it to retry before MAX_ATTEMPTS
function connectAndRetry(){
	if (attempts < 60){
		console.info("[LIDLBot]\tAttempting to connect to MongoloidDB");
		mongoose.connect(url,options);

		// setting time out to occur once it fails only if the number of unsuccessful attempt hasn't been reached

		connection.once('error', function(error) {
				attempts++; 
				console.error('[LIDLBot]\t' + error);
				setTimeout(connectAndRetry,1000);
				});
	} else{
		console.warn("[LIDLBot}\tCouldn't connect to MongoloidDB");
	}

}

// once we are in, we reset attempts.
connection.once('open', function() {
		attempts = 0 ;			
		console.success("[LIDLBot]\t Successfully connected to MongoloiDB");
		});

connectAndRetry();



/*
   class MongoDriver{
   constructor(){
   if (process.env.MONGO_DB_USER === undefined || process.env.MONGO_DB_PASSWORD === undefined || process.env.MONGO_DB_HOST === undefined || process.env.MONGO_DB_NAME === undefined ){
   console.error("[LIDLBOT]\tMongoDB environnement variables aen't defined properly. The bot won't be able to use stored commands, or any function that requires a database.");
   } else {


   this.username = process.env.MONGO_DB_USER;
   this.password = process.env.MONGO_DB_PASSWORD;
   this.host = process.env.MONGO_DB_HOST;
   this.dbname = process.env.MONGO_DB_NAME;

   this.MongoClient = require('mongodb').MongoClient;
   this.url = 'mongodb://' + this.username + ':' + this.password + '@' + this.host + ':27017/' + this.dbname;
   }

   console.log('\n\n\n\n' +  this.url);
   while(true){	
   this.client = this.MongoClient.connect(this.url, {
useNewUrlParser: true,
reconnectTries: 60,
reconnectInterval: 1000
})
.catch( (error) => { console.error('[LIDLBot]\t' + error)});
//			.then( (db) => { this.db = db; console.succes('[LIDLBot]\t Successfully connected to db!')});
}

} //end constructor
} //end class mongoClient


module.exports = {
client: new MongoDriver()
}

 */
